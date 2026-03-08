import React from 'react';
import { useMyVocabulary } from '../hooks/useMyVocabulary';
import type { MyVocabularyItem, VocabularySource, SortOrder } from '../data/mockData';

interface MyVocabularyProps {
  readonly className?: string;
}

const SOURCE_BADGE: Record<VocabularySource, { label: string; style: string }> = {
  manual: {
    label: '직접 추가',
    style: 'bg-primary/10 text-primary',
  },
  wrong_answer: {
    label: '오답 자동',
    style: 'bg-orange-100 text-orange-600 dark:bg-orange-900/30 dark:text-orange-400',
  },
};

interface VocabCardProps {
  readonly item: MyVocabularyItem;
  readonly onDelete: (id: number) => void;
}

const VocabCard: React.FC<VocabCardProps> = ({ item, onDelete }) => {
  const badge = SOURCE_BADGE[item.source];
  return (
    <div
      className="relative group bg-white dark:bg-slate-800 p-6 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm hover:shadow-md transition-shadow cursor-pointer"
      onClick={() => { window.location.href = `/words/${item.wordId}`; }}
    >
      <button
        onClick={(e) => { e.stopPropagation(); onDelete(item.id); }}
        aria-label={`${item.word} 삭제`}
        className="absolute top-4 right-4 text-slate-300 hover:text-red-500 transition-colors"
      >
        <span className="material-symbols-outlined">close</span>
      </button>
      <div className="mb-4">
        <span className={`inline-block px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider rounded mb-2 ${badge.style}`}>
          {badge.label}
        </span>
        <h3 className="text-2xl font-bold text-slate-900 dark:text-white">{item.word}</h3>
        <p className="text-slate-600 dark:text-slate-400 mt-1">{item.koreanMeaning}</p>
      </div>
      <div className="text-[11px] text-slate-400 font-medium">{item.addedAt} 추가</div>
    </div>
  );
};

interface DeleteDialogProps {
  readonly onConfirm: () => void;
  readonly onCancel: () => void;
}

const DeleteDialog: React.FC<DeleteDialogProps> = ({ onConfirm, onCancel }) => (
  <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
    <div className="bg-white dark:bg-slate-900 rounded-2xl p-8 max-w-sm w-full mx-4 shadow-2xl border border-slate-200 dark:border-slate-800">
      <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">단어 삭제</h3>
      <p className="text-slate-500 dark:text-slate-400 mb-8">
        이 단어를 개인 단어장에서 삭제할까요?
      </p>
      <div className="flex gap-3">
        <button
          onClick={onCancel}
          className="flex-1 py-3 border-2 border-slate-200 dark:border-slate-700 font-semibold rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800 transition-all text-slate-700 dark:text-slate-300"
        >
          취소
        </button>
        <button
          onClick={onConfirm}
          className="flex-1 py-3 bg-red-500 hover:bg-red-600 text-white font-semibold rounded-xl transition-all"
        >
          삭제
        </button>
      </div>
    </div>
  </div>
);

export const MyVocabulary: React.FC<MyVocabularyProps> = ({ className = '' }) => {
  const {
    items,
    allItems,
    sourceFilter,
    sortOrder,
    pendingDeleteId,
    setSourceFilter,
    setSortOrder,
    requestDelete,
    cancelDelete,
    confirmDelete,
  } = useMyVocabulary();

  const manualCount = allItems.filter((i) => i.source === 'manual').length;
  const wrongCount = allItems.filter((i) => i.source === 'wrong_answer').length;
  const hasWords = allItems.length > 0;

  return (
    <main className={`max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 pb-32 ${className}`}>
      {/* Summary Header */}
      <div className="mb-8 flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h2 className="text-3xl font-black mb-2 text-slate-900 dark:text-white">내 단어장</h2>
          <div className="flex items-center gap-3">
            <span className="text-xl font-bold text-slate-900 dark:text-white">
              총 {allItems.length}개 단어
            </span>
            <div className="flex gap-2">
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold bg-primary/20 text-primary">
                직접 추가 {manualCount}개
              </span>
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold bg-orange-100 text-orange-600 dark:bg-orange-900/30 dark:text-orange-400">
                오답 자동 {wrongCount}개
              </span>
            </div>
          </div>
        </div>

        {/* Filter & Sort */}
        <div className="flex gap-3">
          <div className="relative">
            <select
              value={sourceFilter}
              onChange={(e) => setSourceFilter(e.target.value as VocabularySource | 'all')}
              className="appearance-none bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg pl-4 pr-10 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary cursor-pointer text-slate-700 dark:text-slate-300"
            >
              <option value="all">전체</option>
              <option value="manual">직접 추가</option>
              <option value="wrong_answer">오답 자동</option>
            </select>
            <span className="material-symbols-outlined absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
              expand_more
            </span>
          </div>
          <div className="relative">
            <select
              value={sortOrder}
              onChange={(e) => setSortOrder(e.target.value as SortOrder)}
              className="appearance-none bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg pl-4 pr-10 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary cursor-pointer text-slate-700 dark:text-slate-300"
            >
              <option value="latest">최신순</option>
              <option value="alphabetical">단어명순</option>
            </select>
            <span className="material-symbols-outlined absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
              swap_vert
            </span>
          </div>
        </div>
      </div>

      {/* Word Grid */}
      {allItems.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-24 text-center">
          <span className="material-symbols-outlined text-5xl text-slate-300 dark:text-slate-600 mb-4">
            bookmark
          </span>
          <p className="text-lg font-medium text-slate-600 dark:text-slate-400 mb-2">
            아직 저장된 단어가 없습니다
          </p>
          <a
            href="/"
            className="mt-4 px-6 py-2 bg-primary text-white font-medium rounded-lg hover:bg-primary/90 transition-all"
          >
            단어 둘러보기
          </a>
        </div>
      ) : items.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <p className="text-slate-500 dark:text-slate-400 mb-4">해당 조건의 단어가 없습니다</p>
          <button
            onClick={() => setSourceFilter('all')}
            className="px-4 py-2 bg-primary text-white text-sm font-medium rounded-lg hover:bg-primary/90 transition-all"
          >
            필터 초기화
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {items.map((item) => (
            <VocabCard key={item.id} item={item} onDelete={requestDelete} />
          ))}
        </div>
      )}

      {/* Study Buttons */}
      <div className="fixed bottom-0 left-0 right-0 md:relative md:bottom-auto md:left-auto md:right-auto mt-8 bg-white/90 dark:bg-slate-950/90 md:bg-transparent md:dark:bg-transparent backdrop-blur-md md:backdrop-blur-none border-t border-slate-200 dark:border-slate-800 md:border-none p-4 md:p-0 flex flex-col md:flex-row gap-3">
        <a
          href={hasWords ? '/drill' : undefined}
          aria-disabled={!hasWords}
          className={`flex-1 md:flex-none px-8 py-4 font-bold rounded-xl text-center transition-all flex items-center justify-center gap-2 ${
            hasWords
              ? 'bg-primary text-white hover:bg-primary/90 shadow-lg shadow-primary/20'
              : 'bg-slate-200 dark:bg-slate-800 text-slate-400 dark:text-slate-600 cursor-not-allowed pointer-events-none'
          }`}
        >
          <span className="material-symbols-outlined">edit_note</span>
          드릴 모드로 학습
        </a>
        <a
          href={hasWords ? '/flashcard' : undefined}
          aria-disabled={!hasWords}
          className={`flex-1 md:flex-none px-8 py-4 font-bold rounded-xl text-center transition-all flex items-center justify-center gap-2 ${
            hasWords
              ? 'border-2 border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300'
              : 'border-2 border-slate-200 dark:border-slate-800 text-slate-400 dark:text-slate-600 cursor-not-allowed pointer-events-none'
          }`}
        >
          <span className="material-symbols-outlined">style</span>
          플래시카드로 학습
        </a>
      </div>

      {/* Delete Confirmation Dialog */}
      {pendingDeleteId !== null && (
        <DeleteDialog onConfirm={confirmDelete} onCancel={cancelDelete} />
      )}
    </main>
  );
};

export default MyVocabulary;
