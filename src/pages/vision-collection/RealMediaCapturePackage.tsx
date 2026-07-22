import { useEffect, useRef, useState } from 'react';
import {
  extractVideoFrames,
  revokeExtractedFrames,
  type ExtractedVideoFrame,
} from './utils/extractVideoFrames';
import {
  REAL_MEDIA_SIGNS,
  REAL_MEDIA_DEFAULT_REGION,
  REAL_MEDIA_FRAME_POSITIONS,
  type RealMediaSignId,
  type RealMediaFrameRole,
  type RealMediaManifest,
} from './types';

const fieldClass = 'input text-sm';

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return <label className="block"><span className="block text-xs font-semibold text-surface-600 mb-1.5">{label}</span>{children}</label>;
}

type CameraFacingMode = 'user' | 'environment';

const CAMERA_ERROR_MESSAGES: Record<string, string> = {
  NotAllowedError: 'A câmera não foi autorizada. Verifique a permissão do site no navegador.',
  NotReadableError:
    'A câmera já está sendo usada por outro recurso ou aplicativo. Feche outros usos da câmera e tente novamente.',
  NotFoundError: 'Nenhuma câmera foi encontrada neste dispositivo.',
  OverconstrainedError: 'A câmera solicitada não está disponível. Tentando outra câmera.',
  AbortError: 'O navegador interrompeu a abertura da câmera. Tente novamente.',
  default: 'Não foi possível iniciar a câmera. Feche outros aplicativos que usam a câmera e tente novamente.',
};

/**
 * Mapeia o erro para uma mensagem segura ao usuário e registra no console
 * somente error.name + a mensagem já sanitizada — nunca as constraints,
 * dados do dispositivo ou o objeto de erro bruto do navegador.
 */
function describeCameraError(error: unknown): string {
  const name = error instanceof DOMException || error instanceof Error ? error.name : 'UnknownError';
  const message = CAMERA_ERROR_MESSAGES[name] ?? CAMERA_ERROR_MESSAGES.default;
  console.error('[RealMediaCapturePackage] camera error', name, message);
  return message;
}

const METADATA_WAIT_TIMEOUT_MS = 5000;
const CAMERA_SAFETY_TIMEOUT_MS = 8000;

/**
 * Espera o evento loadedmetadata por no máximo 5 segundos, mas nunca
 * rejeita: se o readyState já for maior que zero, resolve na hora; se o
 * timeout vencer sem o evento, resolve mesmo assim, para que video.play()
 * seja sempre tentado (alguns navegadores móveis não disparam
 * loadedmetadata de forma confiável para streams via srcObject).
 */
function waitForLoadedMetadataOrTimeout(video: HTMLVideoElement): Promise<void> {
  if (video.readyState > 0) return Promise.resolve();
  return new Promise((resolve) => {
    const timer = window.setTimeout(() => {
      cleanup();
      resolve();
    }, METADATA_WAIT_TIMEOUT_MS);
    const onLoaded = () => {
      cleanup();
      resolve();
    };
    function cleanup() {
      window.clearTimeout(timer);
      video.removeEventListener('loadedmetadata', onLoaded);
    }
    video.addEventListener('loadedmetadata', onLoaded, { once: true });
  });
}

type CameraStatus = 'off' | 'requesting' | 'preparing' | 'active';

const CAMERA_STATUS_LABEL: Record<Exclude<CameraStatus, 'active'>, string> = {
  off: 'Câmera desligada',
  requesting: 'Solicitando acesso à câmera...',
  preparing: 'Preparando visualização...',
};

export default function RealMediaCapturePackage() {
  const [signId, setSignId] = useState<RealMediaSignId>(REAL_MEDIA_SIGNS[0].id);
  const [region, setRegion] = useState(REAL_MEDIA_DEFAULT_REGION);
  const [signerReference, setSignerReference] = useState('');
  const [notes, setNotes] = useState('');
  const [consent, setConsent] = useState(false);
  const [cameraOn, setCameraOn] = useState(false);
  const [cameraStarting, setCameraStarting] = useState(false);
  const [cameraStatus, setCameraStatus] = useState<CameraStatus>('off');
  const [facingMode, setFacingMode] = useState<CameraFacingMode>('user');
  const [recording, setRecording] = useState(false);
  const [elapsed, setElapsed] = useState(0);
  const [clip, setClip] = useState<{ blob: Blob; url: string; duration: number } | null>(null);
  const [frames, setFrames] = useState<ExtractedVideoFrame[] | null>(null);
  const [extracting, setExtracting] = useState(false);
  const [error, setError] = useState('');

  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const recorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const startedAtRef = useRef(0);
  const clipUrlRef = useRef<string | null>(null);
  const framesRef = useRef<ExtractedVideoFrame[] | null>(null);
  const safetyTimeoutRef = useRef<number | null>(null);

  const clearSafetyTimeout = () => {
    if (safetyTimeoutRef.current !== null) {
      window.clearTimeout(safetyTimeoutRef.current);
      safetyTimeoutRef.current = null;
    }
  };

  const selectedSign = REAL_MEDIA_SIGNS.find((sign) => sign.id === signId) ?? REAL_MEDIA_SIGNS[0];

  useEffect(() => {
    framesRef.current = frames;
  }, [frames]);

  const releaseCurrentStream = () => {
    streamRef.current?.getTracks().forEach((track) => track.stop());
    streamRef.current = null;
    if (videoRef.current) videoRef.current.srcObject = null;
  };

  useEffect(() => {
    return () => {
      clearSafetyTimeout();
      releaseCurrentStream();
      if (clipUrlRef.current) URL.revokeObjectURL(clipUrlRef.current);
      if (framesRef.current) revokeExtractedFrames(framesRef.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Libera a câmera também quando a página é ocultada/fechada no mobile
  // (pagehide é mais confiável que unload/visibilitychange em iOS Safari).
  useEffect(() => {
    const handlePageHide = () => {
      streamRef.current?.getTracks().forEach((track) => track.stop());
    };
    window.addEventListener('pagehide', handlePageHide);
    return () => window.removeEventListener('pagehide', handlePageHide);
  }, []);

  useEffect(() => {
    if (!recording) return;
    const timer = window.setInterval(() => setElapsed((Date.now() - startedAtRef.current) / 1000), 100);
    return () => window.clearInterval(timer);
  }, [recording]);

  const stopCamera = () => {
    releaseCurrentStream();
    setCameraOn(false);
    setCameraStatus('off');
  };

  const requestCameraStream = (mode: CameraFacingMode) =>
    navigator.mediaDevices.getUserMedia({
      video: { facingMode: { ideal: mode }, width: { ideal: 1280 }, height: { ideal: 720 } },
      audio: false,
    });

  /**
   * Confirma que o <video> existe, atribui o stream, aguarda metadata (no
   * máximo 5s, sem travar) e chama play() — só então marca a câmera como
   * ativa. Se o <video> não existir, para o stream recém-obtido e lança um
   * erro reconhecível em vez de falhar silenciosamente.
   */
  const attachStreamAndActivate = async (stream: MediaStream, mode: CameraFacingMode) => {
    const video = videoRef.current;
    if (!video) {
      stream.getTracks().forEach((track) => track.stop());
      throw new Error('MISSING_VIDEO_ELEMENT');
    }
    streamRef.current = stream;
    setCameraStatus('preparing');
    video.srcObject = stream;
    await waitForLoadedMetadataOrTimeout(video);
    await video.play();
    setFacingMode(mode);
    setCameraOn(true);
    setCameraStatus('active');
    setError('');
  };

  const missingVideoMessage =
    'Não foi possível preparar a visualização da câmera. Recarregue a página e tente novamente.';

  const startCamera = async () => {
    if (cameraStarting) return;
    setCameraStarting(true);
    setError('');
    setCameraStatus('requesting');
    releaseCurrentStream();

    if (!navigator.mediaDevices?.getUserMedia) {
      setError('Este navegador não disponibilizou acesso à câmera para esta página.');
      setCameraStatus('off');
      setCameraStarting(false);
      return;
    }

    clearSafetyTimeout();
    safetyTimeoutRef.current = window.setTimeout(() => {
      releaseCurrentStream();
      setCameraOn(false);
      setCameraStarting(false);
      setCameraStatus('off');
      setError(
        'A câmera foi autorizada, mas o navegador não conseguiu exibir a imagem. Feche outras abas que usam a câmera e tente novamente.',
      );
    }, CAMERA_SAFETY_TIMEOUT_MS);

    try {
      const stream = await requestCameraStream('user');
      await attachStreamAndActivate(stream, 'user');
    } catch (firstError) {
      if (firstError instanceof Error && firstError.message === 'MISSING_VIDEO_ELEMENT') {
        setError(missingVideoMessage);
        setCameraStatus('off');
      } else {
        const isOverconstrained = firstError instanceof DOMException && firstError.name === 'OverconstrainedError';
        if (isOverconstrained) {
          setError(describeCameraError(firstError));
          try {
            const fallbackStream = await navigator.mediaDevices.getUserMedia({ video: true, audio: false });
            await attachStreamAndActivate(fallbackStream, 'user');
          } catch (secondError) {
            if (secondError instanceof Error && secondError.message === 'MISSING_VIDEO_ELEMENT') {
              setError(missingVideoMessage);
            } else {
              setError(describeCameraError(secondError));
            }
            setCameraOn(false);
            setCameraStatus('off');
          }
        } else {
          setError(describeCameraError(firstError));
          setCameraOn(false);
          setCameraStatus('off');
        }
      }
    } finally {
      clearSafetyTimeout();
      setCameraStarting(false);
    }
  };

  const handleSwitchCamera = async () => {
    if (!cameraOn || recording || cameraStarting) return;
    const nextFacingMode: CameraFacingMode = facingMode === 'user' ? 'environment' : 'user';
    setCameraStarting(true);
    setError('');
    setCameraStatus('preparing');

    releaseCurrentStream();

    try {
      const stream = await requestCameraStream(nextFacingMode);
      await attachStreamAndActivate(stream, nextFacingMode);
    } catch {
      try {
        const fallbackStream = await requestCameraStream(facingMode);
        await attachStreamAndActivate(fallbackStream, facingMode);
        setError('Não foi possível alternar a câmera neste dispositivo.');
      } catch (fallbackError) {
        setCameraOn(false);
        setCameraStatus('off');
        if (fallbackError instanceof Error && fallbackError.message === 'MISSING_VIDEO_ELEMENT') {
          setError(missingVideoMessage);
        } else {
          setError(describeCameraError(fallbackError));
        }
      }
    } finally {
      setCameraStarting(false);
    }
  };

  const discardClipAndFrames = () => {
    if (clipUrlRef.current) {
      URL.revokeObjectURL(clipUrlRef.current);
      clipUrlRef.current = null;
    }
    if (framesRef.current) revokeExtractedFrames(framesRef.current);
    setClip(null);
    setFrames(null);
  };

  const confirmDiscardIfNeeded = (question: string): boolean => {
    if (!frames || frames.length === 0) return true;
    return window.confirm(question);
  };

  const startRecording = () => {
    const stream = streamRef.current;
    if (!stream || !cameraOn || recording) return;
    if (clip) {
      const proceed = confirmDiscardIfNeeded(
        'Você já extraiu frames desta gravação. Gravar novamente vai descartar o vídeo e os frames atuais. Deseja continuar?',
      );
      if (!proceed) return;
      discardClipAndFrames();
    }
    setError('');
    const preferred = ['video/webm;codecs=vp9', 'video/webm;codecs=vp8', 'video/webm'].find((type) =>
      MediaRecorder.isTypeSupported(type),
    );
    const recorder = new MediaRecorder(stream, preferred ? { mimeType: preferred } : undefined);
    chunksRef.current = [];
    recorder.ondataavailable = (event) => {
      if (event.data.size) chunksRef.current.push(event.data);
    };
    recorder.onstop = () => {
      setRecording(false);
      const duration = Math.max(0.1, (Date.now() - startedAtRef.current) / 1000);
      const blob = new Blob(chunksRef.current, { type: recorder.mimeType || 'video/webm' });
      if (blob.size === 0) {
        setError('A gravação ficou vazia. Tente gravar novamente com a câmera visível.');
        return;
      }
      const url = URL.createObjectURL(blob);
      clipUrlRef.current = url;
      setClip({ blob, url, duration });
    };
    recorderRef.current = recorder;
    startedAtRef.current = Date.now();
    setElapsed(0);
    setRecording(true);
    recorder.start(250);
  };

  const stopRecording = () => {
    if (recorderRef.current?.state === 'recording') recorderRef.current.stop();
  };

  const handleSignChange = (nextSignId: RealMediaSignId) => {
    if (nextSignId === signId) return;
    if (clip) {
      const proceed = confirmDiscardIfNeeded(
        'Trocar de sinal vai descartar a gravação e os frames extraídos para o sinal atual. Deseja continuar?',
      );
      if (!proceed) return;
      discardClipAndFrames();
    }
    setSignId(nextSignId);
  };

  const handleExtractFrames = async () => {
    if (!clip) return;
    setError('');
    setExtracting(true);
    if (frames) {
      revokeExtractedFrames(frames);
      setFrames(null);
    }
    try {
      const positions = REAL_MEDIA_FRAME_POSITIONS.map((position) => ({
        label: position.role,
        percentage: position.percentage,
      }));
      const extracted = await extractVideoFrames(clip.blob, positions);
      setFrames(extracted);
    } catch (extractionError) {
      setError(
        extractionError instanceof Error
          ? extractionError.message
          : 'Não foi possível extrair os frames deste vídeo.',
      );
    } finally {
      setExtracting(false);
    }
  };

  const videoExtension = clip?.blob.type.includes('mp4') ? 'mp4' : 'webm';
  const videoFilename = `${selectedSign.id}.${videoExtension}`;

  const downloadBlob = (blob: Blob, filename: string) => {
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    link.click();
    URL.revokeObjectURL(url);
  };

  const handleDownloadVideo = () => {
    if (!consent || !clip) return;
    const link = document.createElement('a');
    link.href = clip.url;
    link.download = videoFilename;
    link.click();
  };

  const handleDownloadFrame = (frame: ExtractedVideoFrame) => {
    if (!consent) return;
    downloadBlob(frame.blob, `${selectedSign.id}-${frame.label}.png`);
  };

  const buildManifest = (): RealMediaManifest | null => {
    if (!clip || !frames || frames.length === 0) return null;
    return {
      schemaVersion: 'real-media-mvp-1',
      signalId: selectedSign.id,
      signalLabel: selectedSign.label,
      region: region.trim(),
      signerReference: signerReference.trim(),
      notes: notes.trim(),
      recordedAt: new Date().toISOString(),
      validationStatus: 'draft_media',
      humanValidated: false,
      consentConfirmed: consent,
      video: {
        filename: videoFilename,
        mimeType: clip.blob.type,
        durationSeconds: Number(clip.duration.toFixed(2)),
      },
      frames: frames.map((frame) => ({
        role: frame.label as RealMediaFrameRole,
        filename: `${selectedSign.id}-${frame.label}.png`,
        timestampSeconds: frame.timestampSeconds,
      })),
      privacy: {
        processedLocally: true,
        uploadedToServer: false,
      },
    };
  };

  const handleDownloadManifest = () => {
    if (!consent) return;
    const manifest = buildManifest();
    if (!manifest) return;
    const blob = new Blob([JSON.stringify(manifest, null, 2)], { type: 'application/json' });
    downloadBlob(blob, `${selectedSign.id}-manifest.json`);
  };

  const canDownloadVideo = consent && Boolean(clip);
  const canDownloadFrames = consent && Boolean(frames && frames.length > 0);

  return (
    <section className="max-w-7xl mx-auto px-4 md:px-8 py-8 border-t border-surface-200">
      <div className="mb-6 pt-8">
        <p className="text-xs font-bold uppercase tracking-widest text-brand-600">Mídia Real MVP</p>
        <h2 className="text-2xl font-extrabold text-surface-900">Pacote de mídia real</h2>
        <p className="text-surface-500 text-sm mt-1 max-w-2xl">
          Grave uma pessoa real sinalizando Oi/Olá, Obrigado ou Tchau e monte um pacote de mídia
          (vídeo + três frames + manifesto) para revisão humana futura.
        </p>
      </div>

      <div className="grid lg:grid-cols-[.82fr_1.18fr] gap-6 items-start">
        <div className="space-y-5">
          <article className="bg-white border border-surface-200 rounded-3xl p-5 shadow-card">
            <p className="text-xs font-bold uppercase tracking-widest text-brand-600 mb-3">Dados do sinal</p>
            <div className="space-y-4">
              <Field label="Sinal">
                <select
                  className={fieldClass}
                  value={signId}
                  onChange={(event) => handleSignChange(event.target.value as RealMediaSignId)}
                >
                  {REAL_MEDIA_SIGNS.map((sign) => (
                    <option key={sign.id} value={sign.id}>
                      {sign.label}
                    </option>
                  ))}
                </select>
              </Field>
              <Field label="Região ou variante">
                <input
                  className={fieldClass}
                  value={region}
                  onChange={(event) => setRegion(event.target.value)}
                  placeholder={REAL_MEDIA_DEFAULT_REGION}
                />
              </Field>
              <Field label="Identificador do sinalizante (opcional)">
                <input
                  className={fieldClass}
                  value={signerReference}
                  onChange={(event) => setSignerReference(event.target.value)}
                  placeholder="Ex.: iniciais ou código — não use o nome completo"
                />
              </Field>
              <Field label="Observações (opcional)">
                <textarea
                  className={`${fieldClass} min-h-[72px]`}
                  value={notes}
                  onChange={(event) => setNotes(event.target.value)}
                  placeholder="Contexto adicional para quem for revisar depois"
                />
              </Field>
            </div>
          </article>

          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 text-xs text-slate-600 leading-relaxed space-y-2">
            <p>
              <i className="ri-shield-check-line mr-1.5 text-brand-600" />
              Este material ainda não está linguisticamente validado. A gravação e os frames
              permanecem como rascunho até revisão humana.
            </p>
            <p>
              <i className="ri-lock-line mr-1.5 text-brand-600" />
              Todo o processamento ocorre neste navegador. O LibrasVox não envia este vídeo para um
              servidor neste fluxo.
            </p>
          </div>
        </div>

        <div className="space-y-5">
          <article className="bg-white border border-surface-200 rounded-3xl shadow-card overflow-hidden">
            <div className="p-5 flex justify-between items-center border-b border-surface-100">
              <div>
                <p className="text-xs font-bold uppercase tracking-widest text-brand-600">Gravação</p>
                <h3 className="text-lg font-extrabold">{selectedSign.label}</h3>
              </div>
              {recording && (
                <span className="badge bg-rose-100 text-rose-700">
                  <span className="w-2 h-2 bg-rose-500 rounded-full animate-pulse" /> REC {elapsed.toFixed(1)}s
                </span>
              )}
            </div>

            <div className="relative aspect-video bg-surface-900">
              <video
                ref={videoRef}
                autoPlay
                playsInline
                muted
                className={`absolute inset-0 w-full h-full object-cover ${cameraOn ? 'opacity-100' : 'opacity-0'}`}
                style={{ transform: facingMode === 'user' ? 'scaleX(-1)' : 'none' }}
              />
              {!cameraOn && (
                <div className="absolute inset-0 grid place-items-center text-center p-8">
                  <div>
                    <span className="w-16 h-16 bg-white/10 text-white rounded-2xl grid place-items-center mx-auto mb-4">
                      <i className="ri-camera-line text-2xl" />
                    </span>
                    <p className="text-surface-300 text-sm">Enquadre mãos, braços, rosto e tronco.</p>
                    <button onClick={startCamera} disabled={cameraStarting} className="btn-primary mt-4 disabled:opacity-50">
                      <i className={cameraStarting ? 'ri-loader-4-line animate-spin' : 'ri-camera-line'} />{' '}
                      {cameraStarting ? 'Abrindo câmera...' : 'Iniciar câmera'}
                    </button>
                  </div>
                </div>
              )}
              <div className="absolute inset-x-0 bottom-0 p-5 pt-16 bg-gradient-to-t from-black/80 to-transparent flex flex-col items-center gap-2">
                <div className="flex justify-center gap-3">
                  {cameraOn && !recording && (
                    <button onClick={startRecording} className="btn bg-white text-surface-900 px-6 py-3">
                      <i className="ri-record-circle-line text-rose-500" /> {clip ? 'Gravar novamente' : 'Gravar amostra'}
                    </button>
                  )}
                  {recording && (
                    <button onClick={stopRecording} className="btn bg-rose-500 text-white px-6 py-3">
                      <i className="ri-stop-fill" /> Encerrar gravação
                    </button>
                  )}
                  {cameraOn && !recording && (
                    <button onClick={handleSwitchCamera} disabled={cameraStarting} className="btn bg-white/10 text-white px-4 py-3 disabled:opacity-50">
                      <i className="ri-camera-switch-line" /> Trocar câmera
                    </button>
                  )}
                  {cameraOn && !recording && (
                    <button onClick={stopCamera} className="btn bg-white/10 text-white px-4 py-3">
                      <i className="ri-camera-off-line" />
                    </button>
                  )}
                </div>
                <span className={`text-2xs font-medium ${error ? 'text-rose-300' : 'text-white/70'}`}>
                  {error ||
                    (cameraStatus === 'active'
                      ? facingMode === 'user'
                        ? 'Câmera frontal ativa'
                        : 'Câmera traseira ativa'
                      : CAMERA_STATUS_LABEL[cameraStatus])}
                </span>
              </div>
            </div>

            {error && (
              <p className="m-4 p-3 text-sm text-rose-700 bg-rose-50 rounded-xl">
                <i className="ri-error-warning-line mr-2" />
                {error}
              </p>
            )}

            <label className="m-5 flex items-start gap-3 p-4 rounded-2xl bg-amber-50 border border-amber-200 cursor-pointer">
              <input
                type="checkbox"
                checked={consent}
                onChange={(event) => setConsent(event.target.checked)}
                className="mt-1 accent-emerald-600"
              />
              <span className="text-xs text-amber-900">
                <strong className="block text-sm mb-1">Autorização de imagem</strong>
                Confirmo que tenho autorização da pessoa sinalizante para utilizar esta gravação e
                os frames extraídos no processo de revisão do LibrasVox.
              </span>
            </label>
          </article>

          {clip && (
            <article className="bg-white border border-brand-200 rounded-3xl p-5 animate-fade-up">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-extrabold">Vídeo gravado</h3>
                <span className="badge-brand">{clip.duration.toFixed(1)} segundos</span>
              </div>
              <video src={clip.url} controls className="w-full aspect-video bg-black rounded-2xl" />
              <div className="flex flex-col sm:flex-row gap-3 mt-4">
                <button onClick={handleExtractFrames} disabled={extracting} className="btn-primary flex-1 disabled:opacity-50">
                  <i className={extracting ? 'ri-loader-4-line animate-spin' : 'ri-scissors-cut-line'} />{' '}
                  {extracting ? 'Extraindo frames…' : frames ? 'Extrair novamente' : 'Extrair frames'}
                </button>
                <button onClick={handleDownloadVideo} disabled={!canDownloadVideo} className="btn-secondary disabled:opacity-50">
                  <i className="ri-download-2-line" /> Baixar vídeo
                </button>
              </div>
              {!consent && (
                <p className="text-2xs text-amber-700 mt-3">
                  <i className="ri-lock-line mr-1" />
                  Marque a autorização de imagem acima para liberar os downloads.
                </p>
              )}
            </article>
          )}

          {frames && frames.length > 0 && (
            <article className="bg-white border border-surface-200 rounded-3xl p-5">
              <h3 className="text-lg font-extrabold mb-4">Frames extraídos</h3>
              <div className="grid sm:grid-cols-3 gap-4">
                {frames.map((frame) => {
                  const position = REAL_MEDIA_FRAME_POSITIONS.find((item) => item.role === frame.label);
                  return (
                    <div key={frame.label} className="border border-surface-200 rounded-2xl overflow-hidden">
                      <img
                        src={frame.previewUrl}
                        alt={`Frame "${position?.cardLabel ?? frame.label}" do sinal ${selectedSign.label}`}
                        className="w-full aspect-video object-cover bg-surface-900"
                      />
                      <div className="p-3">
                        <p className="text-sm font-bold">{position?.cardLabel ?? frame.label}</p>
                        <p className="text-2xs text-surface-400 mb-2">{frame.timestampSeconds.toFixed(2)}s</p>
                        <button
                          onClick={() => handleDownloadFrame(frame)}
                          disabled={!canDownloadFrames}
                          className="btn-secondary w-full text-xs disabled:opacity-50"
                        >
                          <i className="ri-image-line" /> Baixar PNG
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
              <button
                onClick={handleDownloadManifest}
                disabled={!canDownloadFrames}
                className="btn-primary w-full mt-4 disabled:opacity-50"
              >
                <i className="ri-file-code-line" /> Baixar manifesto JSON
              </button>
            </article>
          )}
        </div>
      </div>
    </section>
  );
}
