import {
  BadRequestException,
  ConflictException,
  Injectable,
} from '@nestjs/common';
import type { User } from './entities/user.entity';
import type { Terms } from './entities/terms.entity';
import { UserRepository } from './repositories/user.repository';
import { TermsRepository } from './repositories/terms.repository';
import type { CreateUserDto } from './dto/create-user.dto';

@Injectable()
export class UsersService {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly termsRepository: TermsRepository,
  ) {}

  async create(data: CreateUserDto, agreedTermsIds: number[]): Promise<User> {
    await this.assertEmailNotDuplicated(data.email);

    const uniqueTermsIds = [...new Set(agreedTermsIds)];
    const activeTerms = await this.termsRepository.findAllActive();
    this.assertTermsValid(activeTerms, uniqueTermsIds);
    this.assertAllRequiredTermsAgreed(activeTerms, uniqueTermsIds);

    return this.userRepository.create(data, uniqueTermsIds);
  }

  private async assertEmailNotDuplicated(email: string): Promise<void> {
    const existing = await this.userRepository.findByEmail(email);
    if (existing) {
      throw new ConflictException('이미 가입된 이메일입니다');
    }
  }

  private assertTermsValid(
    activeTerms: Terms[],
    agreedTermsIds: number[],
  ): void {
    const activeIdSet = new Set(activeTerms.map((terms) => terms.id));
    if (agreedTermsIds.some((id) => !activeIdSet.has(id))) {
      throw new BadRequestException('유효하지 않은 약관이 포함되어 있습니다');
    }
  }

  private assertAllRequiredTermsAgreed(
    activeTerms: Terms[],
    agreedTermsIds: number[],
  ): void {
    const agreedIdSet = new Set(agreedTermsIds);
    const missingRequired = activeTerms.filter(
      (terms) => terms.isRequired && !agreedIdSet.has(terms.id),
    );
    if (missingRequired.length > 0) {
      throw new BadRequestException('필수 약관에 동의해야 합니다');
    }
  }
}
