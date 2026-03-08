import { NavBar } from "@/components/layout/NavBar";
import { MyVocabulary } from "@/components/vocabulary/MyVocabulary";
import { db } from "@/lib/db";
import { words, userVocabulary } from "@/lib/db-schema";
import { eq } from "drizzle-orm";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

export const dynamic = "force-dynamic";

export default async function MyVocabularyPage() {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) redirect("/login?redirect=/my-vocabulary");

  const rows = await db
    .select({
      wordId: words.id,
      word: words.word,
      koreanMeaning: words.koreanMeaning,
      partOfSpeech: words.partOfSpeech,
      addedAt: userVocabulary.addedAt,
    })
    .from(userVocabulary)
    .innerJoin(words, eq(userVocabulary.wordId, words.id))
    .where(eq(userVocabulary.userId, session.user.id))
    .orderBy(userVocabulary.addedAt);

  return (
    <div className="flex min-h-screen flex-col">
      <NavBar />
      <MyVocabulary items={rows} />
    </div>
  );
}
