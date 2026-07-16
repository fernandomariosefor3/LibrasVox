import { Link } from 'react-router-dom';

const highlights = [
  { icon: 'ri-award-line', color: 'text-brand-500', bg: 'bg-brand-50', text: 'Conteúdo criado com base nos padrões oficiais de Libras' },
  { icon: 'ri-fire-line', color: 'text-accent-500', bg: 'bg-accent-50', text: 'Sequências e metas diárias para manter o ritmo de estudo' },
  { icon: 'ri-checkbox-circle-line', color: 'text-brand-500', bg: 'bg-brand-50', text: 'Acompanhe cada sinal, curso e exercício concluído' },
  { icon: 'ri-bar-chart-line', color: 'text-accent-500', bg: 'bg-accent-50', text: 'Painel de progresso com estatísticas do seu aprendizado' },
];

export default function ProgressSection() {
  return (
    <section className="py-24 px-4 md:px-8 bg-surface-50">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          {/* Image */}
          <div className="relative order-2 lg:order-1">
            <div className="relative w-full aspect-square max-w-lg mx-auto lg:mx-0">
              <div className="absolute inset-0 bg-gradient-to-br from-brand-100 to-brand-200 rounded-[40px] rotate-3"></div>
              <div
                className="relative w-full h-full rounded-[36px] border-4 border-white bg-gradient-to-br from-brand-500 to-brand-700 flex items-center justify-center overflow-hidden"
                style={{ boxShadow: '0 20px 60px rgba(16, 185, 129, 0.15)' }}
                aria-label="Progresso de aprendizado no LibrasVox"
              >
                <div className="absolute top-0 right-0 w-40 h-40 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2 pointer-events-none" />
                <div className="absolute bottom-0 left-0 w-32 h-32 bg-white/10 rounded-full translate-y-1/2 -translate-x-1/2 pointer-events-none" />
                <i className="ri-bar-chart-2-line text-white/90 text-[8rem]" aria-hidden="true" />
              </div>
              {/* Floating card */}
              <div className="absolute -bottom-4 -right-4 bg-surface-0 rounded-2xl px-4 py-3 flex items-center gap-3 border border-surface-100"
                style={{ boxShadow: '0 8px 24px rgba(0,0,0,0.08)' }}>
                <div className="w-10 h-10 flex items-center justify-center bg-brand-50 rounded-xl">
                  <i className="ri-check-double-line text-brand-500 text-lg"></i>
                </div>
                <div>
                  <div className="text-xs text-surface-400 font-medium">Progresso</div>
                  <div className="text-sm font-bold text-surface-800">+12 sinais hoje!</div>
                </div>
              </div>
              <div className="absolute -top-4 -left-4 bg-surface-0 rounded-2xl px-4 py-3 flex items-center gap-3 border border-surface-100"
                style={{ boxShadow: '0 8px 24px rgba(0,0,0,0.08)' }}>
                <div className="w-10 h-10 flex items-center justify-center bg-accent-50 rounded-xl">
                  <i className="ri-fire-line text-accent-500 text-lg"></i>
                </div>
                <div>
                  <div className="text-xs text-surface-400 font-medium">Sequência</div>
                  <div className="text-sm font-bold text-surface-800">7 dias seguidos 🔥</div>
                </div>
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="order-1 lg:order-2">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-accent-50 border border-accent-100 rounded-full text-accent-600 text-sm font-semibold mb-6">
              <i className="ri-bar-chart-line"></i>
              Seu progresso
            </div>
            <h2 className="text-3xl md:text-5xl font-extrabold text-surface-900 leading-tight mb-6">
              Veja sua evolução,{' '}
              <em className="not-italic text-transparent bg-clip-text bg-gradient-to-r from-brand-500 to-brand-600">
                sinal por sinal
              </em>
            </h2>
            <p className="text-surface-500 text-lg leading-relaxed mb-8">
              O LibrasVox foi desenvolvido com foco em acessibilidade e inclusão. Acompanhe cada sinal
              aprendido, cada curso concluído e cada sequência de estudo em um painel de progresso
              simples e motivador.
            </p>

            {/* Highlights */}
            <ul className="space-y-3 mb-8">
              {highlights.map((h) => (
                <li key={h.text} className="flex items-start gap-3">
                  <div className={`w-9 h-9 flex items-center justify-center flex-shrink-0 rounded-xl ${h.bg}`}>
                    <i className={`${h.icon} text-base ${h.color}`}></i>
                  </div>
                  <span className="text-surface-600 text-sm leading-relaxed pt-1.5">{h.text}</span>
                </li>
              ))}
            </ul>

            <Link
              to="/progress"
              className="inline-flex items-center justify-between gap-4 px-6 py-4 bg-surface-0 border border-surface-200 rounded-2xl text-surface-700 font-semibold text-sm hover:border-brand-300 hover:text-brand-600 transition-all duration-200 cursor-pointer whitespace-nowrap w-full md:w-auto"
            >
              <span>Ver meu progresso de aprendizado</span>
              <i className="ri-arrow-right-up-line text-lg"></i>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
