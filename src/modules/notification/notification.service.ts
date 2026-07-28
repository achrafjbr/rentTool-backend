import { Injectable } from '@nestjs/common';
import { CreateNotificationDto } from './dto/create-notification.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Notification, NotificationType } from './schemas/notification.schema';
import { Model } from 'mongoose';
import { JwtPayloadType } from 'src/common/types/types.auth';

@Injectable()
export class NotificationService {
  constructor(
    @InjectModel(Notification.name)
    readonly notificationModel: Model<Notification>,
  ) {}

  async createNotification(createNotificationDto: CreateNotificationDto) {
    return await this.notificationModel.create(createNotificationDto);
  }

  // async rejectRental() {}

  // async approveRental() {}

  async myNotifications(userId: string) {
    return await this.notificationModel
      .find({ receiver: userId })
      .populate({
        path: 'sender',
        select: { fullName: 1, picture: 1 },
      })
      .sort({ createdAt: -1 });
  }

  async getNotificationById(notificationId: string) {
    const notification = await this.notificationModel
      .findById(notificationId)
      .populate({
        path: 'sender',
        select: { fullName: 1, picture: 1 },
      });
    return notification;
  }

  async markNotidicationAsRead(userId: string, notificationId: string) {
    return await this.notificationModel.findOneAndUpdate(
      {
        _id: notificationId,
        receiver: userId,
      },
      { isRead: true },
      { new: true },
    );
  }

  async markAllNotidicationAsRead(userId: string) {
    await this.notificationModel.updateMany(
      {
        receiver: userId,
        isRead: false,
      },
      { isRead: true },
    );
    return {
      message: 'All notifications marked as read.',
    };
  }
}
