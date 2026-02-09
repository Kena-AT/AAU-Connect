import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LucideAngularModule, TrendingUp, Users, Calendar, Plus } from 'lucide-angular';

@Component({
  selector: 'app-right-sidebar',
  standalone: true,
  imports: [CommonModule, LucideAngularModule],
  template: `
    <div class="right-sidebar-content">
      <!-- Trending Research -->
      <section class="widget glass-card card-3d">
        <div class="widget-header">
          <lucide-icon [img]="TrendingIcon" class="widget-icon"></lucide-icon>
          <h3 class="widget-title">Trending Research</h3>
        </div>
        <div class="trending-list">
          @for (topic of trendingTopics; track topic.id) {
            <div class="trending-item shimmer">
              <div class="trend-icon" [style.background]="topic.gradient"></div>
              <div class="trend-info">
                <p class="trend-title">{{ topic.title }}</p>
                <span class="trend-meta">{{ topic.papers }} papers</span>
              </div>
            </div>
          }
        </div>
      </section>

      <!-- Suggested Peers -->
      <section class="widget glass-card card-3d">
        <div class="widget-header">
          <lucide-icon [img]="UsersIcon" class="widget-icon"></lucide-icon>
          <h3 class="widget-title">Suggested Peers</h3>
        </div>
        <div class="peers-list">
          @for (peer of suggestedPeers; track peer.id) {
            <div class="peer-item">
              <div class="peer-avatar gradient-text" [style.background]="peer.gradient">
                {{ peer.initials }}
              </div>
              <div class="peer-info">
                <p class="peer-name">{{ peer.name }}</p>
                <span class="peer-dept">{{ peer.department }}</span>
              </div>
              <button class="btn-connect btn-interactive">
                <lucide-icon [img]="PlusIcon" class="icon"></lucide-icon>
              </button>
            </div>
          }
        </div>
      </section>

      <!-- Upcoming Deadlines -->
      <section class="widget glass-card card-3d">
        <div class="widget-header">
          <lucide-icon [img]="CalendarIcon" class="widget-icon"></lucide-icon>
          <h3 class="widget-title">Upcoming Deadlines</h3>
        </div>
        <div class="deadlines-list">
          @for (deadline of upcomingDeadlines; track deadline.id) {
            <div class="deadline-item neumorphic" [class.urgent]="deadline.urgent">
              <div class="deadline-date">
                <span class="day">{{ deadline.day }}</span>
                <span class="month">{{ deadline.month }}</span>
              </div>
              <div class="deadline-info">
                <p class="deadline-title">{{ deadline.title }}</p>
                <span class="deadline-course">{{ deadline.course }}</span>
              </div>
            </div>
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

    .widget:hover {
      transform: translateY(-4px) scale(1.02);
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

    /* Trending Research */
    .trending-list {
      display: flex;
      flex-direction: column;
      gap: var(--space-3);
    }

    .trending-item {
      display: flex;
      align-items: center;
      gap: var(--space-3);
      padding: var(--space-3);
      border-radius: var(--radius-xl);
      transition: all var(--transition-base);
      cursor: pointer;
      background: var(--bg-glass);
    }

    .trending-item:hover {
      background: var(--bg-card);
      transform: translateX(6px);
      box-shadow: var(--shadow-md);
    }

    .trend-icon {
      width: 44px;
      height: 44px;
      border-radius: var(--radius-xl);
      flex-shrink: 0;
      box-shadow: var(--shadow-md);
    }

    .trend-info {
      flex: 1;
      min-width: 0;
    }

    .trend-title {
      font-size: var(--text-xs);
      font-weight: 700;
      color: var(--text-primary);
      margin: 0 0 var(--space-1) 0;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }

    .trend-meta {
      font-size: var(--text-xs);
      color: var(--text-secondary);
      font-weight: 600;
    }

    /* Suggested Peers */
    .peers-list {
      display: flex;
      flex-direction: column;
      gap: var(--space-3);
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
      width: 48px;
      height: 48px;
      border-radius: var(--radius-full);
      display: flex;
      align-items: center;
      justify-content: center;
      font-weight: 800;
      font-size: var(--text-base);
      flex-shrink: 0;
      box-shadow: var(--shadow-lg);
      position: relative;
    }

    .peer-avatar::after {
      content: '';
      position: absolute;
      inset: -2px;
      border-radius: var(--radius-full);
      background: inherit;
      z-index: -1;
      opacity: 0.4;
      filter: blur(8px);
    }

    .peer-info {
      flex: 1;
      min-width: 0;
    }

    .peer-name {
      font-size: var(--text-sm);
      font-weight: 700;
      color: var(--text-primary);
      margin: 0 0 var(--space-1) 0;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }

    .peer-dept {
      font-size: var(--text-xs);
      color: var(--text-secondary);
      font-weight: 600;
    }

    .btn-connect {
      width: 36px;
      height: 36px;
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

    .btn-connect .icon {
      width: 18px;
      height: 18px;
    }

    .btn-connect:hover {
      transform: scale(1.15) rotate(90deg);
      box-shadow: var(--shadow-xl);
    }

    /* Upcoming Deadlines */
    .deadlines-list {
      display: flex;
      flex-direction: column;
      gap: var(--space-3);
    }

    .deadline-item {
      display: flex;
      gap: var(--space-3);
      padding: var(--space-4);
      border-radius: var(--radius-xl);
      border-left: 4px solid var(--primary-500);
      transition: all var(--transition-base);
      cursor: pointer;
    }

    .deadline-item:hover {
      transform: translateX(6px) scale(1.02);
      box-shadow: var(--shadow-lg);
    }

    .deadline-item.urgent {
      border-left-color: var(--danger-500);
      background: linear-gradient(135deg, rgba(239, 68, 68, 0.1) 0%, transparent 100%);
    }

    .deadline-item.urgent .deadline-date {
      background: var(--gradient-fire);
    }

    .deadline-date {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      width: 56px;
      height: 56px;
      background: var(--gradient-primary);
      border-radius: var(--radius-xl);
      flex-shrink: 0;
      box-shadow: var(--shadow-md);
    }

    .deadline-date .day {
      font-size: var(--text-xl);
      font-weight: 800;
      color: white;
      line-height: 1;
    }

    .deadline-date .month {
      font-size: var(--text-xs);
      color: rgba(255, 255, 255, 0.9);
      text-transform: uppercase;
      font-weight: 700;
      letter-spacing: 0.5px;
    }

    .deadline-info {
      flex: 1;
      min-width: 0;
    }

    .deadline-title {
      font-size: var(--text-sm);
      font-weight: 700;
      color: var(--text-primary);
      margin: 0 0 var(--space-1) 0;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }

    .deadline-course {
      font-size: var(--text-xs);
      color: var(--text-secondary);
      font-weight: 600;
    }
  `]
})
export class RightSidebarComponent {
  readonly TrendingIcon = TrendingUp;
  readonly UsersIcon = Users;
  readonly CalendarIcon = Calendar;
  readonly PlusIcon = Plus;

  trendingTopics = [
    { id: 1, title: 'Quantum Computing', papers: 234, gradient: 'var(--gradient-primary)' },
    { id: 2, title: 'Machine Learning Ethics', papers: 189, gradient: 'var(--gradient-secondary)' },
    { id: 3, title: 'Climate Change Models', papers: 156, gradient: 'var(--gradient-success)' }
  ];

  suggestedPeers = [
    { id: 1, name: 'Sarah Chen', department: 'Computer Science', initials: 'SC', gradient: 'var(--gradient-primary)' },
    { id: 2, name: 'Marcus Johnson', department: 'Physics', initials: 'MJ', gradient: 'var(--gradient-secondary)' },
    { id: 3, name: 'Aisha Patel', department: 'Mathematics', initials: 'AP', gradient: 'var(--gradient-success)' }
  ];

  upcomingDeadlines = [
    { id: 1, day: '23', month: 'DEC', title: 'Final Project', course: 'CS 301', urgent: true },
    { id: 2, day: '25', month: 'DEC', title: 'Research Paper', course: 'PHYS 201', urgent: false },
    { id: 3, day: '28', month: 'DEC', title: 'Lab Report', course: 'CHEM 101', urgent: false }
  ];
}
