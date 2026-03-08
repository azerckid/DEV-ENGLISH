import React, { useRef, useEffect } from 'react';
import { DrillProgress } from './DrillProgress';
import { useDrillDictation } from '../hooks/useDrillDictation';

interface DrillDictationProps {
  readonly className?: string;
}

export const DrillDictation: React.FC<DrillDictationProps> = ({ className = '' }) => {
  const {
    currentIndex,
    currentItem,
    totalItems,
    answer,
    answerState,
    isFinished,
    correctCount,
    wrongCount,
    setAnswer,
    speakWord,
    submit,
    next,
    restart,
  } = useDrillDictation();

  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (answerState === 'unanswered') textareaRef.current?.focus();
  }, [answerState, currentIndex]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      if (answerState === 'unanswered') submit();
      else next();
    }
  };

  if (isFinished) {
    return (
      <main className={`flex flex-col items-center pt-12 pb-20 px-4 ${className}`}>
        <div className="w-full max-w-2xl bg-white dark:bg-slate-900 rounded-xl shadow-xl border border-slate-200 dark:border-slate-800 p-12 text-center">
          <span className="material-symbols-outlined text-6xl text-primary mb-4 block">
            emoji_events
          </span>
          <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100 mb-2">
            받아쓰기 완료!
          </h2>
          <p className="text-slate-500 dark:text-slate-400 mb-8">
            정답 {correctCount}개 / 오답 {wrongCount}개
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

  if (!currentItem) return null;

  return (
    <main className={`flex flex-1 flex-col items-center pt-8 pb-20 px-4 md:px-0 ${className}`}>
      <div className="w-full max-w-[800px] flex flex-col gap-8">
        <DrillProgress current={currentIndex + 1} total={totalItems} />

        <div className="bg-white dark:bg-slate-900 rounded-xl shadow-xl shadow-primary/5 border border-slate-200 dark:border-slate-800 p-8 md:p-12 flex flex-col items-center gap-10">
          <div className="text-center">
            <h1 className="text-slate-900 dark:text-white text-3xl font-extrabold tracking-tight">
              받아쓰기
            </h1>
            <p className="text-slate-500 dark:text-slate-400 mt-2">
              Listen to the pronunciation and type what you hear.
            </p>
          </div>

          {/* TTS Button */}
          <div className="flex flex-col items-center gap-4">
            <button
              onClick={speakWord}
              aria-label="발음 듣기"
              className="group flex h-24 w-24 items-center justify-center rounded-full bg-primary text-white shadow-lg shadow-primary/30 hover:bg-primary/90 transition-all active:scale-95"
            >
              <span className="material-symbols-outlined text-4xl">volume_up</span>
            </button>
            <span className="text-sm font-bold text-primary uppercase tracking-widest">
              발음 듣기
            </span>
          </div>

          {/* Input */}
          <div className="w-full max-w-lg space-y-6">
            <div className="relative">
              <textarea
                ref={textareaRef}
                value={answer}
                onChange={(e) => setAnswer(e.target.value)}
                onKeyDown={handleKeyDown}
                readOnly={answerState !== 'unanswered'}
                placeholder="들은 단어를 입력하세요..."
                className={`block w-full min-h-[140px] px-6 py-5 text-xl font-medium text-slate-900 dark:text-white bg-slate-50 dark:bg-slate-800/50 border-2 rounded-xl focus:ring-4 focus:ring-primary/20 focus:border-primary transition-all resize-none placeholder:text-slate-400 dark:placeholder:text-slate-600 ${
                  answerState === 'correct'
                    ? 'border-emerald-500'
                    : answerState === 'incorrect'
                    ? 'border-rose-500'
                    : 'border-slate-200 dark:border-slate-700'
                }`}
              />
              <div className="absolute bottom-4 right-4 text-slate-400 dark:text-slate-600">
                <span className="material-symbols-outlined">keyboard</span>
              </div>
            </div>

            {answerState === 'unanswered' ? (
              <button
                onClick={submit}
                className="w-full py-4 px-8 bg-primary hover:bg-primary/90 text-white text-lg font-bold rounded-xl shadow-lg shadow-primary/20 transition-all flex items-center justify-center gap-2"
              >
                <span>확인</span>
                <span className="material-symbols-outlined">check_circle</span>
              </button>
            ) : (
              <div
                className={`p-6 rounded-xl border ${
                  answerState === 'correct'
                    ? 'bg-emerald-50 dark:bg-emerald-900/20 border-emerald-100 dark:border-emerald-800'
                    : 'bg-rose-50 dark:bg-rose-900/20 border-rose-100 dark:border-rose-800'
                }`}
              >
                <p
                  className={`font-bold text-lg mb-1 ${
                    answerState === 'correct'
                      ? 'text-emerald-700 dark:text-emerald-400'
                      : 'text-rose-700 dark:text-rose-400'
                  }`}
                >
                  {answerState === 'correct' ? '정답입니다!' : '오답입니다.'}
                </p>
                <p className="text-sm text-slate-600 dark:text-slate-400 mb-4">
                  정답:{' '}
                  <span className="font-mono font-bold">{currentItem.answer}</span>
                </p>
                <button
                  onClick={next}
                  className="w-full py-3 bg-primary text-white font-bold rounded-lg hover:bg-primary/90 transition-all"
                >
                  다음 단어
                </button>
              </div>
            )}

            <div className="flex items-center gap-2 text-slate-400 dark:text-slate-500 text-sm">
              <span className="material-symbols-outlined text-base">info</span>
              <p>
                Press{' '}
                <kbd className="px-2 py-0.5 bg-slate-100 dark:bg-slate-800 rounded border border-slate-300 dark:border-slate-700 font-mono text-xs">
                  Enter
                </kbd>{' '}
                to submit
              </p>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
};

export default DrillDictation;
