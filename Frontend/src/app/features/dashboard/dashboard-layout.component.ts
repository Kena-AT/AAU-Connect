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
  imports: [CommonModule, RouterOutlet, SidebarComponent, TopbarComponent, RightSidebarComponent],
  template: `
    <div class="layout-container" [style.grid-template-columns]="ui.rightSidebarOpen() ? 'var(--sidebar-width) minmax(600px, 800px) var(--right-sidebar-width)' : 'var(--sidebar-width) 1fr'">
      <app-sidebar class="left-sidebar glass"></app-sidebar>
      
      <div class="center-content">
        <app-topbar></app-topbar>
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
      display: grid;
      grid-template-columns: 260px minmax(600px, 800px) 340px;
      justify-content: center;
      height: 100vh;
      width: 100%;
      max-width: 1600px;
      margin: 0 auto;
      background-color: var(--bg-app);
      overflow: hidden;
      gap: var(--space-8);
      padding: 0 var(--space-8);
    }
    
    .left-sidebar {
      position: sticky;
      top: 0;
      height: 100vh;
      overflow-y: auto;
      padding: var(--space-4) 0;
    }

    .center-content {
      display: flex;
      flex-direction: column;
      height: 100vh;
      overflow: hidden;
    }

    .feed-wrapper {
      flex: 1;
      overflow-y: auto;
      padding: 0;
    }

    .right-sidebar {
      position: sticky;
      top: 0;
      height: 100vh;
      overflow-y: auto;
      padding: var(--space-4) 0;
    }

    @media (max-width: 1400px) {
      .layout-container {
        grid-template-columns: 240px 1fr;
        gap: var(--space-6);
      }
      
      .right-sidebar {
        display: none;
      }
    }

    @media (max-width: 768px) {
      .layout-container {
        grid-template-columns: 1fr;
        padding: 0;
        gap: 0;
      }
      
      .left-sidebar {
        display: none;
      }
    }
  `]
})
export class DashboardLayoutComponent {
  ui = inject(UiStore);
}
