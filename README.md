# ecommerce-api

NestJS 기반 이커머스 API

## 요구 사항

- Node.js 24.x
- Docker / Docker Compose

## 실행

```bash
cp .env.example .env   # 필요 시 값 수정
docker compose up -d   # 앱 + PostgreSQL + Redis
```

## 로컬 개발

```bash
npm install
npm run start:dev
```