import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';
import { AuthService } from '../auth/auth.service';

export const onboardingIncompleteGuard: CanActivateFn = (route, state) => {
  const auth = inject(AuthService);
  const router = inject(Router);

  // Assumption: User model has 'isOnboarded' or we check via API or detailed profile
  // For MVP, if not verified, maybe they aren't onboarded? 
  // Or checking if they have selected department/year.
  // Let's assume User has 'department' populated if onboarded.

  const user = auth.currentUser();

  if (user && !user.department) {
    return true; // Allow access to onboarding
  }

  if (user && user.department) {
    // Already onboarded, redirect to dashboard
    return router.createUrlTree(['/dashboard']);
  }

  return true;
};
