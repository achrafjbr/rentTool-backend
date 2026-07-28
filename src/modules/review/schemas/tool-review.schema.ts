import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { Tool } from 'src/modules/tool/schemas/schema.tool';
import { User } from 'src/modules/user/schemas/user.schema';

@Schema({ timestamps: true })
export class ToolReview extends Document {
  @Prop({ type: String, required: true, minlength: 1, maxLength: 500 })
  review!: string;

  @Prop({
    type: Types.ObjectId,
    ref: User.name,
    required: true,
  })
  author!: Types.ObjectId;

  @Prop({
    type: Types.ObjectId,
    ref: Tool.name,
    required: true,
  })
  tool!: Types.ObjectId;
}

export const ToolReviewSchema = SchemaFactory.createForClass(ToolReview);
