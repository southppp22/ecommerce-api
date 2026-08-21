import { BadRequestException, ConflictException } from '@nestjs/common';
import { UsersService } from './users.service';
import { Gender, UserRole } from './entities/user.entity';
import type { User } from './entities/user.entity';
import type { Terms } from './entities/terms.entity';
import type { CreateUserDto } from './dto/create-user.dto';
import type { UserRepository } from './repositories/user.repository';
import type { TermsRepository } from './repositories/terms.repository';

const createUserDto: CreateUserDto = {
  email: 'user@example.com',
  passwordHash: '$2b$10$hashedhashedhashedhashed',
  name: '김민수',
  gender: Gender.MALE,
  birthDate: new Date('1995-03-15'),
  phone: '01012345678',
  zipcode: '06236',
  address1: '서울시 강남구 테헤란로 1',
};

const savedUser: User = {
  id: 1,
  email: createUserDto.email,
  passwordHash: createUserDto.passwordHash,
  name: createUserDto.name,
  gender: createUserDto.gender,
  birthDate: createUserDto.birthDate,
  phone: createUserDto.phone,
  zipcode: createUserDto.zipcode,
  address1: createUserDto.address1,
  address2: null,
  role: UserRole.USER,
  createdAt: new Date(),
  updatedAt: new Date(),
};

const makeTerms = (partial: Partial<Terms>): Terms => ({
  id: 1,
  code: 'SERVICE',
  version: 1,
  title: '서비스 이용약관',
  content: '약관 내용',
  isRequired: true,
  isActive: true,
  ...partial,
});

const serviceTerms = makeTerms({ id: 1, code: 'SERVICE' });
const privacyTerms = makeTerms({ id: 2, code: 'PRIVACY' });
const marketingTerms = makeTerms({
  id: 3,
  code: 'MARKETING',
  isRequired: false,
});

describe('UsersService', () => {
  let userRepository: jest.Mocked<
    Pick<UserRepository, 'findByEmail' | 'create'>
  >;
  let termsRepository: jest.Mocked<Pick<TermsRepository, 'findAllActive'>>;
  let service: UsersService;

  beforeEach(() => {
    userRepository = {
      findByEmail: jest.fn(),
      create: jest.fn(),
    };
    termsRepository = { findAllActive: jest.fn() };
    service = new UsersService(
      userRepository as unknown as UserRepository,
      termsRepository as unknown as TermsRepository,
    );
  });

  it('유효한 입력이면 유저를 생성한다', async () => {
    userRepository.findByEmail.mockResolvedValue(null);
    termsRepository.findAllActive.mockResolvedValue([
      serviceTerms,
      privacyTerms,
      marketingTerms,
    ]);
    userRepository.create.mockResolvedValue(savedUser);

    const result = await service.create(createUserDto, [1, 2, 2, 1]);

    expect(result).toEqual(savedUser);
    expect(userRepository.create.mock.calls).toEqual([[createUserDto, [1, 2]]]);
  });

  it('이미 가입된 이메일이면 ConflictException을 던지고 유저를 생성하지 않는다', async () => {
    userRepository.findByEmail.mockResolvedValue(savedUser);

    const error = await service
      .create(createUserDto, [1, 2])
      .catch((e: unknown) => e);

    expect(error).toBeInstanceOf(ConflictException);
    expect((error as ConflictException).message).toBe(
      '이미 가입된 이메일입니다',
    );
    expect(userRepository.create.mock.calls).toHaveLength(0);
  });

  it('존재하지 않는 약관 id가 포함되면 BadRequestException을 던진다', async () => {
    userRepository.findByEmail.mockResolvedValue(null);
    termsRepository.findAllActive.mockResolvedValue([
      serviceTerms,
      privacyTerms,
    ]);

    const error = await service
      .create(createUserDto, [1, 999])
      .catch((e: unknown) => e);

    expect(error).toBeInstanceOf(BadRequestException);
    expect((error as BadRequestException).message).toBe(
      '유효하지 않은 약관이 포함되어 있습니다',
    );
  });

  it('존재하지만 비활성인 약관에 동의한 경우 BadRequestException을 던진다.', async () => {
    userRepository.findByEmail.mockResolvedValue(null);
    // PRIVACY(id: 2)는 비활성이라 활성 약관 목록에 없음
    termsRepository.findAllActive.mockResolvedValue([serviceTerms]);

    const error = await service
      .create(createUserDto, [1, 2])
      .catch((e: unknown) => e);

    expect(error).toBeInstanceOf(BadRequestException);
    expect((error as BadRequestException).message).toBe(
      '유효하지 않은 약관이 포함되어 있습니다',
    );
  });

  it('필수 약관에 하나라도 동의하지 않으면 BadRequestException을 던지고 유저를 생성하지 않는다', async () => {
    userRepository.findByEmail.mockResolvedValue(null);
    termsRepository.findAllActive.mockResolvedValue([
      serviceTerms,
      privacyTerms,
      marketingTerms,
    ]);

    const error = await service
      .create(createUserDto, [3])
      .catch((e: unknown) => e);

    expect(error).toBeInstanceOf(BadRequestException);
    expect((error as BadRequestException).message).toBe(
      '필수 약관에 동의해야 합니다',
    );
    expect(userRepository.create.mock.calls).toHaveLength(0);
  });
});
