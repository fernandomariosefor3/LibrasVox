import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '@/components/feature/Navbar';
import Footer from '@/components/feature/Footer';
import { SEOHead } from '@/components/feature/SEOHead';
import { pageSEO, SITE_URL, generateWebPageSchema, generateCourseSchema } from '@/lib/seo';
import { signs } from '@/mocks/signs/index';
import { alphabetData } from '@/mocks/alphabet';
import { courseModules, levelInfo } from '@/mocks/courses';
import InterpreterGuide from '@/components/feature/InterpreterGuide';
import { useBadges } from '@/hooks/useBadges';
import BadgeMini from '@/pages/flashcards/components/BadgeMini';

interface ProgressData {
  learnedSigns: string[];
  favoriteSigns: string[];
  learnedLetters: string[];
  completedModules: string[];
  exercisesTaken: number;
  lastActive: string | null;
  streakDays: number;
}

function loadProgress(): ProgressData {
  try {
    return {
      learnedSigns: JSON.parse(localStorage.getItem('librasvox_learned') || '[]'),
      favoriteSigns: JSON.parse(localStorage.getItem('librasvox_favorites') || '[]'),
      learnedLetters: JSON.parse(localStorage.getItem('librasvox_learned_letters') || '[]'),
      completedModules: JSON.parse(localStorage.getItem('completedModules') || '[]'),
      exercisesTaken: parseInt(localStorage.getItem('librasvox_exercises_count') || '0', 10),
      lastActive: localStorage.getItem('librasvox_last_active'),
      streakDays: parseInt(localStorage.getItem('librasvox_streak') || '0', 10),
    };
  } catch {
    return { learnedSigns: [], favoriteSigns: [], learnedLetters: [], completedModules: [], exercisesTaken: 0, lastActive: null, streakDays: 0 };
  }
}

const StatCard = ({ icon, value, label, color, bg, link }: { icon: string; value: string | number; label: string; color: string; bg: string; link?: string }) => {
  const content = (
    <div className={`p-5 rounded-2xl border ${bg} ${color.replace('text-', 'border-').replace('700', '200')} bg-white transition-all hover:scale-[1.02] cursor-pointer`}>
      <div className="flex items-start justify-between mb-3">
        <div className={`w-10 h-10 flex items-center justify-center rounded-xl ${bg}`}>
          <i className={`${icon} ${color} text-lg`}></i>
        </div>
        <span className={`text-2xl font-extrabold ${color}`} style={{ fontFamily: 'Plus Jakarta Sans, sans-serif' }}>{value}</span>
      </div>
      <p className="text-sm text-slate-500 font-medium">{label}</p>
    </div>
  );
  if (link) return <Link to={link}>{content}</Link>;
  return content;
};

export default function ProgressPage() {
  const [progress, setProgress] = useState<ProgressData>(loadProgress);
  const [visible, setVisible] = useState(false);
  const badges = useBadges();

  useEffect(() => {
    const t = setTimeout(() => setVisible(true), 80);
    return () => clearTimeout(t);
  }, []);

  // Update last active
  useEffect(() => {
    const today = new Date().toISOString().split('T')[0];
    const last = localStorage.getItem('librasvox_last_active');
    if (last !== today) {
      if (last) {
        const yesterday = new Date(Date.now() - 86400000).toISOString().split('T')[0];
        if (last === yesterday) {
          const currentStreak = parseInt(localStorage.getItem('librasvox_streak') || '0', 10);
          localStorage.setItem('librasvox_streak', String(currentStreak + 1));
        } else if (last !== today) {
          localStorage.setItem('librasvox_streak', '1');
        }
      } else {
        localStorage.setItem('librasvox_streak', '1');
      }
      localStorage.setItem('librasvox_last_active', today);
      setProgress(loadProgress());
    }
  }, []);

  const totalSigns = signs.length;
  const totalLetters = alphabetData.length;
  const totalModules = courseModules.length;

  const signPct = Math.round((progress.learnedSigns.length / totalSigns) * 100);
  const letterPct = Math.round((progress.learnedLetters.length / totalLetters) * 100);
  const modulePct = Math.round((progress.completedModules.length / totalModules) * 100);

  const overallScore = Math.round((signPct + letterPct + modulePct + Math.min(progress.exercisesTaken * 5, 100)) / 4);

  const badgeProgress = badges.getProgress();

  const seo = pageSEO.progress;
  const canonical = `${SITE_URL}/progress`;

  const schema = [
    generateWebPageSchema(seo.title, seo.description, canonical),
    generateCourseSchema('Dashboard de Progresso de Libras', 'Acompanhamento personalizado do aprendizado de Libras com estatísticas.', canonical),
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
        ogUrl={canonical}
        schema={schema}
      />
      <div className="min-h-screen bg-white">
        <Navbar />

        {/* Hero */}
        <section className="pt-28 pb-12 px-4 md:px-8 bg-gradient-to-b from-slate-50 to-white" data-guide="header">
          <div className="max-w-6xl mx-auto">
            <div className={`transition-all duration-700 ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
              <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6">
                <div>
                  <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-emerald-50 border border-emerald-200 rounded-full text-emerald-700 text-sm font-semibold mb-4">
                    <i className="ri-bar-chart-line"></i>
                    Dashboard de Aprendizado
                  </div>
                  <h1 className="text-4xl md:text-5xl font-extrabold text-slate-900 leading-tight mb-3" style={{ fontFamily: 'Plus Jakarta Sans, sans-serif' }}>
                    Meu <em className="not-italic text-transparent bg-clip-text bg-gradient-to-r from-emerald-500 to-teal-500">Progresso</em>
                  </h1>
                  <p className="text-slate-500 text-lg max-w-xl">
                    Acompanhe em tempo real tudo que você já aprendeu na plataforma. Seus dados são salvos automaticamente.
                  </p>
                </div>

                {/* Overall score */}
                <div className="flex-shrink-0">
                  <div className="flex items-center gap-4 bg-white border-2 border-slate-100 rounded-2xl p-4">
                    <div className="relative w-16 h-16">
                      <svg className="w-16 h-16 -rotate-90" viewBox="0 0 36 36">
                        <circle cx="18" cy="18" r="15.9" fill="none" stroke="#e2e8f0" strokeWidth="3" />
                        <circle cx="18" cy="18" r="15.9" fill="none" stroke="#10b981" strokeWidth="3" strokeDasharray={`${overallScore}, 100`} strokeLinecap="round" />
                      </svg>
                      <span className="absolute inset-0 flex items-center justify-center text-sm font-bold text-slate-800">{overallScore}%</span>
                    </div>
                    <div>
                      <p className="text-sm font-bold text-slate-900">Progresso Geral</p>
                      <p className="text-xs text-slate-400">Baseado em sinais, alfabeto e cursos</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Stats Grid */}
        <section className="py-8 px-4 md:px-8" data-guide="stats">
          <div className="max-w-6xl mx-auto">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
              <StatCard icon="ri-hand-heart-line" value={`${progress.learnedSigns.length}`} label={`de ${totalSigns} sinais`} color="text-emerald-700" bg="bg-emerald-50" link="/dictionary" />
              <StatCard icon="ri-keyboard-line" value={`${progress.learnedLetters.length}`} label={`de ${totalLetters} letras`} color="text-amber-700" bg="bg-amber-50" link="/alphabet" />
              <StatCard icon="ri-graduation-cap-line" value={`${progress.completedModules.length}`} label={`de ${totalModules} módulos`} color="text-teal-700" bg="bg-teal-50" link="/cursos" />
              <StatCard icon="ri-fire-line" value={progress.streakDays} label="dias seguidos" color="text-rose-700" bg="bg-rose-50" />
            </div>

            {/* Badges row */}
            <div className="mb-10">
              <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
                <div className="lg:col-span-1">
                  <BadgeMini badges={badges.badges} />
                </div>
                <div className="lg:col-span-3">
                  <div className="bg-white border border-slate-200 rounded-2xl p-6">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 flex items-center justify-center bg-amber-50 rounded-xl">
                          <i className="ri-trophy-line text-amber-600 text-lg"></i>
                        </div>
                        <div>
                          <h3 className="font-bold text-slate-900 text-sm">Conquistas de Flashcards</h3>
                          <p className="text-xs text-slate-400">Desbloqueadas estudando com SRS</p>
                        </div>
                      </div>
                      <Link to="/flashcards" className="text-xs font-semibold text-amber-600 hover:text-amber-700 flex items-center gap-1">
                        Ver todas <i className="ri-arrow-right-line"></i>
                      </Link>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="flex-1 h-2 bg-slate-100 rounded-full overflow-hidden">
                        <div className="h-full bg-gradient-to-r from-amber-400 to-orange-400 rounded-full transition-all duration-700" style={{ width: `${badgeProgress.percentage}%` }} />
                      </div>
                      <span className="text-xs font-bold text-amber-700">{badgeProgress.unlocked}/{badgeProgress.total}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Dicionário progress */}
              <div className="bg-white border border-slate-200 rounded-2xl p-6">
                <div className="flex items-center justify-between mb-5">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 flex items-center justify-center bg-emerald-50 rounded-xl">
                      <i className="ri-book-open-line text-emerald-600 text-lg"></i>
                    </div>
                    <div>
                      <h3 className="font-bold text-slate-900 text-sm">Dicionário de Sinais</h3>
                      <p className="text-xs text-slate-400">Sinais marcados como "aprendido"</p>
                    </div>
                  </div>
                  <span className="text-2xl font-extrabold text-emerald-600">{signPct}%</span>
                </div>
                <div className="bg-slate-100 rounded-full h-3 overflow-hidden mb-4">
                  <div className="h-full bg-gradient-to-r from-emerald-400 to-teal-500 rounded-full transition-all duration-500" style={{ width: `${signPct}%` }} />
                </div>
                <div className="flex items-center justify-between text-xs text-slate-400 mb-3">
                  <span>{progress.learnedSigns.length} aprendidos</span>
                  <span>{totalSigns - progress.learnedSigns.length} restantes</span>
                </div>
                {progress.learnedSigns.length === 0 ? (
                  <div className="text-center py-6 bg-slate-50 rounded-xl">
                    <i className="ri-hand-heart-line text-slate-300 text-3xl mb-2"></i>
                    <p className="text-sm text-slate-400">Nenhum sinal aprendido ainda</p>
                    <Link to="/dictionary" className="inline-flex items-center gap-1.5 mt-2 text-sm font-semibold text-emerald-600 hover:text-emerald-700">
                      <i className="ri-arrow-right-line"></i> Ir para o Dicionário
                    </Link>
                  </div>
                ) : (
                  <div className="flex flex-wrap gap-2">
                    {progress.learnedSigns.slice(0, 12).map((id) => {
                      const sign = signs.find((s) => s.id === id);
                      return sign ? (
                        <span key={id} className="inline-flex items-center gap-1 px-2.5 py-1 bg-emerald-50 text-emerald-700 text-xs font-medium rounded-lg border border-emerald-100">
                          <span>{sign.emoji}</span>
                          {sign.word}
                        </span>
                      ) : null;
                    })}
                    {progress.learnedSigns.length > 12 && (
                      <span className="px-2.5 py-1 bg-slate-50 text-slate-400 text-xs rounded-lg">+{progress.learnedSigns.length - 12} mais</span>
                    )}
                  </div>
                )}
              </div>

              {/* Alfabeto progress */}
              <div className="bg-white border border-slate-200 rounded-2xl p-6">
                <div className="flex items-center justify-between mb-5">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 flex items-center justify-center bg-amber-50 rounded-xl">
                      <i className="ri-keyboard-line text-amber-600 text-lg"></i>
                    </div>
                    <div>
                      <h3 className="font-bold text-slate-900 text-sm">Alfabeto Manual</h3>
                      <p className="text-xs text-slate-400">Letras aprendidas na datilologia</p>
                    </div>
                  </div>
                  <span className="text-2xl font-extrabold text-amber-600">{letterPct}%</span>
                </div>
                <div className="bg-slate-100 rounded-full h-3 overflow-hidden mb-4">
                  <div className="h-full bg-gradient-to-r from-amber-400 to-orange-400 rounded-full transition-all duration-500" style={{ width: `${letterPct}%` }} />
                </div>
                <div className="flex items-center justify-between text-xs text-slate-400 mb-3">
                  <span>{progress.learnedLetters.length} aprendidas</span>
                  <span>{totalLetters - progress.learnedLetters.length} restantes</span>
                </div>
                <div className="grid grid-cols-9 gap-1.5">
                  {alphabetData.map((l) => {
                    const learned = progress.learnedLetters.includes(l.letter);
                    return (
                      <div key={l.letter} className={`aspect-square flex items-center justify-center rounded-lg text-xs font-bold ${learned ? 'bg-emerald-500 text-white' : 'bg-slate-100 text-slate-400'}`}>
                        {l.letter}
                      </div>
                    );
                  })}
                </div>
                {progress.learnedLetters.length === 0 && (
                  <div className="text-center py-4">
                    <Link to="/alphabet" className="inline-flex items-center gap-1.5 text-sm font-semibold text-amber-600 hover:text-amber-700">
                      <i className="ri-arrow-right-line"></i> Começar Alfabeto
                    </Link>
                  </div>
                )}
              </div>

              {/* Cursos progress */}
              <div className="bg-white border border-slate-200 rounded-2xl p-6">
                <div className="flex items-center justify-between mb-5">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 flex items-center justify-center bg-teal-50 rounded-xl">
                      <i className="ri-graduation-cap-line text-teal-600 text-lg"></i>
                    </div>
                    <div>
                      <h3 className="font-bold text-slate-900 text-sm">Cursos e Módulos</h3>
                      <p className="text-xs text-slate-400">Módulos concluídos por nível</p>
                    </div>
                  </div>
                  <span className="text-2xl font-extrabold text-teal-600">{modulePct}%</span>
                </div>
                <div className="bg-slate-100 rounded-full h-3 overflow-hidden mb-5">
                  <div className="h-full bg-gradient-to-r from-teal-400 to-cyan-500 rounded-full transition-all duration-500" style={{ width: `${modulePct}%` }} />
                </div>
                <div className="space-y-3">
                  {(['basico', 'intermediario', 'avancado'] as const).map((level) => {
                    const info = levelInfo[level];
                    const levelModules = courseModules.filter((m) => m.level === level);
                    const completed = levelModules.filter((m) => progress.completedModules.includes(m.id)).length;
                    const pct = levelModules.length > 0 ? Math.round((completed / levelModules.length) * 100) : 0;
                    return (
                      <div key={level}>
                        <div className="flex items-center justify-between text-xs mb-1.5">
                          <span className={`font-semibold ${info.color}`}>{info.label}</span>
                          <span className="text-slate-400">{completed}/{levelModules.length} ({pct}%)</span>
                        </div>
                        <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
                          <div className={`h-full rounded-full bg-gradient-to-r ${info.gradient}`} style={{ width: `${pct}%` }} />
                        </div>
                      </div>
                    );
                  })}
                </div>
                {progress.completedModules.length === 0 && (
                  <div className="text-center py-4 mt-3 bg-slate-50 rounded-xl">
                    <p className="text-sm text-slate-400">Nenhum módulo concluído ainda</p>
                    <Link to="/cursos" className="inline-flex items-center gap-1.5 mt-2 text-sm font-semibold text-teal-600 hover:text-teal-700">
                      <i className="ri-arrow-right-line"></i> Explorar Cursos
                    </Link>
                  </div>
                )}
              </div>

              {/* Exercícios & Favoritos */}
              <div className="bg-white border border-slate-200 rounded-2xl p-6">
                <div className="flex items-center justify-between mb-5">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 flex items-center justify-center bg-rose-50 rounded-xl">
                      <i className="ri-pencil-ruler-2-line text-rose-600 text-lg"></i>
                    </div>
                    <div>
                      <h3 className="font-bold text-slate-900 text-sm">Atividades</h3>
                      <p className="text-xs text-slate-400">Exercícios e favoritos</p>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 flex items-center justify-center bg-amber-50 rounded-xl flex-shrink-0">
                      <i className="ri-pencil-line text-amber-600 text-lg"></i>
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-semibold text-slate-700">Exercícios realizados</p>
                      <p className="text-xs text-slate-400">{progress.exercisesTaken} quizzes finalizados</p>
                    </div>
                    <span className="text-lg font-bold text-amber-600">{progress.exercisesTaken}</span>
                  </div>

                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 flex items-center justify-center bg-red-50 rounded-xl flex-shrink-0">
                      <i className="ri-heart-fill text-red-500 text-lg"></i>
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-semibold text-slate-700">Sinais favoritos</p>
                      <p className="text-xs text-slate-400">{progress.favoriteSigns.length} salvos no dicionário</p>
                    </div>
                    <span className="text-lg font-bold text-red-500">{progress.favoriteSigns.length}</span>
                  </div>

                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 flex items-center justify-center bg-orange-50 rounded-xl flex-shrink-0">
                      <i className="ri-fire-line text-orange-500 text-lg"></i>
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-semibold text-slate-700">Sequência de dias</p>
                      <p className="text-xs text-slate-400">Dias consecutivos usando a plataforma</p>
                    </div>
                    <span className="text-lg font-bold text-orange-500">{progress.streakDays} dias</span>
                  </div>
                </div>

                {progress.favoriteSigns.length > 0 && (
                  <div className="mt-4 pt-4 border-t border-slate-100">
                    <p className="text-xs text-slate-400 font-medium mb-2">Seus favoritos:</p>
                    <div className="flex flex-wrap gap-1.5">
                      {progress.favoriteSigns.slice(0, 8).map((id) => {
                        const sign = signs.find((s) => s.id === id);
                        return sign ? (
                          <Link key={id} to="/dictionary" className="inline-flex items-center gap-1 px-2 py-1 bg-red-50 text-red-700 text-xs rounded-lg border border-red-100 hover:bg-red-100 transition-colors">
                            {sign.emoji} {sign.word}
                          </Link>
                        ) : null;
                      })}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Recent Activity */}
            <div className="mt-8 bg-white border border-slate-200 rounded-2xl p-6">
              <h3 className="text-base font-bold text-slate-900 mb-4 flex items-center gap-2">
                <i className="ri-time-line text-slate-400"></i>
                Atividade Recente
              </h3>
              {progress.lastActive ? (
                <div className="space-y-3">
                  <div className="flex items-center gap-3 text-sm text-slate-600">
                    <div className="w-8 h-8 flex items-center justify-center bg-emerald-50 rounded-lg flex-shrink-0">
                      <i className="ri-calendar-check-line text-emerald-600"></i>
                    </div>
                    <span>Última sessão: <strong>{new Date(progress.lastActive).toLocaleDateString('pt-BR', { day: 'numeric', month: 'long', year: 'numeric' })}</strong></span>
                  </div>
                  {progress.learnedSigns.length > 0 && (
                    <div className="flex items-center gap-3 text-sm text-slate-600">
                      <div className="w-8 h-8 flex items-center justify-center bg-amber-50 rounded-lg flex-shrink-0">
                        <i className="ri-hand-heart-line text-amber-600"></i>
                      </div>
                      <span>{progress.learnedSigns.length} sinais marcados como aprendidos no dicionário</span>
                    </div>
                  )}
                  {progress.learnedLetters.length > 0 && (
                    <div className="flex items-center gap-3 text-sm text-slate-600">
                      <div className="w-8 h-8 flex items-center justify-center bg-teal-50 rounded-lg flex-shrink-0">
                        <i className="ri-keyboard-line text-teal-600"></i>
                      </div>
                      <span>{progress.learnedLetters.length} letras do alfabeto manual aprendidas</span>
                    </div>
                  )}
                </div>
              ) : (
                <div className="text-center py-6">
                  <i className="ri-time-line text-slate-300 text-3xl mb-2"></i>
                  <p className="text-sm text-slate-400">Nenhuma atividade registrada ainda. Explore a plataforma!</p>
                </div>
              )}
            </div>

            {/* Quick Actions */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 mt-8">
              <Link to="/dictionary" className="flex items-center gap-3 px-5 py-4 bg-emerald-50 border border-emerald-200 rounded-2xl hover:bg-emerald-100 transition-colors cursor-pointer">
                <div className="w-10 h-10 flex items-center justify-center bg-emerald-500 text-white rounded-xl">
                  <i className="ri-book-open-line text-lg"></i>
                </div>
                <div>
                  <p className="text-sm font-bold text-emerald-800">Dicionário</p>
                  <p className="text-xs text-emerald-600">Aprenda novos sinais</p>
                </div>
                <i className="ri-arrow-right-line text-emerald-400 ml-auto"></i>
              </Link>
              <Link to="/frases" className="flex items-center gap-3 px-5 py-4 bg-violet-50 border border-violet-200 rounded-2xl hover:bg-violet-100 transition-colors cursor-pointer">
                <div className="w-10 h-10 flex items-center justify-center bg-violet-500 text-white rounded-xl">
                  <i className="ri-chat-quote-line text-lg"></i>
                </div>
                <div>
                  <p className="text-sm font-bold text-violet-800">Frases</p>
                  <p className="text-xs text-violet-600">Cenários do dia a dia</p>
                </div>
                <i className="ri-arrow-right-line text-violet-400 ml-auto"></i>
              </Link>
              <Link to="/flashcards" className="flex items-center gap-3 px-5 py-4 bg-sky-50 border border-sky-200 rounded-2xl hover:bg-sky-100 transition-colors cursor-pointer">
                <div className="w-10 h-10 flex items-center justify-center bg-sky-500 text-white rounded-xl">
                  <i className="ri-stack-line text-lg"></i>
                </div>
                <div>
                  <p className="text-sm font-bold text-sky-800">Flashcards</p>
                  <p className="text-xs text-sky-600">Memorização SRS</p>
                </div>
                <i className="ri-arrow-right-line text-sky-400 ml-auto"></i>
              </Link>
              <Link to="/exercicios" className="flex items-center gap-3 px-5 py-4 bg-amber-50 border border-amber-200 rounded-2xl hover:bg-amber-100 transition-colors cursor-pointer">
                <div className="w-10 h-10 flex items-center justify-center bg-amber-500 text-white rounded-xl">
                  <i className="ri-pencil-ruler-2-line text-lg"></i>
                </div>
                <div>
                  <p className="text-sm font-bold text-amber-800">Exercícios</p>
                  <p className="text-xs text-amber-600">Teste seu conhecimento</p>
                </div>
                <i className="ri-arrow-right-line text-amber-400 ml-auto"></i>
              </Link>
              <Link to="/cursos" className="flex items-center gap-3 px-5 py-4 bg-teal-50 border border-teal-200 rounded-2xl hover:bg-teal-100 transition-colors cursor-pointer">
                <div className="w-10 h-10 flex items-center justify-center bg-teal-500 text-white rounded-xl">
                  <i className="ri-graduation-cap-line text-lg"></i>
                </div>
                <div>
                  <p className="text-sm font-bold text-teal-800">Cursos</p>
                  <p className="text-xs text-teal-600">Continue aprendendo</p>
                </div>
                <i className="ri-arrow-right-line text-teal-400 ml-auto"></i>
              </Link>
            </div>
          </div>
        </section>

        <Footer />
      </div>
      <InterpreterGuide />
    </>
  );
}