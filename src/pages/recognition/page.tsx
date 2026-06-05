import { useState, useRef, useCallback, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '@/components/feature/Navbar';
import Footer from '@/components/feature/Footer';
import { SEOHead } from '@/components/feature/SEOHead';
import { pageSEO, SITE_URL, generateWebPageSchema, generateCourseSchema } from '@/lib/seo';
import { signs, Sign } from '@/mocks/signs/index';
import InterpreterGuide from '@/components/feature/InterpreterGuide';

interface AnalysisResult {
  sign: Sign;
  confidence: number;
  matchedFeatures: string[];
}

const SIMULATED_RESULTS: AnalysisResult[] = [
  { sign: signs[0], confidence: 94, matchedFeatures: ['Mão aberta (B)', 'Posição próxima à cabeça', 'Movimento lateral'] },
  { sign: signs[1], confidence: 87, matchedFeatures: ['Mão plana (B)', 'Contato com queixo', 'Movimento para frente'] },
  { sign: signs[5], confidence: 72, matchedFeatures: ['Mão aberta', 'Posição lateral'] },
];

type Mode = 'upload' | 'camera';

export default function RecognitionPage() {
  const [mode, setMode] = useState<Mode>('upload');
  const [image, setImage] = useState<string | null>(null);
  const [analyzing, setAnalyzing] = useState(false);
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [dragOver, setDragOver] = useState(false);
  const [cameraActive, setCameraActive] = useState(false);
  const [cameraError, setCameraError] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const streamRef = useRef<MediaStream | null>(null);

  useEffect(() => {
    return () => { streamRef.current?.getTracks().forEach((t) => t.stop()); };
  }, []);

  const stopCamera = useCallback(() => {
    streamRef.current?.getTracks().forEach((t) => t.stop());
    streamRef.current = null;
    if (videoRef.current) videoRef.current.srcObject = null;
    setCameraActive(false);
  }, []);

  const startCamera = useCallback(async () => {
    setCameraError(null);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'user', width: { ideal: 640 }, height: { ideal: 480 } },
      });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        await videoRef.current.play();
      }
      streamRef.current = stream;
      setCameraActive(true);
    } catch (err) {
      const e = err as DOMException;
      if (e.name === 'NotAllowedError' || e.name === 'PermissionDeniedError') {
        setCameraError('Permissão negada. Permita o acesso à câmera nas configurações do navegador.');
      } else if (e.name === 'NotFoundError') {
        setCameraError('Nenhuma câmera encontrada neste dispositivo.');
      } else {
        setCameraError('Não foi possível acessar a câmera. Verifique se outro aplicativo está usando-a.');
      }
    }
  }, []);

  const runAnalysis = useCallback(() => {
    setAnalyzing(true);
    setResult(null);
    setTimeout(() => {
      setResult(SIMULATED_RESULTS[Math.floor(Math.random() * SIMULATED_RESULTS.length)]);
      setAnalyzing(false);
    }, 2500);
  }, []);

  const captureFromCamera = useCallback(() => {
    if (!videoRef.current || !canvasRef.current) return;
    const video = videoRef.current;
    const canvas = canvasRef.current;
    canvas.width = video.videoWidth || 640;
    canvas.height = video.videoHeight || 480;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
    setImage(canvas.toDataURL('image/jpeg', 0.85));
    stopCamera();
    runAnalysis();
  }, [stopCamera, runAnalysis]);

  const handleFile = useCallback((file: File) => {
    setError(null);
    setResult(null);
    if (!file.type.startsWith('image/')) {
      setError('Por favor, envie apenas arquivos de imagem (JPG, PNG, WEBP).');
      return;
    }
    if (file.size > 10 * 1024 * 1024) {
      setError('A imagem deve ter menos de 10MB.');
      return;
    }
    const reader = new FileReader();
    reader.onload = (e) => {
      setImage(e.target?.result as string);
      runAnalysis();
    };
    reader.readAsDataURL(file);
  }, [runAnalysis]);

  const onDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files[0];
    if (file) handleFile(file);
  }, [handleFile]);

  const onDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(true);
  }, []);

  const onDragLeave = useCallback(() => setDragOver(false), []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) handleFile(file);
  };

  const handleReset = useCallback(() => {
    setImage(null);
    setResult(null);
    setError(null);
    setAnalyzing(false);
    setCameraError(null);
    stopCamera();
    if (fileInputRef.current) fileInputRef.current.value = '';
  }, [stopCamera]);

  const switchMode = (newMode: Mode) => {
    handleReset();
    setMode(newMode);
  };

  const seo = pageSEO.recognition;
  const canonical = `${SITE_URL}/recognition`;

  const schema = [
    generateWebPageSchema(seo.title, seo.description, canonical),
    generateCourseSchema('Demonstração de Reconhecimento Visual de Sinais', 'Simulação didática de reconhecimento de sinais em Libras por imagem.', canonical),
  ];

  return (
    <>
      <SEOHead
        title={seo.title}
        description={seo.description}
        keywords={seo.keywords}
        canonical={canonical}
        ogTitle={seo.title}
        ogDescription={seo.description}
        ogType="website"
        ogUrl={canonical}
        schema={schema}
      />
      <div className="min-h-screen bg-white">
        <Navbar />

        {/* Hero */}
        <section className="pt-28 pb-12 px-4 md:px-8 bg-gradient-to-b from-slate-50 to-white" data-guide="header">
          <div className="max-w-3xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-fuchsia-50 border border-fuchsia-200 rounded-full text-fuchsia-700 text-sm font-semibold mb-5">
              <i className="ri-camera-line"></i>
              Demonstração Didática
            </div>
            <h1 className="text-4xl md:text-5xl font-extrabold text-slate-900 leading-tight mb-4">
              Demonstração de <em className="not-italic text-transparent bg-clip-text bg-gradient-to-r from-fuchsia-500 to-pink-500">Reconhecimento</em>
            </h1>
            <p className="text-slate-500 text-lg max-w-xl mx-auto">
              Capture um sinal pela câmera ou faça upload de uma imagem para ver como uma IA identificaria a configuração de mão. <strong>Simulação didática</strong> — resultados gerados para demonstração.
            </p>
          </div>
        </section>

        {/* Main content */}
        <section className="py-8 px-4 md:px-8 pb-20" data-guide="practice">
          <div className="max-w-3xl mx-auto">

            {/* Mode selector */}
            {!image && (
              <div className="flex bg-slate-100 p-1 rounded-2xl mb-6">
                <button
                  onClick={() => switchMode('upload')}
                  className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-semibold transition-all cursor-pointer ${
                    mode === 'upload' ? 'bg-white text-slate-800 shadow-sm' : 'text-slate-500 hover:text-slate-700'
                  }`}
                >
                  <i className="ri-upload-cloud-2-line"></i>
                  Upload de Imagem
                </button>
                <button
                  onClick={() => switchMode('camera')}
                  className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-semibold transition-all cursor-pointer ${
                    mode === 'camera' ? 'bg-white text-slate-800 shadow-sm' : 'text-slate-500 hover:text-slate-700'
                  }`}
                >
                  <i className="ri-camera-line"></i>
                  Câmera ao Vivo
                </button>
              </div>
            )}

            {/* Camera UI */}
            {mode === 'camera' && !image && (
              <div className="space-y-4">
                <div className="relative rounded-2xl overflow-hidden bg-slate-900 aspect-video flex items-center justify-center min-h-[280px]">
                  <video
                    ref={videoRef}
                    autoPlay
                    playsInline
                    muted
                    className={`absolute inset-0 w-full h-full object-cover ${cameraActive ? 'opacity-100' : 'opacity-0'}`}
                    aria-label="Feed da câmera ao vivo"
                  />

                  {!cameraActive && !cameraError && (
                    <div className="relative z-10 text-center p-8">
                      <div className="w-20 h-20 flex items-center justify-center mx-auto mb-4 bg-white/10 backdrop-blur-sm rounded-2xl">
                        <i className="ri-camera-line text-white text-3xl"></i>
                      </div>
                      <p className="text-slate-300 text-sm font-medium mb-5">
                        Ative a câmera para capturar um sinal ao vivo
                      </p>
                      <button
                        onClick={startCamera}
                        className="px-6 py-3 bg-fuchsia-600 text-white rounded-xl text-sm font-bold hover:bg-fuchsia-500 transition-colors cursor-pointer whitespace-nowrap"
                      >
                        <i className="ri-camera-line mr-2"></i>
                        Ativar Câmera
                      </button>
                    </div>
                  )}

                  {cameraError && (
                    <div className="relative z-10 text-center p-8">
                      <i className="ri-camera-off-line text-rose-400 text-3xl mb-3 block"></i>
                      <p className="text-rose-300 text-sm mb-4">{cameraError}</p>
                      <button
                        onClick={startCamera}
                        className="px-4 py-2 bg-white/10 text-white rounded-xl text-sm font-semibold hover:bg-white/20 transition-colors cursor-pointer"
                      >
                        Tentar novamente
                      </button>
                    </div>
                  )}

                  {cameraActive && (
                    <div className="absolute bottom-4 left-0 right-0 flex items-center justify-center gap-3 z-10">
                      <button
                        onClick={stopCamera}
                        className="w-11 h-11 flex items-center justify-center bg-white/20 backdrop-blur-sm text-white rounded-full hover:bg-white/30 transition-colors cursor-pointer"
                        aria-label="Parar câmera"
                      >
                        <i className="ri-stop-line text-lg"></i>
                      </button>
                      <button
                        onClick={captureFromCamera}
                        className="flex items-center gap-2 px-7 py-3 bg-white text-slate-900 rounded-full text-sm font-bold shadow-xl hover:bg-fuchsia-50 transition-colors cursor-pointer whitespace-nowrap"
                      >
                        <i className="ri-camera-line"></i>
                        Capturar Sinal
                      </button>
                    </div>
                  )}
                </div>

                <canvas ref={canvasRef} className="hidden" aria-hidden="true" />

                <div className="grid grid-cols-3 gap-3">
                  {[
                    { icon: 'ri-sun-line', color: 'text-amber-500', label: 'Boa iluminação' },
                    { icon: 'ri-hand-heart-line', color: 'text-emerald-500', label: 'Mão visível' },
                    { icon: 'ri-contrast-2-line', color: 'text-teal-500', label: 'Fundo neutro' },
                  ].map((tip) => (
                    <div key={tip.label} className="flex items-center gap-2 p-3 bg-white border border-slate-200 rounded-xl">
                      <i className={`${tip.icon} ${tip.color}`}></i>
                      <span className="text-xs text-slate-600">{tip.label}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Upload area */}
            {mode === 'upload' && !image && (
              <div
                className={`border-2 border-dashed rounded-3xl p-10 text-center transition-all cursor-pointer ${
                  dragOver ? 'border-fuchsia-400 bg-fuchsia-50' : 'border-slate-300 bg-white hover:border-slate-400 hover:bg-slate-50'
                }`}
                onClick={() => fileInputRef.current?.click()}
                onDrop={onDrop}
                onDragOver={onDragOver}
                onDragLeave={onDragLeave}
              >
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleInputChange}
                />
                <div className="w-16 h-16 flex items-center justify-center mx-auto mb-4 bg-fuchsia-50 rounded-2xl">
                  <i className="ri-upload-cloud-2-line text-fuchsia-500 text-3xl"></i>
                </div>
                <p className="text-base font-semibold text-slate-700 mb-1">
                  Arraste uma foto ou clique para selecionar
                </p>
                <p className="text-sm text-slate-400 mb-4">JPG, PNG ou WEBP · Máx. 10MB</p>
                <div className="flex flex-wrap justify-center gap-2">
                  <span className="px-3 py-1 bg-slate-100 text-slate-500 text-xs rounded-full">Mão visível</span>
                  <span className="px-3 py-1 bg-slate-100 text-slate-500 text-xs rounded-full">Fundo neutro</span>
                  <span className="px-3 py-1 bg-slate-100 text-slate-500 text-xs rounded-full">Boa iluminação</span>
                </div>
              </div>
            )}

            {/* Error */}
            {error && (
              <div className="mt-4 p-4 bg-rose-50 border border-rose-200 rounded-2xl flex items-start gap-3">
                <i className="ri-error-warning-line text-rose-500 text-lg mt-0.5"></i>
                <p className="text-sm text-rose-700">{error}</p>
              </div>
            )}

            {/* Image preview + analysis */}
            {image && (
              <div className="space-y-6">
                <div className="relative rounded-2xl overflow-hidden border border-slate-200 bg-slate-50">
                  <img src={image} alt="Sinal capturado" className="w-full max-h-[400px] object-contain" />
                  <button
                    onClick={handleReset}
                    className="absolute top-4 right-4 w-9 h-9 flex items-center justify-center bg-white/90 backdrop-blur-sm rounded-xl border border-slate-200 text-slate-600 hover:text-rose-500 cursor-pointer transition-colors"
                    aria-label="Remover imagem e recomeçar"
                  >
                    <i className="ri-close-line text-lg"></i>
                  </button>
                </div>

                {!analyzing && !result && (
                  <button
                    onClick={runAnalysis}
                    className="w-full py-4 rounded-2xl bg-gradient-to-r from-fuchsia-500 to-pink-500 text-white font-bold text-base hover:opacity-90 transition-all cursor-pointer whitespace-nowrap flex items-center justify-center gap-2"
                  >
                    <i className="ri-sparkling-2-line text-lg"></i>
                    Demonstrar Reconhecimento
                  </button>
                )}

                {analyzing && (
                  <div className="text-center py-8">
                    <div className="relative w-16 h-16 mx-auto mb-4">
                      <div className="absolute inset-0 border-4 border-fuchsia-100 rounded-full"></div>
                      <div className="absolute inset-0 border-4 border-fuchsia-500 rounded-full border-t-transparent animate-spin"></div>
                    </div>
                    <p className="text-base font-semibold text-slate-700 mb-1">Processando imagem...</p>
                    <p className="text-sm text-slate-400">Simulação de análise dos parâmetros fonológicos</p>
                    <div className="flex justify-center gap-2 mt-4">
                      {[0, 150, 300].map((delay) => (
                        <span key={delay} className="w-2 h-2 bg-fuchsia-300 rounded-full animate-bounce" style={{ animationDelay: `${delay}ms` }}></span>
                      ))}
                    </div>
                  </div>
                )}

                {result && (
                  <div className="bg-white border-2 border-fuchsia-200 rounded-2xl overflow-hidden">
                    <div className="p-6">
                      <div className="flex items-center gap-3 mb-4">
                        <div className="w-12 h-12 flex items-center justify-center bg-fuchsia-50 rounded-xl">
                          <i className="ri-sparkling-2-line text-fuchsia-500 text-xl"></i>
                        </div>
                        <div>
                          <p className="text-sm font-semibold text-fuchsia-600">Demonstração de Reconhecimento</p>
                          <p className="text-sm text-slate-500">Simulação didática de identificação visual</p>
                        </div>
                      </div>

                      <div className="flex items-center gap-4 p-4 bg-slate-50 rounded-xl mb-4">
                        <span className="text-4xl">{result.sign.emoji}</span>
                        <div className="flex-1">
                          <p className="text-xl font-bold text-slate-900">{result.sign.word}</p>
                          <p className="text-sm text-slate-500">{result.sign.category} · {result.sign.difficulty}</p>
                        </div>
                        <div className="text-center">
                          <p className="text-2xl font-extrabold text-fuchsia-600">{result.confidence}%</p>
                          <p className="text-xs text-slate-400">confiança simulada</p>
                        </div>
                      </div>

                      <div className="mb-4">
                        <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Características simuladas</p>
                        <div className="flex flex-wrap gap-2">
                          {result.matchedFeatures.map((f) => (
                            <span key={f} className="px-3 py-1.5 bg-fuchsia-50 text-fuchsia-700 text-xs font-medium rounded-lg border border-fuchsia-100">
                              <i className="ri-check-line mr-1"></i>{f}
                            </span>
                          ))}
                        </div>
                      </div>

                      <div className="flex items-start gap-3 p-4 bg-amber-50 border border-amber-100 rounded-xl mb-4">
                        <i className="ri-information-line text-amber-600 text-lg mt-0.5 flex-shrink-0"></i>
                        <p className="text-sm text-amber-700 leading-relaxed">
                          <strong>Simulação didática.</strong> Em uma implementação real, um modelo de ML treinado em Libras analisaria os parâmetros fonológicos (CM, PA e M).
                        </p>
                      </div>

                      <div className="flex gap-3">
                        <button
                          onClick={handleReset}
                          className="flex-1 py-3 rounded-xl bg-fuchsia-50 text-fuchsia-700 font-semibold text-sm hover:bg-fuchsia-100 transition-colors cursor-pointer whitespace-nowrap"
                        >
                          <i className="ri-refresh-line mr-1.5"></i>
                          Nova captura
                        </button>
                        <Link
                          to="/dictionary"
                          className="flex-1 py-3 rounded-xl bg-gradient-to-r from-fuchsia-500 to-pink-500 text-white font-semibold text-sm text-center hover:opacity-90 transition-all cursor-pointer whitespace-nowrap"
                        >
                          <i className="ri-book-open-line mr-1.5"></i>
                          Ver no Dicionário
                        </Link>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Disclaimer */}
            <div className="mt-8 p-4 bg-slate-50 rounded-2xl border border-slate-200">
              <div className="flex items-start gap-3">
                <i className="ri-information-line text-slate-400 text-lg mt-0.5 flex-shrink-0"></i>
                <p className="text-xs text-slate-500 leading-relaxed">
                  <strong>Nota:</strong> Esta página é uma <strong>demonstração didática</strong>. Os resultados são gerados automaticamente (simulação) e não representam análise real de IA treinada em Libras. Para aprendizado, consulte sempre um professor ou intérprete profissional de Libras.
                </p>
              </div>
            </div>
          </div>
        </section>

        <Footer />
      </div>
      <InterpreterGuide />
    </>
  );
}
