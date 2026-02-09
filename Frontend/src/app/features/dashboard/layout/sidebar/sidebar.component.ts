import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { LucideAngularModule, Home, Search, Compass, Film, Send, Heart, PlusSquare, Settings, Menu, User, Sun, Moon, PanelRight } from 'lucide-angular';
import { UiStore } from '../../../../core/state/ui.store';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule, RouterModule, LucideAngularModule],
  template: `
    <div class="sidebar-wrapper">
      <div class="sidebar-top">
        <div class="logo-area">
          <div class="logo-icon">AAU</div>
          <span class="logo-text">AAU Connect</span>
        </div>
        
        <nav class="nav-links">
          <a routerLink="/dashboard/feed" routerLinkActive="active" class="nav-item">
            <lucide-icon [img]="HomeIcon" class="icon"></lucide-icon>
            <span class="nav-label">Home</span>
          </a>
          <a class="nav-item">
            <lucide-icon [img]="SearchIcon" class="icon"></lucide-icon>
            <span class="nav-label">Search</span>
          </a>
          <a routerLink="/dashboard/messaging" routerLinkActive="active" class="nav-item">
            <div class="icon-wrapper">
              <lucide-icon [img]="MessageIcon" class="icon"></lucide-icon>
              <div class="badge">2</div>
            </div>
            <span class="nav-label">Messages</span>
          </a>
          <a class="nav-item">
            <lucide-icon [img]="HeartIcon" class="icon"></lucide-icon>
            <span class="nav-label">Notifications</span>
          </a>
          <a (click)="onCreatePost()" class="nav-item">
            <lucide-icon [img]="PlusIcon" class="icon"></lucide-icon>
            <span class="nav-label">Create</span>
          </a>
          <a routerLink="/dashboard/settings" routerLinkActive="active" class="nav-item profile-item">
            <div class="nav-avatar">SU</div>
            <span class="nav-label">Profile</span>
          </a>
        </nav>
      </div>

      <div class="sidebar-bottom">
        <div class="bottom-controls-wrapper">
          <button class="nav-item icon-only-control" (click)="ui.toggleTheme()" [title]="ui.theme() === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'">
            @if (ui.theme() === 'dark') {
              <lucide-icon [img]="SunIcon" class="icon"></lucide-icon>
            } @else {
              <lucide-icon [img]="MoonIcon" class="icon"></lucide-icon>
            }
          </button>
          <button class="nav-item icon-only-control" (click)="ui.toggleRightSidebar()" title="Toggle Sidebar">
            <lucide-icon [img]="PanelRightIcon" class="icon"></lucide-icon>
          </button>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .sidebar-wrapper {
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      height: 100%;
      padding: var(--space-4) 0;
      overflow: hidden;
    }

    .sidebar-top {
      display: flex;
      flex-direction: column;
      gap: var(--space-8);
      padding: 0 var(--space-3);
    }

    .logo-area {
      display: flex;
      align-items: center;
      gap: var(--space-4);
      padding: var(--space-4) var(--space-2);
      margin-bottom: var(--space-4);
    }

    .logo-icon {
      min-width: 40px;
      height: 40px;
      border-radius: 12px;
      background: var(--gradient-primary);
      color: white;
      display: flex;
      align-items: center;
      justify-content: center;
      font-weight: 900;
      font-size: var(--text-sm);
      box-shadow: var(--shadow-md);
    }

    .logo-text {
      font-size: var(--text-xl);
      font-weight: 800;
      color: var(--text-primary);
      white-space: nowrap;
      opacity: 0;
      transition: opacity 0.2s ease;
      font-family: var(--font-display);
    }

    :host-context(.left-sidebar:hover) .logo-text {
      opacity: 1;
    }

    .nav-links {
      display: flex;
      flex-direction: column;
      gap: var(--space-2);
    }

    .nav-item {
      display: flex;
      align-items: center;
      gap: var(--space-4);
      padding: var(--space-3);
      border-radius: var(--radius-xl);
      color: var(--text-primary);
      text-decoration: none;
      transition: all var(--transition-base);
      cursor: pointer;
      position: relative;
    }

    .nav-item:hover {
      background: var(--bg-glass);
      transform: scale(1.02);
    }

    .icon {
      width: 26px;
      height: 26px;
      transition: transform 0.2s ease;
      flex-shrink: 0;
    }

    .nav-item:hover .icon {
      transform: scale(1.1);
    }

    .nav-label {
      font-size: var(--text-base);
      font-weight: 500;
      white-space: nowrap;
      opacity: 0;
      transition: opacity 0.2s ease;
      pointer-events: none;
    }

    :host-context(.left-sidebar:hover) .nav-label {
      opacity: 1;
      pointer-events: auto;
    }

    .nav-item.active {
      font-weight: 800;
    }

    .nav-item.active .icon {
      stroke-width: 3px;
    }

    .icon-wrapper {
      position: relative;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .badge {
      position: absolute;
      top: -6px;
      right: -6px;
      background: var(--danger-500);
      color: white;
      font-size: 10px;
      font-weight: 800;
      width: 18px;
      height: 18px;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      border: 2px solid var(--bg-app);
    }

    .nav-avatar {
      width: 26px;
      height: 26px;
      border-radius: 50%;
      background: var(--primary-600);
      color: white;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 10px;
      font-weight: 700;
      flex-shrink: 0;
      border: 1px solid var(--border-glass);
    }

    .sidebar-bottom {
      padding: 0 var(--space-3);
      display: flex;
      flex-direction: column;
      align-items: center;
    }

    .bottom-controls-wrapper {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      gap: var(--space-2);
      width: 72px;
      transition: all var(--transition-base);
      padding: var(--space-2) 0;
    }

    .icon-only-control {
      width: 44px;
      height: 44px;
      justify-content: center;
      padding: 0;
      flex-shrink: 0;
    }

    @media (max-width: 768px) {
      .logo-text, .nav-label {
        display: none;
      }
    }
  `]
})
export class SidebarComponent {
  ui = inject(UiStore);
  
  readonly HomeIcon = Home;
  readonly SearchIcon = Search;
  readonly MessageIcon = Send;
  readonly HeartIcon = Heart;
  readonly PlusIcon = PlusSquare;
  readonly SettingsIcon = Settings;
  readonly MenuIcon = Menu;
  readonly SunIcon = Sun;
  readonly MoonIcon = Moon;
  readonly PanelRightIcon = PanelRight;

  onCreatePost() {
    this.ui.openCreatePostModal();
  }
}
