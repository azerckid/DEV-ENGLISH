"use client";

import { useState, useCallback } from "react";
import { toast } from "sonner";
import Link from "next/link";

interface FlashCard {
  readonly wordId: number;
  readonly word: string;
  readonly koreanMeaning: string;
  readonly exampleSentence: string;
  readonly sourceName: string;
}

interface FlashcardGameProps {
  readonly cards: FlashCard[];
}

export function FlashcardGame({ cards }: FlashcardGameProps) {
  const [idx, setIdx] = useState(0);
  const [flipped, setFlipped] = useState(false);
  const [correct, setCorrect] = useState(0);
  const [wrong, setWrong] = useState(0);
  const [done, setDone] = useState(false);

  const current = cards[idx];
  const total = cards.length;
  const progress = total > 0 ? Math.round((idx / total) * 100) : 0;

  const advance = useCallback(async (isCorrect: boolean) => {
    if (!flipped || !current) return;
    if (isCorrect) {
      setCorrect((c) => c + 1);
    } else {
      setWrong((w) => w + 1);
      try {
        await fetch("/api/my-vocabulary", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ wordId: current.wordId, source: "wrong_answer" }),
        });
        toast.info(`'${current.word}'가 내 단어장에 추가되었습니다.`);
      } catch {
        console.error("Failed to add word to vocabulary");
      }
    }
    if (idx + 1 >= total) {
      setDone(true);
    } else {
      setIdx((i) => i + 1);
      setFlipped(false);
    }
  }, [flipped, current, idx, total]);

  const restart = useCallback(() => {
    setIdx(0);
    setFlipped(false);
    setCorrect(0);
    setWrong(0);
    setDone(false);
  }, []);

  if (done) {
    const pct = total > 0 ? Math.round((correct / total) * 100) : 0;
    return (
      <div className="flex flex-col items-center justify-center py-24 text-center">
        <p className="text-5xl mb-6">🏆</p>
        <h2 className="text-2xl font-bold mb-2">완료!</h2>
        <p className="text-muted-foreground mb-1">맞힘 {correct}개 · 틀림 {wrong}개</p>
        <p className="text-muted-foreground mb-8 text-sm">정확도 {pct}%</p>
        <div className="flex gap-4">
          <button onClick={restart} className="px-8 py-3 bg-primary text-primary-foreground font-bold rounded-xl hover:bg-primary/90 transition-all">
            다시 시작
          </button>
          <Link href="/" className="px-8 py-3 border-2 border-border font-bold rounded-xl hover:bg-muted transition-all">
            홈으로
          </Link>
        </div>
      </div>
    );
  }

  if (!current) return null;

  return (
    <div className="flex flex-1 justify-center py-8 px-4">
      <div className="flex flex-col max-w-[640px] flex-1 gap-8">
        {/* Progress */}
        <div className="bg-card border border-border p-5 rounded-xl shadow-sm">
          <div className="flex justify-between items-end mb-3">
            <div>
              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Progress</p>
              <p className="text-2xl font-bold">{idx + 1} <span className="text-muted-foreground font-normal text-lg">/ {total}</span></p>
            </div>
            <div className="flex gap-2">
              <span className="flex items-center gap-1 px-3 py-1.5 rounded-full bg-emerald-50 dark:bg-emerald-950/30 text-emerald-600 dark:text-emerald-400 border border-emerald-100 dark:border-emerald-900 text-sm font-bold">
                ✓ 맞힘 {correct}개
              </span>
              <span className="flex items-center gap-1 px-3 py-1.5 rounded-full bg-rose-50 dark:bg-rose-950/30 text-rose-600 dark:text-rose-400 border border-rose-100 dark:border-rose-900 text-sm font-bold">
                ✗ 틀림 {wrong}개
              </span>
            </div>
          </div>
          <div className="w-full h-3 bg-muted rounded-full overflow-hidden">
            <div className="h-full bg-primary rounded-full transition-all duration-500" style={{ width: `${progress}%` }} />
          </div>
        </div>

        {/* Card */}
        <button
          onClick={() => setFlipped((f) => !f)}
          className="relative bg-card rounded-2xl shadow-xl border border-border p-10 min-h-[360px] flex flex-col items-center justify-between text-center transition-transform hover:scale-[1.01] active:scale-[0.99] cursor-pointer w-full"
          aria-label={flipped ? "앞면 보기" : "뒤집어서 정답 확인"}
        >
          {!flipped ? (
            <>
              <div className="w-full">
                <div className="flex justify-center mb-6">
                  <span className="px-3 py-1 bg-primary/10 text-primary text-xs font-bold rounded-full border border-primary/20">
                    {current.sourceName}
                  </span>
                </div>
                <h2 className="text-4xl md:text-5xl font-extrabold mb-8 tracking-tight">{current.word}</h2>
                {current.exampleSentence && (
                  <p className="text-lg text-muted-foreground leading-relaxed italic max-w-md mx-auto">
                    &ldquo;{current.exampleSentence}&rdquo;
                  </p>
                )}
              </div>
              <div className="flex flex-col items-center gap-2 mt-8">
                <span className="text-2xl animate-bounce">👆</span>
                <p className="text-muted-foreground text-sm font-medium">클릭하여 뒤집기</p>
              </div>
            </>
          ) : (
            <div className="w-full flex flex-col items-center gap-4">
              <span className="px-3 py-1 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-xs font-bold rounded-full border border-emerald-500/20">
                정답 확인
              </span>
              <h2 className="text-4xl md:text-5xl font-extrabold text-primary tracking-tight">{current.word}</h2>
              <p className="text-2xl font-semibold">{current.koreanMeaning}</p>
              {current.exampleSentence && (
                <p className="text-base text-muted-foreground leading-relaxed italic max-w-md">
                  &ldquo;{current.exampleSentence}&rdquo;
                </p>
              )}
            </div>
          )}
        </button>

        {/* Buttons */}
        <div className="flex flex-col items-center gap-3">
          <div className="flex w-full gap-4">
            <button
              onClick={() => advance(true)}
              disabled={!flipped}
              className="flex-1 h-14 rounded-xl font-bold text-lg transition-all disabled:bg-muted disabled:text-muted-foreground disabled:cursor-not-allowed enabled:bg-emerald-500 enabled:hover:bg-emerald-600 enabled:text-white enabled:shadow-lg enabled:shadow-emerald-500/20"
            >
              ✓ 맞힘
            </button>
            <button
              onClick={() => advance(false)}
              disabled={!flipped}
              className="flex-1 h-14 rounded-xl font-bold text-lg transition-all disabled:bg-muted disabled:text-muted-foreground disabled:cursor-not-allowed enabled:bg-rose-500 enabled:hover:bg-rose-600 enabled:text-white enabled:shadow-lg enabled:shadow-rose-500/20"
            >
              ✗ 틀림
            </button>
          </div>
          {!flipped && (
            <p className="text-sm text-muted-foreground">카드를 먼저 뒤집어 주세요</p>
          )}
        </div>
      </div>
    </div>
  );
}
