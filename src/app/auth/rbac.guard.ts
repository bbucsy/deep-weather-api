import {
  Injectable,
  CanActivate,
  ExecutionContext,
  Logger,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Role } from '../user/user-role.enum';
import { ROLES_GUARD_KEY } from './role.guard';

@Injectable()
export class RBACGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  private logger = new Logger(RBACGuard.name);

  canActivate(context: ExecutionContext): boolean {
    const requiredRole =
      this.reflector.getAllAndOverride<Role>(ROLES_GUARD_KEY, [
        context.getHandler(),
        context.getClass(),
      ]) || Role.User;

    if (requiredRole === Role.Guest) return true;

    const { user } = context.switchToHttp().getRequest();

    this.logger.debug(`User role: ${user.role}, requiredRole: ${requiredRole}`);

    if (requiredRole === Role.User && (user.role === Role.User || Role.Admin))
      return true;

    if (requiredRole === Role.Admin && user.role === Role.Admin) return true;

    return false;
  }
}
