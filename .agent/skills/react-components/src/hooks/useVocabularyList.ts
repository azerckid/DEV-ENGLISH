import { useState, useMemo } from 'react';
import { words, type Word, type WordStatus } from '../data/mockData';

const PAGE_SIZE = 20;

export interface VocabularyFilters {
  search: string;
  source: string;
  status: WordStatus | 'all';
  page: number;
}

export interface UseVocabularyListReturn {
  filters: VocabularyFilters;
  results: Word[];
  totalPages: number;
  setSearch: (v: string) => void;
  setSource: (v: string) => void;
  setStatus: (v: WordStatus | 'all') => void;
  setPage: (v: number) => void;
  resetFilters: () => void;
}

const DEFAULT_FILTERS: VocabularyFilters = {
  search: '',
  source: 'all',
  status: 'all',
  page: 1,
};

export function useVocabularyList(): UseVocabularyListReturn {
  const [filters, setFilters] = useState<VocabularyFilters>(DEFAULT_FILTERS);

  const filtered = useMemo(() => {
    return words.filter((w) => {
      const matchesSearch =
        filters.search === '' ||
        w.word.toLowerCase().includes(filters.search.toLowerCase());
      const matchesSource =
        filters.source === 'all' || w.sources.includes(filters.source);
      const matchesStatus =
        filters.status === 'all' || w.status === filters.status;
      return matchesSearch && matchesSource && matchesStatus;
    });
  }, [filters.search, filters.source, filters.status]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));

  const results = useMemo(() => {
    const start = (filters.page - 1) * PAGE_SIZE;
    return filtered.slice(start, start + PAGE_SIZE);
  }, [filtered, filters.page]);

  const resetPage = () => setFilters((f) => ({ ...f, page: 1 }));

  return {
    filters,
    results,
    totalPages,
    setSearch: (v) => setFilters((f) => ({ ...f, search: v, page: 1 })),
    setSource: (v) => setFilters((f) => ({ ...f, source: v, page: 1 })),
    setStatus: (v) => setFilters((f) => ({ ...f, status: v as WordStatus | 'all', page: 1 })),
    setPage: (v) => setFilters((f) => ({ ...f, page: v })),
    resetFilters: () => setFilters(DEFAULT_FILTERS),
  };
}
