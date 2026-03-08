# Development Principles: DEV-ENGLISH
> Created: 2026-03-08
> Last Updated: 2026-03-08 (Turborepo 도입, 디렉토리 구조 변경)

## 1. 확정 기술 스택

| 영역 | 기술 | 선택 이유 |
|---|---|---|
| 모노레포 | Turborepo | 웹/모바일 공유 패키지 관리, 빌드 캐싱, 병렬 태스크 실행 |
| 프레임워크 | Next.js (App Router) | SSG/ISR 지원, 정적 배포 가능, 향후 서버 기능 확장 용이 |
| 언어 | TypeScript (strict) | 타입 안전성, 오픈소스 기여자 온보딩 |
| 스타일 | Tailwind CSS | 빠른 반응형 UI 구현, 클래스 기반 일관성 |
| UI 컴포넌트 | shadcn/ui | Tailwind 기반, 복사 방식으로 오픈소스 수정 용이 |
| DB | Turso (libSQL) | 엣지 배포 친화적, 무료 티어, SQLite 호환 |
| ORM | Drizzle ORM | Turso 공식 권장, TypeScript-first, 스키마 타입 자동 추론 |
| 인증 | Better Auth | Drizzle + Turso 공식 통합, shadcn/ui UI 제공 |
| 스키마 검증 | Zod | API 요청/응답, env 파싱 전 경계 검증 (AGENTS.md 필수) |
| 날짜/시간 | Luxon | 날짜 처리 통일, 네이티브 Date 사용 금지 (AGENTS.md 필수) |
| Toast 알림 | Sonner | shadcn/ui 생태계 표준 Toast 라이브러리 |
| 에러 처리 | Next.js error.tsx + Error Boundary | App Router 내장, 서버/클라이언트 에러 분리 처리 |
| AI 어원 생성 | Claude API / OpenAI API | 사용자가 설정에서 선택. API Key는 사용자가 직접 입력 (브라우저 로컬스토리지 저장) |
| 음성(TTS) | Web Speech API | 브라우저 내장, 외부 비용 없음 |
| 배포 | Vercel | Next.js 공식 호스팅, Edge Network, 무료 티어 |
| 패키지 매니저 | pnpm | 빠른 설치, 디스크 효율 |

## 2. 모노레포 디렉토리 구조

```
/ (Git 루트 — Turborepo workspace root)
├── docs/
├── AGENTS.md
├── CLAUDE.md
├── turbo.json                        # Turborepo 파이프라인 설정
├── package.json                      # pnpm workspace 루트
├── apps/
│   ├── web/                          # Next.js 앱 (Vercel 배포 루트: apps/web)
│   │   ├── app/                      # Next.js App Router
│   │   │   ├── layout.tsx            # 글로벌 레이아웃 (네비게이션 포함)
│   │   │   ├── page.tsx              # S-01 단어장 목록 (/)
│   │   │   ├── words/
│   │   │   │   └── [id]/
│   │   │   │       └── page.tsx      # S-02 단어 상세 (/words/[id])
│   │   │   ├── drill/
│   │   │   │   ├── page.tsx          # S-03 드릴 모드 선택 (/drill)
│   │   │   │   ├── fill-in/
│   │   │   │   │   └── page.tsx      # S-04 빈칸 채우기 (/drill/fill-in)
│   │   │   │   └── dictation/
│   │   │   │       └── page.tsx      # S-05 받아쓰기 (/drill/dictation)
│   │   │   └── flashcard/
│   │   │       └── page.tsx          # S-06 플래시카드 게임 (/flashcard)
│   │   ├── components/               # web 전용 UI 컴포넌트
│   │   ├── lib/                      # web 전용 유틸리티
│   │   ├── public/
│   │   ├── .env.local                # 로컬 전용 (Git 제외)
│   │   ├── next.config.ts
│   │   ├── tailwind.config.ts
│   │   └── package.json
│   └── mobile/                       # React Native/Expo (Post-MVP)
├── packages/
│   ├── ui/                           # 공유 shadcn/ui 컴포넌트
│   │   └── package.json
│   ├── db/                           # 공유 Drizzle 스키마 + Turso 클라이언트
│   │   ├── schema.ts                 # 전체 DB 스키마 정의
│   │   ├── seed.ts                   # 초기 데이터 투입 스크립트
│   │   ├── drizzle.config.ts
│   │   └── package.json
│   └── types/                        # 공유 TypeScript 타입
│       └── package.json
```

## 3. 렌더링 전략

| 화면 | 전략 | 이유 |
|---|---|---|
| S-01 단어장 목록 | ISR (`revalidate: 3600`) | 데이터는 자주 바뀌지 않음, 빠른 TTFB 필요 |
| S-02 단어 상세 | ISR (`revalidate: 3600`) | 동일 이유, 단어별 정적 페이지 생성 |
| S-03 드릴 모드 선택 | SSG (정적) | 콘텐츠 변화 없음 |
| S-04 빈칸 채우기 | CSR (`'use client'`) | 사용자 입력 인터랙션 |
| S-05 받아쓰기 | CSR (`'use client'`) | Web Speech API는 브라우저 전용 |
| S-06 플래시카드 게임 | CSR (`'use client'`) | 카드 뒤집기 인터랙션 |

## 4. 환경변수 규칙

```
# apps/web/.env.local (로컬 전용 — Git 제외)
TURSO_DATABASE_URL=libsql://...
TURSO_AUTH_TOKEN=...
BETTER_AUTH_SECRET=...
BETTER_AUTH_URL=http://localhost:3000

# Vercel 대시보드 (운영 — 파일로 관리 금지)
TURSO_DATABASE_URL=libsql://...
TURSO_AUTH_TOKEN=...
BETTER_AUTH_SECRET=...
BETTER_AUTH_URL=https://your-production-domain.com
```

- `TURSO_DATABASE_URL`, `TURSO_AUTH_TOKEN`, `BETTER_AUTH_SECRET` 은 서버 전용. 클라이언트에 절대 노출 금지.
- `NEXT_PUBLIC_*` prefix는 클라이언트에 노출되므로 위 변수에 사용 금지.
- `BETTER_AUTH_URL`은 로컬과 운영 환경을 반드시 분리 설정.
- Claude API Key / OpenAI API Key는 **서버로 전송하지 않음**. 브라우저 로컬스토리지에만 저장하고 클라이언트에서 직접 AI API 호출.

## 5. 코드 규칙

- **라우터**: App Router 단일 사용. `pages/` 디렉토리 생성 금지.
- **서버/클라이언트 경계**: DB 조회는 Server Component 또는 Route Handler에서만. 클라이언트에서 직접 Turso 호출 금지.
- **`'use client'` 사용 기준**: 사용자 입력, 브라우저 API(Web Speech API), 상태(useState/useEffect)가 필요한 컴포넌트에만 적용.
- **UI 컴포넌트**: shadcn/ui 컴포넌트를 우선 사용. 신규 컴포넌트 추가 전 shadcn/ui 카탈로그 먼저 확인.
- **Toast**: 사용자 피드백(성공/실패/에러 알림)은 Sonner 단일 사용. `alert()` 사용 금지.
- **에러 처리**:
  - 서버 에러: `app/error.tsx` (라우트별) 및 `app/global-error.tsx` (전역)로 처리.
  - 클라이언트 에러: `ErrorBoundary` 컴포넌트로 감싸기.
  - 사용자에게 노출되는 에러 메시지는 반드시 Sonner Toast로 표시.
- **이미지**: `next/image` 사용. 외부 이미지 사용 시 `remotePatterns` 등록 필수.
- **any 금지**: TypeScript `any` 사용 시 이유 주석 필수. `unknown` 또는 구체 타입 우선.

## 6. Git 제외 대상 (.gitignore 필수 항목)

```
.env*
.next/
node_modules/
.turso/
.turbo/
```

## X. Related Documents
- **Concept_Design**: [Product Specs](../01_Concept_Design/03_PRODUCT_SPECS.md) - MVP 기능 정의
- **Technical_Specs**: [Data Model](./01_DATA_MODEL.md) - DB 스키마 상세
- **UI_Screens**: [Sitemap](../02_UI_Screens/00_SITEMAP.md) - 화면 목록 및 URL 구조
