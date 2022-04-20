import { SetMetadata } from '@nestjs/common';
import { Role } from '../user/user-role.enum';

export const ROLES_GUARD_KEY = 'roles';
export const RequiredRole = (role: Role) => SetMetadata(ROLES_GUARD_KEY, role);
