import { Component, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';
import { SidebarComponent } from './layout/sidebar/sidebar.component';
import { TopbarComponent } from './layout/topbar/topbar.component';
import { RightSidebarComponent } from './layout/right-sidebar/right-sidebar.component';
import { UiStore } from '../../core/state/ui.store';

@Component({
  selector: 'app-dashboard-layout',
  standalone: true,
  imports: [CommonModule, RouterOutlet, SidebarComponent, RightSidebarComponent],
  template: `
    <div class="layout-container" [style.grid-template-columns]="ui.rightSidebarOpen() ? 'var(--sidebar-width) minmax(600px, 800px) var(--right-sidebar-width)' : 'var(--sidebar-width) 1fr'">
      <app-sidebar class="left-sidebar glass"></app-sidebar>
      
      <div class="center-content">
        <div class="feed-wrapper">
          <router-outlet></router-outlet>
        </div>
      </div>
      
      @if (ui.rightSidebarOpen()) {
        <app-right-sidebar class="right-sidebar glass"></app-right-sidebar>
      }
    </div>
  `,
  styles: [`
    .layout-container {
      display: flex;
      height: 100vh;
      width: 100vw;
      background-color: var(--bg-app);
      overflow: hidden;
    }
    
    .left-sidebar {
      height: 100vh;
      width: 72px;
      transition: width 0.3s cubic-bezier(0.4, 0, 0.2, 1);
      z-index: 1000;
      border-right: 1px solid var(--border-glass);
      background: var(--bg-app);
      flex-shrink: 0;
    }

    .left-sidebar:hover {
      width: 240px;
    }

    .center-content {
      flex: 1;
      display: flex;
      flex-direction: column;
      height: 100vh;
      overflow: hidden;
      align-items: center;
    }

    .feed-wrapper {
      width: 100%;
      max-width: 900px;
      height: 100%;
      overflow-y: auto;
      scrollbar-width: none;
    }
    .feed-wrapper::-webkit-scrollbar { display: none; }

    .right-sidebar {
      width: 320px;
      height: 100vh;
      overflow-y: auto;
      border-left: 1px solid var(--border-glass);
      flex-shrink: 0;
    }

    @media (max-width: 1264px) {
      .right-sidebar {
        display: none;
      }
    }

    @media (max-width: 768px) {
      .left-sidebar {
        width: 0;
        border: none;
        overflow: hidden;
      }
      .feed-wrapper {
        max-width: 100%;
      }
    }
  `]
})
export class DashboardLayoutComponent {
  ui = inject(UiStore);
}
