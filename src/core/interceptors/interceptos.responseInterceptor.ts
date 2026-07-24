import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Response } from 'express';
import { catchError, map, Observable } from 'rxjs';
import { IResponse, SuccessResponse } from 'src/common/types/types.response';

@Injectable()
export class ResponseInterceptor<T> implements NestInterceptor<
  T,
  SuccessResponse<T>
> {
  intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Observable<SuccessResponse<T>> {
    const ctxArgs = context.switchToHttp();
    const response = ctxArgs.getResponse<Response>();
    return next.handle().pipe(
      map((data) => {
        return {
          success: true,
          statusCode: response.statusCode,
          data: data,
          message: 'Request has been processed successfully',
        };
      }),
    );
  }
}
