import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';
import { AuthService } from '../auth/auth.service';
import { UserRole } from '../models/user.model';

export const roleGuard: CanActivateFn = (route, state) => {
  const auth = inject(AuthService);
  const router = inject(Router);

  const requiredRole = route.data['role'] as UserRole;

  if (auth.isAuthenticated() && auth.hasRole(requiredRole)) {
    return true;
  }

  // Optional: Redirect to unauthorized page
  return router.createUrlTree(['/dashboard']);
};
