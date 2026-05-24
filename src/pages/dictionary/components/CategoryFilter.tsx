import { SIGN_CATEGORIES } from '@/mocks/signs/index';

const CATEGORY_ICONS: Record<string, string> = {
  'Todos': 'ri-apps-2-line',
  'Saudações': 'ri-hand-heart-line',
  'Família': 'ri-team-line',
  'Números': 'ri-hashtag',
  'Cores': 'ri-palette-line',
  'Alimentos': 'ri-restaurant-line',
  'Emoções': 'ri-emotion-happy-line',
  'Verbos': 'ri-run-line',
  'Pronomes': 'ri-user-line',
  'Adjetivos': 'ri-edit-line',
  'Questões': 'ri-question-line',
  'Lugares': 'ri-map-pin-line',
  'Animais': 'ri-bear-smile-line',
  'Natureza': 'ri-tree-line',
  'Transporte': 'ri-bus-line',
  'Profissões': 'ri-briefcase-line',
  'Corpo': 'ri-body-scan-line',
  'Tempo': 'ri-time-line',
  'Roupas': 'ri-shirt-line',
  'Objetos': 'ri-box-3-line',
  'Materiais': 'ri-pencil-ruler-2-line',
  'Disciplinas': 'ri-book-open-line',
  'Meses': 'ri-calendar-line',
  'Semana': 'ri-calendar-event-line',
  'Vários': 'ri-more-line',
};

interface Props {
  active: string;
  onChange: (cat: string) => void;
  showFavoritesOnly: boolean;
  onToggleFavorites: () => void;
  favoritesCount: number;
}

export default function CategoryFilter({ active, onChange, showFavoritesOnly, onToggleFavorites, favoritesCount }: Props) {
  return (
    <div className="sticky top-16 z-30 bg-white border-b border-slate-100 px-4 md:px-8 py-3">
      <div className="max-w-7xl mx-auto flex items-center gap-2 overflow-x-auto scrollbar-hide pb-1">
        {/* Favorites toggle */}
        <button
          onClick={onToggleFavorites}
          className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-semibold whitespace-nowrap cursor-pointer flex-shrink-0 transition-all duration-200 ${
            showFavoritesOnly
              ? 'bg-amber-500 text-white'
              : 'bg-amber-50 text-amber-600 hover:bg-amber-100'
          }`}
        >
          <i className={`${showFavoritesOnly ? 'ri-heart-fill' : 'ri-heart-line'} text-base`}></i>
          Favoritos {favoritesCount > 0 && <span className="bg-white/30 text-xs px-1.5 py-0.5 rounded-full">{favoritesCount}</span>}
        </button>

        <div className="w-px h-6 bg-slate-200 flex-shrink-0 mx-1"></div>

        {/* Category pills */}
        {SIGN_CATEGORIES.map((cat) => (
          <button
            key={cat}
            onClick={() => { onChange(cat); }}
            className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-medium whitespace-nowrap cursor-pointer flex-shrink-0 transition-all duration-200 ${
              active === cat && !showFavoritesOnly
                ? 'bg-emerald-500 text-white'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            <i className={`${CATEGORY_ICONS[cat] ?? 'ri-bookmark-line'} text-base`}></i>
            {cat}
          </button>
        ))}
      </div>
    </div>
  );
}