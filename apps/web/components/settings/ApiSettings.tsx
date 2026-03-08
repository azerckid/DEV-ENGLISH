"use client";

import { useState, useEffect } from "react";
import { toast } from "sonner";

const STORAGE_KEY = "dev_english_api_key";

export function ApiSettings() {
  const [apiKey, setApiKey] = useState("");
  const [saved, setSaved] = useState(false);
  const [show, setShow] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY) ?? "";
    setApiKey(stored);
    setSaved(!!stored);
  }, []);

  const handleSave = () => {
    const trimmed = apiKey.trim();
    if (!trimmed) {
      toast.error("API 키를 입력해 주세요.");
      return;
    }
    localStorage.setItem(STORAGE_KEY, trimmed);
    setSaved(true);
    toast.success("API 키가 저장되었습니다.");
  };

  const handleDelete = () => {
    localStorage.removeItem(STORAGE_KEY);
    setApiKey("");
    setSaved(false);
    toast.info("API 키가 삭제되었습니다.");
  };

  return (
    <div className="flex flex-col items-center py-8 px-4">
      <div className="w-full max-w-[640px]">
        <div className="mb-8">
          <h1 className="text-3xl font-extrabold tracking-tight mb-1">설정</h1>
          <p className="text-muted-foreground text-sm">AI 기능을 사용하기 위한 API 키를 관리합니다.</p>
        </div>

        <div className="bg-card border border-border rounded-2xl shadow-sm p-6 flex flex-col gap-6">
          <div>
            <h2 className="text-lg font-bold mb-1">Claude API 키</h2>
            <p className="text-muted-foreground text-sm mb-4">
              키는 브라우저의 localStorage에만 저장되며 서버로 전송되지 않습니다.
            </p>

            <div className="flex gap-2 mb-3">
              <div className="relative flex-1">
                <input
                  type={show ? "text" : "password"}
                  value={apiKey}
                  onChange={(e) => {
                    setApiKey(e.target.value);
                    setSaved(false);
                  }}
                  placeholder="sk-ant-..."
                  className="w-full px-4 py-3 bg-muted/50 border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary font-mono text-sm pr-12"
                />
                <button
                  type="button"
                  onClick={() => setShow((s) => !s)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors text-xs font-semibold"
                >
                  {show ? "숨기기" : "보기"}
                </button>
              </div>
            </div>

            <div className="flex gap-3">
              <button
                onClick={handleSave}
                className="px-5 py-2.5 bg-primary text-primary-foreground font-bold rounded-xl hover:bg-primary/90 transition-all text-sm"
              >
                저장
              </button>
              {saved && (
                <button
                  onClick={handleDelete}
                  className="px-5 py-2.5 border-2 border-rose-200 dark:border-rose-900 text-rose-600 dark:text-rose-400 font-bold rounded-xl hover:bg-rose-50 dark:hover:bg-rose-950/30 transition-all text-sm"
                >
                  삭제
                </button>
              )}
            </div>
          </div>

          {saved && (
            <div className="flex items-center gap-2 px-4 py-3 bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-900 rounded-xl">
              <span className="text-emerald-600 dark:text-emerald-400 text-sm font-semibold">✓ API 키가 저장되어 있습니다.</span>
            </div>
          )}

          <div className="pt-2 border-t border-border">
            <p className="text-xs text-muted-foreground">
              API 키는 Anthropic Console에서 발급받을 수 있습니다. 키는 절대 외부로 공유하지 마세요.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
