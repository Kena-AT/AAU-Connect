import { Injectable, signal, computed, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { User, UserRole } from '../models/user.model';
import { tap, catchError, of, Observable, throwError } from 'rxjs';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private http = inject(HttpClient);
  private router = inject(Router);

  // State
  private _currentUser = signal<User | null>(null);

  // Public Signals
  readonly currentUser = this._currentUser.asReadonly();
  readonly isAuthenticated = computed(() => !!this._currentUser());
  readonly isVerified = computed(() => this._currentUser()?.isVerified ?? false);

  constructor() {
    // Attempt to restore session on init
    this.checkSession().subscribe();
  }

  // Actions
  login(credentials: any): Observable<User> {
    // MOCK LOGIN FOR MVP (Simulating Backend)
    const mockUser: User = {
      id: '1',
      email: credentials.email,
      firstName: 'Student',
      lastName: 'User',
      role: 'student',
      isVerified: true, // Auto-verify for demo
      department: 'CS'
    };

    this._currentUser.set(mockUser);
    return of(mockUser);

    // Original implementation for Real Backend:
    /*
    return this.http.post<User>('/api/auth/login', credentials).pipe(
      tap(user => this._currentUser.set(user))
    );
    */
  }


  logout(): void {
    this.http.post('/api/auth/logout', {}).subscribe(() => {
      this._currentUser.set(null);
      this.router.navigate(['/login']);
    });
  }

  checkSession(): Observable<User | null> {
    return this.http.get<User>('/api/auth/me').pipe(
      tap(user => this._currentUser.set(user)),
      catchError(() => {
        this._currentUser.set(null);
        return of(null);
      })
    );
  }

  hasRole(role: UserRole): boolean {
    return this._currentUser()?.role === role;
  }
}
