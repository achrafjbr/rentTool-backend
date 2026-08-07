import { Module } from '@nestjs/common';
import { ToolService } from './tool.service';
import { ToolController } from './tool.controller';
import { AuthenticationJwtService } from '../authentication/authentication.jwt.service';
import { MongooseModule } from '@nestjs/mongoose';
import { Tool, ToolSchema } from './schemas/schema.tool';
import { UserModule } from '../user/user.module';
import { User, UserSchema } from '../user/schemas/user.schema';

@Module({
  providers: [ToolService, AuthenticationJwtService],
  controllers: [ToolController],
  imports: [
    MongooseModule.forFeature([
      { name: Tool.name, schema: ToolSchema },
      { name: User.name, schema: UserSchema },
    ]),
    UserModule,
  ],
  exports: [ToolService],
})
export class ToolModule {}
