import type { VercelRequest, VercelResponse } from "@vercel/node";
import { generateChatResponse } from "./_lib/gateway";

// Note: In-memory rate limiting is only a basic protection in serverless environments,
// as each instance will maintain its own state. A distributed cache like Redis is required for strict limits.
const rateLimitMap = new Map<string, { count: number, resetAt: number }>();
const RATE_LIMIT_MAX = parseInt(process.env.ASSISTANT_RATE_LIMIT_MAX || '10', 10);
const RATE_LIMIT_WINDOW_MS = parseInt(process.env.ASSISTANT_RATE_LIMIT_WINDOW_MS || '60000', 10);

const MAX_MESSAGES = 20;
const MAX_MESSAGE_LENGTH = 1000;
const MAX_TOTAL_LENGTH = 10000;

function checkRateLimit(ip: string): { allowed: boolean, retryAfter?: number } {
  const now = Date.now();
  const entry = rateLimitMap.get(ip);
  if (!entry || entry.resetAt < now) {
    rateLimitMap.set(ip, { count: 1, resetAt: now + RATE_LIMIT_WINDOW_MS });
    return { allowed: true };
  }
  if (entry.count >= RATE_LIMIT_MAX) {
    return { allowed: false, retryAfter: Math.ceil((entry.resetAt - now) / 1000) };
  }
  entry.count++;
  return { allowed: true };
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const clientIp = (req.headers['x-forwarded-for'] as string) || req.socket?.remoteAddress || 'unknown';
  const { allowed, retryAfter } = checkRateLimit(clientIp);
  
  if (!allowed) {
    res.setHeader('Retry-After', retryAfter!.toString());
    return res.status(429).json({ error: "Too many requests" });
  }

  try {
    const { messages } = req.body;
    if (!Array.isArray(messages) || messages.length === 0) {
      return res.status(400).json({ error: "Messages must be a non-empty array" });
    }

    if (messages.length > MAX_MESSAGES) {
      return res.status(413).json({ error: "Too many messages" });
    }

    let totalLength = 0;
    for (const msg of messages) {
      if (!msg || typeof msg !== 'object') {
        return res.status(400).json({ error: "Invalid message format" });
      }
      if (msg.role !== 'user' && msg.role !== 'assistant') {
        return res.status(400).json({ error: "Invalid role" });
      }
      if (typeof msg.content !== 'string' || msg.content.trim() === '') {
        return res.status(400).json({ error: "Message content must be non-empty string" });
      }
      if (msg.content.length > MAX_MESSAGE_LENGTH) {
        return res.status(413).json({ error: "Message exceeds maximum length" });
      }
      totalLength += msg.content.length;
    }

    if (totalLength > MAX_TOTAL_LENGTH) {
      return res.status(413).json({ error: "Total request payload too large" });
    }

    const reply = await generateChatResponse(messages);
    return res.status(200).json({ reply });
  } catch (error: any) {
    if (error.message === 'Upstream timeout') {
      return res.status(504).json({ error: "Gateway timeout" });
    }
    // Safe upstream error response - do not expose provider errors or internal stack traces
    return res.status(500).json({ error: "Internal Server Error" });
  }
}
