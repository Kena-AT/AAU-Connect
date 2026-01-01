import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { Event, CreateEventDto, UpdateEventDto } from '../models/event.model';

@Injectable({
  providedIn: 'root'
})
export class EventApiService {
  private http = inject(HttpClient);
  private baseUrl = '/api/events';

  // Mock data for initial development
  private mockEvents: Event[] = [
    {
      id: '1',
      title: 'AI in Education Workshop',
      description: 'Explore how AI tools are transforming the learning experience. Hands-on sessions included.',
      type: 'workshop',
      visibility: 'public',
      date: new Date(Date.now() + 86400000 * 2), // 2 days from now
      location: 'Main Hall A',
      organizerId: 'admin',
      organizerName: 'Tech Club',
      coverImage: 'https://images.unsplash.com/photo-1591453089816-0fbb971b454c?q=80&w=800',
      attendeeCount: 45,
      isAttending: false,
      isOwner: false,
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      id: '2',
      title: 'Quantum Computing Seminar',
      description: 'A deep dive into the physics and future of quantum computing systems.',
      type: 'seminar',
      visibility: 'public',
      date: new Date(Date.now() + 86400000 * 5),
      location: 'Physics Lab 3',
      organizerId: '2',
      organizerName: 'Physics Dept',
      coverImage: 'https://images.unsplash.com/photo-1635070041078-e363dbe005cb?q=80&w=800',
      attendeeCount: 120,
      isAttending: true,
      isOwner: false,
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      id: '3',
      title: 'Graduate Mixer 2024',
      description: 'Networking and evening social for all graduating students.',
      type: 'social',
      visibility: 'public',
      date: new Date(Date.now() + 86400000 * 10),
      location: 'Student Lounge',
      organizerId: 'me',
      organizerName: 'Student Union',
      coverImage: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?q=80&w=800',
      attendeeCount: 230,
      isAttending: false,
      isOwner: true,
      createdAt: new Date(),
      updatedAt: new Date()
    }
  ];

  getEvents(): Observable<Event[]> {
    // Return mock data for now
    return of(this.mockEvents);
  }

  createEvent(data: CreateEventDto): Observable<Event> {
    const newEvent: Event = {
      id: Math.random().toString(36).substr(2, 9),
      ...data,
      date: new Date(data.date),
      organizerId: 'me',
      organizerName: 'Me',
      attendeeCount: 1,
      isAttending: true,
      isOwner: true,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    this.mockEvents.push(newEvent);
    return of(newEvent);
  }

  updateEvent(id: string, data: UpdateEventDto): Observable<Event> {
    const index = this.mockEvents.findIndex(e => e.id === id);
    if (index !== -1) {
      this.mockEvents[index] = { ...this.mockEvents[index], ...data, date: data.date ? new Date(data.date) : this.mockEvents[index].date };
      return of(this.mockEvents[index]);
    }
    throw new Error('Event not found');
  }

  deleteEvent(id: string): Observable<void> {
    this.mockEvents = this.mockEvents.filter(e => e.id !== id);
    return of(undefined);
  }

  joinEvent(id: string): Observable<void> {
    const event = this.mockEvents.find(e => e.id === id);
    if (event) {
      event.isAttending = true;
      event.attendeeCount++;
    }
    return of(undefined);
  }

  leaveEvent(id: string): Observable<void> {
    const event = this.mockEvents.find(e => e.id === id);
    if (event && event.attendeeCount > 0) {
      event.isAttending = false;
      event.attendeeCount--;
    }
    return of(undefined);
  }
}
