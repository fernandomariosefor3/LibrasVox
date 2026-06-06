import { useSRS } from '@/hooks/useSRS';

const LEVEL_LABELS = [
  'Novo', 'Aprendendo', 'Revisando', 'Familiar', 'Confiante', 'Dominado', 'Memorizado', 'Sólido',
];

const LEVEL_COLORS = [
  'bg-slate-100 text-slate-600 border-slate-200',
  'bg-amber-50 text-amber-700 border-amber-200',
  'bg-orange-50 text-orange-700 border-orange-200',
  'bg-emerald-50 text-emerald-700 border-emerald-200',
  'bg-teal-50 text-teal-700 border-teal-200',
  'bg-cyan-50 text-cyan-700 border-cyan-200',
  'bg-sky-50 text-sky-700 border-sky-200',
  'bg-indigo-50 text-indigo-700 border-indigo-200',
];

function formatLastReview(timestamp: number | null): string {
  if (!timestamp) return 'Nunca revisado';
  const diff = Date.now() - timestamp;
  const minutes = Math.floor(diff / 60000);
  if (minutes < 1) return 'Agora';
  if (minutes < 60) return `${minutes} min atrás`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours} h atrás`;
  const days = Math.floor(hours / 24);
  return `${days} dia${days > 1 ? 's' : ''} atrás`;
}

export default function DeckOverview() {
  const srs = useSRS();
  const stats = srs.computeStats();
  const allCards = Object.values(srs.cards);

  const levelCounts = [0, 0, 0, 0, 0, 0, 0, 0];
  for (const card of allCards) {
    levelCounts[Math.min(card.level, 7)]++;
  }

  const sortedCards = [...allCards].sort((a, b) => {
    if (a.nextReview !== b.nextReview) return a.nextReview - b.nextReview;
    return b.totalReviews - a.totalReviews;
  });

  return (
    <div>
      {/* Stats cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        {[
          { label: 'Total de sinais', value: stats.totalCards, icon: 'ri-stack-line', color: 'text-slate-700', bg: 'bg-slate-50' },
          { label: 'Novos', value: stats.newCards, icon: 'ri-star-line', color: 'text-amber-600', bg: 'bg-amber-50' },
          { label: 'Para revisar', value: stats.dueNow, icon: 'ri-time-line', color: 'text-emerald-600', bg: 'bg-emerald-50' },
          { label: 'Dominados', value: stats.mastered, icon: 'ri-medal-line', color: 'text-teal-600', bg: 'bg-teal-50' },
        ].map((s) => (
          <div key={s.label} className={`${s.bg} rounded-2xl p-5 border border-slate-100`}>
            <div className="flex items-center gap-2 mb-2">
              <i className={`${s.icon} ${s.color} text-lg`}></i>
              <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">{s.label}</span>
            </div>
            <p className="text-3xl font-bold text-slate-800">{s.value}</p>
          </div>
        ))}
      </div>

      {/* Level distribution */}
      <div className="bg-slate-50 rounded-2xl p-6 border border-slate-100 mb-8">
        <h3 className="text-sm font-bold text-slate-700 mb-4 flex items-center gap-2">
          <i className="ri-bar-chart-line text-slate-400"></i>
          Distribuição por Nível
        </h3>
        <div className="space-y-2">
          {levelCounts.map((count, i) => {
            const pct = stats.totalCards > 0 ? (count / stats.totalCards) * 100 : 0;
            return (
              <div key={i} className="flex items-center gap-3">
                <span className={`text-xs font-semibold w-20 text-right px-2 py-1 rounded-full ${LEVEL_COLORS[i].split(' ').slice(0, 2).join(' ')}`}>
                  {LEVEL_LABELS[i]}
                </span>
                <div className="flex-1 h-2.5 bg-slate-200 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full ${LEVEL_COLORS[i].split(' ')[0].replace('bg-', 'bg-').replace('50', '400')}`}
                    style={{ width: `${pct}%` }}
                  />
                </div>
                <span className="text-xs font-bold text-slate-500 w-8">{count}</span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Streak */}
      {stats.streak > 0 && (
        <div className="bg-gradient-to-r from-amber-50 to-orange-50 rounded-2xl p-6 border border-amber-200 mb-8">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 flex items-center justify-center bg-amber-100 rounded-xl">
              <i className="ri-fire-line text-amber-600 text-2xl"></i>
            </div>
            <div>
              <p className="text-lg font-bold text-amber-800">{stats.streak} dia{stats.streak > 1 ? 's' : ''} seguido{stats.streak > 1 ? 's' : ''}</p>
              <p className="text-sm text-amber-600">Recorde: {stats.longestStreak} dias</p>
            </div>
          </div>
        </div>
      )}

      {/* Cards list */}
      <div>
        <h3 className="text-sm font-bold text-slate-700 mb-4 flex items-center gap-2">
          <i className="ri-list-check text-slate-400"></i>
          Seus Sinais ({allCards.length})
        </h3>
        {sortedCards.length === 0 ? (
          <div className="text-center py-12 bg-slate-50 rounded-2xl border border-slate-100">
            <p className="text-slate-400 text-sm">Nenhum sinal no deck ainda.</p>
            <p className="text-slate-300 text-xs mt-1">Vá para "Adicionar Sinais" para começar.</p>
          </div>
        ) : (
          <div className="space-y-3">
            {sortedCards.map((card) => (
              <div
                key={card.signId}
                className={`flex items-center gap-4 p-4 rounded-2xl border ${LEVEL_COLORS[Math.min(card.level, 7)]}`}
              >
                <div className="w-10 h-10 flex items-center justify-center bg-white rounded-xl border border-slate-200 text-xl">
                  {card.emoji}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <p className="text-sm font-bold text-slate-700 truncate">{card.word}</p>
                    <span className="text-xs px-2 py-0.5 rounded-full bg-white/80 font-medium">
                      {LEVEL_LABELS[Math.min(card.level, 7)]}
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 mt-0.5">
                    {card.totalReviews} revisões · {formatLastReview(card.lastReviewed)}
                  </p>
                </div>
                <button
                  onClick={() => srs.removeCard(card.signId)}
                  className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-rose-100 text-slate-400 hover:text-rose-600 transition-colors cursor-pointer"
                  title="Remover do deck"
                >
                  <i className="ri-delete-bin-line"></i>
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}