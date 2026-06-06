import { useState, useRef, useEffect } from 'react';
import { useAccessibility } from '@/contexts/AccessibilityContext';

export function AccessibilityPanel() {
  const [open, setOpen] = useState(false);
  const { highContrast, toggleHighContrast, dyslexicFont, toggleDyslexicFont, reducedMotion } =
    useAccessibility();
  const panelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (panelRef.current && !panelRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    function handleEscape(e: KeyboardEvent) {
      if (e.key === 'Escape') setOpen(false);
    }
    document.addEventListener('mousedown', handleClick);
    document.addEventListener('keydown', handleEscape);
    return () => {
      document.removeEventListener('mousedown', handleClick);
      document.removeEventListener('keydown', handleEscape);
    };
  }, []);

  return (
    <div ref={panelRef} className="relative">
      <button
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        aria-controls="accessibility-panel"
        aria-label="Opções de acessibilidade"
        title="Acessibilidade"
        className="flex items-center justify-center w-9 h-9 rounded-lg text-surface-600 hover:bg-surface-100 hover:text-surface-900 transition-colors focus-visible:ring-2 focus-visible:ring-brand-500 focus-visible:ring-offset-2 focus-visible:outline-none"
      >
        <i className="ri-eye-line text-lg" aria-hidden="true" />
      </button>

      {open && (
        <div
          id="accessibility-panel"
          role="dialog"
          aria-label="Painel de acessibilidade"
          className="absolute right-0 top-full mt-2 w-64 bg-surface-0 rounded-2xl border border-surface-100 shadow-xl shadow-surface-900/10 z-50 p-4 space-y-3"
        >
          <p className="text-xs font-bold uppercase tracking-widest text-brand-600 mb-3">
            Acessibilidade
          </p>

          <ToggleRow
            icon="ri-contrast-2-line"
            label="Alto contraste"
            description="Aumenta o contraste de cores"
            checked={highContrast}
            onChange={toggleHighContrast}
            id="toggle-high-contrast"
          />

          <ToggleRow
            icon="ri-text-spacing"
            label="Fonte para dislexia"
            description="Usa fonte OpenDyslexic"
            checked={dyslexicFont}
            onChange={toggleDyslexicFont}
            id="toggle-dyslexic"
          />

          <div className="pt-2 border-t border-surface-100">
            <div className="flex items-start gap-2">
              <i
                className={`ri-run-line text-sm mt-0.5 ${reducedMotion ? 'text-brand-500' : 'text-surface-400'}`}
                aria-hidden="true"
              />
              <p className="text-xs text-surface-500">
                {reducedMotion
                  ? 'Animações reduzidas (configuração do sistema)'
                  : 'Animações ativas'}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

type ToggleRowProps = {
  icon: string;
  label: string;
  description: string;
  checked: boolean;
  onChange: () => void;
  id: string;
};

function ToggleRow({ icon, label, description, checked, onChange, id }: ToggleRowProps) {
  return (
    <div className="flex items-center justify-between gap-3">
      <div className="flex items-start gap-2">
        <i className={`${icon} text-sm mt-0.5 text-surface-500`} aria-hidden="true" />
        <div>
          <label htmlFor={id} className="text-sm font-medium text-surface-800 cursor-pointer">
            {label}
          </label>
          <p className="text-xs text-surface-400">{description}</p>
        </div>
      </div>
      <button
        id={id}
        role="switch"
        aria-checked={checked}
        aria-label={label}
        onClick={onChange}
        className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 focus-visible:ring-offset-2 shrink-0 ${
          checked ? 'bg-brand-500' : 'bg-surface-200'
        }`}
      >
        <span
          className={`inline-block h-3.5 w-3.5 transform rounded-full bg-white shadow transition-transform ${
            checked ? 'translate-x-4' : 'translate-x-1'
          }`}
        />
      </button>
    </div>
  );
}
