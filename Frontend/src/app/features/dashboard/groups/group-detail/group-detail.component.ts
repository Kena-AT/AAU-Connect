import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { LucideAngularModule, ArrowLeft, Users, Calendar, FileText, MessageCircle, Settings, Plus, Clock, CheckCircle, AlertCircle, Download, ExternalLink } from 'lucide-angular';
import { GroupStore } from '../../../../core/state/group.store';
import { GROUP_TYPE_COLORS, GROUP_TYPE_ICONS, GROUP_TYPE_LABELS } from '../../../../core/models/group.model';
import { FeedComponent } from '../../feed/feed.component';

@Component({
  selector: 'app-group-detail',
  standalone: true,
  imports: [CommonModule, RouterModule, LucideAngularModule, FeedComponent],
  template: `
    <div class="group-detail-page">
      @if (groupStore.loading() && !groupStore.selectedGroup()) {
        <div class="loading-state">
          <!-- Spinner -->
        </div>
      } @else if (groupStore.selectedGroup(); as group) {
        
        <!-- Header Banner -->
        <div class="group-banner" [style.background]="getBannerBackground(group)">
          <div class="banner-overlay">
            <button class="btn-back" routerLink="/dashboard/groups">
              <lucide-icon [img]="ArrowLeftIcon"></lucide-icon>
              <span>Back</span>
            </button>
          </div>
        </div>

        <!-- Group Info Header -->
        <div class="group-header glass-card">
          <div class="header-main">
            <div class="group-icon-wrapper" [style.background]="getGroupColor(group)">
               <span class="group-emoji">{{ getGroupIcon(group) }}</span>
            </div>
            <div class="group-info">
              <div class="title-row">
                <h1>{{ group.name }}</h1>
                <span class="type-badge">{{ getGroupTypeLabel(group) }}</span>
              </div>
              <p class="description">{{ group.description }}</p>
              
              <div class="group-meta">
                <div class="meta-item">
                  <lucide-icon [img]="UsersIcon"></lucide-icon>
                  <span>{{ group.memberCount }} members</span>
                </div>
                <div class="meta-item">
                  <span class="visibility-dot" [class]="group.visibility"></span>
                  <span class="capitalize">{{ group.visibility }} Group</span>
                </div>
              </div>
            </div>
            
            <div class="group-actions">
               @if (group.isMember) {
                 <button class="btn-primary-outline">Invite</button>
               } @else {
                 <button class="btn-primary" (click)="joinGroup(group.id)">Join Group</button>
               }
            </div>
          </div>

          <!-- Tabs -->
          <div class="group-tabs">
            @for (tab of tabs; track tab.id) {
              <button 
                class="tab-btn" 
                [class.active]="activeTab() === tab.id"
                (click)="activeTab.set(tab.id)">
                <lucide-icon [img]="tab.icon" class="tab-icon"></lucide-icon>
                <span>{{ tab.label }}</span>
              </button>
            }
          </div>
        </div>

        <!-- Tab Content -->
        <div class="tab-content">
          @switch (activeTab()) {
            @case ('discussion') {
              <div class="discussion-view">
                 <!-- Reusing Feed Component logic or a simplified version involves complex refactoring. 
                      For MVP, we'll assume a tailored feed or placeholder. 
                      Actually, let's reuse app-feed but we'd need to filter it. 
                      For this demo, we'll put a placeholder and note. -->
                 <div class="feed-placeholder">
                    <h3>Group Discussion</h3>
                    <p>Post updates, questions, and share with the group.</p>
                    <app-feed></app-feed> 
                 </div>
              </div>
            }
            @case ('assignments') {
              <div class="assignments-view">
                <div class="section-header">
                  <h3>Assignments & Deadlines</h3>
                  <button class="btn-add" (click)="addAssignment()">
                    <lucide-icon [img]="PlusIcon"></lucide-icon>
                    <span>Add Assignment</span>
                  </button>
                </div>
                
                <div class="assignments-list">
                  @for (assignment of assignments(); track assignment.id) {
                    <div class="assignment-item glass-card" [class.overdue]="assignment.status === 'overdue'" [class.completed]="assignment.status === 'completed'">
                      <div class="assignment-icon" [style.background]="assignment.color">
                        <lucide-icon [img]="assignment.status === 'completed' ? CheckIcon : (assignment.status === 'overdue' ? AlertIcon : ClockIcon)"></lucide-icon>
                      </div>
                      <div class="assignment-content">
                        <h4>{{ assignment.title }}</h4>
                        <div class="assignment-meta">
                          <span class="due-date">Due: {{ assignment.dueDate }}</span>
                          <span class="status-badge" [class]="assignment.status">{{ assignment.status }}</span>
                        </div>
                      </div>
                      <button class="btn-assignment">
                        {{ assignment.status === 'completed' ? 'View' : 'Submit' }}
                      </button>
                    </div>
                  }
                </div>
              </div>
            }
            @case ('resources') {
              <div class="resources-view">
                <div class="section-header">
                  <h3>Resources Library</h3>
                  <button class="btn-add" (click)="addResource()">
                    <lucide-icon [img]="PlusIcon"></lucide-icon>
                    <span>Add Resource</span>
                  </button>
                </div>

                <div class="resources-grid">
                  @for (resource of resources(); track resource.id) {
                    <div class="resource-card glass-card">
                      <div class="resource-icon" [style.background]="resource.color">
                        <lucide-icon [img]="FileIcon"></lucide-icon>
                      </div>
                      <div class="resource-content">
                        <h4>{{ resource.title }}</h4>
                        <p>{{ resource.type }} • {{ resource.size }}</p>
                      </div>
                      <div class="resource-actions">
                        <button class="btn-icon">
                          <lucide-icon [img]="DownloadIcon"></lucide-icon>
                        </button>
                      </div>
                    </div>
                  }
                </div>
              </div>
            }
            @case ('members') {
              <div class="members-view glass-card">
                <h3>Members ({{ group.memberCount }})</h3>
                <p class="text-secondary">Member list placeholder...</p>
              </div>
            }
          }
        </div>

      } @else {
        <div class="not-found">
           <h2>Group not found</h2>
           <button routerLink="/dashboard/groups" class="btn-primary">Back to Groups</button>
        </div>
      }
    </div>
  `,
  styles: [`
    .group-detail-page {
      padding-bottom: var(--space-8);
    }
    
    /* Banner */
    .group-banner {
      height: 200px;
      position: relative;
      background-size: cover;
      background-position: center;
      border-radius: 0 0 var(--radius-2xl) var(--radius-2xl);
      margin: calc(var(--space-6) * -1) calc(var(--space-6) * -1) 0;
    }
    
    .banner-overlay {
      position: absolute;
      inset: 0;
      background: linear-gradient(to bottom, rgba(0,0,0,0.3), rgba(0,0,0,0.6));
      padding: var(--space-6);
      border-radius: inherit;
    }

    .btn-back {
      display: flex;
      align-items: center;
      gap: var(--space-2);
      padding: var(--space-2) var(--space-4);
      background: rgba(255,255,255,0.2);
      backdrop-filter: blur(10px);
      border: 1px solid rgba(255,255,255,0.3);
      border-radius: var(--radius-full);
      color: white;
      cursor: pointer;
      font-weight: 600;
      transition: all 0.2s;
    }
    
    .btn-back:hover {
      background: rgba(255,255,255,0.3);
    }

    /* Header */
    .group-header {
      margin: -60px var(--space-6) var(--space-6);
      position: relative;
      padding: 0;
      overflow: hidden;
    }

    .header-main {
      padding: var(--space-6);
      display: flex;
      gap: var(--space-5);
      align-items: flex-start;
    }
    
    .group-icon-wrapper {
      width: 80px;
      height: 80px;
      border-radius: var(--radius-xl);
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 3rem;
      box-shadow: var(--shadow-lg);
      border: 4px solid var(--bg-card);
    }
    
    .group-info {
      flex: 1;
      padding-top: var(--space-2);
    }
    
    .title-row {
      display: flex;
      align-items: center;
      gap: var(--space-3);
      margin-bottom: var(--space-2);
    }
    
    h1 {
      font-size: var(--text-2xl);
      font-weight: 800;
      margin: 0;
    }
    
    .type-badge {
      font-size: var(--text-xs);
      font-weight: 600;
      padding: var(--space-1) var(--space-3);
      background: var(--bg-glass);
      border-radius: var(--radius-full);
      border: 1px solid var(--border-glass);
    }
    
    .description {
      color: var(--text-secondary);
      margin-bottom: var(--space-4);
      max-width: 600px;
    }
    
    .group-meta {
      display: flex;
      gap: var(--space-4);
    }
    
    .meta-item {
      display: flex;
      align-items: center;
      gap: var(--space-2);
      color: var(--text-secondary);
      font-size: var(--text-sm);
    }
    
    .meta-item lucide-icon {
      width: 16px;
      height: 16px;
    }
    
    .visibility-dot {
      width: 8px;
      height: 8px;
      border-radius: 50%;
      background: var(--text-secondary);
    }
    .visibility-dot.public { background: var(--success-500); }
    .visibility-dot.private { background: var(--danger-500); }
    
    .capitalize { text-transform: capitalize; }
    
    .group-actions {
      padding-top: var(--space-2);
    }
    
    .btn-primary, .btn-primary-outline {
      padding: var(--space-2) var(--space-5);
      border-radius: var(--radius-lg);
      font-weight: 600;
      cursor: pointer;
    }
    
    .btn-primary {
      background: var(--gradient-primary);
      color: white;
      border: none;
    }
    
    .btn-primary-outline {
      background: transparent;
      border: 2px solid var(--primary-500);
      color: var(--primary-500);
    }

    /* Tabs */
    .group-tabs {
      display: flex;
      padding: 0 var(--space-6);
      border-top: 1px solid var(--border-glass);
    }
    
    .tab-btn {
      display: flex;
      align-items: center;
      gap: var(--space-2);
      padding: var(--space-4);
      background: none;
      border: none;
      color: var(--text-secondary);
      font-weight: 600;
      cursor: pointer;
      border-bottom: 2px solid transparent;
      transition: all 0.2s;
    }
    
    .tab-btn:hover {
      color: var(--text-primary);
    }
    
    .tab-btn.active {
      color: var(--primary-600);
      border-bottom-color: var(--primary-600);
    }
    
    .tab-icon {
      width: 18px;
      height: 18px;
    }
    
    /* Content */
    .tab-content {
      padding: 0 var(--space-6);
    }
    
    .section-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: var(--space-4);
    }
    
    .btn-add {
      display: flex;
      align-items: center;
      gap: var(--space-2);
      padding: var(--space-2) var(--space-4);
      background: var(--bg-glass);
      border: 1px solid var(--border-glass);
      border-radius: var(--radius-lg);
      cursor: pointer;
      font-weight: 600;
      color: var(--primary-600);
    }
    
    /* List Styles (Reused from Academic) */
    .assignments-list {
      display: flex;
      flex-direction: column;
      gap: var(--space-3);
    }
    
    .assignment-item {
      display: flex;
      align-items: center;
      gap: var(--space-4);
      padding: var(--space-4);
      transition: all 0.2s;
    }
    
    .assignment-item:hover {
      transform: translateX(4px);
    }
    
    .assignment-icon {
       width: 40px;
       height: 40px;
       border-radius: var(--radius-lg);
       display: flex;
       align-items: center;
       justify-content: center;
       color: white;
    }
    
    .assignment-content {
      flex: 1;
    }
    
    .assignment-meta {
      display: flex;
      gap: var(--space-3);
      font-size: var(--text-xs);
      color: var(--text-secondary);
      margin-top: 4px;
    }
    
    .status-badge {
      font-weight: 700;
      text-transform: uppercase;
    }
    
    .btn-assignment {
      padding: var(--space-2) var(--space-4);
      border: none;
      background: var(--bg-surface);
      border-radius: var(--radius-lg);
      cursor: pointer;
      font-weight: 600;
    }
    
    .resources-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
      gap: var(--space-4);
    }
    
    .resource-card {
      display: flex;
      align-items: center;
      gap: var(--space-3);
      padding: var(--space-4);
    }
    
    .resource-icon {
      width: 40px;
      height: 40px;
      border-radius: var(--radius-lg);
      display: flex;
      align-items: center;
      justify-content: center;
      color: white;
    }
    
    .resource-content h4 {
      margin: 0;
      font-size: var(--text-sm);
    }
    
    .resource-content p {
      margin: 2px 0 0;
      font-size: var(--text-xs);
      color: var(--text-secondary);
    }
    
    .btn-icon {
      background: none;
      border: none;
      cursor: pointer;
      padding: 4px;
      opacity: 0.6;
    }
    .btn-icon:hover { opacity: 1; }
    
    .members-view {
      padding: var(--space-6);
      text-align: center;
    }
  `]
})
export class GroupDetailComponent implements OnInit {
  private route = inject(ActivatedRoute);
  groupStore = inject(GroupStore);

  // Tabs
  activeTab = signal('discussion');
  tabs = [
    { id: 'discussion', label: 'Discussion', icon: MessageCircle },
    { id: 'assignments', label: 'Assignments', icon: Calendar },
    { id: 'resources', label: 'Resources', icon: FileText },
    { id: 'members', label: 'Members', icon: Users }
  ];

  // Icons
  readonly ArrowLeftIcon = ArrowLeft;
  readonly UsersIcon = Users;
  readonly PlusIcon = Plus;
  readonly CheckIcon = CheckCircle;
  readonly AlertIcon = AlertCircle;
  readonly ClockIcon = Clock;
  readonly FileIcon = FileText;
  readonly DownloadIcon = Download;

  // Data signals
  assignments = signal<any[]>([]);
  resources = signal<any[]>([]);

  ngOnInit() {
    this.route.paramMap.subscribe(params => {
      const id = params.get('id');
      if (id) {
        this.groupStore.loadGroupDetails(id);
      }
    });
  }

  getBannerBackground(group: any): string {
    return group.coverImage ? `url(${group.coverImage})` : 'var(--bg-surface)';
  }

  getGroupColor(group: any): string {
    return GROUP_TYPE_COLORS[group.type as keyof typeof GROUP_TYPE_COLORS] || 'var(--primary-600)';
  }

  getGroupIcon(group: any): string {
    return GROUP_TYPE_ICONS[group.type as keyof typeof GROUP_TYPE_ICONS] || '👥';
  }

  getGroupTypeLabel(group: any): string {
    return GROUP_TYPE_LABELS[group.type as keyof typeof GROUP_TYPE_LABELS] || 'Group';
  }

  joinGroup(id: string) {
    this.groupStore.joinGroup(id);
  }

  addAssignment() {
    const title = prompt('Assignment Title:');
    if (title) this.assignments.update(prev => [...prev, { id: Date.now(), title, dueDate: 'TBD', status: 'pending', color: 'var(--gradient-primary)' }]);
  }

  addResource() {
    const title = prompt('Resource Title:');
    if (title) this.resources.update(prev => [...prev, { id: Date.now(), title, type: 'FILE', size: 'N/A', color: 'var(--gradient-secondary)' }]);

  }
}
