import type { UserRole } from '../../users/entities/user.entity';

declare module 'express-session' {
  interface SessionData {
    userId?: number;
    role?: UserRole;
  }
}

export const SESSION_COOKIE_NAME = 'sid';
