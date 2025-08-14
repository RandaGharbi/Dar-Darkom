// Mock pour services/notificationService
const notificationService = {
  getUserNotifications: jest.fn().mockImplementation((userId) => Promise.resolve({
    notifications: [
      {
        _id: 'test-notification-1',
        userId: userId,
        title: 'Test Notification 1',
        message: 'Test message 1',
        type: 'info',
        read: false,
        createdAt: new Date().toISOString(),
      }
    ],
    unreadCount: 1,
  })),
  markAsRead: jest.fn().mockResolvedValue({ success: true }),
  markAllAsRead: jest.fn().mockResolvedValue({ success: true }),
  createNotification: jest.fn().mockResolvedValue({
    _id: 'test-notification-id',
    userId: 'test-user-id',
    title: 'Test Notification',
    message: 'Test message',
    type: 'info',
    read: false,
    createdAt: new Date().toISOString(),
  }),
  deleteNotification: jest.fn().mockResolvedValue({ success: true }),
  getUnreadCount: jest.fn().mockResolvedValue(1),
};

export default notificationService;