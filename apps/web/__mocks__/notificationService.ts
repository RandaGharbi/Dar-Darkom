// Mock pour services/notificationService
const notificationService = {
  getUserNotifications: jest.fn().mockResolvedValue({
    notifications: [],
    unreadCount: 0,
  }),
  markAsRead: jest.fn().mockResolvedValue(undefined),
  markAllAsRead: jest.fn().mockResolvedValue(undefined),
  createNotification: jest.fn().mockResolvedValue({
    _id: 'test-notification-id',
    userId: 'test-user-id',
    title: 'Test Notification',
    message: 'Test message',
    type: 'info',
    read: false,
    createdAt: new Date().toISOString(),
  }),
  deleteNotification: jest.fn().mockResolvedValue(undefined),
  getUnreadCount: jest.fn().mockResolvedValue(0),
};

export default notificationService;