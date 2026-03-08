import { NavBar } from "@/components/layout/NavBar";
import { DrillFillIn } from "@/components/drill/DrillFillIn";
import { db } from "@/lib/db";
import { words, wordExamples } from "@/lib/db-schema";
import { eq } from "drizzle-orm";

export const dynamic = "force-dynamic";

export default async function FillInPage() {
  // 예문이 있는 단어들을 가져와서 드릴 아이템 구성
  const rows = await db
    .select({
      wordId: words.id,
      word: words.word,
      sentence: wordExamples.sentence,
      sourceName: wordExamples.sourceName,
    })
    .from(wordExamples)
    .innerJoin(words, eq(wordExamples.wordId, words.id))
    .limit(20);

  // 각 단어당 첫 번째 예문만 사용, sentence에서 단어 위치를 ___로 치환
  const seen = new Set<number>();
  const items = rows
    .filter((r) => {
      if (seen.has(r.wordId)) return false;
      seen.add(r.wordId);
      return r.sentence.toLowerCase().includes(r.word.toLowerCase());
    })
    .map((r) => ({
      wordId: r.wordId,
      word: r.word,
      sentence: r.sentence.replace(new RegExp(r.word, "gi"), "___"),
      sourceName: r.sourceName,
    }));

  return (
    <div className="flex min-h-screen flex-col">
      <NavBar />
      <DrillFillIn items={items} />
    </div>
  );
}
