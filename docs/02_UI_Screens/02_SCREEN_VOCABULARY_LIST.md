# Screen Spec: S-01 단어장 목록
> Created: 2026-03-08
> Last Updated: 2026-03-08

## 1. 화면 목적

전체 단어 목록을 탐색하고, 단어 상세 페이지 및 학습 모드로 진입하는 앱의 메인 허브 화면입니다.

---

## 2. 컴포넌트 구성

### 2.1 글로벌 네비게이션 (공통)
| 컴포넌트 | shadcn/ui | 설명 |
|---|---|---|
| 로고 + 홈 링크 | - | 좌측 상단 |
| 네비게이션 링크 | `Button` (variant: ghost) | 드릴 모드 / 플래시카드 / 기여하기 / 설정 |

### 2.2 검색 및 필터 영역
| 컴포넌트 | shadcn/ui | 설명 |
|---|---|---|
| 검색 입력창 | `Input` | 영단어 검색 (실시간 필터링) |
| 출처 필터 | `Select` | 전체 / React Docs / MDN / Next.js Docs 등 |
| 검수 상태 필터 | `Select` | 전체 / 검증됨 / 미검수 |

### 2.3 단어 카드 목록
| 컴포넌트 | shadcn/ui | 설명 |
|---|---|---|
| 단어 카드 | `Card` | 클릭 시 S-02로 이동 |
| 검수 상태 배지 | `Badge` | `verified` → "검증됨" (green) / `unreviewed` → "미검수" (yellow) |
| 출처 태그 | `Badge` (variant: outline) | "React Docs", "MDN" 등 |

#### 단어 카드 내부 구성
```
[ 영단어 (word)          ]  [ 미검수 배지 ]
[ 품사 · 발음 기호       ]
[ 한글 뜻                ]
[ 출처 태그 ]
```

### 2.4 페이지네이션
| 컴포넌트 | shadcn/ui | 설명 |
|---|---|---|
| 페이지 이동 | `Pagination` | 페이지당 20개 단어 표시 |

---

## 3. 상태 정의

| 상태 | 조건 | UI 처리 |
|---|---|---|
| **Loading** | 단어 목록 fetch 중 | `Card` 스켈레톤 20개 표시 |
| **Success** | 단어 데이터 정상 로드 | 단어 카드 목록 렌더 |
| **Empty** | 검색/필터 결과 없음 | "검색 결과가 없습니다" 안내 텍스트 + 필터 초기화 버튼 |
| **Error** | 데이터 fetch 실패 | Sonner Toast: "단어 목록을 불러오지 못했습니다" + 재시도 버튼 |

---

## 4. 에러 케이스

| 케이스 | 처리 방식 |
|---|---|
| 네트워크 오류 | Sonner Toast (error) + 화면 내 재시도 버튼 |
| 검색어 입력 후 결과 없음 | 카드 목록 자리에 Empty 상태 UI 표시. Toast 없음 |
| 필터 조합으로 결과 없음 | 동일하게 Empty 상태 UI 표시 |

---

## 5. 반응형

| 구간 | 레이아웃 |
|---|---|
| 데스크톱 (≥768px) | 단어 카드 3열 그리드 |
| 모바일 (<768px) | 단어 카드 1열 리스트 |
| 검색/필터 영역 | 모바일에서 필터 버튼으로 접기/펼치기 |

---

## 6. 데이터

- **API**: Server Component에서 Turso DB 조회 (ISR revalidate: 3600)
- **쿼리 파라미터**: `?search=`, `?source=`, `?status=`, `?page=`
- **정렬**: 기본값 — 최신 등록순 (created_at DESC)

---

## X. Related Documents
- **UI_Screens**: [Sitemap](./00_SITEMAP.md) - S-01 화면 정의
- **UI_Screens**: [S-02 단어 상세](./03_SCREEN_WORD_DETAIL.md) - 카드 클릭 시 이동
- **Technical_Specs**: [Data Model](../03_Technical_Specs/01_DATA_MODEL.md) - words 테이블
