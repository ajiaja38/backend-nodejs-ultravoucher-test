import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

export enum Role {
  ADMIN = 'admin',
  USER = 'user',
}

@Schema()
export class User {
  @Prop({
    type: String,
    required: true,
    unique: true,
  })
  id: string;

  @Prop({
    type: String,
    required: true,
  })
  name: string;

  @Prop({
    type: String,
    required: true,
    unique: true,
  })
  email: string;

  @Prop({
    type: String,
    required: true,
  })
  password: string;

  @Prop({
    type: String,
    required: true,
  })
  role: Role;

  @Prop({ type: String, required: true })
  phone: string;

  @Prop({
    type: Date,
    default: Date.now,
  })
  createdAt: Date;

  @Prop({
    type: Date,
    default: Date.now,
  })
  updatedAt: Date;
}

export const UserSchema = SchemaFactory.createForClass(User);
