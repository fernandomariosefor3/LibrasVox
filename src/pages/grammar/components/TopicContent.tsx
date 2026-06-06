import { useState, useEffect } from 'react';
import type { GrammarTopic } from '@/mocks/grammar';
import ExampleCard from './ExampleCard';

interface TopicContentProps {
  topic: GrammarTopic;
}

export default function TopicContent({ topic }: TopicContentProps) {
  const [activeSection, setActiveSection] = useState(topic.sections[0]?.id ?? '');
  const [fadeIn, setFadeIn] = useState(true);

  useEffect(() => {
    setFadeIn(false);
    setActiveSection(topic.sections[0]?.id ?? '');
    const t = setTimeout(() => setFadeIn(true), 80);
    return () => clearTimeout(t);
  }, [topic.id]);

  const section = topic.sections.find((s) => s.id === activeSection) ?? topic.sections[0];

  return (
    <div className={`transition-all duration-400 ${fadeIn ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
      {/* Topic header */}
      <div className={`rounded-2xl border-2 ${topic.border} ${topic.bg} p-6 mb-6`}>
        <div className="flex items-start gap-4">
          <div
            className={`w-14 h-14 flex items-center justify-center rounded-2xl bg-gradient-to-br ${topic.gradient} flex-shrink-0`}
          >
            <i className={`${topic.icon} text-white text-2xl`}></i>
          </div>
          <div className="flex-1">
            <h2
              className={`text-2xl font-extrabold ${topic.color} mb-1`}
             
            >
              {topic.title}
            </h2>
            <p className="text-sm text-slate-500 font-medium mb-3">{topic.subtitle}</p>
            <p className="text-sm text-slate-700 leading-relaxed">{topic.summary}</p>
          </div>
        </div>

        {/* References */}
        <div className="mt-4 pt-4 border-t border-slate-200/60">
          <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">
            Referências
          </p>
          <div className="flex flex-wrap gap-2">
            {topic.references.map((ref) => (
              <span
                key={ref}
                className="text-xs text-slate-500 bg-white border border-slate-200 rounded-full px-3 py-1 font-mono"
              >
                {ref}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Section tabs */}
      <div className="flex flex-wrap gap-2 mb-6">
        {topic.sections.map((sec) => (
          <button
            key={sec.id}
            onClick={() => setActiveSection(sec.id)}
            className={`px-4 py-2 rounded-xl text-sm font-semibold border transition-all duration-200 cursor-pointer whitespace-nowrap ${
              activeSection === sec.id
                ? `${topic.bg} ${topic.color} ${topic.border}`
                : 'bg-white text-slate-500 border-slate-200 hover:border-slate-300'
            }`}
          >
            {sec.title}
          </button>
        ))}
      </div>

      {/* Section content */}
      {section && (
        <div className="space-y-5">
          {/* Main text */}
          <div className="bg-white rounded-2xl border border-slate-200 p-6">
            <h3
              className="text-lg font-bold text-slate-900 mb-3"
             
            >
              {section.title}
            </h3>
            <p className="text-sm text-slate-700 leading-relaxed">{section.content}</p>

            {/* Highlight box */}
            {section.highlight && (
              <div className={`mt-4 flex items-start gap-3 ${topic.bg} border ${topic.border} rounded-xl px-4 py-3`}>
                <div className={`w-7 h-7 flex items-center justify-center rounded-lg bg-gradient-to-br ${topic.gradient} flex-shrink-0`}>
                  <i className="ri-lightbulb-flash-line text-white text-sm"></i>
                </div>
                <p className={`text-sm font-semibold ${topic.color} leading-relaxed`}>
                  {section.highlight}
                </p>
              </div>
            )}
          </div>

          {/* Items list */}
          {section.items && section.items.length > 0 && (
            <div className="bg-white rounded-2xl border border-slate-200 p-6">
              <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4">
                Conceitos-chave
              </p>
              <div className="space-y-3">
                {section.items.map((item, idx) => (
                  <div
                    key={idx}
                    className={`flex items-start gap-3 p-4 rounded-xl ${topic.bg} border ${topic.border}`}
                  >
                    <div
                      className={`w-9 h-9 flex items-center justify-center rounded-xl bg-gradient-to-br ${topic.gradient} flex-shrink-0`}
                    >
                      {item.icon ? (
                        <i className={`${item.icon} text-white text-sm`}></i>
                      ) : (
                        <span className="text-white text-xs font-bold">{idx + 1}</span>
                      )}
                    </div>
                    <div>
                      <p className={`text-sm font-bold ${topic.color} mb-0.5`}>{item.label}</p>
                      <p className="text-sm text-slate-600 leading-relaxed">{item.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Examples */}
          {section.examples && section.examples.length > 0 && (
            <div className="bg-white rounded-2xl border border-slate-200 p-6">
              <ExampleCard
                examples={section.examples}
                color={topic.color}
                bg={topic.bg}
                border={topic.border}
              />
            </div>
          )}
        </div>
      )}
    </div>
  );
}
