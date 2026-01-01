import { Component, Input, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LucideAngularModule, Calendar, MapPin, Users, MoreVertical, Trash2, LogOut, Check, Plus } from 'lucide-angular';
import { Event, EVENT_TYPE_LABELS, EVENT_TYPE_COLORS } from '../../../../core/models/event.model';
import { EventStore } from '../../../../core/state/event.store';
import { AuthService } from '../../../../core/auth/auth.service';

@Component({
  selector: 'app-event-card',
  standalone: true,
  imports: [CommonModule, LucideAngularModule],
  template: `
    <div class="event-card glass-card">
      <!-- Date Badge Overlay -->
      <div class="date-badge">
        <span class="month">{{ event.date | date:'MMM' }}</span>
        <span class="day">{{ event.date | date:'dd' }}</span>
      </div>

      <!-- Cover Image -->
      <div class="card-cover" [style.background-image]="'url(' + (event.coverImage || 'https://images.unsplash.com/photo-1540575861501-7c00117fb3c9?q=80&w=800') + ')'">
        <div class="cover-overlay">
          <span class="type-badge" [style.background]="getTypeColor()">
            {{ getTypeLabel() }}
          </span>
          
          <div class="more-menu-container" (click)="$event.stopPropagation()">
            <button class="btn-more" (click)="showMenu.set(!showMenu())">
              <lucide-icon [img]="MoreIcon"></lucide-icon>
            </button>
            
            @if (showMenu()) {
              <div class="dropdown-menu glass-card">
                @if (event.isOwner) {
                  <button class="menu-item danger" (click)="deleteEvent()">
                    <lucide-icon [img]="DeleteIcon" class="menu-icon"></lucide-icon>
                    <span>Delete Event</span>
                  </button>
                }
                <button class="menu-item" (click)="showMenu.set(false)">
                  <span>Cancel</span>
                </button>
              </div>
            }
          </div>
        </div>
      </div>

      <!-- Content -->
      <div class="card-content">
        <h3 class="event-title">{{ event.title }}</h3>
        <p class="organizer">by {{ event.organizerName }}</p>
        
        <div class="event-details">
          <div class="detail-item">
            <lucide-icon [img]="ClockIcon" class="icon"></lucide-icon>
            <span>{{ event.date | date:'shortTime' }}</span>
          </div>
          <div class="detail-item">
            <lucide-icon [img]="LocationIcon" class="icon"></lucide-icon>
            <span>{{ event.location }}</span>
          </div>
        </div>

        <div class="card-footer">
          <div class="attendees">
            <lucide-icon [img]="UsersIcon" class="icon"></lucide-icon>
            <span>{{ event.attendeeCount }} attending</span>
          </div>
          
          <div class="actions">
            @if (event.isAttending) {
              <button class="btn-rsvp joined" (click)="leaveEvent()">
                <lucide-icon [img]="CheckIcon" class="icon"></lucide-icon>
                <span>Joined</span>
              </button>
            } @else {
              <button class="btn-rsvp join" (click)="joinEvent()">
                <lucide-icon [img]="PlusIcon" class="icon"></lucide-icon>
                <span>RSVP</span>
              </button>
            }
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .event-card {
      position: relative;
      overflow: hidden;
      transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
      padding: 0;
      display: flex;
      flex-direction: column;
    }

    .event-card:hover {
      transform: translateY(-8px);
      box-shadow: var(--shadow-xl);
    }

    .date-badge {
      position: absolute;
      top: var(--space-4);
      left: var(--space-4);
      z-index: 10;
      background: white;
      color: var(--text-primary);
      width: 50px;
      height: 55px;
      border-radius: var(--radius-lg);
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      box-shadow: var(--shadow-lg);
      font-weight: 800;
      overflow: hidden;
    }

    .date-badge .month {
      background: var(--danger-500);
      color: white;
      width: 100%;
      text-align: center;
      font-size: 10px;
      padding: 2px 0;
      text-transform: uppercase;
    }

    .date-badge .day {
      font-size: var(--text-xl);
      padding: 2px 0;
    }

    .card-cover {
      height: 180px;
      background-size: cover;
      background-position: center;
      position: relative;
    }

    .cover-overlay {
      position: absolute;
      inset: 0;
      background: linear-gradient(to bottom, rgba(0,0,0,0.2), rgba(0,0,0,0.6));
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      padding: var(--space-4);
    }

    .type-badge {
      padding: var(--space-1) var(--space-3);
      border-radius: var(--radius-full);
      color: white;
      font-size: 10px;
      font-weight: 800;
      text-transform: uppercase;
      letter-spacing: 0.05em;
    }

    .btn-more {
      width: 32px;
      height: 32px;
      border-radius: var(--radius-full);
      background: rgba(255, 255, 255, 0.2);
      backdrop-filter: blur(10px);
      border: 1px solid rgba(255, 255, 255, 0.3);
      color: white;
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
    }

    .dropdown-menu {
      position: absolute;
      top: 100%;
      right: 0;
      margin-top: var(--space-2);
      min-width: 160px;
      padding: var(--space-2);
      z-index: 20;
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
      cursor: pointer;
    }

    .menu-item.danger { color: var(--danger-500); }
    .menu-icon { width: 16px; height: 16px; }

    .card-content {
      padding: var(--space-5);
      flex-grow: 1;
      display: flex;
      flex-direction: column;
    }

    .event-title {
      font-size: var(--text-lg);
      font-weight: 800;
      margin: 0 0 4px 0;
      line-height: 1.2;
    }

    .organizer {
      font-size: var(--text-xs);
      color: var(--text-secondary);
      margin-bottom: var(--space-4);
    }

    .event-details {
      display: flex;
      flex-direction: column;
      gap: var(--space-2);
      margin-bottom: var(--space-6);
    }

    .detail-item {
      display: flex;
      align-items: center;
      gap: var(--space-2);
      font-size: var(--text-sm);
      color: var(--text-secondary);
    }

    .detail-item lucide-icon {
      width: 14px;
      height: 14px;
      color: var(--primary-500);
    }

    .card-footer {
      margin-top: auto;
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding-top: var(--space-4);
      border-top: 1px solid var(--border-glass);
    }

    .attendees {
      display: flex;
      align-items: center;
      gap: var(--space-1);
      font-size: var(--text-xs);
      color: var(--text-secondary);
    }

    .btn-rsvp {
      padding: var(--space-2) var(--space-4);
      border-radius: var(--radius-lg);
      border: none;
      font-weight: 700;
      font-size: var(--text-xs);
      cursor: pointer;
      display: flex;
      align-items: center;
      gap: var(--space-2);
      transition: all 0.2s;
    }

    .btn-rsvp.join {
      background: var(--gradient-primary);
      color: white;
    }

    .btn-rsvp.joined {
      background: var(--bg-glass);
      color: var(--success-500);
      border: 1px solid var(--success-500);
    }

    .btn-rsvp:hover {
      transform: scale(1.05);
    }
  `]
})
export class EventCardComponent {
  @Input({ required: true }) event!: Event;

  private store = inject(EventStore);

  readonly MoreIcon = MoreVertical;
  readonly DeleteIcon = Trash2;
  readonly ClockIcon = Calendar;
  readonly LocationIcon = MapPin;
  readonly UsersIcon = Users;
  readonly CheckIcon = Check;
  readonly PlusIcon = Plus;

  showMenu = signal(false);

  getTypeLabel(): string {
    return EVENT_TYPE_LABELS[this.event.type];
  }

  getTypeColor(): string {
    return EVENT_TYPE_COLORS[this.event.type];
  }

  joinEvent() {
    this.store.joinEvent(this.event.id);
  }

  leaveEvent() {
    if (confirm(`Do you want to cancel your RSVP for ${this.event.title}?`)) {
      this.store.leaveEvent(this.event.id);
    }
  }

  deleteEvent() {
    if (confirm(`Are you sure you want to delete the event: ${this.event.title}?`)) {
      this.store.deleteEvent(this.event.id);
      this.showMenu.set(false);
    }
  }
}
