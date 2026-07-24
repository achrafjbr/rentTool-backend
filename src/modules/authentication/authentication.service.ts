import { HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { JwtService } from '@nestjs/jwt';
import { PASSWORD_ENCRYPTION } from 'src/common/constants/constants';
import { PasswordEncryptionService } from './password-encryption.service';
import { UserService } from '../user/user.service';
import { InjectModel } from '@nestjs/mongoose';
import { Authentication } from './schemas/authentication.schema';
import { Model } from 'mongoose';
import { User } from '../user/schemas/user.schema';
import { AuthenticationJwtService } from './authentication.jwt.service';

@Injectable()
export class AuthenticationService {
  constructor(
    private readonly userService: UserService,
    private readonly authenticationJwtService: AuthenticationJwtService,

    @Inject(PASSWORD_ENCRYPTION)
    private readonly passwordEncryptionService: PasswordEncryptionService,

    @InjectModel(Authentication.name)
    private readonly authenticationModel: Model<Authentication>,
  ) {}

  public async register(registerDto: RegisterDto): Promise<User> {
    const hashedPassword = await this.passwordEncryptionService.encrypPassword(
      registerDto.password,
    );
    const user = await this.authenticationModel.create({
      ...registerDto,
      password: hashedPassword,
    });
    return user;
  }

  async login(loginDto: LoginDto) {
    const user = await this.userService.getUserByEmail(loginDto.email);
    if (!user) {
      throw new HttpException(
        'Email or password is incorrect',
        HttpStatus.UNAUTHORIZED,
      );
    }
    const isMatched = await this.passwordEncryptionService.decrypPassword(
      loginDto.password,
      user.password,
    );
    if (!isMatched) {
      throw new HttpException(
        'Email or password is incorrect',
        HttpStatus.UNAUTHORIZED,
      );
    }
    const token = this.authenticationJwtService.signToken(user);
    return { ...user, token };
  }
}
