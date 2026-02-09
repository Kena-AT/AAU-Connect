import { Component, inject, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LucideAngularModule, TrendingUp, Users, Calendar, Plus, Check } from 'lucide-angular';
import { UserApiService } from '../../../../core/api/user-api.service';
import { User } from '../../../../core/models/user.model';

@Component({
  selector: 'app-right-sidebar',
  standalone: true,
  imports: [CommonModule, LucideAngularModule],
  template: `
    <div class="right-sidebar-content">
      <!-- Recommended Friends -->
      <section class="widget glass-card card-3d">
        <div class="widget-header">
          <lucide-icon [img]="UsersIcon" class="widget-icon"></lucide-icon>
          <h3 class="widget-title">Recommended Friends</h3>
        </div>
        <div class="peers-list" [style.max-height]="'400px'" [style.overflow-y]="'auto'">
          @if (loading()) {
            <div class="loading-state">Loading suggestions...</div>
          } @else {
            @for (peer of suggestedPeers(); track peer.id) {
              <div class="peer-item">
                <div class="peer-avatar gradient-text" [style.background]="getGradient(peer)">
                  {{ getInitials(peer) }}
                </div>
                <div class="peer-info">
                  <p class="peer-name">{{ peer.firstName }} {{ peer.lastName }}</p>
                  <span class="peer-dept">{{ peer.department }}</span>
                </div>
                <button 
                  class="btn-connect" 
                  [class.following]="isFollowing(peer.id)"
                  (click)="toggleFollow(peer.id)">
                  <lucide-icon [img]="isFollowing(peer.id) ? CheckIcon : PlusIcon" class="icon"></lucide-icon>
                </button>
              </div>
            } @empty {
              <div class="empty-state">No recommendations yet</div>
            }
          }
        </div>
      </section>
    </div>
  `,
  styles: [`
    .right-sidebar-content {
      padding: var(--space-6);
      display: flex;
      flex-direction: column;
      gap: var(--space-6);
    }

    .widget {
      padding: var(--space-6);
      transition: all var(--transition-base);
    }

    .widget-header {
      display: flex;
      align-items: center;
      gap: var(--space-3);
      margin-bottom: var(--space-5);
    }

    .widget-icon {
      width: 20px;
      height: 20px;
      color: var(--primary-500);
    }

    .widget-title {
      font-size: var(--text-base);
      font-weight: 800;
      font-family: var(--font-display);
      color: var(--text-primary);
    }

    /* Recommended Friends */
    .peers-list {
      display: flex;
      flex-direction: column;
      gap: var(--space-3);
    }

    .loading-state, .empty-state {
      padding: var(--space-4);
      text-align: center;
      color: var(--text-secondary);
      font-size: var(--text-sm);
    }

    .peer-item {
      display: flex;
      align-items: center;
      gap: var(--space-3);
      padding: var(--space-3);
      border-radius: var(--radius-xl);
      transition: all var(--transition-base);
      background: var(--bg-glass);
    }

    .peer-item:hover {
      background: var(--bg-card);
      transform: scale(1.02);
      box-shadow: var(--shadow-md);
    }

    .peer-avatar {
      width: 44px;
      height: 44px;
      border-radius: var(--radius-full);
      display: flex;
      align-items: center;
      justify-content: center;
      font-weight: 800;
      font-size: var(--text-sm);
      flex-shrink: 0;
      box-shadow: var(--shadow-lg);
      position: relative;
      color: white;
    }

    .peer-info {
      flex: 1;
      min-width: 0;
    }

    .peer-name {
      font-size: var(--text-xs);
      font-weight: 700;
      color: var(--text-primary);
      margin: 0 0 var(--space-1) 0;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }

    .peer-dept {
      font-size: 10px;
      color: var(--text-secondary);
      font-weight: 600;
    }

    .btn-connect {
      width: 32px;
      height: 32px;
      border-radius: var(--radius-full);
      background: var(--gradient-primary);
      border: none;
      color: white;
      cursor: pointer;
      transition: all var(--transition-bounce);
      flex-shrink: 0;
      display: flex;
      align-items: center;
      justify-content: center;
      box-shadow: var(--shadow-md);
    }

    .btn-connect.following {
      background: var(--success-500);
    }

    .btn-connect .icon {
      width: 14px;
      height: 14px;
    }

    .btn-connect:hover {
      transform: scale(1.1);
    }
  `]
})
export class RightSidebarComponent implements OnInit {
  private userApi = inject(UserApiService);

  readonly UsersIcon = Users;
  readonly PlusIcon = Plus;
  readonly CheckIcon = Check;

  suggestedPeers = signal<User[]>([]);
  loading = signal(false);
  followingIds = signal<Set<string>>(new Set());

  ngOnInit() {
    this.loadRecommendations();
  }

  loadRecommendations() {
    this.loading.set(true);
    this.userApi.getRecommendedFriends().subscribe({
      next: (users) => {
        this.suggestedPeers.set(users);
        this.loading.set(false);
      },
      error: () => this.loading.set(false)
    });
  }

  toggleFollow(userId: string) {
    this.userApi.toggleFollow(userId).subscribe({
      next: (res) => {
        const ids = new Set(this.followingIds());
        if (res.isFollowing) {
          ids.add(userId);
        } else {
          ids.delete(userId);
        }
        this.followingIds.set(ids);
      }
    });
  }

  isFollowing(userId: string): boolean {
    return this.followingIds().has(userId);
  }

  getInitials(user: User): string {
    return `${user.firstName[0]}${user.lastName[0]}`;
  }

  getGradient(user: User): string {
    // Return a simple gradient based on name as placeholder
    return 'var(--gradient-primary)';
  }
}
