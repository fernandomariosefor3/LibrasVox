import { GoogleGenAI } from "@google/genai";

const TIMEOUT_MS = parseInt(process.env.GEMINI_TIMEOUT_MS || '15000', 10);

export async function generateChatResponse(messages: any[]) {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    const err = new Error("GEMINI_API_KEY is not defined in the environment.");
    (err as any).status = 401;
    throw err;
  }
  
  const ai = new GoogleGenAI({ apiKey });
  
  const contents = messages.map((msg) => ({
    role: msg.role === "user" ? "user" : "model",
    parts: [{ text: msg.content }]
  }));

  const timeoutPromise = new Promise<never>((_, reject) => {
    setTimeout(() => reject(new Error('Upstream timeout')), TIMEOUT_MS);
  });

  const response = await Promise.race([
    ai.models.generateContent({
      model: process.env.GEMINI_MODEL || "gemini-2.5-flash",
      contents,
    }),
    timeoutPromise
  ]);

  return response.text;
}
