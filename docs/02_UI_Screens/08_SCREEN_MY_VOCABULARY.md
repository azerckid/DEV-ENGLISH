# Screen Spec: S-09 개인 단어장
> Created: 2026-03-08
> Last Updated: 2026-03-08

## 1. 화면 목적

로그인 사용자가 수동으로 저장했거나 오답으로 자동 추가된 단어를 모아보고, 해당 단어만으로 집중 학습할 수 있는 개인화 화면입니다.

**접근 조건**: 로그인 필수. 비로그인 접근 시 로그인 페이지로 리다이렉트.

---

## 2. 컴포넌트 구성

### 2.1 상단 요약 영역
| 컴포넌트 | shadcn/ui | 설명 |
|---|---|---|
| 전체 저장 단어 수 | - | "총 N개 단어" |
| 수동 추가 수 | `Badge` | "직접 추가 N개" |
| 오답 자동 추가 수 | `Badge` | "오답 자동 N개" |

### 2.2 필터 및 정렬
| 컴포넌트 | shadcn/ui | 설명 |
|---|---|---|
| 추가 방식 필터 | `Select` | 전체 / 직접 추가 / 오답 자동 추가 |
| 정렬 | `Select` | 최신순 / 단어명 가나다순 |

### 2.3 단어 목록
| 컴포넌트 | shadcn/ui | 설명 |
|---|---|---|
| 단어 카드 | `Card` | S-01과 동일한 카드 형태 |
| 추가 방식 배지 | `Badge` | "직접 추가" (blue) / "오답 자동" (orange) |
| 추가 날짜 | - | "2026-03-08 추가" |
| 단어 상세 링크 | - | 카드 클릭 시 S-02로 이동 |
| 삭제 버튼 | `Button` (variant: ghost, size: icon) | 카드 우측 상단. 클릭 시 확인 Dialog 후 삭제 |

### 2.4 집중 학습 버튼 영역
| 컴포넌트 | shadcn/ui | 설명 |
|---|---|---|
| 드릴 모드로 학습 | `Button` | 내 단어장 기준으로 S-03 진입 |
| 플래시카드로 학습 | `Button` (variant: outline) | 내 단어장 기준으로 S-06 진입 |

단어가 0개일 때 버튼 비활성화.

### 2.5 삭제 확인 Dialog
| 컴포넌트 | shadcn/ui | 설명 |
|---|---|---|
| 확인 모달 | `AlertDialog` | "이 단어를 개인 단어장에서 삭제할까요?" |
| 취소 버튼 | `Button` (variant: outline) | 삭제 취소 |
| 삭제 버튼 | `Button` (variant: destructive) | 확정 삭제 |

---

## 3. 상태 정의

| 상태 | 조건 | UI 처리 |
|---|---|---|
| **Loading** | 개인 단어장 fetch 중 | 단어 카드 스켈레톤 표시 |
| **Empty (전체)** | 저장된 단어 없음 | "아직 저장된 단어가 없습니다" + S-01 이동 버튼 |
| **Empty (필터)** | 필터 적용 후 결과 없음 | "해당 조건의 단어가 없습니다" + 필터 초기화 버튼 |
| **Success** | 단어 목록 정상 로드 | 카드 목록 렌더 |
| **삭제 완료** | 삭제 API 성공 | Sonner Toast: "단어가 삭제되었습니다" + 목록 즉시 갱신 |
| **Error** | fetch 실패 | Sonner Toast (error) + 재시도 버튼 |

---

## 4. 오답 자동 추가 동작 (타 화면에서 발생)

개인 단어장에 단어가 추가되는 시점과 UX를 명시합니다.

| 발생 화면 | 트리거 | 처리 |
|---|---|---|
| S-04 빈칸 채우기 | 오답 제출 | 백그라운드 API 호출 (non-blocking). Toast: "'{단어}'가 내 단어장에 추가되었습니다" |
| S-05 받아쓰기 | 오답 제출 | 동일 |
| S-06 플래시카드 | "틀림" 버튼 클릭 | 동일 |
| 비로그인 상태 (모든 화면) | 오답/틀림 발생 | Toast: "단어장 저장은 로그인 후 이용할 수 있습니다" + 로그인 버튼 |

- 이미 개인 단어장에 있는 단어는 중복 추가 없이 조용히 무시 (Toast 없음).

---

## 5. 에러 케이스

| 케이스 | 처리 방식 |
|---|---|
| 비로그인 접근 | 미들웨어에서 감지 → 로그인 페이지 리다이렉트 |
| 삭제 API 실패 | Sonner Toast (error): "삭제에 실패했습니다. 다시 시도해 주세요" |
| 자동 추가 API 실패 | 조용히 실패 처리 (학습 흐름 방해 금지). 콘솔 에러 로깅만 |
| 단어 0개 상태에서 학습 시작 | 버튼 비활성화로 선제 방지 |

---

## 6. 반응형

| 구간 | 레이아웃 |
|---|---|
| 데스크톱 (≥768px) | 단어 카드 3열 그리드. 집중 학습 버튼 상단 고정 |
| 모바일 (<768px) | 단어 카드 1열 리스트. 집중 학습 버튼 하단 고정 바 |

---

## 7. 데이터

- **API**: Server Component에서 `user_vocabulary` JOIN `words` 조회 (CSR — 로그인 세션 의존)
- **렌더링 전략**: CSR (`'use client'`) — 사용자별 데이터로 캐싱 불가
- **삭제**: `DELETE /api/my-vocabulary/[wordId]` Route Handler
- **자동 추가**: `POST /api/my-vocabulary` Route Handler (source: `wrong_answer`)
- **수동 추가**: `POST /api/my-vocabulary` Route Handler (source: `manual`) — S-02에서 호출

---

## X. Related Documents
- **UI_Screens**: [Sitemap](./00_SITEMAP.md) - S-09 화면 정의
- **UI_Screens**: [User Flow](./01_USER_FLOW.md) - Flow E
- **UI_Screens**: [S-04 드릴 모드](./04_SCREEN_DRILL.md) - 오답 자동 추가 발생
- **UI_Screens**: [S-05 플래시카드](./05_SCREEN_FLASHCARD.md) - 틀림 자동 추가 발생
- **Concept_Design**: [Product Specs](../01_Concept_Design/03_PRODUCT_SPECS.md) - §2.5 개인 단어장
- **Technical_Specs**: [Data Model](../03_Technical_Specs/01_DATA_MODEL.md) - user_vocabulary 테이블
