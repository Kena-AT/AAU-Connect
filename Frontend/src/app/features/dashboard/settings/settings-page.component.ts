import { Component, inject, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LucideAngularModule, User, Lock, Bell, Shield } from 'lucide-angular';
import { SettingsStore } from '../../../core/state/settings.store';
import { AccountSettingsComponent } from './tabs/account-settings.component';
import { PrivacySettingsComponent } from './tabs/privacy-settings.component';
import { NotificationSettingsComponent } from './tabs/notification-settings.component';
import { SecuritySettingsComponent } from './tabs/security-settings.component';
import { LoadingSpinnerComponent } from '../../../shared/components/loading-spinner/loading-spinner.component';

type SettingsTab = 'account' | 'privacy' | 'notifications' | 'security';

@Component({
  selector: 'app-settings-page',
  standalone: true,
  imports: [
    CommonModule,
    LucideAngularModule,
    AccountSettingsComponent,
    PrivacySettingsComponent,
    NotificationSettingsComponent,
    SecuritySettingsComponent,
    LoadingSpinnerComponent
  ],
  template: `
    <div class="settings-page">
      <div class="settings-header glass-card">
        <h1 class="gradient-text">Settings</h1>
        <p class="subtitle">Manage your account preferences and security</p>
      </div>

      <div class="settings-container">
        <!-- Tabs Navigation -->
        <nav class="tabs-nav glass-card">
          @for (tab of tabs; track tab.value) {
            <button
              class="tab-btn"
              [class.active]="activeTab() === tab.value"
              (click)="activeTab.set(tab.value)">
              <lucide-icon [img]="tab.icon" class="tab-icon"></lucide-icon>
              <span class="tab-label">{{ tab.label }}</span>
            </button>
          }
        </nav>

        <!-- Tab Content -->
        <div class="tab-content glass-card">
          @if (settingsStore.loading()) {
            <app-loading-spinner></app-loading-spinner>
          } @else {
            @switch (activeTab()) {
              @case ('account') {
                <app-account-settings></app-account-settings>
              }
              @case ('privacy') {
                <app-privacy-settings></app-privacy-settings>
              }
              @case ('notifications') {
                <app-notification-settings></app-notification-settings>
              }
              @case ('security') {
                <app-security-settings></app-security-settings>
              }
            }
          }
        </div>
      </div>
    </div>
  `,
  styles: [`
    .settings-page {
      width: 100%;
      max-width: 100%;
      padding: 0;
      overflow-x: hidden;
    }

    .settings-header {
      padding: var(--space-6) var(--space-4);
      margin-bottom: var(--space-4);
      text-align: center;
    }

    .settings-header h1 {
      font-size: var(--text-3xl);
      font-weight: 900;
      font-family: var(--font-display);
      margin-bottom: var(--space-2);
    }

    .subtitle {
      font-size: var(--text-base);
      color: var(--text-secondary);
      margin: 0;
    }

    .settings-container {
      display: grid;
      grid-template-columns: 220px 1fr;
      gap: var(--space-4);
      padding: 0 var(--space-4);
      max-width: 1000px;
      margin: 0 auto;
    }

    .tabs-nav {
      padding: var(--space-3);
      display: flex;
      flex-direction: column;
      gap: var(--space-1);
      height: fit-content;
      position: sticky;
      top: var(--space-4);
    }

    .tab-btn {
      display: flex;
      align-items: center;
      gap: var(--space-2);
      padding: var(--space-3);
      background: transparent;
      border: none;
      border-radius: var(--radius-lg);
      color: var(--text-secondary);
      font-size: var(--text-sm);
      font-weight: 600;
      cursor: pointer;
      transition: all var(--transition-base);
      text-align: left;
      white-space: nowrap;
    }

    .tab-btn:hover {
      background: var(--bg-glass);
      color: var(--text-primary);
      transform: translateX(4px);
    }

    .tab-btn.active {
      background: var(--gradient-primary);
      color: white;
      box-shadow: var(--shadow-lg);
    }

    .tab-icon {
      width: 18px;
      height: 18px;
      transition: all var(--transition-bounce);
      flex-shrink: 0;
    }

    .tab-btn:hover .tab-icon {
      transform: scale(1.1);
    }

    .tab-btn.active .tab-icon {
      filter: drop-shadow(0 0 8px rgba(255, 255, 255, 0.5));
    }

    .tab-label {
      overflow: hidden;
      text-overflow: ellipsis;
    }

    .tab-content {
      padding: var(--space-6);
      min-height: 400px;
      overflow-x: hidden;
    }

    @media (max-width: 768px) {
      .settings-container {
        grid-template-columns: 1fr;
        padding: 0 var(--space-3);
      }

      .tabs-nav {
        position: static;
        flex-direction: row;
        overflow-x: auto;
        gap: var(--space-2);
        padding: var(--space-2);
      }

      .tab-label {
        display: none;
      }

      .tab-btn {
        flex-direction: column;
        padding: var(--space-2);
        min-width: 60px;
      }

      .tab-content {
        padding: var(--space-4);
      }
    }
  `]
})
export class SettingsPageComponent implements OnInit {
  settingsStore = inject(SettingsStore);

  activeTab = signal<SettingsTab>('account');

  readonly UserIcon = User;
  readonly LockIcon = Lock;
  readonly BellIcon = Bell;
  readonly ShieldIcon = Shield;

  tabs = [
    { value: 'account' as SettingsTab, label: 'Account', icon: this.UserIcon },
    { value: 'privacy' as SettingsTab, label: 'Privacy', icon: this.LockIcon },
    { value: 'notifications' as SettingsTab, label: 'Notifications', icon: this.BellIcon },
    { value: 'security' as SettingsTab, label: 'Security', icon: this.ShieldIcon }
  ];

  ngOnInit() {
    this.settingsStore.loadSettings();
  }
}
