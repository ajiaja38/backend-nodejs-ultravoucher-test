import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { MessageModule } from 'src/message/message.module';
import { PassportModule } from '@nestjs/passport';
import { TimezoneModule } from 'src/timezone/timezone.module';
import { JwtModule } from '@nestjs/jwt';
import { jwtConstant } from './constant';
import { JwtStrategy } from './strategy/jwt.stragety';
import { UserModule } from 'src/user/user.module';
import { MongooseModule } from '@nestjs/mongoose';
import { Auth, AuthSchema } from './schema/auth.schema';
import { TokenManagerService } from './token-manager.service';

@Module({
  imports: [
    UserModule,
    MessageModule,
    PassportModule,
    TimezoneModule,
    JwtModule.register({
      global: true,
      secret: jwtConstant.accessTokenSecret,
      signOptions: {
        expiresIn: '5m',
      },
    }),
    MongooseModule.forFeature([{ name: Auth.name, schema: AuthSchema }]),
  ],
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy, TokenManagerService],
})
export class AuthModule {}
