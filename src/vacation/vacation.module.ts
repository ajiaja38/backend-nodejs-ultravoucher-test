import { Module } from '@nestjs/common';
import { VacationService } from './vacation.service';
import { VacationController } from './vacation.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Vacation, VacationSchema } from './schema/vacation.schema';
import { TimezoneModule } from 'src/timezone/timezone.module';
import { UuidModule } from 'src/uuid/uuid.module';
import { MessageModule } from 'src/message/message.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Vacation.name, schema: VacationSchema },
    ]),
    TimezoneModule,
    UuidModule,
    MessageModule,
  ],
  controllers: [VacationController],
  providers: [VacationService],
})
export class VacationModule {}
