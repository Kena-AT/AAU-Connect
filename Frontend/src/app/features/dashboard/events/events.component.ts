import { Component, inject, signal, OnInit, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { LucideAngularModule, Search, Plus, Calendar, Filter, Grid, List as ListIcon, Calendar as CalendarIcon, SlidersHorizontal } from 'lucide-angular';
import { EventStore } from '../../../core/state/event.store';
import { EventCardComponent } from './components/event-card.component';
import { CreateEventModalComponent } from './components/create-event-modal.component';
import { EventType } from '../../../core/models/event.model';
import { EmptyStateComponent } from '../../../shared/components/empty-state/empty-state.component';
import { LoadingSpinnerComponent } from '../../../shared/components/loading-spinner/loading-spinner.component';
@Component({
  selector: 'app-events',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    LucideAngularModule,
    EventCardComponent,
    CreateEventModalComponent,
    EmptyStateComponent,
    LoadingSpinnerComponent
  ],
  template: `
    <div class="events-page">
      <!-- Header Section -->
      <div class="page-header glass-card">
        <div class="header-main">
          <div>
            <h1 class="gradient-text">Events</h1>
            <p class="subtitle">Discover what's happening in your campus</p>
          </div>
          <button class="btn-create" (click)="showCreateModal.set(true)">
            <lucide-icon [img]="PlusIcon" class="icon"></lucide-icon>
            <span>Create Event</span>
          </button>
        </div>

        <!-- Controls Section -->
        <div class="header-controls">
          <div class="search-box">
            <lucide-icon [img]="SearchIcon" class="search-icon"></lucide-icon>
            <input 
              type="text" 
              [(ngModel)]="searchQuery" 
              placeholder="Search events, workshops, seminars..." 
              (input)="onSearch($any($event).target.value)" />
          </div>

          <div class="filter-group">
            <div class="custom-tabs">
              @for (tab of tabs; track tab.id) {
                <button 
                  class="tab-btn" 
                  [class.active]="activeTab() === tab.id"
                  (click)="activeTab.set(tab.id)">
                  {{ tab.label }}
                </button>
              }
            </div>
            
            <div class="view-toggle">
              <button class="view-btn" [class.active]="viewMode() === 'grid'" (click)="viewMode.set('grid')">
                <lucide-icon [img]="GridIcon"></lucide-icon>
              </button>
              <button class="view-btn" [class.active]="viewMode() === 'list'" (click)="viewMode.set('list')">
                <lucide-icon [img]="ListIcon"></lucide-icon>
              </button>
            </div>
          </div>
        </div>
      </div>
      
      <!-- Content Section -->
      <div class="events-main-layout">
        <div class="events-container">
          @if (store.loading()) {
            <app-loading-spinner></app-loading-spinner>
          } @else {
            <div [class]="'events-' + viewMode()">
              @for (event of filteredEvents(); track event.id) {
                <app-event-card [event]="event"></app-event-card>
              } @empty {
                <app-empty-state
                  icon="📅"
                  title="No events found"
                  message="Try adjusting your search or category filters to find what you're looking for.">
                  <button class="btn-primary" (click)="searchQuery = ''; activeTab.set('all')">
                    Clear All Filters
                  </button>
                </app-empty-state>
              }
            </div>
          }
        </div>

        <!-- Secondary Sidebar for Events Page -->
        <aside class="events-sidebar">
          <section class="widget glass-card">
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
        </aside>
      </div>

      <!-- Create Event Modal -->
      @if (showCreateModal()) {
        <app-create-event-modal (close)="showCreateModal.set(false)"></app-create-event-modal>
      }
    </div>
  `,
  styles: [`
    .events-page {
      width: 100%;
      max-width: 1300px;
      margin: 0 auto;
      padding: var(--space-6);
    }

    .page-header {
      padding: var(--space-6);
      margin-bottom: var(--space-6);
      display: flex;
      flex-direction: column;
      gap: var(--space-6);
    }

    .header-main {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
    }

    .header-main h1 {
      font-size: var(--text-4xl);
      font-weight: 900;
      margin-bottom: var(--space-1);
    }

    .subtitle {
      font-size: var(--text-base);
      color: var(--text-secondary);
      margin: 0;
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
      font-weight: 700;
      cursor: pointer;
      box-shadow: var(--shadow-lg);
      transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    }

    .btn-create:hover {
      transform: translateY(-2px);
      box-shadow: var(--shadow-xl);
    }

    .header-controls {
      display: flex;
      justify-content: space-between;
      align-items: center;
      gap: var(--space-4);
      flex-wrap: wrap;
    }

    .search-box {
      position: relative;
      flex: 1;
      min-width: 300px;
    }

    .search-icon {
      position: absolute;
      left: var(--space-4);
      top: 50%;
      transform: translateY(-50%);
      width: 20px;
      height: 20px;
      color: var(--text-secondary);
    }

    .search-box input {
      width: 100%;
      padding: var(--space-3) var(--space-4) var(--space-3) var(--space-12);
      background: var(--bg-glass);
      border: 1px solid var(--border-glass);
      border-radius: var(--radius-xl);
      color: var(--text-primary);
      font-size: var(--text-sm);
      transition: all 0.3s;
    }

    .search-box input:focus {
      outline: none;
      border-color: var(--primary-500);
      box-shadow: 0 0 0 4px rgba(99, 102, 241, 0.1);
    }

    .filter-group {
      display: flex;
      align-items: center;
      gap: var(--space-4);
    }

    .custom-tabs {
      display: flex;
      background: var(--bg-glass);
      padding: 4px;
      border-radius: var(--radius-xl);
      border: 1px solid var(--border-glass);
    }

    .tab-btn {
      padding: var(--space-2) var(--space-4);
      border-radius: var(--radius-lg);
      border: none;
      background: none;
      color: var(--text-secondary);
      font-size: var(--text-xs);
      font-weight: 600;
      cursor: pointer;
      transition: all 0.2s;
    }

    .tab-btn.active {
      background: var(--bg-card);
      color: var(--text-primary);
      box-shadow: var(--shadow-sm);
    }

    .view-toggle {
      display: flex;
      gap: var(--space-1);
    }

    .view-btn {
      width: 40px;
      height: 40px;
      display: flex;
      align-items: center;
      justify-content: center;
      border-radius: var(--radius-lg);
      background: var(--bg-glass);
      border: 1px solid var(--border-glass);
      color: var(--text-secondary);
      cursor: pointer;
      transition: all 0.2s;
    }

    .view-btn.active {
      background: var(--primary-500);
      color: white;
      border-color: transparent;
    }

    .events-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
      gap: var(--space-6);
    }

    .events-list {
      display: flex;
      flex-direction: column;
      gap: var(--space-4);
    }

    .events-main-layout {
      display: grid;
      grid-template-columns: 1fr 320px;
      gap: var(--space-8);
      align-items: flex-start;
    }

    .events-sidebar {
      display: flex;
      flex-direction: column;
      gap: var(--space-6);
    }

    .widget {
      padding: var(--space-6);
    }

    .widget-header {
      display: flex;
      align-items: center;
      gap: var(--space-3);
      margin-bottom: var(--space-4);
    }

    .widget-icon {
      width: 20px;
      height: 20px;
      color: var(--primary-500);
    }

    .widget-title {
      font-size: var(--text-sm);
      font-weight: 700;
      color: var(--text-primary);
    }

    .deadlines-list {
      display: flex;
      flex-direction: column;
      gap: var(--space-3);
    }

    .deadline-item {
      display: flex;
      gap: var(--space-3);
      padding: var(--space-3);
      border-radius: var(--radius-xl);
      border-left: 4px solid var(--primary-500);
    }

    .deadline-item.urgent {
      border-left-color: var(--danger-500);
      background: rgba(239, 68, 68, 0.05);
    }

    .deadline-date {
      width: 44px;
      height: 44px;
      background: var(--gradient-primary);
      border-radius: var(--radius-lg);
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      color: white;
      flex-shrink: 0;
    }

    .deadline-date .day {
      font-size: var(--text-lg);
      font-weight: 800;
      line-height: 1;
    }

    .deadline-date .month {
      font-size: 10px;
      font-weight: 700;
    }

    .deadline-info {
      flex: 1;
      min-width: 0;
    }

    .deadline-title {
      font-size: var(--text-xs);
      font-weight: 700;
      color: var(--text-primary);
      margin: 0;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }

    .deadline-course {
      font-size: 10px;
      color: var(--text-secondary);
    }

    @media (max-width: 1200px) {
      .events-main-layout {
        grid-template-columns: 1fr;
      }
      .events-sidebar {
        display: none;
      }
    }
  `]
})
export class EventsComponent implements OnInit {
  store = inject(EventStore);

  readonly PlusIcon = Plus;
  readonly SearchIcon = Search;
  readonly GridIcon = Grid;
  readonly ListIcon = ListIcon;
  readonly CalendarIcon = CalendarIcon;

  searchQuery = '';
  activeTab = signal<'all' | EventType>('all');
  viewMode = signal<'grid' | 'list'>('grid');
  showCreateModal = signal(false);

  upcomingDeadlines = [
    { id: 1, day: '23', month: 'DEC', title: 'Final Project', course: 'CS 301', urgent: true },
    { id: 2, day: '25', month: 'DEC', title: 'Research Paper', course: 'PHYS 201', urgent: false },
    { id: 3, day: '28', month: 'DEC', title: 'Lab Report', course: 'CHEM 101', urgent: false }
  ];

  tabs = [
    { id: 'all' as const, label: 'All Events' },
    { id: 'workshop' as const, label: 'Workshops' },
    { id: 'seminar' as const, label: 'Seminars' },
    { id: 'social' as const, label: 'Social' },
    { id: 'academic' as const, label: 'Academic' }
  ] as const;

  filteredEvents = computed(() => {
    let events = this.store.events();
    const query = this.searchQuery.toLowerCase().trim();
    const tab = this.activeTab();

    if (tab !== 'all') {
      events = events.filter(e => e.type === tab);
    }

    if (query) {
      events = events.filter(e =>
        e.title.toLowerCase().includes(query) ||
        e.description.toLowerCase().includes(query) ||
        e.location.toLowerCase().includes(query) ||
        e.organizerName.toLowerCase().includes(query)
      );
    }

    return events;
  });

  ngOnInit() {
    this.store.loadEvents();
  }

  onSearch(query: string) {
    this.searchQuery = query;
  }
}
