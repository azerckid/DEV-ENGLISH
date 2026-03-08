import { notFound } from "next/navigation";
import { NavBar } from "@/components/layout/NavBar";
import { WordDetailView } from "@/components/words/WordDetailView";
import { db } from "@/lib/db";
import { words, wordExamples, wordMorphemes, wordDerivatives } from "@/lib/db-schema";
import { eq } from "drizzle-orm";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";

export const revalidate = 3600;

interface WordPageProps {
  params: Promise<{ id: string }>;
}

export default async function WordPage({ params }: WordPageProps) {
  const { id } = await params;
  const wordId = Number(id);
  if (isNaN(wordId)) notFound();

  const [word] = await db.select().from(words).where(eq(words.id, wordId)).limit(1);
  if (!word) notFound();

  const [examples, morphemes, derivatives] = await Promise.all([
    db.select().from(wordExamples).where(eq(wordExamples.wordId, wordId)),
    db.select().from(wordMorphemes).where(eq(wordMorphemes.wordId, wordId))
      .orderBy(wordMorphemes.order),
    db.select().from(wordDerivatives).where(eq(wordDerivatives.wordId, wordId)),
  ]);

  const session = await auth.api.getSession({ headers: await headers() });

  return (
    <div className="flex min-h-screen flex-col">
      <NavBar />
      <WordDetailView
        word={word}
        examples={examples}
        morphemes={morphemes}
        derivatives={derivatives}
        isLoggedIn={!!session}
      />
      <footer className="py-8 border-t text-center">
        <p className="text-sm text-muted-foreground">
          © 2026 DEV-ENGLISH. All developer terms curated for excellence.
        </p>
      </footer>
    </div>
  );
}
