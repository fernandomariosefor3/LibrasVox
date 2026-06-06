import { Link, useLocation } from "react-router-dom";
import { SEOHead } from '@/components/feature/SEOHead';

export default function NotFound() {
  const location = useLocation();

  return (
    <>
      <SEOHead
        title="Página não encontrada - LVP"
        description="A página que você está procurando não foi encontrada. Explore nosso dicionário de Libras, alfabeto 3D e assistente IA."
        noindex={true}
      />
      <div className="relative flex flex-col items-center justify-center h-screen text-center px-4">
        <h1 className="absolute bottom-0 text-9xl md:text-[12rem] font-black text-slate-50 select-none pointer-events-none z-0">
          404
        </h1>
        <div className="relative z-10">
          <h1 className="text-xl md:text-2xl font-semibold mt-6">Esta página não foi encontrada</h1>
          <p className="mt-2 text-base text-slate-400">{location.pathname}</p>
          <p className="mt-4 text-lg md:text-xl text-slate-500">Volte para a página inicial e explore nosso conteúdo</p>
          <Link
            to="/"
            className="mt-6 inline-flex items-center gap-2 px-6 py-3 bg-emerald-500 hover:bg-emerald-600 text-white rounded-xl font-semibold transition-colors cursor-pointer"
          >
            <i className="ri-home-line"></i>
            Voltar para Home
          </Link>
        </div>
      </div>
    </>
  );
}