import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

export const roleGuard: CanActivateFn = (route, state) => {

  const authService = inject(AuthService);
  const router = inject(Router);

  const userRole = authService.getRole();
  const allowedRoles = route.data['roles'] as string[];

  if (!userRole) {
    router.navigate(['']);
    return false;
  }

  if (allowedRoles && !allowedRoles.includes(userRole)) {
    router.navigate(['']);
    return false;
  }

  return true;
};
