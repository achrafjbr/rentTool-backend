import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from './schemas/user.schema';
import { AuthenticationJwtService } from '../authentication/authentication.jwt.service';

@Module({
  controllers: [UserController],
  providers: [UserService, AuthenticationJwtService],
  imports: [
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
    // MulterModule.registerAsync({
    //   useFactory: () => {
    //     return {};
    //   },
    // }),
  ],
  exports: [UserService],
})
export class UserModule {}
