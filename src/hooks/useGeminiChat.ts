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
  /**
   * @deprecated Mantido só por compatibilidade com WelcomeScreen.tsx. Não
   * indica que existe uma chave configurada no navegador — o Tutor nunca
   * lê chave nenhuma no cliente. Será substituído por um estado real de
   * disponibilidade do serviço (ex.: hasGroundedContent) numa fase futura.
   */
  hasApiKey: boolean;
}

interface AssistantApiResponse {
  ok: boolean;
  answer: string;
  grounded: boolean;
  evidenceIds: string[];
  corpusVersion: string;
  category: string;
  refusal: { required: boolean; code: string | null; message: string | null };
  provider: { called: boolean; name: string | null };
}

const NETWORK_ERROR_MESSAGE = 'Não foi possível conectar ao LVP Tutor agora. Tente novamente em instantes.';

export function useGeminiChat(modeId: ModeId): UseGeminiChatReturn {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const sendMessage = useCallback(
    async (text: string) => {
      if (!text.trim() || isLoading) return;

      setError(null);

      const trimmed = text.trim();
      const userMessage: ChatMessage = {
        id: `user-${Date.now()}`,
        role: 'user',
        content: trimmed,
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, userMessage]);
      setIsLoading(true);

      try {
        // Só a pergunta atual é enviada — o servidor avalia cada mensagem
        // de forma independente nesta fase, sem memória de turnos
        // anteriores. Nenhum SDK, chave ou prompt é montado aqui.
        const response = await fetch('/api/assistant', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            modeId,
            messages: [{ role: 'user', content: trimmed }],
          }),
        });

        // O servidor sempre devolve um envelope AssistantResponse com
        // answer seguro, mesmo em 429/500/503/400 — response.ok (2xx) não
        // é o sinal certo para decidir se há texto para mostrar. Só cai no
        // catch quando o corpo nem é JSON válido (falha de rede de
        // verdade) ou quando o fetch em si rejeita.
        const data = (await response.json()) as AssistantApiResponse;

        // refusal.required (incluindo RATE_LIMITED/PROVIDER_UNAVAILABLE/
        // INTERNAL_ERROR/NO_VALIDATED_CONTENT/OUT_OF_SCOPE) é tratado como
        // resposta válida do Tutor, não como erro visual — data.answer já
        // contém o texto seguro certo para cada caso, nunca um código
        // técnico ou detalhe interno.
        const assistantMessage: ChatMessage = {
          id: `assistant-${Date.now()}`,
          role: 'assistant',
          content: data.answer,
          timestamp: new Date(),
        };
        setMessages((prev) => [...prev, assistantMessage]);
      } catch {
        const assistantMessage: ChatMessage = {
          id: `assistant-${Date.now()}`,
          role: 'assistant',
          content: NETWORK_ERROR_MESSAGE,
          timestamp: new Date(),
        };
        setMessages((prev) => [...prev, assistantMessage]);
        setError(NETWORK_ERROR_MESSAGE);
      } finally {
        setIsLoading(false);
      }
    },
    [isLoading, modeId],
  );

  const clearChat = useCallback(() => {
    setMessages([]);
    setError(null);
    setIsLoading(false);
  }, []);

  return { messages, isLoading, error, sendMessage, clearChat, hasApiKey: false };
}
