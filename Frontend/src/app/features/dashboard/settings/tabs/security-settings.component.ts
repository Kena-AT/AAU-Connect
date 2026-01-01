import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { LucideAngularModule, Shield, Key, Smartphone, AlertTriangle } from 'lucide-angular';
import { SettingsApiService } from '../../../../core/api/settings-api.service';

@Component({
  selector: 'app-security-settings',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, LucideAngularModule],
  template: `
    <div class="security-settings">
      <h2 class="section-title">Security Settings</h2>
      <p class="section-description">Manage your account security and active sessions</p>

      <!-- Change Password -->
      <div class="security-section">
        <div class="section-header">
          <lucide-icon [img]="KeyIcon" class="section-icon"></lucide-icon>
          <h3>Change Password</h3>
        </div>

        <form [formGroup]="passwordForm" (ngSubmit)="onChangePassword()" class="password-form">
          <div class="form-group">
            <label>Current Password *</label>
            <input type="password" formControlName="currentPassword" class="form-input" placeholder="Enter current password" />
            @if (passwordForm.get('currentPassword')?.touched && passwordForm.get('currentPassword')?.errors) {
              <span class="error">Current password is required</span>
            }
          </div>

          <div class="form-group">
            <label>New Password *</label>
            <input type="password" formControlName="newPassword" class="form-input" placeholder="Enter new password" />
            @if (passwordForm.get('newPassword')?.touched && passwordForm.get('newPassword')?.errors) {
              <span class="error">Password must be at least 8 characters</span>
            }
          </div>

          <div class="form-group">
            <label>Confirm New Password *</label>
            <input type="password" formControlName="confirmPassword" class="form-input" placeholder="Confirm new password" />
            @if (passwordForm.get('confirmPassword')?.touched && passwordForm.get('confirmPassword')?.errors) {
              <span class="error">Passwords must match</span>
            }
          </div>

          <button type="submit" class="btn-primary" [disabled]="passwordForm.invalid">
            Change Password
          </button>
        </form>
      </div>

      <!-- Two-Factor Authentication -->
      <div class="security-section">
        <div class="section-header">
          <lucide-icon [img]="ShieldIcon" class="section-icon"></lucide-icon>
          <h3>Two-Factor Authentication</h3>
        </div>

        <div class="mfa-container">
          <div class="mfa-info">
            <p>Add an extra layer of security to your account</p>
            <p class="mfa-status">Status: <span [class.enabled]="mfaEnabled()" [class.disabled]="!mfaEnabled()">{{ mfaEnabled() ? 'Enabled' : 'Disabled' }}</span></p>
          </div>
          <button class="toggle-btn" (click)="toggleMFA()" [class.active]="mfaEnabled()">
            <span class="toggle-slider"></span>
          </button>
        </div>

        @if (mfaEnabled()) {
          <div class="mfa-setup">
            <lucide-icon [img]="AlertIcon" class="alert-icon"></lucide-icon>
            <p>Scan the QR code with your authenticator app to complete setup</p>
          </div>
        }
      </div>

      <!-- Active Sessions -->
      <div class="security-section">
        <div class="section-header">
          <lucide-icon [img]="SmartphoneIcon" class="section-icon"></lucide-icon>
          <h3>Active Sessions</h3>
        </div>

        <div class="sessions-list">
          @for (session of activeSessions; track session.id) {
            <div class="session-item" [class.current]="session.isCurrent">
              <div class="session-info">
                <h4>{{ session.device }} - {{ session.browser }}</h4>
                <p>{{ session.location }} • Last active: {{ session.lastActive | date:'short' }}</p>
                @if (session.isCurrent) {
                  <span class="current-badge">Current Session</span>
                }
              </div>
              @if (!session.isCurrent) {
                <button class="btn-logout" (click)="logoutSession(session.id)">
                  Logout
                </button>
              }
            </div>
          }
        </div>

        <button class="btn-danger" (click)="logoutAllSessions()">
          Logout All Other Sessions
        </button>
      </div>
    </div>
  `,
  styles: [`
    .security-settings {
      max-width: 700px;
    }

    .section-title {
      font-size: var(--text-2xl);
      font-weight: 800;
      font-family: var(--font-display);
      margin-bottom: var(--space-2);
    }

    .section-description {
      color: var(--text-secondary);
      margin-bottom: var(--space-6);
    }

    .security-section {
      padding: var(--space-6);
      background: var(--bg-glass);
      border: 1px solid var(--border-glass);
      border-radius: var(--radius-2xl);
      margin-bottom: var(--space-5);
    }

    .section-header {
      display: flex;
      align-items: center;
      gap: var(--space-3);
      margin-bottom: var(--space-4);
    }

    .section-icon {
      width: 24px;
      height: 24px;
      color: var(--primary-500);
    }

    .section-header h3 {
      font-size: var(--text-lg);
      font-weight: 700;
      margin: 0;
    }

    .password-form {
      display: flex;
      flex-direction: column;
      gap: var(--space-4);
    }

    .form-group {
      display: flex;
      flex-direction: column;
      gap: var(--space-2);
    }

    .form-group label {
      font-size: var(--text-sm);
      font-weight: 700;
      color: var(--text-primary);
    }

    .form-input {
      padding: var(--space-3);
      border: 2px solid var(--border-color);
      border-radius: var(--radius-lg);
      background: var(--bg-card);
      color: var(--text-primary);
      font-family: inherit;
      font-size: var(--text-base);
      transition: all var(--transition-base);
    }

    .form-input:focus {
      outline: none;
      border-color: var(--primary-500);
      box-shadow: 0 0 0 3px rgba(99, 102, 241, 0.1);
    }

    .error {
      color: var(--danger-500);
      font-size: var(--text-xs);
      font-weight: 600;
    }

    .btn-primary, .btn-danger, .btn-logout {
      padding: var(--space-3) var(--space-6);
      border: none;
      border-radius: var(--radius-xl);
      font-weight: 700;
      font-size: var(--text-base);
      cursor: pointer;
      transition: all var(--transition-base);
    }

    .btn-primary {
      background: var(--gradient-primary);
      color: white;
      box-shadow: var(--shadow-lg);
    }

    .btn-primary:hover:not(:disabled) {
      transform: translateY(-2px);
      box-shadow: var(--shadow-xl);
    }

    .btn-primary:disabled {
      opacity: 0.5;
      cursor: not-allowed;
    }

    .btn-danger {
      background: var(--danger-500);
      color: white;
      width: 100%;
      margin-top: var(--space-4);
    }

    .btn-danger:hover {
      background: #dc2626;
      transform: translateY(-2px);
    }

    .mfa-container {
      display: flex;
      justify-content: space-between;
      align-items: center;
      gap: var(--space-4);
    }

    .mfa-info p {
      margin: 0 0 var(--space-2) 0;
      color: var(--text-secondary);
    }

    .mfa-status {
      font-weight: 700;
    }

    .mfa-status .enabled {
      color: var(--success-500);
    }

    .mfa-status .disabled {
      color: var(--text-secondary);
    }

    .toggle-btn {
      position: relative;
      width: 48px;
      height: 26px;
      background: var(--neutral-300);
      border: none;
      border-radius: var(--radius-full);
      cursor: pointer;
      transition: all var(--transition-base);
      box-shadow: inset 0 2px 4px rgba(0, 0, 0, 0.1);
    }

    .toggle-slider {
      position: absolute;
      width: 20px;
      height: 20px;
      left: 3px;
      top: 3px;
      background: white;
      border-radius: var(--radius-full);
      transition: all var(--transition-bounce);
      box-shadow: var(--shadow-md);
    }

    .toggle-btn.active {
      background: var(--gradient-primary);
    }

    .toggle-btn.active .toggle-slider {
      transform: translateX(22px);
    }

    .mfa-setup {
      display: flex;
      align-items: center;
      gap: var(--space-3);
      margin-top: var(--space-4);
      padding: var(--space-4);
      background: rgba(245, 158, 11, 0.1);
      border: 1px solid var(--accent-500);
      border-radius: var(--radius-lg);
    }

    .alert-icon {
      width: 20px;
      height: 20px;
      color: var(--accent-500);
      flex-shrink: 0;
    }

    .sessions-list {
      display: flex;
      flex-direction: column;
      gap: var(--space-3);
      margin-bottom: var(--space-4);
    }

    .session-item {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: var(--space-4);
      background: var(--bg-card);
      border: 1px solid var(--border-glass);
      border-radius: var(--radius-lg);
    }

    .session-item.current {
      border-color: var(--primary-500);
      background: rgba(99, 102, 241, 0.05);
    }

    .session-info h4 {
      font-size: var(--text-base);
      font-weight: 700;
      margin: 0 0 var(--space-1) 0;
    }

    .session-info p {
      font-size: var(--text-sm);
      color: var(--text-secondary);
      margin: 0;
    }

    .current-badge {
      display: inline-block;
      margin-top: var(--space-2);
      padding: var(--space-1) var(--space-3);
      background: var(--primary-500);
      color: white;
      font-size: var(--text-xs);
      font-weight: 700;
      border-radius: var(--radius-full);
    }

    .btn-logout {
      background: var(--bg-glass);
      color: var(--text-primary);
      padding: var(--space-2) var(--space-4);
      font-size: var(--text-sm);
    }

    .btn-logout:hover {
      background: var(--danger-500);
      color: white;
    }
  `]
})
export class SecuritySettingsComponent {
  private fb = inject(FormBuilder);
  private api = inject(SettingsApiService);

  readonly ShieldIcon = Shield;
  readonly KeyIcon = Key;
  readonly SmartphoneIcon = Smartphone;
  readonly AlertIcon = AlertTriangle;

  mfaEnabled = signal(false);
  activeSessions = [
    { id: '1', device: 'Windows PC', browser: 'Chrome', location: 'New York, US', lastActive: new Date(), isCurrent: true },
    { id: '2', device: 'iPhone 13', browser: 'Safari', location: 'New York, US', lastActive: new Date(Date.now() - 3600000), isCurrent: false }
  ];

  passwordForm = this.fb.group({
    currentPassword: ['', Validators.required],
    newPassword: ['', [Validators.required, Validators.minLength(8)]],
    confirmPassword: ['', Validators.required]
  });

  onChangePassword() {
    if (this.passwordForm.valid) {
      const { currentPassword, newPassword, confirmPassword } = this.passwordForm.value;
      if (newPassword !== confirmPassword) {
        alert('Passwords do not match');
        return;
      }
      this.api.changePassword({ currentPassword: currentPassword!, newPassword: newPassword!, confirmPassword: confirmPassword! }).subscribe({
        next: () => {
          alert('Password changed successfully');
          this.passwordForm.reset();
        },
        error: () => alert('Failed to change password')
      });
    }
  }

  toggleMFA() {
    const newValue = !this.mfaEnabled();
    this.api.toggleMFA(newValue).subscribe({
      next: (result) => {
        this.mfaEnabled.set(result.mfaEnabled);
        if (result.qrCode) {
          console.log('QR Code:', result.qrCode);
        }
      },
      error: () => alert('Failed to toggle MFA')
    });
  }

  logoutSession(sessionId: string) {
    if (confirm('Are you sure you want to logout this session?')) {
      this.api.logoutSession(sessionId).subscribe({
        next: () => {
          this.activeSessions = this.activeSessions.filter(s => s.id !== sessionId);
        },
        error: () => alert('Failed to logout session')
      });
    }
  }

  logoutAllSessions() {
    if (confirm('This will logout all other sessions. Continue?')) {
      this.api.logoutAllSessions().subscribe({
        next: () => {
          this.activeSessions = this.activeSessions.filter(s => s.isCurrent);
          alert('All other sessions logged out');
        },
        error: () => alert('Failed to logout sessions')
      });
    }
  }
}
