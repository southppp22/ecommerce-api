import { BcryptPasswordHasher } from './bcrypt-password-hasher';

describe('BcryptPasswordHasher', () => {
  const hasher = new BcryptPasswordHasher();

  it('올바른 비밀번호만 compare를 통과한다', async () => {
    const hashed = await hasher.hash('password123');

    expect(hashed).not.toBe('password123');
    await expect(hasher.compare('password123', hashed)).resolves.toBe(true);
    await expect(hasher.compare('wrong-password', hashed)).resolves.toBe(false);
  });
});
