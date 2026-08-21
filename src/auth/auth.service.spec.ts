import { AuthService } from './auth.service';
import { SignupResponseDto } from './dto/signup-response.dto';
import type { SignupRequestDto } from './dto/signup-request.dto';
import type { PasswordHasher } from './hashing/password-hasher';
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

describe('AuthService', () => {
  let usersService: jest.Mocked<Pick<UsersService, 'create'>>;
  let passwordHasher: jest.Mocked<PasswordHasher>;
  let service: AuthService;

  beforeEach(() => {
    usersService = { create: jest.fn() };
    passwordHasher = {
      hash: jest.fn().mockResolvedValue('hashed-password'),
      compare: jest.fn(),
    };
    service = new AuthService(
      usersService as unknown as UsersService,
      passwordHasher,
    );
  });

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

  it('응답은 { id, email, name }만 반환한다', async () => {
    usersService.create.mockResolvedValue(savedUser);

    const result = await service.signup(signupDto);

    expect(result).toBeInstanceOf(SignupResponseDto);
    expect(result).toEqual({
      id: savedUser.id,
      email: signupDto.email,
      name: signupDto.name,
    });
  });
});
