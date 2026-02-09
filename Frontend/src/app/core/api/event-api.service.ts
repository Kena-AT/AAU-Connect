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

  // --- Events API ---
  getEvents(): Observable<Event[]> {
    return this.http.get<Event[]>(this.baseUrl);
  }

  createEvent(data: CreateEventDto): Observable<Event> {
    return this.http.post<Event>(this.baseUrl, data);
  }

  updateEvent(id: string, data: UpdateEventDto): Observable<Event> {
    return this.http.patch<Event>(`${this.baseUrl}/${id}`, data);
  }

  deleteEvent(id: string): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`);
  }

  joinEvent(id: string): Observable<void> {
    return this.http.post<void>(`${this.baseUrl}/${id}/join`, {});
  }

  leaveEvent(id: string): Observable<void> {
    return this.http.post<void>(`${this.baseUrl}/${id}/leave`, {});
  }
}
