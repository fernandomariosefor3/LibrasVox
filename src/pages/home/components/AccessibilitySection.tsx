import SectionHeader from './SectionHeader';

const commitments = [
  { icon: 'ri-keyboard-box-line', title: 'Navegação por teclado', description: 'Todos os menus, cards e formulários podem ser usados sem mouse.' },
  { icon: 'ri-focus-3-line', title: 'Foco visível', description: 'Indicação clara de onde você está ao navegar pela página.' },
  { icon: 'ri-contrast-2-line', title: 'Alto contraste', description: 'Modo de alto contraste disponível para melhor legibilidade.' },
  { icon: 'ri-pulse-line', title: 'Movimento reduzido', description: 'Respeita a preferência do seu sistema por menos animações.' },
];

export default function AccessibilitySection() {
  return (
    <section className="py-20 px-4 md:px-8 bg-surface-50">
      <div className="max-w-5xl mx-auto">
        <SectionHeader
          icon="ri-accessibility-line"
          eyebrow="Acessibilidade"
          title="Feito para ser usado por"
          highlight="todo mundo"
          subtitle="Acessibilidade não é um extra — é parte de como o LibrasVox é construído."
          tone="brand"
        />
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
          {commitments.map((c) => (
            <div key={c.title} className="card p-5 text-center">
              <div className="w-10 h-10 flex items-center justify-center bg-brand-50 rounded-xl mx-auto mb-3">
                <i className={`${c.icon} text-lg text-brand-600`} aria-hidden="true" />
              </div>
              <h3 className="text-sm font-bold text-surface-900 mb-1">{c.title}</h3>
              <p className="text-xs text-surface-500 leading-relaxed">{c.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
