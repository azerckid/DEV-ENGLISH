import React from 'react';
import { WordCard } from './WordCard';
import { useVocabularyList } from '../hooks/useVocabularyList';
import { SOURCES, type WordStatus } from '../data/mockData';

interface VocabularyListProps {
  readonly className?: string;
}

const SkeletonCard: React.FC = () => (
  <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-6 animate-pulse">
    <div className="flex justify-between mb-4">
      <div className="h-8 w-40 bg-slate-200 dark:bg-slate-700 rounded" />
      <div className="h-6 w-14 bg-slate-200 dark:bg-slate-700 rounded" />
    </div>
    <div className="h-4 w-32 bg-slate-200 dark:bg-slate-700 rounded mb-2" />
    <div className="h-6 w-48 bg-slate-200 dark:bg-slate-700 rounded mb-6" />
    <div className="h-5 w-20 bg-slate-200 dark:bg-slate-700 rounded-full" />
  </div>
);

export const VocabularyList: React.FC<VocabularyListProps> = ({ className = '' }) => {
  const { filters, results, totalPages, setSearch, setSource, setStatus, setPage, resetFilters } =
    useVocabularyList();

  const isLoading = false;

  const handleWordClick = (id: number) => {
    window.location.href = `/words/${id}`;
  };

  return (
    <main className={`flex-1 w-full max-w-[1200px] mx-auto px-6 md:px-10 py-8 ${className}`}>
      {/* Hero / Search Section */}
      <div className="mb-10">
        <div className="mb-6">
          <h2 className="text-3xl font-extrabold tracking-tight mb-2 text-slate-900 dark:text-slate-100">
            Vocabulary Explorer
          </h2>
          <p className="text-slate-500 dark:text-slate-400">
            개발 실무에 바로 쓰이는 기술 용어와 영단어를 학습하세요.
          </p>
        </div>

        <div className="flex flex-col md:flex-row gap-4">
          {/* Search Input */}
          <div className="flex-1 relative group">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <span className="material-symbols-outlined text-slate-400 group-focus-within:text-primary transition-colors">
                search
              </span>
            </div>
            <input
              type="text"
              value={filters.search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="영단어 검색 (예: destructure, hydration)..."
              className="block w-full pl-11 pr-4 py-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all placeholder:text-slate-400 text-slate-900 dark:text-slate-100"
            />
          </div>

          {/* Filters */}
          <div className="flex gap-3">
            <select
              value={filters.source}
              onChange={(e) => setSource(e.target.value)}
              className="px-4 py-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-sm font-medium hover:border-slate-300 dark:hover:border-slate-700 transition-colors text-slate-700 dark:text-slate-300 min-w-[130px]"
            >
              <option value="all">출처: 전체</option>
              {SOURCES.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>

            <select
              value={filters.status}
              onChange={(e) => setStatus(e.target.value as WordStatus | 'all')}
              className="px-4 py-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-sm font-medium hover:border-slate-300 dark:hover:border-slate-700 transition-colors text-slate-700 dark:text-slate-300 min-w-[130px]"
            >
              <option value="all">상태: 전체</option>
              <option value="verified">검증됨</option>
              <option value="unreviewed">미검수</option>
            </select>
          </div>
        </div>
      </div>

      {/* Word Grid */}
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 6 }).map((_, i) => (
            <SkeletonCard key={i} />
          ))}
        </div>
      ) : results.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-24 text-center">
          <span className="material-symbols-outlined text-5xl text-slate-300 dark:text-slate-600 mb-4">
            search_off
          </span>
          <p className="text-lg font-medium text-slate-600 dark:text-slate-400 mb-2">
            검색 결과가 없습니다
          </p>
          <p className="text-sm text-slate-400 dark:text-slate-500 mb-6">
            다른 검색어나 필터를 시도해보세요.
          </p>
          <button
            onClick={resetFilters}
            className="px-4 py-2 rounded-lg bg-primary text-white text-sm font-medium hover:bg-primary/90 transition-colors"
          >
            필터 초기화
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {results.map((word) => (
            <WordCard key={word.id} word={word} onClick={handleWordClick} />
          ))}
        </div>
      )}

      {/* Pagination */}
      {!isLoading && results.length > 0 && totalPages > 1 && (
        <div className="mt-16 flex items-center justify-center gap-2">
          <button
            onClick={() => setPage(filters.page - 1)}
            disabled={filters.page === 1}
            className="flex items-center justify-center px-4 py-2 text-sm font-semibold text-slate-700 dark:text-slate-300 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <span className="material-symbols-outlined text-lg mr-1">chevron_left</span>
            Previous
          </button>

          <div className="flex gap-1">
            {Array.from({ length: totalPages }).map((_, i) => {
              const page = i + 1;
              const isActive = page === filters.page;
              return (
                <button
                  key={page}
                  onClick={() => setPage(page)}
                  className={`size-10 flex items-center justify-center rounded-lg text-sm font-medium transition-colors ${
                    isActive
                      ? 'bg-primary text-white font-bold'
                      : 'hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300'
                  }`}
                >
                  {page}
                </button>
              );
            })}
          </div>

          <button
            onClick={() => setPage(filters.page + 1)}
            disabled={filters.page === totalPages}
            className="flex items-center justify-center px-4 py-2 text-sm font-semibold text-slate-700 dark:text-slate-300 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Next
            <span className="material-symbols-outlined text-lg ml-1">chevron_right</span>
          </button>
        </div>
      )}
    </main>
  );
};

export default VocabularyList;
