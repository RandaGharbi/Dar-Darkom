import { IMessage } from '../models/Message';

// Types pour les messages groupés
export interface MessageGroup {
  userId: string;
  userEmail: string;
  userName: string;
  messages: IMessage[];
  unreadCount: number;
}

// Type pour les notifications
export interface MessageNotification {
  _id: string;
  userId: string;
  title: string;
  message: string;
  createdAt: string;
  isRead: boolean;
  type: 'activity';
  metadata: {
    messageId: string;
    userId: string;
    userName: string;
    userEmail: string;
  };
  [key: string]: unknown;
} 