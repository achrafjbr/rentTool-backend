import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { NotificationService } from './notification.service';
import type { JwtPayloadType } from 'src/common/types/types.auth';
import { CurrentUser } from 'src/common/decorators/decorators.currentUser';
import { ParseObjectIdPipe } from '@nestjs/mongoose';

@Controller('notification')
export class NotificationController {
  constructor(private readonly notificationService: NotificationService) {}

  @Get('me')
  async me(@CurrentUser() userPayload: JwtPayloadType) {
    return await this.notificationService.myNotifications(userPayload.id);
  }

  @Get(':id')
  async getNotificationById(
    @Param('id', ParseObjectIdPipe) notificationId: string,
  ) {
    return await this.notificationService.getNotificationById(notificationId);
  }

  @Patch(':id/read')
  async markNotidicationAsRead(
    @CurrentUser() user: JwtPayloadType,
    @Param('id', ParseObjectIdPipe) notificationId: string,
  ) {
    return await this.notificationService.markNotidicationAsRead(
      user.id,
      notificationId,
    );
  }

  @Patch(':id/read-all')
  async markAllNotidicationAsRead(user: JwtPayloadType) {
    return await this.notificationService.markAllNotidicationAsRead(user.id);
  }
}
