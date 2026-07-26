import { Module } from '@nestjs/common';
import { ToolService } from './tool.service';
import { ToolController } from './tool.controller';
import { AuthenticationJwtService } from '../authentication/authentication.jwt.service';
import { MongooseModule } from '@nestjs/mongoose';
import { Tool, ToolSchema } from './schemas/schema.tool';
import { UserModule } from '../user/user.module';

@Module({
  providers: [ToolService, AuthenticationJwtService],
  controllers: [ToolController],
  imports: [
    MongooseModule.forFeature([{ name: Tool.name, schema: ToolSchema }]),
    UserModule,
  ],
})
export class ToolModule {}
