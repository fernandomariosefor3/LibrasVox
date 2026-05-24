import { useCallback, useEffect, useRef, useState } from 'react';

interface Props {
  videoUrl: string;
  title: string;
}

const extractVideoId = (url: string): string | null => {
  const match = url.match(/embed\/([a-zA-Z0-9_-]+)/);
  return match ? match[1] : null;
};

declare global {
  interface Window {
    YT: {
      Player: new (
        elementId: string,
        options: {
          videoId: string;
          playerVars: Record<string, number | string>;
          events: {
            onReady: (event: { target: YTPlayer }) => void;
            onStateChange?: (event: { data: number; target: YTPlayer }) => void;
            onError?: (event: { data: number }) => void;
          };
        }
      ) => YTPlayer;
      PlayerState: {
        PLAYING: number;
        PAUSED: number;
        ENDED: number;
        BUFFERING: number;
        CUED: number;
      };
    };
    onYouTubeIframeAPIReady?: () => void;
  }
}

interface YTPlayer {
  playVideo: () => void;
  pauseVideo: () => void;
  setPlaybackRate: (rate: number) => void;
  getPlaybackRate: () => number;
  getPlayerState: () => number;
  getDuration: () => number;
  getCurrentTime: () => number;
  seekTo: (seconds: number, allowSeekAhead: boolean) => void;
  destroy: () => void;
}

const SPEEDS = [
  { label: '0.25x', value: 0.25 },
  { label: '0.5x', value: 0.5 },
  { label: '1x', value: 1 },
];

export default function VideoPlayer({ videoUrl, title }: Props) {
  const playerRef = useRef<YTPlayer | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [speed, setSpeed] = useState(1);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isLooping, setIsLooping] = useState(false);
  const [apiReady, setApiReady] = useState(false);
  const [playerReady, setPlayerReady] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const videoId = extractVideoId(videoUrl);

  // Load YouTube IFrame API
  useEffect(() => {
    if (!videoId) return;

    if (window.YT && window.YT.Player) {
      setApiReady(true);
      return;
    }

    const tag = document.createElement('script');
    tag.src = 'https://www.youtube.com/iframe_api';
    document.head.appendChild(tag);

    const handleReady = () => setApiReady(true);
    window.onYouTubeIframeAPIReady = handleReady;

    return () => {
      if (tag.parentNode) {
        document.head.removeChild(tag);
      }
    };
  }, [videoId]);

  // Create player when API is ready
  useEffect(() => {
    if (!apiReady || !videoId) return;

    const playerDiv = document.getElementById('yt-player-target');
    if (!playerDiv) return;

    try {
      const player = new window.YT.Player('yt-player-target', {
        videoId,
        playerVars: {
          autoplay: 0,
          controls: 0,
          modestbranding: 1,
          rel: 0,
          showinfo: 0,
          fs: 0,
          iv_load_policy: 3,
          cc_load_policy: 0,
          playsinline: 1,
          mute: 0,
        },
        events: {
          onReady: (event) => {
            playerRef.current = event.target;
            setPlayerReady(true);
            event.target.setPlaybackRate(1);
          },
          onStateChange: (event) => {
            setIsPlaying(event.data === window.YT.PlayerState.PLAYING);
            if (event.data === window.YT.PlayerState.ENDED && isLooping) {
              event.target.seekTo(0, true);
              event.target.playVideo();
            }
          },
          onError: () => {
            setError('Erro ao carregar o vídeo. Tente recarregar.');
          },
        },
      });

      return () => {
        try {
          player.destroy();
        } catch {
          // ignore
        }
      };
    } catch {
      setError('Não foi possível inicializar o player de vídeo.');
    }
  }, [apiReady, videoId]);

  const togglePlay = useCallback(() => {
    if (!playerRef.current) return;
    if (isPlaying) {
      playerRef.current.pauseVideo();
    } else {
      playerRef.current.playVideo();
    }
  }, [isPlaying]);

  const changeSpeed = useCallback(
    (newSpeed: number) => {
      if (!playerRef.current) return;
      playerRef.current.setPlaybackRate(newSpeed);
      setSpeed(newSpeed);
    },
    []
  );

  const toggleFullscreen = useCallback(async () => {
    const el = containerRef.current;
    if (!el) return;

    try {
      if (!document.fullscreenElement) {
        await el.requestFullscreen();
        setIsFullscreen(true);
      } else {
        await document.exitFullscreen();
        setIsFullscreen(false);
      }
    } catch {
      // Fallback: simulate fullscreen via CSS
      setIsFullscreen((prev) => !prev);
    }
  }, []);

  // Listen for fullscreen changes (ESC key etc)
  useEffect(() => {
    const handler = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };
    document.addEventListener('fullscreenchange', handler);
    return () => document.removeEventListener('fullscreenchange', handler);
  }, []);

  // Keyboard shortcuts
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === ' ' || e.key === 'k') {
        e.preventDefault();
        togglePlay();
      }
      if (e.key === 'f') {
        e.preventDefault();
        toggleFullscreen();
      }
    };
    document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  }, [togglePlay, toggleFullscreen]);

  if (!videoId) {
    return (
      <div className="flex items-center justify-center h-full bg-slate-900 text-white/60 text-sm">
        Vídeo não disponível
      </div>
    );
  }

  return (
    <div
      ref={containerRef}
      className={`relative bg-black w-full h-full flex flex-col ${
        isFullscreen ? 'fixed inset-0 z-[60] rounded-none' : ''
      }`}
    >
      {/* Video area */}
      <div className="flex-1 relative">
        <div id="yt-player-target" className="absolute inset-0" />

        {!playerReady && !error && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/80">
            <div className="flex flex-col items-center gap-3">
              <div className="w-8 h-8 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              <span className="text-white/70 text-xs">Carregando vídeo...</span>
            </div>
          </div>
        )}

        {error && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/80">
            <div className="text-center px-4">
              <i className="ri-error-warning-line text-3xl text-red-400 mb-2"></i>
              <p className="text-white/80 text-sm">{error}</p>
            </div>
          </div>
        )}

        {/* Click overlay to toggle play */}
        <button
          onClick={togglePlay}
          className="absolute inset-0 z-10 cursor-pointer"
          aria-label={isPlaying ? 'Pausar vídeo' : 'Reproduzir vídeo'}
        />

        {/* Center play/pause indicator (fades out) */}
        <div
          className={`absolute inset-0 flex items-center justify-center z-20 pointer-events-none transition-opacity duration-300 ${
            isPlaying ? 'opacity-0' : 'opacity-100'
          }`}
        >
          <div className="w-16 h-16 flex items-center justify-center bg-white/20 backdrop-blur-sm rounded-full">
            <i className={`ri-${isPlaying ? 'pause-fill' : 'play-fill'} text-white text-3xl`}></i>
          </div>
        </div>
      </div>

      {/* Controls bar */}
      <div
        className={`flex items-center justify-between px-3 py-2.5 bg-black/80 backdrop-blur-md ${
          isFullscreen ? 'absolute bottom-0 left-0 right-0' : ''
        }`}
      >
        {/* Play/Pause */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            togglePlay();
          }}
          className="w-9 h-9 flex items-center justify-center rounded-lg hover:bg-white/10 transition-colors cursor-pointer"
          aria-label={isPlaying ? 'Pausar' : 'Reproduzir'}
        >
          <i className={`ri-${isPlaying ? 'pause-fill' : 'play-fill'} text-white text-lg`}></i>
        </button>

        {/* Speed controls */}
        <div className="flex items-center gap-1">
          <span className="text-white/50 text-[10px] uppercase tracking-wider mr-1 hidden sm:block">
            Veloc.
          </span>
          {SPEEDS.map((s) => (
            <button
              key={s.value}
              onClick={(e) => {
                e.stopPropagation();
                changeSpeed(s.value);
              }}
              className={`px-2.5 py-1 rounded-md text-xs font-semibold transition-all cursor-pointer whitespace-nowrap ${
                speed === s.value
                  ? 'bg-white text-black'
                  : 'text-white/70 hover:text-white hover:bg-white/10'
              }`}
            >
              {s.label}
            </button>
          ))}
        </div>

        {/* Loop toggle */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            setIsLooping((prev) => !prev);
          }}
          className={`w-9 h-9 flex items-center justify-center rounded-lg transition-colors cursor-pointer ${
            isLooping
              ? 'bg-white text-black'
              : 'text-white/70 hover:text-white hover:bg-white/10'
          }`}
          aria-label={isLooping ? 'Desativar repetição' : 'Ativar repetição'}
          title={isLooping ? 'Repetição ativada' : 'Repetição desativada'}
        >
          <i className="ri-repeat-line text-lg"></i>
        </button>

        {/* Fullscreen */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            toggleFullscreen();
          }}
          className="w-9 h-9 flex items-center justify-center rounded-lg hover:bg-white/10 transition-colors cursor-pointer"
          aria-label={isFullscreen ? 'Sair da tela cheia' : 'Tela cheia'}
        >
          <i
            className={`ri-${isFullscreen ? 'fullscreen-exit-line' : 'fullscreen-line'} text-white text-lg`}
          ></i>
        </button>
      </div>

      {/* Title overlay when fullscreen */}
      {isFullscreen && (
        <div className="absolute top-0 left-0 right-0 px-4 py-3 bg-gradient-to-b from-black/60 to-transparent z-10">
          <p className="text-white/90 text-sm font-semibold truncate">{title}</p>
        </div>
      )}
    </div>
  );
}