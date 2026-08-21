import { Module } from '@nestjs/common';
import { UsersModule } from '../users/users.module';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { PasswordHasher } from './hashing/password-hasher';
import { BcryptPasswordHasher } from './hashing/bcrypt-password-hasher';

@Module({
  imports: [UsersModule],
  controllers: [AuthController],
  providers: [
    AuthService,
    { provide: PasswordHasher, useClass: BcryptPasswordHasher },
  ],
})
export class AuthModule {}
