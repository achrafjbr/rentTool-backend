import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { ErrorResponse } from 'src/common/types/types.response';

@Catch(HttpException)
export class ErrorExceptionFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    const hostArgs = host.switchToHttp();
    const request = hostArgs.getRequest<Request>();
    const response = hostArgs.getRequest<Response>();

    const status =
      exception instanceof HttpException && exception.getStatus() != null
        ? exception.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR;

    const message =
      exception instanceof HttpException && exception.message != null
        ? exception.message
        : 'Internal server error';

    response.status(status).json({
      success: false,
      statusCode: status,
      message: message,
      path: request.url,
      timestamp: new Date().toISOString(),
    });
  }
}
