"use client";

import { useRouter, usePathname } from "next/navigation";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useCallback, useTransition } from "react";
import { useDebouncedCallback } from "use-debounce";

interface WordFiltersProps {
  readonly defaultSearch: string;
  readonly defaultStatus: string;
}

export function WordFilters({ defaultSearch, defaultStatus }: WordFiltersProps) {
  const router = useRouter();
  const pathname = usePathname();
  const [, startTransition] = useTransition();

  const updateParam = useCallback(
    (key: string, value: string) => {
      const params = new URLSearchParams(window.location.search ?? "");
      if (value && value !== "all") {
        params.set(key, value);
      } else {
        params.delete(key);
      }
      params.delete("page");
      startTransition(() => {
        router.push(`${pathname}?${params.toString()}`);
      });
    },
    [router, pathname]
  );

  const handleSearch = useDebouncedCallback(
    (value: string) => updateParam("search", value),
    300
  );

  return (
    <div className="flex flex-col md:flex-row md:items-center gap-4">
      <div className="flex-1 flex items-stretch">
        <Input
          type="text"
          defaultValue={defaultSearch}
          onChange={(e) => handleSearch(e.target.value)}
          placeholder="영단어 검색 (예: destructure, hydration)..."
          className="h-12 w-full"
        />
      </div>
      <Select
        defaultValue={defaultStatus}
        onValueChange={(value) => updateParam("status", value ?? "all")}
      >
        <SelectTrigger className="w-full md:w-[160px] h-12 shrink-0">
          <SelectValue placeholder="상태: 전체" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">상태: 전체</SelectItem>
          <SelectItem value="verified">검증됨</SelectItem>
          <SelectItem value="unreviewed">미검수</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
}
