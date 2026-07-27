import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

import { HydratedDocument, Types } from 'mongoose';
import { ToolReview } from 'src/modules/tool-review/schemas/tool-review.schema';
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
  receiverId!: Types.ObjectId;

  @Prop({
    type: Types.ObjectId,
    ref: User.name,
    required: true,
  })
  senderId!: Types.ObjectId;

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

  // Optional if notification is related to a rental
  @Prop({
    type: Types.ObjectId,
    ref: 'Rental',
    required: false,
  })
  rentalId?: Types.ObjectId;

  // Optional if notification is related to a review
  @Prop({
    type: Types.ObjectId,
    ref: ToolReview.name,
    required: false,
  })
  reviewId?: Types.ObjectId;

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
