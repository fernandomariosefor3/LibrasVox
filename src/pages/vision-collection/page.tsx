import { useEffect, useMemo, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '@/components/feature/Navbar';
import Footer from '@/components/feature/Footer';
import { VISION_SIGNS, COLLECTION_DIMENSIONS } from '@/data/visionSigns';

type Angle = 'frontal' | 'lateral';
type Speed = 'lenta' | 'normal' | 'rapida';
type Lighting = 'uniforme' | 'baixa' | 'contraluz';
type DominantHand = 'direita' | 'esquerda' | 'ambidestra';
type SampleKind = 'correto' | 'erro_comum';
type SkinTone = 'nao-informado' | '1-2' | '3-4' | '5-6';

interface CaptureMetadata {
  schemaVersion: '1.0';
  captureId: string;
  createdAt: string;
  participantCode: string;
  signId: string;
  signLabel: string;
  angle: Angle;
  speed: Speed;
  lighting: Lighting;
  dominantHand: DominantHand;
  skinTone: SkinTone;
  region: string;
  regionalVariant: string;
  sampleKind: SampleKind;
  commonError: string;
  mimeType: string;
  durationSeconds: number;
}

const fieldClass = 'input text-sm';

export default function VisionCollectionPage() {
  const [participantCode, setParticipantCode] = useState('');
  const [signId, setSignId] = useState(VISION_SIGNS[0].id);
  const [angle, setAngle] = useState<Angle>('frontal');
  const [speed, setSpeed] = useState<Speed>('normal');
  const [lighting, setLighting] = useState<Lighting>('uniforme');
  const [dominantHand, setDominantHand] = useState<DominantHand>('direita');
  const [skinTone, setSkinTone] = useState<SkinTone>('nao-informado');
  const [region, setRegion] = useState('');
  const [regionalVariant, setRegionalVariant] = useState('');
  const [sampleKind, setSampleKind] = useState<SampleKind>('correto');
  const [commonError, setCommonError] = useState('');
  const [consent, setConsent] = useState(false);
  const [cameraOn, setCameraOn] = useState(false);
  const [recording, setRecording] = useState(false);
  const [elapsed, setElapsed] = useState(0);
  const [clip, setClip] = useState<{ blob: Blob; url: string; duration: number } | null>(null);
  const [error, setError] = useState('');
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const recorderRef = useRef<MediaRecorder | null>(null);
  const clipUrlRef = useRef<string | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const startedAtRef = useRef(0);
  const selectedSign = VISION_SIGNS.find((sign) => sign.id === signId) ?? VISION_SIGNS[0];

  const stopCamera = () => {
    streamRef.current?.getTracks().forEach((track) => track.stop());
    streamRef.current = null;
    if (videoRef.current) videoRef.current.srcObject = null;
    setCameraOn(false);
  };

  useEffect(() => () => {
    streamRef.current?.getTracks().forEach((track) => track.stop());
    if (clipUrlRef.current) URL.revokeObjectURL(clipUrlRef.current);
  }, []);

  useEffect(() => {
    if (!recording) return;
    const timer = window.setInterval(() => setElapsed((Date.now() - startedAtRef.current) / 1000), 100);
    return () => window.clearInterval(timer);
  }, [recording]);

  const canRecord = useMemo(() => Boolean(consent && participantCode.trim() && region.trim() && cameraOn && !recording), [consent, participantCode, region, cameraOn, recording]);

  const startCamera = async () => {
    setError('');
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'user', width: { ideal: 1280 }, height: { ideal: 720 } }, audio: false });
      streamRef.current = stream;
      if (videoRef.current) { videoRef.current.srcObject = stream; await videoRef.current.play(); }
      setCameraOn(true);
    } catch {
      setError('Não foi possível acessar a câmera. Verifique a permissão do navegador.');
    }
  };

  const startRecording = () => {
    const stream = streamRef.current;
    if (!stream || !canRecord) return;
    if (clip) { URL.revokeObjectURL(clip.url); clipUrlRef.current = null; setClip(null); }
    const preferred = ['video/webm;codecs=vp9', 'video/webm;codecs=vp8', 'video/webm'].find((type) => MediaRecorder.isTypeSupported(type));
    const recorder = new MediaRecorder(stream, preferred ? { mimeType: preferred } : undefined);
    chunksRef.current = [];
    recorder.ondataavailable = (event) => { if (event.data.size) chunksRef.current.push(event.data); };
    recorder.onstop = () => {
      const duration = Math.max(0.1, (Date.now() - startedAtRef.current) / 1000);
      const blob = new Blob(chunksRef.current, { type: recorder.mimeType || 'video/webm' });
      const url = URL.createObjectURL(blob);
      clipUrlRef.current = url;
      setClip({ blob, url, duration });
      setRecording(false);
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

  const metadata = (): CaptureMetadata | null => {
    if (!clip) return null;
    const captureId = `${selectedSign.id}-${participantCode.trim()}-${Date.now()}`.toLowerCase().replace(/[^a-z0-9-]/g, '-');
    return {
      schemaVersion: '1.0', captureId, createdAt: new Date().toISOString(), participantCode: participantCode.trim(),
      signId: selectedSign.id, signLabel: selectedSign.word, angle, speed, lighting, dominantHand, skinTone,
      region: region.trim(), regionalVariant: regionalVariant.trim(), sampleKind,
      commonError: sampleKind === 'erro_comum' ? commonError.trim() : '', mimeType: clip.blob.type, durationSeconds: Number(clip.duration.toFixed(2)),
    };
  };

  const downloadDatasetItem = () => {
    const data = metadata();
    if (!data || !clip) return;
    const extension = clip.blob.type.includes('mp4') ? 'mp4' : 'webm';
    const videoLink = document.createElement('a');
    videoLink.href = clip.url;
    videoLink.download = `${data.captureId}.${extension}`;
    videoLink.click();
    const jsonBlob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const jsonUrl = URL.createObjectURL(jsonBlob);
    const jsonLink = document.createElement('a');
    jsonLink.href = jsonUrl;
    jsonLink.download = `${data.captureId}.json`;
    jsonLink.click();
    URL.revokeObjectURL(jsonUrl);
  };

  return <div className="min-h-screen bg-surface-50"><Navbar /><main className="pt-16">
    <section className="bg-surface-900 text-white"><div className="max-w-7xl mx-auto px-4 md:px-8 py-10"><Link to="/recognition" className="inline-flex items-center gap-2 text-sm text-brand-300 hover:text-brand-200 mb-4"><i className="ri-arrow-left-line" /> Voltar ao Vision</Link><div className="flex flex-col lg:flex-row lg:items-end justify-between gap-5"><div><p className="text-xs font-bold uppercase tracking-[.18em] text-brand-300">Dataset v1 · Coleta local</p><h1 className="text-3xl md:text-5xl font-extrabold mt-2">Estúdio de Coleta</h1><p className="text-surface-300 mt-3 max-w-2xl">Grave amostras consistentes para os 30 sinais do protótipo. Cada vídeo recebe um arquivo JSON com os metadados necessários.</p></div><div className="flex gap-3"><div className="border border-white/10 bg-white/5 rounded-2xl px-5 py-3"><strong className="text-2xl">30</strong><span className="block text-xs text-surface-400">sinais definidos</span></div><div className="border border-white/10 bg-white/5 rounded-2xl px-5 py-3"><strong className="text-2xl text-brand-300">8</strong><span className="block text-xs text-surface-400">dimensões de variação</span></div></div></div></div></section>

    <section className="max-w-7xl mx-auto px-4 md:px-8 py-8 grid lg:grid-cols-[.82fr_1.18fr] gap-6 items-start">
      <div className="space-y-5">
        <article className="bg-white border border-surface-200 rounded-3xl p-5 shadow-card"><div className="flex items-center justify-between mb-5"><div><p className="text-xs font-bold uppercase tracking-widest text-brand-600">1 · Identificação</p><h2 className="text-xl font-extrabold">Dados da amostra</h2></div><span className="badge-neutral">Sem nome pessoal</span></div><div className="grid sm:grid-cols-2 gap-4">
          <Field label="Código do participante"><input className={fieldClass} value={participantCode} onChange={(e) => setParticipantCode(e.target.value)} placeholder="Ex.: P023" /></Field>
          <Field label="Sinal"><select className={fieldClass} value={signId} onChange={(e) => setSignId(e.target.value)}>{VISION_SIGNS.map((sign) => <option key={sign.id} value={sign.id}>{sign.emoji} {sign.word} · {sign.status === 'active' ? 'ativo' : sign.status === 'collecting' ? 'em coleta' : 'planejado'}</option>)}</select></Field>
          <Field label="Região/UF"><input className={fieldClass} value={region} onChange={(e) => setRegion(e.target.value)} placeholder="Ex.: Recife/PE" /></Field>
          <Field label="Variação regional"><input className={fieldClass} value={regionalVariant} onChange={(e) => setRegionalVariant(e.target.value)} placeholder="Opcional: descreva a variante" /></Field>
          <Field label="Ângulo"><select className={fieldClass} value={angle} onChange={(e) => setAngle(e.target.value as Angle)}><option value="frontal">Frontal</option><option value="lateral">Lateral</option></select></Field>
          <Field label="Velocidade"><select className={fieldClass} value={speed} onChange={(e) => setSpeed(e.target.value as Speed)}><option value="lenta">Lenta</option><option value="normal">Normal</option><option value="rapida">Rápida</option></select></Field>
          <Field label="Iluminação"><select className={fieldClass} value={lighting} onChange={(e) => setLighting(e.target.value as Lighting)}><option value="uniforme">Uniforme</option><option value="baixa">Baixa</option><option value="contraluz">Contraluz</option></select></Field>
          <Field label="Mão dominante"><select className={fieldClass} value={dominantHand} onChange={(e) => setDominantHand(e.target.value as DominantHand)}><option value="direita">Direita</option><option value="esquerda">Esquerda</option><option value="ambidestra">Ambidestra</option></select></Field>
          <Field label="Tom de pele (opcional)"><select className={fieldClass} value={skinTone} onChange={(e) => setSkinTone(e.target.value as SkinTone)}><option value="nao-informado">Prefiro não informar</option><option value="1-2">Faixa 1–2 · clara</option><option value="3-4">Faixa 3–4 · média</option><option value="5-6">Faixa 5–6 · escura</option></select></Field>
          <Field label="Tipo de exemplo"><select className={fieldClass} value={sampleKind} onChange={(e) => setSampleKind(e.target.value as SampleKind)}><option value="correto">Execução correta</option><option value="erro_comum">Erro comum de iniciante</option></select></Field>
          {sampleKind === 'erro_comum' && <Field label="Erro reproduzido"><input className={fieldClass} value={commonError} onChange={(e) => setCommonError(e.target.value)} placeholder="Ex.: mão muito baixa" /></Field>}
        </div></article>

        <article className="bg-white border border-surface-200 rounded-3xl p-5"><p className="text-xs font-bold uppercase tracking-widest text-brand-600 mb-3">Matriz de diversidade</p><div className="grid sm:grid-cols-2 gap-2">{COLLECTION_DIMENSIONS.map((item) => <div key={item} className="flex items-center gap-2 text-xs text-surface-600 p-2 bg-surface-50 rounded-lg"><i className="ri-checkbox-circle-line text-brand-500" />{item}</div>)}</div></article>
      </div>

      <div className="space-y-5"><article className="bg-white border border-surface-200 rounded-3xl shadow-card overflow-hidden"><div className="p-5 flex justify-between items-center border-b border-surface-100"><div><p className="text-xs font-bold uppercase tracking-widest text-brand-600">2 · Gravação</p><h2 className="text-xl font-extrabold">{selectedSign.emoji} {selectedSign.word}</h2></div>{recording && <span className="badge bg-rose-100 text-rose-700"><span className="w-2 h-2 bg-rose-500 rounded-full animate-pulse" /> REC {elapsed.toFixed(1)}s</span>}</div>
        <div className="relative aspect-video bg-surface-900"><video ref={videoRef} autoPlay playsInline muted className={`absolute inset-0 w-full h-full object-cover -scale-x-100 ${cameraOn ? 'opacity-100' : 'opacity-0'}`} />{!cameraOn && <div className="absolute inset-0 grid place-items-center text-center p-8"><div><span className="w-16 h-16 bg-white/10 text-white rounded-2xl grid place-items-center mx-auto mb-4"><i className="ri-camera-line text-2xl" /></span><p className="text-surface-300 text-sm">Enquadre mãos, braços, rosto e tronco.</p><button onClick={startCamera} className="btn-primary mt-4"><i className="ri-camera-line" /> Ativar câmera</button></div></div>}<div className="absolute inset-x-0 bottom-0 p-5 pt-16 bg-gradient-to-t from-black/80 to-transparent flex justify-center gap-3">{cameraOn && !recording && <button onClick={startRecording} disabled={!canRecord} className="btn bg-white text-surface-900 px-6 py-3 disabled:opacity-50"><i className="ri-record-circle-line text-rose-500" /> Gravar amostra</button>}{recording && <button onClick={stopRecording} className="btn bg-rose-500 text-white px-6 py-3"><i className="ri-stop-fill" /> Encerrar gravação</button>}{cameraOn && !recording && <button onClick={stopCamera} className="btn bg-white/10 text-white px-4 py-3"><i className="ri-camera-off-line" /></button>}</div></div>
        {error && <p className="m-4 p-3 text-sm text-rose-700 bg-rose-50 rounded-xl"><i className="ri-error-warning-line mr-2" />{error}</p>}<label className="m-5 flex items-start gap-3 p-4 rounded-2xl bg-amber-50 border border-amber-200 cursor-pointer"><input type="checkbox" checked={consent} onChange={(e) => setConsent(e.target.checked)} className="mt-1 accent-emerald-600" /><span className="text-xs text-amber-900"><strong className="block text-sm mb-1">Consentimento registrado</strong>Confirmo que a pessoa autorizou esta gravação para pesquisa e desenvolvimento do LibrasVox. Nenhum nome pessoal deve ser informado neste formulário.</span></label></article>

        {clip && <article className="bg-white border border-brand-200 rounded-3xl p-5 animate-fade-up"><div className="flex justify-between items-center mb-4"><div><p className="text-xs font-bold uppercase tracking-widest text-brand-600">3 · Revisão</p><h2 className="text-xl font-extrabold">Amostra pronta</h2></div><span className="badge-brand">{clip.duration.toFixed(1)} segundos</span></div><video src={clip.url} controls className="w-full aspect-video bg-black rounded-2xl" /><div className="flex flex-col sm:flex-row gap-3 mt-4"><button onClick={downloadDatasetItem} className="btn-primary flex-1"><i className="ri-download-2-line" /> Baixar vídeo + metadados</button><button onClick={() => { URL.revokeObjectURL(clip.url); clipUrlRef.current = null; setClip(null); }} className="btn-secondary"><i className="ri-delete-bin-line" /> Descartar</button></div><p className="text-2xs text-surface-400 mt-3"><i className="ri-lock-line mr-1" />A amostra não é enviada para nenhum servidor. Os dois arquivos são baixados apenas neste dispositivo.</p></article>}
      </div>
    </section>
  </main><Footer /></div>;
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return <label className="block"><span className="block text-xs font-semibold text-surface-600 mb-1.5">{label}</span>{children}</label>;
}
