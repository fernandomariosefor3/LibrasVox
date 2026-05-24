import type { AssistantMode, ModeId } from '@/mocks/assistantModes';
import { assistantModes } from '@/mocks/assistantModes';
import ModeSwitcher from './ModeSwitcher';

interface ChatHistoryPanelProps {
  activeMode: ModeId;
  onModeChange: (mode: ModeId) => void;
  messageCounts: Record<ModeId, number>;
  onClearChat: () => void;
  currentMode: AssistantMode;
}

export default function ChatHistoryPanel({
  activeMode,
  onModeChange,
  messageCounts,
  onClearChat,
  currentMode,
}: ChatHistoryPanelProps) {
  const totalMessages = Object.values(messageCounts).reduce((a, b) => a + b, 0);

  return (
    <aside className="w-64 lg:w-72 flex-shrink-0 flex flex-col bg-white border-r border-slate-100 h-full">
      {/* Header */}
      <div className="p-4 border-b border-slate-100">
        <div className="flex items-center gap-3">
          <div className="relative w-10 h-10 flex items-center justify-center bg-gradient-to-br from-emerald-500 to-teal-500 rounded-xl">
            <i className="ri-sparkling-line text-white text-xl"></i>
            <span className="absolute -top-1 -right-1 w-3 h-3 bg-emerald-400 rounded-full border-2 border-white animate-pulse"></span>
          </div>
          <div>
            <h1
              className="text-base font-bold text-slate-900"
              style={{ fontFamily: 'Plus Jakarta Sans, sans-serif' }}
            >
              Assistente IA
            </h1>
            <p className="text-xs text-slate-400">Powered by Gemini</p>
          </div>
        </div>
      </div>

      {/* Mode Switcher */}
      <div className="flex-1 overflow-y-auto p-3">
        <ModeSwitcher activeMode={activeMode} onModeChange={onModeChange} />

        {/* Stats */}
        <div className="mt-4 pt-4 border-t border-slate-100">
          <p className="text-xs font-semibold text-slate-400 uppercase tracking-widest px-2 mb-2">
            Sessão Atual
          </p>
          <div className="grid grid-cols-2 gap-2">
            {assistantModes.map((mode) => (
              <div
                key={mode.id}
                className={`${mode.bgColor} rounded-xl p-2.5 border ${
                  activeMode === mode.id ? mode.borderColor : 'border-transparent'
                } transition-all duration-200`}
              >
                <p className={`text-lg font-bold ${mode.color} tabular-nums`}>
                  {messageCounts[mode.id] ?? 0}
                </p>
                <p className="text-xs text-slate-500 mt-0.5">{mode.label}</p>
              </div>
            ))}
          </div>
          {totalMessages > 0 && (
            <p className="text-xs text-slate-400 text-center mt-3">
              {totalMessages} mensagens trocadas
            </p>
          )}
        </div>
      </div>

      {/* Footer Actions */}
      <div className="p-3 border-t border-slate-100">
        {messageCounts[activeMode] > 0 && (
          <button
            onClick={onClearChat}
            className="w-full flex items-center justify-center gap-2 py-2.5 text-sm text-slate-500 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all duration-200 cursor-pointer group"
          >
            <i className="ri-delete-bin-line text-base group-hover:scale-110 transition-transform duration-200"></i>
            Limpar conversa atual
          </button>
        )}
        <div
          className={`mt-2 flex items-center gap-2 px-3 py-2.5 ${currentMode.bgColor} border ${currentMode.borderColor} rounded-xl transition-all duration-300`}
        >
          <div className={`w-2 h-2 rounded-full ${currentMode.badgeColor} animate-pulse`}></div>
          <span className={`text-xs font-medium ${currentMode.color}`}>
            Modo {currentMode.label} ativo
          </span>
        </div>
      </div>
    </aside>
  );
}
