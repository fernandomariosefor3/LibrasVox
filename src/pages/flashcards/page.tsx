import { useState, useEffect, useCallback } from 'react';
import Navbar from '@/components/feature/Navbar';
import Footer from '@/components/feature/Footer';
import { SEOHead } from '@/components/feature/SEOHead';
import { pageSEO, SITE_URL, generateWebPageSchema, generateLearningResourceSchema } from '@/lib/seo';
import InterpreterGuide from '@/components/feature/InterpreterGuide';
import { useSRS } from '@/hooks/useSRS';
import { useBadges } from '@/hooks/useBadges';
import { signs } from '@/mocks/signs';
import StudySession from './components/StudySession';
import DeckOverview from './components/DeckOverview';
import ManageDeck from './components/ManageDeck';
import BadgesPanel from './components/BadgesPanel';
import BadgeMini from './components/BadgeMini';

type Tab = 'study' | 'deck' | 'manage' | 'badges';

export default function FlashcardsPage() {
  const [tab, setTab] = useState<Tab>('study');
  const [visible, setVisible] = useState(false);
  const srs = useSRS();
  const badges = useBadges();

  useEffect(() => {
    const t = setTimeout(() => setVisible(true), 80);
    return () => clearTimeout(t);
  }, []);

  const handleStudyComplete = useCallback(() => {
    srs.refresh();
    setTab('study');
  }, [srs]);

  const seo = pageSEO.flashcards;
  const canonical = `${SITE_URL}/flashcards`;

  const schema = [
    generateWebPageSchema(seo.title, seo.description, canonical),
    generateLearningResourceSchema('Flashcards SRS para Libras', 'Memorização inteligente de sinais de Libras com repetição espaçada.', canonical),
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
        <section className="pt-28 pb-10 px-4 md:px-8 bg-gradient-to-b from-emerald-50 to-white" data-guide="header">
          <div className="max-w-5xl mx-auto">
            <div className={`transition-all duration-700 ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
              <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-emerald-100 border border-emerald-200 rounded-full text-emerald-700 text-sm font-semibold mb-5">
                <i className="ri-flashlight-line"></i>
                Flashcards SRS
              </div>
              <h1
                className="text-4xl md:text-5xl font-extrabold text-slate-900 leading-tight mb-4"
                style={{ fontFamily: 'Plus Jakarta Sans, sans-serif' }}
              >
                Memorização{' '}
                <em className="not-italic text-transparent bg-clip-text bg-gradient-to-r from-emerald-500 to-teal-500">
                  Inteligente
                </em>
              </h1>
              <p className="text-slate-500 text-lg leading-relaxed max-w-2xl">
                Aprenda sinais de Libras com flashcards que adaptam a frequência de revisão ao seu desempenho. 
                Baseado no algoritmo de repetição espaçada para fixação duradoura.
              </p>
            </div>
          </div>
        </section>

        {/* Tabs */}
        <section className="py-6 px-4 md:px-8 border-b border-slate-100">
          <div className="max-w-5xl mx-auto">
            <div className="flex gap-2 flex-wrap">
              {[
                { key: 'study' as Tab, label: 'Estudar', icon: 'ri-flashlight-line', badge: srs.stats.dueNow },
                { key: 'deck' as Tab, label: 'Meu Deck', icon: 'ri-stack-line', badge: srs.stats.totalCards },
                { key: 'manage' as Tab, label: 'Adicionar Sinais', icon: 'ri-add-circle-line', badge: 0 },
                { key: 'badges' as Tab, label: 'Conquistas', icon: 'ri-trophy-line', badge: badges.getUnlockedCount() },
              ].map((t) => (
                <button
                  key={t.key}
                  onClick={() => setTab(t.key)}
                  className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold border transition-all duration-200 cursor-pointer whitespace-nowrap ${
                    tab === t.key
                      ? 'bg-slate-800 text-white border-slate-800'
                      : 'bg-white text-slate-500 border-slate-200 hover:border-slate-300'
                  }`}
                >
                  <i className={`${t.icon} text-base`}></i>
                  {t.label}
                  {t.badge > 0 && (
                    <span className="text-xs bg-white/20 text-inherit px-1.5 py-0.5 rounded-full">
                      {t.badge}
                    </span>
                  )}
                </button>
              ))}
            </div>
          </div>
        </section>

        {/* Content */}
        <section className="py-8 px-4 md:px-8 pb-20">
          <div className="max-w-5xl mx-auto">
            {tab === 'study' && (
              <StudySession onComplete={handleStudyComplete} />
            )}
            {tab === 'deck' && (
              <>
                <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 mb-8">
                  <div className="lg:col-span-1">
                    <BadgeMini badges={badges.badges} />
                  </div>
                  <div className="lg:col-span-3">
                    <DeckOverview />
                  </div>
                </div>
              </>
            )}
            {tab === 'manage' && (
              <ManageDeck />
            )}
            {tab === 'badges' && (
              <BadgesPanel badges={badges.badges} />
            )}
          </div>
        </section>

        <Footer />
      </div>
      <InterpreterGuide />
    </>
  );
}