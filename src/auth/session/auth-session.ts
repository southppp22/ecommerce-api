import type { User } from '../../users/entities/user.entity';

export abstract class AuthSession {
  abstract rotate(): Promise<void>;
  abstract saveUser(user: Pick<User, 'id' | 'role'>): void;
  abstract destroy(): Promise<void>;
}
