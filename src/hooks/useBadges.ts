import { useState, useEffect, useCallback } from 'react';

export interface Badge {
  id: string;
  name: string;
  description: string;
  icon: string;
  color: string;
  borderColor: string;
  bgColor: string;
  iconColor: string;
  locked: boolean;
  unlockedAt: string | null;
  category: 'streak' | 'cards' | 'session' | 'mastery';
}

const BADGES_KEY = 'librasvox_badges';
const BADGES_LAST_CHECK = 'librasvox_badges_last_check';

export const BADGE_DEFINITIONS: Omit<Badge, 'locked' | 'unlockedAt'>[] = [
  {
    id: 'first_card',
    name: 'Primeiro Sinal',
    description: 'Adicione seu primeiro sinal ao deck',
    icon: 'ri-star-smile-line',
    color: 'text-amber-700',
    borderColor: 'border-amber-200',
    bgColor: 'bg-amber-50',
    iconColor: 'text-amber-500',
    category: 'cards',
  },
  {
    id: 'ten_cards',
    name: 'Colecionador',
    description: 'Tenha 10 sinais no seu deck',
    icon: 'ri-stack-line',
    color: 'text-sky-700',
    borderColor: 'border-sky-200',
    bgColor: 'bg-sky-50',
    iconColor: 'text-sky-500',
    category: 'cards',
  },
  {
    id: 'fifty_cards',
    name: 'Deck Completo',
    description: 'Tenha 50 sinais no seu deck',
    icon: 'ri-archive-drawer-line',
    color: 'text-emerald-700',
    borderColor: 'border-emerald-200',
    bgColor: 'bg-emerald-50',
    iconColor: 'text-emerald-500',
    category: 'cards',
  },
  {
    id: 'first_session',
    name: 'Primeira Revisão',
    description: 'Complete sua primeira sessão de flashcards',
    icon: 'ri-flashlight-line',
    color: 'text-orange-700',
    borderColor: 'border-orange-200',
    bgColor: 'bg-orange-50',
    iconColor: 'text-orange-500',
    category: 'session',
  },
  {
    id: 'ten_reviews',
    name: 'Revisor Freqüente',
    description: 'Complete 10 revisões de sinais',
    icon: 'ri-loop-left-line',
    color: 'text-teal-700',
    borderColor: 'border-teal-200',
    bgColor: 'bg-teal-50',
    iconColor: 'text-teal-500',
    category: 'session',
  },
  {
    id: 'perfect_session',
    name: 'Sessão Perfeita',
    description: 'Acerte todos os sinais em uma sessão (mínimo 5)',
    icon: 'ri-medal-line',
    color: 'text-rose-700',
    borderColor: 'border-rose-200',
    bgColor: 'bg-rose-50',
    iconColor: 'text-rose-500',
    category: 'session',
  },
  {
    id: 'streak_3',
    name: 'Fogo Baixo',
    description: 'Mantenha um streak de 3 dias de estudo',
    icon: 'ri-fire-line',
    color: 'text-red-700',
    borderColor: 'border-red-200',
    bgColor: 'bg-red-50',
    iconColor: 'text-red-500',
    category: 'streak',
  },
  {
    id: 'streak_7',
    name: 'Semana de Ferro',
    description: 'Mantenha um streak de 7 dias de estudo',
    icon: 'ri-fire-fill',
    color: 'text-rose-700',
    borderColor: 'border-rose-200',
    bgColor: 'bg-rose-50',
    iconColor: 'text-rose-500',
    category: 'streak',
  },
  {
    id: 'streak_14',
    name: 'Duas Semanas Douradas',
    description: 'Mantenha um streak de 14 dias de estudo',
    icon: 'ri-fire-fill',
    color: 'text-amber-700',
    borderColor: 'border-amber-200',
    bgColor: 'bg-amber-50',
    iconColor: 'text-amber-500',
    category: 'streak',
  },
  {
    id: 'first_mastered',
    name: 'Primeiro Dominado',
    description: 'Domine seu primeiro sinal (nível 5+)',
    icon: 'ri-check-double-line',
    color: 'text-emerald-700',
    borderColor: 'border-emerald-200',
    bgColor: 'bg-emerald-50',
    iconColor: 'text-emerald-500',
    category: 'mastery',
  },
  {
    id: 'ten_mastered',
    name: 'Mestre dos Sinais',
    description: 'Domine 10 sinais (nível 5+)',
    icon: 'ri-trophy-line',
    color: 'text-cyan-700',
    borderColor: 'border-cyan-200',
    bgColor: 'bg-cyan-50',
    iconColor: 'text-cyan-500',
    category: 'mastery',
  },
  {
    id: 'twenty_five_mastered',
    name: 'Mestre Supremo',
    description: 'Domine 25 sinais (nível 5+)',
    icon: 'ri-vip-crown-line',
    color: 'text-purple-700',
    borderColor: 'border-purple-200',
    bgColor: 'bg-purple-50',
    iconColor: 'text-purple-500',
    category: 'mastery',
  },
  {
    id: 'accuracy_90',
    name: 'Precisão de Ouro',
    description: 'Alcance 90% de precisão em uma sessão (mínimo 10)',
    icon: 'ri-focus-3-line',
    color: 'text-yellow-700',
    borderColor: 'border-yellow-200',
    bgColor: 'bg-yellow-50',
    iconColor: 'text-yellow-500',
    category: 'session',
  },
  {
    id: 'night_owl',
    name: 'Coruja Noturna',
    description: 'Estude flashcards após as 20h',
    icon: 'ri-moon-line',
    color: 'text-indigo-700',
    borderColor: 'border-indigo-200',
    bgColor: 'bg-indigo-50',
    iconColor: 'text-indigo-500',
    category: 'session',
  },
];

function loadBadges(): Record<string, Badge> {
  try {
    const raw = localStorage.getItem(BADGES_KEY);
    if (!raw) return {};
    return JSON.parse(raw);
  } catch {
    return {};
  }
}

function saveBadges(badges: Record<string, Badge>): void {
  localStorage.setItem(BADGES_KEY, JSON.stringify(badges));
}

function loadLastCheck(): string | null {
  try {
    return localStorage.getItem(BADGES_LAST_CHECK);
  } catch {
    return null;
  }
}

function saveLastCheck(date: string): void {
  localStorage.setItem(BADGES_LAST_CHECK, date);
}

function getTodayStr(): string {
  return new Date().toISOString().split('T')[0];
}

function getNowHour(): number {
  return new Date().getHours();
}

export interface SessionResult {
  total: number;
  correct: number;
  incorrect: number;
}

function checkBadgeConditions(
  badgeId: string,
  totalCards: number,
  masteredCount: number,
  streak: number,
  totalReviews: number,
  session: SessionResult | null
): boolean {
  switch (badgeId) {
    case 'first_card':
      return totalCards >= 1;
    case 'ten_cards':
      return totalCards >= 10;
    case 'fifty_cards':
      return totalCards >= 50;
    case 'first_session':
      return totalReviews >= 1;
    case 'ten_reviews':
      return totalReviews >= 10;
    case 'perfect_session':
      return !!session && session.total >= 5 && session.incorrect === 0;
    case 'streak_3':
      return streak >= 3;
    case 'streak_7':
      return streak >= 7;
    case 'streak_14':
      return streak >= 14;
    case 'first_mastered':
      return masteredCount >= 1;
    case 'ten_mastered':
      return masteredCount >= 10;
    case 'twenty_five_mastered':
      return masteredCount >= 25;
    case 'accuracy_90':
      return !!session && session.total >= 10 && session.correct / session.total >= 0.9;
    case 'night_owl':
      return getNowHour() >= 20;
    default:
      return false;
  }
}

export function useBadges() {
  const [badges, setBadges] = useState<Record<string, Badge>>(loadBadges);
  const [justUnlocked, setJustUnlocked] = useState<Badge | null>(null);

  useEffect(() => {
    saveBadges(badges);
  }, [badges]);

  const checkAndUnlock = useCallback(
    (
      totalCards: number,
      masteredCount: number,
      streak: number,
      totalReviews: number,
      session: SessionResult | null
    ): Badge[] => {
      const newUnlocks: Badge[] = [];
      const nowStr = getTodayStr();
      const lastCheck = loadLastCheck();

      setBadges((prev) => {
        const updated = { ...prev };
        for (const def of BADGE_DEFINITIONS) {
          const existing = updated[def.id];
          if (existing && !existing.locked) continue;

          const meetsCondition = checkBadgeConditions(
            def.id,
            totalCards,
            masteredCount,
            streak,
            totalReviews,
            session
          );

          if (meetsCondition) {
            const unlocked: Badge = {
              ...def,
              locked: false,
              unlockedAt: nowStr,
            };
            updated[def.id] = unlocked;
            newUnlocks.push(unlocked);
          }
        }
        return updated;
      });

      if (lastCheck !== nowStr) {
        saveLastCheck(nowStr);
      }

      return newUnlocks;
    },
    []
  );

  const showUnlock = useCallback((badge: Badge) => {
    setJustUnlocked(badge);
  }, []);

  const dismissUnlock = useCallback(() => {
    setJustUnlocked(null);
  }, []);

  const getAllBadges = useCallback((): Badge[] => {
    return BADGE_DEFINITIONS.map((def) => {
      const saved = badges[def.id];
      if (saved) {
        return saved;
      }
      return { ...def, locked: true, unlockedAt: null };
    });
  }, [badges]);

  const getUnlockedCount = useCallback((): number => {
    return Object.values(badges).filter((b) => !b.locked).length;
  }, [badges]);

  const getProgress = useCallback((): { total: number; unlocked: number; percentage: number } => {
    const total = BADGE_DEFINITIONS.length;
    const unlocked = Object.values(badges).filter((b) => !b.locked).length;
    return { total, unlocked, percentage: Math.round((unlocked / total) * 100) };
  }, [badges]);

  const resetBadges = useCallback(() => {
    localStorage.removeItem(BADGES_KEY);
    localStorage.removeItem(BADGES_LAST_CHECK);
    setBadges({});
    setJustUnlocked(null);
  }, []);

  return {
    badges: getAllBadges(),
    justUnlocked,
    checkAndUnlock,
    showUnlock,
    dismissUnlock,
    getUnlockedCount,
    getProgress,
    resetBadges,
  };
}