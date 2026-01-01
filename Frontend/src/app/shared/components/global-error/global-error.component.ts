import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-global-error',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div *ngIf="message()" class="error-banner">
      <div class="content">
        <i class="icon">⚠</i>
        <span>{{ message() }}</span>
      </div>
      <button (click)="clear()" class="close-btn">&times;</button>
    </div>
  `,
  styles: [`
    .error-banner {
      position: fixed;
      bottom: 2rem;
      right: 2rem;
      background: var(--danger-500);
      color: white;
      padding: 1rem 1.5rem;
      border-radius: var(--radius-md);
      box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
      display: flex;
      align-items: center;
      gap: 1rem;
      z-index: 9999;
      animation: slide-in 0.3s ease-out;
    }
    .content {
      display: flex;
      align-items: center;
      gap: 0.5rem;
    }
    .close-btn {
      background: none;
      border: none;
      color: white;
      font-size: 1.5rem;
      cursor: pointer;
      padding: 0;
      line-height: 1;
    }
    @keyframes slide-in {
      from { transform: translateY(100%); opacity: 0; }
      to { transform: translateY(0); opacity: 1; }
    }
  `]
})
export class GlobalErrorComponent {
  // Ideally this is driven by a service
  // For now, static signal usage or injected service
  // Let's assume a simplified usage for now where parent or service controls it.
  // Actually, let's create a minimal GlobalErrorService locally for demonstration?
  // No, I'll stick to a signal that can be set externally if I expose a service, 
  // but for now I'll just make it display a static message if instantiated or driven by input.
  // BUT the plan says "GlobalErrorComponent" for uncaught errors. 
  // It's simpler if this component subscribes to an ErrorService.
  // I will omit the service logic for now and just define the UI.

  message = signal<string | null>(null);

  show(msg: string) {
    this.message.set(msg);
    setTimeout(() => this.clear(), 5000);
  }

  clear() {
    this.message.set(null);
  }
}
