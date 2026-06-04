import { signs } from '@/mocks/signs/index';

interface Props {
  learnedCount: number;
  favoritesCount: number;
  searchQuery: string;
  onSearchChange: (q: string) => void;
}

const speak = (text: string) => {
  if (!('speechSynthesis' in window)) return;
  window.speechSynthesis.cancel();
  const u = new SpeechSynthesisUtterance(text);
  u.lang = 'pt-BR';
  u.rate = 0.9;
  window.speechSynthesis.speak(u);
};

export default function DictionaryHeader({ learnedCount, favoritesCount, searchQuery, onSearchChange }: Props) {
  return (
    <div className="bg-gradient-to-br from-emerald-500 to-teal-600 pt-24 pb-12 px-4 md:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Title */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-white/15 border border-white/20 rounded-full text-white/90 text-sm font-semibold mb-4 backdrop-blur-sm">
            <i className="ri-book-open-line"></i>
            Dicionário de Libras
          </div>
          <h1
            className="text-3xl md:text-5xl font-extrabold text-white mb-3 leading-tight"
           
          >
            Dicionário de Sinais
          </h1>
          <p className="text-white/75 text-lg max-w-lg mx-auto">
            Explore, aprenda e pratique mais de {signs.length} sinais com descrições detalhadas e passo a passo.
          </p>
        </div>

        {/* Stats */}
        <div className="flex flex-wrap justify-center gap-4 mb-8">
          {[
            { icon: 'ri-hand-heart-line', value: signs.length, label: 'Sinais no acervo' },
            { icon: 'ri-checkbox-circle-line', value: learnedCount, label: 'Sinais aprendidos' },
            { icon: 'ri-heart-line', value: favoritesCount, label: 'Favoritos' },
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

        {/* Search */}
        <div className="max-w-xl mx-auto relative">
          <div className="w-10 h-10 flex items-center justify-center absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
            <i className="ri-search-line text-lg"></i>
          </div>
          <input
            type="text"
            placeholder="Buscar sinal... ex: olá, família, vermelho"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full pl-12 pr-12 py-4 bg-white rounded-2xl text-slate-800 text-sm placeholder-slate-400 outline-none focus:ring-2 focus:ring-emerald-300 transition-all"
            style={{ boxShadow: '0 4px 20px rgba(0,0,0,0.1)' }}
          />
          {searchQuery && (
            <button
              onClick={() => onSearchChange('')}
              className="w-8 h-8 flex items-center justify-center absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 cursor-pointer"
            >
              <i className="ri-close-line text-lg"></i>
            </button>
          )}
        </div>

        {/* TTS hint */}
        <div className="text-center mt-4">
          <button
            onClick={() => speak('Bem-vindo ao dicionário de Libras!')}
            className="inline-flex items-center gap-1.5 text-white/60 text-xs hover:text-white/90 transition-colors cursor-pointer"
          >
            <i className="ri-volume-up-line"></i>
            Clique no ícone de som nos cards para ouvir a pronúncia
          </button>
        </div>
      </div>
    </div>
  );
}
