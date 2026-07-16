const benefits = [
  { icon: 'ri-group-line', title: 'Para toda a turma', description: 'Conteúdo estruturado que professores podem usar em sala de aula.' },
  { icon: 'ri-price-tag-3-line', title: 'Totalmente gratuito', description: 'Sem custo para escolas, educadores ou alunos.' },
  { icon: 'ri-shield-check-line', title: 'Acessível por padrão', description: 'Construído com foco em acessibilidade desde o início.' },
];

export default function SchoolsSection() {
  return (
    <section className="py-24 px-4 md:px-8 bg-surface-0">
      <div className="max-w-5xl mx-auto">
        <div className="relative rounded-[40px] overflow-hidden bg-brand-900 px-8 md:px-16 py-16 md:py-20 text-center">
          <div className="absolute top-0 right-0 w-72 h-72 bg-brand-500/10 rounded-full -translate-y-1/2 translate-x-1/2 pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-56 h-56 bg-accent-400/10 rounded-full translate-y-1/2 -translate-x-1/2 pointer-events-none" />
          <div className="relative z-10">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-white/10 border border-white/20 rounded-full text-brand-100 text-sm font-semibold mb-6">
              <i className="ri-school-line" aria-hidden="true" />
              Para escolas
            </div>
            <h2 className="text-3xl md:text-5xl font-extrabold text-white leading-tight mb-4">
              Leve o LibrasVox para a sua escola
            </h2>
            <p className="text-white/70 text-lg max-w-lg mx-auto mb-10">
              Uma plataforma gratuita e acessível para apoiar o ensino de Libras em sala de aula,
              do fundamental ao ensino superior.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-10 text-left">
              {benefits.map((b) => (
                <div key={b.title} className="bg-white/5 border border-white/10 rounded-2xl p-5">
                  <i className={`${b.icon} text-2xl text-brand-200 mb-3 block`} aria-hidden="true" />
                  <h3 className="text-white font-semibold text-sm mb-1">{b.title}</h3>
                  <p className="text-white/60 text-xs leading-relaxed">{b.description}</p>
                </div>
              ))}
            </div>
            <a
              href="mailto:librasvox@gmail.com?subject=LibrasVox%20para%20escolas"
              className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-white text-brand-700 rounded-2xl text-base font-bold hover:scale-105 transition-all duration-200 cursor-pointer whitespace-nowrap"
            >
              <i className="ri-mail-line" aria-hidden="true" />
              Fale conosco
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
