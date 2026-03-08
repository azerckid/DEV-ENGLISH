"use client";

import { useState } from "react";
import { toast } from "sonner";
import Link from "next/link";

interface ContributeFormProps {
  readonly isLoggedIn: boolean;
}

type Step = 1 | 2 | 3;

export function ContributeForm({ isLoggedIn }: ContributeFormProps) {
  const [step, setStep] = useState<Step>(1);
  const [sourceUrl, setSourceUrl] = useState("");
  const [rawText, setRawText] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState(false);

  const handleSubmit = async () => {
    if (!sourceUrl.trim() || !rawText.trim()) {
      toast.error("URL과 텍스트를 모두 입력해 주세요.");
      return;
    }
    setSubmitting(true);
    try {
      const res = await fetch("/api/contribute", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ sourceUrl: sourceUrl.trim(), rawText: rawText.trim() }),
      });
      if (!res.ok) throw new Error();
      setDone(true);
    } catch {
      toast.error("제출에 실패했습니다. 잠시 후 다시 시도해 주세요.");
    } finally {
      setSubmitting(false);
    }
  };

  if (done) {
    return (
      <div className="flex flex-1 items-center justify-center py-24 text-center px-4">
        <div>
          <p className="text-5xl mb-4">🎉</p>
          <h2 className="text-2xl font-bold mb-2">제출 완료!</h2>
          <p className="text-muted-foreground mb-8">기여해 주셔서 감사합니다. 검토 후 단어가 추가됩니다.</p>
          <div className="flex gap-4 justify-center">
            <button
              onClick={() => { setStep(1); setSourceUrl(""); setRawText(""); setDone(false); }}
              className="px-6 py-3 bg-primary text-primary-foreground font-bold rounded-xl hover:bg-primary/90 transition-all"
            >
              추가 제출
            </button>
            <Link href="/" className="px-6 py-3 border-2 border-border font-bold rounded-xl hover:bg-muted transition-all">
              홈으로
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center py-8 px-4">
      <div className="w-full max-w-[720px]">
        <div className="mb-8">
          <h1 className="text-3xl font-extrabold tracking-tight mb-1">기여하기</h1>
          <p className="text-muted-foreground text-sm">공식 문서에서 발견한 개발 영어 표현을 공유해 주세요.</p>
        </div>

        {/* Steps indicator */}
        <div className="flex items-center gap-2 mb-8">
          {([1, 2, 3] as Step[]).map((s) => (
            <div key={s} className="flex items-center gap-2">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition-all ${
                step === s
                  ? "bg-primary text-primary-foreground"
                  : step > s
                  ? "bg-emerald-500 text-white"
                  : "bg-muted text-muted-foreground"
              }`}>
                {step > s ? "✓" : s}
              </div>
              {s < 3 && <div className={`h-0.5 w-12 rounded ${step > s ? "bg-emerald-500" : "bg-muted"}`} />}
            </div>
          ))}
          <span className="ml-2 text-sm text-muted-foreground font-medium">
            {step === 1 ? "출처 URL" : step === 2 ? "텍스트 입력" : "확인 및 제출"}
          </span>
        </div>

        <div className="bg-card border border-border rounded-2xl shadow-sm p-8 flex flex-col gap-6">
          {step === 1 && (
            <>
              <div>
                <label className="block text-sm font-bold mb-2">출처 문서 URL <span className="text-rose-500">*</span></label>
                <input
                  type="url"
                  value={sourceUrl}
                  onChange={(e) => setSourceUrl(e.target.value)}
                  placeholder="https://react.dev/reference/..."
                  className="w-full px-4 py-3 bg-muted/50 border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary text-sm"
                />
                <p className="text-xs text-muted-foreground mt-2">React, Next.js, MDN, TypeScript 공식 문서 URL을 입력해 주세요.</p>
              </div>
              <button
                onClick={() => sourceUrl.trim() ? setStep(2) : toast.error("URL을 입력해 주세요.")}
                className="w-full py-3 bg-primary text-primary-foreground font-bold rounded-xl hover:bg-primary/90 transition-all"
              >
                다음 →
              </button>
            </>
          )}

          {step === 2 && (
            <>
              <div>
                <label className="block text-sm font-bold mb-2">원문 텍스트 <span className="text-rose-500">*</span></label>
                <textarea
                  value={rawText}
                  onChange={(e) => setRawText(e.target.value)}
                  placeholder="문서에서 개발 영어 표현이 포함된 단락을 붙여넣어 주세요..."
                  rows={8}
                  className="w-full px-4 py-3 bg-muted/50 border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary text-sm resize-none"
                />
                <p className="text-xs text-muted-foreground mt-2">{rawText.length}자</p>
              </div>
              <div className="flex gap-3">
                <button
                  onClick={() => setStep(1)}
                  className="flex-1 py-3 border-2 border-border font-bold rounded-xl hover:bg-muted transition-all"
                >
                  ← 이전
                </button>
                <button
                  onClick={() => rawText.trim() ? setStep(3) : toast.error("텍스트를 입력해 주세요.")}
                  className="flex-1 py-3 bg-primary text-primary-foreground font-bold rounded-xl hover:bg-primary/90 transition-all"
                >
                  다음 →
                </button>
              </div>
            </>
          )}

          {step === 3 && (
            <>
              {!isLoggedIn && (
                <div className="flex items-center gap-3 p-4 bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-900 rounded-xl">
                  <span className="text-amber-600 dark:text-amber-400 text-sm font-medium">
                    로그인 없이도 제출할 수 있지만, 기여 내역을 추적하려면{" "}
                    <Link href="/login?redirect=/contribute" className="underline font-bold">로그인</Link>
                    해 주세요.
                  </span>
                </div>
              )}
              <div className="space-y-4">
                <div>
                  <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-1">출처 URL</p>
                  <p className="text-sm font-mono bg-muted/50 px-3 py-2 rounded-lg break-all">{sourceUrl}</p>
                </div>
                <div>
                  <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-1">텍스트 ({rawText.length}자)</p>
                  <p className="text-sm bg-muted/50 px-3 py-2 rounded-lg line-clamp-4 leading-relaxed">{rawText}</p>
                </div>
              </div>
              <div className="flex gap-3">
                <button
                  onClick={() => setStep(2)}
                  className="flex-1 py-3 border-2 border-border font-bold rounded-xl hover:bg-muted transition-all"
                >
                  ← 이전
                </button>
                <button
                  onClick={handleSubmit}
                  disabled={submitting}
                  className="flex-1 py-3 bg-primary text-primary-foreground font-bold rounded-xl hover:bg-primary/90 transition-all disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  {submitting ? "제출 중..." : "제출하기 ✓"}
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
