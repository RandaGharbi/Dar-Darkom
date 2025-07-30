"use client"; 
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

import { useQuery } from '@tanstack/react-query';
import { productsAPI, ordersAPI, usersAPI, authAPI } from '../lib/api';
import { DashboardLayout } from '../components/layout/DashboardLayout';
import { GlobalStyles } from '../components/styled/GlobalStyles';
import styled from 'styled-components';
import { StatsCards } from '../components/dashboard/StatsCards';
import { RecentActivity } from '../components/dashboard/RecentActivity';
import { QuickActions } from '../components/dashboard/QuickActions';
import { Charts } from '../components/dashboard/Charts';
import { useTranslation } from '../hooks/useTranslation';
import { isAuthenticated } from '../utils/auth';
import { useNotificationManager } from '../hooks/useNotificationManager';

const PageWrapper = styled.div`
  background: ${({ theme }) => theme.colors.surface};
  min-height: 100vh;
  padding: 0;
  font-family: 'Inter', 'Segoe UI', Arial, sans-serif;
`;

const Content = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 3.5rem 2.5rem 2.5rem 2.5rem;
  
  @media (max-width: 1120px) {
    padding: 3rem 2rem 2rem 2rem;
  }
  
  @media (max-width: 1120px) {
    padding: 2rem 1rem 1rem 1rem;
  }
  
  @media (max-width: 600px) {
    padding: 1rem 0.5rem;
  }
`;

const Title = styled.h1`
  font-size: 2.7rem;
  font-weight: bold;
  color: ${({ theme }) => theme.colors.text.primary};
  margin-bottom: 0.5rem;
  
  @media (max-width: 1120px) {
    font-size: 2.2rem;
  }
  
  @media (max-width: 1120px) {
    font-size: 1.8rem;
  }
  
  @media (max-width: 480px) {
    font-size: 1.5rem;
  }
`;

const Subtitle = styled.div`
  color: ${({ theme }) => theme.colors.text.secondary};
  font-size: 1.1rem;
  margin-bottom: 2.5rem;
  
  @media (max-width: 1120px) {
    font-size: 1rem;
    margin-bottom: 2rem;
  }
  
  @media (max-width: 480px) {
    font-size: 0.9rem;
    margin-bottom: 1.5rem;
  }
`;

const TwoColumnGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 2.5rem;
  margin-bottom: 2.5rem;
  
  @media (max-width: 1120px) {
    grid-template-columns: 1fr;
    gap: 1.5rem;
    margin-bottom: 2rem;
  }
  
  @media (max-width: 480px) {
    gap: 1rem;
    margin-bottom: 1.5rem;
  }
`;

const HeaderContainer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
  
  @media (max-width: 1120px) {
    margin-bottom: 1.5rem;
  }
  
  @media (max-width: 480px) {
    margin-bottom: 1rem;
  }
`;

export default function DashboardPage() {
  const router = useRouter();
  const { t } = useTranslation();
  const [isLoading, setIsLoading] = useState(true);

  // Vérifier l'authentification une seule fois au chargement
  useEffect(() => {
    const checkAuth = () => {
      if (!isAuthenticated()) {
        router.replace('/login');
      } else {
        setIsLoading(false);
      }
    };

    checkAuth();
  }, [router]);

  const { data: products = [] } = useQuery({
    queryKey: ['products'],
    queryFn: () => productsAPI.getAll().then(res => res.data),
    enabled: !isLoading, // Ne pas exécuter si on est en train de vérifier l'auth
  });

  const { data: orders = [] } = useQuery({
    queryKey: ['orders'],
    queryFn: () => ordersAPI.getAll().then(res => res.data),
    enabled: !isLoading,
  });

  const { data: users = [] } = useQuery({
    queryKey: ['users'],
    queryFn: () => usersAPI.getAll().then(res => res.data),
    enabled: !isLoading,
  });

  // Récupérer l'utilisateur connecté pour les notifications
  const { data: currentUser } = useQuery({
    queryKey: ['user'],
    queryFn: () => authAPI.getMe().then(res => res.data),
    enabled: !isLoading,
  });

  // Gérer les notifications automatiquement
  useNotificationManager({
    userId: currentUser?._id || '',
    products,
    orders,
    users,
  });

  // Afficher un loader pendant la vérification d'authentification
  if (isLoading) {
    return (
      <PageWrapper>
        <GlobalStyles />
        <Content>
          <div style={{ textAlign: 'center', padding: '2rem' }}>
            Chargement...
          </div>
        </Content>
      </PageWrapper>
    );
  }

  return (
    <PageWrapper>
      <GlobalStyles />
      <DashboardLayout>
        <Content>
          <HeaderContainer>
            <div>
              <Title>{t('dashboard.title')}</Title>
              <Subtitle>{t('dashboard.subtitle')}</Subtitle>
            </div>
          </HeaderContainer>

          <StatsCards products={products} orders={orders} users={users} />

          <TwoColumnGrid>
            <RecentActivity products={products} orders={orders} users={users} />
            <QuickActions />
          </TwoColumnGrid>

          <Charts products={products} orders={orders} users={users} />
        </Content>
      </DashboardLayout>
    </PageWrapper>
  );
}
