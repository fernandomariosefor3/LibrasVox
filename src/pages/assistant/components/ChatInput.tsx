import { useState, useRef, useEffect } from 'react';
import type { AssistantMode } from '@/mocks/assistantModes';

interface ChatInputProps {
  mode: AssistantMode;
  onSend: (text: string) => void;
  isLoading: boolean;
  disabled?: boolean;
}

export default function ChatInput({ mode, onSend, isLoading, disabled }: ChatInputProps) {
  const [value, setValue] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const recognitionRef = useRef<SpeechRecognition | null>(null);

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 160)}px`;
    }
  }, [value]);

  const handleSend = () => {
    if (!value.trim() || isLoading || disabled) return;
    onSend(value.trim());
    setValue('');
    if (textareaRef.current) textareaRef.current.style.height = 'auto';
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleVoice = () => {
    if (!('webkitSpeechRecognition' in window || 'SpeechRecognition' in window)) return;

    if (isListening) {
      recognitionRef.current?.stop();
      setIsListening(false);
      return;
    }

    const SpeechRecognitionAPI =
      (window as typeof window & { webkitSpeechRecognition?: typeof SpeechRecognition })
        .webkitSpeechRecognition || window.SpeechRecognition;
    const recognition = new SpeechRecognitionAPI();
    recognition.lang = 'pt-BR';
    recognition.continuous = false;
    recognition.interimResults = false;

    recognition.onresult = (event: SpeechRecognitionEvent) => {
      const transcript = event.results[0][0].transcript;
      setValue((prev) => prev + (prev ? ' ' : '') + transcript);
      setIsListening(false);
    };

    recognition.onerror = () => setIsListening(false);
    recognition.onend = () => setIsListening(false);

    recognition.start();
    recognitionRef.current = recognition;
    setIsListening(true);
  };

  const canSend = value.trim().length > 0 && !isLoading && !disabled;
  const charCount = value.length;

  return (
    <div className="relative">
      {/* Listening indicator */}
      {isListening && (
        <div className="absolute -top-10 left-0 right-0 flex justify-center">
          <div className="flex items-center gap-2 bg-red-50 border border-red-200 rounded-full px-3 py-1.5 text-xs text-red-600 font-medium animate-pulse">
            <span className="w-2 h-2 bg-red-500 rounded-full animate-ping"></span>
            Ouvindo...
          </div>
        </div>
      )}

      <div
        className={`flex items-end gap-2 bg-white border-2 rounded-2xl px-3 py-2 transition-all duration-300 ${
          disabled
            ? 'opacity-50 border-slate-200'
            : isFocused
            ? `border-emerald-400 shadow-sm`
            : `${mode.borderColor} hover:border-emerald-300`
        }`}
      >
        <textarea
          ref={textareaRef}
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onKeyDown={handleKeyDown}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          placeholder={
            disabled
              ? 'Configure a API Key para usar o chat...'
              : `Pergunte ao ${mode.label}... (Enter para enviar)`
          }
          disabled={isLoading || disabled}
          rows={1}
          className="flex-1 resize-none bg-transparent outline-none text-sm text-slate-700 placeholder:text-slate-400 leading-relaxed py-1.5 max-h-40 disabled:cursor-not-allowed"
          style={{ fontFamily: 'inherit' }}
        />

        <div className="flex items-center gap-1 pb-1 flex-shrink-0">
          {/* Char count */}
          {charCount > 0 && (
            <span className="text-xs text-slate-300 mr-1 tabular-nums">{charCount}</span>
          )}

          {/* Voice button */}
          <button
            onClick={handleVoice}
            className={`w-8 h-8 flex items-center justify-center rounded-xl transition-all duration-200 cursor-pointer ${
              isListening
                ? 'bg-red-100 text-red-500 scale-110'
                : 'text-slate-400 hover:text-slate-600 hover:bg-slate-100'
            }`}
            title="Falar"
          >
            <i className={`${isListening ? 'ri-mic-fill' : 'ri-mic-line'} text-base`}></i>
          </button>

          {/* Send button */}
          <button
            onClick={handleSend}
            disabled={!canSend}
            className={`w-8 h-8 flex items-center justify-center rounded-xl transition-all duration-200 cursor-pointer ${
              canSend
                ? 'bg-gradient-to-br from-emerald-500 to-teal-500 text-white hover:scale-105 active:scale-95'
                : 'bg-slate-100 text-slate-300 cursor-not-allowed'
            }`}
            title="Enviar (Enter)"
          >
            {isLoading ? (
              <i className="ri-loader-4-line text-sm animate-spin"></i>
            ) : (
              <i className="ri-send-plane-fill text-sm"></i>
            )}
          </button>
        </div>
      </div>

      <p className="text-xs text-slate-400 text-center mt-2">
        Pressione{' '}
        <kbd className="bg-slate-100 px-1.5 py-0.5 rounded text-xs font-mono">Enter</kbd> para
        enviar,{' '}
        <kbd className="bg-slate-100 px-1.5 py-0.5 rounded text-xs font-mono">Shift+Enter</kbd>{' '}
        para nova linha
      </p>
    </div>
  );
}
