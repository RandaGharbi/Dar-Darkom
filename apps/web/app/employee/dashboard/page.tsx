"use client";
import React, { useState, useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import styled from 'styled-components';
import Image from 'next/image';
import { employeeAPI } from '../../../lib/api';
import { GlobalStyles } from '../../../components/styled/GlobalStyles';
import { 
  User as UserIcon, 
  Bell,
  Mail,
  Menu,
  LogOut,
  CheckCircle,
  Package,
  Clock
} from 'lucide-react';

const PageWrapper = styled.div`
  background: #f8f9fa;
  min-height: 100vh;
  padding: 0;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', sans-serif;
  position: relative;
`;

const TopBar = styled.header`
  display: flex;
  align-items: center;
  justify-content: space-between;
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(20px);
  height: 100px;
  padding: 0 32px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.2);
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);

  @media (max-width: 1120px) {
    padding: 0 16px;
    height: 90px;
  }

  @media (max-width: 480px) {
    padding: 0 12px;
    height: 80px;
  }
`;

const MenuButton = styled.button`
  display: none;
  align-items: center;
  justify-content: center;
  width: 2.5rem;
  height: 2.5rem;
  border: none;
  background: none;
  cursor: pointer;
  color: #1e293b;
  border-radius: 8px;
  transition: background-color 0.2s;

  &:hover {
    background-color: #f1f5f9;
  }

  @media (max-width: 1120px) {
    display: flex;
  }
`;

const UserMenu = styled.div`
  display: flex;
  align-items: center;
  gap: 16px;

  @media (max-width: 1120px) {
  gap: 12px;
  }

  @media (max-width: 480px) {
    gap: 8px;
  }
`;

const UserAvatar = styled.div`
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: #f8fafc;
  border: 1px solid #e2e8f0;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  font-weight: 600;
  color: #64748b;

  @media (max-width: 1120px) {
    width: 36px;
    height: 36px;
  font-size: 14px;
  }

  @media (max-width: 480px) {
    width: 32px;
    height: 32px;
    font-size: 12px;
  }
`;

const LogoImg = styled.img`
  height: 80px;
  width: auto;
  max-width: 280px;
  object-fit: contain;
  margin-right: 32px;
  cursor: pointer;

  @media (max-width: 1120px) {
    height: 70px;
    margin-right: 16px;
    max-width: 220px;
  }

  @media (max-width: 480px) {
    height: 60px;
    margin-right: 12px;
    max-width: 180px;
  }
`;

const LogoutButton = styled.button`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 1rem;
  border: none;
  background: none;
  color: #64748b;
  cursor: pointer;
  transition: color 0.2s ease;
  border-radius: 8px;

  &:hover {
    color: #dc2626;
    background-color: #fef2f2;
  }
`;

const HeaderControls = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
`;

const NotificationButton = styled.button`
  background: none;
  border: none;
  color: #64748b;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 8px;
  margin-right: 12px;
  transition: color 0.2s ease;
  border-radius: 8px;
  position: relative;

  &:hover {
    color: #3b82f6;
    background-color: #f0f8ff;
  }
`;

const MessageButton = styled.button`
  color: #64748b;
  font-weight: 500;
  text-decoration: none;
  padding: 0.75rem 1.25rem;
  border-radius: 12px;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  white-space: nowrap;
  background: none;
  border: none;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 12px;

  &:hover {
    color: #1e293b;
    background-color: #f1f5f9;
    transform: translateY(-1px);
  }

  &:active {
    transform: translateY(0);
  }

  @media (max-width: 1120px) {
    padding: 0.6rem 1rem;
    font-size: 0.9rem;
  }

  @media (max-width: 480px) {
    padding: 0.5rem 0.8rem;
  }
`;

const HorizontalNavWrapper = styled.div`
  width: 100%;
  display: flex;
  justify-content: center;
  background: #ffffff;
  padding: 0.5rem 0;

  @media (max-width: 1120px) {
    display: none;
  }
`;

const StyledNav = styled.nav<{ $horizontal?: boolean }>`
  display: flex;
  flex-direction: ${(props) => (props.$horizontal ? "row" : "column")};
  gap: ${(props) => (props.$horizontal ? "1.5rem" : "1rem")};
  justify-content: ${(props) => (props.$horizontal ? "center" : "flex-start")};
  align-items: center;
  width: 100%;
  font-size: 17px;
  padding: ${(props) => (props.$horizontal ? "0" : "1rem 1.5rem")};

  @media (max-width: 1120px) {
    font-size: ${(props) => (props.$horizontal ? "14px" : "16px")};
    gap: ${(props) => (props.$horizontal ? "1rem" : "0.75rem")};
  }

  @media (max-width: 480px) {
    font-size: ${(props) => (props.$horizontal ? "13px" : "15px")};
    gap: ${(props) => (props.$horizontal ? "0.75rem" : "0.5rem")};
  }
`;

const NavItemBase = styled.div<{ $active?: boolean }>`
  color: ${(props) =>
    props.$active
      ? '#1e293b'
      : '#64748b'};
  font-weight: ${(props) => (props.$active ? "700" : "500")};
  text-decoration: none;
  padding: 0.75rem 1.25rem;
  border-radius: 12px;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  white-space: nowrap;
  position: relative;
  background: ${(props) => props.$active ? 'linear-gradient(135deg, rgba(59, 130, 246, 0.1), rgba(139, 92, 246, 0.1))' : 'transparent'};
  border: ${(props) => props.$active ? '1px solid rgba(59, 130, 246, 0.2)' : '1px solid transparent'};
  
  &:hover {
    color: #1e293b;
    background: linear-gradient(135deg, rgba(59, 130, 246, 0.05), rgba(139, 92, 246, 0.05));
    border-color: rgba(59, 130, 246, 0.1);
    transform: translateX(4px);
  }
  
  @media (max-width: 1120px) {
    padding: 0.6rem 1rem;
  }
  @media (max-width: 480px) {
    padding: 0.5rem 0.8rem;
  }
`;


const LanguageSelector = styled.div`
    display: flex;
    align-items: center;
  gap: 8px;
  margin-left: 16px;
`;

const FlagIcon = styled.div`
  width: 20px;
  height: 15px;
  background: linear-gradient(90deg, #002395 33%, #ffffff 33%, #ffffff 66%, #c8102e 66%);
  border-radius: 2px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.2);
`;

const EmployeeStatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 24px;
  margin-bottom: 40px;
  
  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    gap: 20px;
  }
`;

const StatCard = styled.div`
  background: rgba(255, 255, 255, 0.9);
  backdrop-filter: blur(20px);
  border-radius: 20px;
  padding: 32px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 4px;
    background: #3b82f6;
  }
  
  &:hover {
    transform: translateY(-8px);
    box-shadow: 0 16px 48px rgba(0, 0, 0, 0.15);
    background: rgba(255, 255, 255, 0.95);
  }
`;

const StatHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 20px;
`;

const StatIcon = styled.div<{ $color: string }>`
  width: 48px;
  height: 48px;
  border-radius: 12px;
  background: ${({ $color }) => $color};
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
`;

const StatTitle = styled.h3`
  font-size: 14px;
  font-weight: 600;
  color: #6b7280;
  margin: 0;
  text-transform: uppercase;
  letter-spacing: 0.5px;
`;

const StatValue = styled.div`
  font-size: 36px;
  font-weight: 800;
  color: #1f2937;
  margin-bottom: 8px;
  line-height: 1;
`;

const StatLabel = styled.div`
  font-size: 16px;
  color: #64748b;
  font-weight: 500;
`;

const TrendIndicator = styled.div<{ $positive: boolean }>`
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: 14px;
  font-weight: 600;
  color: ${({ $positive }) => $positive ? '#10b981' : '#ef4444'};
  margin-top: 8px;
`;

const TrendArrow = styled.div<{ $positive: boolean }>`
  width: 0;
  height: 0;
  border-left: 4px solid transparent;
  border-right: 4px solid transparent;
  border-bottom: ${({ $positive }) => $positive ? '6px solid #10b981' : '6px solid #ef4444'};
  transform: ${({ $positive }) => $positive ? 'rotate(0deg)' : 'rotate(180deg)'};
`;

const EmployeeTasksSection = styled.div`
  background: rgba(255, 255, 255, 0.9);
  backdrop-filter: blur(20px);
  border-radius: 20px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
  overflow: hidden;
  position: relative;
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 4px;
    background: #3b82f6;
  }
`;

const SectionHeader = styled.div`
  padding: 24px 24px 16px 24px;
  border-bottom: 1px solid #e5e7eb;
  background: linear-gradient(135deg, #f8fafc, #f1f5f9);
`;

const SectionTitle = styled.h2`
  font-size: 18px;
  font-weight: 700;
  color: #1f2937;
  margin: 0;
`;

const TasksList = styled.div`
  padding: 16px 0;
`;

const TaskItem = styled.div`
  display: flex;
  align-items: center;
  padding: 16px 24px;
  border-bottom: 1px solid #f3f4f6;
  transition: all 0.2s ease;

  &:hover {
    background: #f9fafb;
  }

  &:last-child {
    border-bottom: none;
  }
`;

const TaskIcon = styled.div<{ $color: string }>`
  width: 32px;
  height: 32px;
  border-radius: 8px;
  background: ${({ $color }) => $color};
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  margin-right: 12px;
  flex-shrink: 0;
`;

const TaskContent = styled.div`
  flex: 1;
  min-width: 0;
`;

const TaskTitle = styled.div`
  font-size: 14px;
  font-weight: 600;
  color: #1f2937;
  margin-bottom: 4px;
`;

const TaskDescription = styled.div`
  font-size: 12px;
  color: #6b7280;
`;

const TaskStatus = styled.div<{ $priority: 'high' | 'medium' | 'low' }>`
  padding: 4px 8px;
  border-radius: 12px;
  font-size: 11px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  
  ${({ $priority }) => {
    switch ($priority) {
      case 'high':
        return 'background: #fef2f2; color: #dc2626;';
      case 'medium':
        return 'background: #fef3c7; color: #d97706;';
      case 'low':
        return 'background: #ecfdf5; color: #059669;';
    }
  }}
`;

const EmployeeQuickActions = styled.div`
  background: rgba(255, 255, 255, 0.9);
  backdrop-filter: blur(20px);
  border-radius: 20px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
  overflow: hidden;
  position: relative;
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 4px;
    background: #3b82f6;
  }
`;

const ActionsGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 12px;
  padding: 16px 24px 24px 24px;
`;

const ActionCard = styled.div<{ $primary?: boolean }>`
  background: ${({ $primary }) => $primary ? '#3b82f6' : 'rgba(255, 255, 255, 0.8)'};
  backdrop-filter: blur(10px);
  border: 1px solid ${({ $primary }) => $primary ? 'transparent' : 'rgba(255, 255, 255, 0.3)'};
  border-radius: 16px;
  padding: 20px;
  text-align: center;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: ${({ $primary }) => $primary ? '0 8px 24px rgba(102, 126, 234, 0.3)' : '0 4px 16px rgba(0, 0, 0, 0.1)'};
  
  &:hover {
    transform: translateY(-4px);
    box-shadow: ${({ $primary }) => $primary ? '0 12px 32px rgba(102, 126, 234, 0.4)' : '0 8px 24px rgba(0, 0, 0, 0.15)'};
    background: ${({ $primary }) => $primary ? 'linear-gradient(135deg, #5a67d8, #6b46c1)' : 'rgba(255, 255, 255, 0.9)'};
  }
`;

const ActionIcon = styled.div`
  width: 40px;
  height: 40px;
  border-radius: 10px;
  background: rgba(255, 255, 255, 0.2);
    display: flex;
    align-items: center;
  justify-content: center;
  color: white;
  margin: 0 auto 8px auto;
`;

const ActionTitle = styled.div`
  font-size: 12px;
    font-weight: 600;
  color: white;
  margin-bottom: 4px;
`;

const ActionDescription = styled.div`
  font-size: 10px;
  color: rgba(255, 255, 255, 0.8);
`;

const navigationItems = [
  { href: "/employee/dashboard", label: "Tableau de Bord" },
  { href: "/employee/orders", label: "Commandes" },
  { href: "/employee/tasks", label: "Tâches" },
  { href: "/employee/schedule", label: "Planning" },
];

// Composant Logo conditionnel
const AdaptiveLogo = () => {
  const [mounted, setMounted] = useState(false);
  const router = useRouter();
  
  useEffect(() => {
    setMounted(true);
  }, []);

  const handleLogoClick = () => {
    router.push('/employee/dashboard');
  };

  // Ne rendre que côté client pour éviter l'hydratation
  if (!mounted) {
    return <div style={{ width: '320px', height: '80px' }} />;
  }

  return (
    <div style={{ display: 'flex', alignItems: 'center' }}>
      <LogoImg 
        src="/LogoDarDarkom.png" 
        alt="DarDarkom" 
        onClick={handleLogoClick}
        style={{ cursor: 'pointer' }}
      />
      <div style={{ 
        fontSize: '14px', 
        fontWeight: '600', 
        color: '#8b4513',
        fontFamily: 'Georgia, serif',
        textShadow: '1px 1px 2px rgba(0, 0, 0, 0.1)',
        marginLeft: '4px'
      }}>
        Employé
      </div>
    </div>
  );
};

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

const HeroSection = styled.div`
  background: rgba(255, 255, 255, 0.9);
  backdrop-filter: blur(20px);
  border-radius: 24px;
  padding: 40px;
  margin-bottom: 40px;
  position: relative;
  overflow: hidden;
  box-shadow: 0 16px 48px rgba(0, 0, 0, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
  transition: all 0.3s ease;
  
  &::before {
    content: '';
    position: absolute;
  top: 0;
  left: 0;
  right: 0;
    height: 4px;
    background: #3b82f6;
  }
  
  &:hover {
    transform: translateY(-4px);
    box-shadow: 0 20px 60px rgba(0, 0, 0, 0.15);
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



export default function EmployeeDashboard() {
  const router = useRouter();
  const pathname = usePathname();
  const queryClient = useQueryClient();
  const [isAuthChecked, setIsAuthChecked] = useState(false);

  // Vérifier l'authentification
  useEffect(() => {
    const checkAuth = () => {
    const token = localStorage.getItem('token');
    if (!token) {
        router.replace('/login?fromLogout=true');
      return;
    }

    try {
      const tokenParts = token.split('.');
      if (tokenParts.length !== 3) {
        router.replace('/login?fromLogout=true');
        return;
      }
      const payload = JSON.parse(atob(tokenParts[1]));
      if (payload.role !== 'EMPLOYE') {
        router.replace('/login?fromLogout=true');
        return;
      }
      setIsAuthChecked(true);
    } catch (error) {
      console.error('Token parsing error:', error);
      router.replace('/login?fromLogout=true');
      return;
    }
    };

    checkAuth();
  }, [router]);

  // Récupérer les commandes
  const { data: ordersResponse, isLoading: ordersLoading } = useQuery({
    queryKey: ['employee-orders'],
    queryFn: () => employeeAPI.getOrders(['PENDING', 'READY']),
    refetchInterval: false, // Désactiver le refresh automatique
    staleTime: 5 * 60 * 1000, // 5 minutes
    enabled: isAuthChecked, // Ne s'exécuter que si l'auth est vérifiée
  });

  const orders = ordersResponse?.data?.data || [];


  const handleLogout = async () => {
    try {
      console.log('🚪 Déconnexion en cours...');
      
      // Nettoyer les queries
      queryClient.clear();
      
      // Supprimer le token localement
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      
      console.log('✅ Données locales supprimées');
      
      // Forcer la redirection vers la page de login
      router.replace('/login?fromLogout=true');
      
    } catch (error) {
      console.error('❌ Erreur lors de la déconnexion:', error);
      // Même en cas d'erreur, on supprime le token localement
      queryClient.clear();
    localStorage.removeItem('token');
    localStorage.removeItem('user');
      router.replace('/login?fromLogout=true');
    }
  };


  if (!isAuthChecked || ordersLoading) {
    return (
      <PageWrapper>
        <GlobalStyles />
        <TopBar>
          <div style={{ display: "flex", alignItems: "center" }}>
            <MenuButton>
              <Menu size={24} />
            </MenuButton>
            <AdaptiveLogo />
            <LanguageSelector>
              <FlagIcon />
            </LanguageSelector>
          </div>

          <HorizontalNavWrapper>
            <StyledNav $horizontal>
              {navigationItems.map((item) => (
                <Link key={item.href} href={item.href}>
                  <NavItemBase $active={pathname === item.href}>
                    {item.label}
                  </NavItemBase>
                </Link>
              ))}
            </StyledNav>
          </HorizontalNavWrapper>

          <UserMenu>
            <HeaderControls>
              <MessageButton>
                <Mail size={20} />
              </MessageButton>
              <NotificationButton>
                <Bell size={20} />
              </NotificationButton>
            </HeaderControls>

            <UserAvatar>
              A
            </UserAvatar>
            <LogoutButton onClick={handleLogout}>
              <LogOut size={16} />
            </LogoutButton>
          </UserMenu>
        </TopBar>
        <Content>
          <div style={{ textAlign: 'center', padding: '2rem' }}>
            <p style={{ marginTop: '1rem', color: '#6b7280' }}>Chargement des commandes...</p>
          </div>
        </Content>
      </PageWrapper>
    );
  }

  return (
    <PageWrapper>
      <GlobalStyles />
      <TopBar>
        <div style={{ display: "flex", alignItems: "center" }}>
          <MenuButton>
            <Menu size={24} />
          </MenuButton>
          <AdaptiveLogo />
          <LanguageSelector>
            <FlagIcon />
          </LanguageSelector>
        </div>

          <HorizontalNavWrapper>
            <StyledNav $horizontal>
              {navigationItems.map((item) => (
                <Link key={item.href} href={item.href}>
                  <NavItemBase $active={pathname === item.href}>
                    {item.label}
                  </NavItemBase>
                </Link>
              ))}
            </StyledNav>
          </HorizontalNavWrapper>

        <UserMenu>
          <HeaderControls>
            <MessageButton>
              <Mail size={20} />
            </MessageButton>
            <NotificationButton>
              <Bell size={20} />
            </NotificationButton>
          </HeaderControls>

          <UserAvatar>
            A
          </UserAvatar>
          <LogoutButton onClick={handleLogout}>
            <LogOut size={16} />
          </LogoutButton>
        </UserMenu>
      </TopBar>

      <Content>
        <HeaderContainer>
          <div>
            <Title>Tableau de Bord Employé</Title>
            <Subtitle>
              Bienvenue dans votre espace de travail. Gérez vos tâches, commandes et planning 
              avec une interface moderne inspirée de la beauté de la Tunisie.
            </Subtitle>
          </div>
        </HeaderContainer>

        <HeroSection>
          <HeroContent>
            <HeroText>
              <h2>Votre Espace de Travail</h2>
              <p>
                Gérez efficacement vos tâches quotidiennes et contribuez à la réussite de notre équipe. 
                Votre interface de travail s'inspire de l'élégance tunisienne pour vous offrir 
                une expérience professionnelle et motivante.
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

        <EmployeeStatsGrid>
          <StatCard>
            <StatHeader>
              <StatTitle>MES TÂCHES</StatTitle>
              <StatIcon $color="#3b82f6">
                <CheckCircle size={24} />
              </StatIcon>
            </StatHeader>
            <StatValue>5</StatValue>
            <StatLabel>Tâches assignées</StatLabel>
            <TrendIndicator $positive={true}>
              <TrendArrow $positive={true} />
              +2 cette semaine
            </TrendIndicator>
          </StatCard>

          <StatCard>
            <StatHeader>
              <StatTitle>COMMANDES TRAITÉES</StatTitle>
              <StatIcon $color="#10b981">
                <Package size={24} />
              </StatIcon>
            </StatHeader>
            <StatValue>{orders.length}</StatValue>
            <StatLabel>Cette semaine</StatLabel>
            <TrendIndicator $positive={true}>
              <TrendArrow $positive={true} />
              +15% vs semaine dernière
            </TrendIndicator>
          </StatCard>

          <StatCard>
            <StatHeader>
              <StatTitle>HEURES TRAVAILLÉES</StatTitle>
              <StatIcon $color="#f59e0b">
                <Clock size={24} />
              </StatIcon>
            </StatHeader>
            <StatValue>32.5</StatValue>
            <StatLabel>Cette semaine</StatLabel>
            <TrendIndicator $positive={true}>
              <TrendArrow $positive={true} />
              +2h vs semaine dernière
            </TrendIndicator>
          </StatCard>
        </EmployeeStatsGrid>

        <TwoColumnGrid>
          <EmployeeTasksSection>
          <SectionHeader>
              <SectionTitle>Mes Tâches du Jour</SectionTitle>
          </SectionHeader>
            <TasksList>
              <TaskItem>
                <TaskIcon $color="#3b82f6">
                  <Package size={16} />
                </TaskIcon>
                <TaskContent>
                  <TaskTitle>Traiter les commandes en attente</TaskTitle>
                  <TaskDescription>5 commandes nécessitent votre attention</TaskDescription>
                </TaskContent>
                <TaskStatus $priority="high">Urgent</TaskStatus>
              </TaskItem>
              <TaskItem>
                <TaskIcon $color="#10b981">
                            <CheckCircle size={16} />
                </TaskIcon>
                <TaskContent>
                  <TaskTitle>Vérifier l'inventaire</TaskTitle>
                  <TaskDescription>Contrôle des stocks disponibles</TaskDescription>
                </TaskContent>
                <TaskStatus $priority="medium">En cours</TaskStatus>
              </TaskItem>
              <TaskItem>
                <TaskIcon $color="#f59e0b">
                  <Clock size={16} />
                </TaskIcon>
                <TaskContent>
                  <TaskTitle>Préparer les livraisons</TaskTitle>
                  <TaskDescription>Emballage des commandes prêtes</TaskDescription>
                </TaskContent>
                <TaskStatus $priority="low">Planifié</TaskStatus>
              </TaskItem>
            </TasksList>
          </EmployeeTasksSection>

          <EmployeeQuickActions>
            <SectionHeader>
              <SectionTitle>Actions Rapides</SectionTitle>
            </SectionHeader>
            <ActionsGrid>
              <ActionCard $primary>
                <ActionIcon>
                  <Package size={24} />
                </ActionIcon>
                <ActionTitle>Nouvelle Commande</ActionTitle>
                <ActionDescription>Enregistrer une commande</ActionDescription>
              </ActionCard>
              <ActionCard>
                <ActionIcon>
                  <CheckCircle size={24} />
                </ActionIcon>
                <ActionTitle>Marquer Terminé</ActionTitle>
                <ActionDescription>Finaliser une tâche</ActionDescription>
              </ActionCard>
              <ActionCard>
                <ActionIcon>
                  <Clock size={24} />
                </ActionIcon>
                <ActionTitle>Mon Planning</ActionTitle>
                <ActionDescription>Voir mes horaires</ActionDescription>
              </ActionCard>
              <ActionCard>
                <ActionIcon>
                  <UserIcon size={24} />
                </ActionIcon>
                <ActionTitle>Profil</ActionTitle>
                <ActionDescription>Modifier mes infos</ActionDescription>
              </ActionCard>
            </ActionsGrid>
          </EmployeeQuickActions>
        </TwoColumnGrid>
      </Content>

    </PageWrapper>
  );
}
