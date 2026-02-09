import { Component, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { LucideAngularModule, Search, User, Users, BookOpen, Calendar, X } from 'lucide-angular';
import { Router } from '@angular/router';

@Component({
  selector: 'app-search',
  standalone: true,
  imports: [CommonModule, FormsModule, LucideAngularModule],
  template: `
    <div class="search-page">
      <div class="search-header">
        <div class="search-input-container">
          <lucide-icon [img]="SearchIcon" class="search-icon"></lucide-icon>
          <input 
            type="text" 
            [(ngModel)]="searchQuery"
            (input)="onSearch()"
            placeholder="Search courses, people, groups, events..."
            class="search-input"
            autofocus />
          <button class="btn-close" (click)="close()">
            <lucide-icon [img]="CloseIcon"></lucide-icon>
          </button>
        </div>

        <div class="search-filters">
          <button 
            *ngFor="let filter of filters"
            class="filter-btn"
            [class.active]="activeFilter() === filter.value"
            (click)="setFilter(filter.value)">
            <lucide-icon [img]="filter.icon"></lucide-icon>
            <span>{{ filter.label }}</span>
          </button>
        </div>
      </div>

      <div class="search-results">
        @if (searchQuery.length === 0) {
          <div class="empty-state">
            <lucide-icon [img]="SearchIcon" class="empty-icon"></lucide-icon>
            <h3>Start searching</h3>
            <p>Search for courses, people, groups, or events</p>
          </div>
        } @else if (isSearching()) {
          <div class="loading">Searching...</div>
        } @else if (results().length === 0) {
          <div class="empty-state">
            <h3>No results found</h3>
            <p>Try adjusting your search terms</p>
          </div>
        } @else {
          <div class="results-list">
            @for (result of filteredResults(); track result.id) {
              <div class="result-item" (click)="selectResult(result)">
                <div class="result-icon" [style.background]="result.color">
                  <lucide-icon [img]="getIcon(result.type)"></lucide-icon>
                </div>
                <div class="result-content">
                  <h4>{{ result.title }}</h4>
                  <p>{{ result.description }}</p>
                  <span class="result-type">{{ result.type }}</span>
                </div>
              </div>
            }
          </div>
        }
      </div>
    </div>
  `,
  styles: [`
    .search-page {
      width: 100%;
      height: 100vh;
      display: flex;
      flex-direction: column;
      background: var(--bg-app);
    }

    .search-header {
      padding: var(--space-6);
      background: var(--bg-card);
      border-bottom: 1px solid var(--border-glass);
      box-shadow: var(--shadow-md);
    }

    .search-input-container {
      display: flex;
      align-items: center;
      gap: var(--space-3);
      padding: var(--space-4);
      background: var(--bg-glass);
      border: 2px solid var(--border-glass);
      border-radius: var(--radius-2xl);
      margin-bottom: var(--space-4);
      transition: all var(--transition-base);
    }

    .search-input-container:focus-within {
      border-color: var(--primary-500);
      box-shadow: 0 0 0 3px rgba(99, 102, 241, 0.1);
    }

    .search-icon {
      width: 24px;
      height: 24px;
      color: var(--text-secondary);
      flex-shrink: 0;
    }

    .search-input {
      flex: 1;
      border: none;
      background: transparent;
      color: var(--text-primary);
      font-size: var(--text-lg);
      font-weight: 500;
      outline: none;
    }

    .search-input::placeholder {
      color: var(--text-secondary);
    }

    .btn-close {
      width: 36px;
      height: 36px;
      background: var(--bg-glass);
      border: none;
      border-radius: var(--radius-lg);
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      transition: all var(--transition-base);
      flex-shrink: 0;
    }

    .btn-close:hover {
      background: var(--danger-500);
      color: white;
      transform: rotate(90deg);
    }

    .search-filters {
      display: flex;
      gap: var(--space-2);
      overflow-x: auto;
    }

    .filter-btn {
      display: flex;
      align-items: center;
      gap: var(--space-2);
      padding: var(--space-2) var(--space-4);
      background: var(--bg-glass);
      border: 2px solid var(--border-glass);
      border-radius: var(--radius-xl);
      color: var(--text-secondary);
      font-weight: 600;
      font-size: var(--text-sm);
      cursor: pointer;
      transition: all var(--transition-base);
      white-space: nowrap;
    }

    .filter-btn:hover {
      background: var(--bg-card);
      transform: translateY(-2px);
    }

    .filter-btn.active {
      background: var(--gradient-primary);
      color: white;
      border-color: transparent;
    }

    .search-results {
      flex: 1;
      overflow-y: auto;
      padding: var(--space-6);
    }

    .empty-state {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      padding: var(--space-16);
      text-align: center;
    }

    .empty-icon {
      width: 64px;
      height: 64px;
      color: var(--text-secondary);
      margin-bottom: var(--space-4);
      opacity: 0.5;
    }

    .empty-state h3 {
      font-size: var(--text-xl);
      font-weight: 700;
      margin-bottom: var(--space-2);
    }

    .empty-state p {
      color: var(--text-secondary);
    }

    .loading {
      text-align: center;
      padding: var(--space-8);
      color: var(--text-secondary);
      font-weight: 600;
    }

    .results-list {
      display: flex;
      flex-direction: column;
      gap: var(--space-3);
      max-width: 800px;
      margin: 0 auto;
    }

    .result-item {
      display: flex;
      gap: var(--space-4);
      padding: var(--space-4);
      background: var(--bg-card);
      border: 1px solid var(--border-glass);
      border-radius: var(--radius-xl);
      cursor: pointer;
      transition: all var(--transition-base);
    }

    .result-item:hover {
      background: var(--bg-glass);
      transform: translateY(-2px);
      box-shadow: var(--shadow-lg);
    }

    .result-icon {
      width: 48px;
      height: 48px;
      border-radius: var(--radius-lg);
      display: flex;
      align-items: center;
      justify-content: center;
      flex-shrink: 0;
    }

    .result-icon lucide-icon {
      width: 24px;
      height: 24px;
      color: white;
    }

    .result-content {
      flex: 1;
    }

    .result-content h4 {
      font-size: var(--text-base);
      font-weight: 700;
      margin: 0 0 var(--space-1) 0;
    }

    .result-content p {
      font-size: var(--text-sm);
      color: var(--text-secondary);
      margin: 0 0 var(--space-2) 0;
    }

    .result-type {
      display: inline-block;
      padding: var(--space-1) var(--space-2);
      background: var(--bg-glass);
      border-radius: var(--radius-md);
      font-size: var(--text-xs);
      font-weight: 600;
      color: var(--text-secondary);
      text-transform: uppercase;
    }
  `]
})
export class SearchComponent {
  private router = inject(Router);

  readonly SearchIcon = Search;
  readonly UserIcon = User;
  readonly UsersIcon = Users;
  readonly BookIcon = BookOpen;
  readonly CalendarIcon = Calendar;
  readonly CloseIcon = X;

  searchQuery = '';
  activeFilter = signal<string>('all');
  isSearching = signal(false);
  results = signal<any[]>([]);

  filters = [
    { label: 'All', value: 'all', icon: Search },
    { label: 'People', value: 'people', icon: User },
    { label: 'Groups', value: 'groups', icon: Users },
    { label: 'Courses', value: 'courses', icon: BookOpen },
    { label: 'Events', value: 'events', icon: Calendar }
  ];


  filteredResults = signal<any[]>([]);

  onSearch() {
    if (this.searchQuery.length === 0) {
      this.results.set([]);
      this.filteredResults.set([]);
      return;
    }

    this.isSearching.set(true);

    // TODO: Integrate with real Search API
    this.results.set([]);
    this.filteredResults.set([]);
    this.isSearching.set(false);
  }

  setFilter(filter: string) {
    this.activeFilter.set(filter);
    this.applyFilter();
  }

  applyFilter() {
    if (this.activeFilter() === 'all') {
      this.filteredResults.set(this.results());
    } else {
      this.filteredResults.set(this.results().filter(r => r.type === this.activeFilter()));
    }
  }

  getIcon(type: string) {
    switch (type) {
      case 'people': return this.UserIcon;
      case 'groups': return this.UsersIcon;
      case 'courses': return this.BookIcon;
      case 'events': return this.CalendarIcon;
      default: return this.SearchIcon;
    }
  }

  selectResult(result: any) {
    console.log('Selected:', result);
    // Navigate based on type
    // this.router.navigate([`/dashboard/${result.type}/${result.id}`]);
  }

  close() {
    window.history.back();
  }
}
