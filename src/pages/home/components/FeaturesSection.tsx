import { Link } from 'react-router-dom';

const features = [
  {
    path: '/dictionary',
    icon: 'ri-book-open-line',
    gradient: 'from-emerald-400 to-teal-500',
    bg: 'bg-emerald-50',
    title: 'Dicionário de Sinais',
    description:
      'Mais de 50 sinais categorizados com descrição detalhada, emojis e passo a passo para cada movimento. Busque por palavra, categoria ou emoção.',
    bullets: ['50+ sinais com passo a passo', 'Categorias: família, cores, emoções…', 'Marque seus favoritos'],
  },
  {
    path: '/frases',
    icon: 'ri-chat-quote-line',
    gradient: 'from-violet-400 to-fuchsia-500',
    bg: 'bg-violet-50',
    title: 'Frases por Contexto',
    description:
      'Aprenda Libras através de cenários do dia a dia. Sinais sequenciais, glossa em Libras e explicações gramaticais para situações reais como restaurante, hospital e trabalho.',
    bullets: ['Cenários práticos do cotidiano', 'Glossa + gramática explicada', 'Navegação passo a passo'],
  },
  {
    path: '/alphabet',
    icon: 'ri-keyboard-line',
    gradient: 'from-amber-400 to-orange-400',
    bg: 'bg-amber-50',
    title: 'Datilologia Interativa',
    description:
      'Visualize o alfabeto manual (A-Z) em um renderizador Canvas interativo. Pratique cada letra com instrução visual clara e responsiva.',
    bullets: ['Alfabeto A a Z em 3D', 'Animações dos dedos', 'Prática letra por letra'],
  },
  {
    path: '/flashcards',
    icon: 'ri-stack-line',
    gradient: 'from-sky-400 to-cyan-500',
    bg: 'bg-sky-50',
    title: 'Flashcards SRS',
    description:
      'Aprenda sinais com repetição espaçada inteligente. O algoritmo adapta a frequência de revisão ao seu desempenho, maximizando a retenção de longo prazo.',
    bullets: ['Repetição espaçada (SRS)', 'Deck personalizado', 'Rastreamento de streak'],
  },
  {
    path: '/assistant',
    icon: 'ri-sparkling-line',
    gradient: 'from-rose-400 to-red-400',
    bg: 'bg-rose-50',
    title: 'Assistente IA Gemini',
    description:
      'Converse com o Gemini AI em 4 modos especializados: Tutor de Libras, Tradutor PT↔Libras, Prática guiada e Cultura Surda.',
    bullets: ['4 modos: Tutor, Tradutor, Prática, Cultura', 'Tirar dúvidas sobre gramática', 'Histórico de conversas'],
  },
  {
    path: '/recognition',
    icon: 'ri-camera-line',
    gradient: 'from-fuchsia-400 to-pink-500',
    bg: 'bg-fuchsia-50',
    title: 'Demonstração de Reconhecimento',
    description:
      'Faça upload de uma imagem para testar uma simulação de reconhecimento visual de sinais. Resultados gerados automaticamente para fins didáticos de aprendizado.',
    bullets: ['Upload de imagem para teste', 'Demonstração didática', 'Explore o potencial da tecnologia'],
  },
];

export default function FeaturesSection() {
  return (
    <section className="py-24 px-4 md:px-8 bg-white">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-emerald-50 border border-emerald-100 rounded-full text-emerald-600 text-sm font-semibold mb-4">
            <i className="ri-magic-line"></i>
            Funcionalidades
          </div>
          <h2
            className="text-3xl md:text-5xl font-extrabold text-slate-900 mb-4"
           
          >
            Tudo que você precisa para
            <br />
            <em className="not-italic text-transparent bg-clip-text bg-gradient-to-r from-emerald-500 to-teal-500">
              aprender Libras
            </em>
          </h2>
          <p className="text-slate-500 text-lg max-w-xl mx-auto leading-relaxed">
            Recursos modernos e acessíveis, do iniciante ao avançado, com tecnologia de ponta.
          </p>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
          {features.map((feat) => (
            <Link
              key={feat.path}
              to={feat.path}
              className="group relative bg-white border border-slate-100 rounded-3xl p-8 hover:border-slate-200 hover:-translate-y-1 transition-all duration-300 cursor-pointer"
              style={{ boxShadow: '0 1px 3px rgba(0,0,0,0.04), 0 4px 16px rgba(0,0,0,0.04)' }}
            >
              {/* Icon */}
              <div className={`w-14 h-14 flex items-center justify-center ${feat.bg} rounded-2xl mb-6`}>
                <i className={`${feat.icon} text-2xl bg-gradient-to-br ${feat.gradient} bg-clip-text`}
                  style={{ WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}
                ></i>
              </div>

              {/* Content */}
              <h3
                className="text-xl font-bold text-slate-900 mb-3"
               
              >
                {feat.title}
              </h3>
              <p className="text-slate-500 text-sm leading-relaxed mb-5">{feat.description}</p>

              {/* Bullets */}
              <ul className="space-y-2">
                {feat.bullets.map((b) => (
                  <li key={b} className="flex items-center gap-2 text-sm text-slate-600">
                    <div className="w-5 h-5 flex items-center justify-center flex-shrink-0">
                      <i className="ri-checkbox-circle-fill text-emerald-500"></i>
                    </div>
                    {b}
                  </li>
                ))}
              </ul>

              {/* Arrow */}
              <div className="absolute top-8 right-8 w-8 h-8 flex items-center justify-center rounded-xl bg-slate-50 group-hover:bg-emerald-50 group-hover:text-emerald-600 text-slate-400 transition-all duration-200">
                <i className="ri-arrow-right-up-line text-base"></i>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
