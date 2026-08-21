import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { PasswordHasher } from './hashing/password-hasher';
import type { AuthSession } from './session/auth-session';
import type { SignupRequestDto } from './dto/signup-request.dto';
import { SignupResponseDto } from './dto/signup-response.dto';
import type { LoginRequestDto } from './dto/login-request.dto';
import { LoginResponseDto } from './dto/login-response.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly passwordHasher: PasswordHasher,
  ) {}

  async signup(dto: SignupRequestDto): Promise<SignupResponseDto> {
    const passwordHash = await this.passwordHasher.hash(dto.password);

    const user = await this.usersService.create(
      {
        email: dto.email,
        passwordHash,
        name: dto.name,
        gender: dto.gender,
        birthDate: new Date(dto.birthDate),
        phone: dto.phone,
        zipcode: dto.zipcode,
        address1: dto.address1,
        address2: dto.address2,
      },
      dto.agreedTermsIds,
    );

    return SignupResponseDto.from(user);
  }

  async login(
    dto: LoginRequestDto,
    session: AuthSession,
  ): Promise<LoginResponseDto> {
    const user = await this.usersService.findByEmail(dto.email);
    if (!user) {
      throw new UnauthorizedException(
        '이메일 또는 비밀번호가 올바르지 않습니다',
      );
    }
    const matched = await this.passwordHasher.compare(
      dto.password,
      user.passwordHash,
    );
    if (!matched) {
      throw new UnauthorizedException(
        '이메일 또는 비밀번호가 올바르지 않습니다',
      );
    }

    await session.rotate();
    session.saveUser(user);
    return LoginResponseDto.from(user);
  }

  async logout(session: AuthSession): Promise<void> {
    await session.destroy();
  }
}
