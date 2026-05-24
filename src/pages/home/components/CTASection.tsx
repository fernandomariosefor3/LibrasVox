import { Link } from 'react-router-dom';
import Logo from '@/components/base/Logo';

export default function CTASection() {
  return (
    <section className="py-24 px-4 md:px-8 bg-white">
      <div className="max-w-5xl mx-auto">
        <div className="relative rounded-[48px] overflow-hidden bg-gradient-to-br from-emerald-500 via-teal-500 to-emerald-600 px-8 md:px-16 py-16 md:py-20 text-center"
          style={{ boxShadow: '0 30px 80px rgba(16, 185, 129, 0.30)' }}>
          <div className="absolute top-0 right-0 w-72 h-72 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2 pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-56 h-56 bg-amber-400/10 rounded-full translate-y-1/2 -translate-x-1/2 pointer-events-none" />
          <div className="relative z-10">
            <div className="flex items-center justify-center gap-3 mx-auto mb-6">
              <div className="w-14 h-14 flex items-center justify-center text-white">
                <i className="ri-hand-heart-line text-3xl"></i>
              </div>
              <Logo size={56} className="brightness-[10]" />
            </div>
            <h2 className="text-3xl md:text-5xl font-extrabold text-white leading-tight mb-4" style={{ fontFamily: 'Plus Jakarta Sans, sans-serif' }}>
              Comece sua jornada<br />em <em className="not-italic text-amber-300">Libras</em> hoje mesmo
            </h2>
            <p className="text-white/80 text-lg max-w-lg mx-auto mb-10">
              Junte-se a milhares de pessoas que já estão aprendendo Libras de forma gratuita, interativa e com o poder da inteligência artificial.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/dictionary" className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-white text-emerald-600 rounded-2xl text-base font-bold hover:scale-105 transition-all duration-200 cursor-pointer whitespace-nowrap"
                style={{ boxShadow: '0 8px 30px rgba(255,255,255,0.25)' }}>
                <i className="ri-book-open-line"></i>
                Explorar Dicionário
              </Link>
              <Link to="/assistant" className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-white/15 border border-white/30 text-white rounded-2xl text-base font-semibold hover:bg-white/25 hover:scale-105 transition-all duration-200 cursor-pointer whitespace-nowrap backdrop-blur-sm">
                <i className="ri-sparkling-line text-amber-300"></i>
                Assistente IA Gemini
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}