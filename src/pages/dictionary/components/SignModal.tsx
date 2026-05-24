import { useState } from 'react';
import { Sign } from '@/mocks/signs/index';
import { getCategoryImage } from '@/mocks/signs/categoryImages';
import VideoPlayer from './VideoPlayer';
import { CATEGORY_GRADIENTS, getCategoryVisuals } from './categoryStyles';

const DIFFICULTY_STYLE: Record<string, { badge: string; label: string }> = {
  'iniciante': { badge: 'bg-emerald-100 text-emerald-700', label: '🟢 Iniciante' },
  'intermediário': { badge: 'bg-amber-100 text-amber-700', label: '🟡 Intermediário' },
  'avançado': { badge: 'bg-rose-100 text-rose-700', label: '🔴 Avançado' },
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
  sign: Sign | null;
  isLearned: boolean;
  isFavorite: boolean;
  onClose: () => void;
  onToggleLearned: (id: string) => void;
  onToggleFavorite: (id: string) => void;
}

export default function SignModal({ sign, isLearned, isFavorite, onClose, onToggleLearned, onToggleFavorite }: Props) {
  const [showVideo, setShowVideo] = useState(false);

  if (!sign) return null;

  const diff = DIFFICULTY_STYLE[sign.difficulty];
  const hasVideo = !!sign.videoUrl;
  const hasThumbnail = !!sign.videoThumbnail && sign.videoThumbnail.trim() !== '';
  const categoryImage = getCategoryImage(sign.category);
  const effectiveThumbnail = hasThumbnail ? sign.videoThumbnail : categoryImage;
  const hasImage = !!effectiveThumbnail;
  const gradient = CATEGORY_GRADIENTS[sign.category] ?? CATEGORY_GRADIENTS['Vários'];
  const visuals = getCategoryVisuals(sign.category);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />

      {/* Modal */}
      <div
        className="relative bg-white rounded-3xl w-full max-w-lg max-h-[90vh] overflow-y-auto"
        style={{ boxShadow: '0 30px 80px rgba(0,0,0,0.2)' }}
      >
        {/* Media area — image, gradient, or video */}
        <div className="w-full aspect-square bg-slate-50 relative overflow-hidden rounded-t-3xl flex items-center justify-center">
          {hasVideo && showVideo ? (
            <VideoPlayer videoUrl={sign.videoUrl!} title={`Sinal de "${sign.word}" em Libras`} />
          ) : hasImage ? (
            <>
              <img
                src={effectiveThumbnail}
                alt={`Ilustração do sinal de "${sign.word}" em Libras`}
                className="w-full h-full object-cover object-center"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
            </>
          ) : (
            <div
              className={`w-full h-full bg-gradient-to-br ${gradient} relative flex items-center justify-center`}
            >
              {/* Pattern overlay */}
              <div
                className="absolute inset-0"
                style={{ backgroundImage: visuals.pattern }}
              />
              {/* Decorative circles */}
              <div className="absolute top-0 right-0 w-48 h-48 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2" />
              <div className="absolute bottom-0 left-0 w-36 h-36 bg-white/10 rounded-full translate-y-1/2 -translate-x-1/2" />
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-white/5 rounded-full" />

              {/* Central content */}
              <div className="relative z-10 flex flex-col items-center text-center px-6">
                <span
                  className="text-9xl select-none mb-3"
                  style={{ textShadow: '0 8px 30px rgba(0,0,0,0.15)', filter: 'drop-shadow(0 4px 12px rgba(0,0,0,0.1))' }}
                >
                  {sign.emoji}
                </span>
                <h2
                  className="font-extrabold text-white text-2xl leading-tight drop-shadow-md"
                  style={{ fontFamily: 'Plus Jakarta Sans, sans-serif', textShadow: '0 2px 10px rgba(0,0,0,0.2)' }}
                >
                  {sign.word}
                </h2>
                <span className="text-white/80 text-sm mt-1 font-medium">{sign.category}</span>
              </div>
            </div>
          )}

          {/* Overlay info — for image mode (thumbnail or category image) */}
          {hasImage && (
            <div className="absolute bottom-4 left-4 flex items-center gap-2 z-10">
              <span className="text-3xl select-none">{sign.emoji}</span>
              <div>
                <h2 className="font-extrabold text-white text-lg leading-tight" style={{ fontFamily: 'Plus Jakarta Sans, sans-serif' }}>
                  {sign.word}
                </h2>
                <span className="text-white/70 text-xs">{sign.category}</span>
              </div>
            </div>
          )}

          {/* Close */}
          <button
            onClick={onClose}
            className="absolute top-3 right-3 w-9 h-9 flex items-center justify-center bg-white/90 hover:bg-white rounded-xl text-slate-700 transition-colors cursor-pointer backdrop-blur-sm z-10"
          >
            <i className="ri-close-line text-lg"></i>
          </button>

          {/* Toggle Image / Video */}
          {hasVideo && (
            <div className="absolute top-3 left-3 flex bg-black/40 backdrop-blur-md rounded-full p-1 z-10">
              <button
                onClick={() => setShowVideo(false)}
                className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-all cursor-pointer whitespace-nowrap ${
                  !showVideo ? 'bg-white text-slate-800' : 'text-white/80 hover:text-white'
                }`}
              >
                <i className="ri-image-line mr-1"></i>
                Imagem
              </button>
              <button
                onClick={() => setShowVideo(true)}
                className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-all cursor-pointer whitespace-nowrap ${
                  showVideo ? 'bg-white text-slate-800' : 'text-white/80 hover:text-white'
                }`}
              >
                <i className="ri-video-line mr-1"></i>
                Vídeo Real
              </button>
            </div>
          )}
        </div>

        {/* Body */}
        <div className="px-6 py-5 space-y-5">
          {/* Badges */}
          <div className="flex items-center gap-2 flex-wrap">
            <span className={`text-xs px-3 py-1.5 rounded-full font-semibold ${diff.badge}`}>{diff.label}</span>
            <span className="text-xs px-3 py-1.5 rounded-full bg-slate-100 text-slate-500 font-medium">{sign.category}</span>
            {isLearned && (
              <span className="text-xs px-3 py-1.5 rounded-full bg-emerald-100 text-emerald-700 font-semibold flex items-center gap-1">
                <i className="ri-checkbox-circle-fill text-xs"></i> Aprendido
              </span>
            )}
          </div>

          {/* Description */}
          <div className="bg-slate-50 rounded-2xl p-4">
            <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Descrição</h3>
            <p className="text-slate-700 text-sm leading-relaxed">{sign.description}</p>
          </div>

          {/* Steps */}
          <div>
            <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3">Como fazer — Passo a Passo</h3>
            <ol className="space-y-3">
              {sign.steps.map((step, i) => (
                <li key={i} className="flex items-start gap-3">
                  <div className="w-7 h-7 flex items-center justify-center flex-shrink-0 bg-emerald-500 text-white text-xs font-bold rounded-xl mt-0.5">
                    {i + 1}
                  </div>
                  <p className="text-slate-600 text-sm leading-relaxed pt-0.5">{step}</p>
                </li>
              ))}
            </ol>
          </div>

          {/* Tip */}
          <div className="bg-amber-50 border border-amber-100 rounded-2xl p-4 flex items-start gap-3">
            <div className="w-8 h-8 flex items-center justify-center flex-shrink-0 bg-amber-100 rounded-xl">
              <i className="ri-lightbulb-line text-amber-500 text-base"></i>
            </div>
            <p className="text-amber-700 text-xs leading-relaxed">
              <strong>Dica:</strong> Pratique na frente do espelho para verificar cada posição das mãos e expressões faciais. A expressão facial é parte essencial da comunicação em Libras!
            </p>
          </div>
        </div>

        {/* Footer actions */}
        <div className="px-6 pb-6 flex flex-col sm:flex-row gap-3">
          <button
            onClick={() => speak(sign.word)}
            className="flex items-center justify-center gap-2 px-4 py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-2xl text-sm font-semibold transition-all duration-200 cursor-pointer whitespace-nowrap"
          >
            <i className="ri-volume-up-line"></i>
            Ouvir em PT
          </button>
          <button
            onClick={() => onToggleFavorite(sign.id)}
            className={`flex items-center justify-center gap-2 px-4 py-3 rounded-2xl text-sm font-semibold transition-all duration-200 cursor-pointer whitespace-nowrap ${
              isFavorite ? 'bg-amber-100 text-amber-600' : 'bg-slate-100 hover:bg-amber-50 text-slate-600 hover:text-amber-500'
            }`}
          >
            <i className={isFavorite ? 'ri-heart-fill' : 'ri-heart-line'}></i>
            {isFavorite ? 'Favoritado' : 'Favoritar'}
          </button>
          <button
            onClick={() => onToggleLearned(sign.id)}
            className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-2xl text-sm font-bold transition-all duration-200 cursor-pointer whitespace-nowrap ${
              isLearned
                ? 'bg-emerald-100 text-emerald-700 hover:bg-emerald-200'
                : 'bg-emerald-500 hover:bg-emerald-600 text-white'
            }`}
          >
            <i className={isLearned ? 'ri-checkbox-circle-fill' : 'ri-checkbox-blank-circle-line'}></i>
            {isLearned ? 'Já aprendi!' : 'Marcar como aprendido'}
          </button>
        </div>
      </div>
    </div>
  );
}