import { useState, useCallback } from 'react';
import type { ModeId } from '@/mocks/assistantModes';

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

const TUTOR_UPDATE_MESSAGE =
  'O LVP Tutor está em atualização para utilizar somente conteúdos linguísticos validados. Tente novamente em breve.';

export function useGeminiChat(_modeId: ModeId): UseGeminiChatReturn {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const sendMessage = useCallback(
    async (text: string) => {
      if (!text.trim() || isLoading) return;

      setError(null);

      const userMessage: ChatMessage = {
        id: `user-${Date.now()}`,
        role: 'user',
        content: text.trim(),
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, userMessage]);
      setIsLoading(true);

      const assistantMessage: ChatMessage = {
        id: `assistant-${Date.now()}`,
        role: 'assistant',
        content: TUTOR_UPDATE_MESSAGE,
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, assistantMessage]);
      setIsLoading(false);
    },
    [isLoading],
  );

  const clearChat = useCallback(() => {
    setMessages([]);
    setError(null);
    setIsLoading(false);
  }, []);

  // No client-side key is configured or read — the Tutor no longer calls any
  // provider from the browser until the grounded server-side gateway ships.
  return { messages, isLoading, error, sendMessage, clearChat, hasApiKey: false };
}
