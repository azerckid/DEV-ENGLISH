# Screen Spec: S-07 텍스트 기반 단어 기여
> Created: 2026-03-08
> Last Updated: 2026-03-08

## 1. 화면 목적

사용자가 공식 문서에서 복사한 텍스트를 붙여넣으면, 시스템이 기술 단어를 자동 추출하고 AI로 어원 분석을 생성해 공유 DB에 기여하는 화면입니다.

---

## 2. 컴포넌트 구성 및 단계별 UI

기여 화면은 4단계 스텝 형태로 진행됩니다.

### 2.1 Step 1 — 텍스트 입력
| 컴포넌트 | shadcn/ui | 설명 |
|---|---|---|
| 텍스트 입력창 | `Textarea` | 공식 문서에서 복사한 텍스트 붙여넣기. 최대 5,000자 |
| 출처 입력 | `Input` | 텍스트 출처 URL 또는 문서명 입력 (선택 사항) |
| 단어 추출 버튼 | `Button` | 클릭 시 Step 2로 진행 |
| 글자 수 표시 | - | "1,234 / 5,000자" |

### 2.2 Step 2 — 추출 결과 확인
| 컴포넌트 | shadcn/ui | 설명 |
|---|---|---|
| 추출된 단어 목록 | `Card` (체크박스 포함) | 시스템이 감지한 기술 단어 리스트 |
| 단어별 체크박스 | `Checkbox` | 기여할 단어 선택/해제. 기본값 전체 선택 |
| 이미 DB에 있는 단어 표시 | `Badge` (gray) | "이미 등록됨" 배지와 함께 비활성화 표시 |
| 선택된 단어 수 | - | "N개 선택됨" |
| AI 어원 분석 생성 버튼 | `Button` | 선택된 단어에 대해 AI 분석 실행 |
| 뒤로가기 | `Button` (variant: ghost) | Step 1로 복귀 |

### 2.3 Step 3 — AI 생성 결과 미리보기
| 컴포넌트 | shadcn/ui | 설명 |
|---|---|---|
| 단어별 결과 카드 | `Card` | 단어 + 어원 분석 결과 표시 |
| 형태소 분해 | - | prefix / root / suffix 블록 표시 |
| 파생어 목록 | - | AI가 생성한 파생어 리스트 |
| AI 생성 안내 문구 | - | "AI가 생성한 내용으로, 검수 후 확정됩니다" |
| DB에 기여 버튼 | `Button` | 전체 결과를 미검수 상태로 DB에 저장 |
| 뒤로가기 | `Button` (variant: ghost) | Step 2로 복귀 |

### 2.4 Step 4 — 기여 완료
| 컴포넌트 | shadcn/ui | 설명 |
|---|---|---|
| 완료 메시지 | - | "N개 단어가 미검수 상태로 등록되었습니다" |
| 기여한 단어 목록 | `Badge` | 등록된 단어명 나열 |
| 단어장 보러가기 | `Button` | S-01으로 이동 |
| 계속 기여하기 | `Button` (variant: outline) | Step 1로 초기화 후 재시작 |

---

## 3. 상태 정의

| 상태 | 조건 | UI 처리 |
|---|---|---|
| **Step 1 대기** | 초기 진입 | Textarea 포커스 |
| **추출 중** | 단어 추출 API 호출 중 | 버튼 로딩 스피너. Textarea 비활성화 |
| **Step 2** | 추출 완료 | 단어 목록 표시 |
| **추출 결과 없음** | 기술 단어 미감지 | "추출된 단어가 없습니다. 다른 텍스트를 입력해 주세요" |
| **AI 생성 중** | AI API 호출 중 | 로딩 스피너 + "AI가 어원을 분석하고 있습니다..." |
| **Step 3** | AI 생성 완료 | 결과 미리보기 표시 |
| **기여 완료** | DB 저장 완료 | Step 4 완료 화면 전환 + Sonner Toast |
| **API Key 없음** | 설정에 API Key 미입력 | S-08 설정 화면으로 유도 Toast + 버튼 |

---

## 4. 에러 케이스

| 케이스 | 처리 방식 |
|---|---|
| API Key 미설정 | 페이지 진입 시 감지. Toast: "AI 기능을 사용하려면 API Key를 설정해 주세요" + 설정 이동 버튼 |
| AI API 호출 실패 | Sonner Toast (error): "AI 분석에 실패했습니다. API Key를 확인하거나 다시 시도해 주세요" |
| AI API 응답 형식 오류 | 동일하게 Toast (error) + 재시도 버튼 |
| DB 저장 실패 | Toast (error): "저장에 실패했습니다. 다시 시도해 주세요" + 재시도 버튼 |
| 텍스트 5,000자 초과 | 실시간 글자 수 카운트로 경고. 초과 시 추출 버튼 비활성화 |
| 선택된 단어 없음 | AI 분석 버튼 비활성화 |

---

## 5. 반응형

| 구간 | 레이아웃 |
|---|---|
| 데스크톱 (≥768px) | 중앙 정렬 단일 컬럼, 최대 너비 700px |
| 모바일 (<768px) | 전체 너비. Step 네비게이션 버튼 하단 고정 |

---

## 6. 데이터 흐름

```
[Textarea 입력]
    │
    ▼ (클라이언트 → Route Handler)
[POST /api/extract-words]
    │  - 입력 텍스트에서 기술 단어 후보 추출
    │  - DB에 이미 존재하는 단어 필터링
    ▼
[추출 결과 반환]
    │
    │ (사용자 선택 확정 후)
    ▼ (클라이언트 → AI API 직접 호출)
[Claude API 또는 OpenAI API]
    │  - 어원 분석 (형태소, 파생어) 생성
    ▼
[AI 결과 미리보기]
    │
    │ (기여 확정 후)
    ▼ (클라이언트 → Route Handler)
[POST /api/contribute-words]
    │  - status: 'unreviewed'로 DB 저장
    ▼
[완료]
```

---

## X. Related Documents
- **UI_Screens**: [Sitemap](./00_SITEMAP.md) - S-07 화면 정의
- **UI_Screens**: [User Flow](./01_USER_FLOW.md) - Flow D
- **UI_Screens**: [S-08 설정](./07_SCREEN_SETTINGS.md) - API Key 미설정 시 연결
- **Concept_Design**: [Product Specs](../01_Concept_Design/03_PRODUCT_SPECS.md) - §2.4 텍스트 기반 단어 기여
- **Technical_Specs**: [Data Model](../03_Technical_Specs/01_DATA_MODEL.md) - words.status, words.ai_source
