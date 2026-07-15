import { useCallback, useEffect, useRef, useState, type RefObject } from 'react';
import { FilesetResolver, HandLandmarker, type NormalizedLandmark } from '@mediapipe/tasks-vision';

export type VisionCriterion = { label: string; score: number; note: string; icon: string };
type Sample = { wrist: NormalizedLandmark; openness: number; timestamp: number };
type Status = 'idle' | 'loading' | 'ready' | 'error';

const WASM_PATH = 'https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@0.10.35/wasm';
const MODEL_PATH = `${import.meta.env.BASE_URL}models/hand_landmarker.task`;

const clampScore = (value: number) => Math.max(0, Math.min(100, Math.round(value)));
const distance = (a: NormalizedLandmark, b: NormalizedLandmark) => Math.hypot(a.x - b.x, a.y - b.y, (a.z ?? 0) - (b.z ?? 0));

function handOpenness(points: NormalizedLandmark[]) {
  const palm = Math.max(distance(points[0], points[9]), 0.01);
  return [4, 8, 12, 16, 20].reduce((sum, index) => sum + distance(points[0], points[index]) / palm, 0) / 5;
}

function drawHands(canvas: HTMLCanvasElement, video: HTMLVideoElement, hands: NormalizedLandmark[][]) {
  if (!video.videoWidth || !video.videoHeight) return;
  canvas.width = video.videoWidth;
  canvas.height = video.videoHeight;
  const context = canvas.getContext('2d');
  if (!context) return;
  context.clearRect(0, 0, canvas.width, canvas.height);
  context.lineCap = 'round';
  for (const hand of hands) {
    context.strokeStyle = '#34d399';
    context.lineWidth = Math.max(2, canvas.width / 320);
    for (const connection of HandLandmarker.HAND_CONNECTIONS) {
      const from = hand[connection.start];
      const to = hand[connection.end];
      context.beginPath();
      context.moveTo(from.x * canvas.width, from.y * canvas.height);
      context.lineTo(to.x * canvas.width, to.y * canvas.height);
      context.stroke();
    }
    for (const point of hand) {
      context.beginPath();
      context.fillStyle = '#d1fae5';
      context.strokeStyle = '#047857';
      context.arc(point.x * canvas.width, point.y * canvas.height, Math.max(3, canvas.width / 220), 0, Math.PI * 2);
      context.fill();
      context.stroke();
    }
  }
}

function scoreSamples(samples: Sample[], sign: string): VisionCriterion[] | null {
  if (samples.length < 6) return null;
  const average = (values: number[]) => values.reduce((sum, value) => sum + value, 0) / values.length;
  const openness = average(samples.map((sample) => sample.openness));
  const configuration = clampScore(55 + (openness - 1.35) * 55);
  const averageY = average(samples.map((sample) => sample.wrist.y));
  const location = clampScore(100 - Math.abs(averageY - 0.4) * 240);
  const xs = samples.map((sample) => sample.wrist.x);
  const ys = samples.map((sample) => sample.wrist.y);
  const zs = samples.map((sample) => sample.wrist.z ?? 0);
  const range = (values: number[]) => Math.max(...values) - Math.min(...values);
  const horizontal = range(xs);
  const vertical = range(ys);
  const depth = range(zs);
  const movement = sign === 'Obrigado'
    ? clampScore(45 + depth * 650 + vertical * 160)
    : clampScore(35 + horizontal * 500 - vertical * 120);

  return [
    {
      label: 'Configuração da mão', score: configuration, icon: 'ri-hand',
      note: configuration >= 80 ? 'Boa abertura da mão e extensão dos dedos.' : 'Abra mais a mão e mantenha os dedos estendidos.',
    },
    {
      label: 'Localização', score: location, icon: 'ri-focus-3-line',
      note: location >= 80 ? 'A mão permaneceu na região esperada do enquadramento.' : averageY > 0.4 ? 'Eleve um pouco a mão, aproximando-a da altura do rosto.' : 'Abaixe levemente a mão para a região do rosto.',
    },
    {
      label: 'Movimento', score: movement, icon: 'ri-route-line',
      note: movement >= 80 ? 'A trajetória principal ficou clara e consistente.' : sign === 'Obrigado' ? 'Aumente o deslocamento da mão para frente e para baixo.' : 'Amplie o movimento lateral e reduza o deslocamento vertical.',
    },
  ];
}

export function useHandLandmarker(
  videoRef: RefObject<HTMLVideoElement | null>,
  canvasRef: RefObject<HTMLCanvasElement | null>,
  enabled: boolean,
  recording: boolean,
) {
  const landmarkerRef = useRef<HandLandmarker | null>(null);
  const animationRef = useRef(0);
  const lastVideoTimeRef = useRef(-1);
  const samplesRef = useRef<Sample[]>([]);
  const recordingRef = useRef(recording);
  const [status, setStatus] = useState<Status>('idle');
  const [handsDetected, setHandsDetected] = useState(0);

  useEffect(() => { recordingRef.current = recording; if (recording) samplesRef.current = []; }, [recording]);
  useEffect(() => () => {
    cancelAnimationFrame(animationRef.current);
    landmarkerRef.current?.close();
    landmarkerRef.current = null;
  }, []);

  useEffect(() => {
    if (!enabled || landmarkerRef.current) return;
    let cancelled = false;
    setStatus('loading');
    (async () => {
      try {
        const vision = await FilesetResolver.forVisionTasks(WASM_PATH);
        const landmarker = await HandLandmarker.createFromOptions(vision, {
          baseOptions: { modelAssetPath: MODEL_PATH, delegate: 'GPU' },
          runningMode: 'VIDEO', numHands: 2,
          minHandDetectionConfidence: 0.5, minHandPresenceConfidence: 0.5, minTrackingConfidence: 0.5,
        });
        if (cancelled) { landmarker.close(); return; }
        landmarkerRef.current = landmarker;
        setStatus('ready');
      } catch {
        if (!cancelled) setStatus('error');
      }
    })();
    return () => { cancelled = true; };
  }, [enabled]);

  useEffect(() => {
    if (!enabled || status !== 'ready') return;
    const processFrame = () => {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      const landmarker = landmarkerRef.current;
      if (video && canvas && landmarker && video.readyState >= 2 && video.currentTime !== lastVideoTimeRef.current) {
        lastVideoTimeRef.current = video.currentTime;
        const result = landmarker.detectForVideo(video, performance.now());
        drawHands(canvas, video, result.landmarks);
        setHandsDetected(result.landmarks.length);
        if (recordingRef.current && result.landmarks[0]) {
          samplesRef.current.push({ wrist: { ...result.landmarks[0][0] }, openness: handOpenness(result.landmarks[0]), timestamp: performance.now() });
        }
      }
      animationRef.current = requestAnimationFrame(processFrame);
    };
    animationRef.current = requestAnimationFrame(processFrame);
    return () => cancelAnimationFrame(animationRef.current);
  }, [enabled, status, videoRef, canvasRef]);

  const evaluate = useCallback((sign: string) => scoreSamples(samplesRef.current, sign), []);
  return { status, handsDetected, evaluate };
}
