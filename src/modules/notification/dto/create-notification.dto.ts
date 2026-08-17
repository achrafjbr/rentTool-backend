import { NotificationType, RelatedType } from '../schemas/notification.schema';
import { Types } from 'mongoose';

export class CreateNotificationDto {
  receiver!: string;

  sender!: string;

  related!: string;

  title!: string;

  message!: string;

  isRead?: boolean;

  isSeen?: boolean;

  type!: NotificationType;

  // relatedTye?: RelatedType; // in this version (V1) will be optional
}
