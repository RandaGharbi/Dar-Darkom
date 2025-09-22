import React from 'react';
import styled from 'styled-components';
import { Product, Order, User } from '../../lib/api';

const CardsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
  gap: 2.5rem;
  margin-bottom: 2.5rem;
  margin-top: 2.5rem;
  
  @media (max-width: 1120px) {
    grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
    gap: 2rem;
    margin-bottom: 2rem;
    margin-top: 2rem;
  }
  
  @media (max-width: 1120px) {
    grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
    gap: 1.5rem;
    margin-top: 1.5rem;
    margin-bottom: 1.5rem;
  }
  
  @media (max-width: 1120px) {
    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
    gap: 1.2rem;
  }
  
  @media (max-width: 600px) {
    grid-template-columns: 1fr;
    gap: 1rem;
    margin-top: 1rem;
    margin-bottom: 1rem;
  }
`;

const Card = styled.div`
  background: linear-gradient(135deg, #ffffff 0%, #f8fafc 100%);
  border-radius: 20px;
  padding: 28px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
  border: 1px solid rgba(226, 232, 240, 0.8);
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  min-height: 160px;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  position: relative;
  overflow: hidden;
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 4px;
    background: linear-gradient(90deg, #3b82f6, #8b5cf6, #06b6d4);
    border-radius: 20px 20px 0 0;
  }
  
  &:hover {
    box-shadow: 0 8px 32px rgba(0, 0, 0, 0.12);
    transform: translateY(-4px);
    border-color: rgba(59, 130, 246, 0.3);
  }
  
  @media (max-width: 1120px) {
    padding: 24px;
    min-height: 140px;
  }
  
  @media (max-width: 480px) {
    padding: 20px;
    min-height: 130px;
  }
`;

const CardTitle = styled.div`
  color: #64748b;
  font-size: 14px;
  font-weight: 600;
  margin-bottom: 16px;
  text-transform: uppercase;
  letter-spacing: 0.8px;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', sans-serif;
  position: relative;
  
  &::after {
    content: '';
    position: absolute;
    bottom: -8px;
    left: 0;
    width: 30px;
    height: 2px;
    background: linear-gradient(90deg, #3b82f6, #8b5cf6);
    border-radius: 1px;
  }
  
  @media (max-width: 1120px) {
    font-size: 13px;
    margin-bottom: 14px;
  }
  
  @media (max-width: 480px) {
    font-size: 12px;
    margin-bottom: 12px;
  }
`;

const CardValue = styled.div`
  font-size: 32px;
  font-weight: 800;
  background: linear-gradient(135deg, #1e293b, #334155);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', sans-serif;
  margin-bottom: 8px;
  
  @media (max-width: 1120px) {
    font-size: 28px;
  }
  
  @media (max-width: 480px) {
    font-size: 24px;
  }
`;

const CardChange = styled.div`
  color: #059669;
  font-size: 14px;
  font-weight: 600;
  margin-top: 8px;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', sans-serif;
  display: flex;
  align-items: center;
  gap: 4px;
  
  &::before {
    content: '↗';
    font-size: 12px;
    font-weight: bold;
  }
  
  @media (max-width: 1120px) {
    font-size: 13px;
    margin-top: 6px;
  }
  
  @media (max-width: 480px) {
    font-size: 12px;
    margin-top: 4px;
  }
`;

interface StatsCardsProps {
  products: Product[];
  orders: Order[];
  users: User[];
}

export const StatsCards = ({ products, orders, users }: StatsCardsProps) => {
  // Calculs des vraies statistiques
  const totalRevenue = orders.reduce((sum, order) => sum + order.total, 0);
  const averageOrderValue = orders.length > 0 ? totalRevenue / orders.length : 0;
  const conversionRate = users.length > 0 ? (orders.length / users.length) * 100 : 0;

  // Calcul des pourcentages de changement (simulés pour l'exemple)
  const calculateChange = (current: number, previous: number = current * 0.9) => {
    if (previous === 0) return '+0%';
    const change = ((current - previous) / previous) * 100;
    return `${change >= 0 ? '+' : ''}${change.toFixed(1)}%`;
  };

  const stats = [
    {
      title: 'Revenus Totaux',
      value: `${totalRevenue.toFixed(2)} €`,
      change: calculateChange(totalRevenue),
    },
    {
      title: 'Commandes Totales',
      value: orders.length.toString(),
      change: calculateChange(orders.length),
    },
    {
      title: 'Utilisateurs Totaux',
      value: users.length.toString(),
      change: calculateChange(users.length),
    },
    {
      title: 'Produits Totaux',
      value: products.length.toString(),
      change: calculateChange(products.length),
    },
    {
      title: 'Valeur Moyenne Commande',
      value: `${averageOrderValue.toFixed(2)} €`,
      change: calculateChange(averageOrderValue),
    },
    {
      title: 'Taux de Conversion',
      value: `${conversionRate.toFixed(1)}%`,
      change: calculateChange(conversionRate),
    },
  ];

  return (
    <CardsGrid>
      {stats.map((stat, index) => (
        <Card key={index}>
          <CardTitle>{stat.title}</CardTitle>
          <CardValue>{stat.value}</CardValue>
          <CardChange>{stat.change} par rapport au mois dernier</CardChange>
        </Card>
      ))}
    </CardsGrid>
  );
}; 