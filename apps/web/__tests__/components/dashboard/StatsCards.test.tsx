import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { StatsCards } from '../../../components/dashboard/StatsCards';
import { Product, Order, User } from '../../../lib/api';

const mockProducts: Product[] = [
  { 
    _id: '1', 
    id: 1, 
    name: 'Product 1', 
    price: 100, 
    category: 'Body', 
    product_url: 'http://example.com/1',
    productType: 'product',
    createdAt: '2024-01-01T00:00:00.000Z',
    updatedAt: '2024-01-01T00:00:00.000Z'
  },
  { 
    _id: '2', 
    id: 2, 
    name: 'Product 2', 
    price: 50, 
    category: 'Face', 
    product_url: 'http://example.com/2',
    productType: 'product',
    createdAt: '2024-01-01T00:00:00.000Z',
    updatedAt: '2024-01-01T00:00:00.000Z'
  }
];

const mockOrders: Order[] = [
  {
    _id: '1',
    userId: 'user1',
    total: 150,
    subtotal: 140,
    shipping: 10,
    tax: 0,
    status: 'completed',
    isOrdered: true,
    createdAt: '2024-01-15T10:30:00.000Z',
    updatedAt: '2024-01-15T10:30:00.000Z',
    products: [],
    shippingAddress: {
      fullName: 'Customer 1',
      street: '123 Main St',
      city: 'Paris',
      postalCode: '75001',
      country: 'France'
    }
  },
  {
    _id: '2',
    userId: 'user2',
    total: 200,
    subtotal: 190,
    shipping: 10,
    tax: 0,
    status: 'active',
    isOrdered: true,
    createdAt: '2024-01-14T14:20:00.000Z',
    updatedAt: '2024-01-14T14:20:00.000Z',
    products: [],
    shippingAddress: {
      fullName: 'Customer 2',
      street: '456 Oak Ave',
      city: 'Lyon',
      postalCode: '69001',
      country: 'France'
    }
  }
];

const mockUsers: User[] = [
  { _id: '1', name: 'User 1', email: 'user1@test.com', createdAt: '2024-01-01T00:00:00.000Z', updatedAt: '2024-01-01T00:00:00.000Z' },
  { _id: '2', name: 'User 2', email: 'user2@test.com', createdAt: '2024-01-01T00:00:00.000Z', updatedAt: '2024-01-01T00:00:00.000Z' },
  { _id: '3', name: 'User 3', email: 'user3@test.com', createdAt: '2024-01-01T00:00:00.000Z', updatedAt: '2024-01-01T00:00:00.000Z' }
];

describe('StatsCards', () => {
  it('renders all stat cards', () => {
    render(<StatsCards products={mockProducts} orders={mockOrders} users={mockUsers} />);
    
    expect(screen.getByText('Revenus Totaux')).toBeInTheDocument();
    expect(screen.getByText('Commandes Totales')).toBeInTheDocument();
    expect(screen.getByText('Utilisateurs Totaux')).toBeInTheDocument();
    expect(screen.getByText('Produits Totaux')).toBeInTheDocument();
    expect(screen.getByText('Valeur Moyenne Commande')).toBeInTheDocument();
    expect(screen.getByText('Taux de Conversion')).toBeInTheDocument();
  });

  it('calculates total revenue correctly', () => {
    render(<StatsCards products={mockProducts} orders={mockOrders} users={mockUsers} />);
    
    expect(screen.getByText('350.00 €')).toBeInTheDocument();
  });

  it('displays correct number of orders', () => {
    render(<StatsCards products={mockProducts} orders={mockOrders} users={mockUsers} />);
    
    expect(screen.getByText('Commandes Totales')).toBeInTheDocument();
    const twos = screen.getAllByText('2');
    expect(twos.length).toBeGreaterThan(0);
  });

  it('displays correct number of users', () => {
    render(<StatsCards products={mockProducts} orders={mockOrders} users={mockUsers} />);
    
    expect(screen.getByText('3')).toBeInTheDocument();
  });

  it('displays correct number of products', () => {
    render(<StatsCards products={mockProducts} orders={mockOrders} users={mockUsers} />);
    
    expect(screen.getByText('Produits Totaux')).toBeInTheDocument();
    const productCards = screen.getAllByText('2');
    expect(productCards.length).toBeGreaterThan(0);
  });

  it('calculates average order value correctly', () => {
    render(<StatsCards products={mockProducts} orders={mockOrders} users={mockUsers} />);
    
    expect(screen.getByText('175.00 €')).toBeInTheDocument();
  });

  it('calculates conversion rate correctly', () => {
    render(<StatsCards products={mockProducts} orders={mockOrders} users={mockUsers} />);
    
    expect(screen.getByText('66.7%')).toBeInTheDocument();
  });

  it('shows change percentages', () => {
    render(<StatsCards products={mockProducts} orders={mockOrders} users={mockUsers} />);
    
    const changeTexts = screen.getAllByText(/par rapport au mois dernier/);
    expect(changeTexts).toHaveLength(6);
  });

  it('handles empty orders array', () => {
    render(<StatsCards products={mockProducts} orders={[]} users={mockUsers} />);
    
    // Vérifier que les valeurs sont zéro mais sans utiliser getByText pour éviter l'ambiguïté
    expect(screen.getByText('Revenus Totaux')).toBeInTheDocument();
    expect(screen.getByText('Commandes Totales')).toBeInTheDocument();
    const zeroEuros = screen.getAllByText('0.00 €');
    expect(zeroEuros.length).toBeGreaterThan(0);
  });

  it('handles empty users array', () => {
    render(<StatsCards products={mockProducts} orders={mockOrders} users={[]} />);
    
    expect(screen.getByText('0.0%')).toBeInTheDocument(); // Conversion rate should be 0
  });

  it('handles empty products array', () => {
    render(<StatsCards products={[]} orders={mockOrders} users={mockUsers} />);
    
    expect(screen.getByText('Produits Totaux')).toBeInTheDocument();
    const zeros = screen.getAllByText('0');
    expect(zeros.length).toBeGreaterThan(0);
  });
});