/** 비밀번호 해싱 포트 — 추상 클래스 자체가 DI 토큰 역할을 한다. */
export abstract class PasswordHasher {
  abstract hash(raw: string): Promise<string>;
  abstract compare(raw: string, hashed: string): Promise<boolean>;
}
