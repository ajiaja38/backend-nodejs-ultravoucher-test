import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

@Schema()
export class Auth {
  @Prop({ type: String, required: true })
  userId: string;

  @Prop({ type: String, required: true })
  refreshToken: string;

  @Prop({ type: Date, required: true })
  expiredIn: Date;
}

export const AuthSchema = SchemaFactory.createForClass(Auth);
