import { Prop, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export class User extends Document {
  @Prop({ type: String, required: true })
  fullName!: string;

  @Prop({ type: String, required: true })
  email!: string;

  @Prop({ type: String, required: true })
  password!: string;

  @Prop({ type: String, required: true })
  phone!: string;

  @Prop({ type: String })
  city?: string;

  @Prop({ type: String })
  picture?: string;

  @Prop({ type: String })
  bio?: string;

  @Prop({ type: String })
  whatsapp?: string;
}

export const UserSchema = SchemaFactory.createForClass(User);
