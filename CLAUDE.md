# CLAUDE.md

## 프로젝트

이커머스 API 서버

## 작업 규칙

- 모든 변경은 브랜치 → PR (main 직접 push 금지, squash merge)
- 도메인 규칙(금액 계산, 상태 전이)은 반드시 단위 테스트 포함
- 커밋·PR 제목은 Conventional Commits (feat/fix/refactor/test/docs/chore + 도메인 스코프)
  - 예: `feat(auth): 세션 로그인 구현`
- 예외는 NestJS 내장 예외만 사용하고, 그 에러를 판단한 계층이 던진다. Repository는 null 반환, Service는 비즈니스 예외, Guard는 인증·인가 예외, Controller는 던지지 않음
