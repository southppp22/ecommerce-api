import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import type { Terms } from '../entities/terms.entity';

@Injectable()
export class TermsRepository {
  constructor(private readonly prisma: PrismaService) {}

  findAllActive(): Promise<Terms[]> {
    return this.prisma.terms.findMany({ where: { isActive: true } });
  }
}
