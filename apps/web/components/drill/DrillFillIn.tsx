"use client";

import { useState, useCallback, useRef, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import Link from "next/link";

interface DrillItem {
  readonly wordId: number;
  readonly word: string;
  readonly sentence: string;
  readonly sourceName: string;
  readonly hint?: string;
}

interface DrillFillInProps {
  readonly items: DrillItem[];
  readonly isFromMyVocabulary?: boolean;
}

type AnswerState = "unanswered" | "correct" | "incorrect";

export function DrillFillIn({ items, isFromMyVocabulary = false }: DrillFillInProps) {
  const [idx, setIdx] = useState(0);
  const [answer, setAnswer] = useState("");
  const [state, setState] = useState<AnswerState>("unanswered");
  const [correct, setCorrect] = useState(0);
  const [wrong, setWrong] = useState(0);
  const [done, setDone] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const current = items[idx];
  const total = items.length;
  const progress = total > 0 ? Math.round(((idx) / total) * 100) : 0;

  useEffect(() => {
    if (state === "unanswered") inputRef.current?.focus();
  }, [state, idx]);

  const submit = useCallback(async () => {
    if (!current || state !== "unanswered") return;
    const isCorrect = answer.trim().toLowerCase() === current.word.toLowerCase();
    setState(isCorrect ? "correct" : "incorrect");
    if (isCorrect) {
      setCorrect((c) => c + 1);
    } else {
      setWrong((w) => w + 1);
      // 오답 → 자동으로 내 단어장에 추가
      try {
        await fetch("/api/my-vocabulary", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ wordId: current.wordId, source: "wrong_answer" }),
        });
        toast.info(`'${current.word}'가 내 단어장에 추가되었습니다.`);
      } catch {
        // silent fail — 학습 흐름 방해 금지
        console.error("Failed to add word to vocabulary");
      }
    }
  }, [answer, current, state]);

  const next = useCallback(() => {
    if (idx + 1 >= total) {
      setDone(true);
    } else {
      setIdx((i) => i + 1);
      setAnswer("");
      setState("unanswered");
    }
  }, [idx, total]);

  const restart = useCallback(() => {
    setIdx(0);
    setAnswer("");
    setState("unanswered");
    setCorrect(0);
    setWrong(0);
    setDone(false);
  }, []);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") state === "unanswered" ? submit() : next();
  };

  if (done) {
    return (
      <div className="flex flex-col items-center justify-center py-24 text-center">
        <p className="text-5xl mb-6">🏆</p>
        <h2 className="text-2xl font-bold mb-2">드릴 완료!</h2>
        <p className="text-muted-foreground mb-8">
          정답 {correct}개 · 오답 {wrong}개
        </p>
        <div className="flex gap-4">
          <button
            onClick={restart}
            className="px-8 py-3 bg-primary text-primary-foreground font-bold rounded-xl hover:bg-primary/90 transition-all"
          >
            다시 시작
          </button>
          <Link
            href="/"
            className="px-8 py-3 border-2 border-border font-bold rounded-xl hover:bg-muted transition-all"
          >
            홈으로
          </Link>
        </div>
      </div>
    );
  }

  if (!current) return null;

  const parts = current.sentence.split("___");

  return (
    <div className="flex flex-col items-center pt-8 pb-12 px-4">
      {/* Progress */}
      <div className="w-full max-w-2xl mb-10">
        <div className="flex justify-between items-end mb-2">
          <span className="text-2xl font-bold">
            {idx + 1} <span className="text-muted-foreground text-lg font-normal">/ {total}</span>
          </span>
          <span className="text-sm font-semibold text-primary">{progress}% Complete</span>
        </div>
        <div className="w-full h-3 bg-muted rounded-full overflow-hidden">
          <div
            className="h-full bg-primary rounded-full transition-all duration-500"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      {/* Card */}
      <div className="w-full max-w-2xl bg-card border border-border rounded-xl shadow-xl overflow-hidden">
        <div className="p-8 md:p-12">
          <div className="flex items-center justify-between mb-8">
            <h1 className="text-xl font-bold">빈칸 채우기</h1>
            <span className="px-3 py-1 bg-primary/5 text-primary text-xs font-bold rounded-full border border-primary/10 uppercase tracking-wider">
              {current.sourceName}
            </span>
          </div>

          <div className="mb-10 text-center">
            <p className="text-xl md:text-2xl leading-relaxed font-medium">
              {parts[0]}
              <span className="inline-block w-28 border-b-2 border-primary mx-1" />
              {parts[1]}
            </p>
          </div>

          <div className="space-y-4">
            <Input
              ref={inputRef}
              value={answer}
              onChange={(e) => setAnswer(e.target.value)}
              onKeyDown={handleKeyDown}
              readOnly={state !== "unanswered"}
              placeholder="정답을 입력하세요..."
              className={`h-14 text-lg font-mono px-5 border-2 ${
                state === "correct"
                  ? "border-emerald-500 bg-emerald-50 dark:bg-emerald-950"
                  : state === "incorrect"
                  ? "border-rose-500 bg-rose-50 dark:bg-rose-950"
                  : "border-primary"
              }`}
            />
            {state === "unanswered" && (
              <button
                onClick={submit}
                className="w-full h-12 bg-primary text-primary-foreground font-bold rounded-xl hover:bg-primary/90 transition-all"
              >
                확인 ↵
              </button>
            )}
            <p className="text-center text-xs text-muted-foreground">Enter 키로 제출</p>
          </div>
        </div>

        {/* Result Banner */}
        {state !== "unanswered" && (
          <div
            className={`border-t p-6 md:p-8 flex flex-col md:flex-row items-center justify-between gap-4 ${
              state === "correct"
                ? "bg-emerald-50 dark:bg-emerald-950/30 border-emerald-100 dark:border-emerald-900"
                : "bg-rose-50 dark:bg-rose-950/30 border-rose-100 dark:border-rose-900"
            }`}
          >
            <div className="flex items-center gap-4">
              <div
                className={`size-12 rounded-full flex items-center justify-center text-white text-xl ${
                  state === "correct" ? "bg-emerald-500" : "bg-rose-500"
                }`}
              >
                {state === "correct" ? "✓" : "✗"}
              </div>
              <div>
                <p className={`font-bold text-lg ${state === "correct" ? "text-emerald-700 dark:text-emerald-400" : "text-rose-700 dark:text-rose-400"}`}>
                  {state === "correct" ? "정답입니다!" : "오답입니다."}
                </p>
                <p className="text-sm text-muted-foreground">
                  정답: <code className="font-mono font-bold">{current.word}</code>
                </p>
              </div>
            </div>
            <button
              onClick={next}
              className="px-8 py-3 bg-primary text-primary-foreground font-bold rounded-lg hover:bg-primary/90 transition-all"
            >
              다음 단어 →
            </button>
          </div>
        )}
      </div>

      {current.hint && state === "unanswered" && (
        <p className="mt-6 text-xs text-muted-foreground">
          💡 Hint: {current.hint}
        </p>
      )}
    </div>
  );
}
