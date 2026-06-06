import { Link } from 'react-router-dom';
import type { CourseLevel } from '@/mocks/courses';
import { levelInfo, courseModules } from '@/mocks/courses';

interface LevelCardProps {
  level: CourseLevel;
  isActive: boolean;
  onClick: () => void;
}

export default function LevelCard({ level, isActive, onClick }: LevelCardProps) {
  const info = levelInfo[level];
  const modules = courseModules.filter((m) => m.level === level);

  return (
    <button
      onClick={onClick}
      className={`w-full text-left rounded-2xl border-2 p-6 transition-all duration-300 cursor-pointer ${
        isActive
          ? `${info.border} ${info.bg}`
          : 'border-slate-200 bg-white hover:border-slate-300'
      }`}
    >
      <div className="flex items-start gap-4">
        <div
          className={`w-12 h-12 flex items-center justify-center rounded-xl flex-shrink-0 bg-gradient-to-br ${info.gradient}`}
        >
          <i className={`${info.icon} text-white text-xl`}></i>
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <span className={`text-xs font-bold uppercase tracking-widest ${info.color}`}>
              Nível
            </span>
            <span className={`text-xs px-2 py-0.5 rounded-full font-semibold ${info.badge}`}>
              {info.label}
            </span>
          </div>
          <p className="text-sm text-slate-600 leading-snug">{info.description}</p>
          <div className="flex items-center gap-4 mt-3">
            <span className="flex items-center gap-1 text-xs text-slate-500">
              <i className="ri-book-2-line"></i>
              {info.modules} módulos
            </span>
            <span className="flex items-center gap-1 text-xs text-slate-500">
              <i className="ri-time-line"></i>
              {info.hours}
            </span>
          </div>
        </div>
        {isActive && (
          <div className={`w-2 h-2 rounded-full mt-1 flex-shrink-0 bg-gradient-to-br ${info.gradient}`}></div>
        )}
      </div>
    </button>
  );
}
