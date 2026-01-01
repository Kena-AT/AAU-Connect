import { Injectable, inject, signal, computed } from '@angular/core';
import { Event, EventType, CreateEventDto, UpdateEventDto } from '../models/event.model';
import { EventApiService } from '../api/event-api.service';

@Injectable({
  providedIn: 'root'
})
export class EventStore {
  private api = inject(EventApiService);

  // State
  private _events = signal<Event[]>([]);
  private _loading = signal<boolean>(false);
  private _error = signal<string | null>(null);

  // Readonly signals
  readonly events = this._events.asReadonly();
  readonly loading = this._loading.asReadonly();
  readonly error = this._error.asReadonly();

  // Computed
  readonly eventCount = computed(() => this._events().length);

  loadEvents() {
    this._loading.set(true);
    this.api.getEvents().subscribe({
      next: (events) => {
        this._events.set(events);
        this._loading.set(false);
      },
      error: (err) => {
        this._error.set('Failed to load events');
        this._loading.set(false);
      }
    });
  }

  createEvent(data: CreateEventDto) {
    this._loading.set(true);
    this.api.createEvent(data).subscribe({
      next: (event) => {
        this._events.update(evs => [event, ...evs]);
        this._loading.set(false);
      },
      error: () => this._loading.set(false)
    });
  }

  deleteEvent(id: string) {
    this.api.deleteEvent(id).subscribe({
      next: () => {
        this._events.update(evs => evs.filter(e => e.id !== id));
      }
    });
  }

  joinEvent(id: string) {
    this.api.joinEvent(id).subscribe({
      next: () => {
        this._events.update(evs => evs.map(e =>
          e.id === id ? { ...e, isAttending: true, attendeeCount: e.attendeeCount + 1 } : e
        ));
      }
    });
  }

  leaveEvent(id: string) {
    this.api.leaveEvent(id).subscribe({
      next: () => {
        this._events.update(evs => evs.map(e =>
          e.id === id ? { ...e, isAttending: false, attendeeCount: Math.max(0, e.attendeeCount - 1) } : e
        ));
      }
    });
  }
}
