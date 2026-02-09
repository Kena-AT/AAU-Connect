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

  private readonly API_URL = 'http://localhost:5000/api/auth';
  private readonly TOKEN_KEY = 'aau_connect_token';

  // State
  private _currentUser = signal<User | null>(null);

  // Public Signals
  readonly currentUser = this._currentUser.asReadonly();
  readonly isAuthenticated = computed(() => !!this._currentUser());
  readonly isVerified = computed(() => this._currentUser()?.isVerified ?? false);

  constructor() {
    this.checkSession().subscribe();
  }

  // Actions
  signup(userData: any): Observable<any> {
    return this.http.post<any>(`${this.API_URL}/signup`, userData).pipe(
      tap(response => {
        if (response.success && response.token) {
          localStorage.setItem(this.TOKEN_KEY, response.token);
          this._currentUser.set(response.user);
        }
      })
    );
  }

  login(credentials: any): Observable<any> {
    return this.http.post<any>(`${this.API_URL}/login`, credentials).pipe(
      tap(response => {
        if (response.success && response.token) {
          localStorage.setItem(this.TOKEN_KEY, response.token);
          this._currentUser.set(response.user);
        }
      })
    );
  }

  logout(): void {
    localStorage.removeItem(this.TOKEN_KEY);
    this._currentUser.set(null);
    this.router.navigate(['/login']);
  }

  checkSession(): Observable<User | null> {
    const token = localStorage.getItem(this.TOKEN_KEY);
    if (!token) return of(null);

    return this.http.get<any>(`${this.API_URL}/me`).pipe(
      tap(response => {
        if (response.success) {
          this._currentUser.set(response.data);
        }
      }),
      catchError(() => {
        localStorage.removeItem(this.TOKEN_KEY);
        this._currentUser.set(null);
        return of(null);
      })
    );
  }

  hasRole(role: UserRole): boolean {
    return this._currentUser()?.role === role;
  }
}
