import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { LucideAngularModule, Upload, Save } from 'lucide-angular';
import { SettingsStore } from '../../../../core/state/settings.store';

@Component({
  selector: 'app-account-settings',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, LucideAngularModule],
  template: `
    <div class="account-settings">
      <h2 class="section-title">Account Information</h2>
      <p class="section-description">Update your personal and academic details</p>

      <form [formGroup]="accountForm" (ngSubmit)="onSubmit()" class="settings-form">
        <!-- Profile Picture -->
        <div class="profile-picture-section">
          <div class="avatar-preview">
            <img 
              [src]="profilePictureUrl || '/assets/default-avatar.png'" 
              alt="Profile picture"
              class="avatar-image" />
            <button type="button" class="upload-btn btn-interactive" (click)="fileInput.click()">
              <lucide-icon [img]="UploadIcon" class="icon"></lucide-icon>
            </button>
            <input 
              #fileInput 
              type="file" 
              accept="image/*" 
              (change)="onFileSelected($event)"
              style="display: none" />
          </div>
          <div class="avatar-info">
            <h3>Profile Picture</h3>
            <p>Upload a new profile picture (max 5MB)</p>
          </div>
        </div>

        <!-- Name Fields -->
        <div class="form-row">
          <div class="form-group">
            <label>First Name *</label>
            <input type="text" formControlName="firstName" class="form-input" />
            @if (accountForm.get('firstName')?.touched && accountForm.get('firstName')?.errors) {
              <span class="error">First name is required</span>
            }
          </div>

          <div class="form-group">
            <label>Last Name *</label>
            <input type="text" formControlName="lastName" class="form-input" />
            @if (accountForm.get('lastName')?.touched && accountForm.get('lastName')?.errors) {
              <span class="error">Last name is required</span>
            }
          </div>
        </div>

        <!-- Academic Info -->
        <div class="form-row">
          <div class="form-group">
            <label>Department *</label>
            <select formControlName="department" class="form-input">
              <option value="">Select Department</option>
              <option value="cs">Computer Science</option>
              <option value="eng">Engineering</option>
              <option value="math">Mathematics</option>
              <option value="physics">Physics</option>
            </select>
          </div>

          <div class="form-group">
            <label>Year *</label>
            <select formControlName="year" class="form-input">
              <option value="">Select Year</option>
              <option [value]="1">Freshman</option>
              <option [value]="2">Sophomore</option>
              <option [value]="3">Junior</option>
              <option [value]="4">Senior</option>
            </select>
          </div>
        </div>

        <!-- Bio -->
        <div class="form-group">
          <label>Bio</label>
          <textarea 
            formControlName="bio" 
            class="form-input" 
            rows="4"
            placeholder="Tell us about yourself..."></textarea>
        </div>

        <!-- Social Links -->
        <div class="form-group">
          <label>Portfolio URL</label>
          <input type="url" formControlName="portfolioUrl" class="form-input" placeholder="https://..." />
        </div>

        <div class="form-row">
          <div class="form-group">
            <label>LinkedIn</label>
            <input type="url" formControlName="linkedinUrl" class="form-input" placeholder="https://linkedin.com/in/..." />
          </div>

          <div class="form-group">
            <label>GitHub</label>
            <input type="url" formControlName="githubUrl" class="form-input" placeholder="https://github.com/..." />
          </div>
        </div>

        <!-- Actions -->
        <div class="form-actions">
          <button type="submit" class="btn-save btn-interactive" [disabled]="accountForm.invalid || settingsStore.loading()">
            <lucide-icon [img]="SaveIcon" class="icon"></lucide-icon>
            <span>{{ settingsStore.loading() ? 'Saving...' : 'Save Changes' }}</span>
          </button>
        </div>
      </form>
    </div>
  `,
  styles: [`
    .account-settings {
      max-width: 800px;
    }

    .section-title {
      font-size: var(--text-2xl);
      font-weight: 800;
      font-family: var(--font-display);
      margin-bottom: var(--space-2);
    }

    .section-description {
      color: var(--text-secondary);
      margin-bottom: var(--space-8);
    }

    .profile-picture-section {
      display: flex;
      align-items: center;
      gap: var(--space-6);
      padding: var(--space-6);
      background: var(--bg-glass);
      border-radius: var(--radius-2xl);
      margin-bottom: var(--space-6);
    }

    .avatar-preview {
      position: relative;
    }

    .avatar-image {
      width: 120px;
      height: 120px;
      border-radius: var(--radius-full);
      object-fit: cover;
      border: 4px solid var(--border-glass);
      box-shadow: var(--shadow-lg);
    }

    .upload-btn {
      position: absolute;
      bottom: 0;
      right: 0;
      width: 40px;
      height: 40px;
      background: var(--gradient-primary);
      border: none;
      border-radius: var(--radius-full);
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      box-shadow: var(--shadow-lg);
      transition: all var(--transition-base);
    }

    .upload-btn .icon {
      width: 20px;
      height: 20px;
      color: white;
    }

    .upload-btn:hover {
      transform: scale(1.1);
    }

    .avatar-info h3 {
      font-size: var(--text-lg);
      font-weight: 700;
      margin-bottom: var(--space-1);
    }

    .avatar-info p {
      color: var(--text-secondary);
      font-size: var(--text-sm);
    }

    .settings-form {
      display: flex;
      flex-direction: column;
      gap: var(--space-5);
    }

    .form-row {
      display: grid;
      grid-template-columns: 1fr 1fr;
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
      width: 100%;
    }

    .form-input::placeholder {
      color: var(--text-secondary);
      opacity: 0.6;
    }

    .form-input:focus {
      outline: none;
      border-color: var(--primary-500);
      box-shadow: 0 0 0 3px rgba(99, 102, 241, 0.1);
      background: var(--bg-card);
    }

    textarea.form-input {
      resize: vertical;
      min-height: 100px;
    }

    .error {
      color: var(--danger-500);
      font-size: var(--text-xs);
      font-weight: 600;
    }

    .form-actions {
      display: flex;
      justify-content: flex-end;
      padding-top: var(--space-4);
      border-top: 1px solid var(--border-glass);
    }

    .btn-save {
      display: flex;
      align-items: center;
      gap: var(--space-2);
      padding: var(--space-3) var(--space-6);
      background: var(--gradient-primary);
      color: white;
      border: none;
      border-radius: var(--radius-xl);
      font-weight: 700;
      font-size: var(--text-base);
      cursor: pointer;
      box-shadow: var(--shadow-lg);
      transition: all var(--transition-base);
    }

    .btn-save .icon {
      width: 20px;
      height: 20px;
    }

    .btn-save:hover:not(:disabled) {
      transform: translateY(-2px);
      box-shadow: var(--shadow-xl);
    }

    .btn-save:disabled {
      opacity: 0.6;
      cursor: not-allowed;
    }

    @media (max-width: 768px) {
      .form-row {
        grid-template-columns: 1fr;
      }

      .profile-picture-section {
        flex-direction: column;
        text-align: center;
      }
    }
  `]
})
export class AccountSettingsComponent implements OnInit {
  private fb = inject(FormBuilder);
  settingsStore = inject(SettingsStore);

  readonly UploadIcon = Upload;
  readonly SaveIcon = Save;

  profilePictureUrl = '';

  accountForm = this.fb.group({
    firstName: ['', Validators.required],
    lastName: ['', Validators.required],
    department: ['', Validators.required],
    year: [null as number | null, Validators.required],
    bio: [''],
    portfolioUrl: [''],
    linkedinUrl: [''],
    githubUrl: ['']
  });

  ngOnInit() {
    // Load current settings
    const settings = this.settingsStore.settings();
    if (settings) {
      this.accountForm.patchValue({
        firstName: settings.account.firstName,
        lastName: settings.account.lastName,
        department: settings.account.department,
        year: settings.account.year,
        bio: settings.account.bio || '',
        portfolioUrl: settings.account.portfolioUrl || '',
        linkedinUrl: settings.account.linkedinUrl || '',
        githubUrl: settings.account.githubUrl || ''
      });
      this.profilePictureUrl = settings.account.profilePicture || '';
    }
  }

  onFileSelected(event: Event) {
    const file = (event.target as HTMLInputElement).files?.[0];
    if (file) {
      // Validate file size (5MB max)
      if (file.size > 5 * 1024 * 1024) {
        alert('File size must be less than 5MB');
        return;
      }

      // Preview image
      const reader = new FileReader();
      reader.onload = (e) => {
        this.profilePictureUrl = e.target?.result as string;
      };
      reader.readAsDataURL(file);

      // Upload to server
      this.settingsStore.uploadProfilePicture(file);
    }
  }

  onSubmit() {
    if (this.accountForm.valid) {
      this.settingsStore.updateAccountSettings(this.accountForm.value as any);
    }
  }
}
