"use client";

import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";
import type { InferSelectModel } from "drizzle-orm";
import type { words, wordExamples, wordMorphemes, wordDerivatives } from "@/lib/db-schema";

type Word = InferSelectModel<typeof words>;
type Example = InferSelectModel<typeof wordExamples>;
type Morpheme = InferSelectModel<typeof wordMorphemes>;
type Derivative = InferSelectModel<typeof wordDerivatives>;

interface WordDetailViewProps {
  readonly word: Word;
  readonly examples: Example[];
  readonly morphemes: Morpheme[];
  readonly derivatives: Derivative[];
  readonly isLoggedIn: boolean;
}

const MORPHEME_STYLES: Record<string, { block: string; text: string }> = {
  prefix: { block: "bg-blue-500/10 border border-blue-500/20", text: "text-blue-500" },
  root:   { block: "bg-emerald-500/10 border border-emerald-500/20", text: "text-emerald-500" },
  suffix: { block: "bg-purple-500/10 border border-purple-500/20", text: "text-purple-500" },
};

export function WordDetailView({ word, examples, morphemes, derivatives, isLoggedIn }: WordDetailViewProps) {
  const isVerified = word.status === "verified";

  const handleAddToVocabulary = async () => {
    if (!isLoggedIn) {
      toast.error("단어장 저장은 로그인 후 이용할 수 있습니다.");
      return;
    }
    try {
      const res = await fetch("/api/my-vocabulary", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ wordId: word.id, source: "manual" }),
      });
      if (res.status === 409) {
        toast.info("이미 내 단어장에 있는 단어입니다.");
        return;
      }
      if (!res.ok) throw new Error();
      toast.success(`'${word.word}'가 내 단어장에 추가되었습니다.`);
    } catch {
      toast.error("추가에 실패했습니다. 다시 시도해 주세요.");
    }
  };

  const handleSpeak = () => {
    const utterance = new SpeechSynthesisUtterance(word.word);
    utterance.lang = "en-US";
    utterance.rate = 0.85;
    window.speechSynthesis.speak(utterance);
  };

  return (
    <main className="max-w-5xl mx-auto px-4 py-8 flex-1">
      <Link
        href="/"
        className="inline-flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors mb-8 group text-sm font-medium"
      >
        ← 단어장으로
      </Link>

      {/* Header */}
      <section className="mb-12">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <Badge variant="outline" className="uppercase text-xs font-bold">
                {word.partOfSpeech}
              </Badge>
              <Badge variant={isVerified ? "default" : "secondary"}>
                {isVerified ? "검증됨" : "미검수"}
              </Badge>
            </div>
            <h1 className="text-5xl md:text-6xl font-bold mb-4 tracking-tight">{word.word}</h1>
            {word.pronunciation && (
              <div className="flex items-center gap-3 text-muted-foreground">
                <span className="text-lg font-mono">{word.pronunciation}</span>
                <button
                  onClick={handleSpeak}
                  aria-label="발음 듣기"
                  className="p-1.5 hover:bg-muted rounded-full transition-colors"
                >
                  🔊
                </button>
              </div>
            )}
          </div>
          <div className="flex flex-col items-start md:items-end gap-4">
            <p className="text-2xl md:text-3xl font-semibold">{word.koreanMeaning}</p>
            <button
              onClick={handleAddToVocabulary}
              className="flex items-center gap-2 px-4 py-2 border-2 border-border hover:border-primary hover:text-primary rounded-xl font-medium transition-all text-sm"
            >
              🔖 내 단어장에 추가
            </button>
          </div>
        </div>
      </section>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left: Examples + Etymology */}
        <div className="lg:col-span-2 space-y-8">
          {/* Examples */}
          {examples.length > 0 ? (
            examples.map((ex) => (
              <div key={ex.id} className="bg-card border border-border rounded-xl overflow-hidden">
                <div className="px-6 py-4 border-b border-border flex items-center justify-between">
                  <h2 className="font-bold flex items-center gap-2">📄 실전 예문</h2>
                  {ex.sourceUrl ? (
                    <a
                      href={ex.sourceUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs font-medium text-muted-foreground bg-muted px-2 py-1 rounded hover:text-primary transition-colors"
                    >
                      {ex.sourceName} ↗
                    </a>
                  ) : (
                    <span className="text-xs font-medium text-muted-foreground bg-muted px-2 py-1 rounded">
                      {ex.sourceName}
                    </span>
                  )}
                </div>
                <div className="p-8">
                  <p className="text-xl md:text-2xl leading-relaxed mb-6">{ex.sentence}</p>
                  <p className="text-muted-foreground text-lg">{ex.translation}</p>
                </div>
              </div>
            ))
          ) : (
            <div className="bg-card border border-border rounded-xl p-8 text-center text-muted-foreground">
              예문 준비 중입니다.
            </div>
          )}

          {/* Etymology */}
          <div className="bg-card border border-border rounded-xl p-6">
            <h2 className="font-bold flex items-center gap-2 mb-8">🌳 어원 분석</h2>
            {morphemes.length === 0 ? (
              <p className="text-sm text-muted-foreground text-center py-6">
                어원 분석 준비 중입니다.
              </p>
            ) : (
              <div className="flex flex-col md:flex-row items-center justify-center gap-4">
                {morphemes.map((m, idx) => (
                  <div key={m.id} className="flex items-center gap-4 flex-1 w-full">
                    {idx > 0 && (
                      <span className="hidden md:block text-muted-foreground">+</span>
                    )}
                    <div
                      className={`flex-1 text-center p-4 rounded-xl ${MORPHEME_STYLES[m.type]?.block ?? ""}`}
                    >
                      <div className={`font-bold text-xl mb-1 ${MORPHEME_STYLES[m.type]?.text ?? ""}`}>
                        {m.morpheme}
                      </div>
                      <div className="text-sm text-muted-foreground">{m.meaning}</div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Right: Derivatives */}
        {derivatives.length > 0 && (
          <div className="space-y-4">
            <h2 className="font-bold px-2">🔗 같은 어원의 개발 용어</h2>
            {derivatives.map((d) => (
              <div
                key={d.id}
                className="p-4 bg-card border border-border rounded-xl hover:border-primary/50 transition-colors"
              >
                <p className="font-bold text-lg">{d.derivativeWord}</p>
                <p className="text-sm text-muted-foreground">{d.derivativeMeaning}</p>
              </div>
            ))}
          </div>
        )}
      </div>

      <Separator className="my-12" />

      {/* Action Footer */}
      <div className="flex flex-col md:flex-row items-center gap-4">
        <Link
          href="/drill/fill-in"
          className="w-full md:w-auto px-8 py-4 bg-primary text-primary-foreground font-bold rounded-xl hover:bg-primary/90 transition-all text-center"
        >
          빈칸 채우기 연습
        </Link>
        <Link
          href="/drill/dictation"
          className="w-full md:w-auto px-8 py-4 border-2 border-border hover:bg-muted font-bold rounded-xl transition-all text-center"
        >
          받아쓰기 연습
        </Link>
        <Link
          href="/flashcard"
          className="w-full md:w-auto px-8 py-4 border-2 border-border hover:bg-muted font-bold rounded-xl transition-all text-center"
        >
          플래시카드
        </Link>
      </div>
    </main>
  );
}
