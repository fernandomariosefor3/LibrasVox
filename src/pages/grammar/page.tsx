import { useState, useEffect } from 'react';
import Navbar from '@/components/feature/Navbar';
import Footer from '@/components/feature/Footer';
import { SEOHead } from '@/components/feature/SEOHead';
import { pageSEO, SITE_URL, generateWebPageSchema, generateLearningResourceSchema } from '@/lib/seo';
import { grammarTopics } from '@/mocks/grammar';
import TopicSidebar from './components/TopicSidebar';
import TopicContent from './components/TopicContent';
import InterpreterGuide from '@/components/feature/InterpreterGuide';

export default function GrammarPage() {
  const [activeTopicId, setActiveTopicId] = useState(grammarTopics[0].id);
  const [visible, setVisible] = useState(false);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setVisible(true), 80);
    return () => clearTimeout(t);
  }, []);

  const activeTopic = grammarTopics.find((t) => t.id === activeTopicId) ?? grammarTopics[0];

  const handleSelect = (id: string) => {
    setActiveTopicId(id);
    setMobileSidebarOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const seo = pageSEO.grammar;
  const canonical = `${SITE_URL}/gramatica`;

  const schema = [
    generateWebPageSchema(seo.title, seo.description, canonical),
    generateLearningResourceSchema('Gramática da Libras', 'Estudo sistemático da fonologia, morfologia, sintaxe e discurso em Libras.', canonical),
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
        <section className="pt-28 pb-10 px-4 md:px-8 bg-gradient-to-b from-slate-50 to-white border-b border-slate-100" data-guide="header">
          <div className="max-w-7xl mx-auto">
            <div
              className={`transition-all duration-700 ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}
            >
              <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4">
                <div>
                  <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-teal-50 border border-teal-200 rounded-full text-teal-700 text-sm font-semibold mb-4">
                    <i className="ri-book-open-line"></i>
                    Gramática Acadêmica
                  </div>
                  <h1
                    className="text-4xl md:text-5xl font-extrabold text-slate-900 leading-tight mb-3"
                   
                  >
                    Gramática da{' '}
                    <em className="not-italic text-transparent bg-clip-text bg-gradient-to-r from-teal-500 to-emerald-500">
                      Libras
                    </em>
                  </h1>
                  <p className="text-slate-500 text-base md:text-lg leading-relaxed max-w-2xl">
                    Estudo sistemático da estrutura linguística da Língua Brasileira de Sinais, baseado nos referenciais de Quadros &amp; Karnopp (2004) e Ferreira Brito (1995).
                  </p>
                </div>

                {/* Stats */}
                <div className="flex flex-wrap gap-4 md:flex-col md:items-end">
                  {[
                    { icon: 'ri-book-2-line', value: `${grammarTopics.length} tópicos`, label: 'gramaticais' },
                    { icon: 'ri-user-star-line', value: 'Nível', label: 'Básico ao Avançado' },
                  ].map((s) => (
                    <div key={s.label} className="flex items-center gap-2">
                      <div className="w-8 h-8 flex items-center justify-center bg-teal-50 border border-teal-200 rounded-lg">
                        <i className={`${s.icon} text-teal-600 text-sm`}></i>
                      </div>
                      <div>
                        <p className="text-sm font-bold text-slate-900 leading-none">{s.value}</p>
                        <p className="text-xs text-slate-400">{s.label}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Topic pills — quick nav */}
              <div className="flex flex-wrap gap-2 mt-6">
                {grammarTopics.map((topic) => (
                  <button
                    key={topic.id}
                    onClick={() => handleSelect(topic.id)}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold border transition-all duration-200 cursor-pointer whitespace-nowrap ${
                      activeTopicId === topic.id
                        ? `${topic.bg} ${topic.color} ${topic.border}`
                        : 'bg-white text-slate-500 border-slate-200 hover:border-slate-300'
                    }`}
                  >
                    <i className={`${topic.icon} text-xs`}></i>
                    {topic.title}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Mobile sidebar toggle */}
        <div className="lg:hidden sticky top-16 z-30 bg-white border-b border-slate-100 px-4 py-2">
          <button
            onClick={() => setMobileSidebarOpen(true)}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-50 border border-slate-200 text-slate-700 text-sm font-semibold cursor-pointer w-full"
          >
            <i className={`${activeTopic.icon} text-base`}></i>
            <span className="flex-1 text-left truncate">{activeTopic.title}</span>
            <i className="ri-arrow-down-s-line text-slate-400"></i>
          </button>
        </div>

        {/* Mobile sidebar overlay */}
        {mobileSidebarOpen && (
          <div className="fixed inset-0 z-50 lg:hidden">
            <div
              className="absolute inset-0 bg-black/40"
              onClick={() => setMobileSidebarOpen(false)}
            />
            <div className="absolute left-0 top-0 bottom-0 w-80 bg-white flex flex-col pt-6 px-4 pb-8 overflow-y-auto">
              <div className="flex items-center justify-between mb-4">
                <span className="font-bold text-slate-900">Tópicos Gramaticais</span>
                <button
                  onClick={() => setMobileSidebarOpen(false)}
                  className="w-8 h-8 flex items-center justify-center text-slate-500 hover:bg-slate-100 rounded-lg cursor-pointer"
                >
                  <i className="ri-close-line text-xl"></i>
                </button>
              </div>
              <TopicSidebar
                topics={grammarTopics}
                activeId={activeTopicId}
                onSelect={handleSelect}
              />
            </div>
          </div>
        )}

        {/* Main layout */}
        <section className="py-10 px-4 md:px-8 pb-20" data-guide="topics">
          <div className="max-w-7xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">

              {/* Sidebar — desktop */}
              <aside className="hidden lg:block lg:col-span-1">
                <div className="sticky top-24">
                  <TopicSidebar
                    topics={grammarTopics}
                    activeId={activeTopicId}
                    onSelect={handleSelect}
                  />
                </div>
              </aside>

              {/* Content */}
              <main className="lg:col-span-3">
                <TopicContent topic={activeTopic} />

                {/* Prev / Next navigation */}
                <div className="flex items-center justify-between mt-8 pt-6 border-t border-slate-100">
                  {(() => {
                    const idx = grammarTopics.findIndex((t) => t.id === activeTopicId);
                    const prev = grammarTopics[idx - 1];
                    const next = grammarTopics[idx + 1];
                    return (
                      <>
                        {prev ? (
                          <button
                            onClick={() => handleSelect(prev.id)}
                            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white border border-slate-200 text-slate-600 text-sm font-semibold hover:border-slate-300 transition-all cursor-pointer"
                          >
                            <i className="ri-arrow-left-line"></i>
                            <span className="hidden sm:inline">{prev.title}</span>
                            <span className="sm:hidden">Anterior</span>
                          </button>
                        ) : (
                          <div />
                        )}
                        {next ? (
                          <button
                            onClick={() => handleSelect(next.id)}
                            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-white text-sm font-semibold transition-all cursor-pointer bg-gradient-to-r ${next.gradient} hover:opacity-90 active:scale-95`}
                          >
                            <span className="hidden sm:inline">{next.title}</span>
                            <span className="sm:hidden">Próximo</span>
                            <i className="ri-arrow-right-line"></i>
                          </button>
                        ) : (
                          <div />
                        )}
                      </>
                    );
                  })()}
                </div>
              </main>
            </div>
          </div>
        </section>

        {/* Bottom CTA */}
        <section className="py-12 px-4 md:px-8 bg-gradient-to-br from-slate-50 to-white border-t border-slate-100">
          <div className="max-w-4xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-emerald-50 border border-emerald-200 rounded-full text-emerald-700 text-sm font-semibold mb-4">
              <i className="ri-graduation-cap-line"></i>
              Continue Aprendendo
            </div>
            <h2
              className="text-2xl md:text-3xl font-extrabold text-slate-900 mb-3"
             
            >
              Pratique o que aprendeu
            </h2>
            <p className="text-slate-500 text-base mb-6 max-w-xl mx-auto">
              Teste seu conhecimento gramatical com exercícios práticos ou explore os módulos de curso para aprofundar o aprendizado.
            </p>
            <div className="flex flex-wrap justify-center gap-3">
              <a
                href="/exercicios"
                className="flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 text-white text-sm font-bold hover:opacity-90 transition-all cursor-pointer whitespace-nowrap"
              >
                <i className="ri-pencil-ruler-2-line"></i>
                Fazer Exercícios
              </a>
              <a
                href="/cursos"
                className="flex items-center gap-2 px-6 py-3 rounded-xl bg-white border-2 border-slate-200 text-slate-700 text-sm font-bold hover:border-slate-300 transition-all cursor-pointer whitespace-nowrap"
              >
                <i className="ri-graduation-cap-line"></i>
                Ver Módulos de Curso
              </a>
              <a
                href="/referencias"
                className="flex items-center gap-2 px-6 py-3 rounded-xl bg-white border-2 border-slate-200 text-slate-700 text-sm font-bold hover:border-slate-300 transition-all cursor-pointer whitespace-nowrap"
              >
                <i className="ri-file-text-line"></i>
                Referências Bibliográficas
              </a>
            </div>
          </div>
        </section>

        <Footer />
      </div>
      <InterpreterGuide />
    </>
  );
}
