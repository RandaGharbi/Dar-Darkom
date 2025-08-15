import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { RecentOrders } from '../../../components/dashboard/RecentOrders';
import { Order } from '../../../lib/api';

const mockOrders: Order[] = [
  {
    _id: '123456789012',
    userId: 'user1',
    createdAt: '2024-01-15T10:30:00.000Z',
    updatedAt: '2024-01-15T10:30:00.000Z',
    total: 125.50,
    subtotal: 115.50,
    shipping: 10.00,
    tax: 0.00,
    status: 'active',
    isOrdered: true,
    products: [],
    shippingAddress: {
      fullName: 'John Doe',
      street: '123 Main St',
      city: 'Paris',
      postalCode: '75001',
      country: 'France'
    }
  },
  {
    _id: '987654321098',
    userId: 'user2',
    createdAt: '2024-01-14T14:20:00.000Z',
    updatedAt: '2024-01-14T14:20:00.000Z',
    total: 89.99,
    subtotal: 79.99,
    shipping: 10.00,
    tax: 0.00,
    status: 'completed',
    isOrdered: true,
    products: [],
    shippingAddress: {
      fullName: 'Jane Smith',
      street: '456 Oak Ave',
      city: 'Lyon',
      postalCode: '69001',
      country: 'France'
    }
  },
  {
    _id: '456789123456',
    userId: 'user3',
    createdAt: '2024-01-13T09:15:00.000Z',
    updatedAt: '2024-01-13T09:15:00.000Z',
    total: 200.00,
    subtotal: 190.00,
    shipping: 10.00,
    tax: 0.00,
    status: 'cancelled',
    isOrdered: false,
    products: [],
    shippingAddress: {
      fullName: 'Bob Johnson',
      street: '789 Pine St',
      city: 'Marseille',
      postalCode: '13001',
      country: 'France'
    }
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
      userId: 'user1',
      createdAt: '2024-01-15T10:30:00.000Z',
      updatedAt: '2024-01-15T10:30:00.000Z',
      total: 100,
      subtotal: 90,
      shipping: 10,
      tax: 0,
      status: 'active',
      isOrdered: true,
      products: [],
      shippingAddress: {
        fullName: 'Test User',
        street: '123 Test St',
        city: 'Test City',
        postalCode: '12345',
        country: 'France'
      }
    }];
    
    render(<RecentOrders orders={longIdOrder} />);
    expect(screen.getByText('Commande #901234')).toBeInTheDocument();
  });
});