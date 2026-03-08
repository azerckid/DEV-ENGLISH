import Link from "next/link";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";

const NAV_LINKS = [
  { label: "드릴 모드", href: "/drill" },
  { label: "플래시카드", href: "/flashcard" },
  { label: "기여하기", href: "/contribute" },
  { label: "설정", href: "/settings" },
] as const;

export async function NavBar() {
  const session = await auth.api.getSession({ headers: await headers() });

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-background/80 backdrop-blur-md">
      <div className="max-w-[1200px] mx-auto px-6 md:px-10 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-3">
          <div className="size-8 bg-primary rounded-lg flex items-center justify-center text-primary-foreground">
            <span className="font-mono text-sm font-bold">&gt;_</span>
          </div>
          <span className="font-mono text-xl font-bold tracking-tight text-primary">
            DEV-ENGLISH
          </span>
        </Link>

        <nav className="hidden md:flex items-center gap-1">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="px-3 py-2 text-sm font-medium rounded-lg hover:bg-muted transition-colors"
            >
              {link.label}
            </Link>
          ))}

          {session && (
            <Link
              href="/my-vocabulary"
              className="px-3 py-2 text-sm font-medium rounded-lg hover:bg-muted transition-colors"
            >
              내 단어장
            </Link>
          )}

          {session ? (
            <Link
              href="/api/auth/signout"
              className="ml-4 px-3 py-2 text-sm font-medium rounded-lg border border-border hover:bg-muted transition-colors"
            >
              로그아웃
            </Link>
          ) : (
            <Link
              href="/login"
              className="ml-4 px-3 py-2 text-sm font-medium rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 transition-colors"
            >
              로그인
            </Link>
          )}
        </nav>
      </div>
    </header>
  );
}
