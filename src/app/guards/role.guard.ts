import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

export const roleGuard: CanActivateFn = (route, state) => {

  const authService = inject(AuthService);
  const router = inject(Router);

  const userRoles = authService.getRoles();
  const allowedRoles = route.data['roles'] as string[];

  if (userRoles.length === 0) {
    router.navigate(['']);
    return false;
  }

  if (allowedRoles && !authService.hasAnyRole(allowedRoles)) {
    router.navigate(['']);
    return false;
  }

  return true;
};
