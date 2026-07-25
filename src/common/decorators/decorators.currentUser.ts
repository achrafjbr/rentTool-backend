import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { Request } from 'express';
import { CURRENT_USER } from '../constants/constants';
import { JwtPayloadType } from '../types/types.auth';

export const CurrentUser = createParamDecorator(
  (data: any, context: ExecutionContext) => {
    const currentUser: JwtPayloadType = context
      .switchToHttp()
      .getRequest<Request>()[CURRENT_USER];
    return currentUser;
  },
);
