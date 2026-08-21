/* eslint-disable @typescript-eslint/no-unused-vars -- 스켈레톤: 구현 시 제거 */
import { Injectable, NotImplementedException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import type { Terms } from '../entities/terms.entity';

@Injectable()
export class TermsRepository {
  constructor(private readonly prisma: PrismaService) {}

  findActiveRequiredTerms(): Promise<Terms[]> {
    throw new NotImplementedException();
  }

  findByIds(ids: number[]): Promise<Terms[]> {
    throw new NotImplementedException();
  }
}
