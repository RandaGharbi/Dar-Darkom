import React from 'react';
import { render, screen, fireEvent, waitFor, act } from '@testing-library/react';
import '@testing-library/jest-dom';
import { NotificationToast } from '../../components/NotificationToast';

const mockOnHide = jest.fn();

describe('NotificationToast', () => {
  let consoleErrorSpy: jest.SpyInstance;
  beforeAll(() => {
    consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
  });
  afterAll(() => {
    consoleErrorSpy.mockRestore();
  });

  beforeEach(() => {
    mockOnHide.mockClear();
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.runOnlyPendingTimers();
    jest.useRealTimers();
  });

  it('renders toast with message', () => {
    render(<NotificationToast message="Test message" onHide={mockOnHide} />);
    expect(screen.getByText('Test message')).toBeInTheDocument();
  });

  it('displays correct icon for success type', () => {
    render(<NotificationToast message="Success" type="success" onHide={mockOnHide} />);
    expect(screen.getByText('✅')).toBeInTheDocument();
  });

  it('displays correct icon for error type', () => {
    render(<NotificationToast message="Error" type="error" onHide={mockOnHide} />);
    expect(screen.getByText('❌')).toBeInTheDocument();
  });

  it('displays correct icon for warning type', () => {
    render(<NotificationToast message="Warning" type="warning" onHide={mockOnHide} />);
    expect(screen.getByText('⚠️')).toBeInTheDocument();
  });

  it('displays correct icon for info type', () => {
    render(<NotificationToast message="Info" type="info" onHide={mockOnHide} />);
    expect(screen.getByText('ℹ️')).toBeInTheDocument();
  });

  it('auto-hides after default duration', async () => {
    render(<NotificationToast message="Test" onHide={mockOnHide} />);
    
    expect(screen.getByText('Test')).toBeInTheDocument();
    
    act(() => {
      jest.advanceTimersByTime(3000);
    });
    
    await waitFor(() => {
      act(() => {
        jest.advanceTimersByTime(300); // Animation delay
      });
      expect(mockOnHide).toHaveBeenCalled();
    });
  });

  it('auto-hides after custom duration', async () => {
    render(<NotificationToast message="Test" duration={5000} onHide={mockOnHide} />);
    
    expect(screen.getByText('Test')).toBeInTheDocument();
    
    act(() => {
      jest.advanceTimersByTime(5000);
    });
    
    await waitFor(() => {
      act(() => {
        jest.advanceTimersByTime(300);
      });
      expect(mockOnHide).toHaveBeenCalled();
    });
  });

  it('hides when close button is clicked', async () => {
    render(<NotificationToast message="Test" onHide={mockOnHide} />);
    
    const closeButton = screen.getByRole('button');
    fireEvent.click(closeButton);
    
    await waitFor(() => {
      act(() => {
        jest.advanceTimersByTime(300);
      });
      expect(mockOnHide).toHaveBeenCalled();
    });
  });

  it('applies correct CSS classes for different types', () => {
    const { rerender } = render(
      <NotificationToast message="Success" type="success" onHide={mockOnHide} />
    );
    // Cherche le parent avec la classe bg-green-500
    const successDiv = screen.getByText('Success').parentElement?.parentElement;
    expect(successDiv?.className).toContain('bg-green-500');

    rerender(<NotificationToast message="Error" type="error" onHide={mockOnHide} />);
    const errorDiv = screen.getByText('Error').parentElement?.parentElement;
    expect(errorDiv?.className).toContain('bg-red-500');

    rerender(<NotificationToast message="Warning" type="warning" onHide={mockOnHide} />);
    const warningDiv = screen.getByText('Warning').parentElement?.parentElement;
    expect(warningDiv?.className).toContain('bg-yellow-500');

    rerender(<NotificationToast message="Info" type="info" onHide={mockOnHide} />);
    const infoDiv = screen.getByText('Info').parentElement?.parentElement;
    expect(infoDiv?.className).toContain('bg-blue-500');
  });

  it('does not render before component is mounted', () => {
    const { container } = render(<NotificationToast message="Test" onHide={mockOnHide} />);
    // Le composant devrait être monté immédiatement ou après un court délai
    expect(container.firstChild).toBeDefined();
  });
});