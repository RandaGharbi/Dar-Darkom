import React from 'react';
import styled from 'styled-components';
import { Package, Clock, CheckCircle, XCircle, Loader2, RefreshCw } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { ordersAPI } from '../../lib/api';

interface OrdersTabProps {
  userId: string;
}

const TabContainer = styled.div`
  padding: 24px;
  background: ${({ theme }) => theme.colors.card.background};
  border-radius: 16px;
  box-shadow: ${({ theme }) => theme.colors.card.shadow};
  border: 1px solid ${({ theme }) => theme.colors.border};
`;

const TabHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 32px;
  padding-bottom: 20px;
  border-bottom: 1px solid ${({ theme }) => theme.colors.border};
`;

const TabTitle = styled.h3`
  font-size: 20px;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.text.primary};
  margin: 0;
`;

const RefreshButton = styled.button`
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 10px 16px;
  background: ${({ theme }) => theme.colors.surface};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: 8px;
  color: ${({ theme }) => theme.colors.text.secondary};
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;

  &:hover:not(:disabled) {
    background: ${({ theme }) => theme.colors.border};
    border-color: ${({ theme }) => theme.colors.text.muted};
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }

  .animate-spin {
    animation: spin 1s linear infinite;
  }

  @keyframes spin {
    from { transform: rotate(0deg); }
    to { transform: rotate(360deg); }
  }
`;

const LoadingContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 80px 20px;
  color: ${({ theme }) => theme.colors.text.muted};
`;

const ErrorContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 80px 20px;
  text-align: center;
  color: ${({ theme }) => theme.colors.text.muted};
`;

const RetryButton = styled.button`
  margin-top: 20px;
  padding: 12px 24px;
  background: ${({ theme }) => theme.colors.primary};
  color: white;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-size: 14px;
  font-weight: 500;
  transition: background 0.2s;

  &:hover {
    background: ${({ theme }) => theme.colors.secondary};
  }
`;

const EmptyContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 80px 20px;
  text-align: center;
  color: ${({ theme }) => theme.colors.text.muted};
`;

const OrdersList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 20px;
`;

const OrderCard = styled.div`
  background: ${({ theme }) => theme.colors.background};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: 12px;
  padding: 24px;
  box-shadow: ${({ theme }) => theme.colors.card.shadow};
  transition: all 0.2s;

  &:hover {
    box-shadow: ${({ theme }) => theme.shadows.lg};
    border-color: ${({ theme }) => theme.colors.text.muted};
  }
`;

const OrderHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
`;

const OrderId = styled.span`
  font-size: 16px;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.text.primary};
`;

const OrderStatus = styled.span<{ status: string }>`
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 8px 16px;
  border-radius: 20px;
  font-size: 13px;
  font-weight: 500;
  ${props => {
    switch (props.status) {
      case 'completed':
        return `
          background: #f0fff4;
          color: #22543d;
          border: 1px solid #9ae6b4;
        `;
      case 'active':
        return `
          background: #fffbeb;
          color: #92400e;
          border: 1px solid #fcd34d;
        `;
      case 'cancelled':
        return `
          background: #fef2f2;
          color: #991b1b;
          border: 1px solid #fca5a5;
        `;
      default:
        return `
          background: ${props.theme.colors.surface};
          color: ${props.theme.colors.text.secondary};
          border: 1px solid ${props.theme.colors.border};
        `;
    }
  }}
`;

const OrderDetails = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  gap: 20px;
  margin-bottom: 20px;
  padding-bottom: 20px;
  border-bottom: 1px solid ${({ theme }) => theme.colors.border};

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    gap: 16px;
  }
`;

const DetailItem = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
`;

const DetailLabel = styled.span`
  font-size: 12px;
  color: ${({ theme }) => theme.colors.text.muted};
  font-weight: 500;
  text-transform: uppercase;
  letter-spacing: 0.5px;
`;

const DetailValue = styled.span`
  font-size: 14px;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.text.primary};
`;

const OrderProducts = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

const ProductItem = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 0;
  border-bottom: 1px solid ${({ theme }) => theme.colors.surface};

  &:last-child {
    border-bottom: none;
  }
`;

const ProductName = styled.span`
  font-size: 14px;
  color: ${({ theme }) => theme.colors.text.primary};
  font-weight: 500;
  flex: 1;
`;

const ProductInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 16px;
`;

const ProductQuantity = styled.span`
  font-size: 13px;
  color: ${({ theme }) => theme.colors.text.muted};
  font-weight: 500;
`;

const ProductPrice = styled.span`
  font-size: 14px;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.text.primary};
`;

export const OrdersTab: React.FC<OrdersTabProps> = ({ userId }) => {
  const { data: orders, isLoading, error, refetch } = useQuery({
    queryKey: ['user-orders', userId],
    queryFn: () => ordersAPI.getByUser(userId).then(res => res.data),
    enabled: !!userId,
    refetchOnWindowFocus: false,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle size={16} />;
      case 'active':
        return <Clock size={16} />;
      case 'cancelled':
        return <XCircle size={16} />;
      default:
        return <Package size={16} />;
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'completed':
        return 'Terminée';
      case 'active':
        return 'En cours';
      case 'cancelled':
        return 'Annulée';
      default:
        return 'Inconnue';
    }
  };

  if (isLoading) {
    return (
      <TabContainer>
        <TabHeader>
          <TabTitle>Commandes</TabTitle>
          <RefreshButton disabled>
            <Loader2 size={16} className="animate-spin" />
          </RefreshButton>
        </TabHeader>
        <LoadingContainer>
          <Loader2 size={48} className="animate-spin" />
          <p style={{ marginTop: '16px', fontSize: '14px' }}>Chargement des commandes...</p>
        </LoadingContainer>
      </TabContainer>
    );
  }

  if (error) {
    // Si l'erreur est 404 ou similaire, c'est probablement un utilisateur sans commandes
    const isNotFoundError = (error && 'response' in error && (error.response as { status?: number })?.status === 404) || 
                           error?.message?.includes('not found') ||
                           error?.message?.includes('404');
    
    if (isNotFoundError) {
      return (
        <TabContainer>
          <TabHeader>
            <TabTitle>Commandes</TabTitle>
            <RefreshButton onClick={() => refetch()} disabled={isLoading}>
              <RefreshCw size={16} className={isLoading ? 'animate-spin' : ''} />
            </RefreshButton>
          </TabHeader>
          <EmptyContainer>
            <Package size={48} />
            <h4 style={{ margin: '16px 0 8px 0', color: '#2d3748' }}>Aucune commande</h4>
            <p style={{ margin: 0, fontSize: '14px' }}>Cet utilisateur n&apos;a pas encore passé de commande.</p>
          </EmptyContainer>
        </TabContainer>
      );
    }
    
    return (
      <TabContainer>
        <TabHeader>
          <TabTitle>Commandes</TabTitle>
          <RefreshButton onClick={() => refetch()} disabled={isLoading}>
            <RefreshCw size={16} className={isLoading ? 'animate-spin' : ''} />
          </RefreshButton>
        </TabHeader>
        <ErrorContainer>
          <Package size={48} />
          <h4 style={{ margin: '16px 0 8px 0', color: '#2d3748' }}>Erreur de chargement</h4>
          <p style={{ margin: 0, fontSize: '14px' }}>Impossible de charger les commandes. Veuillez réessayer.</p>
          <RetryButton onClick={() => refetch()}>
            Réessayer
          </RetryButton>
        </ErrorContainer>
      </TabContainer>
    );
  }

  if (!orders || orders.length === 0) {
    return (
      <TabContainer>
        <TabHeader>
          <TabTitle>Commandes</TabTitle>
          <RefreshButton onClick={() => refetch()} disabled={isLoading}>
            <RefreshCw size={16} className={isLoading ? 'animate-spin' : ''} />
          </RefreshButton>
        </TabHeader>
        <EmptyContainer>
          <Package size={48} />
          <h4 style={{ margin: '16px 0 8px 0', color: '#2d3748' }}>Aucune commande</h4>
          <p style={{ margin: 0, fontSize: '14px' }}>Cet utilisateur n&apos;a pas encore passé de commande.</p>
        </EmptyContainer>
      </TabContainer>
    );
  }

  return (
    <TabContainer>
      <TabHeader>
        <TabTitle>Commandes ({orders.length})</TabTitle>
        <RefreshButton onClick={() => refetch()} disabled={isLoading}>
          <RefreshCw size={16} className={isLoading ? 'animate-spin' : ''} />
        </RefreshButton>
      </TabHeader>
      <OrdersList>
        {orders.map((order) => (
          <OrderCard key={order._id}>
            <OrderHeader>
              <OrderId>Commande #{order._id}</OrderId>
              <OrderStatus status={order.status}>
                {getStatusIcon(order.status)}
                {getStatusText(order.status)}
              </OrderStatus>
            </OrderHeader>
            
            <OrderDetails>
              <DetailItem>
                <DetailLabel>Date</DetailLabel>
                <DetailValue>
                  {new Date(order.createdAt).toLocaleDateString('fr-FR', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}
                </DetailValue>
              </DetailItem>
              <DetailItem>
                <DetailLabel>Total</DetailLabel>
                <DetailValue>{order.total.toFixed(2)} €</DetailValue>
              </DetailItem>
              <DetailItem>
                <DetailLabel>Produits</DetailLabel>
                <DetailValue>{order.products.length}</DetailValue>
              </DetailItem>
            </OrderDetails>

            <OrderProducts>
              {order.products.map((product, index) => (
                <ProductItem key={index}>
                  <ProductName>{product.name}</ProductName>
                  <ProductInfo>
                    <ProductQuantity>Qty: {product.qty}</ProductQuantity>
                    <ProductPrice>{(product.price * product.qty).toFixed(2)} €</ProductPrice>
                  </ProductInfo>
                </ProductItem>
              ))}
            </OrderProducts>
          </OrderCard>
        ))}
      </OrdersList>
    </TabContainer>
  );
}; 