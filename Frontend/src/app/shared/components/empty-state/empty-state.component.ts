import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-empty-state',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="empty-state">
      <div class="icon-wrapper" *ngIf="icon">
        <i [class]="icon"></i>
      </div>
      <h3>{{ title }}</h3>
      <p>{{ message }}</p>
      <ng-content select="[action]"></ng-content>
    </div>
  `,
  styles: [`
    .empty-state {
      text-align: center;
      padding: 3rem 1rem;
      color: var(--text-secondary);
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 1rem;
    }
    .icon-wrapper {
      font-size: 3rem;
      margin-bottom: 0.5rem;
      color: var(--neutral-300);
    }
    h3 {
      font-size: var(--text-lg);
      font-weight: 600;
      color: var(--text-primary);
    }
    p {
      max-width: 400px;
      margin: 0 auto;
    }
  `]
})
export class EmptyStateComponent {
  @Input() title: string = 'No Data Found';
  @Input() message: string = 'There is nothing to display here yet.';
  @Input() icon?: string;
}
