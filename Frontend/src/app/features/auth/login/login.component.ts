import { Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../../core/auth/auth.service';
import { FormErrorMapper } from '../../../core/utils/form-error-mapper';
import { UiStore } from '../../../core/state/ui.store';
import { LucideAngularModule, Sun, Moon } from 'lucide-angular';


@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule, LucideAngularModule],
  template: `
    <div class="auth-container">
      <button class="theme-toggle" (click)="ui.toggleTheme()" [title]="'Toggle Theme'">
        <lucide-icon [img]="ui.theme() === 'dark' ? SunIcon : MoonIcon"></lucide-icon>
      </button>

      <div class="auth-card">
        <h2>Welcome Back</h2>
        <p class="subtitle">Login to your student account</p>

        <form [formGroup]="loginForm" (ngSubmit)="onSubmit()">
          <div class="form-group">
            <label>Email</label>
            <input formControlName="email" type="email" placeholder="kena.kaye-ug@aau.edu.et" />
            <div class="error" *ngIf="getError('email')">{{ getError('email') }}</div>
          </div>
          
          <div class="form-group">
            <label>Password</label>
            <input formControlName="password" type="password" />
            <div class="error" *ngIf="getError('password')">{{ getError('password') }}</div>
          </div>

          <div class="form-group checkbox">
            <label>
              <input type="checkbox" formControlName="rememberMe" /> Remember me
            </label>
            <a routerLink="/forgot-password" class="forgot-link">Forgot Password?</a>
          </div>

          <div class="actions">
            <button type="submit" class="btn primary full" [disabled]="loginForm.invalid || loading()">
              {{ loading() ? 'Logging in...' : 'Login' }}
            </button>
          </div>
        </form>

        <div *ngIf="errorMessage()" class="global-error">
          {{ errorMessage() }}
        </div>

        <div class="footer">
          Don't have an account? <a routerLink="/signup">Sign up</a>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .auth-container {
      display: flex;
      justify-content: center;
      align-items: center;
      min-height: 100vh;
      background: var(--bg-app);
    }
    .auth-card {
      background: var(--bg-card);
      padding: 2.5rem;
      border-radius: var(--radius-lg);
      box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
      width: 100%;
      max-width: 400px;
    }
    h2 { text-align: center; margin-bottom: 0.5rem; color: var(--text-primary); }
    .subtitle { text-align: center; margin-bottom: 2rem; color: var(--text-secondary); }
    .form-group { margin-bottom: 1.25rem; }
    label { display: block; margin-bottom: 0.5rem; font-weight: 500; font-size: var(--text-sm); }
    input[type="email"], input[type="password"] {
      width: 100%;
      padding: 0.75rem;
      border: 1px solid var(--border-color);
      border-radius: var(--radius-md);
      background: var(--bg-app);
      color: var(--text-primary);
      font-family: inherit;
    }

    .form-group.checkbox {
      display: flex;
      justify-content: space-between;
      align-items: center;
      font-size: var(--text-sm);
    }
    .form-group.checkbox label { display: flex; align-items: center; gap: 0.5rem; margin: 0; font-weight: 400; }
    .forgot-link { color: var(--primary-600); text-decoration: none; }
    .error { color: var(--danger-500); font-size: var(--text-xs); margin-top: 0.25rem; }
    .actions { margin-top: 1.5rem; }
    .btn {
      width: 100%;
      padding: 0.75rem;
      border: none;
      border-radius: var(--radius-md);
      cursor: pointer;
      font-weight: 500;
    }
    .btn.primary { background: var(--primary-600); color: white; }
    .btn:disabled { opacity: 0.7; cursor: not-allowed; }
    .footer { text-align: center; margin-top: 2rem; font-size: var(--text-sm); }
    a { color: var(--primary-600); text-decoration: none; }

    .theme-toggle {
      position: absolute;
      top: 2rem;
      right: 2rem;
      width: 48px;
      height: 48px;
      border-radius: var(--radius-full);
      background: var(--bg-card);
      border: 1px solid var(--border-color);
      color: var(--text-primary);
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      transition: all var(--transition-base);
      box-shadow: var(--shadow-sm);
    }
    .theme-toggle:hover {
      transform: scale(1.1) rotate(15deg);
      background: var(--bg-app);
      box-shadow: var(--shadow-md);
      color: var(--primary-600);
    }

    .global-error {
      background: rgba(239, 68, 68, 0.1);
      color: var(--danger-500);
      padding: 0.75rem;
      border-radius: var(--radius-md);
      margin-top: 1rem;
      font-size: var(--text-sm);
      text-align: center;
      border: 1px solid var(--danger-500);
    }
  `]
})
export class LoginComponent {
  private fb = inject(FormBuilder);
  private auth = inject(AuthService);
  private router = inject(Router);
  protected ui = inject(UiStore);

  readonly SunIcon = Sun;
  readonly MoonIcon = Moon;

  loading = signal(false);
  errorMessage = signal<string | null>(null);

  loginForm = this.fb.group({
    email: ['', [Validators.required, Validators.pattern(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/)]],
    password: ['', [Validators.required]],
    rememberMe: [false]
  });

  getError(controlName: string) {
    const control = this.loginForm.get(controlName);
    if (control?.touched && control.errors) {
      if (controlName === 'email' && control.errors['pattern']) {
        return 'Please enter a valid email address';
      }
      return FormErrorMapper.getMessage(controlName, control.errors);
    }
    return null;
  }

  onSubmit() {
    if (this.loginForm.invalid) return;

    this.loading.set(true);
    this.errorMessage.set(null);

    this.auth.login(this.loginForm.value).subscribe({
      next: () => {
        this.loading.set(false);
        this.router.navigate(['/dashboard']);
      },
      error: (err) => {
        this.loading.set(false);
        this.errorMessage.set(err.error?.message || 'Login failed. Please check your credentials.');
        console.error(err);
      }
    });
  }

}
