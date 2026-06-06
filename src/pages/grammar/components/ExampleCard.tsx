import type { GrammarExample } from '@/mocks/grammar';

interface ExampleCardProps {
  examples: GrammarExample[];
  color: string;
  bg: string;
  border: string;
}

export default function ExampleCard({ examples, color, bg, border }: ExampleCardProps) {
  return (
    <div className="space-y-3 mt-4">
      <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">
        Exemplos
      </p>
      {examples.map((ex, idx) => (
        <div
          key={idx}
          className={`rounded-xl border ${border} overflow-hidden`}
        >
          {/* Libras */}
          <div className={`${bg} px-4 py-3`}>
            <div className="flex items-start gap-2">
              <span className={`text-xs font-bold uppercase tracking-widest ${color} flex-shrink-0 mt-0.5`}>
                Libras
              </span>
              <p className={`text-sm font-bold ${color} font-mono leading-relaxed`}>
                {ex.libras}
              </p>
            </div>
          </div>
          {/* Portuguese */}
          <div className="bg-white px-4 py-3 border-t border-slate-100">
            <div className="flex items-start gap-2">
              <span className="text-xs font-bold uppercase tracking-widest text-slate-400 flex-shrink-0 mt-0.5">
                Port.
              </span>
              <p className="text-sm text-slate-700 leading-relaxed">{ex.portuguese}</p>
            </div>
          </div>
          {/* Note */}
          {ex.note && (
            <div className="bg-slate-50 px-4 py-2 border-t border-slate-100">
              <p className="text-xs text-slate-500 italic">
                <i className="ri-information-line mr-1"></i>
                {ex.note}
              </p>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
