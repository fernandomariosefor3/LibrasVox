import { useState } from 'react';
import type { Badge } from '@/hooks/useBadges';

interface BadgesPanelProps {
  badges: Badge[];
}

const CATEGORY_LABELS: Record<string, string> = {
  streak: 'Sequência',
  cards: 'Deck',
  session: 'Sessão',
  mastery: 'Domínio',
};

const CATEGORY_ICONS: Record<string, string> = {
  streak: 'ri-fire-line',
  cards: 'ri-stack-line',
  session: 'ri-flashlight-line',
  mastery: 'ri-trophy-line',
};

const CATEGORY_COLORS: Record<string, string> = {
  streak: 'text-red-600 bg-red-50 border-red-200',
  cards: 'text-sky-600 bg-sky-50 border-sky-200',
  session: 'text-orange-600 bg-orange-50 border-orange-200',
  mastery: 'text-emerald-600 bg-emerald-50 border-emerald-200',
};

export default function BadgesPanel({ badges }: BadgesPanelProps) {
  const [filter, setFilter] = useState<string>('all');

  const unlockedCount = badges.filter((b) => !b.locked).length;
  const totalCount = badges.length;
  const percentage = Math.round((unlockedCount / totalCount) * 100);

  const filtered = filter === 'all'
    ? badges
    : badges.filter((b) => b.category === filter);

  const sorted = [...filtered].sort((a, b) => {
    if (a.locked !== b.locked) return a.locked ? 1 : -1;
    return a.name.localeCompare(b.name);
  });

  const categories = ['all', 'streak', 'cards', 'session', 'mastery'];

  return (
    <div>
      {/* Header stats */}
      <div className="bg-gradient-to-r from-slate-800 to-slate-900 rounded-2xl p-6 md:p-8 mb-8">
        <div className="flex flex-col md:flex-row md:items-center gap-6">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 flex items-center justify-center bg-white/10 rounded-xl">
              <i className="ri-trophy-line text-amber-400 text-2xl"></i>
            </div>
            <div>
              <p className="text-2xl font-bold text-white">{unlockedCount}<span className="text-slate-400 text-lg">/{totalCount}</span></p>
              <p className="text-xs text-slate-400 font-medium">Conquistas desbloqueadas</p>
            </div>
          </div>
          <div className="flex-1">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-semibold text-slate-400">Progresso</span>
              <span className="text-xs font-bold text-amber-400">{percentage}%</span>
            </div>
            <div className="h-2.5 bg-slate-700/50 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-amber-400 to-orange-400 rounded-full transition-all duration-700"
                style={{ width: `${percentage}%` }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Category filters */}
      <div className="flex gap-2 mb-6 overflow-x-auto pb-1">
        {categories.map((cat) => {
          const isAll = cat === 'all';
          const label = isAll ? 'Todas' : CATEGORY_LABELS[cat];
          const icon = isAll ? 'ri-apps-line' : CATEGORY_ICONS[cat];
          const colorClass = isAll
            ? filter === 'all'
              ? 'bg-slate-800 text-white border-slate-800'
              : 'bg-white text-slate-500 border-slate-200'
            : CATEGORY_COLORS[cat];

          return (
            <button
              key={cat}
              onClick={() => setFilter(cat)}
              className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold border transition-all cursor-pointer whitespace-nowrap flex-shrink-0 ${
                filter === cat
                  ? isAll
                    ? 'bg-slate-800 text-white border-slate-800'
                    : colorClass
                  : 'bg-white text-slate-500 border-slate-200 hover:border-slate-300'
              }`}
            >
              <i className={`${icon} text-sm`}></i>
              {label}
              {!isAll && (
                <span className="text-[10px] font-bold opacity-70">
                  {badges.filter((b) => b.category === cat && !b.locked).length}/{badges.filter((b) => b.category === cat).length}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Badges grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {sorted.map((badge) => {
          const isLocked = badge.locked;
          return (
            <div
              key={badge.id}
              className={`relative p-5 rounded-2xl border transition-all duration-300 ${
                isLocked
                  ? 'bg-slate-50 border-slate-200 opacity-60'
                  : `${badge.bgColor} ${badge.borderColor} opacity-100`
              }`}
            >
              {isLocked && (
                <div className="absolute top-4 right-4 w-7 h-7 flex items-center justify-center bg-slate-200/80 rounded-lg">
                  <i className="ri-lock-line text-slate-400 text-xs"></i>
                </div>
              )}
              <div className="flex items-start gap-4">
                <div
                  className={`w-12 h-12 flex items-center justify-center rounded-xl flex-shrink-0 ${
                    isLocked ? 'bg-slate-200' : 'bg-white border ' + badge.borderColor
                  }`}
                >
                  <i
                    className={`${badge.icon} text-xl ${
                      isLocked ? 'text-slate-400' : badge.iconColor
                    }`}
                  ></i>
                </div>
                <div className="flex-1 min-w-0">
                  <h4
                    className={`text-sm font-bold mb-1 ${
                      isLocked ? 'text-slate-400' : badge.color
                    }`}
                  >
                    {badge.name}
                  </h4>
                  <p
                    className={`text-xs leading-relaxed ${
                      isLocked ? 'text-slate-400' : 'text-slate-500'
                    }`}
                  >
                    {badge.description}
                  </p>
                  {!isLocked && badge.unlockedAt && (
                    <p className="text-[10px] text-slate-400 mt-2 font-medium">
                      Desbloqueado em {new Date(badge.unlockedAt).toLocaleDateString('pt-BR', { day: 'numeric', month: 'short' })}
                    </p>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}