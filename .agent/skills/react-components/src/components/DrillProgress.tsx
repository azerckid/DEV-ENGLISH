import React from 'react';

interface DrillProgressProps {
  readonly current: number;
  readonly total: number;
  readonly correctCount?: number;
  readonly wrongCount?: number;
}

export const DrillProgress: React.FC<DrillProgressProps> = ({
  current,
  total,
  correctCount,
  wrongCount,
}) => {
  const percent = total > 0 ? Math.round((current / total) * 100) : 0;

  return (
    <div className="w-full max-w-2xl mb-8">
      <div className="flex justify-between items-end mb-2">
        <div className="flex flex-col gap-1">
          {(correctCount !== undefined || wrongCount !== undefined) && (
            <div className="flex gap-3 mb-1">
              {correctCount !== undefined && (
                <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400 border border-emerald-100 dark:border-emerald-800/30">
                  <span className="material-symbols-outlined text-sm">check_circle</span>
                  <span className="text-sm font-bold">맞힘 {correctCount}개</span>
                </div>
              )}
              {wrongCount !== undefined && (
                <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-rose-50 dark:bg-rose-900/20 text-rose-600 dark:text-rose-400 border border-rose-100 dark:border-rose-800/30">
                  <span className="material-symbols-outlined text-sm">cancel</span>
                  <span className="text-sm font-bold">틀림 {wrongCount}개</span>
                </div>
              )}
            </div>
          )}
          <span className="text-2xl font-bold text-slate-900 dark:text-slate-100">
            {current}{' '}
            <span className="text-slate-400 text-lg font-normal">/ {total}</span>
          </span>
        </div>
        <span className="text-sm font-semibold text-primary">{percent}% Complete</span>
      </div>
      <div className="w-full h-3 bg-slate-200 dark:bg-slate-800 rounded-full overflow-hidden">
        <div
          className="h-full bg-primary rounded-full transition-all duration-500"
          style={{ width: `${percent}%` }}
        />
      </div>
    </div>
  );
};

export default DrillProgress;
