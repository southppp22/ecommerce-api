export const ErrorCode = {
  USER_NOT_FOUND: 'USER_NOT_FOUND',
  DUPLICATE_EMAIL: 'DUPLICATE_EMAIL',
  INVALID_PASSWORD: 'INVALID_PASSWORD',
} as const;

export type ErrorCode = (typeof ErrorCode)[keyof typeof ErrorCode];
