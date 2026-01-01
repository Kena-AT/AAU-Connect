import { Component, inject, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LucideAngularModule, Users, BookOpen, Landmark, Target, Book, Plus, AlertTriangle, GraduationCap } from 'lucide-angular';
import { GroupStore } from '../../../core/state/group.store';
import { GroupCardComponent } from './components/group-card.component';
import { CreateGroupModalComponent } from './components/create-group-modal.component';
import { GroupType, GROUP_TYPE_LABELS } from '../../../core/models/group.model';
import { LoadingSpinnerComponent } from '../../../shared/components/loading-spinner/loading-spinner.component';
import { EmptyStateComponent } from '../../../shared/components/empty-state/empty-state.component';

@Component({
  selector: 'app-groups-page',
  standalone: true,
  imports: [CommonModule, GroupCardComponent, CreateGroupModalComponent, LoadingSpinnerComponent, EmptyStateComponent, LucideAngularModule],
  template: `
    <div class="groups-page">
      <!-- Header -->
      <div class="page-header glass-card">
        <div class="header-content">
          <div>
            <h1>Groups</h1>
            <p class="subtitle">Connect with your academic community</p>
          </div>
          <button class="btn-create" (click)="showCreateModal.set(true)">
            <lucide-icon [img]="PlusIcon" class="icon"></lucide-icon>
            <span>Create Group</span>
          </button>
        </div>

        <!-- Tabs -->
        <div class="tabs">
          <button 
            *ngFor="let tab of tabs" 
            class="tab" 
            [class.active]="activeTab() === tab.value"
            (click)="activeTab.set(tab.value)">
            <lucide-icon [img]="tab.icon" class="tab-icon"></lucide-icon>
            <span>{{ tab.label }}</span>
            <span class="tab-count">{{ getGroupCount(tab.value) }}</span>
          </button>
        </div>
      </div>

      <!-- Content -->
      <div class="page-content">
        @if (groupStore.loading()) {
          <app-loading-spinner></app-loading-spinner>
        } @else if (groupStore.error()) {
          <div class="error-message glass-card">
            <lucide-icon [img]="AlertIcon" class="icon"></lucide-icon>
            <p>{{ groupStore.error() }}</p>
            <button class="btn-retry" (click)="groupStore.loadMyGroups()">Retry</button>
          </div>
        } @else {
          <div class="groups-grid">
            @for (group of getFilteredGroups(); track group.id) {
              <app-group-card [group]="group"></app-group-card>
            } @empty {
              <app-empty-state
                icon="👥"
                [title]="getEmptyStateTitle()"
                [message]="getEmptyStateMessage()">
                <button class="btn-primary" (click)="showCreateModal.set(true)">
                  Create Your First Group
                </button>
              </app-empty-state>
            }
          </div>
        }
      </div>

      <!-- Create Group Modal -->
      @if (showCreateModal()) {
        <app-create-group-modal (close)="showCreateModal.set(false)"></app-create-group-modal>
      }

      <!-- Floating Action Button (Mobile) -->
      <button class="fab" (click)="showCreateModal.set(true)">
        <lucide-icon [img]="PlusIcon" class="icon"></lucide-icon>
      </button>
    </div>
  `,
  styles: [`
    .groups-page {
      width: 100%;
      max-width: 1200px;
      margin: 0 auto;
    }

    .page-header {
      padding: var(--space-8) var(--space-6);
      margin-bottom: var(--space-8);
      border: 1px solid var(--border-glass);
    }

    .header-content {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      margin-bottom: var(--space-6);
    }

    h1 {
      font-size: var(--text-4xl);
      font-weight: 800;
      margin-bottom: var(--space-2);
      background: var(--gradient-primary);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
    }

    .subtitle {
      font-size: var(--text-base);
      color: var(--text-secondary);
      margin: 0;
      opacity: 0.8;
    }

    .btn-create {
      display: flex;
      align-items: center;
      gap: var(--space-2);
      padding: var(--space-3) var(--space-6);
      background: var(--gradient-primary);
      color: white;
      border: none;
      border-radius: var(--radius-xl);
      font-weight: 600;
      font-size: var(--text-base);
      cursor: pointer;
      transition: all 0.3s ease;
      box-shadow: var(--shadow-lg);
    }

    .btn-create:hover {
      transform: translateY(-2px);
      box-shadow: var(--shadow-xl);
    }

    .btn-create lucide-icon {
      width: 18px;
      height: 18px;
    }

    /* Tabs */
    .tabs {
      display: flex;
      gap: var(--space-3);
      overflow-x: auto;
      padding-bottom: var(--space-4);
      scrollbar-width: none;
    }
    .tabs::-webkit-scrollbar { display: none; }

    .tab {
      display: flex;
      align-items: center;
      gap: var(--space-2);
      padding: var(--space-2) var(--space-5);
      background: var(--bg-glass);
      border: 1px solid var(--border-glass);
      border-radius: var(--radius-full);
      color: var(--text-secondary);
      font-weight: 600;
      font-size: var(--text-sm);
      cursor: pointer;
      transition: all var(--transition-bounce);
      white-space: nowrap;
    }

    .tab:hover {
      background: var(--bg-card);
      color: var(--text-primary);
    }

    .tab.active {
      background: var(--gradient-primary);
      color: white;
      border-color: transparent;
      box-shadow: var(--shadow-md);
    }

    .tab-icon {
      width: 18px;
      height: 18px;
    }

    .tab-count {
      padding: var(--space-1) var(--space-2);
      background: rgba(255, 255, 255, 0.2);
      border-radius: var(--radius-full);
      font-size: var(--text-xs);
      font-weight: 700;
    }

    .tab.active .tab-count {
      background: rgba(255, 255, 255, 0.3);
    }

    /* Content */
    .page-content {
      min-height: 400px;
    }

    .groups-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(340px, 1fr));
      gap: var(--space-8);
      padding-bottom: var(--space-12);
    }

    .error-message {
      padding: var(--space-6);
      text-align: center;
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: var(--space-4);
    }

    .error-message lucide-icon {
      width: 48px;
      height: 48px;
      color: var(--danger-500);
    }

    .error-message p {
      color: var(--text-secondary);
      margin: 0;
    }

    .btn-retry {
      padding: var(--space-3) var(--space-6);
      background: var(--primary-600);
      color: white;
      border: none;
      border-radius: var(--radius-lg);
      font-weight: 600;
      cursor: pointer;
      transition: all 0.2s ease;
    }

    .btn-retry:hover {
      background: var(--primary-700);
      transform: translateY(-2px);
    }

    /* Floating Action Button */
    .fab {
      position: fixed;
      bottom: var(--space-8);
      right: var(--space-8);
      width: 64px;
      height: 64px;
      background: var(--gradient-primary);
      color: white;
      border: none;
      border-radius: var(--radius-full);
      box-shadow: var(--shadow-xl);
      cursor: pointer;
      transition: all 0.3s ease;
      z-index: 1000;
      display: none;
    }

    .fab lucide-icon {
      width: 24px;
      height: 24px;
    }

    .fab:hover {
      transform: scale(1.1);
    }

    @media (max-width: 768px) {
      .btn-create {
        display: none;
      }

      .fab {
        display: flex;
        align-items: center;
        justify-content: center;
      }

      .groups-grid {
        grid-template-columns: 1fr;
      }
    }
  `]
})
export class GroupsPageComponent implements OnInit {
  groupStore = inject(GroupStore);

  activeTab = signal<'all' | GroupType>('all');
  showCreateModal = signal(false);

  readonly PlusIcon = Plus;
  readonly AlertIcon = AlertTriangle;

  tabs = [
    { value: 'all' as const, label: 'All Groups', icon: Users },
    { value: 'course' as const, label: 'Courses', icon: BookOpen },
    { value: 'department' as const, label: 'Departments', icon: Landmark },
    { value: 'club' as const, label: 'Clubs', icon: Target },
    { value: 'study' as const, label: 'Study Groups', icon: Book },
    { value: 'class' as const, label: 'Classes', icon: GraduationCap }
  ];

  ngOnInit() {
    this.groupStore.loadMyGroups();
  }

  getFilteredGroups() {
    const tab = this.activeTab();
    if (tab === 'all') {
      return this.groupStore.myGroups();
    }
    return this.groupStore.myGroups().filter(g => g.type === tab);
  }

  getGroupCount(tab: 'all' | GroupType): number {
    if (tab === 'all') {
      return this.groupStore.groupCount();
    }
    return this.groupStore.myGroups().filter(g => g.type === tab).length;
  }

  getEmptyStateTitle(): string {
    const tab = this.activeTab();
    if (tab === 'all') {
      return 'No Groups Yet';
    }
    return `No ${GROUP_TYPE_LABELS[tab]}s`;
  }

  getEmptyStateMessage(): string {
    const tab = this.activeTab();
    if (tab === 'all') {
      return 'Create or join groups to connect with your peers';
    }
    return `You haven't joined any ${GROUP_TYPE_LABELS[tab].toLowerCase()}s yet`;
  }
}
