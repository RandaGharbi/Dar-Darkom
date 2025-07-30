import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import '@testing-library/jest-dom';
import NotificationDropdown from '../../components/NotificationDropdown';

const createTestQueryClient = () => new QueryClient({
  defaultOptions: {
    queries: { retry: false },
    mutations: { retry: false },
  },
});

const TestWrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const queryClient = createTestQueryClient();
  return (
    <QueryClientProvider client={queryClient}>
      {children}
    </QueryClientProvider>
  );
};

// Mock the notification service
jest.mock('../../services/notificationService', () => ({
  __esModule: true,
  default: {
    getUserNotifications: jest.fn().mockResolvedValue({
      notifications: [],
      unreadCount: 0,
    }),
    markAsRead: jest.fn().mockResolvedValue(undefined),
    markAllAsRead: jest.fn().mockResolvedValue(undefined),
    deleteNotification: jest.fn().mockResolvedValue(undefined),
  },
}));

describe('NotificationDropdown', () => {
  it('renders notification button', () => {
    render(
      <TestWrapper>
        <NotificationDropdown userId="test-user-id" />
      </TestWrapper>
    );
    const button = screen.getByRole('button', { name: /notifications/i });
    expect(button).toBeInTheDocument();
  });

  it('opens dropdown when button is clicked', async () => {
    render(
      <TestWrapper>
        <NotificationDropdown userId="test-user-id" />
      </TestWrapper>
    );
    const button = screen.getByRole('button', { name: /notifications/i });
    
    fireEvent.click(button);
    
    await waitFor(() => {
      expect(screen.getByText('Notifications')).toBeInTheDocument();
    });
  });

  it('displays notifications dropdown content when open', async () => {
    render(
      <TestWrapper>
        <NotificationDropdown userId="test-user-id" />
      </TestWrapper>
    );
    const button = screen.getByRole('button', { name: /notifications/i });
    
    fireEvent.click(button);
    
    await waitFor(() => {
      expect(screen.getByText('Notifications')).toBeInTheDocument();
      expect(screen.getByText('Aucune notification')).toBeInTheDocument();
    });
  });

  it('displays loading state initially', () => {
    render(
      <TestWrapper>
        <NotificationDropdown userId="test-user-id" />
      </TestWrapper>
    );
    const button = screen.getByRole('button', { name: /notifications/i });
    
    fireEvent.click(button);
    
    expect(screen.getByText('Chargement...')).toBeInTheDocument();
  });
});