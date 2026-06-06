import { Link } from 'react-router-dom';

const highlights = [
  { icon: 'ri-award-line', color: 'text-emerald-500', bg: 'bg-emerald-50', text: 'Conteúdo criado com base nos padrões oficiais de Libras' },
  { icon: 'ri-brain-line', color: 'text-amber-500', bg: 'bg-amber-50', text: 'IA Gemini integrada para aprendizado personalizado' },
  { icon: 'ri-camera-line', color: 'text-rose-500', bg: 'bg-rose-50', text: 'Demonstração de reconhecimento visual de sinais por upload de imagem' },
  { icon: 'ri-bar-chart-line', color: 'text-teal-500', bg: 'bg-teal-50', text: 'Acompanhe seu progresso a cada sinal aprendido' },
];

export default function AboutSection() {
  return (
    <section className="py-24 px-4 md:px-8 bg-slate-50">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          {/* Image */}
          <div className="relative order-2 lg:order-1">
            <div className="relative w-full aspect-square max-w-lg mx-auto lg:mx-0">
              <div className="absolute inset-0 bg-gradient-to-br from-emerald-100 to-teal-100 rounded-[40px] rotate-3"></div>
              <img
                src="https://readdy.ai/api/search-image?query=young%20diverse%20Brazilian%20woman%20with%20warm%20smile%20learning%20sign%20language%20on%20modern%20laptop%20computer%20at%20cozy%20study%20desk%2C%20soft%20natural%20window%20lighting%2C%20emerald%20green%20plant%20nearby%2C%20inclusive%20education%20technology%2C%20warm%20inviting%20atmosphere%2C%20photorealistic%20lifestyle%20photography&width=600&height=600&seq=about001&orientation=squarish"
                alt="Pessoa aprendendo Libras no LVP"
                className="relative w-full h-full object-cover object-top rounded-[36px] border-4 border-white"
                style={{ boxShadow: '0 20px 60px rgba(16, 185, 129, 0.15)' }}
              />
              {/* Floating card */}
              <div className="absolute -bottom-4 -right-4 bg-white rounded-2xl px-4 py-3 flex items-center gap-3 border border-slate-100"
                style={{ boxShadow: '0 8px 24px rgba(0,0,0,0.08)' }}>
                <div className="w-10 h-10 flex items-center justify-center bg-emerald-50 rounded-xl">
                  <i className="ri-check-double-line text-emerald-500 text-lg"></i>
                </div>
                <div>
                  <div className="text-xs text-slate-400 font-medium">Progresso</div>
                  <div className="text-sm font-bold text-slate-800">+12 sinais hoje!</div>
                </div>
              </div>
              <div className="absolute -top-4 -left-4 bg-white rounded-2xl px-4 py-3 flex items-center gap-3 border border-slate-100"
                style={{ boxShadow: '0 8px 24px rgba(0,0,0,0.08)' }}>
                <div className="w-10 h-10 flex items-center justify-center bg-amber-50 rounded-xl">
                  <i className="ri-fire-line text-amber-500 text-lg"></i>
                </div>
                <div>
                  <div className="text-xs text-slate-400 font-medium">Sequência</div>
                  <div className="text-sm font-bold text-slate-800">7 dias seguidos 🔥</div>
                </div>
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="order-1 lg:order-2">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-amber-50 border border-amber-100 rounded-full text-amber-600 text-sm font-semibold mb-6">
              <i className="ri-leaf-line"></i>
              Tecnologia Inclusiva
            </div>
            <h2
              className="text-3xl md:text-5xl font-extrabold text-slate-900 leading-tight mb-6"
             
            >
              Aprenda no seu{' '}
              <em className="not-italic text-transparent bg-clip-text bg-gradient-to-r from-emerald-500 to-teal-500">
                ritmo
              </em>
              <br />
              com recursos avançados
            </h2>
            <p className="text-slate-500 text-lg leading-relaxed mb-8">
              O LVP foi desenvolvido com foco em acessibilidade e inclusão. Nossa plataforma combina um dicionário visual completo com inteligência artificial para oferecer a experiência mais completa e gratuita de aprendizado de Libras disponível no Brasil.
            </p>

            {/* Highlights */}
            <ul className="space-y-3 mb-8">
              {highlights.map((h) => (
                <li key={h.text} className="flex items-start gap-3">
                  <div className={`w-9 h-9 flex items-center justify-center flex-shrink-0 rounded-xl ${h.bg}`}>
                    <i className={`${h.icon} text-base ${h.color}`}></i>
                  </div>
                  <span className="text-slate-600 text-sm leading-relaxed pt-1.5">{h.text}</span>
                </li>
              ))}
            </ul>

            <Link
              to="/progress"
              className="inline-flex items-center justify-between gap-4 px-6 py-4 bg-white border border-slate-200 rounded-2xl text-slate-700 font-semibold text-sm hover:border-emerald-300 hover:text-emerald-600 transition-all duration-200 cursor-pointer whitespace-nowrap w-full md:w-auto"
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
