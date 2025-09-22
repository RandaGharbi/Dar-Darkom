import React from 'react';
import styled from 'styled-components';
import { Package, Clock, CheckCircle, XCircle, Loader2, RefreshCw } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { ordersAPI } from '../../lib/api';

interface OrdersTabProps {
  userId: string;
}

const TabContainer = styled.div`
  background: linear-gradient(135deg, rgba(59, 130, 246, 0.1), rgba(139, 92, 246, 0.1));
  border-radius: 24px;
  padding: 40px;
  position: relative;
  overflow: hidden;
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-image: 
      radial-gradient(circle at 20% 20%, rgba(59, 130, 246, 0.1) 0%, transparent 50%),
      radial-gradient(circle at 80% 80%, rgba(139, 92, 246, 0.1) 0%, transparent 50%);
    pointer-events: none;
  }
`;

const TabHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 32px;
  position: relative;
  z-index: 1;
`;

const TabTitle = styled.h3`
  font-size: 28px;
  font-weight: 800;
  background: linear-gradient(135deg, #1e293b, #475569, #64748b);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  margin: 0;
  position: relative;
  
  &::after {
    content: '';
    position: absolute;
    bottom: -8px;
    left: 0;
    width: 60px;
    height: 4px;
    background: linear-gradient(90deg, #3b82f6, #8b5cf6, #06b6d4);
    border-radius: 2px;
  }
`;

const RefreshButton = styled.button`
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 12px 20px;
  background: linear-gradient(135deg, #3b82f6, #8b5cf6);
  border: none;
  border-radius: 16px;
  color: white;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  box-shadow: 0 4px 20px rgba(59, 130, 246, 0.3);

  &:hover:not(:disabled) {
    transform: translateY(-2px);
    box-shadow: 0 8px 25px rgba(59, 130, 246, 0.4);
  }

  &:active {
    transform: translateY(0);
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
    transform: none;
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
  color: #64748b;
  position: relative;
  z-index: 1;
`;

const ErrorContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 80px 20px;
  text-align: center;
  color: #64748b;
  position: relative;
  z-index: 1;
`;

const RetryButton = styled.button`
  margin-top: 20px;
  padding: 12px 24px;
  background: linear-gradient(135deg, #3b82f6, #8b5cf6);
  color: white;
  border: none;
  border-radius: 16px;
  cursor: pointer;
  font-size: 14px;
  font-weight: 600;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  box-shadow: 0 4px 20px rgba(59, 130, 246, 0.3);

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 25px rgba(59, 130, 246, 0.4);
  }

  &:active {
    transform: translateY(0);
  }
`;

const EmptyContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 80px 20px;
  text-align: center;
  color: #64748b;
  position: relative;
  z-index: 1;
`;

const OrdersList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 24px;
  position: relative;
  z-index: 1;
`;

const OrderCard = styled.div`
  background: rgba(255, 255, 255, 0.9);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 20px;
  padding: 32px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);

  &:hover {
    transform: translateY(-4px);
    box-shadow: 0 12px 40px rgba(0, 0, 0, 0.15);
    border-color: rgba(59, 130, 246, 0.3);
  }
`;

const OrderHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
`;

const OrderId = styled.span`
  font-size: 18px;
  font-weight: 700;
  background: linear-gradient(135deg, #1e293b, #475569);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
`;

const OrderStatus = styled.span<{ status: string }>`
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 12px 20px;
  border-radius: 24px;
  font-size: 14px;
  font-weight: 600;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
  ${props => {
    switch (props.status) {
      case 'completed':
        return `
          background: linear-gradient(135deg, #10b981, #059669);
          color: white;
          border: none;
        `;
      case 'active':
        return `
          background: linear-gradient(135deg,  #3b82f6, #8b5cf6);
          color: white;
          border: none;
        `;
      case 'cancelled':
        return `
          background: linear-gradient(135deg, #ef4444, #dc2626);
          color: white;
          border: none;
        `;
      default:
        return `
          background: linear-gradient(135deg, #6b7280, #4b5563);
          color: white;
          border: none;
        `;
    }
  }}
`;

const OrderDetails = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  gap: 24px;
  margin-bottom: 24px;
  padding-bottom: 24px;
  border-bottom: 1px solid rgba(59, 130, 246, 0.2);

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    gap: 20px;
  }
`;

const DetailItem = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const DetailLabel = styled.span`
  font-size: 12px;
  color: #64748b;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.5px;
`;

const DetailValue = styled.span`
  font-size: 16px;
  font-weight: 700;
  background: linear-gradient(135deg, #1e293b, #475569);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
`;

const OrderProducts = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

const ProductItem = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px 0;
  border-bottom: 1px solid rgba(59, 130, 246, 0.1);

  &:last-child {
    border-bottom: none;
  }
`;

const ProductName = styled.span`
  font-size: 16px;
  color: #1e293b;
  font-weight: 600;
  flex: 1;
`;

const ProductInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 16px;
`;

const ProductQuantity = styled.span`
  font-size: 14px;
  color: #64748b;
  font-weight: 600;
`;

const ProductPrice = styled.span`
  font-size: 16px;
  font-weight: 700;
  background: linear-gradient(135deg, #3b82f6, #8b5cf6);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
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