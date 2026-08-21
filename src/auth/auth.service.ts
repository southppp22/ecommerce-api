/* eslint-disable @typescript-eslint/no-unused-vars -- 스켈레톤: 구현 시 제거 */
import { Injectable, NotImplementedException } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import type { SignupRequestDto } from './dto/signup-request.dto';
import type { SignupResponseDto } from './dto/signup-response.dto';

@Injectable()
export class AuthService {
  constructor(private readonly usersService: UsersService) {}

  /**
   * 회원가입.
   * 구현 시 책임:
   * - 비밀번호 해싱 (bcrypt) — auth의 책임
   * - UsersService.create()에 유저 생성 + 약관 동의 이력 저장 위임
   * - (선택) 가입 직후 자동 로그인 세션 생성
   */
  signup(dto: SignupRequestDto): Promise<SignupResponseDto> {
    throw new NotImplementedException();
  }
}
