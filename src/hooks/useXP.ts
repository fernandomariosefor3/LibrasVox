import { useState, useEffect, useCallback } from 'react';

const XP_KEY = 'librasvox_xp_total';
const XP_HISTORY_KEY = 'librasvox_xp_history';

export type XPReason =
  | 'exercise_correct'
  | 'exercise_session'
  | 'flashcard_correct'
  | 'sign_learned'
  | 'module_completed'
  | 'streak_bonus'
  | 'daily_login';

export const XP_REWARDS: Record<XPReason, number> = {
  exercise_correct: 15,
  exercise_session: 25,
  flashcard_correct: 10,
  sign_learned: 20,
  module_completed: 100,
  streak_bonus: 50,
  daily_login: 10,
};

export const XP_REASON_LABELS: Record<XPReason, string> = {
  exercise_correct: 'Exercício correto',
  exercise_session: 'Sessão de exercícios',
  flashcard_correct: 'Flashcard correto',
  sign_learned: 'Sinal aprendido',
  module_completed: 'Módulo concluído',
  streak_bonus: 'Bônus de streak',
  daily_login: 'Acesso diário',
};

export interface XPLevel {
  level: number;
  name: string;
  icon: string;
  minXP: number;
  maxXP: number | null;
  color: string;
  bgColor: string;
}

export const XP_LEVELS: XPLevel[] = [
  { level: 1, name: 'Curioso', icon: 'ri-seedling-line', minXP: 0, maxXP: 99, color: 'text-emerald-600', bgColor: 'bg-emerald-50' },
  { level: 2, name: 'Aprendiz', icon: 'ri-book-open-line', minXP: 100, maxXP: 299, color: 'text-sky-600', bgColor: 'bg-sky-50' },
  { level: 3, name: 'Estudante', icon: 'ri-pencil-line', minXP: 300, maxXP: 599, color: 'text-violet-600', bgColor: 'bg-violet-50' },
  { level: 4, name: 'Praticante', icon: 'ri-hand-heart-line', minXP: 600, maxXP: 999, color: 'text-teal-600', bgColor: 'bg-teal-50' },
  { level: 5, name: 'Comunicador', icon: 'ri-chat-smile-3-line', minXP: 1000, maxXP: 1499, color: 'text-amber-600', bgColor: 'bg-amber-50' },
  { level: 6, name: 'Avançado', icon: 'ri-star-line', minXP: 1500, maxXP: 2499, color: 'text-orange-600', bgColor: 'bg-orange-50' },
  { level: 7, name: 'Especialista', icon: 'ri-trophy-line', minXP: 2500, maxXP: 3999, color: 'text-rose-600', bgColor: 'bg-rose-50' },
  { level: 8, name: 'Mestre', icon: 'ri-vip-crown-line', minXP: 4000, maxXP: 5999, color: 'text-purple-600', bgColor: 'bg-purple-50' },
  { level: 9, name: 'Embaixador', icon: 'ri-medal-2-line', minXP: 6000, maxXP: null, color: 'text-yellow-600', bgColor: 'bg-yellow-50' },
];

export interface XPGain {
  amount: number;
  reason: XPReason;
  label: string;
  timestamp: number;
}

function loadXP(): number {
  try {
    return parseInt(localStorage.getItem(XP_KEY) || '0', 10);
  } catch {
    return 0;
  }
}

function saveXP(xp: number): void {
  localStorage.setItem(XP_KEY, String(xp));
}

function loadHistory(): XPGain[] {
  try {
    const raw = localStorage.getItem(XP_HISTORY_KEY);
    return raw ? (JSON.parse(raw) as XPGain[]) : [];
  } catch {
    return [];
  }
}

function saveHistory(history: XPGain[]): void {
  localStorage.setItem(XP_HISTORY_KEY, JSON.stringify(history.slice(-50)));
}

export function getLevelForXP(xp: number): XPLevel {
  for (let i = XP_LEVELS.length - 1; i >= 0; i--) {
    if (xp >= XP_LEVELS[i].minXP) return XP_LEVELS[i];
  }
  return XP_LEVELS[0];
}

export function getProgressToNext(xp: number): number {
  const current = getLevelForXP(xp);
  const next = XP_LEVELS.find((l) => l.level === current.level + 1);
  if (!next) return 100;
  const range = next.minXP - current.minXP;
  const gained = xp - current.minXP;
  return Math.min(100, Math.round((gained / range) * 100));
}

export function useXP() {
  const [totalXP, setTotalXP] = useState<number>(loadXP);
  const [recentGain, setRecentGain] = useState<XPGain | null>(null);
  const [levelUpInfo, setLevelUpInfo] = useState<XPLevel | null>(null);

  useEffect(() => {
    saveXP(totalXP);
  }, [totalXP]);

  const awardXP = useCallback((reason: XPReason, multiplier = 1) => {
    const amount = Math.round(XP_REWARDS[reason] * multiplier);
    const gain: XPGain = {
      amount,
      reason,
      label: XP_REASON_LABELS[reason],
      timestamp: Date.now(),
    };

    setTotalXP((prev) => {
      const prevLevel = getLevelForXP(prev);
      const newXP = prev + amount;
      const newLevel = getLevelForXP(newXP);
      if (newLevel.level > prevLevel.level) {
        setLevelUpInfo(newLevel);
      }
      const history = loadHistory();
      saveHistory([...history, gain]);
      return newXP;
    });

    setRecentGain(gain);
    setTimeout(() => setRecentGain(null), 3000);
  }, []);

  const dismissLevelUp = useCallback(() => {
    setLevelUpInfo(null);
  }, []);

  const currentLevel = getLevelForXP(totalXP);
  const nextLevel = XP_LEVELS.find((l) => l.level === currentLevel.level + 1) ?? null;
  const progressToNext = getProgressToNext(totalXP);
  const history = loadHistory();

  return {
    totalXP,
    currentLevel,
    nextLevel,
    progressToNext,
    recentGain,
    levelUpInfo,
    history,
    awardXP,
    dismissLevelUp,
  };
}
