import { HttpInterceptorFn, HttpErrorResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, throwError } from 'rxjs';
import { AuthService } from '../auth/auth.service';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const router = inject(Router);
  // Circular dependency risk if AuthService uses HttpClient which uses this interceptor?
  // Functional interceptors usually fine, but be careful. 
  // We won't inject AuthService here for logout logic to avoid circular dep if mostly just 401 handling.
  // Actually, we can inject it if we are careful or use a lightweight token store.
  // But for HttpOnly cookies, we just need to ensure credentials are sent.

  const token = localStorage.getItem('aau_connect_token');

  let authReq = req;
  if (token) {
    authReq = req.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`
      }
    });
  }

  return next(authReq).pipe(
    catchError((error: HttpErrorResponse) => {
      if (error.status === 401) {
        localStorage.removeItem('aau_connect_token');
        router.navigate(['/login']);
      }
      return throwError(() => error);
    })
  );
};
