import { RedisStore } from 'connect-redis';
import type { SessionOptions } from 'express-session';
import type { ConfigService } from '@nestjs/config';
import type { RedisClientType } from 'redis';
import { SESSION_COOKIE_NAME } from './session.types';

const ONE_DAY_MS = 24 * 60 * 60 * 1000;

export function buildSessionOptions(
  configService: ConfigService,
  client: RedisClientType,
): SessionOptions {
  return {
    name: SESSION_COOKIE_NAME,
    secret: configService.getOrThrow<string>('SESSION_SECRET'),
    resave: false,
    saveUninitialized: false,
    store: new RedisStore({ client, prefix: 'sess:' }),
    cookie: {
      httpOnly: true,
      sameSite: 'lax',
      secure: configService.get<string>('NODE_ENV') === 'production',
      maxAge: ONE_DAY_MS,
    },
  };
}
