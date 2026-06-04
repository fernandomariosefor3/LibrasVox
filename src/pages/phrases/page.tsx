import { scenarios } from '@/mocks/phrases';
import { signs } from '@/mocks/signs';
import { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '@/components/feature/Navbar';
import Footer from '@/components/feature/Footer';
import { SEOHead } from '@/components/feature/SEOHead';
import { pageSEO, SITE_URL, generateWebPageSchema } from '@/lib/seo';
import ScenarioCard from './components/ScenarioCard';
import ScenarioDetail from './components/ScenarioDetail';

export default function PhrasesPage() {
  const [filter, setFilter] = useState<'todos' | 'iniciante' | 'intermediario' | 'avancado'>('todos');
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const filtered = useMemo(() => {
    if (filter === 'todos') return scenarios;
    return scenarios.filter((s) => s.difficulty === filter);
  }, [filter]);

  const selectedScenario = useMemo(() => {
    if (!selectedId) return null;
    const scenario = scenarios.find((s) => s.id === selectedId);
    if (!scenario) return null;
    const signsMap = scenario.signs.map((ps) => {
      const sign = signs.find((s) => s.id === ps.signId);
      return { ...ps, sign: sign || null };
    });
    return { ...scenario, signs: signsMap };
  }, [selectedId]);

  const counts = {
    todos: scenarios.length,
    iniciante: scenarios.filter((s) => s.difficulty === 'iniciante').length,
    intermediario: scenarios.filter((s) => s.difficulty === 'intermediario').length,
    avancado: scenarios.filter((s) => s.difficulty === 'avancado').length,
  };

  const seo = pageSEO.phrases || pageSEO.home;
  const canonical = `${SITE_URL}/frases`;

  return (
    <>
      <SEOHead
        title="Frases por Contexto — LVP"
        description="Aprenda Libras com frases do dia a dia. Cenários como restaurante, hospital, trabalho e compras com sequências de sinais, glossa e explicações gramaticais."
        keywords="frases Libras, contexto Libras, survival Libras, cenários Libras, conversação Libras"
        canonical={canonical}
        ogTitle="Frases por Contexto — LVP"
        ogDescription="Aprenda frases práticas de Libras para situações do cotidiano."
        ogType="website"
        ogUrl={canonical}
        schema={[generateWebPageSchema("Frases por Contexto — LVP", seo.description, canonical)]}
      />
      <div className="min-h-screen bg-white">
        <Navbar />

        <div className="pt-24 pb-16">
          {/* Header */}
          <div className="max-w-6xl mx-auto px-4 md:px-8">
            <div className="mb-8">
              <div className="flex items-center gap-2 mb-2">
                <Link
                  to="/"
                  className="text-sm text-slate-500 hover:text-emerald-600 transition-colors"
                >
                  Início
                </Link>
                <span className="text-slate-300">/</span>
                <span className="text-sm text-slate-500">Frases por Contexto</span>
              </div>
              <h1 className="text-3xl md:text-4xl font-bold text-slate-900 mb-3">
                Frases por Contexto
              </h1>
              <p className="text-slate-600 text-base md:text-lg max-w-2xl leading-relaxed">
                Aprenda Libras através de <strong className="text-slate-900">cenários do dia a dia</strong>. Cada frase mostra a sequência de sinais, a glossa em Libras e dicas gramaticais para você se comunicar de verdade.
              </p>
            </div>

            {/* Stats + Filters */}
            <div className="flex flex-col sm:flex-row sm:items-center gap-4 mb-10">
              <div className="flex items-center gap-1.5 bg-slate-50 border border-slate-200 rounded-xl p-1">
                {(
                  [
                    { key: 'todos', label: 'Todos' },
                    { key: 'iniciante', label: 'Iniciante' },
                    { key: 'intermediario', label: 'Intermediário' },
                    { key: 'avancado', label: 'Avançado' },
                  ] as const
                ).map((tab) => {
                  const active = filter === tab.key;
                  return (
                    <button
                      key={tab.key}
                      onClick={() => setFilter(tab.key)}
                      className={`px-3.5 py-2 rounded-lg text-sm font-medium transition-all cursor-pointer whitespace-nowrap ${
                        active
                          ? 'bg-white text-emerald-700 shadow-sm border border-slate-200'
                          : 'text-slate-500 hover:text-slate-700 hover:bg-slate-100'
                      }`}
                    >
                      {tab.label}
                      <span
                        className={`ml-1.5 text-xs px-1.5 py-0.5 rounded-full ${
                          active ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-200 text-slate-500'
                        }`}
                      >
                        {counts[tab.key]}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Grid */}
            {filtered.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                {filtered.map((scenario) => (
                  <ScenarioCard
                    key={scenario.id}
                    scenario={scenario}
                    onClick={() => setSelectedId(scenario.id)}
                  />
                ))}
              </div>
            ) : (
              <div className="text-center py-20">
                <div className="w-16 h-16 flex items-center justify-center bg-slate-100 rounded-2xl mx-auto mb-4">
                  <i className="ri-chat-off-line text-2xl text-slate-400"></i>
                </div>
                <p className="text-slate-500 text-base">Nenhum cenário encontrado para este filtro.</p>
              </div>
            )}
          </div>
        </div>

        {/* Detail Modal */}
        {selectedScenario && (
          <ScenarioDetail
            scenario={selectedScenario}
            onClose={() => setSelectedId(null)}
          />
        )}

        <Footer />
      </div>
    </>
  );
}