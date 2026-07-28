import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

import { HydratedDocument, Types } from 'mongoose';
import { ToolReview } from 'src/modules/review/schemas/tool-review.schema';
import { User } from 'src/modules/user/schemas/user.schema';

export type NotificationDocument = HydratedDocument<Notification>;

export enum NotificationType {
  RENT_REQUEST = 'RENT_REQUEST',
  RENT_APPROVED = 'RENT_APPROVED',
  RENT_REJECTED = 'RENT_REJECTED',
  TOOL_REVIEW = 'TOOL_REVIEW',
  USER_REVIEW = 'USER_REVIEW',
}

@Schema({ timestamps: true })
export class Notification {
  @Prop({
    type: Types.ObjectId,
    ref: User.name,
    required: true,
  })
  receiver!: Types.ObjectId;

  @Prop({
    type: Types.ObjectId,
    ref: User.name,
    required: true,
  })
  sender!: Types.ObjectId;

  @Prop({
    required: true,
  })
  title!: string;

  @Prop({
    required: true,
  })
  message!: string;

  @Prop({
    type: String,
    enum: NotificationType,
    required: true,
  })
  type!: NotificationType;

  @Prop({
    type: Types.ObjectId,
    required: true,
  })
  related!: Types.ObjectId;

  @Prop({
    default: false,
  })
  isRead!: boolean;

  @Prop({
    default: false,
  })
  isSeen!: boolean;
}

export const NotificationSchema = SchemaFactory.createForClass(Notification);
