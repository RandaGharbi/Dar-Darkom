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

const ActivityList = styled.div`
  display: flex;
  flex-direction: column;
  position: relative;
  z-index: 1;
  
  &::before {
    content: '';
    position: absolute;
    left: 32px;
    top: 56px;
    bottom: 56px;
    width: 3px;
    background: linear-gradient(180deg, #3b82f6, #8b5cf6);
    border-radius: 2px;
    z-index: 1;
  }
`;

const ActivityItem = styled.div`
  display: flex;
  align-items: flex-start;
  gap: 24px;
  padding: 20px 0;
  position: relative;
  z-index: 2;
`;

const ActivityIcon = styled.div<{ type: string }>`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 64px;
  height: 64px;
  border-radius: 50%;
  background: linear-gradient(135deg, #3b82f6, #8b5cf6);
  color: white;
  flex-shrink: 0;
  border: 4px solid rgba(255, 255, 255, 0.9);
  box-shadow: 0 8px 32px rgba(59, 130, 246, 0.3);
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);

  &:hover {
    transform: scale(1.1);
    box-shadow: 0 12px 40px rgba(59, 130, 246, 0.4);
  }
`;

const ActivityContent = styled.div`
  flex: 1;
  min-width: 0;
  padding-top: 8px;
  background: rgba(255, 255, 255, 0.9);
  backdrop-filter: blur(10px);
  border-radius: 16px;
  padding: 20px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
`;

const ActivityTitle = styled.h4`
  font-size: 16px;
  font-weight: 700;
  background: linear-gradient(135deg, #1e293b, #475569);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  margin: 0 0 8px 0;
  line-height: 1.4;
`;

const ActivityDescription = styled.p`
  font-size: 14px;
  color: #64748b;
  margin: 0 0 12px 0;
  line-height: 1.5;
  font-weight: 500;
`;

const ActivityTime = styled.span`
  font-size: 13px;
  color: #64748b;
  display: block;
  font-weight: 600;
  background: linear-gradient(135deg, #3b82f6, #8b5cf6);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
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