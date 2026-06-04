import { useState, useEffect, useRef } from 'react';

const historyChapters = [
  {
    id: 1,
    year: '1857',
    title: 'O Início no Brasil',
    icon: 'ri-building-line',
    color: 'text-emerald-600',
    bg: 'bg-emerald-50',
    border: 'border-emerald-200',
    accentFrom: 'from-emerald-400',
    accentTo: 'to-teal-500',
    signWord: 'HISTÓRIA',
    signImage: 'https://readdy.ai/api/search-image?query=close%20up%20photograph%20of%20two%20human%20hands%20performing%20Brazilian%20sign%20language%20Libras%20gesture%20for%20the%20word%20history%2C%20clean%20white%20background%2C%20soft%20studio%20lighting%2C%20detailed%20fingers%20and%20palm%20position%20clearly%20visible%2C%20educational%20sign%20language%20reference%20photo%2C%20high%20resolution%2C%20realistic%20skin%20tones&width=400&height=400&seq=sign_hist_001&orientation=squarish',
    text: 'Em 1857, o imperador Dom Pedro II trouxe ao Brasil o professor surdo francês Ernest Huet, que fundou o Imperial Instituto de Surdos-Mudos no Rio de Janeiro — hoje o Instituto Nacional de Educação de Surdos (INES). Huet trouxe a Língua de Sinais Francesa, que se misturou com os sinais já usados pelos surdos brasileiros, dando origem à Libras.',
    fact: 'O INES ainda existe e é referência nacional para a educação de surdos.',
  },
  {
    id: 2,
    year: '1960–80',
    title: 'Décadas de Resistência',
    icon: 'ri-shield-star-line',
    color: 'text-amber-600',
    bg: 'bg-amber-50',
    border: 'border-amber-200',
    accentFrom: 'from-amber-400',
    accentTo: 'to-orange-500',
    signWord: 'RESISTÊNCIA',
    signImage: 'https://readdy.ai/api/search-image?query=close%20up%20photograph%20of%20human%20hands%20performing%20Brazilian%20sign%20language%20Libras%20gesture%20showing%20strength%20and%20resistance%2C%20clean%20white%20background%2C%20soft%20studio%20lighting%2C%20detailed%20fingers%20forming%20a%20fist%20with%20thumb%20up%2C%20educational%20sign%20language%20reference%20photo%2C%20high%20resolution%2C%20realistic%20skin%20tones&width=400&height=400&seq=sign_resist_002&orientation=squarish',
    text: 'Durante décadas, o uso de línguas de sinais foi proibido em muitas escolas ao redor do mundo, incluindo o Brasil. O método oralista dominava: surdos eram forçados a aprender a falar e a leitura labial. Mesmo assim, a comunidade surda resistiu e manteve viva a Libras em espaços informais, associações e encontros comunitários.',
    fact: 'A resistência da comunidade surda foi fundamental para a sobrevivência da Libras.',
  },
  {
    id: 3,
    year: '1994',
    title: 'Reconhecimento Acadêmico',
    icon: 'ri-graduation-cap-line',
    color: 'text-teal-600',
    bg: 'bg-teal-50',
    border: 'border-teal-200',
    accentFrom: 'from-teal-400',
    accentTo: 'to-cyan-500',
    signWord: 'CONHECIMENTO',
    signImage: 'https://readdy.ai/api/search-image?query=close%20up%20photograph%20of%20human%20hands%20performing%20Brazilian%20sign%20language%20Libras%20gesture%20for%20knowledge%20and%20learning%2C%20open%20palm%20touching%20forehead%20then%20moving%20forward%2C%20clean%20white%20background%2C%20soft%20studio%20lighting%2C%20educational%20sign%20language%20reference%20photo%2C%20high%20resolution%2C%20realistic%20skin%20tones&width=400&height=400&seq=sign_know_003&orientation=squarish',
    text: 'Na década de 1990, pesquisadores brasileiros começaram a estudar e documentar a Libras como uma língua completa e legítima. A linguista Lucinda Ferreira Brito foi pioneira nesse trabalho, publicando estudos que comprovaram que a Libras possui gramática própria, estrutura fonológica e toda a complexidade de qualquer língua natural humana.',
    fact: 'A Libras tem estrutura gramatical própria, completamente independente do português.',
  },
  {
    id: 4,
    year: '2002',
    title: 'Lei 10.436 — Libras é Lei!',
    icon: 'ri-government-line',
    color: 'text-rose-600',
    bg: 'bg-rose-50',
    border: 'border-rose-200',
    accentFrom: 'from-rose-400',
    accentTo: 'to-pink-500',
    signWord: 'LEI',
    signImage: 'https://readdy.ai/api/search-image?query=close%20up%20photograph%20of%20human%20hands%20performing%20Brazilian%20sign%20language%20Libras%20gesture%20for%20law%20and%20rights%2C%20both%20hands%20with%20index%20fingers%20pointing%20upward%20and%20crossing%2C%20clean%20white%20background%2C%20soft%20studio%20lighting%2C%20educational%20sign%20language%20reference%20photo%2C%20high%20resolution%2C%20realistic%20skin%20tones&width=400&height=400&seq=sign_law_004&orientation=squarish',
    text: 'Em 24 de abril de 2002, o presidente Fernando Henrique Cardoso sancionou a Lei nº 10.436, reconhecendo oficialmente a Libras como meio legal de comunicação e expressão da comunidade surda brasileira. Foi um marco histórico para a inclusão e os direitos das pessoas surdas no Brasil.',
    fact: '24 de abril é o Dia Nacional da Língua Brasileira de Sinais.',
  },
  {
    id: 5,
    year: '2005',
    title: 'Decreto 5.626 — Inclusão Total',
    icon: 'ri-file-text-line',
    color: 'text-violet-600',
    bg: 'bg-violet-50',
    border: 'border-violet-200',
    accentFrom: 'from-violet-400',
    accentTo: 'to-purple-500',
    signWord: 'INCLUSÃO',
    signImage: 'https://readdy.ai/api/search-image?query=close%20up%20photograph%20of%20human%20hands%20performing%20Brazilian%20sign%20language%20Libras%20gesture%20for%20inclusion%20and%20together%2C%20both%20hands%20coming%20together%20in%20a%20welcoming%20embrace%20gesture%2C%20clean%20white%20background%2C%20soft%20studio%20lighting%2C%20educational%20sign%20language%20reference%20photo%2C%20high%20resolution%2C%20realistic%20skin%20tones&width=400&height=400&seq=sign_incl_005&orientation=squarish',
    text: 'O Decreto nº 5.626 de 2005 regulamentou a Lei de Libras e determinou a inclusão da Libras como disciplina curricular obrigatória nos cursos de formação de professores e fonoaudiologia. Também estabeleceu a criação de cursos de graduação em Letras-Libras e a formação de intérpretes de Libras.',
    fact: 'Hoje existem cursos de Letras-Libras em universidades federais de todo o Brasil.',
  },
  {
    id: 6,
    year: 'Hoje',
    title: 'Libras no Século XXI',
    icon: 'ri-rocket-line',
    color: 'text-indigo-600',
    bg: 'bg-indigo-50',
    border: 'border-indigo-200',
    accentFrom: 'from-indigo-400',
    accentTo: 'to-blue-500',
    signWord: 'FUTURO',
    signImage: 'https://readdy.ai/api/search-image?query=close%20up%20photograph%20of%20human%20hands%20performing%20Brazilian%20sign%20language%20Libras%20gesture%20for%20future%20and%20technology%2C%20one%20hand%20pointing%20forward%20with%20open%20fingers%20spreading%20outward%2C%20clean%20white%20background%2C%20soft%20studio%20lighting%2C%20educational%20sign%20language%20reference%20photo%2C%20high%20resolution%2C%20realistic%20skin%20tones&width=400&height=400&seq=sign_fut_006&orientation=squarish',
    text: 'Hoje, a Libras é falada por mais de 5 milhões de pessoas no Brasil. Com o avanço da tecnologia, plataformas como o LVP tornam o aprendizado acessível a todos. Intérpretes de Libras estão presentes em eventos públicos, programas de TV e serviços essenciais. A luta por inclusão continua, mas os avanços são enormes.',
    fact: 'Mais de 5 milhões de brasileiros se comunicam em Libras.',
  },
];

function SignDisplay({
  chapter,
  isChanging,
}: {
  chapter: (typeof historyChapters)[0];
  isChanging: boolean;
}) {
  const [pulse, setPulse] = useState(false);

  useEffect(() => {
    setPulse(true);
    const t = setTimeout(() => setPulse(false), 600);
    return () => clearTimeout(t);
  }, [chapter.id]);

  return (
    <div className="flex flex-col items-center gap-4 select-none">
      {/* Label */}
      <div
        className={`px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest border ${chapter.border} ${chapter.bg} ${chapter.color} transition-all duration-300`}
      >
        Sinal em Libras
      </div>

      {/* Sign image card */}
      <div
        className={`relative w-56 h-56 md:w-64 md:h-64 rounded-3xl overflow-hidden border-4 ${chapter.border} bg-white transition-all duration-500 ${
          isChanging ? 'opacity-0 scale-95' : 'opacity-100 scale-100'
        } ${pulse ? 'ring-4 ring-offset-2 ring-emerald-300' : ''}`}
      >
        {/* Gradient overlay top */}
        <div
          className={`absolute inset-x-0 top-0 h-10 bg-gradient-to-b ${chapter.accentFrom} to-transparent opacity-30 z-10`}
        />

        <img
          src={chapter.signImage}
          alt={`Sinal de Libras para ${chapter.signWord}`}
          className="w-full h-full object-cover object-top"
        />

        {/* Word badge */}
        <div
          className={`absolute bottom-3 left-1/2 -translate-x-1/2 px-4 py-1.5 bg-gradient-to-r ${chapter.accentFrom} ${chapter.accentTo} rounded-full text-white text-sm font-bold whitespace-nowrap z-20`}
        >
          {chapter.signWord}
        </div>
      </div>

      {/* Interpreter avatar strip */}
      <div className={`flex items-center gap-3 px-4 py-2.5 bg-white border ${chapter.border} rounded-2xl`}>
        <div
          className={`w-9 h-9 flex items-center justify-center rounded-xl bg-gradient-to-br ${chapter.accentFrom} ${chapter.accentTo} flex-shrink-0`}
        >
          <i className="ri-user-voice-line text-white text-base"></i>
        </div>
        <div>
          <p className="text-xs font-bold text-slate-700">Intérprete LVP</p>
          <div className="flex items-center gap-1.5 mt-0.5">
            <span className={`w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse`}></span>
            <span className="text-xs text-slate-400">Sinalizando ao vivo</span>
          </div>
        </div>
        {/* Sound wave animation */}
        <div className="flex items-end gap-0.5 h-5 ml-1">
          {[3, 5, 4, 6, 3, 5, 4].map((h, i) => (
            <div
              key={i}
              className={`w-1 rounded-full bg-gradient-to-t ${chapter.accentFrom} ${chapter.accentTo} animate-bounce`}
              style={{
                height: `${h * 3}px`,
                animationDelay: `${i * 80}ms`,
                animationDuration: '0.8s',
              }}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

export default function LibrasHistorySection() {
  const [activeChapter, setActiveChapter] = useState(0);
  const [isChanging, setIsChanging] = useState(false);
  const [visible, setVisible] = useState(false);
  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setVisible(true);
      },
      { threshold: 0.1 },
    );
    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  const goToChapter = (idx: number) => {
    setIsChanging(true);
    setTimeout(() => {
      setActiveChapter(idx);
      setIsChanging(false);
    }, 250);
  };

  const chapter = historyChapters[activeChapter];

  return (
    <section ref={sectionRef} className="py-24 px-4 md:px-8 bg-white overflow-hidden">
      <div className="max-w-7xl mx-auto">

        {/* Header */}
        <div
          className={`text-center mb-14 transition-all duration-700 ${
            visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
          }`}
        >
          <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-emerald-50 border border-emerald-100 rounded-full text-emerald-600 text-sm font-semibold mb-5">
            <i className="ri-history-line"></i>
            História da Libras
          </div>
          <h2
            className="text-3xl md:text-5xl font-extrabold text-slate-900 leading-tight mb-4"
           
          >
            Uma língua com{' '}
            <em className="not-italic text-transparent bg-clip-text bg-gradient-to-r from-emerald-500 to-teal-500">
              mais de 160 anos
            </em>{' '}
            de história
          </h2>
          <p className="text-slate-500 text-lg max-w-2xl mx-auto leading-relaxed">
            Conheça a trajetória da Língua Brasileira de Sinais, da sua origem até se tornar patrimônio cultural do Brasil.
          </p>
        </div>

        {/* Timeline nav pills */}
        <div
          className={`flex flex-wrap justify-center gap-2 mb-12 transition-all duration-700 delay-200 ${
            visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'
          }`}
        >
          {historyChapters.map((ch, idx) => (
            <button
              key={ch.id}
              onClick={() => goToChapter(idx)}
              className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold transition-all duration-200 cursor-pointer whitespace-nowrap border ${
                activeChapter === idx
                  ? `${ch.bg} ${ch.color} ${ch.border}`
                  : 'bg-slate-50 text-slate-500 border-slate-200 hover:border-slate-300 hover:bg-slate-100'
              }`}
            >
              <i className={`${ch.icon} text-sm`}></i>
              {ch.year}
            </button>
          ))}
        </div>

        {/* Main card */}
        <div
          className={`transition-all duration-700 delay-300 ${
            visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
          }`}
        >
          <div className={`rounded-3xl border-2 ${chapter.border} ${chapter.bg} p-6 md:p-10 transition-colors duration-500`}>
            <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 lg:gap-12 items-center">

              {/* Sign display — left (2 cols) */}
              <div className="lg:col-span-2 flex justify-center order-2 lg:order-1">
                <SignDisplay chapter={chapter} isChanging={isChanging} />
              </div>

              {/* Text content — right (3 cols) */}
              <div className="lg:col-span-3 order-1 lg:order-2">
                <div className="flex items-center gap-3 mb-5">
                  <div
                    className={`w-12 h-12 flex items-center justify-center rounded-2xl bg-white border ${chapter.border} flex-shrink-0`}
                  >
                    <i className={`${chapter.icon} ${chapter.color} text-2xl`}></i>
                  </div>
                  <div>
                    <span className={`text-xs font-bold uppercase tracking-widest ${chapter.color}`}>
                      {chapter.year}
                    </span>
                    <h3
                      className="text-xl md:text-2xl font-extrabold text-slate-900"
                     
                    >
                      {chapter.title}
                    </h3>
                  </div>
                </div>

                <p className="text-slate-600 text-base leading-relaxed mb-6">{chapter.text}</p>

                {/* Fact card */}
                <div className={`flex items-start gap-3 bg-white rounded-2xl border ${chapter.border} px-5 py-4 mb-6`}>
                  <div className={`w-8 h-8 flex items-center justify-center rounded-xl ${chapter.bg} flex-shrink-0`}>
                    <i className={`ri-lightbulb-line ${chapter.color} text-base`}></i>
                  </div>
                  <div>
                    <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-0.5">
                      Você sabia?
                    </p>
                    <p className={`text-sm font-semibold ${chapter.color}`}>{chapter.fact}</p>
                  </div>
                </div>

                {/* Navigation */}
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => goToChapter(Math.max(0, activeChapter - 1))}
                    disabled={activeChapter === 0}
                    className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white border border-slate-200 text-slate-600 text-sm font-medium hover:border-slate-300 transition-all duration-200 cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed whitespace-nowrap"
                  >
                    <i className="ri-arrow-left-line"></i>
                    Anterior
                  </button>
                  <div className="flex gap-1.5 flex-1 justify-center">
                    {historyChapters.map((_, idx) => (
                      <button
                        key={idx}
                        onClick={() => goToChapter(idx)}
                        className={`h-2 rounded-full transition-all duration-300 cursor-pointer ${
                          activeChapter === idx
                            ? `w-6 bg-gradient-to-r ${chapter.accentFrom} ${chapter.accentTo}`
                            : 'w-2 bg-slate-200 hover:bg-slate-300'
                        }`}
                      />
                    ))}
                  </div>
                  <button
                    onClick={() => goToChapter(Math.min(historyChapters.length - 1, activeChapter + 1))}
                    disabled={activeChapter === historyChapters.length - 1}
                    className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-white text-sm font-medium transition-all duration-200 cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed whitespace-nowrap bg-gradient-to-r ${chapter.accentFrom} ${chapter.accentTo} hover:opacity-90 active:scale-95`}
                  >
                    Próximo
                    <i className="ri-arrow-right-line"></i>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom stats */}
        <div
          className={`grid grid-cols-2 md:grid-cols-4 gap-4 mt-10 transition-all duration-700 delay-500 ${
            visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'
          }`}
        >
          {[
            { icon: 'ri-calendar-line', value: '1857', label: 'Ano de origem', color: 'text-emerald-600', bg: 'bg-emerald-50' },
            { icon: 'ri-group-line', value: '5M+', label: 'Falantes no Brasil', color: 'text-teal-600', bg: 'bg-teal-50' },
            { icon: 'ri-file-text-line', value: '2002', label: 'Reconhecida por lei', color: 'text-amber-600', bg: 'bg-amber-50' },
            { icon: 'ri-global-line', value: '300+', label: 'Línguas de sinais no mundo', color: 'text-rose-600', bg: 'bg-rose-50' },
          ].map((stat) => (
            <div key={stat.label} className={`${stat.bg} rounded-2xl p-5 flex flex-col items-center text-center`}>
              <div className="w-10 h-10 flex items-center justify-center rounded-xl bg-white mb-3">
                <i className={`${stat.icon} ${stat.color} text-lg`}></i>
              </div>
              <p className={`text-2xl font-extrabold ${stat.color}`}>{stat.value}</p>
              <p className="text-xs text-slate-500 mt-1 font-medium">{stat.label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
