import { useState, useEffect, useRef } from 'react';
import Navbar from '@/components/feature/Navbar';
import Footer from '@/components/feature/Footer';
import { SEOHead } from '@/components/feature/SEOHead';
import { pageSEO, SITE_URL, generateWebPageSchema, generateCourseSchema } from '@/lib/seo';
import { courseModules, levelInfo, type CourseLevel } from '@/mocks/courses';
import LevelCard from './components/LevelCard';
import ModuleCard from './components/ModuleCard';
import InterpreterGuide from '@/components/feature/InterpreterGuide';

export default function CoursesPage() {
  const [activeLevel, setActiveLevel] = useState<CourseLevel>('basico');
  const [visible, setVisible] = useState(false);
  const [modulesVisible, setModulesVisible] = useState(false);
  const heroRef = useRef<HTMLDivElement>(null);
  const modulesRef = useRef<HTMLDivElement>(null);

  const completedModules: string[] = JSON.parse(
    localStorage.getItem('completedModules') || '[]',
  );

  const filteredModules = courseModules.filter((m) => m.level === activeLevel);
  const info = levelInfo[activeLevel];

  useEffect(() => {
    const t = setTimeout(() => setVisible(true), 80);
    return () => clearTimeout(t);
  }, []);

  useEffect(() => {
    setModulesVisible(false);
    const t = setTimeout(() => setModulesVisible(true), 100);
    return () => clearTimeout(t);
  }, [activeLevel]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setModulesVisible(true); },
      { threshold: 0.1 },
    );
    if (modulesRef.current) observer.observe(modulesRef.current);
    return () => observer.disconnect();
  }, []);

  const totalModules = courseModules.length;
  const totalHours = '14h 30min';

  const seo = pageSEO.courses;
  const canonical = `${SITE_URL}/cursos`;

  const schema = [
    generateWebPageSchema(seo.title, seo.description, canonical),
    generateCourseSchema('Cursos de Libras — Do Básico ao Avançado', 'Módulos acadêmicos estruturados de Libras com gramática, vocabulário, classificadores e interpretação.', canonical),
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
        <section className="pt-28 pb-16 px-4 md:px-8 bg-gradient-to-b from-slate-50 to-white" data-guide="header">
          <div className="max-w-7xl mx-auto">
            <div
              className={`transition-all duration-700 ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}
            >
              <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-emerald-50 border border-emerald-200 rounded-full text-emerald-700 text-sm font-semibold mb-6">
                <i className="ri-graduation-cap-line"></i>
                Plataforma Acadêmica de Libras
              </div>
              <h1
                className="text-4xl md:text-6xl font-extrabold text-slate-900 leading-tight mb-5"
               
              >
                Cursos de{' '}
                <em className="not-italic text-transparent bg-clip-text bg-gradient-to-r from-emerald-500 to-teal-500">
                  Libras
                </em>
                <br />
                <span className="text-3xl md:text-4xl text-slate-600 font-bold">
                  Do básico à interpretação profissional
                </span>
              </h1>
              <p className="text-slate-500 text-lg max-w-2xl leading-relaxed mb-8">
                Currículo estruturado com base nos referenciais acadêmicos da Linguística da Libras. Cada módulo inclui objetivos de aprendizagem, conteúdo teórico, exercícios práticos e avaliação.
              </p>

              {/* Stats bar */}
              <div className="flex flex-wrap gap-6">
                {[
                  { icon: 'ri-book-2-line', value: `${totalModules} módulos`, label: 'em 3 níveis' },
                  { icon: 'ri-time-line', value: totalHours, label: 'de conteúdo' },
                  { icon: 'ri-award-line', value: '3 certificados', label: 'por nível' },
                  { icon: 'ri-user-star-line', value: 'Referencial', label: 'acadêmico' },
                ].map((s) => (
                  <div key={s.label} className="flex items-center gap-2">
                    <div className="w-9 h-9 flex items-center justify-center bg-emerald-50 border border-emerald-200 rounded-xl">
                      <i className={`${s.icon} text-emerald-600 text-base`}></i>
                    </div>
                    <div>
                      <p className="text-sm font-bold text-slate-900">{s.value}</p>
                      <p className="text-xs text-slate-400">{s.label}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Main content */}
        <section className="py-12 px-4 md:px-8" data-guide="modules">
          <div className="max-w-7xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">

              {/* Sidebar — level selector */}
              <aside className="lg:col-span-1">
                <div className="sticky top-24 space-y-3">
                  <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-3">
                    Selecione o Nível
                  </p>
                  {(['basico', 'intermediario', 'avancado'] as CourseLevel[]).map((level) => (
                    <LevelCard
                      key={level}
                      level={level}
                      isActive={activeLevel === level}
                      onClick={() => setActiveLevel(level)}
                    />
                  ))}

                  {/* Progress summary */}
                  <div className="mt-4 p-4 bg-slate-50 rounded-2xl border border-slate-200">
                    <p className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-3">
                      Seu Progresso
                    </p>
                    <div className="space-y-2">
                      {(['basico', 'intermediario', 'avancado'] as CourseLevel[]).map((level) => {
                        const total = courseModules.filter((m) => m.level === level).length;
                        const done = courseModules.filter(
                          (m) => m.level === level && completedModules.includes(m.id),
                        ).length;
                        const pct = total > 0 ? Math.round((done / total) * 100) : 0;
                        const li = levelInfo[level];
                        return (
                          <div key={level}>
                            <div className="flex justify-between text-xs mb-1">
                              <span className={`font-semibold ${li.color}`}>{li.label}</span>
                              <span className="text-slate-400">{done}/{total}</span>
                            </div>
                            <div className="h-1.5 bg-slate-200 rounded-full overflow-hidden">
                              <div
                                className={`h-full rounded-full bg-gradient-to-r ${li.gradient} transition-all duration-500`}
                                style={{ width: `${pct}%` }}
                              />
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              </aside>

              {/* Module list */}
              <div ref={modulesRef} className="lg:col-span-3">
                {/* Level header */}
                <div className={`flex items-center gap-4 mb-6 p-5 rounded-2xl border-2 ${info.border} ${info.bg}`}>
                  <div className={`w-12 h-12 flex items-center justify-center rounded-xl bg-gradient-to-br ${info.gradient} flex-shrink-0`}>
                    <i className={`${info.icon} text-white text-xl`}></i>
                  </div>
                  <div>
                    <h2
                      className={`text-xl font-extrabold ${info.color}`}
                     
                    >
                      Nível {info.label}
                    </h2>
                    <p className="text-sm text-slate-600">{info.description}</p>
                  </div>
                  <div className="ml-auto flex items-center gap-3 flex-shrink-0">
                    <div className="text-right">
                      <p className="text-xs text-slate-400">Carga horária</p>
                      <p className={`text-sm font-bold ${info.color}`}>{info.hours}</p>
                    </div>
                  </div>
                </div>

                {/* Modules */}
                <div className="space-y-4">
                  {filteredModules.map((module, idx) => {
                    const isCompleted = completedModules.includes(module.id);
                    const isLocked =
                      activeLevel !== 'basico' && idx > 0 && !completedModules.includes(filteredModules[idx - 1].id);
                    return (
                      <ModuleCard
                        key={module.id}
                        module={module}
                        index={idx}
                        isCompleted={isCompleted}
                        isLocked={isLocked}
                        visible={modulesVisible}
                      />
                    );
                  })}
                </div>

                {/* Certificate teaser */}
                <div className={`mt-8 p-6 rounded-2xl border-2 ${info.border} ${info.bg} flex items-center gap-5`}>
                  <div className={`w-14 h-14 flex items-center justify-center rounded-2xl bg-gradient-to-br ${info.gradient} flex-shrink-0`}>
                    <i className="ri-award-fill text-white text-2xl"></i>
                  </div>
                  <div className="flex-1">
                    <h3 className={`text-base font-bold ${info.color} mb-1`}>
                      Certificado de Conclusão — Nível {info.label}
                    </h3>
                    <p className="text-sm text-slate-600">
                      Conclua todos os módulos e quizzes do nível {info.label} para receber seu certificado digital de conclusão.
                    </p>
                  </div>
                  <button className={`flex-shrink-0 px-4 py-2.5 rounded-xl text-white text-sm font-bold bg-gradient-to-r ${info.gradient} hover:opacity-90 transition-all cursor-pointer whitespace-nowrap`}>
                    Ver certificado
                  </button>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Academic references strip */}
        <section className="py-10 px-4 md:px-8 bg-slate-50 border-t border-slate-200">
          <div className="max-w-7xl mx-auto">
            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest text-center mb-5">
              Referencial Teórico
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              {[
                'Quadros & Karnopp (2004) — Língua de Sinais Brasileira',
                'Ferreira Brito (1995) — Por uma Gramática de Línguas de Sinais',
                'Decreto 5.626/2005 — Regulamentação da Libras',
                'Lei 10.436/2002 — Reconhecimento da Libras',
                'INES — Instituto Nacional de Educação de Surdos',
              ].map((ref) => (
                <span
                  key={ref}
                  className="text-xs text-slate-500 bg-white border border-slate-200 rounded-full px-4 py-2 font-medium"
                >
                  {ref}
                </span>
              ))}
            </div>
          </div>
        </section>

        <Footer />
      </div>
      <InterpreterGuide />
    </>
  );
}
