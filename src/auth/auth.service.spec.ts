import { UnauthorizedException } from '@nestjs/common';
import { AuthService } from './auth.service';
import type { SignupRequestDto } from './dto/signup-request.dto';
import type { LoginRequestDto } from './dto/login-request.dto';
import type { PasswordHasher } from './hashing/password-hasher';
import type { AuthSession } from './session/auth-session';
import type { UsersService } from '../users/users.service';
import { Gender, UserRole } from '../users/entities/user.entity';
import type { User } from '../users/entities/user.entity';

const signupDto: SignupRequestDto = {
  email: 'user@example.com',
  password: 'password123',
  name: '김민수',
  gender: Gender.MALE,
  birthDate: '1995-03-15',
  phone: '01012345678',
  zipcode: '06236',
  address1: '서울시 강남구 테헤란로 1',
  agreedTermsIds: [1, 2],
};

const savedUser: User = {
  id: 1,
  email: signupDto.email,
  passwordHash: 'hashed-password',
  name: signupDto.name,
  gender: signupDto.gender,
  birthDate: new Date(signupDto.birthDate),
  phone: signupDto.phone,
  zipcode: signupDto.zipcode,
  address1: signupDto.address1,
  address2: null,
  role: UserRole.USER,
  createdAt: new Date(),
  updatedAt: new Date(),
};

const loginDto: LoginRequestDto = {
  email: signupDto.email,
  password: signupDto.password,
};

describe('AuthService', () => {
  let usersService: jest.Mocked<Pick<UsersService, 'create' | 'findByEmail'>>;
  let passwordHasher: jest.Mocked<PasswordHasher>;
  let authSession: jest.Mocked<AuthSession>;
  let service: AuthService;

  beforeEach(() => {
    usersService = { create: jest.fn(), findByEmail: jest.fn() };
    passwordHasher = {
      hash: jest.fn().mockResolvedValue('hashed-password'),
      compare: jest.fn(),
    };
    authSession = {
      rotate: jest.fn().mockResolvedValue(undefined),
      saveUser: jest.fn(),
      destroy: jest.fn().mockResolvedValue(undefined),
    };
    service = new AuthService(
      usersService as unknown as UsersService,
      passwordHasher,
    );
  });

  describe('signup', () => {
    it('비밀번호는 해싱하여 전달하고 평문 password는 하위 계층에 노출하지 않는다', async () => {
      usersService.create.mockResolvedValue(savedUser);

      await service.signup(signupDto);

      expect(passwordHasher.hash.mock.calls).toEqual([[signupDto.password]]);
      const [data] = usersService.create.mock.calls[0];
      expect(data.passwordHash).toBe('hashed-password');
      expect(data).not.toHaveProperty('password');
    });

    it('birthDate 문자열은 Date로 변환하고 약관 동의 id 목록은 그대로 전달한다', async () => {
      usersService.create.mockResolvedValue(savedUser);

      await service.signup(signupDto);

      const [data, agreedTermsIds] = usersService.create.mock.calls[0];
      expect(data.birthDate).toBeInstanceOf(Date);
      expect(data.birthDate.toISOString()).toMatch(/^1995-03-15/);
      expect(agreedTermsIds).toEqual([1, 2]);
    });

    it('생성된 사용자 엔티티를 그대로 반환한다', async () => {
      usersService.create.mockResolvedValue(savedUser);

      const result = await service.signup(signupDto);

      expect(result).toBe(savedUser);
    });
  });

  describe('login', () => {
    it('이메일과 비밀번호가 일치하면 세션을 재발급한 뒤 사용자를 저장하고 사용자 엔티티를 반환한다', async () => {
      usersService.findByEmail.mockResolvedValue(savedUser);
      passwordHasher.compare.mockResolvedValue(true);

      const result = await service.login(loginDto, authSession);

      expect(passwordHasher.compare.mock.calls).toEqual([
        [loginDto.password, savedUser.passwordHash],
      ]);
      expect(authSession.rotate.mock.calls).toEqual([[]]);
      expect(authSession.saveUser.mock.calls).toEqual([[savedUser]]);
      expect(authSession.rotate.mock.invocationCallOrder[0]).toBeLessThan(
        authSession.saveUser.mock.invocationCallOrder[0],
      );
      expect(result).toBe(savedUser);
    });

    it('존재하지 않는 이메일이면 UnauthorizedException을 던지고 비밀번호를 비교하지 않는다', async () => {
      usersService.findByEmail.mockResolvedValue(null);

      const error = await service
        .login(loginDto, authSession)
        .catch((e: unknown) => e);

      expect(error).toBeInstanceOf(UnauthorizedException);
      expect(passwordHasher.compare.mock.calls).toHaveLength(0);
      expect(authSession.rotate.mock.calls).toHaveLength(0);
      expect(authSession.saveUser.mock.calls).toHaveLength(0);
    });

    it('비밀번호가 일치하지 않으면 UnauthorizedException을 던지고 세션을 생성하지 않는다', async () => {
      usersService.findByEmail.mockResolvedValue(savedUser);
      passwordHasher.compare.mockResolvedValue(false);

      const error = await service
        .login(loginDto, authSession)
        .catch((e: unknown) => e);

      expect(error).toBeInstanceOf(UnauthorizedException);
      expect(authSession.rotate.mock.calls).toHaveLength(0);
      expect(authSession.saveUser.mock.calls).toHaveLength(0);
    });

    it('이메일 없음과 비밀번호 불일치의 예외 메시지는 동일하다', async () => {
      usersService.findByEmail.mockResolvedValue(null);
      const noUserError = await service
        .login(loginDto, authSession)
        .catch((e: unknown) => e);

      usersService.findByEmail.mockResolvedValue(savedUser);
      passwordHasher.compare.mockResolvedValue(false);
      const wrongPasswordError = await service
        .login(loginDto, authSession)
        .catch((e: unknown) => e);

      expect((noUserError as UnauthorizedException).message).toBe(
        (wrongPasswordError as UnauthorizedException).message,
      );
    });
  });

  describe('logout', () => {
    it('세션을 파괴한다', async () => {
      await service.logout(authSession);

      expect(authSession.destroy.mock.calls).toEqual([[]]);
    });
  });
});
