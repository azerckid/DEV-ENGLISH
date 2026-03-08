"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { signIn } from "@/lib/auth-client";
import { toast } from "sonner";

interface LoginFormProps {
  readonly redirectTo?: string;
}

export function LoginForm({ redirectTo }: LoginFormProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handleGitHub = async () => {
    setLoading(true);
    try {
      await signIn.social({
        provider: "github",
        callbackURL: redirectTo ?? "/",
      });
    } catch {
      toast.error("로그인에 실패했습니다. 다시 시도해 주세요.");
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-1 items-center justify-center py-16 px-4">
      <div className="w-full max-w-sm">
        <div className="bg-card border border-border rounded-2xl shadow-xl p-8 flex flex-col items-center gap-6">
          <div className="text-center">
            <p className="text-3xl mb-3">🔐</p>
            <h1 className="text-2xl font-extrabold tracking-tight mb-1">로그인</h1>
            <p className="text-muted-foreground text-sm">
              내 단어장을 이용하려면 로그인이 필요합니다.
            </p>
          </div>

          <button
            onClick={handleGitHub}
            disabled={loading}
            className="w-full flex items-center justify-center gap-3 h-12 bg-[#24292e] hover:bg-[#1a1e22] text-white font-bold rounded-xl transition-all disabled:opacity-60 disabled:cursor-not-allowed"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 0C5.374 0 0 5.373 0 12c0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23A11.509 11.509 0 0 1 12 5.803c1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576C20.566 21.797 24 17.3 24 12c0-6.627-5.373-12-12-12z" />
            </svg>
            {loading ? "연결 중..." : "GitHub으로 로그인"}
          </button>

          <p className="text-xs text-muted-foreground text-center">
            로그인 시 서비스 이용약관에 동의하는 것으로 간주합니다.
          </p>
        </div>
      </div>
    </div>
  );
}
