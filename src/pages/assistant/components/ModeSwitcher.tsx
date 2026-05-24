import { assistantModes, type ModeId } from '@/mocks/assistantModes';

interface ModeSwitcherProps {
  activeMode: ModeId;
  onModeChange: (mode: ModeId) => void;
}

export default function ModeSwitcher({ activeMode, onModeChange }: ModeSwitcherProps) {
  return (
    <div className="flex flex-col gap-1.5">
      <p className="text-xs font-semibold text-slate-400 uppercase tracking-widest px-2 mb-1">
        Modos IA
      </p>
      {assistantModes.map((mode) => {
        const isActive = activeMode === mode.id;
        return (
          <button
            key={mode.id}
            onClick={() => onModeChange(mode.id)}
            className={`w-full flex items-start gap-3 px-3 py-3 rounded-xl text-left transition-all duration-250 cursor-pointer whitespace-nowrap group ${
              isActive
                ? `${mode.bgColor} ${mode.borderColor} border shadow-sm`
                : 'hover:bg-slate-50 border border-transparent hover:border-slate-100'
            }`}
          >
            <div
              className={`w-9 h-9 flex items-center justify-center rounded-lg flex-shrink-0 transition-all duration-250 ${
                isActive ? `${mode.bgColor} border ${mode.borderColor}` : 'bg-slate-100 group-hover:bg-slate-200'
              }`}
            >
              <i
                className={`${mode.icon} text-lg transition-colors duration-250 ${
                  isActive ? mode.color : 'text-slate-400 group-hover:text-slate-500'
                }`}
              ></i>
            </div>
            <div className="min-w-0 flex-1">
              <p
                className={`text-sm font-semibold transition-colors duration-250 ${
                  isActive ? mode.color : 'text-slate-700'
                }`}
              >
                {mode.label}
              </p>
              <p className="text-xs text-slate-400 mt-0.5 whitespace-normal leading-tight">
                {mode.description}
              </p>
            </div>
            {isActive && (
              <div
                className={`w-2 h-2 rounded-full flex-shrink-0 mt-1.5 ${mode.badgeColor} animate-pulse`}
              ></div>
            )}
          </button>
        );
      })}
    </div>
  );
}
