import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { User } from '../user/schemas/user.schema';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { JwtPayloadType } from 'src/common/types/types.auth';

@Injectable()
export class AuthenticationJwtService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}
  public signToken(user: User) {
    const payload = {
      id: user._id,
      fullName: user.fullName,
    };
    return this.jwtService.sign(payload, {
      secret: this.configService.get<string>('JWT_KEY'),
    });
  }

  public verifyToken(token: string): JwtPayloadType {
    try {
      const payload = this.jwtService.verify<JwtPayloadType>(token, {
        secret: this.configService.get<string>('JWT_KEY'),
      });
      return payload;
    } catch (error) {
      throw new HttpException('Unauthorized', HttpStatus.UNAUTHORIZED);
    }
  }
}
