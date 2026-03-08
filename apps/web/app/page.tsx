import { NavBar } from "@/components/layout/NavBar";
import { WordGrid } from "@/components/words/WordGrid";
import { WordFilters } from "@/components/words/WordFilters";
import { db } from "@/lib/db";
import { words } from "@/lib/db-schema";
import { desc, like, eq, and, type SQL } from "drizzle-orm";
import type { InferSelectModel } from "drizzle-orm";

export const revalidate = 3600;

type Word = InferSelectModel<typeof words>;

interface HomePageProps {
  searchParams: Promise<{
    search?: string;
    status?: string;
    page?: string;
  }>;
}

const PAGE_SIZE = 20;

export default async function HomePage({ searchParams }: HomePageProps) {
  const params = await searchParams;
  const search = params.search ?? "";
  const status = params.status ?? "all";
  const page = Math.max(1, Number(params.page ?? 1));

  const conditions: SQL[] = [];
  if (search) conditions.push(like(words.word, `%${search}%`));
  if (status !== "all") conditions.push(eq(words.status, status));

  let allWords: Word[] = [];
  try {
    allWords = await db
      .select()
      .from(words)
      .where(conditions.length > 0 ? and(...conditions) : undefined)
      .orderBy(desc(words.createdAt));
  } catch {
    // DB not connected — shows empty state
  }

  const totalPages = Math.max(1, Math.ceil(allWords.length / PAGE_SIZE));
  const paginated = allWords.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  return (
    <div className="flex min-h-screen flex-col">
      <NavBar />
      <main className="flex-1 w-full max-w-[1200px] mx-auto px-6 md:px-10 py-8">
        <div className="mb-10">
          <div className="mb-6">
            <h2 className="text-3xl font-extrabold tracking-tight mb-2">
              Vocabulary Explorer
            </h2>
            <p className="text-muted-foreground">
              개발 실무에 바로 쓰이는 기술 용어와 영단어를 학습하세요.
            </p>
          </div>
          <WordFilters defaultSearch={search} defaultStatus={status} />
        </div>
        <WordGrid words={paginated} totalPages={totalPages} currentPage={page} />
      </main>
      <footer className="mt-auto py-10 border-t text-center">
        <p className="text-sm text-muted-foreground">
          © 2026 DEV-ENGLISH. Built for developers by developers.
        </p>
      </footer>
    </div>
  );
}
