import React from 'react';
import styled from 'styled-components';
import { CreditCard, Plus , Shield, Loader2, RefreshCw } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { cardsAPI } from '../../lib/api';

interface PaymentMethodsTabProps {
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

const CardsList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 20px;
`;

const CardItem = styled.div`
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
  font-size: 16px;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.text.primary};
`;

const CardNumber = styled.span`
  font-size: 14px;
  color: ${({ theme }) => theme.colors.text.secondary};
  font-family: 'Courier New', monospace;
`;

const CardExpiry = styled.span`
  font-size: 12px;
  color: ${({ theme }) => theme.colors.text.muted};
`;

const SecurityMessage = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  margin-top: 20px;
  padding-top: 20px;
  border-top: 1px solid ${({ theme }) => theme.colors.border};
  color: ${({ theme }) => theme.colors.text.muted};
  font-size: 12px;
`;

const AddCardButton = styled.button`
  display: flex;
  align-items: center;
  gap: 8px;
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