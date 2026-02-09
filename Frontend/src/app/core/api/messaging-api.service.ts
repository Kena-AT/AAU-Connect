import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { Conversation, Message, CreateMessageDto, UpdateMessageDto } from '../models/messaging.model';

@Injectable({
  providedIn: 'root'
})
export class MessagingApiService {
  private http = inject(HttpClient);
  private baseUrl = '/api/messaging';

  getConversations(): Observable<Conversation[]> {
    return this.http.get<Conversation[]>(`${this.baseUrl}/conversations`);
  }

  sendMessage(dto: CreateMessageDto): Observable<Message> {
    return this.http.post<Message>(`${this.baseUrl}/messages`, dto);
  }

  deleteMessage(conversationId: string, messageId: string): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/conversations/${conversationId}/messages/${messageId}`);
  }

  updateMessage(conversationId: string, messageId: string, dto: UpdateMessageDto): Observable<Message> {
    return this.http.patch<Message>(`${this.baseUrl}/conversations/${conversationId}/messages/${messageId}`, dto);
  }

  deleteConversation(id: string): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/conversations/${id}`);
  }

  clearChat(id: string): Observable<void> {
    return this.http.post<void>(`${this.baseUrl}/conversations/${id}/clear`, {});
  }
}
