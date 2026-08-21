import { createParamDecorator } from '@nestjs/common';
import type { ExecutionContext } from '@nestjs/common';
import type { Request } from 'express';
import type { AuthSession } from '../session/auth-session';
import { ExpressAuthSession } from '../session/express-auth-session';

export const CurrentAuthSession = createParamDecorator(
  (_data: unknown, ctx: ExecutionContext): AuthSession =>
    new ExpressAuthSession(ctx.switchToHttp().getRequest<Request>()),
);
