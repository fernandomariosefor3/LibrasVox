import { useState, useEffect, useCallback } from 'react';

export interface SRSCard {
  signId: string;
  word: string;
  category: string;
  emoji: string;
  description: string;
  steps: string[];
  videoThumbnail?: string;
  level: number;
  nextReview: number;
  totalReviews: number;
  correctCount: number;
  streak: number;
  addedAt: number;
  lastReviewed: number | null;
}

export interface SRSStats {
  totalCards: number;
  newCards: number;
  dueNow: number;
  mastered: number;
  streak: number;
  longestStreak: number;
  lastStudyDate: string | null;
  totalReviewsAll: number;
}

const SRS_STORAGE_KEY = 'librasvox_srs_cards';
const SRS_STATS_KEY = 'librasvox_srs_stats';

// SM-2 inspired intervals in minutes (for demo, intervals are shorter)
const INTERVALS = [1, 10, 60, 480, 1440, 4320, 10080, 20160]; // 1min, 10min, 1h, 8h, 1d, 3d, 7d, 14d

function getTodayStr(): string {
  return new Date().toISOString().split('T')[0];
}

function loadCards(): Record<string, SRSCard> {
  try {
    const raw = localStorage.getItem(SRS_STORAGE_KEY);
    if (!raw) return {};
    return JSON.parse(raw);
  } catch {
    return {};
  }
}

function saveCards(cards: Record<string, SRSCard>): void {
  localStorage.setItem(SRS_STORAGE_KEY, JSON.stringify(cards));
}

function loadStats(): SRSStats {
  try {
    const raw = localStorage.getItem(SRS_STATS_KEY);
    if (!raw) {
      return {
        totalCards: 0,
        newCards: 0,
        dueNow: 0,
        mastered: 0,
        streak: 0,
        longestStreak: 0,
        lastStudyDate: null,
        totalReviewsAll: 0,
      };
    }
    return JSON.parse(raw);
  } catch {
    return {
      totalCards: 0,
      newCards: 0,
      dueNow: 0,
      mastered: 0,
      streak: 0,
      longestStreak: 0,
      lastStudyDate: null,
      totalReviewsAll: 0,
    };
  }
}

function saveStats(stats: SRSStats): void {
  localStorage.setItem(SRS_STATS_KEY, JSON.stringify(stats));
}

function updateStreak(stats: SRSStats): SRSStats {
  const today = getTodayStr();
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  const yesterdayStr = yesterday.toISOString().split('T')[0];

  if (stats.lastStudyDate === today) {
    return stats;
  }

  if (stats.lastStudyDate === yesterdayStr) {
    const newStreak = stats.streak + 1;
    return {
      ...stats,
      streak: newStreak,
      longestStreak: Math.max(newStreak, stats.longestStreak),
      lastStudyDate: today,
    };
  }

  return {
    ...stats,
    streak: 1,
    longestStreak: Math.max(1, stats.longestStreak),
    lastStudyDate: today,
  };
}

export function useSRS() {
  const [cards, setCards] = useState<Record<string, SRSCard>>(loadCards);
  const [stats, setStats] = useState<SRSStats>(loadStats);

  const refresh = useCallback(() => {
    setCards(loadCards());
    setStats(loadStats());
  }, []);

  useEffect(() => {
    saveCards(cards);
  }, [cards]);

  useEffect(() => {
    saveStats(stats);
  }, [stats]);

  const addCard = useCallback(
    (sign: {
      id: string;
      word: string;
      category: string;
      emoji: string;
      description: string;
      steps: string[];
      videoThumbnail?: string;
    }) => {
      if (cards[sign.id]) return false;

      const now = Date.now();
      const newCard: SRSCard = {
        signId: sign.id,
        word: sign.word,
        category: sign.category,
        emoji: sign.emoji,
        description: sign.description,
        steps: sign.steps,
        videoThumbnail: sign.videoThumbnail,
        level: 0,
        nextReview: now,
        totalReviews: 0,
        correctCount: 0,
        streak: 0,
        addedAt: now,
        lastReviewed: null,
      };

      setCards((prev) => {
        const updated = { ...prev, [sign.id]: newCard };
        return updated;
      });

      setStats((prev) => ({
        ...prev,
        totalCards: Object.keys(cards).length + 1,
        newCards: (prev.newCards || 0) + 1,
      }));

      return true;
    },
    [cards]
  );

  const addMultipleCards = useCallback(
    (signs: Array<{
      id: string;
      word: string;
      category: string;
      emoji: string;
      description: string;
      steps: string[];
      videoThumbnail?: string;
    }>) => {
      let added = 0;
      const now = Date.now();

      setCards((prev) => {
        const updated = { ...prev };
        for (const sign of signs) {
          if (updated[sign.id]) continue;
          updated[sign.id] = {
            signId: sign.id,
            word: sign.word,
            category: sign.category,
            emoji: sign.emoji,
            description: sign.description,
            steps: sign.steps,
            videoThumbnail: sign.videoThumbnail,
            level: 0,
            nextReview: now,
            totalReviews: 0,
            correctCount: 0,
            streak: 0,
            addedAt: now,
            lastReviewed: null,
          };
          added++;
        }
        return updated;
      });

      if (added > 0) {
        setStats((prev) => ({
          ...prev,
          totalCards: Object.keys(cards).length + added,
          newCards: (prev.newCards || 0) + added,
        }));
      }

      return added;
    },
    [cards]
  );

  const removeCard = useCallback((signId: string) => {
    setCards((prev) => {
      const updated = { ...prev };
      delete updated[signId];
      return updated;
    });

    setStats((prev) => ({
      ...prev,
      totalCards: Math.max(0, prev.totalCards - 1),
    }));
  }, []);

  const reviewCard = useCallback(
    (signId: string, correct: boolean) => {
      const now = Date.now();

      setCards((prev) => {
        const card = prev[signId];
        if (!card) return prev;

        let newLevel = card.level;
        let newStreak = card.streak;
        let newCorrectCount = card.correctCount;

        if (correct) {
          newLevel = Math.min(card.level + 1, INTERVALS.length - 1);
          newStreak = card.streak + 1;
          newCorrectCount = card.correctCount + 1;
        } else {
          newLevel = 0;
          newStreak = 0;
        }

        const interval = INTERVALS[newLevel] || INTERVALS[INTERVALS.length - 1];
        const nextReview = now + interval * 60 * 1000;

        const updated: SRSCard = {
          ...card,
          level: newLevel,
          nextReview,
          totalReviews: card.totalReviews + 1,
          correctCount: newCorrectCount,
          streak: newStreak,
          lastReviewed: now,
        };

        return { ...prev, [signId]: updated };
      });

      setStats((prev) => updateStreak(prev));
    },
    []
  );

  const getDueCards = useCallback((): SRSCard[] => {
    const now = Date.now();
    const all = Object.values(cards);
    const due = all.filter((c) => c.nextReview <= now);
    // Sort: new cards first (level 0), then by oldest review
    return due.sort((a, b) => {
      if (a.level === 0 && b.level !== 0) return -1;
      if (b.level === 0 && a.level !== 0) return 1;
      return a.nextReview - b.nextReview;
    });
  }, [cards]);

  const getCardById = useCallback(
    (signId: string): SRSCard | undefined => {
      return cards[signId];
    },
    [cards]
  );

  const computeStats = useCallback((): SRSStats => {
    const all = Object.values(cards);
    const now = Date.now();
    const dueNow = all.filter((c) => c.nextReview <= now).length;
    const newCards = all.filter((c) => c.totalReviews === 0).length;
    const mastered = all.filter((c) => c.level >= 5).length;

    return {
      totalCards: all.length,
      newCards,
      dueNow,
      mastered,
      streak: stats.streak,
      longestStreak: stats.longestStreak,
      lastStudyDate: stats.lastStudyDate,
      totalReviewsAll: all.reduce((sum, c) => sum + c.totalReviews, 0),
    };
  }, [cards, stats]);

  const resetAll = useCallback(() => {
    localStorage.removeItem(SRS_STORAGE_KEY);
    localStorage.removeItem(SRS_STATS_KEY);
    setCards({});
    setStats({
      totalCards: 0,
      newCards: 0,
      dueNow: 0,
      mastered: 0,
      streak: 0,
      longestStreak: 0,
      lastStudyDate: null,
      totalReviewsAll: 0,
    });
  }, []);

  return {
    cards,
    stats: computeStats(),
    computeStats,
    addCard,
    addMultipleCards,
    removeCard,
    reviewCard,
    getDueCards,
    getCardById,
    resetAll,
    refresh,
  };
}