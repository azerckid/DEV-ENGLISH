# MVP 구현 진행 상황
> Created: 2026-03-08
> Last Updated: 2026-03-08

## 1. 완료된 작업

### 1.1 인프라 · 환경 설정

| 항목 | 상태 | 비고 |
|---|---|---|
| Turborepo 모노레포 초기화 | ✅ | `pnpm-workspace.yaml`, `turbo.json`, 루트 `package.json` |
| Next.js 16 앱 생성 | ✅ | `apps/web/` — App Router, Turbopack |
| Turso DB 생성 | ✅ | `dev-english-azerckid.aws-ap-northeast-1.turso.io` |
| Drizzle 마이그레이션 적용 | ✅ | 9개 테이블 생성 완료 |
| Better Auth (GitHub OAuth) | ✅ | `account.accountLinking.trustedProviders: ["github"]` 설정 포함 |
| `.env.local` 설정 | ✅ | Turso URL/Token, BETTER_AUTH_SECRET, GitHub OAuth 완료 |
| `pnpm dev` 루트 실행 | ✅ | `pnpm --filter web dev` 방식, 경고 없음 |

### 1.2 DB 스키마

| 테이블 | 상태 |
|---|---|
| `user`, `session`, `account`, `verification` | ✅ Better Auth 전용 |
| `words` | ✅ |
| `word_examples` | ✅ |
| `word_morphemes` | ✅ |
| `word_derivatives` | ✅ |
| `user_vocabulary` | ✅ `(userId, wordId)` unique 제약 |

> **주의**: `account` 테이블의 `expiresAt` 컬럼은 초기 스키마에서 누락된 Better Auth 필드로 인해 로그인 오류가 발생했음.
> `access_token_expires_at`, `refresh_token_expires_at`, `scope` 컬럼을 Turso shell에서 직접 추가하고 스키마에 반영 완료.

### 1.3 구현된 페이지 및 컴포넌트

| 스크린 | URL | 서버 파일 | 클라이언트 컴포넌트 | 상태 |
|---|---|---|---|---|
| S-01 단어 목록 | `/` | `app/page.tsx` | `WordFilters`, `WordGrid` | ✅ |
| S-02 단어 상세 | `/words/[id]` | `app/words/[id]/page.tsx` | `WordDetailView` | ✅ |
| S-03 드릴 선택 | `/drill` | `app/drill/page.tsx` | — | ✅ |
| S-04 빈칸 채우기 | `/drill/fill-in` | `app/drill/fill-in/page.tsx` | `DrillFillIn` | ✅ |
| S-05 받아쓰기 | `/drill/dictation` | `app/drill/dictation/page.tsx` | `DrillDictation` | ✅ |
| S-06 플래시카드 | `/flashcard` | `app/flashcard/page.tsx` | `FlashcardGame` | ✅ |
| S-07 기여하기 | `/contribute` | `app/contribute/page.tsx` | `ContributeForm` | ✅ (저장 미구현) |
| S-08 설정 | `/settings` | `app/settings/page.tsx` | `ApiSettings` | ✅ |
| S-09 내 단어장 | `/my-vocabulary` | `app/my-vocabulary/page.tsx` | `MyVocabulary` | ✅ |
| 로그인 | `/login` | `app/login/page.tsx` | `LoginForm` | ✅ |

### 1.4 API Route 핸들러

| 엔드포인트 | 메서드 | 기능 | 상태 |
|---|---|---|---|
| `/api/auth/[...all]` | GET/POST | Better Auth 핸들러 | ✅ |
| `/api/my-vocabulary` | POST | 단어장에 단어 추가 (auth 필수) | ✅ |
| `/api/my-vocabulary/[wordId]` | DELETE | 단어장에서 단어 삭제 (auth 필수) | ✅ |
| `/api/contribute` | POST | 기여 텍스트 수신 (console.log만) | ⚠️ DB 저장 미구현 |

### 1.5 초기 데이터

- `apps/web/scripts/seed.ts` 작성 및 실행 완료
- 20개 단어 투입 (examples, morphemes, derivatives 포함)
- 실행 방법: `export $(grep -v '^#' .env.local | xargs) && node_modules/.bin/tsx scripts/seed.ts`

---

## 2. 미완성 / 다음 작업

### 우선순위 높음

| 작업 | 설명 |
|---|---|
| 기여 파이프라인 DB 저장 | `/api/contribute`에서 제출 데이터를 DB에 저장하는 로직 |
| 에러 페이지 | `app/not-found.tsx`, `app/error.tsx` 미구현 |
| 단어 데이터 확충 | 현재 20개, 최소 100개 이상 필요 |

### 우선순위 중간

| 작업 | 설명 |
|---|---|
| 드릴/플래시카드 필터 | 현재 최신 20개 고정 → 카테고리·랜덤·오답 필터 필요 |
| 다크 모드 토글 | NavBar에 테마 전환 버튼 없음 |
| 홈 검색·필터 동작 검증 | `WordFilters` URL 파라미터 연동 확인 |

### 우선순위 낮음 (Post-MVP)

| 작업 | 설명 |
|---|---|
| Vercel 배포 | 프로덕션 환경 설정 및 도메인 연결 |
| 기여 파이프라인 Claude API 연동 | 제출 텍스트에서 단어 자동 추출 |
| 관리자 검수 페이지 | `status: 'unreviewed'` 단어 관리 |
| React Native 앱 | `apps/mobile/` — Post-MVP |

---

## 3. 주요 트러블슈팅 기록

| 문제 | 원인 | 해결 |
|---|---|---|
| GitHub 로그인 `unable_to_create_user` | `account` 테이블에 `access_token_expires_at`, `refresh_token_expires_at`, `scope` 컬럼 누락 | Turso shell로 직접 `ALTER TABLE` 실행 후 스키마 업데이트 |
| GitHub 로그인 `unable_to_link_account` | `account.accountLinking.trustedProviders` 미설정 | `auth.ts`에 `trustedProviders: ["github"]` 추가 |
| `pnpm dev` 루트 실행 실패 | turbo 미설치 (node_modules 누락) | `pnpm install` 후 루트 dev 스크립트를 `pnpm --filter web dev`로 변경 |
| `middleware.ts` deprecated 경고 | Next.js 16에서 파일명 변경 | `middleware.ts` → `proxy.ts`, 함수명 `proxy`로 변경 |
| `drizzle-kit migrate` 다중 SQL 오류 | Turso HTTP API가 단일 트랜잭션에서 다중 구문 미지원 | SQL을 구문별로 분리하여 Turso shell에서 개별 실행 |
| `import { limit } from "drizzle-orm"` 오류 | `limit`은 drizzle-orm export 아님, 쿼리 빌더 메서드 | `import` 제거 후 `.limit(20)` 체인 메서드로 사용 |
| lockfile 중복 경고 | `apps/web/pnpm-lock.yaml`와 루트 lockfile 충돌 | `apps/web/pnpm-lock.yaml` 삭제 |
| Turbopack workspace root 경고 | 모노레포 루트 감지 실패 | `next.config.ts`에 `turbopack.root` 명시 |

---

## X. Related Documents
- **Technical_Specs**: [Development Principles](../03_Technical_Specs/00_DEVELOPMENT_PRINCIPLES.md)
- **Technical_Specs**: [Data Model](../03_Technical_Specs/01_DATA_MODEL.md)
- **UI_Screens**: [Sitemap](../02_UI_Screens/00_SITEMAP.md)
