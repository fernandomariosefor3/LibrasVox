import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '@/components/feature/Navbar';
import Footer from '@/components/feature/Footer';
import { SEOHead } from '@/components/feature/SEOHead';
import { pageSEO, SITE_URL, generateWebPageSchema } from '@/lib/seo';
import { useHandLandmarker, type VisionCriterion } from '@/hooks/useHandLandmarker';
import { ACTIVE_VISION_SIGNS, VISION_SIGNS } from '@/data/visionSigns';

type Stage = 'watch' | 'ready' | 'countdown' | 'recording' | 'analyzing' | 'result';
type Attempt = { id: number; score: number };

export default function RecognitionPage() {
  const [selected, setSelected] = useState(0);
  const [speed, setSpeed] = useState(1);
  const [stage, setStage] = useState<Stage>('watch');
  const [cameraOn, setCameraOn] = useState(false);
  const [cameraError, setCameraError] = useState('');
  const [count, setCount] = useState(3);
  const [result, setResult] = useState<VisionCriterion[]>([]);
  const [attempts, setAttempts] = useState<Attempt[]>(() => { try { return JSON.parse(localStorage.getItem('vision-attempts') || '[]'); } catch { return []; } });
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const sign = ACTIVE_VISION_SIGNS[selected];
  const { status: visionStatus, handsDetected, evaluate } = useHandLandmarker(videoRef, canvasRef, cameraOn, stage === 'recording');

  const stopCamera = useCallback(() => {
    streamRef.current?.getTracks().forEach((track) => track.stop());
    streamRef.current = null;
    if (videoRef.current) videoRef.current.srcObject = null;
    setCameraOn(false);
  }, []);

  useEffect(() => () => stopCamera(), [stopCamera]);
  useEffect(() => {
    if (stage !== 'countdown') return;
    if (!count) { setStage('recording'); return; }
    const timer = setTimeout(() => setCount((n) => n - 1), 800);
    return () => clearTimeout(timer);
  }, [stage, count]);
  useEffect(() => {
    if (stage !== 'recording') return;
    const timer = setTimeout(() => setStage('analyzing'), 3200);
    return () => clearTimeout(timer);
  }, [stage]);
  useEffect(() => {
    if (stage !== 'analyzing') return;
    const timer = setTimeout(() => {
      const set = evaluate(sign.word);
      if (!set) {
        setCameraError('Não houve pontos suficientes para avaliar. Mantenha a mão inteira visível e tente novamente.');
        setStage('ready');
        return;
      }
      const score = Math.round(set.reduce((sum, item) => sum + item.score, 0) / set.length);
      setResult(set);
      setAttempts((old) => {
        const next = [{ id: Date.now(), score }, ...old].slice(0, 8);
        localStorage.setItem('vision-attempts', JSON.stringify(next));
        return next;
      });
      setStage('result');
    }, 900);
    return () => clearTimeout(timer);
  }, [stage, attempts.length, evaluate, sign.word]);

  const startCamera = async () => {
    setCameraError('');
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'user', width: { ideal: 960 } }, audio: false });
      streamRef.current = stream;
      if (videoRef.current) { videoRef.current.srcObject = stream; await videoRef.current.play(); }
      setCameraOn(true); setStage('ready');
    } catch (error) {
      setCameraError((error as DOMException).name === 'NotAllowedError' ? 'Permissão negada. Libere a câmera nas configurações do navegador.' : 'Não foi possível iniciar a câmera neste dispositivo.');
    }
  };
  const startAttempt = () => { setCameraError(''); setResult([]); setCount(3); setStage('countdown'); };
  const retry = () => { setResult([]); setStage(cameraOn ? 'ready' : 'watch'); if (!cameraOn) startCamera(); };
  const score = result.length ? Math.round(result.reduce((sum, item) => sum + item.score, 0) / result.length) : 0;
  const best = useMemo(() => attempts.reduce((max, item) => Math.max(max, item.score), 0), [attempts]);
  const seo = pageSEO.recognition;

  return <>
    <SEOHead title={seo.title} description={seo.description} keywords={seo.keywords} canonical={`${SITE_URL}/recognition`} ogTitle={seo.title} ogDescription={seo.description} ogType="website" ogUrl={`${SITE_URL}/recognition`} schema={generateWebPageSchema(seo.title, seo.description, `${SITE_URL}/recognition`)} />
    <div className="min-h-screen bg-surface-50"><Navbar /><main className="pt-16">
      <section className="relative overflow-hidden bg-surface-900 text-white"><div className="absolute inset-0 bg-mesh-brand opacity-70" /><div className="relative max-w-7xl mx-auto px-4 md:px-8 py-10 flex flex-col md:flex-row md:items-end justify-between gap-6"><div><div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[.18em] text-brand-300 mb-3"><span className="w-2 h-2 bg-brand-400 rounded-full animate-pulse" /> LibrasVox Vision · Protótipo</div><h1 className="text-3xl md:text-5xl font-extrabold">Treine. Veja. <span className="text-brand-400">Aperfeiçoe.</span></h1><p className="mt-3 text-surface-300 max-w-2xl">Pratique diante da câmera e receba orientação sobre configuração da mão, localização e movimento.</p></div><div className="flex gap-3"><Stat value={`${attempts.length}`} label="tentativas" /><Stat value={best ? `${best}%` : '—'} label="melhor resultado" accent /></div></div></section>

      <section className="max-w-7xl mx-auto px-4 md:px-8 py-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-5"><div className="flex gap-3 overflow-x-auto scrollbar-hide pb-2">{ACTIVE_VISION_SIGNS.map((item, index) => <button key={item.id} onClick={() => { setSelected(index); setResult([]); setStage(cameraOn ? 'ready' : 'watch'); }} className={`flex items-center gap-3 px-4 py-3 rounded-2xl border shrink-0 text-left ${selected === index ? 'bg-surface-900 border-surface-900 text-white shadow-lg' : 'bg-white border-surface-200 text-surface-700'}`}><span className="text-2xl">{item.emoji}</span><span><strong className="block text-sm">{item.word}</strong><small className="opacity-60">Validando</small></span></button>)}</div><Link to="/vision/coleta" className="btn-secondary shrink-0"><i className="ri-video-add-line" /> Estúdio de coleta</Link></div>
        <div className="grid lg:grid-cols-[.86fr_1.14fr] gap-6 items-start">
          <div className="space-y-4"><article className="bg-white rounded-3xl border border-surface-200 shadow-card overflow-hidden"><div className={`relative aspect-video bg-gradient-to-br ${sign.gradient ?? 'from-brand-400 to-teal-600'} flex items-center justify-center overflow-hidden`}><div className="absolute inset-0 opacity-20" style={{ backgroundImage: 'radial-gradient(circle,white 1px,transparent 1px)', backgroundSize: '24px 24px' }} /><span className="text-[7rem] animate-bounce-gentle select-none" style={{ animationDuration: `${2 / speed}s` }}>{sign.emoji}</span><span className="absolute top-4 left-4 badge bg-black/25 text-white backdrop-blur-md"><i className="ri-video-line" /> Referência visual</span></div><div className="p-5"><p className="text-xs font-bold uppercase tracking-widest text-brand-600">Sinal em validação</p><h2 className="text-2xl font-extrabold">{sign.word}</h2><p className="text-sm text-surface-500 mt-1">{sign.hint}</p><div className="flex items-center justify-between mt-5 pt-4 border-t border-surface-100"><span className="text-sm font-semibold">Velocidade</span><div className="flex bg-surface-100 p-1 rounded-xl">{[.5, .75, 1].map((value) => <button key={value} onClick={() => setSpeed(value)} className={`px-3 py-1.5 rounded-lg text-xs font-bold ${speed === value ? 'bg-white text-brand-700 shadow-sm' : 'text-surface-500'}`}>{value}×</button>)}</div></div></div></article>
            <div className="grid grid-cols-3 gap-3">{[['ri-hand', 'Configuração'], ['ri-focus-3-line', 'Localização'], ['ri-route-line', 'Movimento']].map(([icon, label], i) => <div key={label} className="bg-white border border-surface-200 rounded-2xl p-3"><span className="w-8 h-8 bg-brand-50 text-brand-600 rounded-lg grid place-items-center"><i className={icon} /></span><strong className="block text-xs mt-2">0{i + 1} · {label}</strong></div>)}</div>
          </div>

          <div className="space-y-5"><article className="bg-white rounded-3xl border border-surface-200 shadow-card overflow-hidden"><div className="p-5 flex items-center justify-between border-b border-surface-100"><div><p className="text-xs font-bold uppercase tracking-widest text-brand-600">Sua vez</p><h2 className="text-xl font-extrabold">Repita o sinal</h2></div><span className={`badge ${handsDetected ? 'bg-brand-50 text-brand-700' : 'bg-surface-100 text-surface-500'}`}><span className={`w-1.5 h-1.5 rounded-full ${handsDetected ? 'bg-brand-500 animate-pulse' : 'bg-surface-400'}`} />{handsDetected ? `${handsDetected} mão${handsDetected > 1 ? 's' : ''} detectada${handsDetected > 1 ? 's' : ''}` : cameraOn ? 'Buscando mãos' : 'Câmera desligada'}</span></div>
            <div className="relative aspect-video bg-surface-900 overflow-hidden"><video ref={videoRef} autoPlay playsInline muted className={`absolute inset-0 w-full h-full object-cover -scale-x-100 ${cameraOn ? 'opacity-100' : 'opacity-0'}`} aria-label="Câmera ao vivo" /><canvas ref={canvasRef} className={`absolute inset-0 w-full h-full object-cover -scale-x-100 pointer-events-none ${cameraOn ? 'opacity-100' : 'opacity-0'}`} aria-hidden="true" />
              {!cameraOn && <Overlay icon="ri-camera-line" title="Prepare seu espaço" text="Posicione o rosto e as mãos no enquadramento, com boa iluminação."><button onClick={startCamera} className="btn-primary mt-5"><i className="ri-camera-line" /> Ativar câmera</button></Overlay>}
              {cameraOn && stage === 'ready' && <div className="absolute inset-x-0 bottom-0 p-5 pt-16 bg-gradient-to-t from-black/80 to-transparent text-center"><button onClick={startAttempt} disabled={visionStatus !== 'ready' || handsDetected === 0} className="btn bg-white text-surface-900 px-6 py-3 shadow-xl disabled:opacity-60"><i className={visionStatus === 'loading' ? 'ri-loader-4-line animate-spin' : 'ri-record-circle-line text-rose-500'} /> {visionStatus === 'loading' ? 'Carregando visão…' : handsDetected ? 'Começar tentativa' : 'Mostre sua mão'}</button></div>}
              {stage === 'countdown' && <Overlay title={`${count || 'Já!'}`} text="Prepare as mãos" large />}
              {stage === 'recording' && <span className="absolute top-4 left-4 badge bg-rose-500 text-white"><span className="w-2 h-2 rounded-full bg-white animate-pulse" /> Gravando · faça o sinal</span>}
              {stage === 'analyzing' && <Overlay icon="ri-loader-4-line animate-spin" title="Analisando sua tentativa" text="Comparando os três critérios essenciais…" />}
            </div>{visionStatus === 'error' && <p className="m-4 p-3 bg-amber-50 text-amber-800 rounded-xl text-sm"><i className="ri-wifi-off-line mr-2" />O rastreador não carregou. Verifique sua conexão e recarregue a página.</p>}{cameraError && <p className="m-4 p-3 bg-rose-50 text-rose-700 rounded-xl text-sm"><i className="ri-error-warning-line mr-2" />{cameraError}</p>}<div className="p-4 grid grid-cols-3 gap-2 border-t border-surface-100">{[['ri-sun-line', 'Rosto iluminado'], ['ri-hand', 'Mão inteira visível'], ['ri-contrast-2-line', 'Fundo neutro']].map(([icon, label]) => <span key={label} className="text-2xs text-surface-500 text-center"><i className={`${icon} text-brand-500 mr-1`} />{label}</span>)}</div></article>

            {stage === 'result' && <article className="bg-white rounded-3xl border border-surface-200 shadow-card p-5 animate-fade-up" aria-live="polite"><div className="flex justify-between gap-5 mb-5"><div><span className="badge-brand mb-2"><i className="ri-sparkling-2-line" /> Feedback visual</span><h2 className="text-xl font-extrabold">Análise concluída</h2><p className="text-sm text-surface-500 mt-1">Métricas calculadas a partir dos pontos reais da sua mão.</p></div><div className="w-20 h-20 shrink-0 rounded-full grid place-items-center" style={{ background: `conic-gradient(#10b981 ${score * 3.6}deg,#e2e8f0 0)` }}><span className="w-16 h-16 bg-white rounded-full grid place-items-center font-extrabold text-xl">{score}%</span></div></div><div className="space-y-3">{result.map((item) => <div key={item.label} className="p-4 bg-surface-50 border border-surface-100 rounded-2xl"><div className="flex items-center gap-3"><span className="w-9 h-9 bg-brand-100 text-brand-700 rounded-xl grid place-items-center"><i className={item.icon} /></span><div className="flex-1"><div className="flex justify-between"><strong className="text-sm">{item.label}</strong><strong className={item.score >= 85 ? 'text-brand-600' : 'text-amber-600'}>{item.score}%</strong></div><div className="h-1.5 bg-surface-200 rounded-full mt-2"><div className={`h-full rounded-full ${item.score >= 85 ? 'bg-brand-500' : 'bg-amber-400'}`} style={{ width: `${item.score}%` }} /></div></div></div><p className="text-xs text-surface-600 mt-3 pl-12">{item.note}</p></div>)}</div><button onClick={retry} className="btn-primary w-full mt-5"><i className="ri-restart-line" /> Tentar novamente</button><p className="text-2xs text-surface-400 mt-4"><i className="ri-information-line mr-1" />Avaliação heurística baseada nos 21 landmarks do MediaPipe. Ela mede geometria e trajetória, mas ainda não substitui um modelo treinado com sinais de Libras.</p></article>}
          </div>
        </div>
        {attempts.length > 0 && <section className="mt-8 bg-white border border-surface-200 rounded-3xl p-5"><div className="flex justify-between items-end mb-4"><div><p className="text-xs font-bold uppercase tracking-widest text-brand-600">Progresso</p><h2 className="text-xl font-extrabold">Tentativas recentes</h2></div><span className="text-xs text-surface-400">Salvo neste dispositivo</span></div><div className="flex items-end gap-2 h-24">{[...attempts].reverse().map((item, i) => <div key={item.id} className="flex-1 h-full flex flex-col justify-end items-center"><small className="text-2xs font-bold">{item.score}%</small><div className="w-full max-w-16 bg-gradient-to-t from-brand-600 to-brand-400 rounded-t-lg" style={{ height: `${item.score}%` }} /><small className="text-2xs text-surface-400">{i + 1}</small></div>)}</div></section>}
        <section className="mt-8 bg-surface-900 text-white rounded-3xl p-5 md:p-7 overflow-hidden relative"><div className="absolute -right-16 -top-20 w-64 h-64 bg-brand-500/20 rounded-full blur-3xl" /><div className="relative flex flex-col lg:flex-row lg:items-center justify-between gap-6"><div><p className="text-xs font-bold uppercase tracking-widest text-brand-300">Dataset do protótipo</p><h2 className="text-2xl font-extrabold mt-1">Poucos sinais, dados diversos</h2><p className="text-sm text-surface-300 mt-2 max-w-xl">O treinador libera somente sinais validados. Os demais avançam conforme recebem gravações frontais, laterais e variações suficientes.</p></div><div className="flex flex-wrap items-center gap-3"><DatasetCount value={ACTIVE_VISION_SIGNS.length} label="em validação" color="text-brand-300" /><DatasetCount value={VISION_SIGNS.filter((item) => item.status === 'collecting').length} label="em coleta" color="text-amber-300" /><DatasetCount value={VISION_SIGNS.filter((item) => item.status === 'planned').length} label="planejados" color="text-surface-200" /><Link to="/vision/coleta" className="btn bg-white text-surface-900 px-5 py-3"><i className="ri-video-add-line" /> Coletar amostras</Link></div></div></section>
      </section>
    </main><Footer /></div>
  </>;
}

function Stat({ value, label, accent = false }: { value: string; label: string; accent?: boolean }) { return <div className="rounded-2xl border border-white/10 bg-white/5 px-5 py-3"><p className={`text-2xl font-extrabold ${accent ? 'text-brand-300' : ''}`}>{value}</p><p className="text-xs text-surface-400">{label}</p></div>; }
function DatasetCount({ value, label, color }: { value: number; label: string; color: string }) { return <div className="px-4 py-2 border border-white/10 bg-white/5 rounded-xl"><strong className={`text-xl ${color}`}>{value}</strong><span className="block text-2xs text-surface-400">{label}</span></div>; }
function Overlay({ icon, title, text, children, large = false }: { icon?: string; title: string; text: string; children?: React.ReactNode; large?: boolean }) { return <div className="absolute inset-0 bg-surface-900/80 backdrop-blur-sm flex flex-col items-center justify-center text-center text-white p-8">{icon && <span className="w-14 h-14 rounded-2xl bg-white/10 grid place-items-center mb-4"><i className={`${icon} text-2xl`} /></span>}<h3 className={`${large ? 'text-7xl' : 'text-base'} font-extrabold`}>{title}</h3><p className="text-sm text-surface-400 mt-1">{text}</p>{children}</div>; }
