import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { NotificationService } from './notification.service';
import type { JwtPayloadType } from 'src/common/types/types.auth';
import { CurrentUser } from 'src/common/decorators/decorators.currentUser';
import { ParseObjectIdPipe } from '@nestjs/mongoose';
import { AuthGuard } from 'src/common/decorators/decorator.authGuard';

@Controller('notification')
@UseGuards(AuthGuard)
export class NotificationController {
  constructor(private readonly notificationService: NotificationService) {}

  @Get('me')
  async me(@CurrentUser() userPayload: JwtPayloadType) {
    return await this.notificationService.myNotifications(userPayload.id);
  }

  @Get('un-read')
  async unReadNotifications(@CurrentUser() user: JwtPayloadType) {
    return await this.notificationService.unReadNotifications(user.id);
  }

  @Get(':id')
  async getNotificationById(
    @Param('id', ParseObjectIdPipe) notificationId: string,
  ) {
    return await this.notificationService.getNotificationById(notificationId);
  }

  @Patch(':id/read')
  async markNotificationAsRead(
    @CurrentUser() user: JwtPayloadType,
    @Param('id', ParseObjectIdPipe) notificationId: string,
  ) {
    return await this.notificationService.markNotificationAsRead(
      user.id,
      notificationId,
    );
  }

  @Patch('read-all')
  async markAllNotificationAsRead(@CurrentUser() user: JwtPayloadType) {
    return await this.notificationService.markAllNotificationAsRead(user.id);
  }
}
