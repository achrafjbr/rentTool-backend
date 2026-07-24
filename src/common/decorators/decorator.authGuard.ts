import {
  CanActivate,
  ExecutionContext,
  HttpException,
  HttpStatus,
  Injectable,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';
import { Observable } from 'rxjs';
import { JwtPayloadType } from '../types/types.auth';
import { CURRENT_USER } from '../constants/constants';
import { AuthenticationJwtService } from 'src/modules/authentication/authentication.jwt.service';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private readonly configService: ConfigService,
    private readonly jwtService: JwtService,
    private readonly authenticationJwtService: AuthenticationJwtService,
  ) {}
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const contextArgs = context.switchToHttp();
    const request = contextArgs.getRequest<Request>();
    const authorization: string | undefined = request.headers.authorization;
    if (authorization) {
      if (request[CURRENT_USER]) {
        return true;
      }
      const token = authorization.split(' ')[1];
      // const payload = this.jwtService.verify<JwtPayloadType>(token, {
      //   secret: this.configService.get<string>('JWT_KEY'),
      // });
      request[CURRENT_USER] = this.authenticationJwtService.verifyToken(token);
      return true;
    }
    throw new HttpException('no token provided', HttpStatus.UNAUTHORIZED);
  }
}
