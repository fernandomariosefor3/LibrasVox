import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const freePerks = [
  { icon: 'ri-book-open-line', text: 'Dicionário completo de sinais' },
  { icon: 'ri-keyboard-line', text: 'Alfabeto 3D A–Z' },
  { icon: 'ri-sparkling-line', text: 'IA Assistente sem limites' },
  { icon: 'ri-bar-chart-line', text: 'Progresso salvo localmente' },
];

const counters = [
  { value: 146, suffix: '+', label: 'Sinais no dicionário' },
  { value: 20, suffix: '', label: 'Categorias de sinais' },
  { value: 100, suffix: '%', label: 'Gratuito para todos' },
];

function useCountUp(target: number, duration = 1400, active = false) {
  const [count, setCount] = useState(0);
  useEffect(() => {
    if (!active) return;
    let start = 0;
    const step = target / (duration / 16);
    const timer = setInterval(() => {
      start += step;
      if (start >= target) { setCount(target); clearInterval(timer); }
      else setCount(Math.floor(start));
    }, 16);
    return () => clearInterval(timer);
  }, [target, duration, active]);
  return count;
}

function Counter({ value, prefix = '', suffix = '', label }: { value: number; prefix?: string; suffix?: string; label: string }) {
  const [active, setActive] = useState(false);
  const count = useCountUp(value, 1200, active);
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setActive(true); },
      { threshold: 0.5 }
    );
    const el = document.getElementById(`counter-${label.replace(/\s/g, '')}`);
    if (el) observer.observe(el);
    return () => observer.disconnect();
  }, [label]);

  return (
    <div id={`counter-${label.replace(/\s/g, '')}`} className="text-center">
      <div className="text-3xl md:text-4xl font-extrabold text-white mb-1" style={{ fontFamily: 'Plus Jakarta Sans, sans-serif' }}>
        {prefix}{count}{suffix}
      </div>
      <div className="text-xs text-white/60 font-medium">{label}</div>
    </div>
  );
}

export default function PricingBanner() {
  return (
    <section className="py-20 px-4 md:px-8 bg-gradient-to-b from-slate-50 to-white">
      <div className="max-w-5xl mx-auto">

        {/* Top label */}
        <div className="flex justify-center mb-8">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-emerald-50 border border-emerald-100 rounded-full text-emerald-600 text-sm font-semibold">
            <i className="ri-gift-line"></i>
            Plataforma 100% Gratuita
          </div>
        </div>

        {/* Main card */}
        <div className="relative rounded-[36px] overflow-hidden bg-gradient-to-br from-emerald-700 via-teal-600 to-emerald-600">
          {/* Decorative blobs */}
          <div className="absolute -top-16 -right-16 w-72 h-72 bg-amber-400/10 rounded-full blur-2xl pointer-events-none" />
          <div className="absolute -bottom-12 -left-12 w-56 h-56 bg-white/5 rounded-full blur-2xl pointer-events-none" />
          <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent" />

          <div className="relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-0">
            {/* Left — Free pitch */}
            <div className="p-8 md:p-12">
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/15 border border-white/20 rounded-full text-white/90 text-xs font-semibold mb-6 backdrop-blur-sm">
                <i className="ri-shield-check-line text-emerald-300"></i>
                Zero custo · Sem cartão de crédito
              </div>

              <h2 className="text-2xl md:text-4xl font-extrabold text-white leading-tight mb-4"
                style={{ fontFamily: 'Plus Jakarta Sans, sans-serif' }}>
                Libras para<br />
                <span className="text-amber-300">todos, sem barreiras.</span>
              </h2>
              <p className="text-white/70 text-sm md:text-base mb-8 leading-relaxed">
                A plataforma foi criada para democratizar o aprendizado de Libras. Todos os recursos são gratuitos — basta fazer o cadastro para começar.
              </p>

              {/* Perks */}
              <ul className="space-y-3 mb-8">
                {freePerks.map((p) => (
                  <li key={p.text} className="flex items-center gap-3">
                    <div className="w-8 h-8 flex items-center justify-center bg-white/15 rounded-xl flex-shrink-0">
                      <i className={`${p.icon} text-white text-sm`}></i>
                    </div>
                    <span className="text-white/85 text-sm">{p.text}</span>
                    <div className="w-4 h-4 flex items-center justify-center ml-auto flex-shrink-0">
                      <i className="ri-check-line text-emerald-300 font-bold"></i>
                    </div>
                  </li>
                ))}
              </ul>

              <div className="flex flex-col sm:flex-row gap-3">
                <Link
                  to="/planos"
                  className="inline-flex items-center justify-center gap-2 px-7 py-3.5 bg-white text-emerald-700 rounded-2xl text-sm font-bold hover:bg-emerald-50 hover:scale-105 transition-all duration-200 cursor-pointer whitespace-nowrap"
                >
                  <i className="ri-user-add-line"></i>
                  Cadastrar gratuitamente
                </Link>
                <Link
                  to="/dictionary"
                  className="inline-flex items-center justify-center gap-2 px-7 py-3.5 bg-white/10 border border-white/25 text-white rounded-2xl text-sm font-semibold hover:bg-white/20 transition-all duration-200 cursor-pointer whitespace-nowrap backdrop-blur-sm"
                >
                  Explorar sem cadastrar
                  <i className="ri-arrow-right-line"></i>
                </Link>
              </div>
            </div>

            {/* Right — Stats */}
            <div className="flex flex-col justify-center bg-white/8 backdrop-blur-sm border-l border-white/10 p-8 md:p-12">
              <p className="text-xs font-semibold text-white/50 uppercase tracking-widest mb-6">
                O que você encontra aqui
              </p>

              <ul className="space-y-4 mb-8">
                {[
                  { icon: 'ri-book-open-line', text: 'Dicionário com 146+ sinais reais de Libras', highlight: true },
                  { icon: 'ri-sparkling-line', text: 'IA Assistente Gemini com 4 modos completos', highlight: false },
                  { icon: 'ri-camera-ai-line', text: 'Demonstração de reconhecimento visual de sinais', highlight: false },
                  { icon: 'ri-medal-line', text: 'Certificado de conclusão ao final dos cursos', highlight: false },
                  { icon: 'ri-file-chart-line', text: 'Relatórios detalhados de progresso', highlight: false },
                  { icon: 'ri-hand-heart-line', text: 'Intérprete virtual que guia sua navegação', highlight: false },
                ].map((item) => (
                  <li key={item.text} className="flex items-center gap-3">
                    <div className={`w-8 h-8 flex items-center justify-center rounded-xl flex-shrink-0 ${item.highlight ? 'bg-amber-400/20' : 'bg-white/10'}`}>
                      <i className={`${item.icon} text-sm ${item.highlight ? 'text-amber-300' : 'text-white/70'}`}></i>
                    </div>
                    <span className={`text-sm ${item.highlight ? 'text-white font-medium' : 'text-white/70'}`}>{item.text}</span>
                  </li>
                ))}
              </ul>

              <Link
                to="/planos"
                className="inline-flex items-center justify-center gap-2 w-full py-3.5 bg-gradient-to-r from-amber-400 to-amber-500 text-amber-900 rounded-2xl text-sm font-bold hover:scale-105 hover:from-amber-300 hover:to-amber-400 transition-all duration-200 cursor-pointer whitespace-nowrap"
              >
                <i className="ri-user-add-line"></i>
                Criar conta gratuita
              </Link>
            </div>
          </div>

          {/* Bottom counters strip */}
          <div className="relative z-10 border-t border-white/10 bg-black/10 backdrop-blur-sm px-8 py-6">
            <div className="grid grid-cols-3 gap-4 max-w-lg mx-auto">
              {counters.map((c) => (
                <Counter key={c.label} {...c} />
              ))}
            </div>
          </div>
        </div>

        {/* Footer note */}
        <p className="text-center text-xs text-slate-400 mt-6">
          Criado por <strong className="text-slate-600">Fernando Mário da Silva Martins</strong> · Contato: librasvox@gmail.com
        </p>
      </div>
    </section>
  );
}