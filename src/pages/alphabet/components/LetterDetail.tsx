import { LetterData } from '@/mocks/alphabet';

interface Props {
  data: LetterData;
  isLearned: boolean;
  onToggleLearned: (letter: string) => void;
  onPrev: () => void;
  onNext: () => void;
  currentIndex: number;
  total: number;
}

const speak = (text: string) => {
  if (!('speechSynthesis' in window)) return;
  window.speechSynthesis.cancel();
  const u = new SpeechSynthesisUtterance(text);
  u.lang = 'pt-BR';
  u.rate = 0.85;
  window.speechSynthesis.speak(u);
};

export default function LetterDetail({
  data,
  isLearned,
  onToggleLearned,
  onPrev,
  onNext,
  currentIndex,
  total,
}: Props) {
  return (
    <div className="flex flex-col gap-5">
      {/* Letter hero */}
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center gap-3 mb-1">
            <span
              className="text-6xl font-extrabold text-slate-900 leading-none"
              style={{ fontFamily: 'Plus Jakarta Sans, sans-serif' }}
            >
              {data.letter}
            </span>
            {data.isMovement && (
              <span className="flex items-center gap-1 px-2.5 py-1 bg-amber-100 text-amber-700 text-xs font-semibold rounded-full">
                <i className="ri-arrow-left-right-line"></i>
                Movimento
              </span>
            )}
            {isLearned && (
              <span className="flex items-center gap-1 px-2.5 py-1 bg-emerald-100 text-emerald-700 text-xs font-semibold rounded-full">
                <i className="ri-checkbox-circle-fill"></i>
                Aprendido
              </span>
            )}
          </div>
          <p className="text-slate-500 text-sm">{currentIndex + 1} de {total} letras</p>
        </div>

        {/* Navigation arrows */}
        <div className="flex items-center gap-2">
          <button
            onClick={onPrev}
            disabled={currentIndex === 0}
            className="w-10 h-10 flex items-center justify-center rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-600 disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer transition-all"
          >
            <i className="ri-arrow-left-s-line text-lg"></i>
          </button>
          <button
            onClick={onNext}
            disabled={currentIndex === total - 1}
            className="w-10 h-10 flex items-center justify-center rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer transition-all"
          >
            <i className="ri-arrow-right-s-line text-lg"></i>
          </button>
        </div>
      </div>

      {/* Progress bar */}
      <div className="bg-slate-100 rounded-full h-1.5 overflow-hidden">
        <div
          className="h-full bg-gradient-to-r from-emerald-400 to-teal-500 rounded-full transition-all duration-500"
          style={{ width: `${((currentIndex + 1) / total) * 100}%` }}
        />
      </div>

      {/* Description */}
      <div className="bg-slate-50 rounded-2xl p-4">
        <p className="text-slate-700 text-sm leading-relaxed">{data.description}</p>
      </div>

      {/* Steps */}
      <div>
        <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3 flex items-center gap-2">
          <i className="ri-list-check text-emerald-500"></i>
          Como fazer — Passo a Passo
        </h3>
        <ol className="space-y-2.5">
          {data.steps.map((step, i) => (
            <li key={i} className="flex items-start gap-3">
              <div className="w-6 h-6 flex items-center justify-center flex-shrink-0 bg-emerald-500 text-white text-xs font-bold rounded-lg mt-0.5">
                {i + 1}
              </div>
              <p className="text-slate-600 text-sm leading-relaxed pt-0.5">{step}</p>
            </li>
          ))}
        </ol>
      </div>

      {/* Tip */}
      <div className="bg-amber-50 border border-amber-100 rounded-2xl p-4 flex items-start gap-3">
        <div className="w-8 h-8 flex items-center justify-center flex-shrink-0 bg-amber-100 rounded-xl">
          <i className="ri-lightbulb-line text-amber-500 text-base"></i>
        </div>
        <div>
          <p className="text-amber-700 text-xs font-semibold mb-0.5">Dica mnemônica</p>
          <p className="text-amber-700 text-xs leading-relaxed">{data.tip}</p>
        </div>
      </div>

      {/* Actions */}
      <div className="flex gap-3">
        <button
          onClick={() => speak(data.letter)}
          className="flex items-center justify-center gap-2 px-4 py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-2xl text-sm font-semibold transition-all cursor-pointer whitespace-nowrap"
        >
          <i className="ri-volume-up-line"></i>
          Ouvir letra
        </button>
        <button
          onClick={() => onToggleLearned(data.letter)}
          className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-2xl text-sm font-bold transition-all cursor-pointer whitespace-nowrap ${
            isLearned
              ? 'bg-emerald-100 text-emerald-700 hover:bg-emerald-200'
              : 'bg-emerald-500 hover:bg-emerald-600 text-white'
          }`}
        >
          <i className={isLearned ? 'ri-checkbox-circle-fill' : 'ri-checkbox-blank-circle-line'}></i>
          {isLearned ? 'Aprendida!' : 'Marcar como aprendida'}
        </button>
      </div>

      {data.isMovement && (
        <div className="bg-amber-50 border border-amber-200 rounded-2xl p-3 flex items-start gap-2 text-amber-700 text-xs">
          <i className="ri-information-line mt-0.5 flex-shrink-0"></i>
          <span>Esta letra requer um <strong>movimento</strong>. A imagem mostra a posição inicial — pratique o traçado no ar!</span>
        </div>
      )}
    </div>
  );
}
