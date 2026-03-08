# Lean Canvas: DEV-ENGLISH
> Created: 2026-03-08 00:20
> Last Updated: 2026-03-08 00:20

## 1. Problem (해결하려는 문제)
- 주니어 개발자들은 공식 문서(React, Next.js, 공식 API 스펙 등)의 기술 영어를 읽는 데 심리적, 언어적 장벽을 느낌.
- 기존 단어장 앱엔 '개발 맥락'이 부재해, IT 용어로 쓰일 때의 미묘한 뉘앙스를 파악하기 어려움.
- 영어 단어 암기가 지루하고 지속 가능하지 못함.

## 2. Customer Segments (고객 타겟)
- 1차: 한국어 번역기가 없으면 공식 문서를 읽기 힘든 주니어 프로그래머 및 부트캠프 수강생.
- 2차: 영미권 취업/이직을 준비하거나 영어 소통 역량을 키우고 싶은 미드 레벨 개발자.

## 3. Unique Value Proposition (고유 가치 제안)
**개발자가, 개발자를 위해 만든 언어 학습 생태계**
일반적인 영어 사전이 아니라, **"실제 오픈소스 공식 문서의 크롤링 예문"**과 **"어원 분석(Root/Prefix/Suffix)"**을 결합해 개발 맥락에서 바로 써먹을 수 있는 '실전형' 영단어 학습을 제공.

## 4. Solution (해결책)
- 공식 문서의 생생한 예문과 함께 제공되는 개발자 전용 **단어장(Vocabulary List)**.
- 모르는 단어의 의미를 논리적으로 유추할 수 있도록 돕는 **어원 분석 기능**.
- 지루함을 덜어주는 **플래시카드 기반 게임(Flashcard Game)**.
- 코딩 중에도 쉽게 참고할 수 있는 **반응형 웹 지원**.

## 5. Channels (유통 채널)
- Github 오픈소스 커뮤니티, 개발자 커뮤니티(OKKY, 긱뉴스 등) 및 소셜 미디어(디스코드, 인프런, X).

## 6. Revenue Streams (수익원)
- 완전 무료 및 오픈소스 생태계 구축을 목표로 함 (이윤 목적 아님).
- 자발적인 후원(Github Sponsors, Buy Me a Coffee) 및 개발자 커뮤니티 기여(PR, 이슈 트래킹).

## 7. Cost Structure (비용 구조)
- 웹 호스팅 자원 (Vercel, Netlify 무료 티어 혹은 저렴한 요금제).
- 최소한의 데이터베이스 유지비 (무료 클라우드 DB: Supabase/Turso 등).
- 공식 문서 크롤링 및 파싱 작업 부하 (주기적 배치 작업 최적화 필요).

## 8. Key Metrics (핵심 지표)
- 일간/주간 활성 사용자(DAU/WAU) 및 체류 시간.
- 플래시카드 게임 완료율 (Game Completion Rate).
- 오픈소스 Github Star 수 및 기여자(Contributor) 증가율.

## 9. Unfair Advantage (우리만의 해자 / 경쟁 우위)
- **실전 예문 크롤러 데이터 파이프라인**: 단순히 영어 단어를 모은 것이 아닌, 인기 프레임워크(React 등)의 최신 공식 문서 문장을 그대로 발췌하여 생생함을 제공하는 자체 인프라.

## X. Related Documents
- **Concept_Design**: [Vision Core](./01_VISION_CORE.md) - 타겟 오디언스 및 핵심 가치
- **Concept_Design**: [Product Specs](./03_PRODUCT_SPECS.md) - 첫 런칭 버전에 포함될 MVP 스펙
