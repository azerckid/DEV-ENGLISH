import React from 'react';
import { MorphemeSection } from './MorphemeSection';
import { wordDetails } from '../data/mockData';

interface WordDetailProps {
  readonly wordId: number;
}

const STATUS_LABEL: Record<string, string> = {
  verified: '검증됨',
  unreviewed: '미검수',
};

const STATUS_STYLES: Record<string, string> = {
  verified: 'bg-emerald-500/10 text-emerald-500',
  unreviewed: 'bg-amber-500/10 text-amber-500',
};

export const WordDetail: React.FC<WordDetailProps> = ({ wordId }) => {
  const word = wordDetails.find((w) => w.id === wordId) ?? wordDetails[0];

  const handleAddToVocabulary = () => {
    // Placeholder: calls POST /api/my-vocabulary with source: 'manual'
  };

  return (
    <main className="max-w-5xl mx-auto px-4 py-8">
      {/* Back Button */}
      <a
        href="/"
        className="inline-flex items-center gap-2 text-slate-500 hover:text-primary transition-colors mb-8 group"
      >
        <span className="material-icons-outlined text-lg group-hover:-translate-x-1 transition-transform">
          arrow_back
        </span>
        <span className="text-sm font-medium">단어장으로</span>
      </a>

      {/* Word Header */}
      <section className="mb-12">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <span className="px-2 py-0.5 bg-primary/10 text-primary text-xs font-bold rounded uppercase tracking-wider">
                {word.partOfSpeech}
              </span>
              <div
                className={`flex items-center gap-1 px-2 py-0.5 text-xs font-bold rounded ${STATUS_STYLES[word.status]}`}
              >
                <span className="material-icons-outlined text-xs">verified</span>
                <span>{STATUS_LABEL[word.status]}</span>
              </div>
            </div>
            <h1 className="text-5xl md:text-6xl font-bold mb-4 tracking-tight text-slate-900 dark:text-slate-100">
              {word.word}
            </h1>
            <div className="flex items-center gap-4 text-slate-500 dark:text-slate-400">
              <span className="text-lg font-mono">{word.pronunciation}</span>
              <button
                aria-label="발음 듣기"
                className="p-1.5 hover:bg-slate-200 dark:hover:bg-slate-800 rounded-full transition-colors"
                onClick={() => {
                  const utterance = new SpeechSynthesisUtterance(word.word);
                  utterance.lang = 'en-US';
                  window.speechSynthesis.speak(utterance);
                }}
              >
                <span className="material-icons-outlined text-xl">volume_up</span>
              </button>
            </div>
          </div>

          <div className="flex flex-col items-start md:items-end gap-4">
            <div className="text-2xl md:text-3xl font-semibold text-slate-900 dark:text-slate-100">
              {word.koreanMeaning}
            </div>
            <button
              onClick={handleAddToVocabulary}
              className="flex items-center gap-2 px-4 py-2 border-2 border-slate-200 dark:border-slate-800 hover:border-primary hover:text-primary rounded-xl font-medium transition-all group"
            >
              <span className="material-icons-outlined text-xl group-hover:scale-110 transition-transform">
                bookmark_border
              </span>
              내 단어장에 추가
            </button>
          </div>
        </div>
      </section>

      {/* Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left: Examples + Etymology */}
        <div className="lg:col-span-2 space-y-8">
          {/* Example Sentences */}
          {word.examples.map((ex) => (
            <div
              key={ex.id}
              className="bg-white dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden"
            >
              <div className="px-6 py-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
                <h2 className="font-bold flex items-center gap-2 text-slate-900 dark:text-slate-100">
                  <span className="material-icons-outlined text-primary">article</span>
                  실전 예문
                </h2>
                {ex.sourceUrl ? (
                  <a
                    href={ex.sourceUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1.5 text-xs font-medium text-slate-500 bg-slate-100 dark:bg-slate-800 px-2 py-1 rounded hover:text-primary transition-colors"
                  >
                    <span>{ex.sourceName}</span>
                    <span className="material-icons-outlined text-[10px]">open_in_new</span>
                  </a>
                ) : (
                  <span className="flex items-center gap-1.5 text-xs font-medium text-slate-500 bg-slate-100 dark:bg-slate-800 px-2 py-1 rounded">
                    {ex.sourceName}
                  </span>
                )}
              </div>
              <div className="p-8">
                <p
                  className="text-xl md:text-2xl leading-relaxed mb-6 text-slate-900 dark:text-slate-100 [&_mark]:text-primary [&_mark]:font-bold [&_mark]:underline [&_mark]:underline-offset-4 [&_mark]:bg-transparent"
                  dangerouslySetInnerHTML={{ __html: ex.sentence }}
                />
                <p className="text-slate-500 dark:text-slate-400 text-lg">{ex.translation}</p>
              </div>
            </div>
          ))}

          {/* Etymology */}
          <MorphemeSection
            morphemes={word.morphemes}
            composedMeaning="구조를 분리/해체하여 개별 요소로 만들다."
          />
        </div>

        {/* Right: Derivatives */}
        {word.derivatives.length > 0 && (
          <div className="space-y-6">
            <h2 className="font-bold flex items-center gap-2 px-2 text-slate-900 dark:text-slate-100">
              <span className="material-icons-outlined text-primary">hub</span>
              같은 어원의 개발 용어
            </h2>
            <div className="flex flex-col gap-3">
              {word.derivatives.map((d) => (
                <div
                  key={d.id}
                  className="p-4 bg-white dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800 rounded-xl hover:border-primary/50 transition-colors cursor-pointer group"
                >
                  <div className="flex justify-between items-start mb-1">
                    <span className="font-bold text-lg group-hover:text-primary transition-colors text-slate-900 dark:text-slate-100">
                      {d.derivativeWord}
                    </span>
                  </div>
                  <p className="text-sm text-slate-500 dark:text-slate-400">{d.derivativeMeaning}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Action Footer */}
      <div className="mt-16 pt-8 border-t border-slate-200 dark:border-slate-800">
        <div className="flex flex-col md:flex-row items-center gap-4">
          <a
            href="/drill/fill-in"
            className="w-full md:w-auto px-8 py-4 bg-primary hover:bg-primary/90 text-white font-bold rounded-xl shadow-lg shadow-primary/20 transition-all active:scale-95 flex items-center justify-center gap-2"
          >
            <span className="material-icons-outlined">edit_note</span>
            빈칸 채우기 연습
          </a>
          <a
            href="/drill/dictation"
            className="w-full md:w-auto px-8 py-4 border-2 border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800 font-bold rounded-xl transition-all flex items-center justify-center gap-2 text-slate-700 dark:text-slate-300"
          >
            <span className="material-icons-outlined">keyboard</span>
            받아쓰기 연습
          </a>
          <a
            href="/flashcard"
            className="w-full md:w-auto px-8 py-4 border-2 border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800 font-bold rounded-xl transition-all flex items-center justify-center gap-2 text-slate-700 dark:text-slate-300"
          >
            <span className="material-icons-outlined">style</span>
            플래시카드
          </a>
        </div>
      </div>
    </main>
  );
};

export default WordDetail;
