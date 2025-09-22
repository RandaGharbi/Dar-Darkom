"use client"; 
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';

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

const PageWrapper = styled.div`
  background: linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%);
  min-height: 100vh;
  padding: 0;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', sans-serif;
  position: relative;
  
  &::before {
    content: '';
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-image: 
      radial-gradient(circle at 20% 80%, rgba(120, 119, 198, 0.1) 0%, transparent 50%),
      radial-gradient(circle at 80% 20%, rgba(255, 119, 198, 0.1) 0%, transparent 50%),
      radial-gradient(circle at 40% 40%, rgba(120, 219, 255, 0.1) 0%, transparent 50%);
    pointer-events: none;
    z-index: 0;
  }
`;

const Content = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 40px 32px 32px 32px;
  position: relative;
  z-index: 1;
  
  @media (max-width: 1120px) {
    padding: 32px 24px 24px 24px;
  }
  
  @media (max-width: 600px) {
    padding: 24px 16px 16px 16px;
  }
`;

const Title = styled.h1`
  font-size: 36px;
  font-weight: 800;
  background: linear-gradient(135deg, #1e293b, #475569, #64748b);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  margin-bottom: 12px;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', sans-serif;
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
  
  @media (max-width: 1120px) {
    font-size: 32px;
  }
  
  @media (max-width: 480px) {
    font-size: 28px;
  }
`;

const Subtitle = styled.div`
  color: #64748b;
  font-size: 18px;
  margin-bottom: 40px;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', sans-serif;
  font-weight: 500;
  line-height: 1.6;
  
  @media (max-width: 1120px) {
    font-size: 16px;
    margin-bottom: 32px;
  }
  
  @media (max-width: 480px) {
    font-size: 15px;
    margin-bottom: 24px;
  }
`;

const TwoColumnGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 24px;
  margin-bottom: 32px;
  
  @media (max-width: 1120px) {
    grid-template-columns: 1fr;
    gap: 20px;
    margin-bottom: 24px;
  }
  
  @media (max-width: 480px) {
    gap: 16px;
    margin-bottom: 20px;
  }
`;

const HeaderContainer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 32px;
  
  @media (max-width: 1120px) {
    margin-bottom: 24px;
  }
  
  @media (max-width: 480px) {
    margin-bottom: 20px;
  }
`;

const HeroSection = styled.div`
  background: linear-gradient(135deg, rgba(59, 130, 246, 0.1), rgba(139, 92, 246, 0.1));
  border-radius: 24px;
  padding: 40px;
  margin-bottom: 40px;
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

const HeroContent = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 40px;
  align-items: center;
  position: relative;
  z-index: 1;
  
  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    gap: 24px;
  }
`;

const HeroText = styled.div`
  h2 {
    font-size: 2.5rem;
    font-weight: 800;
    background: linear-gradient(135deg, #1e293b, #475569);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
    margin-bottom: 16px;
    line-height: 1.2;
  }
  
  p {
    font-size: 1.1rem;
    color: #64748b;
    line-height: 1.6;
    margin-bottom: 24px;
  }
  
  @media (max-width: 768px) {
    h2 {
      font-size: 2rem;
    }
    
    p {
      font-size: 1rem;
    }
  }
`;

const HeroImages = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;
  height: 300px;
  
  @media (max-width: 768px) {
    height: 200px;
  }
`;

const ImageContainer = styled.div`
  position: relative;
  border-radius: 16px;
  overflow: hidden;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
  transition: transform 0.3s ease;
  
  &:hover {
    transform: scale(1.05);
  }
  
  &:nth-child(1) {
    grid-row: 1 / 3;
  }
  
  &:nth-child(2) {
    grid-row: 1 / 2;
  }
  
  &:nth-child(3) {
    grid-row: 2 / 3;
  }
`;

const ImageOverlay = styled.div`
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  background: linear-gradient(transparent, rgba(0, 0, 0, 0.7));
  color: white;
  padding: 16px;
  font-size: 0.9rem;
  font-weight: 600;
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
              <Title>Tableau de Bord DarDarkom</Title>
              <Subtitle>
                Bienvenue dans votre espace d'administration. Gérez vos produits, commandes et clients 
                avec une interface moderne inspirée de la beauté de la Tunisie.
              </Subtitle>
            </div>
          </HeaderContainer>

          <HeroSection>
            <HeroContent>
              <HeroText>
                <h2>Découvrez la Tunisie</h2>
                <p>
                  Notre plateforme s'inspire de la richesse culturelle et de la beauté naturelle 
                  de la Tunisie. De Carthage à Sidi Bou Saïd, chaque élément de notre interface 
                  reflète l'élégance et l'authenticité tunisienne.
                </p>
              </HeroText>
              <HeroImages>
                <ImageContainer>
                  <Image
                    src="https://www.saraesploratrice.it/wp-content/uploads/2025/03/sidi-bou-said-1.jpeg"
                    alt="Sidi Bou Saïd, Tunisie"
                    fill
                    style={{ objectFit: 'cover' }}
                  />
                  <ImageOverlay>Sidi Bou Saïd</ImageOverlay>
                </ImageContainer>
                <ImageContainer>
                  <Image
                    src="https://villa-romana-monastir.com/wp-content/uploads/2019/01/site-archeologique-de-carthage-en-tunisie-1024x565.jpg"
                    alt="Carthage, Tunisie"
                    fill
                    style={{ objectFit: 'cover' }}
                  />
                  <ImageOverlay>Carthage</ImageOverlay>
                </ImageContainer>
                <ImageContainer>
                  <Image
                    src="https://www.decouvertemonde.com/wp-content/uploads/2022/04/Ribat-Sousse-ou-aller-en-Tunisie-itineraire.jpg"
                    alt="Tunis, Tunisie"
                    fill
                    style={{ objectFit: 'cover' }}
                  />
                  <ImageOverlay>Tunis</ImageOverlay>
                </ImageContainer>
              </HeroImages>
            </HeroContent>
          </HeroSection>

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
