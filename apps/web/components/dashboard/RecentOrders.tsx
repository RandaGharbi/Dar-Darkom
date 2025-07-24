'use client';

import React from 'react';
import styled from 'styled-components';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { Order } from '../../lib/api';

const Card = styled.div`
  background-color: #ffffff;
  border-radius: var(--radius-lg);
  padding: 1.5rem;
`;

const CardHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 1.5rem;
`;

const Title = styled.h3`
  font-size: 1.125rem;
  font-weight: 600;
  color: var(--text-primary);
  margin: 0;
`;

const ViewAllButton = styled.button`
  background: none;
  border: none;
  color: var(--primary-color);
  font-size: 0.875rem;
  font-weight: 500;
  cursor: pointer;
  transition: color 0.2s ease;

  &:hover {
    color: var(--primary-hover);
  }
`;

const OrderList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const OrderItem = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1rem;
  border: 1px solid var(--border-color);
  border-radius: var(--radius);
  transition: border-color 0.2s ease;

  &:hover {
    border-color: var(--border-hover);
  }
`;

const OrderInfo = styled.div`
  flex: 1;
`;

const OrderId = styled.div`
  font-size: 0.875rem;
  font-weight: 500;
  color: var(--text-primary);
  margin-bottom: 0.25rem;
`;

const OrderDate = styled.div`
  font-size: 0.75rem;
  color: var(--text-secondary);
`;

const OrderAmount = styled.div`
  font-size: 1rem;
  font-weight: 600;
  color: var(--text-primary);
`;

const StatusBadge = styled.span<{ status: Order['status'] }>`
  padding: 0.25rem 0.5rem;
  border-radius: var(--radius-sm);
  font-size: 0.75rem;
  font-weight: 500;
  background-color: ${props => {
    switch (props.status) {
      case 'active': return '#F2EDE8';
      case 'completed': return '#E8DECF';
      case 'cancelled': return '#ED9626';
      default: return '#E5E8EB';
    }
  }};
  color: ${props => {
    switch (props.status) {
      case 'active': return '#99784D';
      case 'completed': return '#08870F';
      case 'cancelled': return '#1C140D';
      default: return '#757575';
    }
  }};
`;

interface RecentOrdersProps {
  orders: Order[];
}

export function RecentOrders({ orders }: RecentOrdersProps) {
  const getStatusLabel = (status: Order['status']) => {
    switch (status) {
      case 'active': return 'En cours';
      case 'completed': return 'Terminée';
      case 'cancelled': return 'Annulée';
      default: return status;
    }
  };

  return (
    <Card>
      <CardHeader>
        <Title>Commandes récentes</Title>
        <ViewAllButton>Voir tout</ViewAllButton>
      </CardHeader>
      
      <OrderList>
        {orders.length === 0 ? (
          <div style={{ 
            textAlign: 'center', 
            padding: '2rem',
            color: '#757575'
          }}>
            Aucune commande récente
          </div>
        ) : (
          orders.map((order) => (
            <OrderItem key={order._id}>
              <OrderInfo>
                <OrderId>Commande #{order._id.slice(-6)}</OrderId>
                <OrderDate>
                  {format(new Date(order.createdAt), 'dd MMM yyyy', { locale: fr })}
                </OrderDate>
              </OrderInfo>
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                <OrderAmount>{order.total.toFixed(2)} €</OrderAmount>
                <StatusBadge status={order.status}>
                  {getStatusLabel(order.status)}
                </StatusBadge>
              </div>
            </OrderItem>
          ))
        )}
      </OrderList>
    </Card>
  );
}
