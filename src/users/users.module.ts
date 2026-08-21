import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UserRepository } from './repositories/user.repository';
import { TermsRepository } from './repositories/terms.repository';

@Module({
  providers: [UsersService, UserRepository, TermsRepository],
  exports: [UsersService],
})
export class UsersModule {}
