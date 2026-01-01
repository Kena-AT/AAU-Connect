import { Component, Output, EventEmitter, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { LucideAngularModule, X, Calendar, MapPin, AlignLeft, Image } from 'lucide-angular';
import { EventStore } from '../../../../core/state/event.store';
import { EventType, CreateEventDto } from '../../../../core/models/event.model';

@Component({
  selector: 'app-create-event-modal',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, LucideAngularModule],
  template: `
    <div class="modal-overlay" (click)="close.emit()">
      <div class="modal-content glass-card" (click)="$event.stopPropagation()">
        <header class="modal-header">
          <h2>Create New Event</h2>
          <button class="btn-close" (click)="close.emit()">
            <lucide-icon [img]="CloseIcon"></lucide-icon>
          </button>
        </header>

        <form [formGroup]="eventForm" (ngSubmit)="onSubmit()">
          <div class="form-body">
            <div class="form-group">
              <label>Event Title</label>
              <input type="text" formControlName="title" placeholder="e.g. Annual Tech Symposium" />
            </div>

            <div class="form-row">
              <div class="form-group">
                <label>Event Type</label>
                <select formControlName="type">
                  <option value="workshop">Workshop</option>
                  <option value="seminar">Seminar</option>
                  <option value="social">Social</option>
                  <option value="academic">Academic</option>
                  <option value="other">Other</option>
                </select>
              </div>
              <div class="form-group">
                <label>Date & Time</label>
                <input type="datetime-local" formControlName="date" />
              </div>
            </div>

            <div class="form-group">
              <label>Location / Link</label>
              <div class="input-with-icon">
                <lucide-icon [img]="MapPinIcon" class="icon"></lucide-icon>
                <input type="text" formControlName="location" placeholder="e.g. Science Building, Room 402" />
              </div>
            </div>

            <div class="form-group">
              <label>Description</label>
              <textarea formControlName="description" rows="3" placeholder="Tell people what this event is about..."></textarea>
            </div>

            <div class="form-group">
              <label>Cover Image URL (Optional)</label>
              <input type="text" formControlName="coverImage" placeholder="https://example.com/image.jpg" />
            </div>
          </div>

          <footer class="modal-footer">
            <button type="button" class="btn-secondary" (click)="close.emit()">Cancel</button>
            <button type="submit" class="btn-primary" [disabled]="eventForm.invalid">Create Event</button>
          </footer>
        </form>
      </div>
    </div>
  `,
  styles: [`
    .modal-overlay {
      position: fixed;
      inset: 0;
      background: rgba(0,0,0,0.6);
      backdrop-filter: blur(8px);
      z-index: 1000;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: var(--space-4);
    }

    .modal-content {
      width: 100%;
      max-width: 550px;
      max-height: 90vh;
      display: flex;
      flex-direction: column;
      animation: slideUp 0.3s ease;
      background: var(--bg-card);
      border: 1px solid var(--border-glass);
      overflow: hidden;
    }

    @keyframes slideUp {
      from { opacity: 0; transform: translateY(20px); }
      to { opacity: 1; transform: translateY(0); }
    }

    .modal-header {
      padding: var(--space-6);
      border-bottom: 1px solid var(--border-glass);
      display: flex;
      justify-content: space-between;
      align-items: center;
    }

    .modal-header h2 {
      font-size: var(--text-2xl);
      font-weight: 800;
      background: var(--gradient-primary);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
    }

    .btn-close {
      background: none;
      border: none;
      color: var(--text-secondary);
      cursor: pointer;
    }

    .form-body {
      padding: var(--space-6);
      overflow-y: auto;
      display: flex;
      flex-direction: column;
      gap: var(--space-4);
    }

    .form-group {
      display: flex;
      flex-direction: column;
      gap: var(--space-2);
    }

    .form-row {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: var(--space-4);
    }

    label {
      font-size: var(--text-sm);
      font-weight: 600;
      color: var(--text-primary);
    }

    input, select, textarea {
      padding: var(--space-3);
      background: var(--bg-glass);
      border: 1px solid var(--border-glass);
      border-radius: var(--radius-lg);
      color: var(--text-primary);
      font-size: var(--text-sm);
    }

    .input-with-icon {
      position: relative;
    }

    .input-with-icon .icon {
      position: absolute;
      left: var(--space-3);
      top: 50%;
      transform: translateY(-50%);
      width: 16px;
      height: 16px;
      color: var(--primary-500);
    }

    .input-with-icon input {
      padding-left: var(--space-10);
      width: 100%;
    }

    .modal-footer {
      padding: var(--space-6);
      background: rgba(255,255,255,0.02);
      border-top: 1px solid var(--border-glass);
      display: flex;
      justify-content: flex-end;
      gap: var(--space-4);
    }

    .btn-secondary {
      padding: var(--space-3) var(--space-6);
      background: none;
      border: 1px solid var(--border-glass);
      border-radius: var(--radius-lg);
      color: var(--text-primary);
      font-weight: 600;
      cursor: pointer;
    }

    .btn-primary {
      padding: var(--space-3) var(--space-8);
      background: var(--gradient-primary);
      color: white;
      border: none;
      border-radius: var(--radius-lg);
      font-weight: 700;
      cursor: pointer;
      box-shadow: var(--shadow-lg);
    }

    .btn-primary:disabled {
      opacity: 0.5;
      cursor: not-allowed;
    }
  `]
})
export class CreateEventModalComponent {
  @Output() close = new EventEmitter<void>();

  private fb = inject(FormBuilder);
  private store = inject(EventStore);

  readonly CloseIcon = X;
  readonly MapPinIcon = MapPin;

  eventForm = this.fb.group({
    title: ['', [Validators.required, Validators.minLength(5)]],
    type: ['workshop' as EventType, Validators.required],
    date: ['', Validators.required],
    location: ['', Validators.required],
    description: ['', [Validators.required, Validators.minLength(20)]],
    visibility: ['public' as any, Validators.required],
    coverImage: ['']
  });

  onSubmit() {
    if (this.eventForm.valid) {
      const formValue = this.eventForm.value;
      const dto: CreateEventDto = {
        title: formValue.title!,
        description: formValue.description!,
        type: formValue.type as EventType,
        visibility: 'public',
        date: formValue.date!,
        location: formValue.location!,
        coverImage: formValue.coverImage || undefined
      };

      this.store.createEvent(dto);
      this.close.emit();
    }
  }
}
