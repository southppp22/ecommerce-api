import { Module } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';
import { UsersModule } from '../users/users.module';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { PasswordHasher } from './hashing/password-hasher';
import { BcryptPasswordHasher } from './hashing/bcrypt-password-hasher';
import { AuthGuard } from './guards/auth.guard';

@Module({
  imports: [UsersModule],
  controllers: [AuthController],
  providers: [
    AuthService,
    { provide: PasswordHasher, useClass: BcryptPasswordHasher },
    { provide: APP_GUARD, useClass: AuthGuard },
  ],
})
export class AuthModule {}
