import { useState } from 'react';
import { Sign } from '@/mocks/signs/index';
import { getCategoryImage } from '@/mocks/signs/categoryImages';
import {
  CATEGORY_GRADIENTS,
  CATEGORY_PATTERN_COLORS,
  getCategoryVisuals,
} from './categoryStyles';

const DIFFICULTY_STYLE: Record<string, string> = {
  iniciante: 'bg-white/70 text-emerald-700',
  intermediário: 'bg-white/70 text-amber-700',
  avançado: 'bg-white/70 text-rose-700',
};

const speak = (word: string) => {
  if (!('speechSynthesis' in window)) return;
  window.speechSynthesis.cancel();
  const u = new SpeechSynthesisUtterance(word);
  u.lang = 'pt-BR';
  u.rate = 0.85;
  window.speechSynthesis.speak(u);
};

interface Props {
  sign: Sign;
  isFavorite: boolean;
  isLearned: boolean;
  onToggleFavorite: (id: string) => void;
  onOpenModal: (sign: Sign) => void;
}

export default function SignCard({
  sign,
  isFavorite,
  isLearned,
  onToggleFavorite,
  onOpenModal,
}: Props) {
  const [imgLoaded, setImgLoaded] = useState(false);
  const hasVideo = !!sign.videoUrl;
  const hasThumbnail = !!sign.videoThumbnail && sign.videoThumbnail.trim() !== '';
  const categoryImage = getCategoryImage(sign.category);
  const effectiveThumbnail = hasThumbnail ? sign.videoThumbnail : categoryImage;
  const hasImage = !!effectiveThumbnail;
  const gradient = CATEGORY_GRADIENTS[sign.category] ?? CATEGORY_GRADIENTS['Vários'];
  const visuals = getCategoryVisuals(sign.category);

  return (
    <div
      className={`group relative bg-white rounded-3xl border transition-all duration-300 hover:-translate-y-1 cursor-pointer overflow-hidden ${
        isLearned ? 'border-emerald-300' : 'border-slate-100 hover:border-slate-200'
      }`}
      style={{
        boxShadow: isLearned
          ? '0 4px 20px rgba(16,185,129,0.12)'
          : '0 2px 12px rgba(0,0,0,0.04)',
      }}
      onClick={() => onOpenModal(sign)}
    >
      {/* Learned badge */}
      {isLearned && (
        <div className="absolute top-3 left-3 flex items-center gap-1 bg-emerald-500 text-white text-xs font-semibold px-2.5 py-1 rounded-full z-20 shadow-sm">
          <i className="ri-checkbox-circle-fill text-xs" />
          Aprendido
        </div>
      )}

      {/* Favorite button */}
      <button
        onClick={(e) => {
          e.stopPropagation();
          onToggleFavorite(sign.id);
        }}
        className={`absolute top-3 right-3 w-8 h-8 flex items-center justify-center rounded-xl transition-all duration-200 cursor-pointer z-20 ${
          isFavorite
            ? 'bg-white/90 text-amber-500 shadow-sm'
            : 'bg-black/10 text-white hover:bg-white/80 hover:text-amber-400 backdrop-blur-sm'
        }`}
        aria-label={isFavorite ? 'Remover dos favoritos' : 'Adicionar aos favoritos'}
      >
        <i className={`${isFavorite ? 'ri-heart-fill' : 'ri-heart-line'} text-sm`} />
      </button>

      {/* Media area */}
      <div className="w-full aspect-[4/3] relative overflow-hidden flex items-center justify-center">
        {hasImage ? (
          <>
            {!imgLoaded && (
              <div className="absolute inset-0 flex items-center justify-center bg-slate-50">
                <div className="w-8 h-8 border-2 border-slate-200 border-t-emerald-500 rounded-full animate-spin" />
              </div>
            )}
            <img
              src={effectiveThumbnail}
              alt={`Sinal de "${sign.word}" em Libras`}
              className={`w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500 ${
                imgLoaded ? 'opacity-100' : 'opacity-0'
              }`}
              loading="lazy"
              onLoad={() => setImgLoaded(true)}
            />
            {/* Subtle gradient overlay for text readability */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent" />
          </>
        ) : (
          <div
            className={`w-full h-full bg-gradient-to-br ${gradient} relative flex items-center justify-center`}
            style={{ backgroundImage: visuals.pattern }}
          >
            {/* Decorative circles */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2" />
            <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/10 rounded-full translate-y-1/2 -translate-x-1/2" />

            {/* Central emoji */}
            <div className="relative z-10 flex flex-col items-center">
              <span
                className={`${visuals.emojiSize} select-none drop-shadow-lg filter`}
                style={{ textShadow: '0 4px 20px rgba(0,0,0,0.15)' }}
              >
                {sign.emoji}
              </span>
            </div>

            {/* Category label at bottom of gradient area */}
            <div className="absolute bottom-3 left-3 z-10">
              <span className="text-[10px] font-bold text-white/80 uppercase tracking-wider bg-black/20 backdrop-blur-sm px-2 py-1 rounded-lg">
                {sign.category}
              </span>
            </div>
          </div>
        )}

        {/* Video badge */}
        {hasVideo && (
          <div className="absolute bottom-2 right-2 flex items-center gap-1 bg-black/60 text-white text-[10px] font-semibold px-2 py-1 rounded-full backdrop-blur-sm z-10">
            <i className="ri-video-line text-xs" />
            Vídeo
          </div>
        )}
      </div>

      {/* Card body */}
      <div className="p-4 md:p-5">
        {/* Word */}
        <h3
          className="text-base font-bold text-slate-900 mb-2 leading-tight"
          style={{ fontFamily: 'Plus Jakarta Sans, sans-serif' }}
        >
          {sign.word}
        </h3>

        {/* Badges */}
        <div className="flex items-center gap-2 mb-3 flex-wrap">
          <span className={`text-xs px-2.5 py-1 rounded-full font-semibold ${DIFFICULTY_STYLE[sign.difficulty]}`}>
            {sign.difficulty}
          </span>
          <span className="text-xs px-2.5 py-1 rounded-full bg-slate-100 text-slate-500 font-medium">
            {sign.category}
          </span>
        </div>

        {/* Description */}
        <p className="text-slate-400 text-xs leading-relaxed line-clamp-2 mb-4">
          {sign.description}
        </p>

        {/* Actions */}
        <div className="flex gap-2">
          <button
            onClick={(e) => {
              e.stopPropagation();
              speak(sign.word);
            }}
            className="flex-shrink-0 w-9 h-9 flex items-center justify-center bg-slate-100 hover:bg-emerald-50 hover:text-emerald-600 text-slate-500 rounded-xl transition-all duration-200 cursor-pointer"
            aria-label="Ouvir pronúncia"
          >
            <i className="ri-volume-up-line text-sm" />
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onOpenModal(sign);
            }}
            className="flex-1 py-2 bg-emerald-50 hover:bg-emerald-500 hover:text-white text-emerald-600 rounded-xl text-xs font-semibold transition-all duration-200 cursor-pointer whitespace-nowrap"
          >
            Ver Passo a Passo
          </button>
        </div>
      </div>
    </div>
  );
}