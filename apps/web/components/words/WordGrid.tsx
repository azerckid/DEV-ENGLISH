import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import type { InferSelectModel } from "drizzle-orm";
import type { words } from "@/lib/db-schema";

type Word = InferSelectModel<typeof words>;

interface WordGridProps {
  readonly words: Word[];
  readonly totalPages: number;
  readonly currentPage: number;
}

function WordCard({ word }: { readonly word: Word }) {
  const isVerified = word.status === "verified";

  return (
    <Link href={`/words/${word.id}`} className="block h-full">
      <Card className="group h-full hover:shadow-xl hover:shadow-primary/5 hover:border-primary/30 transition-all cursor-pointer">
        <CardContent className="p-6">
          <div className="flex justify-between items-start mb-4">
            <h3 className="text-2xl font-bold tracking-tight">{word.word}</h3>
            <Badge variant={isVerified ? "default" : "secondary"}>
              {isVerified ? "검증됨" : "미검수"}
            </Badge>
          </div>
          <p className="text-sm text-muted-foreground mb-2 italic">
            {word.partOfSpeech}
            {word.pronunciation ? ` · ${word.pronunciation}` : ""}
          </p>
          <p className="text-lg font-medium">{word.koreanMeaning}</p>
        </CardContent>
      </Card>
    </Link>
  );
}

function EmptyState() {
  return (
    <div className="flex flex-col items-center justify-center py-24 text-center">
      <p className="text-lg font-medium text-muted-foreground mb-2">
        검색 결과가 없습니다
      </p>
      <p className="text-sm text-muted-foreground mb-6">
        다른 검색어나 필터를 시도해보세요.
      </p>
      <Link
        href="/"
        className="px-4 py-2 rounded-lg border border-border hover:bg-muted transition-colors text-sm font-medium"
      >
        필터 초기화
      </Link>
    </div>
  );
}

export function WordGrid({ words, totalPages, currentPage }: WordGridProps) {
  if (words.length === 0) return <EmptyState />;

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {words.map((word) => (
          <WordCard key={word.id} word={word} />
        ))}
      </div>

      {totalPages > 1 && (
        <Pagination>
          <PaginationContent>
            {currentPage > 1 && (
              <PaginationItem>
                <PaginationPrevious href={`/?page=${currentPage - 1}`} />
              </PaginationItem>
            )}
            {Array.from({ length: totalPages }).map((_, i) => (
              <PaginationItem key={i + 1}>
                <PaginationLink
                  href={`/?page=${i + 1}`}
                  isActive={currentPage === i + 1}
                >
                  {i + 1}
                </PaginationLink>
              </PaginationItem>
            ))}
            {currentPage < totalPages && (
              <PaginationItem>
                <PaginationNext href={`/?page=${currentPage + 1}`} />
              </PaginationItem>
            )}
          </PaginationContent>
        </Pagination>
      )}
    </div>
  );
}
