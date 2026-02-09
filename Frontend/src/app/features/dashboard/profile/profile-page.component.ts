import { Component, inject, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-profile-page',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="profile-page">
      <div class="profile-header">
        <h2>User Profile</h2>
        <p>Profile ID: {{ userId() }}</p>
      </div>
      <div class="profile-content">
        <p>This is a placeholder for the user profile page. Integration with real user data coming soon.</p>
      </div>
    </div>
  `,
  styles: [`
    .profile-page {
      padding: var(--space-6);
      max-width: 800px;
      margin: 0 auto;
    }
    .profile-header {
      margin-bottom: var(--space-8);
      padding-bottom: var(--space-4);
      border-bottom: 2px solid var(--border-glass);
    }
    h2 {
      font-size: var(--text-3xl);
      font-weight: 800;
      color: var(--primary-600);
      margin-bottom: var(--space-2);
    }
  `]
})
export class ProfilePageComponent implements OnInit {
  private route = inject(ActivatedRoute);
  userId = signal<string | null>(null);

  ngOnInit() {
    this.userId.set(this.route.snapshot.paramMap.get('id'));
  }
}
