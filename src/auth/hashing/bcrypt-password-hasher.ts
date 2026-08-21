import { Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { PasswordHasher } from './password-hasher';

const SALT_ROUNDS = 10;

@Injectable()
export class BcryptPasswordHasher extends PasswordHasher {
  hash(raw: string): Promise<string> {
    return bcrypt.hash(raw, SALT_ROUNDS);
  }

  compare(raw: string, hashed: string): Promise<boolean> {
    return bcrypt.compare(raw, hashed);
  }
}
