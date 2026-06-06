import { useState, useEffect, useCallback } from 'react';
import { useSRS } from '@/hooks/useSRS';
import { useBadges } from '@/hooks/useBadges';
import BadgeToast from './BadgeToast';
import { useXP } from '@/hooks/useXP';
import { XPToast } from '@/components/feature/XPToast';
import type { SRSCard } from '@/hooks/useSRS';

interface StudySessionProps {
  onComplete: () => void;
}

const LEVEL_LABELS = [
  'Novo',
  'Aprendendo',
  'Revisando',
  'Familiar',
  'Confiante',
  'Dominado',
  'Memorizado',
  'Sólido',
];

const LEVEL_COLORS = [
  'bg-slate-100 text-slate-600',
  'bg-amber-50 text-amber-700',
  'bg-orange-50 text-orange-700',
  'bg-emerald-50 text-emerald-700',
  'bg-teal-50 text-teal-700',
  'bg-cyan-50 text-cyan-700',
  'bg-sky-50 text-sky-700',
  'bg-indigo-50 text-indigo-700',
];

function formatInterval(level: number): string {
  const intervals = ['Agora', '10 min', '1 h', '8 h', '1 dia', '3 dias', '7 dias', '14 dias'];
  return intervals[level] || '14 dias';
}

export default function StudySession({ onComplete }: StudySessionProps) {
  const srs = useSRS();
  const badges = useBadges();
  const xp = useXP();
  const [dueCards, setDueCards] = useState<SRSCard[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [revealed, setRevealed] = useState(false);
  const [sessionStats, setSessionStats] = useState({ correct: 0, incorrect: 0, total: 0 });
  const [finished, setFinished] = useState(false);
  const [animating, setAnimating] = useState(false);
  const [newlyUnlocked, setNewlyUnlocked] = useState<string[]>([]);

  useEffect(() => {
    const due = srs.getDueCards();
    setDueCards(due);
    setCurrentIndex(0);
    setRevealed(false);
    setFinished(false);
    setSessionStats({ correct: 0, incorrect: 0, total: 0 });
    setNewlyUnlocked([]);
  }, [srs]);

  const currentCard = dueCards[currentIndex];

  const handleReveal = useCallback(() => {
    setRevealed(true);
  }, []);

  const checkBadgesAfterReview = useCallback(
    (correct: boolean) => {
      const newCorrect = sessionStats.correct + (correct ? 1 : 0);
      const newIncorrect = sessionStats.incorrect + (correct ? 0 : 1);
      const newTotal = sessionStats.total + 1;

      const allCards = Object.values(srs.cards);
      const totalCards = allCards.length;
      const mastered = allCards.filter((c) => c.level >= 5).length;
      const totalReviews = allCards.reduce((s, c) => s + c.totalReviews, 0) + 1;
      const streak = srs.stats.streak;

      const sessionResult = { total: newTotal, correct: newCorrect, incorrect: newIncorrect };

      const unlocked = badges.checkAndUnlock(totalCards, mastered, streak, totalReviews, sessionResult);

      if (unlocked.length > 0) {
        badges.showUnlock(unlocked[0]);
        setNewlyUnlocked((prev) => [...prev, ...unlocked.map((b) => b.id)]);
      }
    },
    [badges, srs.cards, srs.stats.streak, sessionStats]
  );

  const handleReview = useCallback(
    (correct: boolean) => {
      if (!currentCard) return;
      setAnimating(true);
      srs.reviewCard(currentCard.signId, correct);

      setSessionStats((prev) => ({
        ...prev,
        correct: prev.correct + (correct ? 1 : 0),
        incorrect: prev.incorrect + (correct ? 0 : 1),
        total: prev.total + 1,
      }));

      checkBadgesAfterReview(correct);
      if (correct) xp.awardXP('flashcard_correct');

      setTimeout(() => {
        setAnimating(false);
        setRevealed(false);
        if (currentIndex < dueCards.length - 1) {
          setCurrentIndex((prev) => prev + 1);
        } else {
          setFinished(true);
        }
      }, 300);
    },
    [currentCard, currentIndex, dueCards.length, srs, checkBadgesAfterReview]
  );

  if (dueCards.length === 0) {
    return (
      <div className="text-center py-20">
        <BadgeToast badge={badges.justUnlocked} onDismiss={badges.dismissUnlock} />
        <div className="w-20 h-20 mx-auto flex items-center justify-center bg-emerald-50 rounded-2xl mb-6">
          <i className="ri-check-double-line text-emerald-500 text-4xl"></i>
        </div>
        <h3 className="text-2xl font-bold text-slate-800 mb-3">Nenhum sinal para revisar agora</h3>
        <p className="text-slate-500 mb-6 max-w-md mx-auto">
          Parabéns! Você está em dia com as revisões. Volte mais tarde ou adicione novos sinais ao deck.
        </p>
        <div className="flex gap-3 justify-center">
          <button
            onClick={onComplete}
            className="px-5 py-2.5 bg-slate-800 text-white rounded-xl text-sm font-semibold hover:bg-slate-700 transition-colors cursor-pointer whitespace-nowrap"
          >
            <i className="ri-refresh-line mr-1.5"></i>
            Atualizar
          </button>
        </div>
      </div>
    );
  }

  if (finished) {
    const accuracy = sessionStats.total > 0
      ? Math.round((sessionStats.correct / sessionStats.total) * 100)
      : 0;
    return (
      <div className="text-center py-16">
        <BadgeToast badge={badges.justUnlocked} onDismiss={badges.dismissUnlock} />
        <XPToast gain={xp.recentGain} levelUp={xp.levelUpInfo} onDismissLevelUp={xp.dismissLevelUp} />
        <div className="w-20 h-20 mx-auto flex items-center justify-center bg-gradient-to-br from-emerald-100 to-teal-100 rounded-2xl mb-6">
          <i className="ri-trophy-line text-emerald-600 text-4xl"></i>
        </div>
        <h3 className="text-2xl font-bold text-slate-800 mb-2">Sessão concluída!</h3>
        <p className="text-slate-500 mb-8 max-w-md mx-auto">
          Você revisou {sessionStats.total} {sessionStats.total === 1 ? 'sinal' : 'sinais'} hoje.
        </p>

        {newlyUnlocked.length > 0 && (
          <div className="mb-6 max-w-md mx-auto">
            <p className="text-xs font-bold text-amber-700 uppercase tracking-wider mb-3">
              <i className="ri-trophy-line mr-1"></i>
              {newlyUnlocked.length === 1 ? 'Nova conquista desbloqueada!' : `${newlyUnlocked.length} novas conquistas!`}
            </p>
            <div className="flex gap-2 justify-center flex-wrap">
              {newlyUnlocked.map((id) => {
                const b = badges.badges.find((badge) => badge.id === id);
                if (!b) return null;
                return (
                  <div
                    key={id}
                    className={`flex items-center gap-2 px-3 py-2 rounded-xl border ${b.bgColor} ${b.borderColor}`}
                  >
                    <i className={`${b.icon} ${b.iconColor} text-sm`}></i>
                    <span className="text-xs font-bold">{b.name}</span>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        <div className="grid grid-cols-3 gap-4 max-w-md mx-auto mb-8">
          <div className="bg-slate-50 rounded-xl p-4 border border-slate-200">
            <p className="text-2xl font-bold text-emerald-600">{sessionStats.correct}</p>
            <p className="text-xs text-slate-500 font-medium mt-1">Acertos</p>
          </div>
          <div className="bg-slate-50 rounded-xl p-4 border border-slate-200">
            <p className="text-2xl font-bold text-rose-500">{sessionStats.incorrect}</p>
            <p className="text-xs text-slate-500 font-medium mt-1">Erros</p>
          </div>
          <div className="bg-slate-50 rounded-xl p-4 border border-slate-200">
            <p className="text-2xl font-bold text-slate-700">{accuracy}%</p>
            <p className="text-xs text-slate-500 font-medium mt-1">Precisão</p>
          </div>
        </div>

        <button
          onClick={onComplete}
          className="px-6 py-3 bg-gradient-to-r from-emerald-500 to-teal-500 text-white rounded-xl text-sm font-semibold hover:shadow-emerald-200 hover:shadow-lg transition-all cursor-pointer whitespace-nowrap"
        >
          <i className="ri-refresh-line mr-1.5"></i>
          Nova Sessão
        </button>
      </div>
    );
  }

  if (!currentCard) return null;

  const progress = ((currentIndex) / dueCards.length) * 100;

  return (
    <div>
      <BadgeToast badge={badges.justUnlocked} onDismiss={badges.dismissUnlock} />
      <XPToast gain={xp.recentGain} levelUp={xp.levelUpInfo} onDismissLevelUp={xp.dismissLevelUp} />

      {/* Progress bar */}
      <div className="mb-6">
        <div className="flex justify-between items-center mb-2">
          <span className="text-xs font-semibold text-slate-400">
            {currentIndex + 1} de {dueCards.length}
          </span>
          <span className="text-xs font-semibold text-slate-400">
            {Math.round(progress)}%
          </span>
        </div>
        <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-emerald-400 to-teal-400 rounded-full transition-all duration-500"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      {/* Card */}
      <div
        className={`transition-all duration-300 ${animating ? 'opacity-0 translate-x-8' : 'opacity-100 translate-x-0'}`}
      >
        <div className="max-w-2xl mx-auto">
          {/* Card front */}
          <div className="bg-white rounded-3xl border-2 border-slate-100 p-8 md:p-10 mb-6 min-h-[320px] flex flex-col items-center justify-center text-center">
            <div className="w-12 h-12 flex items-center justify-center bg-slate-100 rounded-xl mb-5">
              <i className="ri-question-mark text-slate-400 text-xl"></i>
            </div>
            <p className="text-sm font-semibold text-slate-400 uppercase tracking-widest mb-3">Qual é o sinal?</p>
            <h2 className="text-3xl md:text-4xl font-bold text-slate-800 mb-3">
              {currentCard.word}
            </h2>
            <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold ${LEVEL_COLORS[currentCard.level] || LEVEL_COLORS[0]}`}>
              <i className="ri-signal-tower-line"></i>
              {LEVEL_LABELS[currentCard.level] || 'Novo'}
            </span>
            {!revealed && (
              <button
                onClick={handleReveal}
                className="mt-8 px-6 py-3 bg-slate-800 text-white rounded-xl text-sm font-semibold hover:bg-slate-700 transition-colors cursor-pointer whitespace-nowrap flex items-center gap-2"
              >
                <i className="ri-eye-line"></i>
                Revelar Resposta
              </button>
            )}
          </div>

          {/* Card back */}
          {revealed && (
            <div className="bg-white rounded-3xl border-2 border-emerald-100 p-8 md:p-10 mb-6">
              <div className="flex items-start gap-5">
                {currentCard.videoThumbnail && (
                  <div className="w-24 h-24 md:w-32 md:h-32 rounded-2xl overflow-hidden flex-shrink-0 bg-slate-100">
                    <img
                      src={currentCard.videoThumbnail}
                      alt={currentCard.word}
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}
                <div className="flex-1 text-left">
                  <p className="text-sm font-semibold text-slate-400 uppercase tracking-widest mb-2">Sinal</p>
                  <h3 className="text-xl font-bold text-slate-800 mb-2">{currentCard.word}</h3>
                  <p className="text-sm text-slate-500 mb-3">{currentCard.description}</p>
                  <div className="space-y-1.5">
                    {currentCard.steps.map((step, i) => (
                      <div key={i} className="flex items-start gap-2">
                        <span className="w-5 h-5 flex items-center justify-center bg-emerald-100 text-emerald-700 text-xs font-bold rounded-full flex-shrink-0 mt-0.5">
                          {i + 1}
                        </span>
                        <p className="text-sm text-slate-600 leading-relaxed">{step}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Category & Interval */}
              <div className="flex items-center gap-3 mt-5 pt-5 border-t border-slate-100">
                <span className="text-xs px-3 py-1 rounded-full bg-slate-100 text-slate-600 font-medium">
                  {currentCard.category}
                </span>
                <span className="text-xs text-slate-400">
                  Próxima revisão: {formatInterval(currentCard.level)}
                </span>
              </div>
            </div>
          )}

          {/* Review buttons */}
          {revealed && (
            <div className="grid grid-cols-2 gap-3 max-w-lg mx-auto">
              <button
                onClick={() => handleReview(false)}
                className="px-5 py-3 bg-rose-50 text-rose-700 border-2 border-rose-200 rounded-xl text-sm font-semibold hover:bg-rose-100 transition-colors cursor-pointer whitespace-nowrap flex items-center justify-center gap-2"
              >
                <i className="ri-close-line"></i>
                Preciso Revisar
              </button>
              <button
                onClick={() => handleReview(true)}
                className="px-5 py-3 bg-emerald-50 text-emerald-700 border-2 border-emerald-200 rounded-xl text-sm font-semibold hover:bg-emerald-100 transition-colors cursor-pointer whitespace-nowrap flex items-center justify-center gap-2"
              >
                <i className="ri-check-line"></i>
                Acertei!
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}