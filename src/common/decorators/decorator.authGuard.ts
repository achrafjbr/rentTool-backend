import {
  CanActivate,
  ExecutionContext,
  HttpException,
  HttpStatus,
  Injectable,
} from '@nestjs/common';

import { Request } from 'express';
import { Observable } from 'rxjs';
import { CURRENT_USER } from '../constants/constants';
import { AuthenticationJwtService } from 'src/modules/authentication/authentication.jwt.service';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private readonly authenticationJwtService: AuthenticationJwtService,
  ) {}
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const contextArgs = context.switchToHttp();
    const request = contextArgs.getRequest<Request>();
    const authorization: string | undefined = request.headers.authorization;
    console.log('authorization', authorization);
    if (authorization) {
      if (request[CURRENT_USER]) {
        return true;
      }
      const token = authorization.split(' ')[1];
      console.log('token', token);

      request[CURRENT_USER] = this.authenticationJwtService.verifyToken(token);
      return true;
    }
    throw new HttpException('no token provided', HttpStatus.UNAUTHORIZED);
  }
}
