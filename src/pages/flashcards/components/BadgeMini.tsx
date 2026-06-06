import type { Badge } from '@/hooks/useBadges';

interface BadgeMiniProps {
  badges: Badge[];
}

export default function BadgeMini({ badges }: BadgeMiniProps) {
  const unlocked = badges.filter((b) => !b.locked);
  const recent = unlocked
    .filter((b) => b.unlockedAt)
    .sort((a, b) => new Date(b.unlockedAt!).getTime() - new Date(a.unlockedAt!).getTime())
    .slice(0, 3);

  if (unlocked.length === 0) {
    return (
      <div className="bg-slate-50 rounded-2xl p-5 border border-slate-100">
        <div className="flex items-center gap-3 mb-3">
          <div className="w-9 h-9 flex items-center justify-center bg-slate-100 rounded-lg">
            <i className="ri-trophy-line text-slate-400 text-lg"></i>
          </div>
          <div>
            <h4 className="text-sm font-bold text-slate-700">Conquistas</h4>
            <p className="text-xs text-slate-400">Nenhuma conquista ainda</p>
          </div>
        </div>
        <p className="text-xs text-slate-400 leading-relaxed">
          Complete sessões de flashcards e mantenha seu streak para desbloquear badges!
        </p>
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-2xl p-5 border border-amber-200">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 flex items-center justify-center bg-amber-100 rounded-lg">
            <i className="ri-trophy-line text-amber-600 text-lg"></i>
          </div>
          <div>
            <h4 className="text-sm font-bold text-slate-800">Conquistas</h4>
            <p className="text-xs text-amber-700">{unlocked.length} de {badges.length} desbloqueadas</p>
          </div>
        </div>
        <span className="text-xs font-bold text-amber-700 bg-amber-100 px-2 py-1 rounded-full">
          {Math.round((unlocked.length / badges.length) * 100)}%
        </span>
      </div>

      {recent.length > 0 && (
        <div className="flex items-center gap-2">
          {recent.map((b) => (
            <div
              key={b.id}
              className={`w-8 h-8 flex items-center justify-center rounded-lg bg-white border ${b.borderColor}`}
              title={b.name}
            >
              <i className={`${b.icon} ${b.iconColor} text-sm`}></i>
            </div>
          ))}
          {unlocked.length > 3 && (
            <span className="text-xs text-amber-600 font-medium">+{unlocked.length - 3}</span>
          )}
        </div>
      )}
    </div>
  );
}