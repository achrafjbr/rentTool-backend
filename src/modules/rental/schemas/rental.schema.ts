import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { Tool } from 'src/modules/tool/schemas/schema.tool';
import { User } from 'src/modules/user/schemas/user.schema';

export enum RentalStatus {
  PENDING = 'PENDING',
  APPROVED = 'APPROVED',
  REJECTED = 'REJECTED',
  COMPLETED = 'COMPLETED',
  RETURN_REQUESTED = 'RETURN_REQUESTED',
}

@Schema({ timestamps: true })
export class Rental extends Document {
  @Prop({
    type: Types.ObjectId,
    ref: Tool.name,
    required: true,
  })
  tool!: Types.ObjectId;

  @Prop({
    type: Types.ObjectId,
    ref: User.name,
    required: true,
  })
  renter!: Types.ObjectId;

  @Prop({
    type: Types.ObjectId,
    ref: User.name,
    required: true,
  })
  owner!: Types.ObjectId;

  @Prop({
    type: Number,
    required: true,
  })
  totalPrice!: number;

  @Prop({
    type: String,
    enum: RentalStatus,
    default: RentalStatus.PENDING,
  })
  rentalStatus!: RentalStatus;
}

export const RentalSchema = SchemaFactory.createForClass(Rental);
