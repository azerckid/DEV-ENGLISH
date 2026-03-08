# Data Model: DEV-ENGLISH
> Created: 2026-03-08
> Last Updated: 2026-03-08 (account 테이블 Better Auth 필드 반영)

## 1. 개요

Turso (libSQL) 기반의 관계형 스키마입니다. ORM은 Drizzle을 사용하며, 스키마 파일 위치는 `apps/web/lib/db-schema.ts`입니다.

---

## 2. 테이블 정의

### 2.1 `words` — 단어 기본 정보

| 컬럼 | 타입 | 제약 | 설명 |
|---|---|---|---|
| `id` | integer | PK, autoincrement | 고유 식별자 |
| `word` | text | NOT NULL, UNIQUE | 영단어 (소문자) |
| `pronunciation` | text | | IPA 발음 기호 (예: /dɪˈstrʌktʃər/) |
| `part_of_speech` | text | NOT NULL | 품사 (noun, verb, adjective 등) |
| `korean_meaning` | text | NOT NULL | 한글 뜻 (대표 의미 1개) |
| `created_at` | integer | NOT NULL | Unix timestamp |
| `status` | text | NOT NULL, DEFAULT 'unreviewed' | 검수 상태: `approved` / `unreviewed` |
| `contributed_by` | text | FK → user.id (nullable) | 기여한 사용자 ID. 운영자 직접 입력 시 NULL |
| `ai_source` | text | | AI 생성 출처: `claude` / `openai` / NULL (수동 입력) |

---

### 2.2 `word_examples` — 공식 문서 예문

한 단어에 예문이 여러 개 존재할 수 있습니다 (출처별).

| 컬럼 | 타입 | 제약 | 설명 |
|---|---|---|---|
| `id` | integer | PK, autoincrement | 고유 식별자 |
| `word_id` | integer | FK → words.id | 연결된 단어 |
| `sentence` | text | NOT NULL | 원문 영어 예문 |
| `translation` | text | NOT NULL | 한글 번역 |
| `source_name` | text | NOT NULL | 출처명 (예: "React Docs", "MDN") |
| `source_url` | text | | 출처 원본 URL |

---

### 2.3 `word_morphemes` — 어근/접두사/접미사 분해

| 컬럼 | 타입 | 제약 | 설명 |
|---|---|---|---|
| `id` | integer | PK, autoincrement | 고유 식별자 |
| `word_id` | integer | FK → words.id | 연결된 단어 |
| `morpheme` | text | NOT NULL | 형태소 단위 (예: "re-", "struct", "-ure") |
| `type` | text | NOT NULL | 종류: `prefix` / `root` / `suffix` |
| `meaning` | text | NOT NULL | 형태소의 뜻 (예: "다시", "쌓다", "명사화") |
| `order` | integer | NOT NULL | 단어 내 순서 (1부터 시작) |

---

### 2.4 `word_derivatives` — 동일 어원 파생어

| 컬럼 | 타입 | 제약 | 설명 |
|---|---|---|---|
| `id` | integer | PK, autoincrement | 고유 식별자 |
| `word_id` | integer | FK → words.id | 기준 단어 |
| `root` | text | NOT NULL | 공유 어근 (예: "struct") |
| `derivative_word` | text | NOT NULL | 파생어 영단어 (예: "construct") |
| `derivative_meaning` | text | NOT NULL | 파생어 한글 뜻 |

---

### 2.5 `user_vocabulary` — 개인 단어장

| 컬럼 | 타입 | 제약 | 설명 |
|---|---|---|---|
| `id` | integer | PK, autoincrement | 고유 식별자 |
| `user_id` | text | NOT NULL, FK → user.id | 소유 사용자 |
| `word_id` | integer | NOT NULL, FK → words.id | 저장된 단어 |
| `source` | text | NOT NULL | 추가 경로: `manual` / `wrong_answer` |
| `added_at` | integer | NOT NULL | Unix timestamp |

- `(user_id, word_id)` 복합 UNIQUE 제약 — 동일 단어 중복 저장 방지.
- `source: wrong_answer` — 드릴 오답 또는 플래시카드 "틀림" 선택 시 자동 추가.

---

### 2.6 Better Auth 테이블 — 인증 관리

Better Auth가 관리하는 테이블입니다. 직접 수정하지 않습니다.

#### `user`

| 컬럼 | 타입 | 설명 |
|---|---|---|
| `id` | text PK | 고유 식별자 |
| `name` | text NOT NULL | 표시 이름 |
| `email` | text NOT NULL UNIQUE | 이메일 |
| `email_verified` | integer (boolean) | 이메일 인증 여부 |
| `image` | text | 프로필 이미지 URL |
| `created_at` | integer (timestamp) | 생성일 |
| `updated_at` | integer (timestamp) | 수정일 |

#### `session`

| 컬럼 | 타입 | 설명 |
|---|---|---|
| `id` | text PK | |
| `expires_at` | integer (timestamp) | 만료일 |
| `token` | text NOT NULL UNIQUE | 세션 토큰 |
| `user_id` | text FK → user.id | |
| `ip_address` | text | |
| `user_agent` | text | |
| `created_at` | integer (timestamp) | |
| `updated_at` | integer (timestamp) | |

#### `account`

| 컬럼 | 타입 | 설명 |
|---|---|---|
| `id` | text PK | |
| `account_id` | text NOT NULL | 소셜 공급자의 사용자 ID |
| `provider_id` | text NOT NULL | 공급자 식별자 (예: `github`) |
| `user_id` | text FK → user.id | |
| `access_token` | text | |
| `refresh_token` | text | |
| `id_token` | text | |
| `access_token_expires_at` | integer (timestamp) | 액세스 토큰 만료일 |
| `refresh_token_expires_at` | integer (timestamp) | 리프레시 토큰 만료일 |
| `scope` | text | OAuth 스코프 |
| `password` | text | 이메일 로그인 시 해시 비밀번호 |
| `created_at` | integer (timestamp) | |
| `updated_at` | integer (timestamp) | |

> `expiresAt` 단일 컬럼이 아닌 `access_token_expires_at` / `refresh_token_expires_at` 분리 구조임에 주의.
> 초기 스키마 누락으로 `unable_to_create_user` 오류 발생 → Turso shell `ALTER TABLE`로 추가 완료.

#### `verification`

| 컬럼 | 타입 | 설명 |
|---|---|---|
| `id` | text PK | |
| `identifier` | text NOT NULL | 인증 대상 (이메일 등) |
| `value` | text NOT NULL | 인증 토큰 값 |
| `expires_at` | integer (timestamp) | 만료일 |
| `created_at` | integer (timestamp) | |
| `updated_at` | integer (timestamp) | |

---

## 3. 테이블 관계 요약

```
words (1)
  ├──< word_examples    (1:N)
  ├──< word_morphemes   (1:N, order 컬럼으로 정렬)
  └──< word_derivatives (1:N)

user (1)
  ├──< session          (1:N)
  ├──< account          (1:N)
  ├──< verification     (1:N)
  └──< user_vocabulary  (1:N, unique on userId+wordId)
```

---

## 4. 초기 데이터 투입

- 스크립트 위치: `apps/web/scripts/seed.ts`
- 실행 방법:
  ```bash
  cd apps/web
  export $(grep -v '^#' .env.local | xargs)
  node_modules/.bin/tsx scripts/seed.ts
  ```
- 현재 투입된 단어: 20개 (examples, morphemes, derivatives 포함)

---

## X. Related Documents
- **Technical_Specs**: [Development Principles](./00_DEVELOPMENT_PRINCIPLES.md)
- **Logic_Progress**: [MVP Progress](../04_Logic_Progress/01_MVP_PROGRESS.md)
- **Concept_Design**: [Product Specs](../01_Concept_Design/03_PRODUCT_SPECS.md)
