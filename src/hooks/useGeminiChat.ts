import { useState, useCallback, useRef } from 'react';
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
}

export function useGeminiChat(modeId: ModeId): UseGeminiChatReturn {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const abortRef = useRef(false);

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

      const newMessages = [...messages, userMessage];
      setMessages(newMessages);
      setIsLoading(true);

      const assistantId = `assistant-${Date.now()}`;
      const placeholderMessage: ChatMessage = {
        id: assistantId,
        role: 'assistant',
        content: '...',
        timestamp: new Date(),
        isStreaming: true,
      };
      setMessages((prev) => [...prev, placeholderMessage]);

      try {
        const mode = getModeById(modeId);

        // Send only the actual conversation to the backend
        const historyToSend = newMessages.map((msg) => ({
          role: msg.role,
          content: msg.content,
        }));

        const response = await fetch('/api/assistant', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ modeId, messages: historyToSend }),
        });

        if (!response.ok) {
          throw new Error('Falha na resposta da IA');
        }

        const data = await response.json();
        const fullText = data.reply;

        if (abortRef.current) return;

        setMessages((prev) =>
          prev.map((msg) =>
            msg.id === assistantId
              ? { ...msg, content: fullText, isStreaming: false }
              : msg,
          ),
        );
      } catch (err) {
        if (abortRef.current) return;
        const errMsg =
          err instanceof Error ? err.message : 'Erro ao conectar com a IA';
        setError(errMsg);
        setMessages((prev) =>
          prev.map((msg) =>
            msg.id === assistantId
              ? {
                  ...msg,
                  content: `❌ Erro ao processar sua mensagem: ${errMsg}\n\nTente novamente.`,
                  isStreaming: false,
                }
              : msg,
          ),
        );
      } finally {
        setIsLoading(false);
      }
    },
    [messages, isLoading, modeId],
  );

  const clearChat = useCallback(() => {
    abortRef.current = true;
    setMessages([]);
    setError(null);
    setIsLoading(false);
  }, []);

  return { messages, isLoading, error, sendMessage, clearChat };
}
