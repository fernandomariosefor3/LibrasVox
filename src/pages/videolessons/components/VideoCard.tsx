import { VideoLesson, VideoPlaylist } from '@/mocks/videoLessons';
import { useState } from 'react';

interface Props {
  video: VideoLesson;
  playlist: VideoPlaylist;
  isActive: boolean;
  onClick: () => void;
}

export default function VideoCard({ video, playlist, isActive, onClick }: Props) {
  const [imgLoaded, setImgLoaded] = useState(false);
  const thumbUrl = `https://img.youtube.com/vi/${video.youtubeId}/mqdefault.jpg`;

  return (
    <button
      onClick={onClick}
      className={`group relative w-full text-left bg-white rounded-2xl border transition-all duration-300 overflow-hidden cursor-pointer ${
        isActive
          ? 'border-emerald-300 shadow-md ring-1 ring-emerald-100'
          : 'border-slate-100 hover:border-slate-200 hover:-translate-y-0.5'
      }`}
      style={{ boxShadow: isActive ? '0 4px 20px rgba(16,185,129,0.08)' : '0 2px 8px rgba(0,0,0,0.04)' }}
    >
      {/* Thumbnail area */}
      <div className="relative w-full aspect-video bg-slate-100 overflow-hidden flex items-center justify-center">
        {/* Real YouTube thumbnail */}
        <img
          src={thumbUrl}
          alt={video.title}
          onLoad={() => setImgLoaded(true)}
          className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-300 ${imgLoaded ? 'opacity-100' : 'opacity-0'}`}
        />
        {!imgLoaded && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-slate-100">
            <span className="text-4xl mb-2">📺</span>
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider text-center px-4">
              {video.title}
            </span>
          </div>
        )}

        {/* Episode badge */}
        <div className={`absolute top-3 left-3 text-xs font-bold px-2.5 py-1 rounded-full ${video.color} backdrop-blur-sm bg-opacity-90`}>
          Ep. {video.episodeNumber}
        </div>

        {/* Play icon overlay */}
        <div className={`absolute inset-0 flex items-center justify-center transition-opacity duration-300 ${isActive ? 'opacity-0' : 'opacity-100 group-hover:opacity-0'}`}>
          <div className="w-12 h-12 flex items-center justify-center bg-white/90 rounded-full shadow-lg">
            <i className="ri-play-fill text-emerald-600 text-xl"></i>
          </div>
        </div>

        {/* Active indicator */}
        {isActive && (
          <div className="absolute inset-0 bg-emerald-500/5 flex items-center justify-center">
            <div className="flex items-center gap-2 bg-emerald-500 text-white px-4 py-2 rounded-full text-xs font-semibold">
              <i className="ri-play-fill"></i>
              Reproduzindo
            </div>
          </div>
        )}

        {/* Duration */}
        <div className="absolute bottom-2 right-2 bg-black/60 text-white text-[10px] font-semibold px-2 py-1 rounded-md backdrop-blur-sm">
          {video.duration}
        </div>
      </div>

      {/* Card body */}
      <div className="p-4">
        <h3 className="text-sm font-bold text-slate-900 mb-1 leading-tight">
          {video.title}
        </h3>
        <p className="text-xs text-slate-400 leading-relaxed line-clamp-2 mb-3">
          {video.description}
        </p>
        <div className="flex items-center gap-2">
          <span className="text-[10px] px-2 py-1 rounded-full bg-slate-100 text-slate-500 font-medium">
            {video.category}
          </span>
          <span className="text-[10px] px-2 py-1 rounded-full bg-emerald-50 text-emerald-600 font-medium">
            {video.signsCovered.length} sinais
          </span>
        </div>
      </div>
    </button>
  );
}