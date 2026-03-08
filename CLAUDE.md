# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

**DEV-ENGLISH** is an open-source web application that helps junior developers learn English vocabulary from real official programming documentation (React, Next.js, MDN, etc.). It provides contextual examples crawled from official docs, etymology analysis, and flashcard-based learning. Target: free, statically hosted, <400ms load time.

The monorepo uses **Turborepo** — app source lives under `apps/web/` (Next.js) with future `apps/mobile/` (React Native/Expo) planned.

## Repository Structure

```
/                               # Git root — Turborepo workspace root
├── AGENTS.md                   # Global AI standards (highest authority — read first)
├── CLAUDE.md                   # This file
├── turbo.json                  # Turborepo pipeline config
├── package.json                # Workspace root (pnpm workspaces)
├── docs/                       # All project documentation
│   ├── 01_Concept_Design/
│   ├── 02_UI_Screens/
│   ├── 03_Technical_Specs/
│   ├── 04_Logic_Progress/
│   └── 05_QA_Validation/
├── apps/
│   ├── web/                    # Next.js App Router (Vercel 배포 루트)
│   └── mobile/                 # React Native/Expo (미래)
└── packages/
    ├── ui/                     # 웹/모바일 공유 shadcn/ui 컴포넌트
    ├── db/                     # 공유 Drizzle 스키마 및 Turso 클라이언트
    └── types/                  # 공유 TypeScript 타입
```

## Commands

```bash
# 루트(/)에서 실행
pnpm dev                    # apps/web Next.js 개발 서버 (localhost:3000)
pnpm build                  # apps/web 프로덕션 빌드

# 타입 체크 (apps/web에서)
node_modules/.bin/tsc --noEmit

# DB 마이그레이션 (apps/web에서, .env.local 필요)
export $(grep -v '^#' .env.local | xargs)
node_modules/.bin/drizzle-kit generate   # 마이그레이션 파일 생성
node_modules/.bin/drizzle-kit migrate    # Turso에 적용
# ※ Turso는 다중 SQL 구문 미지원 → 구문별 분리 또는 turso db shell 직접 실행

# 초기 데이터 투입 (apps/web에서)
node_modules/.bin/tsx scripts/seed.ts

# Turso DB 직접 접근
turso db shell dev-english
```

## Mandatory Workflow (from AGENTS.md)

**Before any code modification:**
1. Report the modification plan and explicitly state: "OOO 기능을 수정하겠습니다"
2. Wait for explicit user approval — do not proceed without a clear "Yes"
3. Self-check: Was the plan explained? Is approval given? Is impact isolated? Was enough discussion held? If any answer is N, ask instead of acting.

**Never:**
- Modify code during a general Q&A conversation
- Guess or answer from memory — verify with tools before responding
- Define task completion unilaterally (user says "start coding" or "nothing more to add")
- Commit `.env*` files
- Run destructive DB commands without a full backup first

## Tech Standards

- **Schema validation**: Zod (required at all system boundaries)
- **Date/time**: Luxon (no raw `Date` usage)
- **TypeScript**: strict mode — never disable; avoid `any`, use `unknown` or explicit types
- **Env files**: `.env.development` / `.env.local` for local; `.env.production` for production. Never commit either.
- **No arbitrary tech stack changes or downgrades**

## Git Commit Convention

Format: `type(scope): 한글 설명`
Types: `feat`, `fix`, `docs`, `style`, `refactor`, `test`, `chore`
Body: 3+ lines, each starting with `- `, describing concrete changes.

Example:
```
feat(vocabulary): 단어장 기본 목록 컴포넌트 구현

- WordList 컴포넌트를 apps/web/components/vocabulary/에 생성
- Zod로 단어 데이터 스키마 정의 및 파싱 적용
- 예문 출처(공식 문서명) 표시 UI 포함
```

## Documentation Rules

- The 5-directory structure under `docs/` is strict — no new top-level doc directories
- When modifying docs, preserve existing structure and detailed specs; no full overwrites
- If a task is not defined in existing docs, confirm whether docs need updating before implementing

## Framework

Stack is confirmed in `docs/03_Technical_Specs/00_DEVELOPMENT_PRINCIPLES.md`. Key decisions:

- **Monorepo**: Turborepo + pnpm workspaces. `pnpm dev` from root runs `pnpm --filter web dev`.
- **apps/web**: Next.js 16 App Router (Turbopack). Vercel deployment root = `apps/web`.
- **apps/mobile**: React Native/Expo (Post-MVP).
- **DB Schema**: `apps/web/lib/db-schema.ts` (inlined — not yet using `packages/db` workspace link).
- **Auth**: Better Auth with GitHub OAuth. `account.accountLinking.trustedProviders: ["github"]` 필수.
- **Proxy**: Next.js 16에서 `middleware.ts` → `proxy.ts`로 파일명 변경, 함수명도 `proxy`로.
- **Rendering**: ISR for vocabulary/word-detail pages; SSG for static pages; CSR (`'use client'`) for drill/flashcard interactivity and Web Speech API.
- **DB calls**: Server Component or Route Handler only — never from client.

## Current Implementation Status

구현 완료 페이지: `/`, `/words/[id]`, `/drill`, `/drill/fill-in`, `/drill/dictation`, `/flashcard`, `/my-vocabulary`, `/login`, `/settings`, `/contribute`

API Routes: `POST /api/my-vocabulary`, `DELETE /api/my-vocabulary/[wordId]`, `POST /api/contribute`

미완성: `/api/contribute` DB 저장 로직, 에러 페이지(`not-found.tsx`, `error.tsx`), Vercel 배포

상세 현황: `docs/04_Logic_Progress/01_MVP_PROGRESS.md`

## Known Gotchas

- **Turso 다중 SQL**: `drizzle-kit migrate` 실행 시 SQL 파일에 구문이 여러 개면 `SQL_MANY_STATEMENTS` 오류 발생. SQL을 한 구문씩 분리하거나 `turso db shell`로 직접 실행.
- **Better Auth account 테이블**: `access_token_expires_at`, `refresh_token_expires_at`, `scope` 컬럼이 반드시 있어야 함. 누락 시 `unable_to_create_user` 오류.
- **Better Auth account linking**: `account.accountLinking.trustedProviders`에 provider 추가 필요. 누락 시 `unable_to_link_account` 오류.
