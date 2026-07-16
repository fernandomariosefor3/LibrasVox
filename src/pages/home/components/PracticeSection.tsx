import SectionHeader from './SectionHeader';
import LearningCard from './LearningCard';

const practices = [
  {
    to: '/exercicios',
    icon: 'ri-pencil-ruler-2-line',
    title: 'Exercícios',
    description: 'Teste o que você aprendeu com exercícios práticos e quizzes de fixação.',
    bullets: ['Quizzes de fixação', 'Feedback imediato', 'Vários níveis'],
  },
  {
    to: '/flashcards',
    icon: 'ri-stack-line',
    title: 'Flashcards',
    description: 'Revise sinais com repetição espaçada, que adapta a frequência de revisão ao seu desempenho.',
    bullets: ['Repetição espaçada (SRS)', 'Deck personalizado', 'Acompanhe sua sequência'],
  },
  {
    to: '/recognition',
    icon: 'ri-camera-lens-line',
    title: 'LibrasVox Vision',
    description: 'Demonstração experimental: envie uma imagem e veja uma simulação didática de reconhecimento de sinais.',
    bullets: ['Upload de imagem para teste', 'Demonstração para fins didáticos', 'Recurso em evolução'],
  },
];

export default function PracticeSection() {
  return (
    <section className="py-24 px-4 md:px-8 bg-surface-0">
      <div className="max-w-7xl mx-auto">
        <SectionHeader
          icon="ri-pencil-ruler-2-line"
          eyebrow="Praticar"
          title="Recursos para"
          highlight="praticar"
          subtitle="Fixe o que você aprendeu com prática ativa e revisão espaçada."
          tone="accent"
        />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
          {practices.map((item) => (
            <LearningCard key={item.to} {...item} tone="accent" />
          ))}
        </div>
      </div>
    </section>
  );
}
