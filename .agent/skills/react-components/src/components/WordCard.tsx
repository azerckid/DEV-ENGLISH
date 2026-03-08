import React from 'react';
import type { Word } from '../data/mockData';

interface WordCardProps {
  readonly word: Word;
  readonly onClick?: (id: number) => void;
}

const STATUS_STYLES: Record<'verified' | 'unreviewed', string> = {
  verified:
    'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400',
  unreviewed:
    'bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400',
};

const STATUS_LABEL: Record<'verified' | 'unreviewed', string> = {
  verified: '검증됨',
  unreviewed: '미검수',
};

export const WordCard: React.FC<WordCardProps> = ({ word, onClick }) => {
  const handleClick = () => onClick?.(word.id);
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') handleClick();
  };

  return (
    <div
      role="button"
      tabIndex={0}
      onClick={handleClick}
      onKeyDown={handleKeyDown}
      className="group bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-6 hover:shadow-xl hover:shadow-primary/5 hover:border-primary/30 transition-all cursor-pointer"
    >
      <div className="flex justify-between items-start mb-4">
        <h3 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-100">
          {word.word}
        </h3>
        <span
          className={`px-2 py-1 rounded text-[10px] font-bold uppercase tracking-wider ${STATUS_STYLES[word.status]}`}
        >
          {STATUS_LABEL[word.status]}
        </span>
      </div>

      <p className="text-sm text-slate-500 dark:text-slate-400 mb-2 italic">
        {word.partOfSpeech} · {word.pronunciation}
      </p>

      <p className="text-lg font-medium text-slate-800 dark:text-slate-200 mb-6 leading-snug">
        {word.koreanMeaning}
      </p>

      <div className="flex items-center gap-2 flex-wrap">
        {word.sources.map((source) => (
          <span
            key={source}
            className="px-2.5 py-1 rounded-full border border-slate-200 dark:border-slate-700 text-[11px] font-medium text-slate-500 dark:text-slate-400"
          >
            {source}
          </span>
        ))}
      </div>
    </div>
  );
};

export default WordCard;
