import React from 'react';
import styled from 'styled-components';
import { CreditCard, Plus , Shield, Loader2, RefreshCw } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { cardsAPI } from '../../lib/api';

interface PaymentMethodsTabProps {
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

const CardsList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 24px;
  position: relative;
  z-index: 1;
`;

const CardItem = styled.div`
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

const CardHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
`;

const CardInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 16px;
`;

const CardLogo = styled.div<{ $cardType?: string }>`
  width: 48px;
  height: 32px;
  border-radius: 6px;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  background: ${({ theme }) => theme.colors.surface};
`;

const CardImage = styled.img`
  width: 100%;
  height: 100%;
  object-fit: contain;
`;

const CardDetails = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
`;

const CardName = styled.span`
  font-size: 18px;
  font-weight: 700;
  background: linear-gradient(135deg, #1e293b, #475569);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
`;

const CardNumber = styled.span`
  font-size: 16px;
  color: #64748b;
  font-family: 'Courier New', monospace;
  font-weight: 600;
`;

const CardExpiry = styled.span`
  font-size: 14px;
  color: #64748b;
  font-weight: 500;
`;

const SecurityMessage = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  margin-top: 24px;
  padding-top: 24px;
  border-top: 1px solid rgba(59, 130, 246, 0.2);
  color: #64748b;
  font-size: 14px;
  font-weight: 500;
`;

const AddCardButton = styled.button`
  display: flex;
  align-items: center;
  gap: 8px;
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

export const PaymentMethodsTab: React.FC<PaymentMethodsTabProps> = ({ userId }) => {

  const {
    data: cards = [],
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: ['user-cards', userId],
    queryFn: () => cardsAPI.getByUser(userId).then((res) => res.data),
    enabled: !!userId,
    refetchOnWindowFocus: false,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });


  const handleAddCard = () => {
    // Ici vous pouvez ouvrir un modal d'ajout ou naviguer vers une page d'ajout
    console.log('Ajouter une nouvelle carte');
  };

  const getCardImage = (cardNumber: string | undefined): string | undefined => {
    if (!cardNumber) return undefined;
    
    const firstDigit = cardNumber.charAt(0);
    switch (firstDigit) {
      case '4':
        return '/visa.png';
      case '5':
        return '/masterCard.png';
      case '3':
        return '/amex.png'; // Si vous avez une image AMEX
      default:
        return undefined;
    }
  };

  const getLast4Digits = (cardNumber: string | undefined) => {
    if (!cardNumber) return '0000';
    return cardNumber.slice(-4);
  };

  const parseExpiryDate = (expiryDate: string | undefined) => {
    if (!expiryDate) return { month: 0, year: 0 };
    
    try {
      const [month, year] = expiryDate.split('/');
      return {
        month: parseInt(month || '0'),
        year: parseInt(year || '0')
      };
    } catch {
      return { month: 0, year: 0 };
    }
  };

  if (isLoading) {
    return (
      <TabContainer>
        <TabHeader>
          <TabTitle>Méthodes de paiement</TabTitle>
          <RefreshButton disabled>
            <Loader2 size={16} className="animate-spin" />
          </RefreshButton>
        </TabHeader>
        <LoadingContainer>
          <Loader2 size={48} className="animate-spin" />
          <p style={{ marginTop: '16px', fontSize: '14px' }}>Chargement des cartes...</p>
        </LoadingContainer>
      </TabContainer>
    );
  }

  if (error) {
    return (
      <TabContainer>
        <TabHeader>
          <TabTitle>Méthodes de paiement</TabTitle>
          <RefreshButton onClick={() => refetch()} disabled={isLoading}>
            <RefreshCw size={16} className={isLoading ? "animate-spin" : ""} />
          </RefreshButton>
        </TabHeader>
        <ErrorContainer>
          <CreditCard size={48} />
          <h4 style={{ margin: '16px 0 8px 0', color: '#2d3748' }}>Erreur de chargement</h4>
          <p style={{ margin: 0, fontSize: '14px' }}>
            Impossible de charger les cartes. Veuillez réessayer.
          </p>
          <RetryButton onClick={() => refetch()}>
            Réessayer
          </RetryButton>
        </ErrorContainer>
      </TabContainer>
    );
  }

  if (cards.length === 0) {
    return (
      <TabContainer>
        <TabHeader>
          <TabTitle>Méthodes de paiement</TabTitle>
          <RefreshButton onClick={() => refetch()} disabled={isLoading}>
            <RefreshCw size={16} className={isLoading ? "animate-spin" : ""} />
          </RefreshButton>
        </TabHeader>
        <EmptyContainer>
          <CreditCard size={48} />
          <h4 style={{ margin: '16px 0 8px 0', color: '#2d3748' }}>Aucune carte</h4>
          <p style={{ margin: 0, fontSize: '14px' }}>
            Cet utilisateur n&apos;a pas encore ajouté de cartes de paiement.
          </p>
          <AddCardButton onClick={handleAddCard} style={{ marginTop: '20px' }}>
            <Plus size={16} />
            Ajouter une nouvelle carte
          </AddCardButton>
        </EmptyContainer>
      </TabContainer>
    );
  }

  return (
    <TabContainer>
      <TabHeader>
        <TabTitle>Méthodes de paiement ({cards.length})</TabTitle>
        <RefreshButton onClick={() => refetch()} disabled={isLoading}>
          <RefreshCw size={16} className={isLoading ? "animate-spin" : ""} />
        </RefreshButton>
      </TabHeader>

      <CardsList>
        {cards.map((card) => {
          const expiry = parseExpiryDate(card.expiryDate);
          
          return (
            <CardItem key={card._id}>
              <CardHeader>
                <CardInfo>
                  <CardLogo $cardType={getCardImage(card.cardNumber || '')}>
                    {getCardImage(card.cardNumber || '') ? (
                      <CardImage src={getCardImage(card.cardNumber || '')} alt="Card logo" />
                    ) : (
                      <span style={{ fontSize: '10px', fontWeight: 'bold', color: '#666' }}>CARD</span>
                    )}
                  </CardLogo>
                  <CardDetails>
                    <CardName>{card.nameOnCard}</CardName>
                    <CardNumber>**** **** **** {getLast4Digits(card.cardNumber || '')}</CardNumber>
                    <CardExpiry>Expire {expiry.month.toString().padStart(2, '0')}/{expiry.year}</CardExpiry>
                  </CardDetails>
                </CardInfo>
              </CardHeader>
            </CardItem>
          );
        })}
      </CardsList>

      <SecurityMessage>
        <Shield size={16} />
        Vos informations de paiement sont sécurisées et chiffrées
      </SecurityMessage>
    </TabContainer>
  );
}; 