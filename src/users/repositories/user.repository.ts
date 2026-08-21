/* eslint-disable @typescript-eslint/no-unused-vars -- 스켈레톤: 구현 시 제거 */
import { Injectable, NotImplementedException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import type { User } from '../entities/user.entity';
import type { CreateUserDto } from '../dto/create-user.dto';

@Injectable()
export class UserRepository {
  constructor(private readonly prisma: PrismaService) {}

  findByEmail(email: string): Promise<User | null> {
    throw new NotImplementedException();
  }

  createWithAgreements(
    data: CreateUserDto,
    agreedTermsIds: number[],
  ): Promise<User> {
    throw new NotImplementedException();
  }
}
