import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({ timestamps: true })
export class Authentication extends Document {
  @Prop({
    type: String,
    required: true,
  })
  fullName!: string;

  @Prop({
    type: String,
    required: true,
  })
  phone!: string;

  @Prop({
    type: String,
    required: true,
  })
  email!: string;

  @Prop({
    type: String,
    required: true,
  })
  password!: string;
}

export const AuthenticationSchema =
  SchemaFactory.createForClass(Authentication);
