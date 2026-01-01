import { Injectable, inject, signal } from '@angular/core';
import { UserSettings, UpdateAccountDto, PrivacySettings, NotificationPreferences } from '../models/settings.model';
import { SettingsApiService } from '../api/settings-api.service';

@Injectable({
  providedIn: 'root'
})
export class SettingsStore {
  private api = inject(SettingsApiService);

  // State
  private _settings = signal<UserSettings | null>(null);
  private _loading = signal<boolean>(false);
  private _error = signal<string | null>(null);

  // Public readonly signals
  readonly settings = this._settings.asReadonly();
  readonly loading = this._loading.asReadonly();
  readonly error = this._error.asReadonly();

  // Actions
  loadSettings() {
    this._loading.set(true);
    this._error.set(null);

    this.api.getSettings().subscribe({
      next: (settings) => {
        this._settings.set(settings);
        this._loading.set(false);
      },
      error: (err) => {
        this._error.set('Failed to load settings');
        this._loading.set(false);
        console.error('Error loading settings:', err);
      }
    });
  }

  updateAccountSettings(data: UpdateAccountDto) {
    this._loading.set(true);
    this._error.set(null);

    this.api.updateAccountSettings(data).subscribe({
      next: (settings) => {
        this._settings.set(settings);
        this._loading.set(false);
      },
      error: (err) => {
        this._error.set('Failed to update account settings');
        this._loading.set(false);
        console.error('Error updating account settings:', err);
      }
    });
  }

  updatePrivacySettings(data: PrivacySettings) {
    this._loading.set(true);
    this._error.set(null);

    this.api.updatePrivacySettings(data).subscribe({
      next: (settings) => {
        this._settings.set(settings);
        this._loading.set(false);
      },
      error: (err) => {
        this._error.set('Failed to update privacy settings');
        this._loading.set(false);
        console.error('Error updating privacy settings:', err);
      }
    });
  }

  updateNotificationSettings(data: NotificationPreferences) {
    this._loading.set(true);
    this._error.set(null);

    this.api.updateNotificationSettings(data).subscribe({
      next: (settings) => {
        this._settings.set(settings);
        this._loading.set(false);
      },
      error: (err) => {
        this._error.set('Failed to update notification settings');
        this._loading.set(false);
        console.error('Error updating notification settings:', err);
      }
    });
  }

  uploadProfilePicture(file: File) {
    this._loading.set(true);
    this._error.set(null);

    this.api.uploadProfilePicture(file).subscribe({
      next: (response) => {
        if (this._settings()) {
          this._settings.update(settings => ({
            ...settings!,
            account: {
              ...settings!.account,
              profilePicture: response.url
            }
          }));
        }
        this._loading.set(false);
      },
      error: (err) => {
        this._error.set('Failed to upload profile picture');
        this._loading.set(false);
        console.error('Error uploading profile picture:', err);
      }
    });
  }

  clearError() {
    this._error.set(null);
  }
}
