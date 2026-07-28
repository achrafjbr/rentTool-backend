import { NotificationType } from '../schemas/notification.schema';
import { Types } from 'mongoose';

export class CreateNotificationDto {
  receiver!: Types.ObjectId;

  sender!: string;

  related!: Types.ObjectId;

  title!: string;

  message!: string;

  isRead?: boolean;

  isSeen?: boolean;

  type!: NotificationType;
}
