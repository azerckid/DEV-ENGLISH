import { NavBar } from "@/components/layout/NavBar";
import { DrillDictation } from "@/components/drill/DrillDictation";
import { db } from "@/lib/db";
import { words } from "@/lib/db-schema";

export const dynamic = "force-dynamic";

export default async function DictationPage() {
  const rows = await db
    .select({ wordId: words.id, word: words.word })
    .from(words)
    .limit(20);

  const items = rows.map((r) => ({
    wordId: r.wordId,
    word: r.word,
    sourceName: "DEV-ENGLISH",
  }));

  return (
    <div className="flex min-h-screen flex-col">
      <NavBar />
      <DrillDictation items={items} />
    </div>
  );
}
