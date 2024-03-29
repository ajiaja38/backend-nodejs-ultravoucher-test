import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

@Schema()
export class Vacation {
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
  })
  address: string;

  @Prop({
    type: String,
    required: true,
  })
  description: string;

  @Prop({
    type: String,
    required: true,
  })
  latitude: string;

  @Prop({
    type: String,
    required: true,
  })
  longitude: string;

  @Prop({
    type: Date,
    required: true,
  })
  createdAt: Date;

  @Prop({
    type: Date,
    required: true,
  })
  updatedAt: Date;
}

export const VacationSchema = SchemaFactory.createForClass(Vacation);
