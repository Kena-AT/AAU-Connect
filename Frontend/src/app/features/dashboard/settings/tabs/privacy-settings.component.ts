import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { ToggleSwitchComponent } from '../../../../shared/components/toggle-switch/toggle-switch.component';
import { SettingsStore } from '../../../../core/state/settings.store';

@Component({
  selector: 'app-privacy-settings',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, ToggleSwitchComponent],
  template: `
    <div class="privacy-settings">
      <h2 class="section-title">Privacy Settings</h2>
      <p class="section-description">Control who can see your information</p>

      <form [formGroup]="privacyForm" class="settings-form">
        <!-- Profile Visibility -->
        <div class="setting-group">
          <div class="setting-header">
            <div>
              <h3>Profile Visibility</h3>
              <p>Choose who can view your profile</p>
            </div>
          </div>
          <select formControlName="profileVisibility" class="form-select">
            <option value="public">Public - Anyone can view</option>
            <option value="students-only">Students Only - Only verified students</option>
            <option value="private">Private - Only you</option>
          </select>
        </div>

        <!-- Show Course Info -->
        <div class="setting-group">
          <div class="setting-header">
            <div>
              <h3>Show Course Information</h3>
              <p>Display your enrolled courses on your profile</p>
            </div>
            <app-toggle-switch formControlName="showCourseInfo"></app-toggle-switch>
          </div>
        </div>

        <!-- Show Group Memberships -->
        <div class="setting-group">
          <div class="setting-header">
            <div>
              <h3>Show Group Memberships</h3>
              <p>Display groups you're a member of</p>
            </div>
            <app-toggle-switch formControlName="showGroupMemberships"></app-toggle-switch>
          </div>
        </div>

        <!-- Show Email -->
        <div class="setting-group">
          <div class="setting-header">
            <div>
              <h3>Show Email Address</h3>
              <p>Make your email visible to other students</p>
            </div>
            <app-toggle-switch formControlName="showEmail"></app-toggle-switch>
          </div>
        </div>

        <!-- Actions -->
        <div class="form-actions">
          <button type="button" class="btn-save btn-interactive" (click)="onSubmit()">
            <span>Save Privacy Settings</span>
          </button>
        </div>
      </form>
    </div>
  `,
  styles: [`
    .privacy-settings {
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
      margin-bottom: var(--space-8);
    }

    .settings-form {
      display: flex;
      flex-direction: column;
      gap: var(--space-5);
    }

    .setting-group {
      padding: var(--space-5);
      background: var(--bg-glass);
      border: 1px solid var(--border-glass);
      border-radius: var(--radius-2xl);
      transition: all var(--transition-base);
    }

    .setting-group:hover {
      background: var(--bg-card);
      box-shadow: var(--shadow-md);
    }

    .setting-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      gap: var(--space-4);
    }

    .setting-header h3 {
      font-size: var(--text-base);
      font-weight: 700;
      margin: 0 0 var(--space-1) 0;
      color: var(--text-primary);
    }

    .setting-header p {
      font-size: var(--text-sm);
      color: var(--text-secondary);
      margin: 0;
    }

    .form-select {
      width: 100%;
      padding: var(--space-3);
      border: 2px solid var(--border-color);
      border-radius: var(--radius-lg);
      background: var(--bg-card);
      color: var(--text-primary);
      font-family: inherit;
      font-size: var(--text-base);
      margin-top: var(--space-3);
      cursor: pointer;
      transition: all var(--transition-base);
    }

    .form-select:focus {
      outline: none;
      border-color: var(--primary-500);
      box-shadow: 0 0 0 3px rgba(99, 102, 241, 0.1);
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

    .btn-save:hover {
      transform: translateY(-2px);
      box-shadow: var(--shadow-xl);
    }
  `]
})
export class PrivacySettingsComponent implements OnInit {
  private fb = inject(FormBuilder);
  settingsStore = inject(SettingsStore);

  privacyForm = this.fb.group({
    profileVisibility: ['public'],
    showCourseInfo: [true],
    showGroupMemberships: [true],
    showEmail: [false]
  });

  ngOnInit() {
    const settings = this.settingsStore.settings();
    if (settings) {
      this.privacyForm.patchValue({
        profileVisibility: settings.privacy.profileVisibility,
        showCourseInfo: settings.privacy.showCourseInfo,
        showGroupMemberships: settings.privacy.showGroupMemberships,
        showEmail: settings.privacy.showEmail
      });
    }
  }

  onSubmit() {
    if (this.privacyForm.valid) {
      this.settingsStore.updatePrivacySettings(this.privacyForm.value as any);
    }
  }
}
