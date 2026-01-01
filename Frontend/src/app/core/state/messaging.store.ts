import { Injectable, inject, signal, computed } from '@angular/core';
import { Conversation, Message, CreateMessageDto, UpdateMessageDto } from '../models/messaging.model';
import { MessagingApiService } from '../api/messaging-api.service';

@Injectable({
  providedIn: 'root'
})
export class MessagingStore {
  private api = inject(MessagingApiService);

  // State
  private _conversations = signal<Conversation[]>([]);
  private _loading = signal<boolean>(false);
  private _activeChatId = signal<string | undefined>(undefined);

  // Readonly signals
  readonly conversations = this._conversations.asReadonly();
  readonly loading = this._loading.asReadonly();
  readonly activeChatId = this._activeChatId.asReadonly();

  // Computed
  readonly activeChat = computed(() =>
    this._conversations().find(c => c.id === this._activeChatId())
  );

  readonly totalUnread = computed(() =>
    this._conversations().reduce((acc, c) => acc + c.unreadCount, 0)
  );

  loadConversations() {
    this._loading.set(true);
    this.api.getConversations().subscribe({
      next: (convs) => {
        this._conversations.set(convs);
        this._loading.set(false);
      },
      error: () => this._loading.set(false)
    });
  }

  setActiveChat(id: string | undefined) {
    this._activeChatId.set(id);
    if (id) {
      this.markAsRead(id);
    }
  }

  sendMessage(text: string) {
    const chatId = this._activeChatId();
    if (!chatId || !text.trim()) return;

    this.api.sendMessage({ conversationId: chatId, text }).subscribe({
      next: (message) => {
        this._conversations.update(convs => convs.map(c => {
          if (c.id === chatId) {
            return {
              ...c,
              messages: [...c.messages, message],
              lastMessage: message.text,
              lastMessageTime: 'Now'
            };
          }
          return c;
        }));
      }
    });
  }

  deleteMessage(conversationId: string, messageId: string) {
    this.api.deleteMessage(conversationId, messageId).subscribe({
      next: () => {
        this._conversations.update(convs => convs.map(c => {
          if (c.id === conversationId) {
            return {
              ...c,
              messages: c.messages.filter(m => m.id !== messageId)
            };
          }
          return c;
        }));
      }
    });
  }

  updateMessage(conversationId: string, messageId: string, text: string) {
    this.api.updateMessage(conversationId, messageId, { text }).subscribe({
      next: (updatedMsg) => {
        this._conversations.update(convs => convs.map(c => {
          if (c.id === conversationId) {
            return {
              ...c,
              messages: c.messages.map(m => m.id === messageId ? { ...m, text } : m)
            };
          }
          return c;
        }));
      }
    });
  }

  deleteConversation(id: string) {
    this.api.deleteConversation(id).subscribe({
      next: () => {
        this._conversations.update(convs => convs.filter(c => c.id !== id));
        if (this._activeChatId() === id) {
          this._activeChatId.set(undefined);
        }
      }
    });
  }

  clearChat(id: string) {
    this.api.clearChat(id).subscribe({
      next: () => {
        this._conversations.update(convs => convs.map(c =>
          c.id === id ? { ...c, messages: [], lastMessage: 'Chat cleared' } : c
        ));
      }
    });
  }

  private markAsRead(id: string) {
    this._conversations.update(convs => convs.map(c =>
      c.id === id ? { ...c, unreadCount: 0 } : c
    ));
  }
}
