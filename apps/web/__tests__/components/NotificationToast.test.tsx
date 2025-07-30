import React from 'react';
import { render, screen, fireEvent, waitFor, act } from '@testing-library/react';
import '@testing-library/jest-dom';
import NotificationToast from '../../components/NotificationToast';

const mockOnClose = jest.fn();

const createMockNotification = (overrides = {}) => ({
  _id: '1',
  userId: 'user1',
  type: 'order' as const,
  title: 'Test Title',
  message: 'Test message',
  isRead: false,
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
  ...overrides,
});

describe('NotificationToast', () => {
  let consoleErrorSpy: jest.SpyInstance;
  beforeAll(() => {
    consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
  });
  afterAll(() => {
    consoleErrorSpy.mockRestore();
  });

  beforeEach(() => {
    mockOnClose.mockClear();
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.runOnlyPendingTimers();
    jest.useRealTimers();
  });

  it('renders toast with notification', () => {
    const notification = createMockNotification({ title: 'Test Title', message: 'Test message' });
    render(<NotificationToast notification={notification} onClose={mockOnClose} />);
    expect(screen.getByText('Test Title')).toBeInTheDocument();
    expect(screen.getByText('Test message')).toBeInTheDocument();
  });

  it('renders correctly for order type', () => {
    const notification = createMockNotification({ type: 'order', title: 'Order Title' });
    render(<NotificationToast notification={notification} onClose={mockOnClose} />);
    expect(screen.getByText('Order Title')).toBeInTheDocument();
    expect(screen.getByText('Test message')).toBeInTheDocument();
  });

  it('renders correctly for stock type', () => {
    const notification = createMockNotification({ type: 'stock', title: 'Stock Title' });
    render(<NotificationToast notification={notification} onClose={mockOnClose} />);
    expect(screen.getByText('Stock Title')).toBeInTheDocument();
    expect(screen.getByText('Test message')).toBeInTheDocument();
  });

  it('renders correctly for user type', () => {
    const notification = createMockNotification({ type: 'user', title: 'User Title' });
    render(<NotificationToast notification={notification} onClose={mockOnClose} />);
    expect(screen.getByText('User Title')).toBeInTheDocument();
    expect(screen.getByText('Test message')).toBeInTheDocument();
  });

  it('renders correctly for system type', () => {
    const notification = createMockNotification({ type: 'system', title: 'System Title' });
    render(<NotificationToast notification={notification} onClose={mockOnClose} />);
    expect(screen.getByText('System Title')).toBeInTheDocument();
    expect(screen.getByText('Test message')).toBeInTheDocument();
  });

  it('auto-hides after default duration', async () => {
    const notification = createMockNotification({ title: 'Test', message: 'Test message' });
    render(<NotificationToast notification={notification} onClose={mockOnClose} />);
    
    expect(screen.getByText('Test')).toBeInTheDocument();
    
    act(() => {
      jest.advanceTimersByTime(5000);
    });
    
    await waitFor(() => {
      act(() => {
        jest.advanceTimersByTime(300); // Animation delay
      });
      expect(mockOnClose).toHaveBeenCalled();
    });
  });

  it('auto-hides after custom duration', async () => {
    const notification = createMockNotification({ title: 'Test', message: 'Test message' });
    render(<NotificationToast notification={notification} onClose={mockOnClose} duration={2000} />);
    
    expect(screen.getByText('Test')).toBeInTheDocument();
    
    act(() => {
      jest.advanceTimersByTime(2000);
    });
    
    await waitFor(() => {
      act(() => {
        jest.advanceTimersByTime(300);
      });
      expect(mockOnClose).toHaveBeenCalled();
    });
  });

  it('hides when close button is clicked', async () => {
    const notification = createMockNotification({ title: 'Test', message: 'Test message' });
    render(<NotificationToast notification={notification} onClose={mockOnClose} />);
    
    const closeButton = screen.getByRole('button', { name: /fermer/i });
    fireEvent.click(closeButton);
    
    await waitFor(() => {
      act(() => {
        jest.advanceTimersByTime(300);
      });
      expect(mockOnClose).toHaveBeenCalled();
    });
  });

  it('displays different styling for different types', () => {
    const orderNotification = createMockNotification({ type: 'order', title: 'Order', message: 'Order message' });
    const { rerender } = render(<NotificationToast notification={orderNotification} onClose={mockOnClose} />);
    expect(screen.getByText('Order')).toBeInTheDocument();

    const stockNotification = createMockNotification({ type: 'stock', title: 'Stock', message: 'Stock message' });
    rerender(<NotificationToast notification={stockNotification} onClose={mockOnClose} />);
    expect(screen.getByText('Stock')).toBeInTheDocument();

    const userNotification = createMockNotification({ type: 'user', title: 'User', message: 'User message' });
    rerender(<NotificationToast notification={userNotification} onClose={mockOnClose} />);
    expect(screen.getByText('User')).toBeInTheDocument();

    const systemNotification = createMockNotification({ type: 'system', title: 'System', message: 'System message' });
    rerender(<NotificationToast notification={systemNotification} onClose={mockOnClose} />);
    expect(screen.getByText('System')).toBeInTheDocument();
  });

  it('renders correctly when mounted', () => {
    const notification = createMockNotification({ title: 'Test', message: 'Test message' });
    const { container } = render(<NotificationToast notification={notification} onClose={mockOnClose} />);
    expect(container.firstChild).toBeDefined();
    expect(screen.getByText('Test')).toBeInTheDocument();
  });
});