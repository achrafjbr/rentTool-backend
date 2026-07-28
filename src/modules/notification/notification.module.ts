import { Module } from '@nestjs/common';
import { NotificationService } from './notification.service';
import { NotificationController } from './notification.controller';
import { MongooseModule } from '@nestjs/mongoose';
import {
  Notification,
  NotificationSchema,
} from './schemas/notification.schema';
import { AuthenticationJwtService } from '../authentication/authentication.jwt.service';

@Module({
  controllers: [NotificationController],
  providers: [NotificationService, AuthenticationJwtService],
  exports: [NotificationService],
  imports: [
    MongooseModule.forFeature([
      {
        name: Notification.name,
        schema: NotificationSchema,
      },
    ]),
  ],
})
export class NotificationModule {}
