import React from 'react';
import type { WordMorpheme, MorphemeType } from '../data/mockData';

interface MorphemeSectionProps {
  readonly morphemes: WordMorpheme[];
  readonly composedMeaning?: string;
}

const MORPHEME_STYLES: Record<MorphemeType, { block: string; text: string }> = {
  prefix: {
    block: 'bg-blue-500/10 border border-blue-500/20',
    text: 'text-blue-500',
  },
  root: {
    block: 'bg-emerald-500/10 border border-emerald-500/20',
    text: 'text-emerald-500',
  },
  suffix: {
    block: 'bg-purple-500/10 border border-purple-500/20',
    text: 'text-purple-500',
  },
};

export const MorphemeSection: React.FC<MorphemeSectionProps> = ({
  morphemes,
  composedMeaning,
}) => {
  const sorted = [...morphemes].sort((a, b) => a.order - b.order);

  return (
    <div className="bg-white dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800 rounded-xl p-6">
      <h2 className="font-bold flex items-center gap-2 mb-8 text-slate-900 dark:text-slate-100">
        <span className="material-icons-outlined text-primary">account_tree</span>
        어원 분석
      </h2>

      {morphemes.length === 0 ? (
        <p className="text-sm text-slate-400 dark:text-slate-500 text-center py-6">
          어원 분석 준비 중입니다.
        </p>
      ) : (
        <>
          <div className="flex flex-col md:flex-row items-center justify-center gap-4 mb-10">
            {sorted.map((m, idx) => (
              <React.Fragment key={m.id}>
                {idx > 0 && (
                  <span className="material-icons-outlined text-slate-300 dark:text-slate-700 hidden md:block">
                    add
                  </span>
                )}
                <div
                  className={`flex-1 w-full text-center p-4 rounded-xl ${MORPHEME_STYLES[m.type].block}`}
                >
                  <div className={`font-bold text-xl mb-1 ${MORPHEME_STYLES[m.type].text}`}>
                    {m.morpheme}
                  </div>
                  <div className="text-sm text-slate-500 dark:text-slate-400">{m.meaning}</div>
                </div>
              </React.Fragment>
            ))}
          </div>

          {composedMeaning && (
            <div className="bg-slate-100 dark:bg-slate-800/50 rounded-lg p-4 flex items-center gap-3">
              <div className="w-1.5 h-1.5 rounded-full bg-primary flex-shrink-0" />
              <p className="text-sm text-slate-700 dark:text-slate-300">
                <span className="font-bold text-slate-900 dark:text-slate-100">합성 의미: </span>
                {composedMeaning}
              </p>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default MorphemeSection;
