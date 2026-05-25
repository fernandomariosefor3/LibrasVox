import { useState, useCallback, useEffect } from 'react';
import Navbar from '@/components/feature/Navbar';
import Footer from '@/components/feature/Footer';
import { SEOHead } from '@/components/feature/SEOHead';
import { pageSEO, SITE_URL, generateWebPageSchema, generateCourseSchema } from '@/lib/seo';
import HandCanvas from './components/HandCanvas';
import LetterNav from './components/LetterNav';
import LetterDetail from './components/LetterDetail';
import { alphabetData } from '@/mocks/alphabet';
import InterpreterGuide from '@/components/feature/InterpreterGuide';

const STORAGE_KEY = 'librasvox_learned_letters';

const loadLearnedLetters = (): string[] => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as string[]) : [];
  } catch { return []; }
};

const saveLearnedLetters = (letters: string[]) => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(letters));
};

export default function AlphabetPage() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [learnedLetters, setLearnedLetters] = useState<string[]>(loadLearnedLetters);

  const currentData = alphabetData[activeIndex];

  const toggleLearned = useCallback((letter: string) => {
    setLearnedLetters((prev) => {
      const next = prev.includes(letter) ? prev.filter((l) => l !== letter) : [...prev, letter];
      saveLearnedLetters(next);
      return next;
    });
  }, []);

  const goToLetter = useCallback((letter: string) => {
    const idx = alphabetData.findIndex((d) => d.letter === letter);
    if (idx !== -1) setActiveIndex(idx);
  }, []);

  const goPrev = useCallback(() => setActiveIndex((i) => Math.max(0, i - 1)), []);
  const goNext = useCallback(() => setActiveIndex((i) => Math.min(alphabetData.length - 1, i + 1)), []);

  // Keyboard navigation
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft') goPrev();
      else if (e.key === 'ArrowRight') goNext();
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [goPrev, goNext]);

  const learnedCount = learnedLetters.length;
  const totalLetters = alphabetData.length;

  const seo = pageSEO.alphabet;
  const canonical = `${SITE_URL}/alphabet`;
  
  const schema = [
    generateWebPageSchema(seo.title, seo.description, canonical),
    generateCourseSchema('Alfabeto Manual em Libras', 'Aprenda a datilologia em Libras com visualização 3D interativa das 26 letras', canonical),
  ];

  return (
    <>
      <SEOHead
        title={seo.title}
        description={seo.description}
        keywords={seo.keywords}
        canonical={canonical}
        ogTitle={seo.title}
        ogDescription={seo.description}
        ogType="website"
        schema={schema}
      />
      <main className="min-h-screen bg-slate-50">
        <Navbar />

        {/* Header */}
        <div className="bg-gradient-to-br from-amber-500 to-orange-500 pt-24 pb-10 px-4 md:px-8" data-guide="header">
          <div className="max-w-7xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-white/15 border border-white/20 rounded-full text-white/90 text-sm font-semibold mb-4 backdrop-blur-sm">
              <i className="ri-keyboard-line"></i>
              Datilologia Interativa
            </div>
            <h1
              className="text-3xl md:text-5xl font-extrabold text-white mb-3"
              style={{ fontFamily: 'Plus Jakarta Sans, sans-serif' }}
            >
              Alfabeto Manual em 3D
            </h1>
            <p className="text-white/75 text-lg max-w-lg mx-auto mb-8">
              Visualize e aprenda as 26 letras da datilologia em Libras com animações e instruções passo a passo.
            </p>

            {/* Stats */}
            <div className="flex flex-wrap justify-center gap-4">
              {[
                { icon: 'ri-keyboard-line', value: totalLetters, label: 'Letras no alfabeto' },
                { icon: 'ri-checkbox-circle-line', value: learnedCount, label: 'Letras aprendidas' },
                { icon: 'ri-bar-chart-line', value: `${Math.round((learnedCount / totalLetters) * 100)}%`, label: 'Concluído' },
              ].map((s) => (
                <div key={s.label} className="flex items-center gap-2.5 bg-white/15 backdrop-blur-sm border border-white/20 rounded-2xl px-5 py-3">
                  <div className="w-8 h-8 flex items-center justify-center bg-white/20 rounded-xl">
                    <i className={`${s.icon} text-white text-base`}></i>
                  </div>
                  <div>
                    <div className="text-white font-extrabold text-lg leading-none">{s.value}</div>
                    <div className="text-white/60 text-xs">{s.label}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Letter Nav */}
        <LetterNav
          activeLetter={currentData.letter}
          onSelect={goToLetter}
          learnedLetters={learnedLetters}
        />

        {/* Main content */}
        <div className="max-w-7xl mx-auto px-4 md:px-8 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">

            {/* Canvas panel */}
            <div className="bg-white rounded-3xl border border-slate-100 overflow-hidden"
              style={{ boxShadow: '0 4px 24px rgba(0,0,0,0.06)' }} data-guide="canvas">
              {/* Canvas header */}
              <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 flex items-center justify-center bg-amber-50 rounded-xl">
                    <i className="ri-hand-heart-line text-amber-500 text-base"></i>
                  </div>
                  <span className="font-semibold text-slate-700 text-sm">Visualização 3D</span>
                </div>
                <div className="flex items-center gap-1.5 text-xs text-slate-400">
                  <i className="ri-information-line"></i>
                  Animação suave entre letras
                </div>
              </div>

              {/* Canvas area */}
              <div className="relative bg-gradient-to-br from-slate-50 to-white p-6 flex flex-col items-center">
                {/* Background pattern */}
                <div className="absolute inset-0 opacity-[0.03]"
                  style={{
                    backgroundImage: 'radial-gradient(circle, #10B981 1px, transparent 1px)',
                    backgroundSize: '24px 24px',
                  }}
                />
                <div className="relative w-full max-w-xs">
                  <HandCanvas
                    key={currentData.letter}
                    letter={currentData.letter}
                    isMovement={currentData.isMovement}
                  />
                </div>

                {/* Keyboard shortcut hint */}
                <div className="mt-4 flex items-center gap-3 text-xs text-slate-400">
                  <span>← → para navegar</span>
                  <span>·</span>
                  <span>Clique nas letras acima</span>
                </div>
              </div>

              {/* Keyboard navigation */}
              <div className="px-6 pb-5 flex items-center justify-between">
                <button
                  onClick={goPrev}
                  disabled={activeIndex === 0}
                  className="flex items-center gap-2 px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-xl text-sm font-semibold disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer transition-all whitespace-nowrap"
                >
                  <i className="ri-arrow-left-s-line"></i>
                  {activeIndex > 0 ? alphabetData[activeIndex - 1].letter : '—'}
                </button>
                <span className="text-sm font-bold text-slate-400">
                  {activeIndex + 1} / {totalLetters}
                </span>
                <button
                  onClick={goNext}
                  disabled={activeIndex === alphabetData.length - 1}
                  className="flex items-center gap-2 px-4 py-2.5 bg-emerald-500 hover:bg-emerald-600 text-white rounded-xl text-sm font-semibold disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer transition-all whitespace-nowrap"
                >
                  {activeIndex < alphabetData.length - 1 ? alphabetData[activeIndex + 1].letter : '—'}
                  <i className="ri-arrow-right-s-line"></i>
                </button>
              </div>
            </div>

            {/* Detail panel */}
            <div className="bg-white rounded-3xl border border-slate-100 p-6"
              style={{ boxShadow: '0 4px 24px rgba(0,0,0,0.06)' }} data-guide="detail">
              <LetterDetail
                data={currentData}
                isLearned={learnedLetters.includes(currentData.letter)}
                onToggleLearned={toggleLearned}
                onPrev={goPrev}
                onNext={goNext}
                currentIndex={activeIndex}
                total={totalLetters}
              />
            </div>
          </div>

          {/* Progress overview */}
          {learnedCount > 0 && (
            <div className="mt-8 bg-white border border-amber-100 rounded-3xl p-6 flex flex-col sm:flex-row items-center gap-4"
              style={{ boxShadow: '0 2px 12px rgba(245,158,11,0.08)' }}>
              <div className="w-14 h-14 flex items-center justify-center flex-shrink-0 bg-amber-50 rounded-2xl">
                <i className="ri-trophy-line text-amber-500 text-2xl"></i>
              </div>
              <div className="text-center sm:text-left">
                <p className="font-bold text-slate-800 text-base">
                  {learnedCount === totalLetters
                    ? '🎉 Parabéns! Você aprendeu todo o alfabeto!'
                    : `Você aprendeu ${learnedCount} de ${totalLetters} letras!`}
                </p>
                <p className="text-slate-400 text-sm">
                  {learnedCount === totalLetters
                    ? 'Agora você pode soletrar qualquer palavra em Libras!'
                    : `Continue! Faltam apenas ${totalLetters - learnedCount} letras para completar.`}
                </p>
              </div>
              <div className="sm:ml-auto w-full sm:w-40">
                <div className="bg-slate-100 rounded-full h-2.5 overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-amber-400 to-orange-400 rounded-full transition-all duration-500"
                    style={{ width: `${Math.round((learnedCount / totalLetters) * 100)}%` }}
                  />
                </div>
                <p className="text-right text-xs text-slate-400 mt-1">
                  {Math.round((learnedCount / totalLetters) * 100)}% do alfabeto
                </p>
              </div>
            </div>
          )}

          {/* Mini alphabet grid */}
          <div className="mt-8" data-guide="grid">
            <h2 className="text-lg font-bold text-slate-800 mb-4" style={{ fontFamily: 'Plus Jakarta Sans, sans-serif' }}>
              Visão Geral do Alfabeto
            </h2>
            <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-9 xl:grid-cols-9 gap-2">
              {alphabetData.map((item, idx) => {
                const isActive = idx === activeIndex;
                const isLearned = learnedLetters.includes(item.letter);
                return (
                  <button
                    key={item.letter}
                    onClick={() => setActiveIndex(idx)}
                    className={`aspect-square flex flex-col items-center justify-center rounded-2xl text-sm font-bold transition-all duration-200 cursor-pointer gap-0.5 ${
                      isActive
                        ? 'bg-amber-500 text-white scale-105'
                        : isLearned
                        ? 'bg-emerald-50 border border-emerald-200 text-emerald-700'
                        : 'bg-white border border-slate-200 text-slate-600 hover:border-slate-300 hover:bg-slate-50'
                    }`}
                    style={{ fontFamily: 'Plus Jakarta Sans, sans-serif' }}
                  >
                    <span className="text-base">{item.letter}</span>
                    {isLearned && !isActive && (
                      <i className="ri-check-line text-emerald-500" style={{ fontSize: '10px' }}></i>
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        <Footer />
      </main>
      <InterpreterGuide />
    </>
  );
}