import SectionHeader from './SectionHeader';

const items = [
  { icon: 'ri-translate-2', title: 'Dicionário visual', description: 'Mais de 50 sinais categorizados' },
  { icon: 'ri-graduation-cap-line', title: 'Cursos estruturados', description: 'Módulos do iniciante ao avançado' },
  { icon: 'ri-keyboard-line', title: 'Alfabeto interativo', description: 'Datilologia A-Z passo a passo' },
  { icon: 'ri-chat-quote-line', title: 'Frases do dia a dia', description: 'Cenários reais com glossa e gramática' },
  { icon: 'ri-pencil-ruler-2-line', title: 'Exercícios', description: 'Quizzes de fixação com feedback' },
  { icon: 'ri-stack-line', title: 'Flashcards', description: 'Repetição espaçada inteligente' },
  { icon: 'ri-bar-chart-line', title: 'Painel de progresso', description: 'Acompanhe cada sinal aprendido' },
  { icon: 'ri-heart-line', title: '100% gratuito', description: 'Acessível para toda a comunidade' },
];

export default function PlatformOverviewSection() {
  return (
    <section className="py-24 px-4 md:px-8 bg-surface-50">
      <div className="max-w-7xl mx-auto">
        <SectionHeader
          icon="ri-list-check-2"
          eyebrow="Visão geral"
          title="Tudo o que você encontra no"
          highlight="LibrasVox"
          subtitle="Uma plataforma completa para aprender Libras do zero ou aprofundar o que você já sabe."
          tone="brand"
        />
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
          {items.map((item) => (
            <div key={item.title} className="card p-6">
              <div className="w-11 h-11 flex items-center justify-center bg-brand-50 rounded-xl mb-4">
                <i className={`${item.icon} text-lg text-brand-600`} aria-hidden="true" />
              </div>
              <h3 className="text-sm font-bold text-surface-900 mb-1">{item.title}</h3>
              <p className="text-xs text-surface-500 leading-relaxed">{item.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
