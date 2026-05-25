import { useState, useEffect } from 'react';

interface Props {
  letter: string;
  isMovement?: boolean;
}

// Fotos oficiais do INES (Instituto Nacional de Educação de Surdos)
// Extraídas do material "LIBRAS - Língua Brasileira de Sinais - Alfabeto" 2018
const LETTER_IMAGES: Record<string, string> = {
  A: '/alphabet/A.jpg', B: '/alphabet/B.jpg', C: '/alphabet/C.jpg',
  D: '/alphabet/D.jpg', E: '/alphabet/E.jpg', F: '/alphabet/F.jpg',
  G: '/alphabet/G.jpg', H: '/alphabet/H.jpg', I: '/alphabet/I.jpg',
  J: '/alphabet/J.jpg', K: '/alphabet/K.jpg', L: '/alphabet/L.jpg',
  M: '/alphabet/M.jpg', N: '/alphabet/N.jpg', O: '/alphabet/O.jpg',
  P: '/alphabet/P.jpg', Q: '/alphabet/Q.jpg', R: '/alphabet/R.jpg',
  S: '/alphabet/S.jpg', T: '/alphabet/T.jpg', U: '/alphabet/U.jpg',
  V: '/alphabet/V.jpg', W: '/alphabet/W.jpg', X: '/alphabet/X.jpg',
  Y: '/alphabet/Y.jpg', Z: '/alphabet/Z.jpg',
};

export default function HandCanvas({ letter, isMovement = false }: Props) {
  const [displayLetter, setDisplayLetter] = useState(letter);
  const [isFading, setIsFading] = useState(false);

  useEffect(() => {
    if (letter !== displayLetter) {
      setIsFading(true);
      const t = setTimeout(() => {
        setDisplayLetter(letter);
        setIsFading(false);
      }, 200);
      return () => clearTimeout(t);
    }
  }, [letter, displayLetter]);

  const imageUrl = LETTER_IMAGES[displayLetter] ?? LETTER_IMAGES.A;

  return (
    <div className="w-full flex flex-col items-center">
      <div className="relative w-full max-w-xs aspect-[4/5] rounded-3xl overflow-hidden bg-slate-100 border border-slate-200">
        <img
          src={imageUrl}
          alt={`Configuração da letra ${displayLetter} no alfabeto manual de Libras`}
          className={`absolute inset-0 w-full h-full object-cover object-center transition-opacity duration-200 ${
            isFading ? 'opacity-0' : 'opacity-100'
          }`}
        />

        {/* Letter badge */}
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-white/95 backdrop-blur-sm px-5 py-2.5 rounded-full border border-slate-200 flex items-center gap-2">
          <span className="text-xl font-bold text-slate-800">{displayLetter}</span>
          {isMovement && (
            <span className="text-xs font-semibold text-amber-600 bg-amber-50 px-2 py-0.5 rounded-full whitespace-nowrap">
              movimento
            </span>
          )}
        </div>

        {/* INES source label */}
        <div className="absolute top-4 right-4 flex items-center gap-1.5 px-3 py-1.5 bg-black/40 backdrop-blur-sm rounded-full text-white/90 text-xs">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
          Fonte: INES
        </div>
      </div>
    </div>
  );
}