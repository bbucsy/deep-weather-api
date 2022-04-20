import { ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { AuthGuard } from '@nestjs/passport';
import { Role } from '../user/user-role.enum';

import { ROLES_GUARD_KEY } from './role.guard';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  constructor(private reflector: Reflector) {
    super();
  }

  canActivate(context: ExecutionContext) {
    const role =
      this.reflector.getAllAndOverride<Role>(ROLES_GUARD_KEY, [
        context.getHandler(),
        context.getClass(),
      ]) || Role.User;

    if (role == Role.Guest) return true;

    return super.canActivate(context);
  }
}
