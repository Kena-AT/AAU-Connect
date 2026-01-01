import { Component, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { UiStore } from '../../../../core/state/ui.store';
import { AuthService } from '../../../../core/auth/auth.service';
import { CommonModule } from '@angular/common';
import { LucideAngularModule, Search, Bell, Mail, User, Settings, LogOut, Sun, Moon, PanelRight } from 'lucide-angular';

@Component({
  selector: 'app-topbar',
  standalone: true,
  imports: [CommonModule, LucideAngularModule],
  template: `
    <header class="topbar glass-card">
      <div class="actions-group">
        <!-- Theme Toggle -->
        <button class="icon-btn btn-interactive" (click)="ui.toggleTheme(); $event.stopPropagation()" [title]="ui.theme() === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'">
          @if (ui.theme() === 'dark') {
            <lucide-icon [img]="SunIcon" class="icon"></lucide-icon>
          } @else {
            <lucide-icon [img]="MoonIcon" class="icon"></lucide-icon>
          }
        </button>
        
        <!-- Sidebar Toggle -->
        <button class="icon-btn btn-interactive" (click)="ui.toggleRightSidebar(); $event.stopPropagation()" title="Toggle Sidebar">
          <lucide-icon [img]="PanelRightIcon" class="icon"></lucide-icon>
        </button>

        <!-- Notifications -->
        <div class="dropdown-container">
          <button class="icon-btn btn-interactive" (click)="toggleNotifications(); $event.stopPropagation()">
            <lucide-icon [img]="BellIcon" class="icon"></lucide-icon>
            <span class="badge neon-glow">3</span>
          </button>
          
          @if (showNotifications()) {
            <div class="dropdown notifications-dropdown glass-card" (click)="$event.stopPropagation()">
              <div class="dropdown-header">
                <h3>Notifications</h3>
                <button class="mark-read">Mark all as read</button>
              </div>
              <div class="dropdown-content">
                @for (notification of notifications; track notification.id) {
                  <div class="notification-item" [class.unread]="!notification.read" (click)="handleNotificationClick(notification)">
                    <div class="notification-icon" [style.background]="notification.color">
                      {{ notification.icon }}
                    </div>
                    <div class="notification-content">
                      <p class="notification-title">{{ notification.title }}</p>
                      <span class="notification-time">{{ notification.time }}</span>
                    </div>
                  </div>
                }
              </div>
              <div class="dropdown-footer">
                <button class="view-all" (click)="navigateTo('/dashboard/notifications')">View all notifications</button>
              </div>
            </div>
          }
        </div>

        <!-- Messages -->
        <div class="dropdown-container">
          <button class="icon-btn btn-interactive" (click)="toggleMessages(); $event.stopPropagation()">
            <lucide-icon [img]="MailIcon" class="icon"></lucide-icon>
            <span class="badge neon-glow">12</span>
          </button>
          
          @if (showMessages()) {
            <div class="dropdown messages-dropdown glass-card" (click)="$event.stopPropagation()">
              <div class="dropdown-header">
                <h3>Messages</h3>
              </div>
              <div class="dropdown-content">
                @for (message of messages; track message.id) {
                  <div class="message-item" [class.unread]="!message.read" (click)="handleMessageClick(message)">
                    <div class="message-avatar gradient-text" [style.background]="message.avatar">
                      {{ message.initials }}
                    </div>
                    <div class="message-content">
                      <p class="message-name">{{ message.name }}</p>
                      <span class="message-preview">{{ message.preview }}</span>
                    </div>
                    <span class="message-time">{{ message.time }}</span>
                  </div>
                }
              </div>
              <div class="dropdown-footer">
                <button class="view-all" (click)="navigateTo('/dashboard/messaging')">View all messages</button>
              </div>
            </div>
          }
        </div>

        <!-- User Profile -->
        <div class="dropdown-container">
          <div class="profile" (click)="toggleUserMenu(); $event.stopPropagation()" *ngIf="auth.currentUser() as user">
            <div class="avatar gradient-text">{{ user.firstName[0] }}{{ user.lastName[0] }}</div>
          </div>
          
          @if (showUserMenu()) {
            <div class="dropdown user-dropdown glass-card" (click)="$event.stopPropagation()">
              <div class="user-info-section">
                <div class="user-avatar-large gradient-text">SU</div>
                <p class="user-name-large">Student User</p>
                <span class="user-email">student@university.edu</span>
              </div>
              <div class="dropdown-divider"></div>
              <div class="dropdown-content">
                <button class="menu-item" (click)="navigateTo('/dashboard/profile/me')">
                  <lucide-icon [img]="UserIcon" class="menu-icon"></lucide-icon>
                  <span>My Profile</span>
                </button>
                <button class="menu-item" (click)="navigateTo('/dashboard/settings')">
                  <lucide-icon [img]="SettingsIcon" class="menu-icon"></lucide-icon>
                  <span>Settings</span>
                </button>
              </div>
              <div class="dropdown-divider"></div>
              <button class="menu-item logout" (click)="logout()">
                <lucide-icon [img]="LogOutIcon" class="menu-icon"></lucide-icon>
                <span>Logout</span>
              </button>
            </div>
          }
        </div>

        <!-- Search Button (Moved to end) -->
        <button class="icon-btn btn-interactive" (click)="openSearch()" title="Search">
          <lucide-icon [img]="SearchIcon" class="icon"></lucide-icon>
        </button>
      </div>
    </header>
  `,
  styles: [`
    .topbar {
      height: 72px;
      display: flex;
      align-items: center;
      justify-content: flex-end;
      padding: 0 var(--space-4) 0 var(--space-6);
      border-bottom: 1px solid var(--border-glass);
      position: sticky;
      top: 0;
      z-index: 100;
      margin: var(--space-6) 0 var(--space-4);
      border-radius: var(--radius-2xl);
    }

    .actions-group {
      display: flex;
      align-items: center;
      gap: var(--space-2);
    }
    .dropdown-container {
      position: relative;
    }

    .icon-btn {
      position: relative;
      width: 48px;
      height: 48px;
      background: var(--bg-glass);
      border: 1px solid var(--border-glass);
      border-radius: var(--radius-xl);
      display: flex;
      align-items: center;
      justify-content: center;
      overflow: visible;
      cursor: pointer;
      transition: all var(--transition-base);
    }

    .icon-btn:hover {
      background: var(--bg-card);
      transform: translateY(-3px) scale(1.05);
      box-shadow: var(--shadow-lg);
      border-color: var(--primary-500);
    }

    .icon-btn .icon {
      width: 20px;
      height: 20px;
      color: var(--text-secondary);
      transition: all var(--transition-bounce);
    }

    .icon-btn:hover .icon {
      color: var(--primary-500);
      transform: scale(1.15) rotate(-5deg);
    }

    .badge {
      position: absolute;
      top: -6px;
      right: -6px;
      min-width: 20px;
      height: 20px;
      padding: 0 5px;
      background: var(--gradient-secondary);
      color: white;
      border-radius: var(--radius-full);
      font-size: 10px;
      font-weight: 800;
      display: flex;
      align-items: center;
      justify-content: center;
      border: 2px solid var(--bg-app);
      box-shadow: var(--shadow-lg);
      animation: badge-pulse 2s ease-in-out infinite;
      z-index: 10;
    }

    @keyframes badge-pulse {
      0%, 100% { transform: scale(1); }
      50% { transform: scale(1.1); }
    }

    .profile {
      cursor: pointer;
      transition: transform var(--transition-base);
    }

    .profile:hover {
      transform: scale(1.08) rotate(2deg);
    }

    .avatar {
      width: 48px;
      height: 48px;
      background: var(--gradient-neon);
      border-radius: var(--radius-full);
      display: flex;
      align-items: center;
      justify-content: center;
      font-weight: 800;
      font-size: var(--text-base);
      box-shadow: var(--shadow-lg);
      border: 3px solid var(--bg-card);
      position: relative;
    }

    .avatar::after {
      content: '';
      position: absolute;
      inset: -3px;
      border-radius: var(--radius-full);
      background: var(--gradient-neon);
      z-index: -1;
      opacity: 0.4;
      filter: blur(12px);
      animation: glow-pulse 3s ease-in-out infinite;
    }

    @keyframes glow-pulse {
      0%, 100% { opacity: 0.4; }
      50% { opacity: 0.7; }
    }

    /* Dropdowns */
    .dropdown {
      position: absolute;
      top: calc(100% + var(--space-3));
      right: 0;
      width: 360px;
      max-height: 480px;
      overflow: hidden;
      animation: slideDown 0.3s ease;
      z-index: 1000;
    }

    @keyframes slideDown {
      from {
        opacity: 0;
        transform: translateY(-10px);
      }
      to {
        opacity: 1;
        transform: translateY(0);
      }
    }

    .dropdown-header {
      padding: var(--space-4);
      border-bottom: 1px solid var(--border-glass);
      display: flex;
      justify-content: space-between;
      align-items: center;
    }

    .dropdown-header h3 {
      font-size: var(--text-lg);
      font-weight: 700;
      margin: 0;
    }

    .mark-read {
      background: none;
      border: none;
      color: var(--primary-500);
      font-size: var(--text-xs);
      font-weight: 600;
      cursor: pointer;
    }

    .dropdown-content {
      max-height: 360px;
      overflow-y: auto;
    }

    .notification-item, .message-item {
      display: flex;
      gap: var(--space-3);
      padding: var(--space-4);
      border-bottom: 1px solid var(--border-glass);
      cursor: pointer;
      transition: all var(--transition-base);
    }

    .notification-item:hover, .message-item:hover {
      background: var(--bg-glass);
    }

    .notification-item.unread, .message-item.unread {
      background: rgba(99, 102, 241, 0.05);
    }

    .notification-icon {
      width: 40px;
      height: 40px;
      border-radius: var(--radius-lg);
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: var(--text-xl);
      flex-shrink: 0;
    }

    .notification-content, .message-content {
      flex: 1;
      min-width: 0;
    }

    .notification-title, .message-name {
      font-size: var(--text-sm);
      font-weight: 600;
      margin: 0 0 var(--space-1) 0;
      color: var(--text-primary);
    }

    .notification-time, .message-time {
      font-size: var(--text-xs);
      color: var(--text-secondary);
    }

    .message-avatar {
      width: 40px;
      height: 40px;
      border-radius: var(--radius-full);
      display: flex;
      align-items: center;
      justify-content: center;
      font-weight: 700;
      flex-shrink: 0;
    }

    .message-preview {
      font-size: var(--text-xs);
      color: var(--text-secondary);
      display: block;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }

    .dropdown-footer {
      padding: var(--space-3);
      border-top: 1px solid var(--border-glass);
    }

    .view-all {
      width: 100%;
      padding: var(--space-2);
      background: none;
      border: none;
      color: var(--primary-500);
      font-weight: 600;
      font-size: var(--text-sm);
      cursor: pointer;
      border-radius: var(--radius-lg);
      transition: all var(--transition-base);
    }

    .view-all:hover {
      background: var(--bg-glass);
    }

    /* User Dropdown */
    .user-dropdown {
      width: 280px;
    }

    .user-info-section {
      padding: var(--space-6);
      text-align: center;
    }

    .user-avatar-large {
      width: 64px;
      height: 64px;
      background: var(--gradient-neon);
      border-radius: var(--radius-full);
      display: flex;
      align-items: center;
      justify-content: center;
      font-weight: 800;
      font-size: var(--text-2xl);
      margin: 0 auto var(--space-3);
      box-shadow: var(--shadow-lg);
    }

    .user-name-large {
      font-size: var(--text-base);
      font-weight: 700;
      margin: 0 0 var(--space-1) 0;
    }

    .user-email {
      font-size: var(--text-xs);
      color: var(--text-secondary);
    }

    .dropdown-divider {
      height: 1px;
      background: var(--border-glass);
    }

    .menu-item {
      width: 100%;
      display: flex;
      align-items: center;
      gap: var(--space-3);
      padding: var(--space-3) var(--space-4);
      background: none;
      border: none;
      text-align: left;
      cursor: pointer;
      transition: all var(--transition-base);
      color: var(--text-primary);
      font-size: var(--text-sm);
      font-weight: 500;
    }

    .menu-item:hover {
      background: var(--bg-glass);
    }

    .menu-item.logout {
      color: var(--danger-500);
    }

    .menu-icon {
      width: 18px;
      height: 18px;
    }

    @media (max-width: 768px) {
      .search-container {
        width: 200px;
      }
      
      .search-kbd {
        display: none;
      }

      .dropdown {
        width: 320px;
      }
    }
  `]
})
export class TopbarComponent {
  ui = inject(UiStore);
  auth = inject(AuthService);
  private router = inject(Router);

  readonly SearchIcon = Search;
  readonly BellIcon = Bell;
  readonly MailIcon = Mail;
  readonly UserIcon = User;
  readonly SettingsIcon = Settings;
  readonly LogOutIcon = LogOut;
  readonly SunIcon = Sun;
  readonly MoonIcon = Moon;
  readonly PanelRightIcon = PanelRight;

  showNotifications = signal(false);
  showMessages = signal(false);
  showUserMenu = signal(false);

  notifications = [
    { id: 1, icon: '📚', title: 'New assignment posted in CS 301', time: '5m ago', read: false, color: 'var(--gradient-primary)' },
    { id: 2, icon: '👥', title: 'You were added to Study Group', time: '1h ago', read: false, color: 'var(--gradient-success)' },
    { id: 3, icon: '📅', title: 'Upcoming deadline: Lab Report', time: '2h ago', read: true, color: 'var(--gradient-sunset)' }
  ];

  messages = [
    { id: 1, name: 'Sarah Chen', preview: 'Hey, are you free for the study session?', time: '10m', read: false, initials: 'SC', avatar: 'var(--gradient-primary)' },
    { id: 2, name: 'Marcus Johnson', preview: 'Thanks for sharing those notes!', time: '1h', read: false, initials: 'MJ', avatar: 'var(--gradient-secondary)' },
    { id: 3, name: 'Prof. Anderson', preview: 'Please review the updated syllabus', time: '3h', read: true, initials: 'PA', avatar: 'var(--gradient-success)' }
  ];

  constructor() {
    // Close dropdowns when clicking outside
    if (typeof document !== 'undefined') {
      document.addEventListener('click', () => {
        this.showNotifications.set(false);
        this.showMessages.set(false);
        this.showUserMenu.set(false);
      });
    }
  }

  toggleNotifications() {
    this.showNotifications.update(v => !v);
    this.showMessages.set(false);
    this.showUserMenu.set(false);
  }

  toggleMessages() {
    this.showMessages.update(v => !v);
    this.showNotifications.set(false);
    this.showUserMenu.set(false);
  }

  toggleUserMenu() {
    this.showUserMenu.update(v => !v);
    this.showNotifications.set(false);
    this.showMessages.set(false);
  }

  navigateTo(path: string) {
    this.router.navigate([path]);
    this.showUserMenu.set(false);
    this.showMessages.set(false);
    this.showNotifications.set(false);
  }

  handleNotificationClick(notification: any) {
    console.log('Notification clicked:', notification);
    // Navigate to relevant page based on notification type
    this.navigateTo('/dashboard/feed');
  }

  handleMessageClick(message: any) {
    console.log('Message clicked:', message);
    // Navigate to messaging page with specific conversation
    this.navigateTo('/dashboard/messaging');
  }

  openSearch() {
    this.router.navigate(['/dashboard/search']);
  }

  logout() {
    this.auth.logout();
    this.router.navigate(['/login']);
  }
}
