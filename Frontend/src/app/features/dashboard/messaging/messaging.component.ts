import { Component, signal, computed, inject, OnInit, ViewChild, ElementRef, AfterViewChecked } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { LucideAngularModule, Search, Send, MoreVertical, Phone, Video, Paperclip, Smile, Circle, Trash2, Edit2, Eraser, Check, X } from 'lucide-angular';
import { MessagingStore } from '../../../core/state/messaging.store';
import { Message, Conversation } from '../../../core/models/messaging.model';

@Component({
  selector: 'app-messaging',
  standalone: true,
  imports: [CommonModule, LucideAngularModule, FormsModule],
  template: `
    <div class="messaging-container glass-card">
      <!-- Conversations Sidebar -->
      <aside class="sidebar" [class.hidden]="store.activeChatId()">
        <div class="sidebar-header">
          <h1>Messages</h1>
          <div class="search-bar">
            <lucide-icon [img]="SearchIcon" class="search-icon"></lucide-icon>
            <input type="text" placeholder="Search chats..." [ngModel]="searchQuery()" (ngModelChange)="searchQuery.set($event)" />
          </div>
        </div>

        <div class="conversations-list">
          @for (conv of filteredConversations(); track conv.id) {
            <div 
              class="conversation-item" 
              [class.active]="store.activeChatId() === conv.id"
              (click)="selectConversation(conv.id)"
            >
              <div class="avatar-container">
                <div class="avatar gradient-text" [style.background]="conv.gradient">
                  {{ conv.initials }}
                </div>
                @if (conv.online) {
                  <lucide-icon [img]="CircleIcon" class="online-status"></lucide-icon>
                }
              </div>
              <div class="conv-info">
                <div class="conv-header">
                  <span class="name">{{ conv.name }}</span>
                  <span class="time">{{ conv.lastMessageTime }}</span>
                </div>
                <div class="conv-footer">
                  <span class="preview">{{ conv.lastMessage }}</span>
                  @if (conv.unreadCount > 0) {
                    <span class="badge">{{ conv.unreadCount }}</span>
                  }
                </div>
              </div>
            </div>
          }
        </div>
      </aside>

      <!-- Active Chat Window -->
      <main class="chat-window" [class.active]="store.activeChatId()">
        @if (store.activeChat(); as chat) {
          <header class="chat-header">
            <div class="contact-info">
              <button class="back-btn" (click)="store.setActiveChat(undefined)">
                 &larr;
              </button>
              <div class="avatar gradient-text" [style.background]="chat.gradient">
                {{ chat.initials }}
              </div>
              <div class="details">
                <h2>{{ chat.name }}</h2>
                <span class="status">{{ chat.online ? 'Online' : 'Offline' }}</span>
              </div>
            </div>
            <div class="actions">
              <button class="icon-btn"><lucide-icon [img]="PhoneIcon"></lucide-icon></button>
              <button class="icon-btn"><lucide-icon [img]="VideoIcon"></lucide-icon></button>
              
              <div class="dropdown-container">
                <button class="icon-btn" (click)="toggleConvMenu($event)">
                  <lucide-icon [img]="MoreIcon"></lucide-icon>
                </button>
                @if (showConvMenu()) {
                  <div class="dropdown-menu glass-card">
                    <button class="menu-item" (click)="clearChat(chat.id)">
                      <lucide-icon [img]="EraserIcon" class="menu-icon"></lucide-icon>
                      <span>Clear Chat</span>
                    </button>
                    <button class="menu-item danger" (click)="deleteConv(chat.id)">
                      <lucide-icon [img]="TrashIcon" class="menu-icon"></lucide-icon>
                      <span>Delete Conversation</span>
                    </button>
                  </div>
                }
              </div>
            </div>
          </header>

          <div class="messages-area" #scrollContainer>
            @for (msg of chat.messages; track msg.id) {
              <div class="message-row" [class.me]="msg.isMe">
                <div class="message-content-wrapper">
                  <div class="message-bubble">
                    @if (editingMessageId() === msg.id) {
                      <div class="edit-mode">
                        <textarea [(ngModel)]="editText" (keyup.enter)="saveEdit(chat.id, msg.id)" (keyup.esc)="cancelEdit()"></textarea>
                        <div class="edit-actions">
                          <button (click)="saveEdit(chat.id, msg.id)"><lucide-icon [img]="CheckIcon"></lucide-icon></button>
                          <button (click)="cancelEdit()"><lucide-icon [img]="XIcon"></lucide-icon></button>
                        </div>
                      </div>
                    } @else {
                      <p>{{ msg.text }}</p>
                    }
                    <span class="timestamp">{{ msg.timestamp | date:'shortTime' }}</span>
                  </div>

                  @if (!editingMessageId()) {
                    <button class="msg-more" (click)="toggleMsgMenu(msg.id, $event)">
                      <lucide-icon [img]="MoreIcon"></lucide-icon>
                    </button>
                  }

                  @if (activeMsgMenuId() === msg.id) {
                    <div class="msg-dropdown glass-card">
                      @if (msg.isMe) {
                        <button (click)="startEdit(msg)">
                          <lucide-icon [img]="EditIcon" class="icon-sm"></lucide-icon>
                          <span>Edit</span>
                        </button>
                      }
                      <button class="danger" (click)="deleteMessage(chat.id, msg.id)">
                        <lucide-icon [img]="TrashIcon" class="icon-sm"></lucide-icon>
                        <span>Delete</span>
                      </button>
                    </div>
                  }
                </div>
              </div>
            }
          </div>

          <footer class="chat-input-area">
            <button class="icon-btn"><lucide-icon [img]="PaperclipIcon"></lucide-icon></button>
            <div class="input-wrapper">
              <input 
                type="text" 
                placeholder="Type a message..." 
                [(ngModel)]="newMessageText"
                (keyup.enter)="sendMessage()"
              />
              <button class="emoji-btn"><lucide-icon [img]="SmileIcon"></lucide-icon></button>
            </div>
            <button class="send-btn" [disabled]="!newMessageText.trim()" (click)="sendMessage()">
              <lucide-icon [img]="SendIcon"></lucide-icon>
            </button>
          </footer>
        } @else {
          <div class="no-chat">
            <div class="illustration">💬</div>
            <h2>Your Messages</h2>
            <p>Select a conversation to start messaging</p>
          </div>
        }
      </main>
    </div>
  `,
  styles: [`
    .messaging-container {
      display: flex;
      height: calc(100vh - 120px);
      overflow: hidden;
      background: var(--bg-glass);
      border: 1px solid var(--border-glass);
      border-radius: var(--radius-2xl);
    }

    .sidebar {
      width: 350px;
      border-right: 1px solid var(--border-glass);
      display: flex;
      flex-direction: column;
      background: rgba(255, 255, 255, 0.02);
    }

    .sidebar-header {
      padding: var(--space-6);
      border-bottom: 1px solid var(--border-glass);
    }

    .sidebar-header h1 {
      font-size: var(--text-2xl);
      font-weight: 800;
      margin-bottom: var(--space-4);
      background: var(--gradient-primary);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
    }

    .search-bar {
      position: relative;
      background: var(--bg-glass);
      border: 1px solid var(--border-glass);
      border-radius: var(--radius-xl);
      display: flex;
      align-items: center;
      padding: 0 var(--space-4);
    }

    .search-icon {
      width: 18px;
      height: 18px;
      color: var(--text-secondary);
    }

    .search-bar input {
      background: transparent;
      border: none;
      padding: var(--space-3);
      color: var(--text-primary);
      width: 100%;
      font-size: var(--text-sm);
    }

    .search-bar input:focus {
      outline: none;
    }

    .conversations-list {
      flex: 1;
      overflow-y: auto;
      padding: var(--space-2);
    }

    .conversation-item {
      display: flex;
      align-items: center;
      gap: var(--space-4);
      padding: var(--space-4);
      border-radius: var(--radius-xl);
      cursor: pointer;
      transition: all var(--transition-base);
      margin-bottom: var(--space-1);
    }

    .conversation-item:hover {
      background: var(--bg-card);
    }

    .conversation-item.active {
      background: var(--primary-500);
      color: white;
    }

    .conversation-item.active .preview, 
    .conversation-item.active .time,
    .conversation-item.active .name {
      color: white;
      opacity: 0.9;
    }

    .avatar-container {
      position: relative;
    }

    .avatar {
      width: 54px;
      height: 54px;
      border-radius: var(--radius-full);
      display: flex;
      align-items: center;
      justify-content: center;
      font-weight: 800;
      color: white;
      font-size: var(--text-xl);
      box-shadow: var(--shadow-md);
      border: 2px solid var(--bg-card);
    }

    .online-status {
      position: absolute;
      bottom: 2px;
      right: 2px;
      width: 12px;
      height: 12px;
      fill: var(--success-500);
      color: var(--success-500);
      background: var(--bg-card);
      border-radius: var(--radius-full);
    }

    .conv-info {
      flex: 1;
      min-width: 0;
    }

    .conv-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 2px;
    }

    .name {
      font-weight: 700;
      font-size: var(--text-base);
    }

    .time {
      font-size: var(--text-xs);
      color: var(--text-secondary);
    }

    .conv-footer {
      display: flex;
      justify-content: space-between;
      align-items: center;
    }

    .preview {
      font-size: var(--text-sm);
      color: var(--text-secondary);
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
      flex: 1;
    }

    .badge {
      background: var(--gradient-primary);
      color: white;
      font-size: 10px;
      font-weight: 800;
      min-width: 18px;
      height: 18px;
      padding: 0 5px;
      border-radius: var(--radius-full);
      display: flex;
      align-items: center;
      justify-content: center;
      margin-left: var(--space-2);
    }

    .chat-window {
      flex: 1;
      display: flex;
      flex-direction: column;
      background: rgba(255, 255, 255, 0.01);
    }

    .chat-header {
      padding: var(--space-4) var(--space-6);
      border-bottom: 1px solid var(--border-glass);
      display: flex;
      justify-content: space-between;
      align-items: center;
      background: var(--bg-glass);
    }

    .contact-info {
      display: flex;
      align-items: center;
      gap: var(--space-4);
    }

    .back-btn {
      display: none;
      background: none;
      border: none;
      font-size: 24px;
      color: var(--text-primary);
      cursor: pointer;
    }

    .details h2 {
      font-size: var(--text-lg);
      font-weight: 800;
      margin: 0;
    }

    .status {
      font-size: var(--text-xs);
      color: var(--success-500);
      font-weight: 600;
    }

    .actions {
      display: flex;
      gap: var(--space-2);
    }

    .icon-btn {
      width: 40px;
      height: 40px;
      border-radius: var(--radius-lg);
      border: none;
      background: var(--bg-glass);
      color: var(--text-secondary);
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      transition: all var(--transition-base);
    }

    .icon-btn:hover {
      background: var(--bg-card);
      color: var(--primary-500);
      transform: translateY(-2px);
    }

    .messages-area {
      flex: 1;
      overflow-y: auto;
      padding: var(--space-6);
      display: flex;
      flex-direction: column;
      gap: var(--space-4);
      background: url('https://www.transparenttextures.com/patterns/cubes.png');
      opacity: 0.95;
    }

    .message-row {
      display: flex;
      flex-direction: column;
      align-items: flex-start;
      max-width: 80%;
    }

    .message-row.me {
      align-items: flex-end;
      align-self: flex-end;
    }

    .message-content-wrapper {
      display: flex;
      align-items: center;
      gap: var(--space-2);
      max-width: 100%;
      position: relative;
    }

    .me .message-content-wrapper {
      flex-direction: row-reverse;
    }

    .message-bubble {
      padding: var(--space-3) var(--space-5);
      border-radius: var(--radius-2xl);
      background: var(--bg-card);
      border: 1px solid var(--border-glass);
      position: relative;
      box-shadow: var(--shadow-sm);
      max-width: 100%;
    }

    .me .message-bubble {
      background: var(--gradient-primary);
      color: white;
      border: none;
      border-bottom-right-radius: var(--radius-sm);
      box-shadow: var(--shadow-lg);
    }

    .message-row:not(.me) .message-bubble {
      border-bottom-left-radius: var(--radius-sm);
    }

    .message-bubble p {
      margin: 0;
      font-size: var(--text-sm);
      line-height: 1.5;
      font-weight: 500;
    }

    .edit-mode textarea {
      background: rgba(255, 255, 255, 0.1);
      border: 1px solid rgba(255, 255, 255, 0.2);
      border-radius: var(--radius-md);
      color: white;
      padding: var(--space-2);
      width: 100%;
      min-width: 200px;
      font-family: inherit;
      font-size: var(--text-sm);
      resize: vertical;
    }

    .edit-actions {
      display: flex;
      justify-content: flex-end;
      gap: var(--space-2);
      margin-top: var(--space-2);
    }

    .edit-actions button {
      background: rgba(255, 255, 255, 0.2);
      border: none;
      color: white;
      padding: 4px;
      border-radius: var(--radius-sm);
      cursor: pointer;
    }

    .msg-more {
      opacity: 0;
      background: none;
      border: none;
      color: var(--text-secondary);
      cursor: pointer;
      padding: 4px;
      transition: opacity 0.2s;
    }

    .message-content-wrapper:hover .msg-more {
      opacity: 1;
    }

    .msg-dropdown {
      position: absolute;
      top: 0;
      left: 100%;
      margin-left: 8px;
      background: var(--bg-card);
      border: 1px solid var(--border-glass);
      border-radius: var(--radius-lg);
      padding: var(--space-1);
      z-index: 100;
      display: flex;
      flex-direction: column;
      box-shadow: var(--shadow-xl);
    }

    .me .msg-dropdown {
      left: auto;
      right: 100%;
      margin-left: 0;
      margin-right: 8px;
    }

    .msg-dropdown button {
      display: flex;
      align-items: center;
      gap: var(--space-2);
      padding: var(--space-2) var(--space-3);
      border: none;
      background: none;
      color: var(--text-primary);
      font-size: var(--text-xs);
      cursor: pointer;
      border-radius: var(--radius-md);
      white-space: nowrap;
    }

    .msg-dropdown button:hover {
      background: var(--bg-glass);
    }

    .msg-dropdown button.danger {
      color: var(--danger-500);
    }

    .icon-sm {
      width: 14px;
      height: 14px;
    }

    .timestamp {
      font-size: 10px;
      opacity: 0.6;
      margin-top: 4px;
      display: block;
      text-align: right;
    }

    /* Dropdown Menus */
    .dropdown-container {
      position: relative;
    }

    .dropdown-menu {
      position: absolute;
      top: 100%;
      right: 0;
      margin-top: 8px;
      width: 220px;
      z-index: 1000;
      padding: var(--space-2);
      animation: slideDown 0.2s ease;
      box-shadow: var(--shadow-xl);
    }

    .menu-item {
      width: 100%;
      display: flex;
      align-items: center;
      gap: var(--space-3);
      padding: var(--space-3) var(--space-4);
      background: none;
      border: none;
      color: var(--text-primary);
      font-size: var(--text-sm);
      font-weight: 500;
      cursor: pointer;
      border-radius: var(--radius-lg);
      transition: all 0.2s;
    }

    .menu-item:hover {
      background: var(--bg-glass);
      color: var(--primary-500);
    }

    .menu-item.danger {
      color: var(--danger-500);
    }

    .menu-item.danger:hover {
      background: rgba(239, 68, 68, 0.1);
    }

    .menu-icon {
      width: 18px;
      height: 18px;
    }

    @keyframes slideDown {
      from { opacity: 0; transform: translateY(-10px); }
      to { opacity: 1; transform: translateY(0); }
    }

    .chat-input-area {
      padding: var(--space-4) var(--space-6);
      background: var(--bg-glass);
      border-top: 1px solid var(--border-glass);
      display: flex;
      align-items: center;
      gap: var(--space-4);
    }

    .input-wrapper {
      flex: 1;
      background: var(--bg-glass);
      border: 1px solid var(--border-glass);
      border-radius: var(--radius-xl);
      display: flex;
      align-items: center;
      padding: 0 var(--space-4);
    }

    .input-wrapper input {
      flex: 1;
      background: transparent;
      border: none;
      padding: var(--space-3);
      color: var(--text-primary);
      font-size: var(--text-sm);
    }

    .input-wrapper input:focus {
      outline: none;
    }

    .emoji-btn {
      background: none;
      border: none;
      color: var(--text-secondary);
      cursor: pointer;
      display: flex;
      padding: 5px;
    }

    .send-btn {
      width: 48px;
      height: 48px;
      border-radius: var(--radius-full);
      background: var(--gradient-primary);
      color: white;
      border: none;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      transition: all var(--transition-base);
      box-shadow: var(--shadow-lg);
    }

    .send-btn:hover:not(:disabled) {
      transform: scale(1.1) rotate(-10deg);
      box-shadow: var(--shadow-xl);
    }

    .send-btn:disabled {
      opacity: 0.5;
      cursor: not-allowed;
    }

    .no-chat {
      flex: 1;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      color: var(--text-secondary);
      text-align: center;
      padding: var(--space-10);
    }

    .illustration {
      font-size: 80px;
      margin-bottom: var(--space-6);
      filter: drop-shadow(0 10px 20px rgba(0,0,0,0.1));
    }

    .no-chat h2 {
      font-size: var(--text-2xl);
      font-weight: 800;
      color: var(--text-primary);
      margin-bottom: var(--space-2);
    }

    @media (max-width: 992px) {
      .sidebar {
        width: 300px;
      }
    }

    @media (max-width: 768px) {
      .sidebar {
        width: 100%;
      }
      .sidebar.hidden {
        display: none;
      }
      .chat-window {
        display: none;
      }
      .chat-window.active {
        display: flex;
        width: 100%;
      }
      .back-btn {
        display: block;
      }
    }
  `]
})
export class MessagingComponent implements OnInit, AfterViewChecked {
  store = inject(MessagingStore);

  @ViewChild('scrollContainer') scrollContainer!: ElementRef;

  readonly SearchIcon = Search;
  readonly SendIcon = Send;
  readonly MoreIcon = MoreVertical;
  readonly PhoneIcon = Phone;
  readonly VideoIcon = Video;
  readonly PaperclipIcon = Paperclip;
  readonly SmileIcon = Smile;
  readonly CircleIcon = Circle;
  readonly TrashIcon = Trash2;
  readonly EditIcon = Edit2;
  readonly EraserIcon = Eraser;
  readonly CheckIcon = Check;
  readonly XIcon = X;

  searchQuery = signal('');
  newMessageText = '';

  showConvMenu = signal(false);
  activeMsgMenuId = signal<string | null>(null);
  editingMessageId = signal<string | null>(null);
  editText = '';

  filteredConversations = computed(() => {
    const query = this.searchQuery().toLowerCase();
    return this.store.conversations().filter(c =>
      c.name.toLowerCase().includes(query) ||
      c.lastMessage.toLowerCase().includes(query)
    );
  });

  ngOnInit() {
    this.store.loadConversations();

    // Close menus on click outside
    document.addEventListener('click', () => {
      this.showConvMenu.set(false);
      this.activeMsgMenuId.set(null);
    });
  }

  ngAfterViewChecked() {
    this.scrollToBottom();
  }

  scrollToBottom() {
    if (this.scrollContainer) {
      const el = this.scrollContainer.nativeElement;
      el.scrollTop = el.scrollHeight;
    }
  }

  selectConversation(id: string) {
    this.store.setActiveChat(id);
  }

  sendMessage() {
    if (!this.newMessageText.trim()) return;
    this.store.sendMessage(this.newMessageText);
    this.newMessageText = '';
  }

  toggleConvMenu(event: Event) {
    event.stopPropagation();
    this.showConvMenu.update(v => !v);
  }

  toggleMsgMenu(msgId: string, event: Event) {
    event.stopPropagation();
    this.activeMsgMenuId.set(this.activeMsgMenuId() === msgId ? null : msgId);
  }

  deleteMessage(chatId: string, msgId: string) {
    if (confirm('Delete this message?')) {
      this.store.deleteMessage(chatId, msgId);
    }
  }

  startEdit(msg: Message) {
    this.editingMessageId.set(msg.id);
    this.editText = msg.text;
    this.activeMsgMenuId.set(null);
  }

  saveEdit(chatId: string, msgId: string) {
    if (this.editText.trim()) {
      this.store.updateMessage(chatId, msgId, this.editText);
      this.editingMessageId.set(null);
    }
  }

  cancelEdit() {
    this.editingMessageId.set(null);
    this.editText = '';
  }

  clearChat(id: string) {
    if (confirm('Clear all messages in this chat?')) {
      this.store.clearChat(id);
    }
  }

  deleteConv(id: string) {
    if (confirm('Delete this entire conversation?')) {
      this.store.deleteConversation(id);
    }
  }
}
