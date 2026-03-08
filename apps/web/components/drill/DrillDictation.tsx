"use client";

import { useState, useCallback, useRef, useEffect } from "react";
import { toast } from "sonner";
import Link from "next/link";

interface DictationItem {
  readonly wordId: number;
  readonly word: string;
  readonly sourceName: string;
}

interface DrillDictationProps {
  readonly items: DictationItem[];
}

type AnswerState = "unanswered" | "correct" | "incorrect";

export function DrillDictation({ items }: DrillDictationProps) {
  const [idx, setIdx] = useState(0);
  const [answer, setAnswer] = useState("");
  const [state, setState] = useState<AnswerState>("unanswered");
  const [correct, setCorrect] = useState(0);
  const [wrong, setWrong] = useState(0);
  const [done, setDone] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const current = items[idx];
  const total = items.length;
  const progress = total > 0 ? Math.round((idx / total) * 100) : 0;

  useEffect(() => {
    if (state === "unanswered") textareaRef.current?.focus();
  }, [state, idx]);

  const speak = useCallback(() => {
    if (!current) return;
    const utterance = new SpeechSynthesisUtterance(current.word);
    utterance.lang = "en-US";
    utterance.rate = 0.85;
    window.speechSynthesis.speak(utterance);
  }, [current]);

  const submit = useCallback(async () => {
    if (!current || state !== "unanswered") return;
    const isCorrect = answer.trim().toLowerCase() === current.word.toLowerCase();
    setState(isCorrect ? "correct" : "incorrect");
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
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      state === "unanswered" ? submit() : next();
    }
  };

  if (done) {
    return (
      <div className="flex flex-col items-center justify-center py-24 text-center">
        <p className="text-5xl mb-6">🏆</p>
        <h2 className="text-2xl font-bold mb-2">받아쓰기 완료!</h2>
        <p className="text-muted-foreground mb-8">정답 {correct}개 · 오답 {wrong}개</p>
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
    <div className="flex flex-col items-center pt-8 pb-20 px-4">
      {/* Progress */}
      <div className="w-full max-w-[800px] mb-8">
        <div className="flex justify-between items-end mb-2">
          <span className="text-xl font-bold">
            {idx + 1} <span className="text-muted-foreground font-normal">/ {total}</span>
          </span>
          <span className="text-sm font-semibold text-primary">{progress}% Complete</span>
        </div>
        <div className="h-3 w-full bg-muted rounded-full overflow-hidden">
          <div className="h-full bg-primary rounded-full transition-all duration-500" style={{ width: `${progress}%` }} />
        </div>
      </div>

      <div className="w-full max-w-[800px] bg-card border border-border rounded-xl shadow-xl p-8 md:p-12 flex flex-col items-center gap-10">
        <div className="text-center">
          <h1 className="text-3xl font-extrabold tracking-tight">받아쓰기</h1>
          <p className="text-muted-foreground mt-2">Listen to the pronunciation and type what you hear.</p>
        </div>

        {/* TTS Button */}
        <div className="flex flex-col items-center gap-3">
          <button
            onClick={speak}
            aria-label="발음 듣기"
            className="flex h-24 w-24 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-lg shadow-primary/30 hover:bg-primary/90 transition-all active:scale-95 text-4xl"
          >
            🔊
          </button>
          <span className="text-sm font-bold text-primary uppercase tracking-widest">발음 듣기</span>
        </div>

        {/* Input */}
        <div className="w-full max-w-lg space-y-4">
          <textarea
            ref={textareaRef}
            value={answer}
            onChange={(e) => setAnswer(e.target.value)}
            onKeyDown={handleKeyDown}
            readOnly={state !== "unanswered"}
            placeholder="들은 단어를 입력하세요..."
            rows={4}
            className={`block w-full px-6 py-5 text-xl font-medium bg-muted/50 border-2 rounded-xl focus:ring-4 focus:ring-primary/20 focus:outline-none transition-all resize-none placeholder:text-muted-foreground ${
              state === "correct" ? "border-emerald-500" : state === "incorrect" ? "border-rose-500" : "border-border focus:border-primary"
            }`}
          />

          {state === "unanswered" ? (
            <button onClick={submit} className="w-full py-4 bg-primary text-primary-foreground font-bold rounded-xl hover:bg-primary/90 transition-all">
              확인 ✓
            </button>
          ) : (
            <div className={`p-5 rounded-xl border ${state === "correct" ? "bg-emerald-50 dark:bg-emerald-950/30 border-emerald-200 dark:border-emerald-900" : "bg-rose-50 dark:bg-rose-950/30 border-rose-200 dark:border-rose-900"}`}>
              <p className={`font-bold text-lg mb-1 ${state === "correct" ? "text-emerald-700 dark:text-emerald-400" : "text-rose-700 dark:text-rose-400"}`}>
                {state === "correct" ? "정답입니다!" : "오답입니다."}
              </p>
              <p className="text-sm text-muted-foreground mb-4">
                정답: <code className="font-mono font-bold">{current.word}</code>
              </p>
              <button onClick={next} className="w-full py-3 bg-primary text-primary-foreground font-bold rounded-lg hover:bg-primary/90 transition-all">
                다음 단어 →
              </button>
            </div>
          )}

          <p className="text-xs text-muted-foreground text-center">
            Enter 키로 제출 (Shift+Enter = 줄바꿈)
          </p>
        </div>
      </div>
    </div>
  );
}
