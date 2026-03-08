# Screen Spec: S-02 단어 상세
> Created: 2026-03-08
> Last Updated: 2026-03-08

## 1. 화면 목적

개별 단어의 뜻, 예문, 어원 분석을 상세히 제공하고 학습 모드(드릴/플래시카드)로 바로 진입할 수 있는 화면입니다.

---

## 2. 컴포넌트 구성

### 2.1 단어 헤더 영역
| 컴포넌트 | shadcn/ui | 설명 |
|---|---|---|
| 영단어 + 품사 | - | 대형 타이포그래피로 표시 |
| 발음 기호 | - | IPA 기호 표시 |
| 한글 뜻 | - | 대표 의미 |
| 검수 상태 배지 | `Badge` | `verified` / `unreviewed` |
| 뒤로가기 버튼 | `Button` (variant: ghost) | S-01로 복귀 |

### 2.2 예문 섹션
| 컴포넌트 | shadcn/ui | 설명 |
|---|---|---|
| 예문 카드 | `Card` | 출처별로 예문 1개씩 카드 형태 표시 |
| 원문 예문 | - | 영어 원문 |
| 번역 | - | 한글 번역 |
| 출처 링크 | `Badge` (variant: outline) + `<a>` | 클릭 시 공식 문서 원본 새 탭으로 이동 |

### 2.3 어원 분석 섹션
| 컴포넌트 | shadcn/ui | 설명 |
|---|---|---|
| 섹션 구분선 | `Separator` | |
| 형태소 분해 표시 | - | prefix / root / suffix를 블록으로 시각화 |
| 형태소 블록 | `Badge` (색상 구분) | prefix: blue / root: green / suffix: purple |
| 형태소 뜻 | - | 각 블록 하단에 뜻 표시 |
| 파생어 목록 | `Card` | 동일 어원 공유 개발 용어 리스트 (단어 + 한글 뜻) |

#### 형태소 시각화 예시 (`destructure`)
```
[ de- ]  [ struct ]  [ -ure ]
 제거      쌓다        명사화

파생어: structure, construct, reconstruct, infrastructure
```

### 2.4 학습 모드 진입 버튼
| 컴포넌트 | shadcn/ui | 설명 |
|---|---|---|
| 빈칸 채우기 버튼 | `Button` | S-04로 이동 |
| 받아쓰기 버튼 | `Button` (variant: outline) | S-05로 이동 |
| 플래시카드 버튼 | `Button` (variant: outline) | S-06로 이동 |

---

## 3. 상태 정의

| 상태 | 조건 | UI 처리 |
|---|---|---|
| **Loading** | 단어 데이터 fetch 중 | 각 섹션 스켈레톤 표시 |
| **Success** | 정상 로드 | 전체 컨텐츠 렌더 |
| **어원 없음** | morphemes 데이터 없음 | "어원 분석 준비 중입니다" 안내 텍스트 표시. 섹션 자체는 유지 |
| **파생어 없음** | derivatives 데이터 없음 | 파생어 카드 미표시. 섹션 숨김 |
| **Not Found** | 존재하지 않는 단어 ID | Next.js `notFound()` 호출 → 404 페이지 |
| **Error** | fetch 실패 | Next.js `error.tsx` 처리 |

---

## 4. 에러 케이스

| 케이스 | 처리 방식 |
|---|---|
| 존재하지 않는 `/words/[id]` | `notFound()` → 404 |
| DB 조회 실패 | `error.tsx` 렌더 (재시도 버튼 포함) |
| 출처 URL 없음 | 출처 배지 표시하되 링크 비활성화 |

---

## 5. 반응형

| 구간 | 레이아웃 |
|---|---|
| 데스크톱 (≥768px) | 단어 헤더 + 예문 + 어원 분석 단일 컬럼, 우측 여백 여유 있게 |
| 모바일 (<768px) | 동일 단일 컬럼, 학습 모드 버튼은 하단 고정 바로 배치 |

---

## 6. 데이터

- **API**: Server Component에서 Turso DB 조회 (ISR revalidate: 3600)
- **조회 항목**: `words` + `word_examples` + `word_morphemes` + `word_derivatives` JOIN
- **URL 파라미터**: `/words/[id]` — id는 words.id (integer)

---

## X. Related Documents
- **UI_Screens**: [Sitemap](./00_SITEMAP.md) - S-02 화면 정의
- **UI_Screens**: [S-01 단어장 목록](./02_SCREEN_VOCABULARY_LIST.md) - 진입 화면
- **Technical_Specs**: [Data Model](../03_Technical_Specs/01_DATA_MODEL.md) - words, word_examples, word_morphemes, word_derivatives 테이블
