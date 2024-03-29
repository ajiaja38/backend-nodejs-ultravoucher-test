import { ExecutionContext, createParamDecorator } from '@nestjs/common';
import { JwtPayloadInterface } from '../interface/jwtPayload.interface';

export const Userlogged = createParamDecorator(
  (data: unknown, context: ExecutionContext): JwtPayloadInterface => {
    const req = context.switchToHttp().getRequest();
    return req.user as JwtPayloadInterface;
  },
);
