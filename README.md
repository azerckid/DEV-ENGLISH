# DEV-ENGLISH

공식 프로그래밍 문서(React, Next.js, MDN 등)에서 추출한 예문 기반으로 개발자용 영단어를 학습하는 오픈소스 웹 앱입니다.

## 비전

언어의 장벽 없이, 전 세계 공식 문서를 편안하게 읽을 수 있는 개발 생태계를 목표로 합니다. 주니어 개발자·부트캠프 수강생이 개발 맥락에 맞는 영단어를 학습할 수 있도록 완전 무료 오픈소스로 제공합니다.

## 주요 기능

- **개발 컨텍스트 예문**: React, Next.js, MDN 등 공식 문서에서 추출한 실제 예문 제공
- **어원 분석**: 어근·접두사·접미사 단위 분석으로 단어 유추 학습 지원
- **학습 모드**: 빈칸 채우기, 받아쓰기, 플래시카드
- **내 단어장**: GitHub OAuth 로그인 후 단어 저장·관리
- **기여 기능**: 커뮤니티 기반 단어·예문 제안 (검수 파이프라인 예정)

## 기술 스택

| 영역 | 기술 |
|------|------|
| 모노레포 | Turborepo, pnpm workspaces |
| 프레임워크 | Next.js 16 (App Router, Turbopack) |
| 스타일 | Tailwind CSS, shadcn/ui |
| DB | Turso (libSQL), Drizzle ORM |
| 인증 | Better Auth (GitHub OAuth) |
| 검증 | Zod, Luxon |

## 시작하기

### 요구 사항

- Node.js 18+
- pnpm
- Turso DB 계정 (무료: [turso.tech](https://turso.tech))
- Better Auth용 GitHub OAuth App

### 설치 및 실행

```bash
# 의존성 설치
pnpm install

# 개발 서버 실행 (루트에서)
pnpm dev
```

`http://localhost:3000`에서 확인할 수 있습니다.

### 환경 변수

`apps/web/` 디렉터리에 `.env.local`을 생성하고 다음 변수를 설정합니다:

```bash
TURSO_DATABASE_URL=libsql://...
TURSO_AUTH_TOKEN=...
BETTER_AUTH_SECRET=...
BETTER_AUTH_URL=http://localhost:3000
```

상세 환경 설정은 `docs/03_Technical_Specs/00_DEVELOPMENT_PRINCIPLES.md`를 참고하세요.

### DB 마이그레이션 및 시드

```bash
cd apps/web
export $(grep -v '^#' .env.local | xargs)
node_modules/.bin/drizzle-kit migrate
node_modules/.bin/tsx scripts/seed.ts
```

## 프로젝트 구조

```
/
├── apps/
│   └── web/              # Next.js 앱 (Vercel 배포 루트)
├── packages/
│   └── db/               # 공유 Drizzle 스키마, Turso 클라이언트
├── docs/                 # 프로젝트 문서
│   ├── 01_Concept_Design/
│   ├── 02_UI_Screens/
│   ├── 03_Technical_Specs/
│   ├── 04_Logic_Progress/
│   └── 05_QA_Validation/
├── AGENTS.md             # AI 개발 규칙
└── CLAUDE.md             # Claude 코드 작업 가이드
```

## 스크립트

| 명령 | 설명 |
|------|------|
| `pnpm dev` | 개발 서버 실행 |
| `pnpm build` | 프로덕션 빌드 |
| `pnpm lint` | Lint 실행 |
| `pnpm typecheck` | 타입 체크 |

## 문서

- [비전 및 핵심 가치](docs/01_Concept_Design/01_VISION_CORE.md)
- [MVP 진행 상황](docs/04_Logic_Progress/01_MVP_PROGRESS.md)
- [개발 원칙 및 기술 스택](docs/03_Technical_Specs/00_DEVELOPMENT_PRINCIPLES.md)

## 라이선스

MIT (오픈소스)
