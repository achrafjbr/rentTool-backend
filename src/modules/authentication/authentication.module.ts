import { Module } from '@nestjs/common';
import { AuthenticationService } from './authentication.service';
import { AuthenticationController } from './authentication.controller';
import { PasswordEncryptionService } from './password-encryption.service';
import { PASSWORD_ENCRYPTION } from 'src/common/constants/constants';
import { UserModule } from '../user/user.module';
import { MongooseModule } from '@nestjs/mongoose';
import {
  Authentication,
  AuthenticationSchema,
} from './schemas/authentication.schema';
import { AuthenticationJwtService } from './authentication.jwt.service';

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
    MongooseModule.forFeature([
      { name: Authentication.name, schema: AuthenticationSchema },
    ]),
  ],
})
export class AuthenticationModule {}
