import { useState, useEffect } from 'react';
import type { CourseModule } from '@/mocks/courses';
import { levelInfo } from '@/mocks/courses';

interface ModuleCardProps {
  module: CourseModule;
  index: number;
  isCompleted: boolean;
  isLocked: boolean;
  visible: boolean;
}

const lessonTypeIcon: Record<string, string> = {
  video: 'ri-play-circle-line',
  leitura: 'ri-article-line',
  exercicio: 'ri-pencil-ruler-2-line',
  quiz: 'ri-question-answer-line',
};

const lessonTypeLabel: Record<string, string> = {
  video: 'Vídeo',
  leitura: 'Leitura',
  exercicio: 'Exercício',
  quiz: 'Quiz',
};

export default function ModuleCard({ module, index, isCompleted, isLocked, visible }: ModuleCardProps) {
  const [expanded, setExpanded] = useState(false);
  const info = levelInfo[module.level];

  return (
    <div
      className={`rounded-2xl border-2 bg-white overflow-hidden transition-all duration-500 ${
        visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'
      } ${isLocked ? 'border-slate-200 opacity-60' : `${info.border}`}`}
      style={{ transitionDelay: `${index * 80}ms` }}
    >
      {/* Header */}
      <button
        onClick={() => !isLocked && setExpanded((e) => !e)}
        className={`w-full flex items-start gap-4 p-5 text-left transition-colors duration-200 ${
          isLocked ? 'cursor-not-allowed' : 'cursor-pointer hover:bg-slate-50'
        }`}
      >
        {/* Number / status */}
        <div
          className={`w-10 h-10 flex items-center justify-center rounded-xl flex-shrink-0 font-bold text-sm ${
            isCompleted
              ? `bg-gradient-to-br ${info.gradient} text-white`
              : isLocked
              ? 'bg-slate-100 text-slate-400'
              : `${info.bg} ${info.color} border ${info.border}`
          }`}
        >
          {isCompleted ? (
            <i className="ri-check-line text-base"></i>
          ) : isLocked ? (
            <i className="ri-lock-line text-base"></i>
          ) : (
            module.order
          )}
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap mb-1">
            <h3
              className="text-base font-bold text-slate-900"
              style={{ fontFamily: 'Plus Jakarta Sans, sans-serif' }}
            >
              {module.title}
            </h3>
            {isCompleted && (
              <span className={`text-xs px-2 py-0.5 rounded-full font-semibold ${info.badge}`}>
                Concluído
              </span>
            )}
          </div>
          <p className="text-xs text-slate-500 font-medium mb-1">{module.subtitle}</p>
          <p className="text-sm text-slate-600 leading-snug line-clamp-2">{module.description}</p>
          <div className="flex items-center gap-4 mt-2">
            <span className="flex items-center gap-1 text-xs text-slate-400">
              <i className="ri-book-2-line"></i>
              {module.lessons.length} aulas
            </span>
            <span className="flex items-center gap-1 text-xs text-slate-400">
              <i className="ri-time-line"></i>
              {module.totalDuration}
            </span>
            <span className="flex items-center gap-1 text-xs text-slate-400">
              <i className="ri-arrow-right-circle-line"></i>
              Pré-req: {module.prerequisites}
            </span>
          </div>
        </div>

        <div className="flex-shrink-0 mt-1">
          <i
            className={`ri-arrow-down-s-line text-slate-400 text-xl transition-transform duration-300 ${
              expanded ? 'rotate-180' : ''
            }`}
          ></i>
        </div>
      </button>

      {/* Expanded: objectives + lessons */}
      {expanded && !isLocked && (
        <div className={`border-t ${info.border} ${info.bg} px-5 py-4`}>
          {/* Objectives */}
          <div className="mb-4">
            <p className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">
              Objetivos de Aprendizagem
            </p>
            <ul className="space-y-1.5">
              {module.objectives.map((obj, i) => (
                <li key={i} className="flex items-start gap-2 text-sm text-slate-700">
                  <i className={`ri-checkbox-circle-line ${info.color} text-base mt-0.5 flex-shrink-0`}></i>
                  {obj}
                </li>
              ))}
            </ul>
          </div>

          {/* Lessons */}
          <div>
            <p className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">
              Conteúdo do Módulo
            </p>
            <div className="space-y-2">
              {module.lessons.map((lesson, li) => (
                <div
                  key={lesson.id}
                  className="flex items-center gap-3 bg-white rounded-xl px-4 py-3 border border-slate-100"
                >
                  <div
                    className={`w-7 h-7 flex items-center justify-center rounded-lg flex-shrink-0 ${info.bg} border ${info.border}`}
                  >
                    <i className={`${lessonTypeIcon[lesson.type]} ${info.color} text-sm`}></i>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-slate-800 truncate">{lesson.title}</p>
                    <p className="text-xs text-slate-400 truncate">{lesson.description}</p>
                  </div>
                  <div className="flex items-center gap-2 flex-shrink-0">
                    <span className={`text-xs px-2 py-0.5 rounded-full ${info.badge} font-medium`}>
                      {lessonTypeLabel[lesson.type]}
                    </span>
                    <span className="text-xs text-slate-400 whitespace-nowrap">{lesson.duration}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* CTA */}
          <button
            className={`mt-4 w-full flex items-center justify-center gap-2 py-3 rounded-xl text-white text-sm font-bold bg-gradient-to-r ${info.gradient} hover:opacity-90 active:scale-95 transition-all duration-200 cursor-pointer`}
          >
            <i className="ri-play-circle-line text-base"></i>
            Iniciar Módulo
          </button>
        </div>
      )}
    </div>
  );
}
