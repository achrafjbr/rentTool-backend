import {
  IsBoolean,
  IsEnum,
  isEnum,
  IsMongoId,
  IsNotEmpty,
  IsOptional,
  IsString,
} from 'class-validator';
import { NotificationType } from '../schemas/notification.schema';
import { ObjectId, Types } from 'mongoose';

export class CreateNotificationDto {
  receiver!: Types.ObjectId;

  sender!: string;

  review?: Types.ObjectId;

  rental?: Types.ObjectId;

  title!: string;

  message!: string;

  isRead?: boolean;

  isSeen?: boolean;

  type!: NotificationType;
}
