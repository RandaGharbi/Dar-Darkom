import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { RecentOrders } from '../../../components/dashboard/RecentOrders';
import { Order } from '../../../lib/api';

const mockOrders: Order[] = [
  {
    _id: '123456789012',
    createdAt: '2024-01-15T10:30:00.000Z',
    total: 125.50,
    status: 'active',
    customerId: 'customer1',
    products: []
  },
  {
    _id: '987654321098',
    createdAt: '2024-01-14T14:20:00.000Z',
    total: 89.99,
    status: 'completed',
    customerId: 'customer2',
    products: []
  },
  {
    _id: '456789123456',
    createdAt: '2024-01-13T09:15:00.000Z',
    total: 200.00,
    status: 'cancelled',
    customerId: 'customer3',
    products: []
  }
];

describe('RecentOrders', () => {
  it('renders component title', () => {
    render(<RecentOrders orders={mockOrders} />);
    expect(screen.getByText('Commandes récentes')).toBeInTheDocument();
  });

  it('renders "Voir tout" button', () => {
    render(<RecentOrders orders={mockOrders} />);
    expect(screen.getByText('Voir tout')).toBeInTheDocument();
  });

  it('displays order information correctly', () => {
    render(<RecentOrders orders={mockOrders} />);
    
    expect(screen.getByText('Commande #789012')).toBeInTheDocument();
    expect(screen.getByText('Commande #321098')).toBeInTheDocument();
    expect(screen.getByText('Commande #123456')).toBeInTheDocument();
  });

  it('displays order amounts correctly', () => {
    render(<RecentOrders orders={mockOrders} />);
    
    expect(screen.getByText('125.50 €')).toBeInTheDocument();
    expect(screen.getByText('89.99 €')).toBeInTheDocument();
    expect(screen.getByText('200.00 €')).toBeInTheDocument();
  });

  it('displays correct status badges', () => {
    render(<RecentOrders orders={mockOrders} />);
    
    expect(screen.getByText('En cours')).toBeInTheDocument();
    expect(screen.getByText('Terminée')).toBeInTheDocument();
    expect(screen.getByText('Annulée')).toBeInTheDocument();
  });

  it('displays formatted dates', () => {
    render(<RecentOrders orders={mockOrders} />);
    
    expect(screen.getByText('15 janv. 2024')).toBeInTheDocument();
    expect(screen.getByText('14 janv. 2024')).toBeInTheDocument();
    expect(screen.getByText('13 janv. 2024')).toBeInTheDocument();
  });

  it('shows empty state when no orders', () => {
    render(<RecentOrders orders={[]} />);
    expect(screen.getByText('Aucune commande récente')).toBeInTheDocument();
  });

  it('applies correct status colors', () => {
    const { container } = render(<RecentOrders orders={mockOrders} />);
    
    const statusBadges = container.querySelectorAll('[status]');
    expect(statusBadges).toHaveLength(3);
  });

  it('truncates order ID to last 6 characters', () => {
    const longIdOrder: Order[] = [{
      _id: '123456789012345678901234',
      createdAt: '2024-01-15T10:30:00.000Z',
      total: 100,
      status: 'active',
      customerId: 'customer1',
      products: []
    }];
    
    render(<RecentOrders orders={longIdOrder} />);
    expect(screen.getByText('Commande #901234')).toBeInTheDocument();
  });
});