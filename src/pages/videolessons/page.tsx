import React, { useState, useRef } from 'react';
import { playlists, VIDEO_CATEGORIES, getEmbedUrl, VideoPlaylist } from '@/mocks/videoLessons';
import VideoCard from './components/VideoCard';
import { Link } from 'react-router-dom';

export default function VideoLessonsPage() {
  const [activePlaylistIdx, setActivePlaylistIdx] = useState(0);
  const [activeVideoIdx, setActiveVideoIdx] = useState(0);
  const [selectedCategory, setSelectedCategory] = useState('Todos');
  const playerRef = useRef<HTMLDivElement>(null);

  const activePlaylist = playlists[activePlaylistIdx];
  const activeVideo = activePlaylist.videos[activeVideoIdx];
  const embedUrl = getEmbedUrl(activePlaylist.playlistId, activeVideo.playlistIndex);

  const filteredVideos = selectedCategory === 'Todos'
    ? activePlaylist.videos
    : activePlaylist.videos.filter((v) => v.category === selectedCategory);

  const handlePlaylistChange = (idx: number) => {
    setActivePlaylistIdx(idx);
    setActiveVideoIdx(0);
    setSelectedCategory('Todos');
  };

  const handleVideoClick = (videoIdxInFiltered: number) => {
    const video = filteredVideos[videoIdxInFiltered];
    const realIdx = activePlaylist.videos.indexOf(video);
    setActiveVideoIdx(realIdx);
    playerRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  const PlaylistBadge = ({ playlist, index }: { playlist: VideoPlaylist; index: number }) => {
    const isActive = index === activePlaylistIdx;
    return (
      <button
        onClick={() => handlePlaylistChange(index)}
        className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200 cursor-pointer whitespace-nowrap ${
          isActive
            ? 'bg-emerald-500 text-white shadow-md shadow-emerald-200'
            : 'bg-white text-slate-600 hover:bg-slate-50 border border-slate-100'
        }`}
      >
        <i className={`${playlist.icon} ${isActive ? 'text-white' : 'text-slate-400'}`}></i>
        {playlist.name}
        <span className={`text-xs px-1.5 py-0.5 rounded-full ${isActive ? 'bg-white/20 text-white' : 'bg-slate-100 text-slate-400'}`}>
          {playlist.videos.length}
        </span>
      </button>
    );
  };

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <header className="bg-white border-b border-slate-100 pt-20 pb-8 px-4 md:px-8">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center gap-2 mb-4 flex-wrap">
            <span className="text-xs font-semibold text-emerald-600 bg-emerald-50 px-3 py-1 rounded-full uppercase tracking-wider">
              Conteúdo Real
            </span>
            <span className="text-xs font-semibold text-slate-400 bg-slate-100 px-3 py-1 rounded-full uppercase tracking-wider">
              {activePlaylist.videos.length} aulas
            </span>
          </div>
          <h1 className="text-3xl md:text-4xl font-extrabold text-slate-900 mb-3">
            Videoaulas de Libras
          </h1>
          <p className="text-slate-500 text-sm md:text-base max-w-2xl leading-relaxed">
            Aprenda com aulas reais de canais oficiais de Libras. 
            Vídeos autênticos com intérpretes certificados, organizados por tema e vinculados ao glossário do site.
          </p>

          {/* Playlist selector */}
          <div className="flex gap-2 mt-6 flex-wrap">
            {playlists.map((pl, idx) => (
              <PlaylistBadge key={pl.id} playlist={pl} index={idx} />
            ))}
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 md:px-8 py-8 md:py-12 space-y-10">
        {/* Player Section */}
        <div ref={playerRef} className="bg-white rounded-3xl border border-slate-100 overflow-hidden" style={{ boxShadow: '0 4px 24px rgba(0,0,0,0.06)' }}>
          {/* Player */}
          <div className="relative w-full aspect-video bg-slate-900">
            <iframe
              key={embedUrl}
              src={embedUrl}
              title={`Videoaula: ${activeVideo.title}`}
              className="absolute inset-0 w-full h-full"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          </div>

          {/* Player info */}
          <div className="p-5 md:p-6">
            <div className="flex items-start justify-between gap-4 flex-col sm:flex-row">
              <div>
                <div className="flex items-center gap-2 mb-2 flex-wrap">
                  <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-600">
                    Ep. {activeVideo.episodeNumber}
                  </span>
                  <span className={`text-xs font-bold px-2.5 py-1 rounded-full ${activePlaylist.badgeColor}`}>
                    {activePlaylist.name}
                  </span>
                  <span className="text-xs font-medium text-slate-400">
                    {activeVideo.duration}
                  </span>
                </div>
                <h2 className="text-lg md:text-xl font-bold text-slate-900 mb-2">
                  {activeVideo.title}
                </h2>
                <p className="text-sm text-slate-500 leading-relaxed max-w-2xl">
                  {activeVideo.description}
                </p>
              </div>
              <div className="flex-shrink-0">
                <Link
                  to="/dictionary"
                  className="inline-flex items-center gap-2 px-4 py-2.5 bg-slate-100 hover:bg-emerald-50 hover:text-emerald-600 text-slate-600 rounded-xl text-sm font-semibold transition-all duration-200 cursor-pointer whitespace-nowrap"
                >
                  <i className="ri-translate-2"></i>
                  Ir para o Glossário
                </Link>
              </div>
            </div>

            {/* Signs covered */}
            {activeVideo.signsCovered.length > 0 && (
              <div className="mt-5 pt-5 border-t border-slate-100">
                <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3">
                  Sinais abordados nesta aula
                </p>
                <div className="flex flex-wrap gap-2">
                  {activeVideo.signsCovered.map((signId) => (
                    <Link
                      key={signId}
                      to={`/dictionary?search=${signId}`}
                      className="text-xs px-3 py-1.5 rounded-full bg-slate-50 hover:bg-emerald-50 text-slate-600 hover:text-emerald-600 font-medium transition-colors cursor-pointer"
                    >
                      {signId}
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Episodes Section */}
        <section>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
            <div>
              <h2 className="text-xl font-bold text-slate-900 mb-1">Episódios da Série</h2>
              <p className="text-sm text-slate-400">
                {activePlaylist.name} — {activePlaylist.videos.length} aulas disponíveis
              </p>
            </div>

            {/* Category filter */}
            <div className="flex gap-2 flex-wrap">
              {VIDEO_CATEGORIES.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-all cursor-pointer whitespace-nowrap ${
                    selectedCategory === cat
                      ? 'bg-emerald-500 text-white'
                      : 'bg-white text-slate-500 hover:bg-slate-100 border border-slate-100'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {/* Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-5">
            {filteredVideos.map((video, idx) => (
              <VideoCard
                key={video.id}
                video={video}
                playlist={activePlaylist}
                isActive={activePlaylist.videos[activeVideoIdx].id === video.id}
                onClick={() => handleVideoClick(idx)}
              />
            ))}
          </div>

          {filteredVideos.length === 0 && (
            <div className="text-center py-12">
              <div className="w-16 h-16 flex items-center justify-center bg-slate-100 rounded-2xl mx-auto mb-4">
                <i className="ri-tv-line text-2xl text-slate-400"></i>
              </div>
              <p className="text-sm text-slate-500">Nenhum episódio nesta categoria.</p>
            </div>
          )}
        </section>

        {/* About Section */}
        <section className="bg-white rounded-3xl border border-slate-100 p-6 md:p-8" style={{ boxShadow: '0 2px 12px rgba(0,0,0,0.04)' }}>
          <div className="flex flex-col md:flex-row gap-6 md:gap-10 items-start">
            <div className={`w-14 h-14 flex items-center justify-center rounded-2xl flex-shrink-0 ${activePlaylist.badgeColor}`}>
              <i className={`${activePlaylist.icon} text-2xl`}></i>
            </div>
            <div>
              <h3 className="text-lg font-bold text-slate-900 mb-2">Sobre {activePlaylist.name}</h3>
              <p className="text-sm text-slate-500 leading-relaxed mb-4">
                {activePlaylist.description}
              </p>
              <div className="flex flex-wrap gap-3">
                <span className="text-xs px-3 py-1.5 rounded-full bg-emerald-50 text-emerald-600 font-medium">
                  <i className="ri-verified-badge-line mr-1"></i>
                  Conteúdo Verificado
                </span>
                <span className="text-xs px-3 py-1.5 rounded-full bg-sky-50 text-sky-600 font-medium">
                  <i className="ri-user-voice-line mr-1"></i>
                  Intérpretes Reais
                </span>
                <span className="text-xs px-3 py-1.5 rounded-full bg-amber-50 text-amber-600 font-medium">
                  <i className="ri-global-line mr-1"></i>
                  Acesso Gratuito
                </span>
              </div>
            </div>
          </div>
        </section>

        {/* Other playlists quick nav */}
        <section>
          <h2 className="text-xl font-bold text-slate-900 mb-4">Outras Playlists</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {playlists.filter((_, idx) => idx !== activePlaylistIdx).map((pl) => (
              <button
                key={pl.id}
                onClick={() => handlePlaylistChange(playlists.indexOf(pl))}
                className="flex items-center gap-4 p-5 bg-white rounded-2xl border border-slate-100 hover:border-emerald-200 hover:-translate-y-0.5 transition-all duration-200 text-left cursor-pointer"
                style={{ boxShadow: '0 2px 8px rgba(0,0,0,0.04)' }}
              >
                <div className={`w-12 h-12 flex items-center justify-center rounded-xl flex-shrink-0 ${pl.badgeColor}`}>
                  <i className={`${pl.icon} text-xl`}></i>
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-900">{pl.name}</h3>
                  <p className="text-xs text-slate-400 mt-0.5">{pl.videos.length} aulas · {pl.channel}</p>
                </div>
                <i className="ri-arrow-right-line text-slate-300 ml-auto"></i>
              </button>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}