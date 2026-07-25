import { HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { LoginDto } from './dto/login.dto';
import { PASSWORD_ENCRYPTION } from 'src/common/constants/constants';
import { PasswordEncryptionService } from './password-encryption.service';
import { UserService } from '../user/user.service';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from '../user/schemas/user.schema';
import { AuthenticationJwtService } from './authentication.jwt.service';
import { CreateUserDto } from '../user/dto/create-user.dto';

@Injectable()
export class AuthenticationService {
  constructor(
    private readonly userService: UserService,
    private readonly authenticationJwtService: AuthenticationJwtService,

    @Inject(PASSWORD_ENCRYPTION)
    private readonly passwordEncryptionService: PasswordEncryptionService,

    @InjectModel(User.name)
    private readonly userModel: Model<User>,
  ) {}

  public async register(registerDto: CreateUserDto): Promise<User> {
    const isEmailExisted = await this.userService.getUserByEmail(
      registerDto.email,
    );
    if (isEmailExisted)
      throw new HttpException('Email already exists', HttpStatus.UNAUTHORIZED);
    const hashedPassword = await this.passwordEncryptionService.encrypPassword(
      registerDto.password,
    );
    registerDto.password = hashedPassword;
    const user = new this.userModel(registerDto);
    await user.save();
    return user;
  }

  public async login(loginDto: LoginDto) {
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
    const userObject = user.toObject();
    delete userObject.password;
    return { user: userObject, token };
  }
}
