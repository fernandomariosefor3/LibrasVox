const testimonials = [
  { name: 'Ana Paula S.', role: 'Professora de Ed. Especial', text: 'O LVP transformou minha forma de ensinar. O dicionário visual e o assistente IA tornaram meu trabalho muito mais rico e dinâmico com os alunos.', stars: 5, avatar: 'https://readdy.ai/api/search-image?query=Brazilian%20woman%20teacher%20smiling%20professional%20portrait%2C%20warm%20tone%2C%20simple%20background&width=80&height=80&seq=av1&orientation=squarish' },
  { name: 'Carlos M.', role: 'Estudante de Fonoaudiologia', text: 'O dicionário visual do LVP é fantástico! As fotos reais das mãos me ajudam muito a entender cada configuração. Já aprendi mais de 60 sinais em poucas semanas de prática.', stars: 5, avatar: 'https://readdy.ai/api/search-image?query=young%20Brazilian%20man%20student%20smiling%20portrait%2C%20warm%20tone%2C%20simple%20background&width=80&height=80&seq=av2&orientation=squarish' },
  { name: 'Fernanda L.', role: 'Mãe de criança surda', text: 'Aprendi mais de 30 sinais em uma semana! A datilologia 3D é perfeita para entender cada posição dos dedos. Minha filha ficou emocionada quando me comuniquei em Libras com ela.', stars: 5, avatar: 'https://readdy.ai/api/search-image?query=Brazilian%20mother%20woman%20warm%20smile%20portrait%2C%20soft%20background&width=80&height=80&seq=av3&orientation=squarish' },
  { name: 'Roberto A.', role: 'Intérprete em formação', text: 'O Assistente IA no modo Tutor me ajudou a entender a gramática de Libras de forma muito mais profunda. As explicações são claras e o contexto cultural é riquíssimo.', stars: 5, avatar: 'https://readdy.ai/api/search-image?query=Brazilian%20man%20professional%20smiling%20portrait%2C%20neutral%20background&width=80&height=80&seq=av4&orientation=squarish' },
  { name: 'Juliana T.', role: 'Designer UX', text: 'A interface é lindíssima e muito intuitiva. Uso a plataforma todos os dias e o sistema de progresso me mantém motivada. Já aprendi 45 sinais!', stars: 5, avatar: 'https://readdy.ai/api/search-image?query=young%20Brazilian%20woman%20designer%20smiling%20portrait%2C%20colorful%20background&width=80&height=80&seq=av5&orientation=squarish' },
  { name: 'Marcos S.', role: 'Médico — atendimento a surdos', text: 'Como médico que atende pacientes surdos, o LVP foi essencial para melhorar minha comunicação. O modo Tradutor é especialmente útil para termos da área da saúde.', stars: 5, avatar: 'https://readdy.ai/api/search-image?query=Brazilian%20male%20doctor%20smiling%20professional%20portrait%2C%20clean%20background&width=80&height=80&seq=av6&orientation=squarish' },
];

export default function TestimonialsSection() {
  return (
    <section className="py-24 px-4 md:px-8" style={{ backgroundColor: '#FEF9F0' }}>
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-14">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-amber-100 border border-amber-200 rounded-full text-amber-700 text-sm font-semibold mb-4">
            <i className="ri-chat-heart-line"></i>
            Depoimentos
          </div>
          <h2 className="text-3xl md:text-5xl font-extrabold text-slate-900 mb-4">
            Quem já está <em className="not-italic text-transparent bg-clip-text bg-gradient-to-r from-emerald-500 to-teal-500">aprendendo</em>
          </h2>
          <p className="text-slate-500 text-lg max-w-md mx-auto">Histórias reais de pessoas que transformaram sua comunicação com Libras.</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {testimonials.map((t, i) => (
            <div key={t.name} className={`bg-white rounded-3xl p-6 border border-slate-100 transition-all duration-300 hover:-translate-y-1 ${i >= 4 ? 'hidden lg:block' : ''}`}
              style={{ boxShadow: '0 2px 12px rgba(0,0,0,0.05)' }}>
              <div className="flex gap-0.5 mb-4">
                {Array.from({ length: t.stars }).map((_, si) => (
                  <i key={si} className="ri-star-fill text-amber-400 text-base"></i>
                ))}
              </div>
              <p className="text-slate-600 text-sm leading-relaxed mb-6">&quot;{t.text}&quot;</p>
              <div className="flex items-center gap-3 pt-4 border-t border-slate-50">
                <img src={t.avatar} alt={t.name} className="w-11 h-11 rounded-full object-cover object-top flex-shrink-0" />
                <div>
                  <div className="font-semibold text-slate-800 text-sm">{t.name}</div>
                  <div className="text-slate-400 text-xs">{t.role}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
