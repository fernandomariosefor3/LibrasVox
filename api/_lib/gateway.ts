import { GoogleGenerativeAI } from "@google/generative-ai";

const TIMEOUT_MS = parseInt(process.env.GEMINI_TIMEOUT_MS || '15000', 10);

export async function generateChatResponse(messages: any[]) {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error("GEMINI_API_KEY is not defined in the environment.");
  }
  const genAI = new GoogleGenerativeAI(apiKey);
  const model = genAI.getGenerativeModel({ model: process.env.GEMINI_MODEL || "gemini-2.5-flash" });

  const formattedHistory = messages.slice(0, -1).map((msg) => ({
    role: msg.role === "user" ? "user" : "model",
    parts: [{ text: msg.content }]
  }));
  const latestMessage = messages[messages.length - 1].content;

  const chat = model.startChat({
    history: formattedHistory,
  });

  const timeoutPromise = new Promise<never>((_, reject) => {
    setTimeout(() => reject(new Error('Upstream timeout')), TIMEOUT_MS);
  });

  const result = await Promise.race([
    chat.sendMessage(latestMessage),
    timeoutPromise
  ]);

  return result.response.text();
}
