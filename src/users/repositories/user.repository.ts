import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import type { User } from '../entities/user.entity';
import type { CreateUserDto } from '../dto/create-user.dto';

@Injectable()
export class UserRepository {
  constructor(private readonly prisma: PrismaService) {}

  findByEmail(email: string): Promise<User | null> {
    return this.prisma.user.findUnique({ where: { email } });
  }

  create(data: CreateUserDto, agreedTermsIds: number[]): Promise<User> {
    return this.prisma.user.create({
      data: {
        ...data,
        termsAgreements: {
          create: agreedTermsIds.map((termsId) => ({ termsId })),
        },
      },
    });
  }
}
