# Screen Spec: S-08 AI API 설정
> Created: 2026-03-08
> Last Updated: 2026-03-08

## 1. 화면 목적

텍스트 기반 단어 기여 기능에 사용할 AI API 제공자와 API Key를 설정하는 화면입니다. API Key는 브라우저 로컬스토리지에만 저장되며 서버로 전송되지 않습니다.

---

## 2. 컴포넌트 구성

### 2.1 AI 제공자 선택
| 컴포넌트 | shadcn/ui | 설명 |
|---|---|---|
| 제공자 선택 | `RadioGroup` | Claude API / OpenAI API 중 선택 |
| 선택 카드 | `Card` (클릭 가능) | 각 제공자 로고 + 이름 + 간단 설명 |

### 2.2 API Key 입력
| 컴포넌트 | shadcn/ui | 설명 |
|---|---|---|
| API Key 입력 필드 | `Input` (type: password) | 마스킹 처리. 눈 아이콘으로 토글 가능 |
| 보안 안내 문구 | - | "API Key는 이 기기의 브라우저에만 저장되며 서버로 전송되지 않습니다" |
| API Key 발급 안내 링크 | `Button` (variant: link) | 선택한 AI 제공자 콘솔 페이지 링크 |

### 2.3 액션 버튼
| 컴포넌트 | shadcn/ui | 설명 |
|---|---|---|
| 저장 버튼 | `Button` | 로컬스토리지에 저장 + Sonner Toast |
| 삭제 버튼 | `Button` (variant: destructive) | 저장된 API Key 삭제 |

### 2.4 현재 설정 상태 표시
| 컴포넌트 | shadcn/ui | 설명 |
|---|---|---|
| 설정 상태 배지 | `Badge` | API Key 저장됨 (green) / 미설정 (gray) |
| 저장된 Key 미리보기 | - | "sk-ant-••••••••••••XXXX" 형태로 앞 일부만 마스킹 표시 |

---

## 3. 상태 정의

| 상태 | 조건 | UI 처리 |
|---|---|---|
| **미설정** | 로컬스토리지에 API Key 없음 | 배지: "미설정" (gray). 입력 필드 비어있음 |
| **설정됨** | 로컬스토리지에 API Key 있음 | 배지: "설정됨" (green). 마스킹된 Key 표시 |
| **저장 중** | 저장 버튼 클릭 후 | 버튼 로딩 상태 (로컬스토리지 저장은 즉시이나 UX용 짧은 딜레이) |
| **저장 완료** | 저장 성공 | Sonner Toast: "API Key가 저장되었습니다" |
| **삭제 완료** | 삭제 성공 | Sonner Toast: "API Key가 삭제되었습니다". 상태 미설정으로 전환 |

---

## 4. 에러 케이스

| 케이스 | 처리 방식 |
|---|---|
| API Key 형식 불일치 | 저장 버튼 클릭 시 Zod 검증. Claude: `sk-ant-` 접두사, OpenAI: `sk-` 접두사 확인. 불일치 시 `Input` 하단에 인라인 에러 메시지 |
| 빈 API Key 저장 시도 | 저장 버튼 비활성화 (입력값 없을 때) |
| 로컬스토리지 사용 불가 | Sonner Toast (error): "이 브라우저에서는 설정을 저장할 수 없습니다 (시크릿 모드 확인)" |

---

## 5. 보안 고려사항

- API Key는 `localStorage`에 저장. 민감 정보이므로 화면에 전체 노출 금지.
- 저장 시 키 전체가 아닌 마스킹된 형태(`sk-ant-••••XXXX`)만 표시.
- 서버 Route Handler로 API Key 전송 없음. AI API는 클라이언트에서 직접 호출.
- 페이지 이탈 시 입력 중인 Key 자동 삭제 (저장 버튼 클릭 전까지 메모리에만 유지).

---

## 6. 반응형

| 구간 | 레이아웃 |
|---|---|
| 데스크톱 (≥768px) | 중앙 정렬 단일 컬럼, 최대 너비 500px |
| 모바일 (<768px) | 전체 너비 |

---

## X. Related Documents
- **UI_Screens**: [Sitemap](./00_SITEMAP.md) - S-08 화면 정의
- **UI_Screens**: [S-07 텍스트 기여](./06_SCREEN_CONTRIBUTE.md) - API Key 설정 후 이동 화면
- **Technical_Specs**: [Development Principles](../03_Technical_Specs/00_DEVELOPMENT_PRINCIPLES.md) - AI API 스택, API Key 로컬스토리지 정책
