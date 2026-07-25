import { Module } from '@nestjs/common';
import { ToolService } from './tool.service';
import { ToolController } from './tool.controller';
import { AuthenticationService } from '../authentication/authentication.service';
import { UserModule } from '../user/user.module';
import { AuthenticationJwtService } from '../authentication/authentication.jwt.service';

@Module({
  providers: [ToolService, AuthenticationJwtService],
  controllers: [ToolController],
  imports: [UserModule],
})
export class ToolModule {}
