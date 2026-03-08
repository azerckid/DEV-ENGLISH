import { useState, useMemo, useCallback } from 'react';
import { myVocabularyItems, type MyVocabularyItem, type VocabularySource } from '../data/mockData';

export type SortOrder = 'latest' | 'alphabetical';

export interface UseMyVocabularyReturn {
  items: MyVocabularyItem[];
  allItems: MyVocabularyItem[];
  sourceFilter: VocabularySource | 'all';
  sortOrder: SortOrder;
  pendingDeleteId: number | null;
  setSourceFilter: (v: VocabularySource | 'all') => void;
  setSortOrder: (v: SortOrder) => void;
  requestDelete: (id: number) => void;
  cancelDelete: () => void;
  confirmDelete: () => void;
}

export function useMyVocabulary(): UseMyVocabularyReturn {
  const [allItems, setAllItems] = useState<MyVocabularyItem[]>(myVocabularyItems);
  const [sourceFilter, setSourceFilter] = useState<VocabularySource | 'all'>('all');
  const [sortOrder, setSortOrder] = useState<SortOrder>('latest');
  const [pendingDeleteId, setPendingDeleteId] = useState<number | null>(null);

  const items = useMemo(() => {
    let filtered = allItems.filter(
      (item) => sourceFilter === 'all' || item.source === sourceFilter
    );
    if (sortOrder === 'alphabetical') {
      filtered = [...filtered].sort((a, b) => a.word.localeCompare(b.word));
    } else {
      filtered = [...filtered].sort((a, b) => b.addedAt.localeCompare(a.addedAt));
    }
    return filtered;
  }, [allItems, sourceFilter, sortOrder]);

  const requestDelete = useCallback((id: number) => setPendingDeleteId(id), []);
  const cancelDelete = useCallback(() => setPendingDeleteId(null), []);

  const confirmDelete = useCallback(() => {
    if (pendingDeleteId === null) return;
    setAllItems((prev) => prev.filter((item) => item.id !== pendingDeleteId));
    setPendingDeleteId(null);
  }, [pendingDeleteId]);

  return {
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
  };
}
