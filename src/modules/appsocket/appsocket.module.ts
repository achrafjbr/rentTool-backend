import { Module } from '@nestjs/common';
import { AuthenticationJwtService } from '../authentication/authentication.jwt.service';
import { AppsocketGateway } from './appsocket.gateway';
import { ReviewModule } from '../review/review.module';
import { RealtimeModule } from '../realtime/realtime.module';

@Module({
  providers: [AppsocketGateway, AuthenticationJwtService],
  imports: [ReviewModule, RealtimeModule],
})
export class AppsocketModule {}
