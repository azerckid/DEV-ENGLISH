import { NavBar } from "@/components/layout/NavBar";
import { FlashcardGame } from "@/components/flashcard/FlashcardGame";
import { db } from "@/lib/db";
import { words, wordExamples } from "@/lib/db-schema";
import { eq } from "drizzle-orm";

export const dynamic = "force-dynamic";

export default async function FlashcardPage() {
  const rows = await db
    .select({
      wordId: words.id,
      word: words.word,
      koreanMeaning: words.koreanMeaning,
      sentence: wordExamples.sentence,
      sourceName: wordExamples.sourceName,
    })
    .from(words)
    .leftJoin(wordExamples, eq(wordExamples.wordId, words.id))
    .limit(20);

  const seen = new Set<number>();
  const cards = rows
    .filter((r) => {
      if (seen.has(r.wordId)) return false;
      seen.add(r.wordId);
      return true;
    })
    .map((r) => ({
      wordId: r.wordId,
      word: r.word,
      koreanMeaning: r.koreanMeaning,
      exampleSentence: r.sentence
        ? r.sentence.replace(new RegExp(r.word, "gi"), "______")
        : "",
      sourceName: r.sourceName ?? "DEV-ENGLISH",
    }));

  return (
    <div className="flex min-h-screen flex-col">
      <NavBar />
      <FlashcardGame cards={cards} />
    </div>
  );
}
