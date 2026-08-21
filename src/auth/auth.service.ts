import { Injectable } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { PasswordHasher } from './hashing/password-hasher';
import type { SignupRequestDto } from './dto/signup-request.dto';
import { SignupResponseDto } from './dto/signup-response.dto';

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

    // TODO: 로그인 세션 생성
    return SignupResponseDto.from(user);
  }
}
