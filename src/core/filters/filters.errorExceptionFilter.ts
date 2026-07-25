import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { Request, Response } from 'express';

@Catch(HttpException)
export class ErrorExceptionFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    const hostArgs = host.switchToHttp();
    const request = hostArgs.getRequest<Request>();
    const response = hostArgs.getResponse<Response>();

    const status =
      exception.getStatus() != null
        ? exception.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR;

    const exceptionResponse = exception.getResponse();
    console.log('response', exceptionResponse);
    const message =
      typeof exceptionResponse == 'string'
        ? exception.getResponse()
        : ((exceptionResponse as any).message ?? exception.message);

    return response.status(status).json({
      success: false,
      statusCode: status,
      message: message,
      path: request.url,
      timestamp: new Date().toISOString(),
    });
  }
}
