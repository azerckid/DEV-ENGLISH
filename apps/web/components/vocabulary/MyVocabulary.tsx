"use client";

import { useState, useCallback } from "react";
import { toast } from "sonner";
import Link from "next/link";

interface VocabItem {
  readonly wordId: number;
  readonly word: string;
  readonly koreanMeaning: string;
  readonly partOfSpeech: string | null;
  readonly addedAt: number | null;
}

interface MyVocabularyProps {
  readonly items: VocabItem[];
}

export function MyVocabulary({ items: initialItems }: MyVocabularyProps) {
  const [items, setItems] = useState(initialItems);
  const [query, setQuery] = useState("");
  const [deleting, setDeleting] = useState<number | null>(null);

  const filtered = items.filter(
    (it) =>
      it.word.toLowerCase().includes(query.toLowerCase()) ||
      it.koreanMeaning.toLowerCase().includes(query.toLowerCase())
  );

  const remove = useCallback(async (wordId: number, word: string) => {
    setDeleting(wordId);
    try {
      const res = await fetch(`/api/my-vocabulary/${wordId}`, { method: "DELETE" });
      if (!res.ok) throw new Error();
      setItems((prev) => prev.filter((it) => it.wordId !== wordId));
      toast.success(`'${word}'을(를) 단어장에서 삭제했습니다.`);
    } catch {
      toast.error("삭제에 실패했습니다.");
    } finally {
      setDeleting(null);
    }
  }, []);

  return (
    <div className="flex flex-col items-center py-8 px-4">
      <div className="w-full max-w-[800px]">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-extrabold tracking-tight mb-1">내 단어장</h1>
          <p className="text-muted-foreground">저장된 단어 {items.length}개</p>
        </div>

        {/* Search */}
        <div className="mb-6">
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="단어 검색..."
            className="w-full px-4 py-3 bg-muted/50 border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary text-sm"
          />
        </div>

        {/* List */}
        {filtered.length === 0 ? (
          <div className="text-center py-24">
            {items.length === 0 ? (
              <>
                <p className="text-5xl mb-4">📚</p>
                <p className="text-muted-foreground text-lg font-medium mb-2">단어장이 비어 있습니다.</p>
                <p className="text-muted-foreground text-sm mb-8">드릴에서 틀린 단어가 자동으로 추가됩니다.</p>
                <Link href="/drill" className="px-6 py-3 bg-primary text-primary-foreground font-bold rounded-xl hover:bg-primary/90 transition-all">
                  드릴 시작하기
                </Link>
              </>
            ) : (
              <p className="text-muted-foreground">검색 결과가 없습니다.</p>
            )}
          </div>
        ) : (
          <div className="flex flex-col gap-3">
            {filtered.map((item) => (
              <div
                key={item.wordId}
                className="flex items-center justify-between bg-card border border-border rounded-xl px-5 py-4 shadow-sm hover:shadow-md transition-shadow"
              >
                <div className="flex items-center gap-4">
                  <div>
                    <div className="flex items-center gap-2">
                      <Link
                        href={`/words/${item.wordId}`}
                        className="font-bold text-lg hover:text-primary transition-colors"
                      >
                        {item.word}
                      </Link>
                      {item.partOfSpeech && (
                        <span className="px-2 py-0.5 text-xs bg-muted text-muted-foreground rounded-full">
                          {item.partOfSpeech}
                        </span>
                      )}
                    </div>
                    <p className="text-muted-foreground text-sm mt-0.5">{item.koreanMeaning}</p>
                  </div>
                </div>
                <button
                  onClick={() => remove(item.wordId, item.word)}
                  disabled={deleting === item.wordId}
                  aria-label={`${item.word} 삭제`}
                  className="ml-4 p-2 rounded-lg text-muted-foreground hover:text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/30 transition-colors disabled:opacity-50"
                >
                  {deleting === item.wordId ? (
                    <span className="text-xs">...</span>
                  ) : (
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M3 6h18" /><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" /><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" />
                    </svg>
                  )}
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
