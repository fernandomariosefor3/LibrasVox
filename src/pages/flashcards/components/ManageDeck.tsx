import { useState, useMemo } from 'react';
import { useSRS } from '@/hooks/useSRS';
import { signs, SIGN_CATEGORIES } from '@/mocks/signs';

const BATCH_SIZES = [5, 10, 15, 20, 30];

export default function ManageDeck() {
  const srs = useSRS();
  const [selectedCategory, setSelectedCategory] = useState('Todos');
  const [search, setSearch] = useState('');
  const [addedIds, setAddedIds] = useState<Set<string>>(new Set());
  const [batchSize, setBatchSize] = useState(10);

  const filteredSigns = useMemo(() => {
    return signs.filter((s) => {
      const matchesCategory = selectedCategory === 'Todos' || s.category === selectedCategory;
      const q = search.toLowerCase();
      const matchesSearch = !q || s.word.toLowerCase().includes(q) || s.description.toLowerCase().includes(q);
      return matchesCategory && matchesSearch;
    });
  }, [selectedCategory, search]);

  const handleAdd = (sign: typeof signs[0]) => {
    const added = srs.addCard({
      id: sign.id,
      word: sign.word,
      category: sign.category,
      emoji: sign.emoji,
      description: sign.description,
      steps: sign.steps,
      videoThumbnail: sign.videoThumbnail,
    });
    if (added) {
      setAddedIds((prev) => new Set(prev).add(sign.id));
    }
  };

  const handleAddBatch = () => {
    const toAdd = filteredSigns.filter((s) => !srs.getCardById(s.id) && !addedIds.has(s.id)).slice(0, batchSize);
    const count = srs.addMultipleCards(toAdd.map((s) => ({
      id: s.id,
      word: s.word,
      category: s.category,
      emoji: s.emoji,
      description: s.description,
      steps: s.steps,
      videoThumbnail: s.videoThumbnail,
    })));
    if (count > 0) {
      setAddedIds((prev) => {
        const next = new Set(prev);
        toAdd.forEach((s) => next.add(s.id));
        return next;
      });
    }
  };

  const stats = srs.computeStats();

  return (
    <div>
      {/* Batch add controls */}
      <div className="bg-slate-50 rounded-2xl p-5 border border-slate-100 mb-6">
        <div className="flex flex-col sm:flex-row sm:items-center gap-4">
          <div className="flex items-center gap-3 flex-1">
            <span className="text-sm font-bold text-slate-700">Adicionar lote:</span>
            <div className="flex gap-1">
              {BATCH_SIZES.map((size) => (
                <button
                  key={size}
                  onClick={() => setBatchSize(size)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors cursor-pointer whitespace-nowrap ${
                    batchSize === size
                      ? 'bg-slate-800 text-white'
                      : 'bg-white text-slate-500 border border-slate-200 hover:border-slate-300'
                  }`}
                >
                  {size}
                </button>
              ))}
            </div>
          </div>
          <button
            onClick={handleAddBatch}
            className="px-5 py-2.5 bg-emerald-500 text-white rounded-xl text-sm font-semibold hover:bg-emerald-600 transition-colors cursor-pointer whitespace-nowrap flex items-center justify-center gap-2"
          >
            <i className="ri-play-list-add-line"></i>
            Adicionar {Math.min(batchSize, filteredSigns.length)} sinais
          </button>
        </div>
        <p className="text-xs text-slate-400 mt-3">
          Você tem {stats.totalCards} {stats.totalCards === 1 ? 'sinal' : 'sinais'} no deck. 
          {filteredSigns.filter((s) => !srs.getCardById(s.id)).length} disponíveis nesta categoria.
        </p>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <div className="relative flex-1">
          <i className="ri-search-line absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-sm"></i>
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Buscar sinal..."
            className="w-full pl-9 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm text-slate-700 placeholder:text-slate-400 focus:outline-none focus:border-emerald-300 focus:ring-2 focus:ring-emerald-100"
          />
        </div>
        <div className="flex gap-2 flex-wrap">
          {SIGN_CATEGORIES.slice(0, 8).map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-2 rounded-xl text-xs font-semibold border transition-all cursor-pointer whitespace-nowrap ${
                selectedCategory === cat
                  ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                  : 'bg-white text-slate-500 border-slate-200 hover:border-slate-300'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Signs grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {filteredSigns.map((sign) => {
          const inDeck = !!srs.getCardById(sign.id) || addedIds.has(sign.id);
          return (
            <div
              key={sign.id}
              className={`flex items-start gap-3 p-4 rounded-2xl border transition-all ${
                inDeck
                  ? 'bg-emerald-50 border-emerald-200'
                  : 'bg-white border-slate-100 hover:border-slate-200'
              }`}
            >
              <div className="w-10 h-10 flex items-center justify-center bg-slate-100 rounded-xl text-xl flex-shrink-0">
                {sign.emoji}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-bold text-slate-700 truncate">{sign.word}</p>
                <p className="text-xs text-slate-400 mb-2">{sign.category} · {sign.difficulty}</p>
                <button
                  onClick={() => handleAdd(sign)}
                  disabled={inDeck}
                  className={`text-xs font-semibold px-3 py-1.5 rounded-lg transition-all cursor-pointer whitespace-nowrap ${
                    inDeck
                      ? 'bg-emerald-100 text-emerald-700 cursor-default'
                      : 'bg-slate-800 text-white hover:bg-slate-700'
                  }`}
                >
                  {inDeck ? (
                    <span className="flex items-center gap-1">
                      <i className="ri-check-line"></i>
                      No deck
                    </span>
                  ) : (
                    <span className="flex items-center gap-1">
                      <i className="ri-add-line"></i>
                      Adicionar
                    </span>
                  )}
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {filteredSigns.length === 0 && (
        <div className="text-center py-12 bg-slate-50 rounded-2xl border border-slate-100">
          <p className="text-slate-400 text-sm">Nenhum sinal encontrado com estes filtros.</p>
        </div>
      )}
    </div>
  );
}