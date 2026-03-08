# AI-Human Collaboration Guide
> Created: 2026-03-08 00:18
> Last Updated: 2026-03-08 00:18

## 1. 개요
본 문서는 DEV-ENGLISH 프로젝트 진행 시 AI 에이전트와 사용자(Human) 간의 협업 프로토콜을 명시합니다. 이 가이드는 `AGENTS.md`의 글로벌 표준을 구체화한 실무 지침입니다.

## 2. 역할 정의
- **Human (Product Owner / Tech Lead)**: 비전 제시, 핵심 비즈니스 로직 결정, 방향성 승인, 최종 병합(Merge) 결정.
- **AI Agent (Lead Developer / QA)**: 아키텍처 제안, 기술 사양 구현, 코드 작성 및 리팩토링 로직 제안, E2E 테스트 수행, 문서 관리.

## 3. 핵심 협업 워크플로우 (Ask Before Action)
코드 수정이나 파괴적인 명령어 실행 전 반드시 다음 절차를 거칩니다:
1. **제안 및 설명**: "어떤 파일의 어떤 기능을 수정하고자 합니다." (이유와 영향도 포함)
2. **명시적 승인 대기**: 사용자의 'Yes' 또는 승인 지시 대기.
3. **구현 및 검증**: 코드를 작성하고 린트/타입 에러가 없는지, 기능이 동작하는지 도구로 검증.
4. **결과 보고**: "구현이 완료되었으며, 다음 테스트를 통해 검증했습니다."

## X. Related Documents
- **Concept_Design**: [Vision & Core Values](./01_VISION_CORE.md) - 프로젝트 비전
