import { Injectable, signal, effect } from '@angular/core';

export type Theme = 'light' | 'dark';

@Injectable({
  providedIn: 'root'
})
export class UiStore {
  // Sidebar state
  private _sidebarOpen = signal<boolean>(true);
  readonly sidebarOpen = this._sidebarOpen.asReadonly();

  private _rightSidebarOpen = signal<boolean>(true);
  readonly rightSidebarOpen = this._rightSidebarOpen.asReadonly();

  // Modal states
  private _showCreatePostModal = signal<boolean>(false);
  readonly showCreatePostModal = this._showCreatePostModal.asReadonly();

  // Theme state
  private _theme = signal<Theme>(this.getInitialTheme());
  readonly theme = this._theme.asReadonly();

  constructor() {
    // Apply theme on initialization and changes
    effect(() => {
      this.applyTheme(this._theme());
    });
  }

  // Sidebar actions
  toggleSidebar() {
    this._sidebarOpen.update(open => !open);
  }

  openSidebar() {
    this._sidebarOpen.set(true);
  }

  closeSidebar() {
    this._sidebarOpen.set(false);
  }

  toggleRightSidebar() {
    this._rightSidebarOpen.update(open => !open);
  }

  // Modal actions
  toggleCreatePostModal() {
    this._showCreatePostModal.update(open => !open);
  }

  openCreatePostModal() {
    this._showCreatePostModal.set(true);
  }

  closeCreatePostModal() {
    this._showCreatePostModal.set(false);
  }

  // Theme actions
  toggleTheme() {
    this._theme.update(current => current === 'dark' ? 'light' : 'dark');
    this.saveTheme(this._theme());
  }

  setTheme(theme: Theme) {
    this._theme.set(theme);
    this.saveTheme(theme);
  }

  // Private helpers
  private getInitialTheme(): Theme {
    if (typeof window === 'undefined') return 'dark';

    // Check localStorage first
    const saved = localStorage.getItem('theme') as Theme;
    if (saved === 'light' || saved === 'dark') {
      return saved;
    }

    // Check system preference
    if (window.matchMedia('(prefers-color-scheme: light)').matches) {
      return 'light';
    }

    return 'dark';
  }

  private saveTheme(theme: Theme) {
    if (typeof window !== 'undefined') {
      localStorage.setItem('theme', theme);
    }
  }

  private applyTheme(theme: Theme) {
    if (typeof document !== 'undefined') {
      document.documentElement.setAttribute('data-theme', theme);
    }
  }
}
