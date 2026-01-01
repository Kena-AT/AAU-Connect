import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { Conversation, Message, CreateMessageDto, UpdateMessageDto } from '../models/messaging.model';

@Injectable({
  providedIn: 'root'
})
export class MessagingApiService {
  private mockConversations: Conversation[] = [
    {
      id: '1',
      name: 'Dr. Sarah Johnson',
      initials: 'SJ',
      gradient: 'var(--gradient-primary)',
      lastMessage: 'Let me know if you have questions about the assignment.',
      lastMessageTime: '10:45 AM',
      unreadCount: 2,
      online: true,
      messages: [
        { id: '1', text: 'Hi! I reviewed your project proposal.', senderId: '1', timestamp: new Date(Date.now() - 3600000), isMe: false, status: 'read' },
        { id: '2', text: 'It looks very promising.', senderId: '1', timestamp: new Date(Date.now() - 3500000), isMe: false, status: 'read' },
        { id: '3', text: 'Thank you, professor. I appreciate the feedback!', senderId: 'me', timestamp: new Date(Date.now() - 3000000), isMe: true, status: 'read' },
        { id: '4', text: 'Let me know if you have questions about the assignment.', senderId: '1', timestamp: new Date(), isMe: false, status: 'delivered' }
      ]
    },
    {
      id: '2',
      name: 'Quantum Group',
      initials: 'QG',
      gradient: 'var(--gradient-secondary)',
      lastMessage: 'Marcus: I found a great resource for the lab!',
      lastMessageTime: 'Yesterday',
      unreadCount: 0,
      online: false,
      messages: []
    },
    {
      id: '3',
      name: 'Marcus Chen',
      initials: 'MC',
      gradient: 'var(--gradient-success)',
      lastMessage: 'Are we meeting today?',
      lastMessageTime: '2h ago',
      unreadCount: 1,
      online: true,
      messages: []
    }
  ];

  getConversations(): Observable<Conversation[]> {
    return of([...this.mockConversations]);
  }

  sendMessage(dto: CreateMessageDto): Observable<Message> {
    const newMessage: Message = {
      id: Math.random().toString(36).substr(2, 9),
      text: dto.text,
      senderId: 'me',
      timestamp: new Date(),
      isMe: true,
      status: 'sent'
    };
    return of(newMessage);
  }

  deleteMessage(conversationId: string, messageId: string): Observable<void> {
    return of(undefined);
  }

  updateMessage(conversationId: string, messageId: string, dto: UpdateMessageDto): Observable<Message> {
    // Mock update
    return of({} as Message);
  }

  deleteConversation(id: string): Observable<void> {
    return of(undefined);
  }

  clearChat(id: string): Observable<void> {
    return of(undefined);
  }
}
