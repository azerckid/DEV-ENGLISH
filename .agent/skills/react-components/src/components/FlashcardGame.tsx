import React from 'react';
import { DrillProgress } from './DrillProgress';
import { useFlashcard } from '../hooks/useFlashcard';

interface FlashcardGameProps {
  readonly className?: string;
}

export const FlashcardGame: React.FC<FlashcardGameProps> = ({ className = '' }) => {
  const {
    currentIndex,
    currentCard,
    totalCards,
    isFlipped,
    isFinished,
    correctCount,
    wrongCount,
    flip,
    markCorrect,
    markWrong,
    restart,
  } = useFlashcard();

  if (isFinished) {
    return (
      <main className={`flex flex-col items-center justify-center py-20 px-4 ${className}`}>
        <div className="w-full max-w-[640px] bg-white dark:bg-slate-900 rounded-xl shadow-xl border border-slate-200 dark:border-slate-800 p-12 text-center">
          <span className="material-symbols-outlined text-6xl text-primary mb-4 block">
            emoji_events
          </span>
          <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100 mb-2">완료!</h2>
          <p className="text-slate-500 dark:text-slate-400 mb-2">
            맞힘 {correctCount}개 / 틀림 {wrongCount}개
          </p>
          <p className="text-slate-400 mb-8 text-sm">
            정확도 {totalCards > 0 ? Math.round((correctCount / totalCards) * 100) : 0}%
          </p>
          <div className="flex flex-col md:flex-row gap-4 justify-center">
            <button
              onClick={restart}
              className="px-8 py-3 bg-primary text-white font-bold rounded-xl hover:bg-primary/90 transition-all"
            >
              다시 시작
            </button>
            <a
              href="/"
              className="px-8 py-3 border-2 border-slate-200 dark:border-slate-800 font-bold rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-all text-slate-700 dark:text-slate-300 text-center"
            >
              홈으로
            </a>
          </div>
        </div>
      </main>
    );
  }

  if (!currentCard) return null;

  const blankSentence = currentCard.exampleSentence.replace('___', '______');

  return (
    <main className={`flex flex-1 justify-center py-8 px-4 ${className}`}>
      <div className="layout-content-container flex flex-col max-w-[640px] flex-1 gap-8">
        <DrillProgress
          current={currentIndex + 1}
          total={totalCards}
          correctCount={correctCount}
          wrongCount={wrongCount}
        />

        {/* Flashcard */}
        <div
          className="group cursor-pointer"
          onClick={flip}
          role="button"
          tabIndex={0}
          onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && flip()}
          aria-label={isFlipped ? '앞면 보기' : '뒤집어서 정답 확인'}
        >
          <div className="relative bg-white dark:bg-slate-900 rounded-2xl shadow-xl border border-slate-200 dark:border-slate-800 p-10 min-h-[360px] flex flex-col items-center justify-between text-center transition-transform hover:scale-[1.01] active:scale-[0.99]">
            {!isFlipped ? (
              <>
                <div className="w-full">
                  <div className="flex justify-center mb-6">
                    <div className="px-3 py-1 bg-primary/10 text-primary text-xs font-bold rounded-full border border-primary/20">
                      {currentCard.sourceName}
                    </div>
                  </div>
                  <h2 className="text-4xl md:text-5xl font-extrabold text-slate-900 dark:text-white mb-8 tracking-tight">
                    {currentCard.word}
                  </h2>
                  <div className="max-w-md mx-auto">
                    <p className="text-lg md:text-xl text-slate-600 dark:text-slate-400 leading-relaxed italic">
                      "{blankSentence}"
                    </p>
                  </div>
                </div>
                <div className="flex flex-col items-center gap-2 mt-8">
                  <span className="material-symbols-outlined text-slate-400 animate-bounce">
                    touch_app
                  </span>
                  <p className="text-slate-400 text-sm font-medium tracking-wide">
                    클릭하여 뒤집기
                  </p>
                </div>
              </>
            ) : (
              <>
                <div className="w-full">
                  <div className="flex justify-center mb-6">
                    <div className="px-3 py-1 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-xs font-bold rounded-full border border-emerald-500/20">
                      정답 확인
                    </div>
                  </div>
                  <h2 className="text-4xl md:text-5xl font-extrabold text-primary mb-4 tracking-tight">
                    {currentCard.word}
                  </h2>
                  <p className="text-2xl font-semibold text-slate-700 dark:text-slate-300 mb-6">
                    {currentCard.koreanMeaning}
                  </p>
                  <p className="text-base text-slate-500 dark:text-slate-400 leading-relaxed italic max-w-md mx-auto">
                    "{currentCard.exampleSentence}"
                  </p>
                </div>
              </>
            )}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col items-center gap-4">
          <div className="flex w-full gap-4">
            <button
              onClick={markCorrect}
              disabled={!isFlipped}
              className="flex-1 flex items-center justify-center gap-2 h-14 rounded-xl font-bold text-lg transition-all disabled:bg-slate-200 disabled:dark:bg-slate-800 disabled:text-slate-400 disabled:dark:text-slate-600 disabled:cursor-not-allowed enabled:bg-emerald-500 enabled:hover:bg-emerald-600 enabled:text-white enabled:shadow-lg enabled:shadow-emerald-500/20"
            >
              <span className="material-symbols-outlined">check</span>
              맞힘
            </button>
            <button
              onClick={markWrong}
              disabled={!isFlipped}
              className="flex-1 flex items-center justify-center gap-2 h-14 rounded-xl font-bold text-lg transition-all disabled:bg-slate-200 disabled:dark:bg-slate-800 disabled:text-slate-400 disabled:dark:text-slate-600 disabled:cursor-not-allowed enabled:bg-rose-500 enabled:hover:bg-rose-600 enabled:text-white enabled:shadow-lg enabled:shadow-rose-500/20"
            >
              <span className="material-symbols-outlined">close</span>
              틀림
            </button>
          </div>
          {!isFlipped && (
            <div className="flex items-center gap-2 px-4 py-2 bg-slate-100 dark:bg-slate-800/50 rounded-full">
              <span className="material-symbols-outlined text-sm text-slate-500">info</span>
              <p className="text-slate-500 dark:text-slate-400 text-sm font-medium">
                카드를 먼저 뒤집어 주세요
              </p>
            </div>
          )}
        </div>
      </div>
    </main>
  );
};

export default FlashcardGame;
