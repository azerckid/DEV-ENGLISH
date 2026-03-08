import Link from "next/link";
import { NavBar } from "@/components/layout/NavBar";

export default function DrillSelectPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <NavBar />
      <main className="flex-1 flex flex-col items-center justify-center px-4 py-16">
        <h1 className="text-3xl font-extrabold tracking-tight mb-3">드릴 모드</h1>
        <p className="text-muted-foreground mb-12 text-center">
          학습 방식을 선택하세요.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full max-w-2xl">
          <Link
            href="/drill/fill-in"
            className="flex flex-col gap-4 p-8 bg-card border-2 border-border rounded-2xl hover:border-primary hover:shadow-lg hover:shadow-primary/5 transition-all group"
          >
            <div className="size-12 rounded-xl bg-primary/10 flex items-center justify-center text-primary text-2xl">
              ✏️
            </div>
            <div>
              <h2 className="text-xl font-bold mb-2 group-hover:text-primary transition-colors">
                빈칸 채우기
              </h2>
              <p className="text-sm text-muted-foreground">
                예문에서 단어가 빠진 빈칸을 직접 입력하여 학습합니다.
              </p>
            </div>
          </Link>

          <Link
            href="/drill/dictation"
            className="flex flex-col gap-4 p-8 bg-card border-2 border-border rounded-2xl hover:border-primary hover:shadow-lg hover:shadow-primary/5 transition-all group"
          >
            <div className="size-12 rounded-xl bg-primary/10 flex items-center justify-center text-primary text-2xl">
              🎧
            </div>
            <div>
              <h2 className="text-xl font-bold mb-2 group-hover:text-primary transition-colors">
                받아쓰기
              </h2>
              <p className="text-sm text-muted-foreground">
                발음을 듣고 영단어를 직접 받아써서 철자를 훈련합니다.
              </p>
            </div>
          </Link>
        </div>
      </main>
    </div>
  );
}
