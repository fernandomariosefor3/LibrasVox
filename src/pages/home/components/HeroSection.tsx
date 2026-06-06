import { Link } from 'react-router-dom';

const stats = [
  { value: '50+', label: 'Sinais', icon: 'ri-hand-heart-line' },
  { value: '26',  label: 'Letras A–Z', icon: 'ri-keyboard-line' },
  { value: '4',   label: 'Modos IA', icon: 'ri-sparkling-line' },
  { value: '100%',label: 'Gratuito', icon: 'ri-heart-line' },
];

export default function HeroSection() {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-surface-900">

      {/* ── Mesh gradient background ── */}
      <div className="absolute inset-0 bg-gradient-to-br from-brand-950 via-surface-900 to-surface-950" />

      {/* ── Animated orbs ── */}
      <div className="absolute top-1/4 -left-24 w-[500px] h-[500px] bg-brand-500/20 rounded-full blur-[120px] animate-float pointer-events-none" />
      <div className="absolute bottom-1/4 -right-24 w-[400px] h-[400px] bg-brand-400/15 rounded-full blur-[100px] animate-float-slow pointer-events-none" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-accent-500/8 rounded-full blur-[140px] pointer-events-none" />

      {/* ── Grid texture ── */}
      <div
        className="absolute inset-0 opacity-[0.04] pointer-events-none"
        style={{
          backgroundImage: `linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px),
                            linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)`,
          backgroundSize: '60px 60px',
        }}
      />

      {/* ── Floating hand icons (decorative) ── */}
      <div className="absolute top-24 left-[8%] opacity-10 animate-float pointer-events-none hidden lg:block">
        <i className="ri-hand-heart-line text-6xl text-brand-300" />
      </div>
      <div className="absolute bottom-32 right-[10%] opacity-10 animate-float-slow pointer-events-none hidden lg:block" style={{ animationDelay: '1.5s' }}>
        <i className="ri-hand-coin-line text-5xl text-accent-300" />
      </div>
      <div className="absolute top-1/3 right-[6%] opacity-8 animate-float pointer-events-none hidden xl:block" style={{ animationDelay: '0.8s' }}>
        <i className="ri-sign-language-line text-4xl text-brand-200" />
      </div>

      {/* ── Content ── */}
      <div className="relative z-10 w-full max-w-4xl mx-auto px-4 md:px-8 text-center pt-28 pb-16">

        {/* Badge */}
        <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-brand-500/15 border border-brand-500/25 rounded-full text-brand-300 text-xs font-semibold mb-8 backdrop-blur-sm animate-fade-down">
          <i className="ri-sparkling-line text-accent-400" />
          <span>Plataforma Educacional com Inteligência Artificial</span>
        </div>

        {/* Headline */}
        <h1 className="text-5xl md:text-6xl lg:text-7xl font-extrabold text-white leading-[1.08] tracking-tight mb-6 animate-fade-up stagger-1">
          Aprenda{' '}
          <span className="text-gradient-brand">Libras</span>
          <br />
          com{' '}
          <span className="text-gradient-accent">
            Inteligência{' '}
            <br className="sm:hidden" />
            Artificial
          </span>
        </h1>

        {/* Description */}
        <p className="text-base md:text-lg text-white/60 max-w-2xl mx-auto leading-relaxed mb-10 animate-fade-up stagger-2">
          Dicionário de sinais, datilologia interativa, assistente IA Gemini e muito mais
          — tudo gratuito para você aprender Libras no seu próprio ritmo.
        </p>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 mb-16 animate-fade-up stagger-3">
          <Link
            to="/dictionary"
            className="flex items-center gap-2 px-7 py-3.5 bg-gradient-to-r from-brand-500 to-brand-600 text-white rounded-2xl text-base font-bold shadow-xl shadow-brand-500/30 hover:shadow-2xl hover:shadow-brand-500/40 hover:-translate-y-0.5 transition-all duration-200 whitespace-nowrap press-scale"
          >
            <i className="ri-book-open-line text-lg" />
            Explorar Dicionário
          </Link>
          <Link
            to="/assistant"
            className="flex items-center gap-2 px-7 py-3.5 bg-white/8 border border-white/20 backdrop-blur-sm text-white rounded-2xl text-base font-semibold hover:bg-white/15 hover:border-white/30 hover:-translate-y-0.5 transition-all duration-200 whitespace-nowrap press-scale"
          >
            <i className="ri-sparkling-line text-accent-400 text-lg" />
            Falar com a IA
          </Link>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 max-w-xl mx-auto animate-fade-up stagger-4">
          {stats.map((stat, i) => (
            <div
              key={stat.label}
              className="card-glass py-4 px-3 text-center hover:bg-white/15 transition-colors duration-200"
              style={{ animationDelay: `${(i + 4) * 50}ms` }}
            >
              <div className="w-9 h-9 flex items-center justify-center mx-auto mb-2 bg-brand-500/20 rounded-xl">
                <i className={`${stat.icon} text-brand-300 text-base`} />
              </div>
              <div className="text-xl font-extrabold text-white mb-0.5">{stat.value}</div>
              <div className="text-2xs text-white/50 font-medium uppercase tracking-wide">{stat.label}</div>
            </div>
          ))}
        </div>

        {/* Scroll hint */}
        <div className="mt-12 flex flex-col items-center gap-1.5 text-white/30 animate-fade-up stagger-5">
          <span className="text-xs font-medium">Role para explorar</span>
          <i className="ri-arrow-down-line text-lg animate-bounce-gentle" />
        </div>
      </div>
    </section>
  );
}
