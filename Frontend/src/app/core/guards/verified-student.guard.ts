import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';
import { AuthService } from '../auth/auth.service';

export const verifiedStudentGuard: CanActivateFn = (route, state) => {
  const auth = inject(AuthService);
  const router = inject(Router);

  if (auth.isAuthenticated() && auth.isVerified()) {
    return true;
  }

  // Redirect to login if not authenticated or verified
  return router.createUrlTree(['/login']);
};
