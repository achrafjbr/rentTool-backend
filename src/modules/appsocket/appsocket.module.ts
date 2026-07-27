import { Module } from '@nestjs/common';
import { AppsocketService } from './appsocket.service';
import { AuthenticationJwtService } from '../authentication/authentication.jwt.service';
import { AppsocketGateway } from './appsocket.gateway';

@Module({
  providers: [AppsocketGateway, AppsocketService, AuthenticationJwtService],
  exports: [AppsocketGateway],
})
export class AppsocketModule {}
