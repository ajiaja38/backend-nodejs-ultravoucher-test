import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule } from '@nestjs/config';
import { UserModule } from './user/user.module';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { UuidModule } from './uuid/uuid.module';
import { AuthModule } from './auth/auth.module';
import { TimezoneModule } from './timezone/timezone.module';
import { MessageModule } from './message/message.module';
import { APP_FILTER, APP_INTERCEPTOR } from '@nestjs/core';
import { ExceptionFilter } from './utils/filter/exception.filter';
import { ResponseInterceptor } from './utils/interceptors/response.interceptor';
import { VacationModule } from './vacation/vacation.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'public'),
      serveRoot: '/api/v1/public',
    }),
    MongooseModule.forRoot(process.env.DATABASE),
    UserModule,
    UuidModule,
    AuthModule,
    TimezoneModule,
    MessageModule,
    VacationModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_FILTER,
      useClass: ExceptionFilter,
    },
    {
      provide: APP_INTERCEPTOR,
      useClass: ResponseInterceptor,
    },
  ],
})
export class AppModule {}
