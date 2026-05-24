import { useState, useCallback } from 'react';

const STORAGE_KEY = 'librasvox_learned';

const loadLearned = (): string[] => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as string[]) : [];
  } catch {
    return [];
  }
};

const saveLearned = (ids: string[]) => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(ids));
};

export function useLearnedSigns() {
  const [learned, setLearned] = useState<string[]>(loadLearned);

  const toggleLearned = useCallback((id: string) => {
    setLearned((prev) => {
      const next = prev.includes(id) ? prev.filter((l) => l !== id) : [...prev, id];
      saveLearned(next);
      return next;
    });
  }, []);

  const isLearned = useCallback((id: string) => learned.includes(id), [learned]);

  return { learned, toggleLearned, isLearned };
}
