export interface Message {
  id: string;
  text: string;
  senderId: string;
  timestamp: Date;
  isMe: boolean;
  status: 'sent' | 'delivered' | 'read';
}

export interface Conversation {
  id: string;
  name: string;
  avatar?: string;
  gradient: string;
  initials: string;
  lastMessage: string;
  lastMessageTime: string;
  unreadCount: number;
  online: boolean;
  messages: Message[];
}

export interface CreateMessageDto {
  conversationId: string;
  text: string;
}

export interface UpdateMessageDto {
  text: string;
}
