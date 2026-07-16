import SectionHeader from './SectionHeader';
import LearningCard from './LearningCard';

const contents = [
  {
    to: '/dictionary',
    icon: 'ri-translate-2',
    title: 'Dicionário de Sinais',
    description:
      'Mais de 50 sinais categorizados com descrição detalhada e passo a passo para cada movimento. Busque por palavra, categoria ou emoção.',
    bullets: ['50+ sinais com passo a passo', 'Categorias: família, cores, emoções…', 'Marque seus favoritos'],
  },
  {
    to: '/cursos',
    icon: 'ri-graduation-cap-line',
    title: 'Cursos por Módulo',
    description:
      'Trilhas estruturadas do iniciante ao avançado, organizadas por nível, para você aprender Libras de forma progressiva.',
    bullets: ['Módulos por nível', 'Progressão guiada', 'Conteúdo estruturado'],
  },
  {
    to: '/alphabet',
    icon: 'ri-keyboard-line',
    title: 'Datilologia Interativa',
    description:
      'Visualize o alfabeto manual (A-Z) em um renderizador interativo. Pratique cada letra com instrução visual clara.',
    bullets: ['Alfabeto A a Z', 'Prática letra por letra', 'Visual interativo'],
  },
  {
    to: '/gramatica',
    icon: 'ri-book-open-line',
    title: 'Gramática da Libras',
    description: 'Entenda a estrutura gramatical da Libras, com explicações claras sobre como a língua se organiza.',
    bullets: ['Estrutura da língua', 'Explicações claras', 'Exemplos práticos'],
  },
  {
    to: '/frases',
    icon: 'ri-chat-quote-line',
    title: 'Frases por Contexto',
    description:
      'Aprenda Libras através de cenários do dia a dia, com glossa e explicações gramaticais para situações reais.',
    bullets: ['Cenários práticos do cotidiano', 'Glossa + gramática explicada', 'Navegação passo a passo'],
  },
  {
    to: '/videoaulas',
    icon: 'ri-video-line',
    title: 'Videoaulas',
    description: 'Aulas em vídeo para complementar seu aprendizado com explicações visuais guiadas.',
    bullets: ['Aulas em vídeo', 'Explicações guiadas', 'No seu ritmo'],
  },
];

export default function LearnSection() {
  return (
    <section className="py-24 px-4 md:px-8 bg-surface-0">
      <div className="max-w-7xl mx-auto">
        <SectionHeader
          icon="ri-book-open-line"
          eyebrow="Aprender"
          title="Conteúdos para"
          highlight="aprender Libras"
          subtitle="Recursos estruturados, do iniciante ao avançado, para você construir uma base sólida em Libras."
          tone="brand"
        />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
          {contents.map((item) => (
            <LearningCard key={item.to} {...item} tone="brand" />
          ))}
        </div>
      </div>
    </section>
  );
}
