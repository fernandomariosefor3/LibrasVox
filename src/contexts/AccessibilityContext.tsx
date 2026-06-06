import { createContext, useContext, useState, useEffect, type ReactNode } from 'react';

type AccessibilityContextType = {
  highContrast: boolean;
  toggleHighContrast: () => void;
  dyslexicFont: boolean;
  toggleDyslexicFont: () => void;
  reducedMotion: boolean;
};

const AccessibilityContext = createContext<AccessibilityContextType | null>(null);

export function AccessibilityProvider({ children }: { children: ReactNode }) {
  const [highContrast, setHighContrast] = useState(
    () => localStorage.getItem('a11y_high_contrast') === 'true'
  );
  const [dyslexicFont, setDyslexicFont] = useState(
    () => localStorage.getItem('a11y_dyslexic_font') === 'true'
  );
  const [reducedMotion, setReducedMotion] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    setReducedMotion(mq.matches);
    const handler = (e: MediaQueryListEvent) => setReducedMotion(e.matches);
    mq.addEventListener('change', handler);
    return () => mq.removeEventListener('change', handler);
  }, []);

  useEffect(() => {
    localStorage.setItem('a11y_high_contrast', String(highContrast));
    document.documentElement.classList.toggle('high-contrast', highContrast);
  }, [highContrast]);

  useEffect(() => {
    localStorage.setItem('a11y_dyslexic_font', String(dyslexicFont));
    document.documentElement.classList.toggle('font-dyslexic', dyslexicFont);
  }, [dyslexicFont]);

  useEffect(() => {
    document.documentElement.classList.toggle('motion-reduce', reducedMotion);
  }, [reducedMotion]);

  return (
    <AccessibilityContext.Provider
      value={{
        highContrast,
        toggleHighContrast: () => setHighContrast((v) => !v),
        dyslexicFont,
        toggleDyslexicFont: () => setDyslexicFont((v) => !v),
        reducedMotion,
      }}
    >
      {children}
    </AccessibilityContext.Provider>
  );
}

export function useAccessibility() {
  const ctx = useContext(AccessibilityContext);
  if (!ctx) throw new Error('useAccessibility must be used within AccessibilityProvider');
  return ctx;
}
