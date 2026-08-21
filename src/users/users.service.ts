/* eslint-disable @typescript-eslint/no-unused-vars -- 스켈레톤: 구현 시 제거 */
import { Injectable, NotImplementedException } from '@nestjs/common';
import type { User } from './entities/user.entity';
import { UserRepository } from './repositories/user.repository';
import { TermsRepository } from './repositories/terms.repository';
import type { CreateUserDto } from './dto/create-user.dto';

@Injectable()
export class UsersService {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly termsRepository: TermsRepository,
  ) {}

  /**
   * 회원 생성.
   * - 이메일 중복 검사 (users.email UNIQUE)
   * - 필수 약관 전체 동의 여부 검증
   * - 유저 생성 + 약관 동의 이력 저장
   */
  create(data: CreateUserDto, agreedTermsIds: number[]): Promise<User> {
    throw new NotImplementedException();
  }
}
