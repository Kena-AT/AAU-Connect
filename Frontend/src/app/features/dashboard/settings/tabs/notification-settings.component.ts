import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { ToggleSwitchComponent } from '../../../../shared/components/toggle-switch/toggle-switch.component';
import { SettingsStore } from '../../../../core/state/settings.store';

@Component({
  selector: 'app-notification-settings',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, ToggleSwitchComponent],
  template: `
    <div class="notification-settings">
      <h2 class="section-title">Notification Preferences</h2>
      <p class="section-description">Choose how you want to be notified</p>

      <form [formGroup]="notificationForm" class="settings-form">
        <!-- Posts Notifications -->
        <div class="notification-category">
          <h3 class="category-title">Posts & Updates</h3>
          
          <div class="setting-group">
            <div class="setting-header">
              <div>
                <h4>New Posts</h4>
                <p>Get notified when someone posts in your groups</p>
              </div>
              <app-toggle-switch formControlName="postsEnabled"></app-toggle-switch>
            </div>
            @if (notificationForm.get('postsEnabled')?.value) {
              <div class="channel-options">
                <label class="checkbox-label">
                  <input type="checkbox" formControlName="postsPush" />
                  <span>Push Notifications</span>
                </label>
                <label class="checkbox-label">
                  <input type="checkbox" formControlName="postsEmail" />
                  <span>Email Notifications</span>
                </label>
              </div>
            }
          </div>
        </div>

        <!-- Messages Notifications -->
        <div class="notification-category">
          <h3 class="category-title">Messages</h3>
          
          <div class="setting-group">
            <div class="setting-header">
              <div>
                <h4>Direct Messages</h4>
                <p>Get notified when you receive a message</p>
              </div>
              <app-toggle-switch formControlName="messagesEnabled"></app-toggle-switch>
            </div>
            @if (notificationForm.get('messagesEnabled')?.value) {
              <div class="channel-options">
                <label class="checkbox-label">
                  <input type="checkbox" formControlName="messagesPush" />
                  <span>Push Notifications</span>
                </label>
                <label class="checkbox-label">
                  <input type="checkbox" formControlName="messagesEmail" />
                  <span>Email Notifications</span>
                </label>
              </div>
            }
          </div>
        </div>

        <!-- Events Notifications -->
        <div class="notification-category">
          <h3 class="category-title">Events & Deadlines</h3>
          
          <div class="setting-group">
            <div class="setting-header">
              <div>
                <h4>Upcoming Events</h4>
                <p>Reminders for academic events and activities</p>
              </div>
              <app-toggle-switch formControlName="eventsEnabled"></app-toggle-switch>
            </div>
            @if (notificationForm.get('eventsEnabled')?.value) {
              <div class="channel-options">
                <label class="checkbox-label">
                  <input type="checkbox" formControlName="eventsPush" />
                  <span>Push Notifications</span>
                </label>
                <label class="checkbox-label">
                  <input type="checkbox" formControlName="eventsEmail" />
                  <span>Email Notifications</span>
                </label>
              </div>
            }
          </div>

          <div class="setting-group">
            <div class="setting-header">
              <div>
                <h4>Assignment Deadlines</h4>
                <p>Reminders for upcoming assignment due dates</p>
              </div>
              <app-toggle-switch formControlName="deadlinesEnabled"></app-toggle-switch>
            </div>
            @if (notificationForm.get('deadlinesEnabled')?.value) {
              <div class="channel-options">
                <label class="checkbox-label">
                  <input type="checkbox" formControlName="deadlinesPush" />
                  <span>Push Notifications</span>
                </label>
                <label class="checkbox-label">
                  <input type="checkbox" formControlName="deadlinesEmail" />
                  <span>Email Notifications</span>
                </label>
              </div>
            }
          </div>
        </div>

        <!-- Group Invites -->
        <div class="notification-category">
          <h3 class="category-title">Groups</h3>
          
          <div class="setting-group">
            <div class="setting-header">
              <div>
                <h4>Group Invitations</h4>
                <p>Get notified when you're invited to join a group</p>
              </div>
              <app-toggle-switch formControlName="groupInvitesEnabled"></app-toggle-switch>
            </div>
            @if (notificationForm.get('groupInvitesEnabled')?.value) {
              <div class="channel-options">
                <label class="checkbox-label">
                  <input type="checkbox" formControlName="groupInvitesPush" />
                  <span>Push Notifications</span>
                </label>
                <label class="checkbox-label">
                  <input type="checkbox" formControlName="groupInvitesEmail" />
                  <span>Email Notifications</span>
                </label>
              </div>
            }
          </div>
        </div>

        <!-- Actions -->
        <div class="form-actions">
          <button type="button" class="btn-save btn-interactive" (click)="onSubmit()">
            <span>Save Notification Settings</span>
          </button>
        </div>
      </form>
    </div>
  `,
  styles: [`
    .notification-settings {
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

    .settings-form {
      display: flex;
      flex-direction: column;
      gap: var(--space-6);
    }

    .notification-category {
      display: flex;
      flex-direction: column;
      gap: var(--space-3);
    }

    .category-title {
      font-size: var(--text-lg);
      font-weight: 700;
      color: var(--text-primary);
      margin: 0;
      padding-bottom: var(--space-2);
      border-bottom: 2px solid var(--border-glass);
    }

    .setting-group {
      padding: var(--space-4);
      background: var(--bg-glass);
      border: 1px solid var(--border-glass);
      border-radius: var(--radius-xl);
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

    .setting-header h4 {
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

    .channel-options {
      display: flex;
      gap: var(--space-4);
      margin-top: var(--space-3);
      padding-top: var(--space-3);
      border-top: 1px solid var(--border-glass);
    }

    .checkbox-label {
      display: flex;
      align-items: center;
      gap: var(--space-2);
      cursor: pointer;
      font-size: var(--text-sm);
      font-weight: 600;
      color: var(--text-primary);
    }

    .checkbox-label input[type="checkbox"] {
      width: 18px;
      height: 18px;
      cursor: pointer;
      accent-color: var(--primary-500);
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
export class NotificationSettingsComponent implements OnInit {
  private fb = inject(FormBuilder);
  settingsStore = inject(SettingsStore);

  notificationForm = this.fb.group({
    postsEnabled: [true],
    postsPush: [true],
    postsEmail: [false],
    messagesEnabled: [true],
    messagesPush: [true],
    messagesEmail: [true],
    eventsEnabled: [true],
    eventsPush: [true],
    eventsEmail: [false],
    deadlinesEnabled: [true],
    deadlinesPush: [true],
    deadlinesEmail: [true],
    groupInvitesEnabled: [true],
    groupInvitesPush: [true],
    groupInvitesEmail: [false]
  });

  ngOnInit() {
    const settings = this.settingsStore.settings();
    if (settings?.notifications) {
      const n = settings.notifications;
      this.notificationForm.patchValue({
        postsEnabled: n.posts.enabled,
        postsPush: n.posts.push,
        postsEmail: n.posts.email,
        messagesEnabled: n.messages.enabled,
        messagesPush: n.messages.push,
        messagesEmail: n.messages.email,
        eventsEnabled: n.events.enabled,
        eventsPush: n.events.push,
        eventsEmail: n.events.email,
        deadlinesEnabled: n.deadlines.enabled,
        deadlinesPush: n.deadlines.push,
        deadlinesEmail: n.deadlines.email,
        groupInvitesEnabled: n.groupInvites.enabled,
        groupInvitesPush: n.groupInvites.push,
        groupInvitesEmail: n.groupInvites.email
      });
    }
  }

  onSubmit() {
    const formValue = this.notificationForm.value;
    const notifications = {
      posts: {
        enabled: formValue.postsEnabled!,
        push: formValue.postsPush!,
        email: formValue.postsEmail!
      },
      messages: {
        enabled: formValue.messagesEnabled!,
        push: formValue.messagesPush!,
        email: formValue.messagesEmail!
      },
      events: {
        enabled: formValue.eventsEnabled!,
        push: formValue.eventsPush!,
        email: formValue.eventsEmail!
      },
      deadlines: {
        enabled: formValue.deadlinesEnabled!,
        push: formValue.deadlinesPush!,
        email: formValue.deadlinesEmail!
      },
      groupInvites: {
        enabled: formValue.groupInvitesEnabled!,
        push: formValue.groupInvitesPush!,
        email: formValue.groupInvitesEmail!
      }
    };
    this.settingsStore.updateNotificationSettings(notifications);
  }
}
