import { HttpException, HttpStatus } from '@nestjs/common';
import { ErrorCode } from './error-code.constant';

interface BusinessExceptionResponse {
  errorCode: ErrorCode;
  message: string;
}

export class BusinessException extends HttpException {
  constructor(errorCode: ErrorCode, message: string, status: HttpStatus) {
    super({ errorCode, message }, status);
  }

  get errorCode(): ErrorCode {
    return (this.getResponse() as BusinessExceptionResponse).errorCode;
  }
}
