import { Module } from '@nestjs/common';
import { AuthenticationService } from './authentication.service';
import { AuthenticationController } from './authentication.controller';
import { PasswordEncryptionService } from './password-encryption.service';
import { PASSWORD_ENCRYPTION } from 'src/common/constants/constants';
import { UserModule } from '../user/user.module';
import { AuthenticationJwtService } from './authentication.jwt.service';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from '../user/schemas/user.schema';

@Module({
  providers: [
    AuthenticationService,
    AuthenticationJwtService,
    {
      provide: PASSWORD_ENCRYPTION,
      useClass: PasswordEncryptionService,
    },
  ],
  controllers: [AuthenticationController],
  imports: [
    UserModule,
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
  ],
})
export class AuthenticationModule {}
