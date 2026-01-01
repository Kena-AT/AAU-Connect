import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import {
  UserSettings,
  UpdateAccountDto,
  PrivacySettings,
  NotificationPreferences,
  ChangePasswordDto,
  ActiveSession
} from '../models/settings.model';

@Injectable({
  providedIn: 'root'
})
export class SettingsApiService {
  private http = inject(HttpClient);
  private baseUrl = '/api/settings';

  getSettings(): Observable<UserSettings> {
    return this.http.get<UserSettings>(`${this.baseUrl}`);
  }

  updateAccountSettings(data: UpdateAccountDto): Observable<UserSettings> {
    return this.http.patch<UserSettings>(`${this.baseUrl}/account`, data);
  }

  updatePrivacySettings(data: PrivacySettings): Observable<UserSettings> {
    return this.http.patch<UserSettings>(`${this.baseUrl}/privacy`, data);
  }

  updateNotificationSettings(data: NotificationPreferences): Observable<UserSettings> {
    return this.http.patch<UserSettings>(`${this.baseUrl}/notifications`, data);
  }

  changePassword(data: ChangePasswordDto): Observable<void> {
    return this.http.post<void>(`${this.baseUrl}/change-password`, data);
  }

  toggleMFA(enabled: boolean): Observable<{ mfaEnabled: boolean; qrCode?: string }> {
    return this.http.post<{ mfaEnabled: boolean; qrCode?: string }>(`${this.baseUrl}/mfa`, { enabled });
  }

  getActiveSessions(): Observable<ActiveSession[]> {
    return this.http.get<ActiveSession[]>(`${this.baseUrl}/sessions`);
  }

  logoutSession(sessionId: string): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/sessions/${sessionId}`);
  }

  logoutAllSessions(): Observable<void> {
    return this.http.post<void>(`${this.baseUrl}/sessions/logout-all`, {});
  }

  uploadProfilePicture(file: File): Observable<{ url: string }> {
    const formData = new FormData();
    formData.append('file', file);
    return this.http.post<{ url: string }>(`${this.baseUrl}/profile-picture`, formData);
  }
}
