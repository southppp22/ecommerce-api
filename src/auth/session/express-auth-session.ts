import type { Request } from 'express';
import type { User } from '../../users/entities/user.entity';
import { AuthSession } from './auth-session';
import { SESSION_COOKIE_NAME } from './session.types';

export class ExpressAuthSession extends AuthSession {
  constructor(private readonly req: Request) {
    super();
  }

  rotate(): Promise<void> {
    return new Promise((resolve, reject) => {
      this.req.session.regenerate((err) =>
        err ? reject(toError(err)) : resolve(),
      );
    });
  }

  saveUser(user: Pick<User, 'id' | 'role'>): void {
    this.req.session.userId = user.id;
    this.req.session.role = user.role;
  }

  async destroy(): Promise<void> {
    await new Promise<void>((resolve, reject) => {
      this.req.session.destroy((err) =>
        err ? reject(toError(err)) : resolve(),
      );
    });
    this.req.res?.clearCookie(SESSION_COOKIE_NAME);
  }
}

function toError(err: unknown): Error {
  return err instanceof Error ? err : new Error(String(err));
}
