import type { Scenario } from '@/mocks/phrases';

interface Props {
  scenario: Scenario;
  onClick: () => void;
}

export default function ScenarioCard({ scenario, onClick }: Props) {
  const difficultyLabel: Record<string, string> = {
    iniciante: 'Iniciante',
    intermediario: 'Intermediário',
    avancado: 'Avançado',
  };

  const difficultyDot: Record<string, string> = {
    iniciante: 'bg-emerald-500',
    intermediario: 'bg-amber-500',
    avancado: 'bg-rose-500',
  };

  return (
    <button
      onClick={onClick}
      className={`group relative w-full text-left rounded-2xl border ${scenario.borderColor} ${scenario.bgColor} p-5 hover:shadow-lg hover:scale-[1.01] transition-all duration-200 cursor-pointer`}
    >
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-3">
          <div className={`w-10 h-10 flex items-center justify-center rounded-xl ${scenario.bgColor} border ${scenario.borderColor}`}>
            <i className={`${scenario.icon} text-xl ${scenario.color}`}></i>
          </div>
          <div>
            <h3 className="font-semibold text-slate-900 text-base leading-snug" style={{ fontFamily: 'Plus Jakarta Sans, sans-serif' }}>
              {scenario.title}
            </h3>
            <div className="flex items-center gap-1.5 mt-0.5">
              <span className={`w-2 h-2 rounded-full ${difficultyDot[scenario.difficulty]}`}></span>
              <span className="text-xs text-slate-500 font-medium">{difficultyLabel[scenario.difficulty]}</span>
            </div>
          </div>
        </div>
        <div className="w-7 h-7 flex items-center justify-center rounded-full bg-white/80 border border-slate-200 opacity-0 group-hover:opacity-100 transition-opacity">
          <i className="ri-arrow-right-line text-sm text-slate-600"></i>
        </div>
      </div>

      <p className="text-sm text-slate-600 leading-relaxed mb-4">{scenario.description}</p>

      <div className="flex items-center gap-2 flex-wrap">
        {scenario.signs.slice(0, 4).map((ps) => (
          <span
            key={ps.signId}
            className="inline-flex items-center gap-1 px-2 py-1 bg-white rounded-md border border-slate-200 text-xs text-slate-700"
          >
            <i className="ri-hand-coin-line text-[10px] text-slate-400"></i>
            {ps.signId}
          </span>
        ))}
        {scenario.signs.length > 4 && (
          <span className="text-xs text-slate-400 font-medium">
            +{scenario.signs.length - 4}
          </span>
        )}
      </div>
    </button>
  );
}