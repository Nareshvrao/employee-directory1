import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';
import { AuthService } from './service/auth/auth.service';

export const authGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const requiredRoles = route.data['roles'];
  const currentRole = authService.getRole();
  const router = inject(Router);

  if (!authService.isLoggedIn()) {
      if (
        requiredRoles &&
        !requiredRoles.includes(currentRole)
      ) {
        router.navigate(['/']);

        return false;
      }
  }
  return true;
};
