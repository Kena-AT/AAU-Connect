import { Component, Input, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { LucideAngularModule, Users, Globe, Lock, MoreVertical, LogOut, Trash2, Check, Plus } from 'lucide-angular';
import { Group, GROUP_TYPE_LABELS, GROUP_TYPE_COLORS } from '../../../../core/models/group.model';
import { GroupStore } from '../../../../core/state/group.store';
import { AuthService } from '../../../../core/auth/auth.service';

@Component({
  selector: 'app-group-card',
  standalone: true,
  imports: [CommonModule, RouterModule, LucideAngularModule],
  template: `    <div class="group-card glass-card" (click)="navigateToGroup()">
      <!-- Cover Image -->
      <div class="card-cover" [style.background]="getCoverBackground()">
        <div class="cover-overlay">
          <span class="type-badge">
            <span>{{ getTypeLabel() }}</span>
          </span>
          
          <!-- More Menu -->
          <div class="more-menu-container" (click)="$event.stopPropagation()">
            <button class="btn-more" (click)="showMenu.set(!showMenu())" [class.active]="showMenu()">
              <lucide-icon [img]="MoreIcon"></lucide-icon>
            </button>
            
            @if (showMenu()) {
              <div class="dropdown-menu glass-card">
                @if (group.isMember) {
                  <button class="menu-item" (click)="leaveGroup()">
                    <lucide-icon [img]="LeaveIcon" class="menu-icon"></lucide-icon>
                    <span>Leave Group</span>
                  </button>
                }
                @if (isOwner()) {
                  <button class="menu-item danger" (click)="deleteGroup()">
                    <lucide-icon [img]="DeleteIcon" class="menu-icon danger"></lucide-icon>
                    <span>Delete Group</span>
                  </button>
                }
                <div class="menu-divider"></div>
                <button class="menu-item cancel" (click)="showMenu.set(false)">
                  <span>Cancel</span>
                </button>
              </div>
            }
          </div>
        </div>
      </div>
      <!-- Card Content -->
      <div class="card-content">
        <h3 class="group-name">{{ group.name }}</h3>
        <p class="group-description">{{ group.description }}</p>

        <!-- Meta Info -->
        <div class="group-meta">
          <div class="meta-item" title="Members">
            <lucide-icon [img]="UsersIcon"></lucide-icon>
            <span>{{ group.memberCount }} members</span>
          </div>
          <div class="meta-item" [title]="group.visibility">
            <lucide-icon [img]="getVisibilityIcon()"></lucide-icon>
            <span>{{ group.visibility }}</span>
          </div>
        </div>
        <!-- Actions -->
        <div class="card-actions" (click)="$event.stopPropagation()">
          @if (group.isMember) {
            <button class="btn-action member" (click)="leaveGroup()">
              <lucide-icon [img]="CheckIcon" class="icon"></lucide-icon>
              <span>Member</span>
            </button>
          } @else {
            <button class="btn-action join" (click)="joinGroup()">
              <lucide-icon [img]="PlusIcon" class="icon"></lucide-icon>
              <span>Join Group</span>
            </button>
          }
        </div>      </div>
    </div>
  `,
  styles: [`
    .group-card {
      cursor: pointer;
      overflow: hidden;
      transition: all var(--transition-bounce);
      padding: 0;
      border: 1px solid var(--border-glass);
    }

    .group-card:hover {
      transform: translateY(-12px) scale(1.02);
      box-shadow: var(--shadow-2xl);
      border-color: var(--primary-300);
    }

    /* Cover */
    .card-cover {
      height: 160px;
      background-size: cover;
      background-position: center;
      position: relative;
      overflow: hidden;
    }

    .cover-overlay {
      position: absolute;
      inset: 0;
      background: linear-gradient(to bottom, rgba(0,0,0,0.1), rgba(0,0,0,0.5));
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      padding: var(--space-4);
    }

    .more-menu-container {
      position: relative;
    }

    .btn-more {
      width: 36px;
      height: 36px;
      border-radius: var(--radius-full);
      background: rgba(255, 255, 255, 0.15);
      backdrop-filter: blur(12px);
      border: 1px solid rgba(255, 255, 255, 0.3);
      color: white;
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      transition: all var(--transition-base);
    }

    .btn-more:hover, .btn-more.active {
      background: rgba(255, 255, 255, 0.3);
      transform: rotate(90deg);
      border-color: white;
    }

    .btn-more lucide-icon {
      width: 18px;
      height: 18px;
    }

    .dropdown-menu {
      position: absolute;
      top: calc(100% + 10px);
      right: 0;
      min-width: 180px;
      padding: var(--space-2);
      z-index: 100;
      background: var(--bg-card-glass);
      backdrop-filter: blur(20px);
      border: 1px solid var(--border-glass);
      box-shadow: var(--shadow-2xl);
      animation: menuSlideIn 0.3s cubic-bezier(0.68, -0.55, 0.265, 1.55);
    }

    @keyframes menuSlideIn {
      from { opacity: 0; transform: translateY(-10px) scale(0.9); }
      to { opacity: 1; transform: translateY(0) scale(1); }
    }

    .menu-item {
      width: 100%;
      display: flex;
      align-items: center;
      gap: var(--space-3);
      padding: var(--space-3) var(--space-4);
      background: none;
      border: none;
      border-radius: var(--radius-lg);
      color: var(--text-primary);
      font-size: var(--text-sm);
      font-weight: 500;
      cursor: pointer;
      transition: all 0.2s ease;
      text-align: left;
    }

    .menu-item:hover {
      background: var(--bg-glass);
      transform: translateX(4px);
    }

    .menu-item.danger {
      color: var(--danger-500);
    }

    .menu-item.danger:hover {
      background: rgba(239, 68, 68, 0.08);
    }

    .menu-divider {
      height: 1px;
      background: var(--border-glass);
      margin: var(--space-1) var(--space-2);
    }

    .menu-item.cancel {
      opacity: 0.6;
    }

    .menu-icon {
      width: 16px;
      height: 16px;
    }
    .type-badge {
      display: flex;
      align-items: center;
      gap: var(--space-2);
      padding: var(--space-2) var(--space-3);
      background: rgba(255, 255, 255, 0.2);
      backdrop-filter: blur(10px);
      border-radius: var(--radius-full);
      color: white;
      font-size: var(--text-xs);
      font-weight: 600;
      border: 1px solid rgba(255, 255, 255, 0.3);
    }

    /* Content */
    .card-content {
      padding: var(--space-5);
    }

    .group-name {
      font-size: var(--text-xl);
      font-weight: 700;
      color: var(--text-primary);
      margin: 0 0 var(--space-2) 0;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }

    .group-description {
      font-size: var(--text-sm);
      color: var(--text-secondary);
      margin: 0 0 var(--space-4) 0;
      line-height: 1.5;
      display: -webkit-box;
      -webkit-line-clamp: 2;
      -webkit-box-orient: vertical;
      overflow: hidden;
    }

    /* Meta */
    .group-meta {
      display: flex;
      gap: var(--space-4);
      margin-bottom: var(--space-4);
      padding-top: var(--space-4);
      border-top: 1px solid var(--border-glass);
    }

    .meta-item {
      display: flex;
      align-items: center;
      gap: var(--space-2);
      font-size: var(--text-xs);
      color: var(--text-secondary);
    }

    .meta-item lucide-icon {
      width: 16px;
      height: 16px;
      color: var(--primary-500);
      filter: drop-shadow(0 0 4px var(--primary-200));
    }
    /* Actions */
    .card-actions {
      display: flex;
      gap: var(--space-2);
    }

    .btn-action {
      flex: 1;
      display: flex;
      align-items: center;
      justify-content: center;
      gap: var(--space-2);
      padding: var(--space-3);
      border: none;
      border-radius: var(--radius-lg);
      font-weight: 600;
      font-size: var(--text-sm);
      cursor: pointer;
      transition: all 0.2s ease;
    }

    .btn-action.join {
      background: var(--gradient-primary);
      color: white;
      box-shadow: var(--shadow-md);
    }

    .btn-action.join:hover {
      transform: scale(1.05);
      box-shadow: var(--shadow-lg);
    }

    .btn-action.member {
      background: var(--bg-glass);
      color: var(--success-500);
      border: 1px solid var(--border-glass);
    }

    .btn-action.member:hover {
      background: rgba(16, 185, 129, 0.1);
    }

    .btn-action lucide-icon {
      width: 18px;
      height: 18px;
    }  `]
})
export class GroupCardComponent {
  @Input({ required: true }) group!: Group;

  private router = inject(Router);
  private groupStore = inject(GroupStore);
  private auth = inject(AuthService);

  readonly UsersIcon = Users;
  readonly MoreIcon = MoreVertical;
  readonly LeaveIcon = LogOut;
  readonly DeleteIcon = Trash2;
  readonly CheckIcon = Check;
  readonly PlusIcon = Plus;

  showMenu = signal(false);

  isOwner(): boolean {
    return !!this.group.isOwner;
  }

  getCoverBackground(): string {
    if (this.group.coverImage) {
      return `url(${this.group.coverImage})`;
    }
    return GROUP_TYPE_COLORS[this.group.type];
  }

  getTypeLabel(): string {
    return GROUP_TYPE_LABELS[this.group.type];
  }

  getVisibilityIcon() {
    return this.group.visibility === 'public' ? Globe : Lock;
  }

  navigateToGroup() {
    this.router.navigate(['/dashboard/groups', this.group.id]);
  }

  joinGroup() {
    this.groupStore.joinGroup(this.group.id);
  }

  leaveGroup() {
    if (confirm(`Are you sure you want to leave ${this.group.name}?`)) {
      this.groupStore.leaveGroup(this.group.id);
      this.showMenu.set(false);
    }
  }

  deleteGroup() {
    if (confirm(`CRITICAL: Are you sure you want to DELETE ${this.group.name}? This cannot be undone.`)) {
      this.groupStore.deleteGroup(this.group.id);
      this.showMenu.set(false);
    }
  }
}
