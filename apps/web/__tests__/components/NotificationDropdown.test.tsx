import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import { NotificationDropdown } from '../../components/NotificationDropdown';

const mockNotifications = [
  {
    id: '1',
    text: 'Test notification 1',
    time: 'Il y a 5 minutes'
  },
  {
    id: '2',
    text: 'Test notification 2',
    time: 'Il y a 1 heure'
  }
];

describe('NotificationDropdown', () => {
  it('renders notification button', () => {
    render(<NotificationDropdown />);
    const button = screen.getByRole('button', { name: /notifications/i });
    expect(button).toBeInTheDocument();
  });

  it('toggles dropdown when button is clicked', () => {
    render(<NotificationDropdown />);
    const button = screen.getByRole('button', { name: /notifications/i });
    
    expect(button).toHaveAttribute('aria-expanded', 'false');
    
    fireEvent.click(button);
    expect(button).toHaveAttribute('aria-expanded', 'true');
    
    fireEvent.click(button);
    expect(button).toHaveAttribute('aria-expanded', 'false');
  });

  it('displays default notifications when none provided', () => {
    render(<NotificationDropdown />);
    const button = screen.getByRole('button', { name: /notifications/i });
    
    fireEvent.click(button);
    
    expect(screen.getByText('Nouvelle commande reçue #12345')).toBeInTheDocument();
    expect(screen.getByText('Stock faible pour le produit "Crème Hydratante"')).toBeInTheDocument();
  });

  it('displays custom notifications when provided', () => {
    render(<NotificationDropdown notifications={mockNotifications} />);
    const button = screen.getByRole('button', { name: /notifications/i });
    
    fireEvent.click(button);
    
    expect(screen.getByText('Test notification 1')).toBeInTheDocument();
    expect(screen.getByText('Test notification 2')).toBeInTheDocument();
  });

  it('closes dropdown when "Marquer comme lu" is clicked', () => {
    render(<NotificationDropdown />);
    const button = screen.getByRole('button', { name: /notifications/i });
    
    fireEvent.click(button);
    expect(button).toHaveAttribute('aria-expanded', 'true');
    
    const markAsReadButton = screen.getByText('Marquer comme lu');
    fireEvent.click(markAsReadButton);
    
    expect(button).toHaveAttribute('aria-expanded', 'false');
  });

  it('closes dropdown when clicking outside', async () => {
    render(<NotificationDropdown />);
    const button = screen.getByRole('button', { name: /notifications/i });
    
    fireEvent.click(button);
    expect(button).toHaveAttribute('aria-expanded', 'true');
    
    fireEvent.mouseDown(document.body);
    
    await waitFor(() => {
      expect(button).toHaveAttribute('aria-expanded', 'false');
    });
  });

  it('displays empty state when no notifications', () => {
    render(<NotificationDropdown notifications={[]} />);
    const button = screen.getByRole('button', { name: /notifications/i });
    
    fireEvent.click(button);
    
    expect(screen.getByText('Aucune notification')).toBeInTheDocument();
  });
});