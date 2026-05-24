import { useState, useCallback, useRef } from 'react';
import { GoogleGenerativeAI } from '@google/generative-ai';
import type { ModeId } from '@/mocks/assistantModes';
import { getModeById } from '@/mocks/assistantModes';

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  isStreaming?: boolean;
}

interface UseGeminiChatReturn {
  messages: ChatMessage[];
  isLoading: boolean;
  error: string | null;
  sendMessage: (text: string) => Promise<void>;
  clearChat: () => void;
  hasApiKey: boolean;
}

const API_KEY = import.meta.env.VITE_GEMINI_API_KEY as string | undefined;

export function useGeminiChat(modeId: ModeId): UseGeminiChatReturn {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const abortRef = useRef(false);

  const hasApiKey = Boolean(API_KEY && API_KEY.trim() !== '' && API_KEY !== 'sua_chave_aqui');

  const sendMessage = useCallback(
    async (text: string) => {
      if (!text.trim() || isLoading) return;

      setError(null);
      abortRef.current = false;

      const userMessage: ChatMessage = {
        id: `user-${Date.now()}`,
        role: 'user',
        content: text.trim(),
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, userMessage]);
      setIsLoading(true);

      if (!hasApiKey) {
        const assistantMessage: ChatMessage = {
          id: `assistant-${Date.now()}`,
          role: 'assistant',
          content: `⚠️ **Chave de API não configurada**\n\nPara usar o Assistente IA, você precisa configurar a chave do Google Gemini:\n\n1. Acesse [aistudio.google.com](https://aistudio.google.com/) e crie uma chave gratuita\n2. Crie um arquivo \`.env\` na raiz do projeto\n3. Adicione: \`VITE_GEMINI_API_KEY=sua_chave_aqui\`\n4. Reinicie o servidor de desenvolvimento\n\nA chave é gratuita e leva menos de 2 minutos para configurar! 🚀`,
          timestamp: new Date(),
        };
        setMessages((prev) => [...prev, assistantMessage]);
        setIsLoading(false);
        return;
      }

      const assistantId = `assistant-${Date.now()}`;
      const streamingMessage: ChatMessage = {
        id: assistantId,
        role: 'assistant',
        content: '',
        timestamp: new Date(),
        isStreaming: true,
      };
      setMessages((prev) => [...prev, streamingMessage]);

      try {
        const genAI = new GoogleGenerativeAI(API_KEY!);
        const mode = getModeById(modeId);

        const model = genAI.getGenerativeModel({
          model: 'gemini-1.5-flash',
          systemInstruction: mode.systemPrompt,
        });

        const history = messages.map((msg) => ({
          role: msg.role === 'user' ? 'user' : 'model',
          parts: [{ text: msg.content }],
        }));

        const chat = model.startChat({ history });
        const result = await chat.sendMessageStream(text.trim());

        let fullText = '';
        for await (const chunk of result.stream) {
          if (abortRef.current) break;
          const chunkText = chunk.text();
          fullText += chunkText;
          setMessages((prev) =>
            prev.map((msg) =>
              msg.id === assistantId
                ? { ...msg, content: fullText, isStreaming: true }
                : msg,
            ),
          );
        }

        setMessages((prev) =>
          prev.map((msg) =>
            msg.id === assistantId
              ? { ...msg, content: fullText, isStreaming: false }
              : msg,
          ),
        );
      } catch (err) {
        const errMsg =
          err instanceof Error ? err.message : 'Erro ao conectar com a IA';
        setError(errMsg);
        setMessages((prev) =>
          prev.map((msg) =>
            msg.id === assistantId
              ? {
                  ...msg,
                  content: `❌ Erro ao processar sua mensagem: ${errMsg}\n\nTente novamente ou verifique sua chave de API.`,
                  isStreaming: false,
                }
              : msg,
          ),
        );
      } finally {
        setIsLoading(false);
      }
    },
    [messages, isLoading, modeId, hasApiKey],
  );

  const clearChat = useCallback(() => {
    abortRef.current = true;
    setMessages([]);
    setError(null);
    setIsLoading(false);
  }, []);

  return { messages, isLoading, error, sendMessage, clearChat, hasApiKey };
}
