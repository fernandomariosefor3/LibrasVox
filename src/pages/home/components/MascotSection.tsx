import { useState, useEffect, useRef, useCallback } from 'react';
import { Link } from 'react-router-dom';

interface Scene {
  id: string;
  sign: string;
  tag: string;
  desc: string;
  tip: string;
  color: string;
  icon: string;
}

const SCENES: Scene[] = [
  {
    id: 'oi',
    sign: 'Oi',
    tag: 'Saudação',
    color: '#10b981',
    desc: 'Mão aberta (configuração B) levantada ao lado da cabeça, levemente inclinada para frente — saudação padrão em Libras.',
    tip: 'Configuração B · Mão aberta próxima à cabeça',
    icon: 'ri-hand-heart-line',
  },
  {
    id: 'obrigado',
    sign: 'Obrigado',
    tag: 'Gratidão',
    color: '#f59e0b',
    desc: 'Mão aberta plana (B) toca o queixo com os dedos e move-se para frente — como enviar um beijo de agradecimento.',
    tip: 'Configuração B · Do queixo para frente',
    icon: 'ri-heart-3-line',
  },
  {
    id: 'amor',
    sign: 'Eu te amo',
    tag: 'Afeto',
    color: '#ef4444',
    desc: 'Configuração ILY: polegar, indicador e mínimo estendidos simultaneamente — símbolo universal do amor em língua de sinais.',
    tip: 'Configuração ILY · Braço erguido',
    icon: 'ri-heart-fill',
  },
  {
    id: 'aprender',
    sign: 'Aprender',
    tag: 'Conhecimento',
    color: '#8b5cf6',
    desc: 'Mão em O toca a testa e abre-se em B — representa informação sendo absorvida e armazenada na memória.',
    tip: 'Configuração O → B · Na testa',
    icon: 'ri-book-open-line',
  },
  {
    id: 'libras',
    sign: 'Libras',
    tag: 'Nossa língua',
    color: '#06b6d4',
    desc: 'Configuração L em ambas as mãos realizando movimento circular alternado — o próprio sinal para Língua Brasileira de Sinais.',
    tip: 'Configuração L · Ambas as mãos',
    icon: 'ri-translate-2',
  },
  {
    id: 'bom_dia',
    sign: 'Bom dia',
    tag: 'Cumprimento',
    color: '#f97316',
    desc: 'Mão aberta parte da boca (B) e move-se para frente-cima em arco — como se espalhasse luz e energia do amanhecer.',
    tip: 'Configuração B · Da boca para cima',
    icon: 'ri-sun-line',
  },
  {
    id: 'ajuda',
    sign: 'Ajuda',
    tag: 'Suporte',
    color: '#ec4899',
    desc: 'Mão fechada (A) repousa na palma aberta (B) da outra mão, que sobe — como ser carregado por alguém que apoia.',
    tip: 'Configuração A sobre B · Movimento ascendente',
    icon: 'ri-hand-coin-line',
  },
  {
    id: 'sim',
    sign: 'Sim',
    tag: 'Afirmação',
    color: '#14b8a6',
    desc: 'Mão fechada (A ou S) com movimento de cima para baixo imitando um aceno de cabeça afirmativo — concordância em Libras.',
    tip: 'Configuração A · Movimento vertical descendente',
    icon: 'ri-check-double-line',
  },
];

const HOLD_MS = 4200;

export default function MascotSection() {
  const [uiIdx, setUiIdx] = useState(0);
  const [isFading, setIsFading] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const goTo = useCallback(
    (idx: number) => {
      if (idx === uiIdx) return;
      setIsFading(true);
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      timeoutRef.current = setTimeout(() => {
        setUiIdx(idx);
        setIsFading(false);
      }, 250);
    },
    [uiIdx],
  );

  // Auto-rotate
  useEffect(() => {
    if (isPaused) return;
    timerRef.current = setInterval(() => {
      setIsFading(true);
      timeoutRef.current = setTimeout(() => {
        setUiIdx((prev) => (prev + 1) % SCENES.length);
        setIsFading(false);
      }, 250);
    }, HOLD_MS);
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, [isPaused]);

  const scene = SCENES[uiIdx];

  return (
    <section className="py-20 px-4 md:px-8 bg-gradient-to-b from-slate-50 to-white overflow-hidden">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="text-center mb-14">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-emerald-50 border border-emerald-100 rounded-full text-emerald-600 text-sm font-semibold mb-4">
            <i className="ri-hand-heart-line"></i>
            Configurações de mão em Libras
          </div>
          <h2
            className="text-3xl md:text-4xl font-extrabold text-slate-900 mb-3"

          >
            Veja como cada sinal se forma
          </h2>
          <p className="text-slate-500 max-w-lg mx-auto">
            Prévia ilustrativa do dicionário: ícones e descrições textuais de configuração de mão,
            ainda em processo de revisão linguística.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-center">
          {/* Image display */}
          <div className="flex justify-center order-1">
            <div
              className="relative w-full max-w-md aspect-[4/3] rounded-3xl overflow-hidden bg-slate-100 border border-slate-200 cursor-pointer"
              onMouseEnter={() => setIsPaused(true)}
              onMouseLeave={() => setIsPaused(false)}
            >
              {/* Glow behind */}
              <div
                className="absolute inset-0 pointer-events-none transition-colors duration-700"
                style={{
                  background: `radial-gradient(circle at center, ${scene.color}18 0%, transparent 70%)`,
                }}
              />

              {/* Abstract visual (icon-based, no photography) */}
              <div
                className={`absolute inset-0 flex items-center justify-center transition-all duration-300 ${
                  isFading ? 'opacity-0 scale-95' : 'opacity-100 scale-100'
                }`}
                style={{ background: `linear-gradient(135deg, ${scene.color}26, ${scene.color}08)` }}
                aria-label={`Configuração de mão do sinal: ${scene.sign}`}
              >
                <i className={`${scene.icon} text-[7rem]`} style={{ color: scene.color }} aria-hidden="true" />
              </div>

              {/* Overlay label */}
              <div className="absolute top-4 left-4">
                <div
                  className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-bold text-white backdrop-blur-sm"
                  style={{ background: scene.color + 'cc' }}
                >
                  <i className="ri-hand-heart-line"></i>
                  {scene.tag}
                </div>
              </div>

              {/* Sign name badge */}
              <div className="absolute bottom-4 left-4 right-4">
                <div className="flex items-center justify-between">
                  <div
                    className="px-4 py-2 rounded-xl text-white text-sm font-bold backdrop-blur-sm"
                    style={{ background: scene.color + 'cc' }}
                  >
                    {scene.sign}
                  </div>
                  <div className="flex items-center gap-1.5 px-3 py-1.5 bg-black/40 backdrop-blur-sm rounded-full text-white/90 text-xs">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                    Configuração
                  </div>
                </div>
              </div>

              {/* Pause indicator */}
              {isPaused && (
                <div className="absolute inset-0 flex items-center justify-center bg-black/20 backdrop-blur-[2px]">
                  <div className="w-14 h-14 flex items-center justify-center bg-white/90 rounded-full">
                    <i className="ri-pause-fill text-slate-700 text-xl"></i>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Caption panel */}
          <div className="order-2 flex flex-col">
            {/* Tag */}
            <div
              className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-sm font-semibold self-start mb-4 transition-all duration-500"
              style={{ background: scene.color + '1a', color: scene.color }}
            >
              <div className="w-2 h-2 rounded-full" style={{ background: scene.color }} />
              {scene.tag}
            </div>

            {/* Sign name */}
            <h3
              className="text-5xl md:text-6xl font-extrabold mb-4 transition-all duration-500 leading-none"
              style={{ color: scene.color }}
            >
              {scene.sign}
            </h3>

            {/* Config chip */}
            <div
              className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-bold self-start mb-5 transition-all duration-500"
              style={{ background: scene.color + '14', color: scene.color }}
            >
              <i className="ri-hand-heart-line text-sm"></i>
              {scene.tip}
            </div>

            {/* Description */}
            <p className="text-slate-600 text-base leading-relaxed mb-7 min-h-[4.5rem]">{scene.desc}</p>

            {/* Sign selector pills */}
            <div className="flex flex-wrap gap-2 mb-7">
              {SCENES.map((sc, i) => (
                <button
                  key={sc.id}
                  onClick={() => goTo(i)}
                  className="px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all duration-200 cursor-pointer whitespace-nowrap"
                  style={
                    uiIdx === i
                      ? { background: scene.color, color: 'white' }
                      : { background: '#f1f5f9', color: '#64748b' }
                  }
                >
                  {sc.sign}
                </button>
              ))}
            </div>

            {/* Progress dots */}
            <div className="flex items-center gap-2 mb-7">
              {SCENES.map((_, i) => (
                <button
                  key={i}
                  onClick={() => goTo(i)}
                  className="transition-all duration-300 cursor-pointer rounded-full"
                  style={{ width: uiIdx === i ? 26 : 8, height: 8, background: uiIdx === i ? scene.color : '#cbd5e1' }}
                />
              ))}
              <span className="ml-2 text-xs text-slate-400 font-medium">
                {uiIdx + 1}/{SCENES.length}
              </span>
            </div>

            {/* Info cards */}
            <div className="grid grid-cols-2 gap-3 mb-7">
              <div className="p-4 rounded-2xl border border-slate-100 bg-white">
                <div className="w-8 h-8 flex items-center justify-center mb-2" style={{ color: scene.color }}>
                  <i className="ri-translate-2 text-xl"></i>
                </div>
                <p className="text-xs text-slate-400 font-medium">Sinais demonstrados</p>
                <p className="text-sm font-bold text-slate-700">{SCENES.length} em Libras</p>
              </div>
              <div className="p-4 rounded-2xl border border-slate-100 bg-white">
                <div className="w-8 h-8 flex items-center justify-center mb-2" style={{ color: scene.color }}>
                  <i className="ri-book-open-line text-xl"></i>
                </div>
                <p className="text-xs text-slate-400 font-medium">Situação</p>
                <p className="text-sm font-bold text-slate-700">Em revisão linguística</p>
              </div>
            </div>

            {/* Aviso de caráter ilustrativo */}
            <p className="text-xs text-slate-400 mb-7 leading-relaxed">
              Os ícones são ilustrativos. A demonstração completa de um sinal exige vídeo, movimento,
              orientação e expressão facial validados por revisão linguística humana.
            </p>

            {/* CTA */}
            <div className="pt-5 border-t border-slate-100">
              <p className="text-sm text-slate-400 mb-3">Explore o alfabeto completo A–Z em Libras:</p>
              <Link
                to="/alphabet"
                className="inline-flex items-center gap-2 px-5 py-2.5 text-sm font-semibold rounded-xl text-white transition-all duration-200 cursor-pointer whitespace-nowrap hover:opacity-90 hover:scale-105"
                style={{ background: scene.color }}
              >
                <i className="ri-keyboard-line"></i>
                Explorar Alfabeto
                <i className="ri-arrow-right-line"></i>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}