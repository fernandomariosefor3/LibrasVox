import { alphabetData } from '@/mocks/alphabet';

interface Props {
  activeLetter: string;
  onSelect: (letter: string) => void;
  learnedLetters: string[];
}

const LETTERS = alphabetData.map((d) => d.letter);

export default function LetterNav({ activeLetter, onSelect, learnedLetters }: Props) {
  return (
    <div className="bg-white border-b border-slate-100 px-4 md:px-8 py-3 sticky top-16 z-30">
      <div className="max-w-7xl mx-auto">
        {/* Scroll container */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1" style={{ scrollbarWidth: 'none' }}>
          {LETTERS.map((letter) => {
            const isActive = activeLetter === letter;
            const isLearned = learnedLetters.includes(letter);
            const letterData = alphabetData.find((d) => d.letter === letter);
            const isMovement = letterData?.isMovement;

            return (
              <button
                key={letter}
                onClick={() => onSelect(letter)}
                className={`relative flex-shrink-0 w-11 h-11 flex items-center justify-center rounded-xl text-base font-bold transition-all duration-200 cursor-pointer whitespace-nowrap ${
                  isActive
                    ? 'bg-emerald-500 text-white scale-110'
                    : isLearned
                    ? 'bg-emerald-50 text-emerald-600 border border-emerald-200'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
                style={{ fontFamily: 'Plus Jakarta Sans, sans-serif' }}
                aria-label={`Letra ${letter}`}
              >
                {letter}
                {isLearned && !isActive && (
                  <span className="absolute -top-1 -right-1 w-3.5 h-3.5 bg-emerald-500 rounded-full flex items-center justify-center">
                    <i className="ri-check-line text-white" style={{ fontSize: '8px' }}></i>
                  </span>
                )}
                {isMovement && !isActive && (
                  <span className="absolute -bottom-1 -right-1 w-3 h-3 bg-amber-400 rounded-full"></span>
                )}
              </button>
            );
          })}
        </div>

        {/* Legend */}
        <div className="flex items-center gap-4 mt-2 text-xs text-slate-400">
          <div className="flex items-center gap-1">
            <div className="w-3 h-3 bg-emerald-500 rounded-full"></div>
            <span>Aprendido</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-3 h-3 bg-amber-400 rounded-full"></div>
            <span>Requer movimento</span>
          </div>
        </div>
      </div>
    </div>
  );
}
