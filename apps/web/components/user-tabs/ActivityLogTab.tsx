import React from 'react';
import styled from 'styled-components';
import { 
  Activity, 
  ShoppingCart, 
  Heart, 
  CreditCard, 
  User, 
  LogIn, 
  LogOut, 
  Loader2,
  RefreshCw
} from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { activitiesAPI } from '../../lib/api';

interface ActivityLogTabProps {
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

const ActivityList = styled.div`
  display: flex;
  flex-direction: column;
  position: relative;
  
  &::before {
    content: '';
    position: absolute;
    left: 24px;
    top: 48px;
    bottom: 48px;
    width: 2px;
    background: ${({ theme }) => theme.colors.border};
    z-index: 1;
  }
`;

const ActivityItem = styled.div`
  display: flex;
  align-items: flex-start;
  gap: 20px;
  padding: 16px 0;
  position: relative;
  z-index: 2;
`;

const ActivityIcon = styled.div<{ type: string }>`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 48px;
  height: 48px;
  border-radius: 50%;
  background: ${({ theme }) => theme.colors.surface};
  color: ${({ theme }) => theme.colors.text.primary};
  flex-shrink: 0;
  border: 2px solid ${({ theme }) => theme.colors.border};
  box-shadow: ${({ theme }) => theme.shadows.sm};
`;

const ActivityContent = styled.div`
  flex: 1;
  min-width: 0;
  padding-top: 4px;
`;

const ActivityTitle = styled.h4`
  font-size: 14px;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.text.primary};
  margin: 0 0 4px 0;
  line-height: 1.4;
`;

const ActivityDescription = styled.p`
  font-size: 13px;
  color: ${({ theme }) => theme.colors.text.secondary};
  margin: 0 0 6px 0;
  line-height: 1.4;
`;

const ActivityTime = styled.span`
  font-size: 12px;
  color: ${({ theme }) => theme.colors.text.muted};
  display: block;
  font-weight: 400;
`;

export const ActivityLogTab: React.FC<ActivityLogTabProps> = ({ userId }) => {
  const {
    data: activitiesData,
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: ['user-activities', userId],
    queryFn: () => activitiesAPI.getByUser(userId).then((res) => res.data),
    enabled: !!userId,
    refetchOnWindowFocus: false,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  const activities = activitiesData?.activities || [];

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'order':
        return <ShoppingCart size={20} />;
      case 'favorite':
        return <Heart size={20} />;
      case 'payment':
        return <CreditCard size={20} />;
      case 'profile':
        return <User size={20} />;
      case 'login':
        return <LogIn size={20} />;
      case 'logout':
        return <LogOut size={20} />;
      default:
        return <Activity size={20} />;
    }
  };

  if (isLoading) {
    return (
      <TabContainer>
        <TabHeader>
          <TabTitle>Journal d&apos;activité</TabTitle>
          <RefreshButton disabled>
            <Loader2 size={16} className="animate-spin" />
          </RefreshButton>
        </TabHeader>
        <LoadingContainer>
          <Loader2 size={48} className="animate-spin" />
          <p style={{ marginTop: '16px', fontSize: '14px' }}>Chargement des activités...</p>
        </LoadingContainer>
      </TabContainer>
    );
  }

  if (error) {
    return (
      <TabContainer>
        <TabHeader>
          <TabTitle>Journal d&apos;activité</TabTitle>
          <RefreshButton onClick={() => refetch()} disabled={isLoading}>
            <RefreshCw size={16} className={isLoading ? 'animate-spin' : ''} />
          </RefreshButton>
        </TabHeader>
        <ErrorContainer>
          <Activity size={48} />
          <h4 style={{ margin: '16px 0 8px 0', color: '#2d3748' }}>Erreur de chargement</h4>
          <p style={{ margin: 0, fontSize: '14px' }}>Impossible de charger les activités. Veuillez réessayer.</p>
          <RetryButton onClick={() => refetch()}>
            Réessayer
          </RetryButton>
        </ErrorContainer>
      </TabContainer>
    );
  }

  if (activities.length === 0) {
    return (
      <TabContainer>
        <TabHeader>
          <TabTitle>Journal d&apos;activité</TabTitle>
          <RefreshButton onClick={() => refetch()} disabled={isLoading}>
            <RefreshCw size={16} className={isLoading ? 'animate-spin' : ''} />
          </RefreshButton>
        </TabHeader>
        <EmptyContainer>
          <Activity size={48} />
          <h4 style={{ margin: '16px 0 8px 0', color: '#2d3748' }}>Aucune activité</h4>
          <p style={{ margin: 0, fontSize: '14px' }}>Aucune activité n&apos;a été enregistrée pour cet utilisateur.</p>
        </EmptyContainer>
      </TabContainer>
    );
  }

  return (
    <TabContainer>
      <TabHeader>
        <TabTitle>Journal d&apos;activité ({activities.length})</TabTitle>
        <RefreshButton onClick={() => refetch()} disabled={isLoading}>
          <RefreshCw size={16} className={isLoading ? 'animate-spin' : ''} />
        </RefreshButton>
      </TabHeader>

      <ActivityList>
        {activities.map((activity, index) => (
          <ActivityItem key={activity._id || `activity-${index}`}>
            <ActivityIcon type={activity.type}>
              {getActivityIcon(activity.type)}
            </ActivityIcon>
            
            <ActivityContent>
              <ActivityTitle>{activity.title}</ActivityTitle>
              {activity.description && (
                <ActivityDescription>{activity.description}</ActivityDescription>
              )}
              <ActivityTime>
                {new Date(activity.createdAt).toLocaleDateString('fr-FR', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit'
                })}
              </ActivityTime>
            </ActivityContent>
          </ActivityItem>
        ))}
      </ActivityList>
    </TabContainer>
  );
}; 