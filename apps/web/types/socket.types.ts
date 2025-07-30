// Types pour les événements WebSocket
export interface WebSocketMessage {
  userId: string;
  message: {
    _id: string;
    userId: string;
    userEmail: string;
    userName: string;
    content: string;
    isFromUser: boolean;
    isRead: boolean;
    createdAt: string;
    updatedAt: string;
  };
  userEmail: string;
  userName: string;
}

export interface WebSocketNotification {
  _id: string;
  userId: string;
  title: string;
  message: string;
  createdAt: string;
  isRead: boolean;
  type: string;
  metadata?: Record<string, unknown>;
} 