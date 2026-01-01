import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';
import { AuthService } from '../auth/auth.service';

export const verifiedStudentGuard: CanActivateFn = (route, state) => {
  const auth = inject(AuthService);
  const router = inject(Router);

  if (auth.isVerified()) {
    return true;
  }

  // Redirect to verification or onboarding
  return router.createUrlTree(['/verification']);
};
