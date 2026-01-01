import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { LucideAngularModule, Home, BookOpen, MessageCircle, Users, Calendar, Settings } from 'lucide-angular';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule, RouterModule, LucideAngularModule],
  template: `
    <div class="sidebar-content">
      <div class="sidebar-header">
        <div class="logo">
          <div class="logo-icon">AAU</div>
          <h2>AAU Connect</h2>
        </div>
      </div>
      
      <nav class="nav-links">
        <a routerLink="/dashboard/feed" routerLinkActive="active" class="nav-item">
          <lucide-icon [img]="HomeIcon" class="icon"></lucide-icon>
          <span>Home</span>
          <div class="active-indicator"></div>
        </a>
        <a routerLink="/dashboard/messaging" routerLinkActive="active" class="nav-item">
          <lucide-icon [img]="MessageIcon" class="icon"></lucide-icon>
          <span>Messages</span>
          <div class="active-indicator"></div>
        </a>
        <a routerLink="/dashboard/groups" routerLinkActive="active" class="nav-item">
          <lucide-icon [img]="UsersIcon" class="icon"></lucide-icon>
          <span>Groups</span>
          <div class="active-indicator"></div>
        </a>
        <a routerLink="/dashboard/events" routerLinkActive="active" class="nav-item">
          <lucide-icon [img]="CalendarIcon" class="icon"></lucide-icon>
          <span>Events</span>
          <div class="active-indicator"></div>
        </a>
        <a routerLink="/dashboard/settings" routerLinkActive="active" class="nav-item">
          <lucide-icon [img]="SettingsIcon" class="icon"></lucide-icon>
          <span>Settings</span>
          <div class="active-indicator"></div>
        </a>
      </nav>

      <div class="sidebar-footer">
        <div class="user-profile">
          <div class="user-avatar">SU</div>
          <div class="user-info">
            <p class="user-name">Student User</p>
            <span class="user-status">
              <span class="status-dot"></span>
              Online
            </span>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    :host {
      display: block;
      height: 100%;
    }

    .sidebar-content {
      display: flex;
      flex-direction: column;
      height: 100%;
      padding: var(--space-6);
    }

    .sidebar-header {
      margin-bottom: var(--space-8);
    }

    .logo {
      display: flex;
      align-items: center;
      gap: var(--space-3);
    }

    .logo-icon {
      width: 44px;
      height: 44px;
      border-radius: var(--radius-full);
      background: var(--primary-600);
      color: white;
      display: flex;
      align-items: center;
      justify-content: center;
      font-weight: 900;
      font-size: var(--text-lg);
      box-shadow: var(--shadow-md);
      animation: float 6s ease-in-out infinite;
    }

    .logo h2 {
      font-size: var(--text-xl);
      font-weight: 800;
      font-family: var(--font-display);
      color: var(--text-primary);
    }

    /* Removed usage of .gradient-text to look more professional */

    .nav-links {
      flex: 1;
      display: flex;
      flex-direction: column;
      gap: var(--space-2);
    }

    .nav-item {
      position: relative;
      display: flex;
      align-items: center;
      gap: var(--space-3);
      padding: var(--space-3) var(--space-4);
      border-radius: var(--radius-xl);
      color: var(--text-secondary);
      text-decoration: none;
      font-weight: 600;
      font-size: var(--text-base);
      transition: all var(--transition-base);
      overflow: hidden;
    }

    .nav-item::before {
      content: '';
      position: absolute;
      inset: 0;
      background: var(--bg-glass);
      opacity: 0;
      transition: opacity var(--transition-base);
      border-radius: var(--radius-xl);
    }

    .nav-item:hover::before {
      opacity: 1;
    }

    .nav-item:hover {
      color: var(--text-primary);
      transform: translateX(6px);
    }

    .nav-item:hover .icon {
      transform: scale(1.15) rotate(5deg);
    }

    .nav-item.active {
      background: rgba(79, 70, 229, 0.1); /* primary-600 @ 10% */
      color: var(--primary-600);
      transform: translateX(4px);
    }

    .nav-item.active::before {
      opacity: 0;
    }

    .nav-item.active .icon {
      transform: scale(1.1);
      /* Subtle glow instead of loud drop-shadow, or just clean */
    }

    .active-indicator {
      position: absolute;
      right: var(--space-4);
      width: 6px;
      height: 6px;
      border-radius: var(--radius-full);
      background: var(--primary-600);
      opacity: 0;
      transition: opacity var(--transition-base);
    }

    .nav-item.active .active-indicator {
      opacity: 1;
      animation: pulse-dot 2s ease-in-out infinite;
    }

    @keyframes pulse-dot {
      0%, 100% { transform: scale(1); }
      50% { transform: scale(1.3); }
    }

    .icon {
      width: 20px;
      height: 20px;
      transition: all var(--transition-bounce);
      position: relative;
      z-index: 1;
    }

    .nav-item span {
      position: relative;
      z-index: 1;
    }

    .sidebar-footer {
      margin-top: auto;
      padding-top: var(--space-6);
      border-top: 1px solid var(--border-glass);
    }

    .user-profile {
      display: flex;
      align-items: center;
      gap: var(--space-3);
      padding: var(--space-3);
      border-radius: var(--radius-xl);
      cursor: pointer;
      transition: all var(--transition-base);
      background: var(--bg-glass);
      backdrop-filter: blur(10px);
    }

    .user-profile:hover {
      background: var(--bg-card);
      transform: translateY(-2px);
      box-shadow: var(--shadow-md);
    }

    .user-avatar {
      width: 48px;
      height: 48px;
      border-radius: var(--radius-full);
      background: var(--primary-600);
      color: white;
      display: flex;
      align-items: center;
      justify-content: center;
      font-weight: 800;
      font-size: var(--text-base);
      flex-shrink: 0;
      box-shadow: var(--shadow-md);
      position: relative;
    }

    .user-info {
      flex: 1;
      min-width: 0;
    }

    .user-name {
      font-size: var(--text-xs);
      font-weight: 700;
      color: var(--text-primary);
      margin: 0 0 var(--space-1) 0;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }

    .user-status {
      font-size: var(--text-xs);
      color: var(--success-500);
      display: flex;
      align-items: center;
      gap: var(--space-2);
      font-weight: 600;
    }

    .status-dot {
      width: 8px;
      height: 8px;
      border-radius: var(--radius-full);
      background: var(--success-500);
      display: inline-block;
      box-shadow: 0 0 10px var(--success-500);
      animation: pulse-dot 2s ease-in-out infinite;
    }
  `]
})
export class SidebarComponent {
  readonly HomeIcon = Home;
  readonly BookIcon = BookOpen;
  readonly MessageIcon = MessageCircle;
  readonly UsersIcon = Users;
  readonly CalendarIcon = Calendar;
  readonly SettingsIcon = Settings;
}
