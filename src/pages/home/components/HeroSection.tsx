import { Link } from 'react-router-dom';

const stats = [
  { value: '50+', label: 'Sinais', icon: 'ri-hand-heart-line' },
  { value: '26', label: 'Letras 3D', icon: 'ri-keyboard-line' },
  { value: '4', label: 'Modos IA', icon: 'ri-sparkling-line' },
  { value: '100%', label: 'Gratuito', icon: 'ri-heart-line' },
];

export default function HeroSection() {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background Image */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage:
            'url("https://readdy.ai/api/search-image?query=artistic%20abstract%20illustration%20of%20diverse%20hands%20forming%20Brazilian%20sign%20language%20Libras%20symbols%2C%20emerald%20green%20and%20warm%20amber%20color%20palette%2C%20geometric%20patterns%20and%20fluid%20shapes%2C%20modern%20inclusive%20design%2C%20vibrant%20dynamic%20composition%20with%20flowing%20lines%2C%20digital%20art%20style%20with%20depth%20and%20texture%2C%20celebrating%20accessibility%20and%20communication&width=1440&height=900&seq=hero001&orientation=landscape")',
        }}
      />
      {/* Overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/50 to-black/70" />
      {/* Animated background circles */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="relative z-10 w-full max-w-5xl mx-auto px-4 md:px-8 text-center pt-24 pb-16">
        {/* Badge */}
        <div className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-500/20 border border-emerald-400/30 rounded-full text-emerald-300 text-sm font-medium mb-8 backdrop-blur-sm">
          <i className="ri-sparkling-line"></i>
          <span>Plataforma Educacional com Inteligência Artificial</span>
        </div>

        {/* Title */}
        <h1 className="text-4xl md:text-6xl lg:text-7xl font-extrabold text-white leading-tight mb-6"
          style={{ fontFamily: 'Plus Jakarta Sans, sans-serif' }}>
          Aprenda{' '}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-teal-300">
            Libras
          </span>
          <br />
          com{' '}
          <em className="not-italic text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-amber-300">
            Inteligência Artificial
          </em>
        </h1>

        {/* Description */}
        <p className="text-lg md:text-xl text-white/75 max-w-2xl mx-auto leading-relaxed mb-10">
          Dicionário de sinais, datilologia 3D, assistente IA Gemini e demonstração de reconhecimento visual — tudo em uma plataforma gratuita para você aprender Libras no seu próprio ritmo.
        </p>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16">
          <Link
            to="/dictionary"
            className="flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-emerald-500 to-teal-500 text-white rounded-2xl text-base font-bold shadow-2xl shadow-emerald-500/30 hover:shadow-emerald-500/50 hover:scale-105 transition-all duration-300 cursor-pointer whitespace-nowrap"
          >
            <i className="ri-book-open-line text-lg"></i>
            Explorar Dicionário
          </Link>
          <Link
            to="/assistant"
            className="flex items-center gap-2 px-8 py-4 bg-white/10 border border-white/30 backdrop-blur-sm text-white rounded-2xl text-base font-semibold hover:bg-white/20 hover:scale-105 transition-all duration-300 cursor-pointer whitespace-nowrap"
          >
            <i className="ri-sparkling-line text-amber-300 text-lg"></i>
            Falar com a IA
          </Link>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-2xl mx-auto">
          {stats.map((stat) => (
            <div
              key={stat.label}
              className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl px-4 py-4 text-center hover:bg-white/15 transition-colors duration-200"
            >
              <div className="w-10 h-10 flex items-center justify-center mx-auto mb-2 bg-emerald-500/20 rounded-xl">
                <i className={`${stat.icon} text-emerald-300 text-lg`}></i>
              </div>
              <div className="text-2xl font-extrabold text-white mb-0.5"
                style={{ fontFamily: 'Plus Jakarta Sans, sans-serif' }}>
                {stat.value}
              </div>
              <div className="text-xs text-white/60 font-medium">{stat.label}</div>
            </div>
          ))}
        </div>

        {/* Scroll hint */}
        <div className="mt-12 flex flex-col items-center gap-2 text-white/40">
          <span className="text-xs">Role para explorar</span>
          <i className="ri-arrow-down-line text-xl animate-bounce"></i>
        </div>
      </div>
    </section>
  );
}
