import {
  Injectable,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Observable } from 'rxjs';
import { JwtPayloadInterface } from '../interface/jwtPayload.interface';
import { Role } from 'src/user/schema/user.schema';

@Injectable()
export class RoleGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const roles = this.reflector.get<string[]>('roles', context.getHandler());

    if (!roles) {
      return true;
    }

    const request = context.switchToHttp().getRequest();
    const user: JwtPayloadInterface = request.user;

    if (!this.matchRoles(roles, user.role)) {
      throw new ForbiddenException(
        'You do not have permission to access this resource',
      );
    }

    return this.matchRoles(roles, user.role);
  }

  private matchRoles(allowedRoles: string[], userRole: Role) {
    return allowedRoles.some((role) => role === userRole);
  }
}
