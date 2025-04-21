
import { applyDecorators, SetMetadata, UseGuards } from '@nestjs/common';
import { AuthGuard } from '../guards/authentication';
import { RolesGuard } from '../guards/autorization';
import { UserRoles } from '../types/types';

export function Auth(...roles: UserRoles[]) {
  return applyDecorators(
    SetMetadata('roles', roles),
    UseGuards(AuthGuard, RolesGuard),

  );
}
