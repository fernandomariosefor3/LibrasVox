/**
 * Extração de frames de um vídeo local, inteiramente no navegador.
 *
 * Não faz nenhuma chamada de rede: a única entrada aceita é um Blob (dados
 * já em memória) ou uma URL local já criada pelo chamador (ex.: um
 * object URL de um Blob). O vídeo em si nunca é persistido por esta
 * função — apenas frames individuais são desenhados em canvas e
 * devolvidos como novos Blobs (PNG).
 */

export interface FramePosition {
  /** Identificador livre do frame (ex.: "inicio", "movimento", "final"). */
  label: string;
  /** Posição temporal como fração da duração do vídeo, de 0 a 1. */
  percentage: number;
}

export interface ExtractedVideoFrame {
  label: string;
  percentage: number;
  timestampSeconds: number;
  blob: Blob;
  previewUrl: string;
}

const FRAME_EXTRACTION_TIMEOUT_MS = 8000;

function waitForVideoEvent(
  video: HTMLVideoElement,
  eventName: 'loadedmetadata' | 'seeked',
  timeoutMessage: string,
): Promise<void> {
  return new Promise((resolve, reject) => {
    const timer = window.setTimeout(() => {
      cleanup();
      reject(new Error(timeoutMessage));
    }, FRAME_EXTRACTION_TIMEOUT_MS);

    const onSuccess = () => {
      cleanup();
      resolve();
    };
    const onError = () => {
      cleanup();
      reject(new Error('Não foi possível carregar o vídeo para extrair os frames.'));
    };
    function cleanup() {
      window.clearTimeout(timer);
      video.removeEventListener(eventName, onSuccess);
      video.removeEventListener('error', onError);
    }

    video.addEventListener(eventName, onSuccess, { once: true });
    video.addEventListener('error', onError, { once: true });
  });
}

/** Revoga os previewUrl de um conjunto de frames já extraídos. */
export function revokeExtractedFrames(frames: ExtractedVideoFrame[]): void {
  frames.forEach((frame) => URL.revokeObjectURL(frame.previewUrl));
}

/**
 * Extrai frames de um vídeo local em posições percentuais da duração.
 * Cria um <video> e um <canvas> temporários, nunca anexados ao DOM
 * visível, e os libera ao final (sucesso ou falha).
 */
export async function extractVideoFrames(
  source: Blob | string,
  positions: FramePosition[],
): Promise<ExtractedVideoFrame[]> {
  if (positions.length === 0) return [];

  let ownedObjectUrl: string | null = null;
  let videoUrl: string;
  if (source instanceof Blob) {
    ownedObjectUrl = URL.createObjectURL(source);
    videoUrl = ownedObjectUrl;
  } else {
    videoUrl = source;
  }

  const video = document.createElement('video');
  video.muted = true;
  video.playsInline = true;
  video.preload = 'auto';
  video.src = videoUrl;

  const frames: ExtractedVideoFrame[] = [];

  try {
    await waitForVideoEvent(video, 'loadedmetadata', 'Não foi possível carregar os metadados do vídeo.');

    const duration = video.duration;
    if (!Number.isFinite(duration) || duration <= 0) {
      throw new Error('O vídeo gravado não tem uma duração válida.');
    }

    const canvas = document.createElement('canvas');
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    if (canvas.width === 0 || canvas.height === 0) {
      throw new Error('O vídeo não tem dimensões válidas para extrair frames.');
    }

    const context = canvas.getContext('2d');
    if (!context) {
      throw new Error('Não foi possível preparar o canvas para extrair os frames.');
    }

    for (const position of positions) {
      const clampedPercentage = Math.min(Math.max(position.percentage, 0), 1);
      const targetSeconds = Math.min(duration * clampedPercentage, Math.max(duration - 0.05, 0));

      video.currentTime = targetSeconds;
      await waitForVideoEvent(
        video,
        'seeked',
        `Não foi possível posicionar o vídeo no frame "${position.label}".`,
      );

      context.drawImage(video, 0, 0, canvas.width, canvas.height);

      const blob = await new Promise<Blob | null>((resolve) => canvas.toBlob(resolve, 'image/png'));
      if (!blob) {
        throw new Error(`Não foi possível gerar a imagem do frame "${position.label}".`);
      }

      frames.push({
        label: position.label,
        percentage: clampedPercentage,
        timestampSeconds: Number(targetSeconds.toFixed(3)),
        blob,
        previewUrl: URL.createObjectURL(blob),
      });
    }

    return frames;
  } catch (caughtError) {
    revokeExtractedFrames(frames);
    throw caughtError instanceof Error
      ? caughtError
      : new Error('Falha inesperada ao extrair frames do vídeo.');
  } finally {
    video.removeAttribute('src');
    video.load();
    if (ownedObjectUrl) URL.revokeObjectURL(ownedObjectUrl);
  }
}
