import { useState, useEffect } from 'react';

interface Props {
  letter: string;
  isMovement?: boolean;
}

// Grid coordinates in the 523×743 original JPEG (public/alphabet_grid.jpg)
// Extracted from official INES material "Alfabeto e CM 2018"
const SCALE = 3;
const IMG_W = 523;
const IMG_H = 743;
const CELL_W = 62;

const LETTER_COORDS: Record<string, { x: number; y: number; h: number }> = {
  A: { x: 152, y: 54,  h: 88  }, B: { x: 222, y: 54,  h: 88  },
  C: { x: 292, y: 54,  h: 88  }, D: { x: 361, y: 54,  h: 88  },
  E: { x: 431, y: 54,  h: 88  }, F: { x: 12,  y: 152, h: 87  },
  G: { x: 82,  y: 152, h: 87  }, H: { x: 152, y: 152, h: 87  },
  I: { x: 222, y: 152, h: 87  }, J: { x: 292, y: 152, h: 87  },
  K: { x: 361, y: 152, h: 87  }, L: { x: 431, y: 152, h: 87  },
  M: { x: 12,  y: 240, h: 103 }, N: { x: 82,  y: 240, h: 103 },
  O: { x: 152, y: 240, h: 103 }, P: { x: 222, y: 240, h: 103 },
  Q: { x: 292, y: 240, h: 103 }, R: { x: 361, y: 240, h: 103 },
  S: { x: 431, y: 240, h: 103 }, T: { x: 12,  y: 344, h: 91  },
  U: { x: 82,  y: 344, h: 91  }, V: { x: 152, y: 344, h: 91  },
  W: { x: 222, y: 344, h: 91  }, X: { x: 292, y: 344, h: 91  },
  Y: { x: 361, y: 344, h: 91  }, Z: { x: 431, y: 344, h: 91  },
};

// Display container: CELL_W * SCALE wide, standard row height * SCALE tall
const DISPLAY_W = CELL_W * SCALE;         // 186px
const DISPLAY_H = 88 * SCALE;            // 264px — fits row 1/2, clips minimally for row 3/4

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

  const coords = LETTER_COORDS[displayLetter] ?? LETTER_COORDS.A;
  const bgX = -(coords.x * SCALE);
  const bgY = -(coords.y * SCALE + Math.round(((coords.h - 88) * SCALE) / 2)); // center taller rows

  return (
    <div className="w-full flex flex-col items-center">
      <div
        className="relative rounded-2xl overflow-hidden border border-slate-200 bg-white"
        style={{ width: DISPLAY_W, height: DISPLAY_H }}
      >
        {/* Sprite crop — full grid at 3× scale */}
        <div
          className={`absolute inset-0 transition-opacity duration-200 ${isFading ? 'opacity-0' : 'opacity-100'}`}
          style={{
            backgroundImage: 'url(/alphabet_grid.jpg)',
            backgroundRepeat: 'no-repeat',
            backgroundSize: `${IMG_W * SCALE}px ${IMG_H * SCALE}px`,
            backgroundPosition: `${bgX}px ${bgY}px`,
            imageRendering: 'auto',
          }}
          aria-label={`Configuração da mão para a letra ${displayLetter} em Libras`}
          role="img"
        />

        {/* Letter badge */}
        <div className="absolute bottom-2 left-1/2 -translate-x-1/2 bg-white/95 backdrop-blur-sm px-3 py-1 rounded-full border border-slate-200 flex items-center gap-1.5">
          <span className="text-base font-bold text-slate-800">{displayLetter}</span>
          {isMovement && (
            <span className="text-xs font-semibold text-amber-600 bg-amber-50 px-1.5 py-0.5 rounded-full whitespace-nowrap">
              movimento
            </span>
          )}
        </div>

        {/* INES source badge */}
        <div className="absolute top-2 right-2 flex items-center gap-1 px-2 py-1 bg-black/40 backdrop-blur-sm rounded-full text-white/90 text-xs">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 flex-shrink-0"></span>
          Fonte: INES
        </div>
      </div>
    </div>
  );
}
