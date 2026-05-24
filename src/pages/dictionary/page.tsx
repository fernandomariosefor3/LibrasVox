import { useState, useMemo } from 'react';
import Navbar from '@/components/feature/Navbar';
import Footer from '@/components/feature/Footer';
import { SEOHead } from '@/components/feature/SEOHead';
import { pageSEO, SITE_URL, generateWebPageSchema, generateCourseSchema } from '@/lib/seo';
import DictionaryHeader from './components/DictionaryHeader';
import CategoryFilter from './components/CategoryFilter';
import SignCard from './components/SignCard';
import SignModal from './components/SignModal';
import { signs, searchSigns, getSignsByCategory, Sign } from '@/mocks/signs/index';
import { useFavorites } from '@/hooks/useFavorites';
import { useLearnedSigns } from '@/hooks/useLearnedSigns';
import InterpreterGuide from '@/components/feature/InterpreterGuide';

export default function DictionaryPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('Todos');
  const [showFavoritesOnly, setShowFavoritesOnly] = useState(false);
  const [selectedSign, setSelectedSign] = useState<Sign | null>(null);

  const { favorites, toggleFavorite, isFavorite } = useFavorites();
  const { learned, toggleLearned, isLearned } = useLearnedSigns();

  const filteredSigns = useMemo(() => {
    let result = searchQuery.trim() ? searchSigns(searchQuery) : getSignsByCategory(activeCategory);
    if (showFavoritesOnly) result = result.filter((s) => favorites.includes(s.id));
    return result;
  }, [searchQuery, activeCategory, showFavoritesOnly, favorites]);

  const handleCategoryChange = (cat: string) => {
    setActiveCategory(cat);
    setShowFavoritesOnly(false);
    setSearchQuery('');
  };

  const handleToggleFavorites = () => {
    setShowFavoritesOnly((v) => !v);
    if (!showFavoritesOnly) setActiveCategory('Todos');
  };

  const seo = pageSEO.dictionary;
  const canonical = `${SITE_URL}/dictionary`;
  
  const schema = [
    generateWebPageSchema(seo.title, seo.description, canonical),
    generateCourseSchema('Dicionário de Libras', 'Dicionário completo de sinais em Libras com instruções passo a passo', canonical),
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
      <main className="min-h-screen bg-slate-50">
        <Navbar />

        {/* Header + search */}
        <div data-guide="header">
          <DictionaryHeader
            learnedCount={learned.length}
            favoritesCount={favorites.length}
            searchQuery={searchQuery}
            onSearchChange={(q) => { setSearchQuery(q); if (q) setShowFavoritesOnly(false); }}
          />
        </div>

        {/* Category filter */}
        <div data-guide="filter">
          <CategoryFilter
            active={activeCategory}
            onChange={handleCategoryChange}
            showFavoritesOnly={showFavoritesOnly}
            onToggleFavorites={handleToggleFavorites}
            favoritesCount={favorites.length}
          />
        </div>

        {/* Results */}
        <div className="max-w-7xl mx-auto px-4 md:px-8 py-8" data-guide="grid">
          {/* Result count */}
          <div className="flex items-center justify-between mb-6">
            <p className="text-slate-500 text-sm">
              {filteredSigns.length === 0
                ? 'Nenhum sinal encontrado'
                : `${filteredSigns.length} ${filteredSigns.length === 1 ? 'sinal' : 'sinais'} encontrado${filteredSigns.length === 1 ? '' : 's'}`}
              {searchQuery && <span className="text-slate-400"> para &quot;{searchQuery}&quot;</span>}
              {showFavoritesOnly && <span className="text-amber-500 font-medium"> nos seus favoritos</span>}
            </p>
            <div className="flex items-center gap-2 text-xs text-slate-400">
              <i className="ri-information-line"></i>
              Clique no card para ver o passo a passo
            </div>
          </div>

          {/* Empty state */}
          {filteredSigns.length === 0 && (
            <div className="text-center py-24">
              <div className="text-6xl mb-4 select-none">🤷</div>
              <h3 className="text-xl font-bold text-slate-700 mb-2">Nenhum sinal encontrado</h3>
              <p className="text-slate-400 text-sm max-w-xs mx-auto">
                {showFavoritesOnly
                  ? 'Você ainda não tem favoritos. Clique no coração em qualquer sinal para adicionar!'
                  : 'Tente buscar por outro termo ou explore uma categoria diferente.'}
              </p>
              {showFavoritesOnly && (
                <button
                  onClick={() => setShowFavoritesOnly(false)}
                  className="mt-4 px-4 py-2 bg-emerald-50 text-emerald-600 rounded-xl text-sm font-semibold cursor-pointer hover:bg-emerald-100 transition-colors whitespace-nowrap"
                >
                  Ver todos os sinais
                </button>
              )}
            </div>
          )}

          {/* Grid */}
          {filteredSigns.length > 0 && (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {filteredSigns.map((sign) => (
                <SignCard
                  key={sign.id}
                  sign={sign}
                  isFavorite={isFavorite(sign.id)}
                  isLearned={isLearned(sign.id)}
                  onToggleFavorite={toggleFavorite}
                  onOpenModal={setSelectedSign}
                />
              ))}
            </div>
          )}

          {/* Progress summary */}
          <div data-guide="progress">
            {learned.length > 0 && (
              <div className="mt-12 bg-white border border-emerald-100 rounded-3xl p-6 flex flex-col sm:flex-row items-center gap-4"
                style={{ boxShadow: '0 2px 12px rgba(16,185,129,0.08)' }}>
                <div className="w-14 h-14 flex items-center justify-center flex-shrink-0 bg-emerald-50 rounded-2xl">
                  <i className="ri-trophy-line text-emerald-500 text-2xl"></i>
                </div>
                <div className="text-center sm:text-left">
                  <p className="font-bold text-slate-800 text-base">
                    Você aprendeu {learned.length} de {signs.length} sinais! 🎉
                  </p>
                  <p className="text-slate-400 text-sm">
                    Continue assim! Você está a {signs.length - learned.length} sinais de completar o dicionário.
                  </p>
                </div>
                <div className="sm:ml-auto w-full sm:w-40">
                  <div className="bg-slate-100 rounded-full h-2.5 overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-emerald-400 to-teal-500 rounded-full transition-all duration-500"
                      style={{ width: `${Math.round((learned.length / signs.length) * 100)}%` }}
                    />
                  </div>
                  <p className="text-right text-xs text-slate-400 mt-1">
                    {Math.round((learned.length / signs.length) * 100)}% completo
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Modal */}
        <SignModal
          sign={selectedSign}
          isLearned={selectedSign ? isLearned(selectedSign.id) : false}
          isFavorite={selectedSign ? isFavorite(selectedSign.id) : false}
          onClose={() => setSelectedSign(null)}
          onToggleLearned={toggleLearned}
          onToggleFavorite={toggleFavorite}
        />

        <Footer />
      </main>

      <InterpreterGuide />
    </>
  );
}