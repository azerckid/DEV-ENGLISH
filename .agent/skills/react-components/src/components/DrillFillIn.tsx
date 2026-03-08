import React, { useRef, useEffect } from 'react';
import { DrillProgress } from './DrillProgress';
import { useDrillFillIn } from '../hooks/useDrillFillIn';

interface DrillFillInProps {
  readonly className?: string;
}

export const DrillFillIn: React.FC<DrillFillInProps> = ({ className = '' }) => {
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
    submit,
    next,
    restart,
  } = useDrillFillIn();

  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (answerState === 'unanswered') inputRef.current?.focus();
  }, [answerState, currentIndex]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
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
            드릴 완료!
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

  const sentenceParts = currentItem.sentence.split('___');

  return (
    <main className={`flex flex-1 flex-col items-center pt-8 pb-12 px-4 ${className}`}>
      <DrillProgress current={currentIndex + 1} total={totalItems} />

      <div className="w-full max-w-2xl bg-white dark:bg-slate-900 rounded-xl shadow-xl shadow-primary/5 border border-primary/10 overflow-hidden">
        <div className="p-8 md:p-12">
          <div className="flex items-center justify-between mb-8">
            <h1 className="text-xl font-bold text-slate-900 dark:text-white">빈칸 채우기</h1>
            <span className="px-3 py-1 bg-primary/5 text-primary text-xs font-bold rounded-full uppercase tracking-wider border border-primary/10">
              {currentItem.sourceName}
            </span>
          </div>

          {/* Sentence with blank */}
          <div className="mb-10 text-center">
            <p className="text-xl md:text-2xl leading-relaxed text-slate-800 dark:text-slate-200 font-medium">
              {sentenceParts[0]}
              <span className="inline-block w-32 border-b-2 border-primary mx-1" />
              {sentenceParts[1]}
            </p>
          </div>

          {/* Input + Submit */}
          <div className="space-y-4">
            <div className="relative">
              <input
                ref={inputRef}
                type="text"
                value={answer}
                onChange={(e) => setAnswer(e.target.value)}
                onKeyDown={handleKeyDown}
                readOnly={answerState !== 'unanswered'}
                placeholder="정답을 입력하세요..."
                className={`w-full px-6 py-4 bg-slate-50 dark:bg-slate-800 border-2 text-lg rounded-xl focus:ring-0 focus:outline-none dark:text-white transition-all ${
                  answerState === 'correct'
                    ? 'border-emerald-500'
                    : answerState === 'incorrect'
                    ? 'border-rose-500'
                    : 'border-primary'
                }`}
              />
              {answerState === 'correct' && (
                <div className="absolute right-4 top-1/2 -translate-y-1/2 text-emerald-500">
                  <span className="material-symbols-outlined text-2xl">check_circle</span>
                </div>
              )}
              {answerState === 'incorrect' && (
                <div className="absolute right-4 top-1/2 -translate-y-1/2 text-rose-500">
                  <span className="material-symbols-outlined text-2xl">cancel</span>
                </div>
              )}
            </div>

            {answerState === 'unanswered' && (
              <button
                onClick={submit}
                className="w-full bg-primary hover:bg-primary/90 text-white font-bold py-4 rounded-xl transition-all shadow-lg shadow-primary/20 flex items-center justify-center gap-2"
              >
                확인{' '}
                <span className="material-symbols-outlined">keyboard_return</span>
              </button>
            )}

            <p className="text-center text-sm text-slate-400 dark:text-slate-500 pt-2">
              Enter 키로 제출
            </p>
          </div>
        </div>

        {/* Result Banner */}
        {answerState !== 'unanswered' && (
          <div
            className={`border-t p-6 md:p-8 ${
              answerState === 'correct'
                ? 'bg-emerald-50 dark:bg-emerald-900/20 border-emerald-100 dark:border-emerald-800'
                : 'bg-rose-50 dark:bg-rose-900/20 border-rose-100 dark:border-rose-800'
            }`}
          >
            <div className="flex flex-col md:flex-row items-center justify-between gap-6">
              <div className="flex items-center gap-4">
                <div
                  className={`size-12 rounded-full text-white flex items-center justify-center ${
                    answerState === 'correct' ? 'bg-emerald-500' : 'bg-rose-500'
                  }`}
                >
                  <span className="material-symbols-outlined text-2xl">
                    {answerState === 'correct' ? 'check' : 'close'}
                  </span>
                </div>
                <div>
                  <h3
                    className={`font-bold text-lg ${
                      answerState === 'correct'
                        ? 'text-emerald-700 dark:text-emerald-400'
                        : 'text-rose-700 dark:text-rose-400'
                    }`}
                  >
                    {answerState === 'correct' ? '정답입니다!' : '오답입니다.'}
                  </h3>
                  <p
                    className={`text-sm font-medium ${
                      answerState === 'correct'
                        ? 'text-emerald-600/80 dark:text-emerald-500'
                        : 'text-rose-600/80 dark:text-rose-500'
                    }`}
                  >
                    정답:{' '}
                    <span
                      className={`font-mono px-2 py-0.5 rounded ${
                        answerState === 'correct'
                          ? 'bg-emerald-100 dark:bg-emerald-800/50'
                          : 'bg-rose-100 dark:bg-rose-800/50'
                      }`}
                    >
                      {currentItem.answer}
                    </span>
                  </p>
                </div>
              </div>
              <button
                onClick={next}
                className="w-full md:w-auto px-8 py-3 bg-primary text-white font-bold rounded-lg hover:scale-[1.02] active:scale-[0.98] transition-transform flex items-center justify-center gap-2 group"
              >
                다음 단어{' '}
                <span className="material-symbols-outlined group-hover:translate-x-1 transition-transform">
                  arrow_forward
                </span>
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Hint */}
      {currentItem.hint && answerState === 'unanswered' && (
        <div className="mt-8 flex items-center gap-2 text-slate-400 dark:text-slate-600">
          <span className="material-symbols-outlined text-sm">info</span>
          <p className="text-xs">Hint: {currentItem.hint}</p>
        </div>
      )}
    </main>
  );
};

export default DrillFillIn;
