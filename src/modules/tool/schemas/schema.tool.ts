import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document, Types } from 'mongoose';
import { User } from 'src/modules/user/schemas/user.schema';

export enum ToolStatus {
  AVAILABLE = 'AVAILABLE',
  RENTED = 'RENTED',
}

@Schema({ timestamps: true })
export class Tool extends Document {
  @Prop({ type: String, required: true })
  name!: string;

  @Prop({ type: String, required: true, maxLength: 800, minlength: 10 })
  description!: string;

  @Prop({ type: String, required: true })
  category!: string;

  @Prop({ type: Number, required: true, min: 1 })
  pricePerDay!: number;

  @Prop({ type: Number, required: true, min: 1 })
  depositAmount!: number;

  @Prop({ type: String, required: true })
  image!: string;

  @Prop({ type: String, enum: ToolStatus, default: ToolStatus.AVAILABLE })
  toolStatus?: ToolStatus;

  @Prop({
    type: Types.ObjectId,
    ref: User.name,
    required: true,
  })
  owner!: Types.ObjectId;
}

export const ToolSchema = SchemaFactory.createForClass(Tool);
