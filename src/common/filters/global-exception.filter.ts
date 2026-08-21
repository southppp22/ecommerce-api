import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { Request, Response } from 'express';

@Catch()
export class GlobalExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(GlobalExceptionFilter.name);

  catch(exception: unknown, host: ArgumentsHost): void {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    const isHttp = exception instanceof HttpException;
    const status = isHttp
      ? exception.getStatus()
      : HttpStatus.INTERNAL_SERVER_ERROR;

    let message = '서버 오류가 발생했습니다';
    let errorCode = 'INTERNAL_SERVER_ERROR';

    if (isHttp) {
      const fallbackCode =
        (HttpStatus[status] as string | undefined) ?? 'UNKNOWN_ERROR';
      const res = exception.getResponse();
      if (typeof res === 'string') {
        message = res;
        errorCode = fallbackCode;
      } else if (typeof res === 'object' && res !== null) {
        const body = res as Record<string, unknown>;
        message = Array.isArray(body.message)
          ? (body.message as unknown[]).join(', ')
          : ((body.message as string | undefined) ?? message);
        errorCode = (body.errorCode as string | undefined) ?? fallbackCode;
      }
    }

    if (status >= 500) {
      this.logger.error(
        `${request.method} ${request.url}`,
        exception instanceof Error ? exception.stack : String(exception),
      );
    } else {
      this.logger.warn(
        `${request.method} ${request.url} → ${status} ${message}`,
      );
    }

    response.status(status).json({
      success: false,
      statusCode: status,
      errorCode,
      message,
      timestamp: new Date().toISOString(),
      path: request.url,
    });
  }
}
