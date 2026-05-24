import type { GrammarTopic } from '@/mocks/grammar';

interface TopicSidebarProps {
  topics: GrammarTopic[];
  activeId: string;
  onSelect: (id: string) => void;
}

export default function TopicSidebar({ topics, activeId, onSelect }: TopicSidebarProps) {
  return (
    <aside className="w-full">
      <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-3 px-1">
        Tópicos Gramaticais
      </p>
      <nav className="flex flex-col gap-1">
        {topics.map((topic, idx) => {
          const isActive = activeId === topic.id;
          return (
            <button
              key={topic.id}
              onClick={() => onSelect(topic.id)}
              className={`w-full flex items-center gap-3 px-3 py-3 rounded-xl text-left transition-all duration-200 cursor-pointer group border ${
                isActive
                  ? `${topic.bg} ${topic.border} ${topic.color}`
                  : 'border-transparent hover:bg-slate-50 hover:border-slate-100'
              }`}
            >
              <div
                className={`w-8 h-8 flex items-center justify-center rounded-lg flex-shrink-0 transition-all duration-200 ${
                  isActive
                    ? `bg-gradient-to-br ${topic.gradient} text-white`
                    : 'bg-slate-100 text-slate-400 group-hover:bg-slate-200'
                }`}
              >
                <i className={`${topic.icon} text-sm`}></i>
              </div>
              <div className="flex-1 min-w-0">
                <p
                  className={`text-sm font-semibold truncate transition-colors duration-200 ${
                    isActive ? topic.color : 'text-slate-700'
                  }`}
                >
                  {topic.title}
                </p>
                <p className="text-xs text-slate-400 truncate">{topic.subtitle}</p>
              </div>
              <span
                className={`text-xs font-bold w-5 h-5 flex items-center justify-center rounded-full flex-shrink-0 ${
                  isActive ? `bg-gradient-to-br ${topic.gradient} text-white` : 'bg-slate-100 text-slate-400'
                }`}
              >
                {idx + 1}
              </span>
            </button>
          );
        })}
      </nav>

      {/* Quick reference card */}
      <div className="mt-6 p-4 bg-slate-50 rounded-2xl border border-slate-200">
        <p className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-3">
          Referência Rápida
        </p>
        <div className="space-y-2">
          {[
            { label: 'Ordem básica', value: 'OSV' },
            { label: 'Parâmetros', value: '5 (CM, PA, M, Or, ENM)' },
            { label: 'Configurações', value: '64 CMs' },
            { label: 'Reconhecida', value: 'Lei 10.436/2002' },
          ].map((item) => (
            <div key={item.label} className="flex justify-between items-center">
              <span className="text-xs text-slate-500">{item.label}</span>
              <span className="text-xs font-bold text-slate-700 bg-white border border-slate-200 px-2 py-0.5 rounded-lg">
                {item.value}
              </span>
            </div>
          ))}
        </div>
      </div>
    </aside>
  );
}
