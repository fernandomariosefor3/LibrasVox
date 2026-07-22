import { Link } from 'react-router-dom';
import Navbar from '@/components/feature/Navbar';
import Footer from '@/components/feature/Footer';
import RealMediaCapturePackage from './RealMediaCapturePackage';

/**
 * Página exclusiva do Pacote de Mídia Real.
 *
 * Monta somente o RealMediaCapturePackage — nenhum MediaPipe, nenhum
 * useHandLandmarker, nenhum reconhecimento heurístico e nenhum fluxo
 * antigo de 30 sinais. Isso evita dois fluxos disputando a mesma câmera
 * na mesma página, problema observado no Estúdio de Coleta em celulares.
 */
export default function RealMediaPage() {
  return (
    <div className="min-h-screen bg-surface-50">
      <Navbar />
      <main className="pt-16">
        <section className="bg-surface-900 text-white">
          <div className="max-w-7xl mx-auto px-4 md:px-8 py-10">
            <Link
              to="/vision/coleta"
              className="inline-flex items-center gap-2 text-sm text-brand-300 hover:text-brand-200 mb-4"
            >
              <i className="ri-arrow-left-line" /> Voltar ao Estúdio de Coleta
            </Link>
            <p className="text-xs font-bold uppercase tracking-[.18em] text-brand-300">
              Mídia Real MVP · Página exclusiva
            </p>
            <h1 className="text-3xl md:text-5xl font-extrabold mt-2">Captura de mídia real</h1>
            <p className="text-surface-300 mt-3 max-w-2xl">
              Todo o processamento acontece neste navegador. Esta página abre em uma rota
              exclusiva, sem nenhum outro recurso de câmera montado ao mesmo tempo.
            </p>
          </div>
        </section>

        <RealMediaCapturePackage />
      </main>
      <Footer />
    </div>
  );
}
