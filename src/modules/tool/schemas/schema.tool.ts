import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document } from 'mongoose';
import { User } from 'src/modules/user/schemas/user.schema';

export enum ToolStatus {
  AVAILABLE,
  PEINDING,
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
  dipositAmount!: number;

  @Prop({ type: String, enum: ToolStatus, default: ToolStatus.AVAILABLE })
  toolSatatus!: string;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true })
  owner!: User;
}

export const ToolSchema = SchemaFactory.createForClass(Tool);
