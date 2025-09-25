"use client";
import React, { useState, useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import styled from 'styled-components';
import Image from 'next/image';
import { employeeAPI, Order } from '../../../lib/api';
import { GlobalStyles } from '../../../components/styled/GlobalStyles';
import { 
  User as UserIcon, 
  Bell,
  Mail,
  Moon,
  ArrowRight,
  Menu,
  LogOut,
  CheckCircle,
  Package,
  Clock,
  XCircle,
  Phone,
  MapPin,
  Truck,
  QrCode,
  RefreshCw,
  Search,
  Filter
} from 'lucide-react';
import Link from 'next/link';
import Select from '../../../components/ui/Select';

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
  overflow: visible;
  
  @media (max-width: 1120px) {
    padding: 32px 24px 24px 24px;
  }
  
  @media (max-width: 600px) {
    padding: 24px 16px 16px 16px;
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

const FiltersSection = styled.div`
  background: rgba(255, 255, 255, 0.9);
  backdrop-filter: blur(20px);
  border-radius: 20px;
  padding: 24px;
  margin-bottom: 24px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
  display: flex;
  gap: 16px;
  align-items: center;
  flex-wrap: wrap;
  overflow: visible;
  position: relative;
  z-index: 1;

  @media (max-width: 768px) {
    flex-direction: column;
    align-items: stretch;
  }
`;

const SearchInput = styled.input`
  flex: 1;
  min-width: 200px;
  padding: 12px 16px;
  border: 2px solid #e2e8f0;
  border-radius: 8px;
  font-size: 14px;
  background-color: white;
  color: #374151;
  transition: all 0.2s ease;

  &::placeholder {
    color: #9ca3af;
  }

  &:focus {
    outline: none;
    border-color: #3b82f6;
    box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
    background-color: white;
  }
`;


const RefreshButton = styled.button`
  background: linear-gradient(135deg, #3b82f6, #1d4ed8);
  color: white;
  border: none;
  padding: 12px 24px;
  border-radius: 12px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 8px;
  transition: all 0.3s ease;
  box-shadow: 0 4px 12px rgba(59, 130, 246, 0.3);

  &:hover {
    background: linear-gradient(135deg, #2563eb, #1e40af);
    transform: translateY(-2px);
    box-shadow: 0 6px 16px rgba(59, 130, 246, 0.4);
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
    transform: none;
  }
`;

const OrdersSection = styled.div<{ $isSelectOpen?: boolean }>`
  background: rgba(255, 255, 255, 0.9);
  backdrop-filter: blur(20px);
  border-radius: 20px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
  overflow: hidden;
  position: relative;
  margin-top: ${({ $isSelectOpen }) => $isSelectOpen ? '200px' : '0'};
  transition: margin-top 0.3s ease;
  
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
  padding: 32px;
  border-bottom: 1px solid #e5e7eb;
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: linear-gradient(135deg, #f8fafc, #f1f5f9);
`;

const SectionTitle = styled.h2`
  font-size: 24px;
  font-weight: 700;
  color: #1f2937;
  margin: 0;
  background: linear-gradient(135deg, #1e293b, #475569);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
`;

const OrdersList = styled.div`
  max-height: 600px;
  overflow-y: auto;
`;

const OrderCard = styled.div<{ $status: string }>`
  padding: 24px;
  border-bottom: 1px solid #e5e7eb;
  transition: all 0.2s ease;

  &:hover {
    background: #f9fafb;
  }

  &:last-child {
    border-bottom: none;
  }

  ${({ $status }) => {
    switch ($status) {
      case 'PENDING':
        return 'border-left: 4px solid #f59e0b;';
      case 'READY':
        return 'border-left: 4px solid #10b981;';
      case 'CANCELLED':
        return 'border-left: 4px solid #ef4444;';
      default:
        return 'border-left: 4px solid #6b7280;';
    }
  }}
`;

const OrderHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 16px;
`;

const OrderInfo = styled.div`
  flex: 1;
`;

const OrderNumber = styled.div`
  font-size: 18px;
  font-weight: 600;
  color: #1f2937;
  margin-bottom: 4px;
`;

const OrderDate = styled.div`
  font-size: 14px;
  color: #6b7280;
`;

const OrderStatus = styled.div<{ $status: string }>`
  padding: 6px 12px;
  border-radius: 20px;
  font-size: 12px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  
  ${({ $status }) => {
    switch ($status) {
      case 'PENDING':
        return 'background: #fef3c7; color: #92400e;';
      case 'READY':
        return 'background: #d1fae5; color: #065f46;';
      case 'CANCELLED':
        return 'background: #fee2e2; color: #991b1b;';
      default:
        return 'background: #f3f4f6; color: #374151;';
    }
  }}
`;

const OrderDetails = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 24px;
  margin-bottom: 20px;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    gap: 16px;
  }
`;

const CustomerInfo = styled.div`
  h4 {
    font-size: 14px;
    font-weight: 600;
    color: #374151;
    margin: 0 0 8px 0;
    display: flex;
    align-items: center;
    gap: 6px;
  }

  p {
    font-size: 14px;
    color: #6b7280;
    margin: 4px 0;
    display: flex;
    align-items: center;
    gap: 6px;
  }
`;

const ProductsList = styled.div`
  h4 {
    font-size: 14px;
    font-weight: 600;
    color: #374151;
    margin: 0 0 8px 0;
  }
`;

const ProductItem = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 8px 0;
  border-bottom: 1px solid #f3f4f6;

  &:last-child {
    border-bottom: none;
  }
`;

const ProductName = styled.div`
  font-size: 14px;
  color: #374151;
  flex: 1;
`;

const ProductQty = styled.div`
  font-size: 14px;
  color: #6b7280;
  margin: 0 12px;
`;

const ProductPrice = styled.div`
  font-size: 14px;
  font-weight: 600;
  color: #1f2937;
`;

const OrderTotal = styled.div`
  text-align: right;
  margin-top: 12px;
  padding-top: 12px;
  border-top: 2px solid #e5e7eb;

  .total-label {
    font-size: 14px;
    color: #6b7280;
    margin-bottom: 4px;
  }

  .total-amount {
    font-size: 20px;
    font-weight: 800;
    color: #1f2937;
  }
`;

const ActionButtons = styled.div`
  display: flex;
  gap: 12px;
  flex-wrap: wrap;
`;

const ActionButton = styled.button<{ $variant: 'accept' | 'reject' | 'assign' | 'view' }>`
  padding: 8px 16px;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 6px;
  transition: all 0.2s ease;
  border: none;

  ${({ $variant }) => {
    switch ($variant) {
      case 'accept':
        return 'background: #10b981; color: white; &:hover { background: #059669; transform: translateY(-1px); }';
      case 'reject':
        return 'background: #ef4444; color: white; &:hover { background: #dc2626; transform: translateY(-1px); }';
      case 'assign':
        return 'background: #3b82f6; color: white; &:hover { background: #2563eb; transform: translateY(-1px); }';
      case 'view':
        return 'background: #6b7280; color: white; &:hover { background: #4b5563; transform: translateY(-1px); }';
      default:
        return 'background: #6b7280; color: white;';
    }
  }}

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
    transform: none;
  }
`;

const LoadingSpinner = styled.div`
  display: inline-block;
  width: 16px;
  height: 16px;
  border: 2px solid #ffffff;
  border-radius: 50%;
  border-top-color: transparent;
  animation: spin 1s ease-in-out infinite;

  @keyframes spin {
    to {
      transform: rotate(360deg);
    }
  }
`;

const EmptyState = styled.div`
  text-align: center;
  padding: 48px 24px;
  color: #6b7280;

  h3 {
    font-size: 18px;
    font-weight: 600;
    margin: 0 0 8px 0;
  }

  p {
    font-size: 14px;
    margin: 0;
  }
`;

export default function EmployeeOrdersPage() {
  const router = useRouter();
  const pathname = usePathname();
  const queryClient = useQueryClient();
  const [isAuthChecked, setIsAuthChecked] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [isSelectOpen, setIsSelectOpen] = useState(false);

  // Vérifier l'authentification
  useEffect(() => {
    const checkAuth = () => {
      const token = localStorage.getItem('token');
      console.log('🔐 Token trouvé:', !!token);
      
      if (!token) {
        console.log('❌ Aucun token trouvé, redirection vers login');
        router.replace('/login');
        return;
      }

      try {
        const tokenParts = token.split('.');
        if (tokenParts.length !== 3) {
          console.log('❌ Token invalide, redirection vers login');
          router.replace('/login');
          return;
        }
        
        const payload = JSON.parse(atob(tokenParts[1]));
        console.log('🔐 Payload du token:', payload);
        console.log('🔐 Rôle trouvé:', payload.role);
        
        if (payload.role !== 'EMPLOYE') {
          console.log('❌ Rôle incorrect, redirection vers login');
          router.replace('/login');
          return;
        }
        
        console.log('✅ Authentification réussie pour employé');
        setIsAuthChecked(true);
      } catch (e) {
        console.log('❌ Erreur lors du parsing du token:', e);
        router.replace('/login');
        return;
      }
    };

    checkAuth();
  }, [router]);

  // Récupérer les commandes
  const { data: ordersResponse, isLoading: ordersLoading } = useQuery({
    queryKey: ['employee-orders'],
    queryFn: () => employeeAPI.getOrders(['PENDING', 'READY']),
    refetchInterval: false,
    staleTime: 5 * 60 * 1000,
    enabled: isAuthChecked,
  });

  const orders = ordersResponse?.data?.data || [];

  // Filtrer les commandes
  const filteredOrders = orders.filter(order => {
    const matchesSearch = order._id.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (typeof order.userId === 'object' && order.userId.name?.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesStatus = statusFilter === 'ALL' || order.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleLogout = async () => {
    try {
      console.log('🚪 Déconnexion en cours...');
      
      queryClient.clear();
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      
      console.log('✅ Données locales supprimées');
      
      router.replace('/login?fromLogout=true');
      
    } catch (error) {
      console.error('❌ Erreur lors de la déconnexion:', error);
      queryClient.clear();
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      router.replace('/login?fromLogout=true');
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('fr-FR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'TND'
    }).format(price);
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
            <Title>Gestion des Commandes</Title>
            <Subtitle>
              Gérez et traitez les commandes de vos clients avec efficacité. 
              Suivez le statut et assurez-vous de la satisfaction client.
            </Subtitle>
          </div>
        </HeaderContainer>

        <FiltersSection>
          <SearchInput
            type="text"
            placeholder="Rechercher par numéro de commande ou nom client..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <Select
            options={[
              { value: 'ALL', label: 'Tous les statuts' },
              { value: 'PENDING', label: 'En attente' },
              { value: 'READY', label: 'Prête' },
              { value: 'CANCELLED', label: 'Annulée' }
            ]}
            value={statusFilter}
            onChange={setStatusFilter}
            placeholder="Sélectionner un statut"
            onOpen={() => setIsSelectOpen(true)}
            onClose={() => setIsSelectOpen(false)}
          />
        </FiltersSection>

        <OrdersSection $isSelectOpen={isSelectOpen}>
          <SectionHeader>
            <SectionTitle>Commandes à traiter ({filteredOrders.length})</SectionTitle>
          </SectionHeader>

          <OrdersList>
            {filteredOrders.length === 0 ? (
              <EmptyState>
                <h3>Aucune commande trouvée</h3>
                <p>
                  {searchTerm || statusFilter !== 'ALL' 
                    ? 'Aucune commande ne correspond à vos critères de recherche.' 
                    : 'Il n\'y a actuellement aucune commande à traiter.'}
                </p>
              </EmptyState>
            ) : (
              filteredOrders.map((order) => (
                <OrderCard key={order._id} $status={order.status}>
                  <OrderHeader>
                    <OrderInfo>
                      <OrderNumber>Commande #{order._id.slice(-8)}</OrderNumber>
                      <OrderDate>{formatDate(order.createdAt)}</OrderDate>
                    </OrderInfo>
                    <OrderStatus $status={order.status}>
                      {order.status === 'PENDING' ? 'En attente' : 
                       order.status === 'READY' ? 'Prête' : 
                       order.status === 'CANCELLED' ? 'Annulée' : order.status}
                    </OrderStatus>
                  </OrderHeader>

                  <OrderDetails>
                    <CustomerInfo>
                      <h4>
                        <UserIcon size={16} />
                        Client
                      </h4>
                      <p>
                        <strong>{typeof order.userId === 'object' ? order.userId.name : 'N/A'}</strong>
                      </p>
                      <p>
                        <Phone size={14} />
                        {typeof order.userId === 'object' ? order.userId.phoneNumber || 'Non renseigné' : 'N/A'}
                      </p>
                      <p>
                        <MapPin size={14} />
                        {order.shippingAddress.street}, {order.shippingAddress.city}
                      </p>
                    </CustomerInfo>

                    <ProductsList>
                      <h4>Produits</h4>
                      {order.products.map((product, index) => (
                        <ProductItem key={index}>
                          <ProductName>{product.name}</ProductName>
                          <ProductQty>x{product.qty}</ProductQty>
                          <ProductPrice>{formatPrice(product.price)}</ProductPrice>
                        </ProductItem>
                      ))}
                    </ProductsList>
                  </OrderDetails>

                  <OrderTotal>
                    <div className="total-label">Total</div>
                    <div className="total-amount">{formatPrice(order.total)}</div>
                  </OrderTotal>

                  <ActionButtons>
                    {order.status === 'PENDING' && (
                      <>
                        <ActionButton $variant="accept">
                          <CheckCircle size={16} />
                          Accepter
                        </ActionButton>
                        <ActionButton $variant="reject">
                          <XCircle size={16} />
                          Rejeter
                        </ActionButton>
                      </>
                    )}
                    {order.status === 'READY' && (
                      <ActionButton $variant="assign">
                        <Truck size={16} />
                        Assigner livreur
                      </ActionButton>
                    )}
                    {order.qrCode && (
                      <ActionButton $variant="view">
                        <QrCode size={16} />
                        Voir QR Code
                      </ActionButton>
                    )}
                  </ActionButtons>
                </OrderCard>
              ))
            )}
          </OrdersList>
        </OrdersSection>
      </Content>
    </PageWrapper>
  );
}
