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
  background: #f5efe7;
  border-radius: 16px;
  padding: 2.2rem 2rem 1.7rem 2rem;
  box-shadow: 0 2px 8px 0 #e9e9e9;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  min-height: 150px;
  
  @media (max-width: 1120px) {
    padding: 1.5rem 1.5rem 1.2rem 1.5rem;
    min-height: 130px;
  }
  
  @media (max-width: 480px) {
    padding: 1rem 1rem 0.8rem 1rem;
    min-height: 120px;
  }
`;

const CardTitle = styled.div`
  color: #827869;
  font-size: 1.1rem;
  font-weight: 500;
  margin-bottom: 1.2rem;
  
  @media (max-width: 1120px) {
    font-size: 1rem;
    margin-bottom: 1rem;
  }
  
  @media (max-width: 480px) {
    font-size: 0.9rem;
    margin-bottom: 0.8rem;
  }
`;

const CardValue = styled.div`
  font-size: 2.2rem;
  font-weight: bold;
  color: #171412;
  
  @media (max-width: 1120px) {
    font-size: 1.8rem;
  }
  
  @media (max-width: 480px) {
    font-size: 1.5rem;
  }
`;

const CardChange = styled.div`
  color: #1ca672;
  font-size: 1rem;
  font-weight: 500;
  margin-top: 0.5rem;
  
  @media (max-width: 1120px) {
    font-size: 0.9rem;
    margin-top: 0.4rem;
  }
  
  @media (max-width: 480px) {
    font-size: 0.8rem;
    margin-top: 0.3rem;
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