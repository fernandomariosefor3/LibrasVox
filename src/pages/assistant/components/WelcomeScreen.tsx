import { useEffect, useState } from 'react';
import type { AssistantMode } from '@/mocks/assistantModes';

interface WelcomeScreenProps {
  mode: AssistantMode;
  onSuggestion: (text: string) => void;
}

export default function WelcomeScreen({ mode, onSuggestion }: WelcomeScreenProps) {
  const [visible, setVisible] = useState(false);
  const [cardsVisible, setCardsVisible] = useState(false);

  useEffect(() => {
    setVisible(false);
    setCardsVisible(false);
    const t1 = setTimeout(() => setVisible(true), 60);
    const t2 = setTimeout(() => setCardsVisible(true), 300);
    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
    };
  }, [mode.id]);

  return (
    <div className="flex flex-col items-center justify-center h-full px-4 py-8 text-center">
      {/* Icon with pulse ring */}
      <div
        className={`relative mb-6 transition-all duration-700 ${
          visible ? 'opacity-100 translate-y-0 scale-100' : 'opacity-0 translate-y-6 scale-90'
        }`}
      >
        <div className={`absolute inset-0 rounded-3xl ${mode.bgColor} animate-ping opacity-30`} />
        <div
          className={`relative w-24 h-24 flex items-center justify-center ${mode.bgColor} rounded-3xl border-2 ${mode.borderColor}`}
        >
          <i className={`${mode.icon} ${mode.color} text-5xl`}></i>
        </div>
      </div>

      {/* Title */}
      <div
        className={`transition-all duration-700 delay-100 ${
          visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
        }`}
      >
        <h2
          className="text-2xl font-bold text-slate-900 mb-2"
         
        >
          {mode.welcomeTitle}
        </h2>
        <p className="text-slate-500 text-sm max-w-sm leading-relaxed mb-6">
          {mode.welcomeSubtitle}
        </p>
      </div>

      {/* API Key warning removed */}

      {/* Suggestions */}
      <div className="w-full max-w-lg">
        <p
          className={`text-xs font-semibold text-slate-400 uppercase tracking-widest mb-3 transition-all duration-500 delay-200 ${
            cardsVisible ? 'opacity-100' : 'opacity-0'
          }`}
        >
          Sugestões para começar
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          {mode.suggestions.map((suggestion, idx) => (
            <button
              key={idx}
              onClick={() => onSuggestion(suggestion)}
              style={{ transitionDelay: `${200 + idx * 80}ms` }}
              className={`group text-left text-sm px-4 py-3.5 rounded-xl border ${mode.borderColor} ${mode.bgColor} hover:shadow-sm active:scale-95 transition-all duration-300 cursor-pointer font-medium leading-tight ${
                cardsVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-3'
              }`}
            >
              <div className="flex items-start gap-2">
                <i className={`ri-arrow-right-up-line ${mode.color} text-base mt-0.5 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform duration-200`}></i>
                <span className={mode.color}>{suggestion}</span>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Powered by badge */}
      <div
        className={`mt-8 flex items-center gap-2 text-xs text-slate-400 transition-all duration-700 delay-500 ${
          cardsVisible ? 'opacity-100' : 'opacity-0'
        }`}
      >
        <i className="ri-sparkling-2-line text-sm"></i>
        <span>Powered by Google Gemini</span>
      </div>
    </div>
  );
}
