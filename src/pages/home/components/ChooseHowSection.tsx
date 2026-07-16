import SectionHeader from './SectionHeader';
import LearningCard from './LearningCard';

const paths = [
  {
    to: '/alphabet',
    icon: 'ri-flag-line',
    title: 'Nunca aprendi Libras',
    description: 'Comece pelo alfabeto manual e dê os primeiros passos na língua.',
  },
  {
    to: '/frases',
    icon: 'ri-chat-quote-line',
    title: 'Quero me comunicar no dia a dia',
    description: 'Aprenda frases prontas para situações reais do cotidiano.',
  },
  {
    to: '/cursos',
    icon: 'ri-graduation-cap-line',
    title: 'Quero uma trilha completa',
    description: 'Siga módulos estruturados do iniciante ao avançado.',
  },
  {
    to: '/dictionary',
    icon: 'ri-translate-2',
    title: 'Já sei o básico, quero consultar',
    description: 'Explore o dicionário visual de sinais por categoria.',
  },
];

export default function ChooseHowSection() {
  return (
    <section className="py-24 px-4 md:px-8 bg-surface-50">
      <div className="max-w-7xl mx-auto">
        <SectionHeader
          icon="ri-compass-3-line"
          eyebrow="Comece por aqui"
          title="Escolha como"
          highlight="aprender"
          subtitle="Cada pessoa aprende Libras de um jeito. Escolha o caminho que faz mais sentido para você agora."
          tone="brand"
        />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 lg:gap-6">
          {paths.map((item) => (
            <LearningCard key={item.to} {...item} tone="brand" />
          ))}
        </div>
      </div>
    </section>
  );
}
