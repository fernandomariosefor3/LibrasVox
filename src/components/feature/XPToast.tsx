import type { XPGain, XPLevel } from '@/hooks/useXP';

type XPToastProps = {
  gain: XPGain | null;
  levelUp: XPLevel | null;
  onDismissLevelUp: () => void;
};

export function XPToast({ gain, levelUp, onDismissLevelUp }: XPToastProps) {
  return (
    <>
      {/* XP ganho */}
      {gain && (
        <div
          className="fixed bottom-6 left-1/2 -translate-x-1/2 z-[9998] flex items-center gap-2 px-4 py-2.5 bg-surface-900 text-white rounded-full shadow-2xl text-sm font-semibold animate-bounce-in pointer-events-none select-none"
          role="status"
          aria-live="polite"
        >
          <span className="text-yellow-400">+{gain.amount} XP</span>
          <span className="text-surface-400 text-xs">{gain.label}</span>
        </div>
      )}

      {/* Level up */}
      {levelUp && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-surface-900/60 backdrop-blur-sm">
          <div className="bg-surface-0 rounded-3xl border border-surface-100 shadow-2xl p-8 max-w-sm w-full text-center">
            <div className={`w-20 h-20 rounded-full ${levelUp.bgColor} flex items-center justify-center mx-auto mb-4`}>
              <i className={`${levelUp.icon} text-3xl ${levelUp.color}`} aria-hidden="true" />
            </div>
            <p className="text-xs font-bold tracking-widest uppercase text-brand-600 mb-1">
              Nível alcançado!
            </p>
            <h2 className="text-2xl font-extrabold text-surface-900 mb-1">
              Nível {levelUp.level}
            </h2>
            <p className={`text-lg font-bold ${levelUp.color} mb-4`}>{levelUp.name}</p>
            <p className="text-sm text-surface-500 mb-6">
              Parabéns! Você avançou de nível no LibrasVox. Continue estudando Libras!
            </p>
            <button
              onClick={onDismissLevelUp}
              className="w-full py-3 bg-gradient-to-r from-brand-500 to-brand-600 text-white rounded-xl font-semibold text-sm hover:opacity-90 transition-opacity"
            >
              Continuar
            </button>
          </div>
        </div>
      )}
    </>
  );
}
