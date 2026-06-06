import { useXP } from '@/hooks/useXP';

export function XPLevelCard() {
  const { totalXP, currentLevel, nextLevel, progressToNext } = useXP();

  return (
    <div className="bg-white border border-slate-200 rounded-2xl p-5">
      <div className="flex items-center gap-4 mb-4">
        <div
          className={`w-12 h-12 flex items-center justify-center rounded-2xl ${currentLevel.bgColor} shrink-0`}
        >
          <i className={`${currentLevel.icon} text-xl ${currentLevel.color}`} aria-hidden="true" />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-baseline gap-2 flex-wrap">
            <span className={`text-sm font-bold ${currentLevel.color}`}>
              Nível {currentLevel.level}
            </span>
            <span className="text-slate-800 font-extrabold text-base">{currentLevel.name}</span>
          </div>
          <p className="text-xs text-slate-400">
            {totalXP.toLocaleString('pt-BR')} XP total
          </p>
        </div>
      </div>

      {/* Progress bar */}
      <div className="space-y-1">
        <div className="flex justify-between text-xs text-slate-400">
          <span>{totalXP.toLocaleString('pt-BR')} XP</span>
          {nextLevel ? (
            <span>{nextLevel.minXP.toLocaleString('pt-BR')} XP — {nextLevel.name}</span>
          ) : (
            <span>Nível máximo!</span>
          )}
        </div>
        <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
          <div
            className={`h-full rounded-full transition-all duration-700 ${currentLevel.color.replace('text-', 'bg-')}`}
            style={{ width: `${progressToNext}%` }}
          />
        </div>
        <p className="text-xs text-slate-400 text-right">{progressToNext}%</p>
      </div>

      {/* XP ways to earn */}
      <div className="mt-4 pt-4 border-t border-slate-100 grid grid-cols-3 gap-2 text-center">
        {[
          { label: 'Exercício', xp: '+15 XP', icon: 'ri-pencil-ruler-2-line', color: 'text-violet-500' },
          { label: 'Flashcard', xp: '+10 XP', icon: 'ri-stack-line', color: 'text-amber-500' },
          { label: 'Sinal', xp: '+20 XP', icon: 'ri-hand-heart-line', color: 'text-emerald-500' },
        ].map((item) => (
          <div key={item.label} className="flex flex-col items-center gap-1">
            <i className={`${item.icon} text-base ${item.color}`} aria-hidden="true" />
            <span className="text-xs font-semibold text-slate-700">{item.xp}</span>
            <span className="text-[10px] text-slate-400">{item.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
