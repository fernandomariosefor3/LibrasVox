import { useState, useEffect, useRef } from 'react';
import type { ChatMessage as ChatMessageType } from '@/hooks/useGeminiChat';
import type { AssistantMode } from '@/mocks/assistantModes';

interface ChatMessageProps {
  message: ChatMessageType;
  mode: AssistantMode;
}

function formatMarkdown(text: string): string {
  return text
    .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
    .replace(/\*(.*?)\*/g, '<em>$1</em>')
    .replace(/`(.*?)`/g, '<code class="bg-slate-100 px-1.5 py-0.5 rounded text-sm font-mono text-slate-700">$1</code>')
    .replace(/\n\n/g, '</p><p class="mb-2">')
    .replace(/\n/g, '<br/>')
    .replace(/^- (.+)$/gm, '<li class="ml-4 list-disc">$1</li>')
    .replace(/^\d+\. (.+)$/gm, '<li class="ml-4 list-decimal">$1</li>')
    .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" target="_blank" rel="noopener noreferrer" class="text-emerald-600 underline hover:text-emerald-700">$1</a>');
}

function TypingDots({ color }: { color: string }) {
  return (
    <span className="inline-flex gap-1 items-center ml-1">
      {[0, 150, 300].map((delay) => (
        <span
          key={delay}
          className={`w-1.5 h-1.5 rounded-full ${color} animate-bounce`}
          style={{ animationDelay: `${delay}ms` }}
        />
      ))}
    </span>
  );
}

export default function ChatMessage({ message, mode }: ChatMessageProps) {
  const [copied, setCopied] = useState(false);
  const [mounted, setMounted] = useState(false);
  const isUser = message.role === 'user';
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const t = setTimeout(() => setMounted(true), 30);
    return () => clearTimeout(t);
  }, []);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(message.content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleTTS = () => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(message.content);
      utterance.lang = 'pt-BR';
      utterance.rate = 0.9;
      window.speechSynthesis.speak(utterance);
    }
  };

  if (isUser) {
    return (
      <div
        ref={ref}
        className={`flex justify-end mb-4 transition-all duration-400 ${
          mounted ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-6'
        }`}
      >
        <div className="max-w-[80%] lg:max-w-[65%]">
          <div className="bg-gradient-to-br from-emerald-500 to-teal-500 text-white rounded-2xl rounded-tr-sm px-4 py-3">
            <p className="text-sm leading-relaxed">{message.content}</p>
          </div>
          <p className="text-xs text-slate-400 mt-1 text-right">
            {message.timestamp.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}
          </p>
        </div>
        <div className="w-8 h-8 flex items-center justify-center bg-gradient-to-br from-emerald-100 to-teal-100 rounded-full ml-2 flex-shrink-0 mt-1">
          <i className="ri-user-3-line text-emerald-600 text-sm"></i>
        </div>
      </div>
    );
  }

  return (
    <div
      ref={ref}
      className={`flex items-start mb-4 group transition-all duration-400 ${
        mounted ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-6'
      }`}
    >
      {/* Avatar */}
      <div
        className={`w-8 h-8 flex items-center justify-center ${mode.bgColor} border ${mode.borderColor} rounded-full mr-2 flex-shrink-0 mt-1`}
      >
        <i className={`${mode.icon} ${mode.color} text-sm`}></i>
      </div>

      <div className="flex-1 min-w-0">
        {/* Header */}
        <div className="flex items-center gap-2 mb-1">
          <span className={`text-xs font-semibold ${mode.color}`}>
            LVP {mode.label}
          </span>
          <span className="text-xs text-slate-400">
            {message.timestamp.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}
          </span>
          {message.isStreaming && (
            <TypingDots color="bg-slate-400" />
          )}
        </div>

        {/* Bubble */}
        <div
          className={`${mode.bgColor} border ${mode.borderColor} rounded-2xl rounded-tl-sm px-4 py-3 max-w-[85%] lg:max-w-[75%] transition-all duration-300`}
        >
          {message.isStreaming && message.content.length === 0 ? (
            <div className="flex items-center gap-1 py-1">
              <span className="text-xs text-slate-400 mr-1">Digitando</span>
              <TypingDots color="bg-slate-400" />
            </div>
          ) : (
            <div
              className="text-sm text-slate-700 leading-relaxed prose-sm"
              dangerouslySetInnerHTML={{
                __html: `<p class="mb-2">${formatMarkdown(message.content)}</p>`,
              }}
            />
          )}
        </div>

        {/* Actions */}
        {!message.isStreaming && (
          <div className="flex items-center gap-2 mt-1.5 opacity-0 group-hover:opacity-100 transition-all duration-200">
            <button
              onClick={handleCopy}
              className="flex items-center gap-1 text-xs text-slate-400 hover:text-slate-600 transition-colors cursor-pointer px-2 py-1 rounded-lg hover:bg-slate-100"
            >
              <i
                className={`${copied ? 'ri-check-line text-emerald-500' : 'ri-file-copy-line'} text-sm`}
              ></i>
              {copied ? 'Copiado!' : 'Copiar'}
            </button>
            <button
              onClick={handleTTS}
              className="flex items-center gap-1 text-xs text-slate-400 hover:text-slate-600 transition-colors cursor-pointer px-2 py-1 rounded-lg hover:bg-slate-100"
            >
              <i className="ri-volume-up-line text-sm"></i>
              Ouvir
            </button>
          </div>
        )}
      </div>
    </div>
  );
}