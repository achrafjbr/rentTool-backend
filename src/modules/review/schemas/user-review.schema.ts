import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { User } from 'src/modules/user/schemas/user.schema';

@Schema({ timestamps: true })
export class UserReview extends Document {
  @Prop({ type: String, required: true, minlength: 1, maxLength: 500 })
  review!: string;

  @Prop({
    type: Types.ObjectId,
    ref: User.name,
    required: true,
  })
  from!: Types.ObjectId;

  @Prop({
    type: Types.ObjectId,
    ref: User.name,
    required: true,
  })
  to!: Types.ObjectId;
}

export const UserReviewSchema = SchemaFactory.createForClass(UserReview);
