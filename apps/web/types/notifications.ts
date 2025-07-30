export interface Notification {
  _id: string;
  userId: string;
  type: 'order' | 'stock' | 'user' | 'system' | 'payment' | 'product' | 'activity';
  title: string;
  message: string;
  isRead: boolean;
  createdAt: string;
  updatedAt: string;
  metadata?: {
    orderId?: string;
    productId?: string;
    userId?: string;
    amount?: number;
    [key: string]: any;
  };
}

export interface NotificationResponse {
  notifications: Notification[];
  unreadCount: number;
  totalCount: number;
}

export interface CreateNotificationRequest {
  userId: string;
  type: Notification['type'];
  title: string;
  message: string;
  metadata?: Notification['metadata'];
} 