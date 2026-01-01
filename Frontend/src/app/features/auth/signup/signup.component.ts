import { Component, inject, signal } from '@angular/core';
import { FormBuilder, Validators, ReactiveFormsModule, FormGroup } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../../core/auth/auth.service';
import { FormErrorMapper } from '../../../core/utils/form-error-mapper';
import { UiStore } from '../../../core/state/ui.store';
import { LucideAngularModule, Sun, Moon } from 'lucide-angular';


@Component({
  selector: 'app-signup',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule, LucideAngularModule],
  template: `
    <div class="auth-container">
      <button class="theme-toggle" (click)="ui.toggleTheme()" [title]="'Toggle Theme'">
        <lucide-icon [img]="ui.theme() === 'dark' ? SunIcon : MoonIcon"></lucide-icon>
      </button>

      <div class="auth-card">
        <h2>Student Registration</h2>
        <div class="steps-indicator">
          <span [class.active]="step() === 1">1. Account</span>
          <span [class.active]="step() === 2">2. Identity</span>
          <span [class.active]="step() === 3">3. Academic</span>
        </div>

        <form [formGroup]="signupForm" (ngSubmit)="onSubmit()">
          
          <!-- Step 1: Account -->
          <div *ngIf="step() === 1" class="step">
            <div class="form-group">
              <label>Email (University)</label>
              <input formControlName="email" type="email" placeholder="kena.kaye-ug@aau.edu.et" />
              <div class="error" *ngIf="getError('email')">{{ getError('email') }}</div>
            </div>
            <div class="form-group">
              <label>Password</label>
              <input formControlName="password" type="password" />
              <div class="error" *ngIf="getError('password')">{{ getError('password') }}</div>
            </div>
            <div class="actions">
              <button type="button" class="btn primary" (click)="nextStep()">Next</button>
            </div>
          </div>

          <!-- Step 2: Identity -->
          <div *ngIf="step() === 2" class="step">
            <div class="form-group">
              <label>First Name</label>
              <input formControlName="firstName" type="text" />
            </div>
            <div class="form-group">
              <label>Last Name</label>
              <input formControlName="lastName" type="text" />
            </div>
            <div class="form-group">
              <label>Student ID</label>
              <input formControlName="studentId" type="text" />
            </div>
            <div class="actions">
              <button type="button" class="btn" (click)="prevStep()">Back</button>
              <button type="button" class="btn primary" (click)="nextStep()">Next</button>
            </div>
          </div>

          <!-- Step 3: Academic -->
          <div *ngIf="step() === 3" class="step">
            <div class="form-group">
              <label>Department</label>
              <select formControlName="department">
                <option value="">Select Department</option>
                <option value="cs">Computer Science</option>
                <option value="eng">Engineering</option>
                <option value="arts">Arts</option>
              </select>
            </div>
            <div class="form-group">
              <label>Year</label>
              <select formControlName="year">
                <option value="">Select Year</option>
                <option value="1">Freshman</option>
                <option value="2">Sophomore</option>
                <option value="3">Junior</option>
                <option value="4">Senior</option>
              </select>
            </div>
            <div class="actions">
              <button type="button" class="btn" (click)="prevStep()">Back</button>
              <button type="submit" class="btn primary full" [disabled]="signupForm.invalid || creating()">
                {{ creating() ? 'Creating Account...' : 'Finish Registration' }}
              </button>
            </div>
          </div>
        </form>
        
        <div class="footer">
          Already have an account? <a routerLink="/login">Login</a>
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
      padding: 2rem;
      border-radius: var(--radius-lg);
      box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
      width: 100%;
      max-width: 440px;
    }
    h2 { text-align: center; margin-bottom: 1.5rem; color: var(--primary-600); }
    .steps-indicator {
      display: flex;
      justify-content: space-between;
      margin-bottom: 2rem;
      font-size: var(--text-sm);
      color: var(--text-secondary);
    }
    .steps-indicator span.active {
      color: var(--primary-600);
      font-weight: 600;
      border-bottom: 2px solid var(--primary-600);
    }
    .form-group { margin-bottom: 1rem; }
    label { display: block; margin-bottom: 0.5rem; font-weight: 500; font-size: var(--text-sm); }
    input, select {
      width: 100%;
      padding: 0.75rem;
      border: 1px solid var(--border-color);
      border-radius: var(--radius-md);
      background: var(--bg-app);
      color: var(--text-primary);
    }

    .error { color: var(--danger-500); font-size: var(--text-xs); margin-top: 0.25rem; }
    .actions { display: flex; gap: 1rem; margin-top: 1.5rem; }
    .btn {
      flex: 1;
      padding: 0.75rem;
      border: 1px solid var(--border-color);
      border-radius: var(--radius-md);
      background: white;
      cursor: pointer;
      text-align: center;
    }
    .btn.primary {
      background: var(--primary-600);
      color: white;
      border: none;
    }
    .btn.full { width: 100%; }
    .footer { text-align: center; margin-top: 1.5rem; font-size: var(--text-sm); }

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
  `]
})
export class SignupComponent {
  private fb = inject(FormBuilder);
  private auth = inject(AuthService); // Assuming generic register method exists or mock it
  private router = inject(Router);
  protected ui = inject(UiStore);

  readonly SunIcon = Sun;
  readonly MoonIcon = Moon;

  step = signal(1);
  creating = signal(false);

  signupForm = this.fb.group({
    email: ['', [Validators.required, Validators.pattern(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/)]],
    password: ['', [
      Validators.required,
      Validators.minLength(8),
      Validators.pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^a-zA-Z0-9]).{8,}$/)
    ]],
    firstName: ['', Validators.required],
    lastName: ['', Validators.required],
    studentId: ['', Validators.required],
    department: ['', Validators.required],
    year: ['', Validators.required]
  });

  getError(controlName: string) {
    const control = this.signupForm.get(controlName);
    if (control?.touched && control.errors) {
      if (controlName === 'email' && control.errors['pattern']) {
        return 'Please enter a valid (e.g. academic) email address';
      }
      if (controlName === 'password' && control.errors['pattern']) {
        return 'Password must contain uppercase, lowercase, number, and special char';
      }
      return FormErrorMapper.getMessage(controlName, control.errors);
    }
    return null;
  }

  nextStep() {
    if (this.step() === 1) {
      const emailCtrl = this.signupForm.get('email');
      const passCtrl = this.signupForm.get('password');
      if (emailCtrl?.invalid || passCtrl?.invalid) {
        emailCtrl?.markAsTouched();
        passCtrl?.markAsTouched();
        return;
      }
    }
    // Validation for step 2 ...

    this.step.update(s => s + 1);
  }

  prevStep() {
    this.step.update(s => s - 1);
  }

  onSubmit() {
    if (this.signupForm.invalid) return;

    this.creating.set(true);
    // Mock Signup
    setTimeout(() => {
      this.creating.set(false);
      this.router.navigate(['/login']);
    }, 1500);
  }
}
