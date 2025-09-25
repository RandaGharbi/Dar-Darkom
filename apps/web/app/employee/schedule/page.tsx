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
  Plus,
  Calendar,
  Flag,
  AlertCircle,
  CheckSquare,
  Square,
  Edit3,
  Trash2,
  Filter,
  Search,
  RefreshCw,
  ChevronLeft,
  ChevronRight,
  MapPin,
  Users,
  Coffee,
  Briefcase,
  Home
} from 'lucide-react';
import Link from 'next/link';

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

const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 20px;
  margin-bottom: 32px;
`;

const StatCard = styled.div`
  background: rgba(255, 255, 255, 0.9);
  backdrop-filter: blur(20px);
  border-radius: 20px;
  padding: 24px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
  text-align: center;
  position: relative;
  overflow: hidden;
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
    box-shadow: 0 12px 40px rgba(0, 0, 0, 0.15);
  }
`;

const StatValue = styled.div`
  font-size: 32px;
  font-weight: 800;
  color: #1f2937;
  margin-bottom: 8px;
`;

const StatLabel = styled.div`
  font-size: 14px;
  color: #6b7280;
  font-weight: 500;
`;

const CalendarControls = styled.div`
  background: rgba(255, 255, 255, 0.9);
  backdrop-filter: blur(20px);
  border-radius: 20px;
  padding: 24px;
  margin-bottom: 24px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 16px;

  @media (max-width: 768px) {
    flex-direction: column;
    align-items: stretch;
  }
`;

const MonthNavigation = styled.div`
  display: flex;
  align-items: center;
  gap: 16px;
`;

const NavButton = styled.button`
  background: #f8fafc;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  padding: 8px 12px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s ease;

  &:hover {
    background: #f1f5f9;
    border-color: #cbd5e0;
  }
`;

const CurrentMonth = styled.h2`
  font-size: 24px;
  font-weight: 700;
  color: #1f2937;
  margin: 0;
  min-width: 200px;
  text-align: center;
`;

const ViewToggle = styled.div`
  display: flex;
  gap: 8px;
`;

const ViewButton = styled.button<{ $active: boolean }>`
  padding: 8px 16px;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
  border: 1px solid ${({ $active }) => $active ? '#3b82f6' : '#e2e8f0'};
  background: ${({ $active }) => $active ? '#3b82f6' : 'white'};
  color: ${({ $active }) => $active ? 'white' : '#64748b'};

  &:hover {
    background: ${({ $active }) => $active ? '#2563eb' : '#f8fafc'};
  }
`;

const CalendarGrid = styled.div`
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

const CalendarHeader = styled.div`
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  background: #f8fafc;
  border-bottom: 1px solid #e5e7eb;
`;

const DayHeader = styled.div`
  padding: 16px 8px;
  text-align: center;
  font-size: 14px;
  font-weight: 600;
  color: #64748b;
  text-transform: uppercase;
  letter-spacing: 0.5px;
`;

const CalendarBody = styled.div`
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  min-height: 400px;
`;

const DayCell = styled.div<{ $isCurrentMonth: boolean; $isToday: boolean; $hasEvents: boolean }>`
  padding: 12px 8px;
  border-right: 1px solid #f3f4f6;
  border-bottom: 1px solid #f3f4f6;
  min-height: 80px;
  position: relative;
  cursor: pointer;
  transition: all 0.2s ease;
  
  background: ${({ $isCurrentMonth, $isToday }) => 
    $isToday ? 'linear-gradient(135deg, #dbeafe, #bfdbfe)' : 
    $isCurrentMonth ? 'white' : '#f9fafb'};
  
  color: ${({ $isCurrentMonth }) => $isCurrentMonth ? '#1f2937' : '#9ca3af'};
  
  &:hover {
    background: ${({ $isCurrentMonth }) => $isCurrentMonth ? '#f8fafc' : '#f3f4f6'};
  }
  
  ${({ $hasEvents }) => $hasEvents && `
    &::after {
      content: '';
      position: absolute;
      top: 4px;
      right: 4px;
      width: 6px;
      height: 6px;
      background: #3b82f6;
      border-radius: 50%;
    }
  `}
`;

const DayNumber = styled.div<{ $isToday: boolean }>`
  font-size: 14px;
  font-weight: ${({ $isToday }) => $isToday ? '700' : '500'};
  margin-bottom: 4px;
  color: ${({ $isToday }) => $isToday ? '#3b82f6' : 'inherit'};
`;

const EventList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2px;
`;

const EventItem = styled.div<{ $type: 'work' | 'break' | 'meeting' | 'task' }>`
  font-size: 10px;
  padding: 2px 4px;
  border-radius: 4px;
  background: ${({ $type }) => {
    switch ($type) {
      case 'work': return '#dbeafe';
      case 'break': return '#d1fae5';
      case 'meeting': return '#fef3c7';
      case 'task': return '#e0e7ff';
      default: return '#f3f4f6';
    }
  }};
  color: ${({ $type }) => {
    switch ($type) {
      case 'work': return '#1e40af';
      case 'break': return '#065f46';
      case 'meeting': return '#92400e';
      case 'task': return '#3730a3';
      default: return '#374151';
    }
  }};
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`;

const EventModal = styled.div<{ $isOpen: boolean }>`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: ${({ $isOpen }) => $isOpen ? 'flex' : 'none'};
  align-items: center;
  justify-content: center;
  z-index: 1000;
`;

const ModalContent = styled.div`
  background: white;
  border-radius: 16px;
  padding: 24px;
  max-width: 500px;
  width: 90%;
  max-height: 80vh;
  overflow-y: auto;
`;

const ModalHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
`;

const ModalTitle = styled.h3`
  font-size: 20px;
  font-weight: 700;
  color: #1f2937;
  margin: 0;
`;

const CloseButton = styled.button`
  background: none;
  border: none;
  font-size: 24px;
  cursor: pointer;
  color: #6b7280;
  padding: 4px;
  border-radius: 4px;

  &:hover {
    background: #f3f4f6;
  }
`;

const EventForm = styled.form`
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const Label = styled.label`
  font-size: 14px;
  font-weight: 500;
  color: #374151;
`;

const Input = styled.input`
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

const Select = styled.select`
  padding: 12px 16px;
  border: 2px solid #e2e8f0;
  border-radius: 8px;
  font-size: 14px;
  background: white;
  cursor: pointer;
  transition: all 0.2s ease;

  &:focus {
    outline: none;
    border-color: #3b82f6;
    box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
  }
`;

const TextArea = styled.textarea`
  padding: 12px 16px;
  border: 2px solid #e2e8f0;
  border-radius: 8px;
  font-size: 14px;
  min-height: 80px;
  resize: vertical;
  transition: all 0.2s ease;

  &:focus {
    outline: none;
    border-color: #3b82f6;
    box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
  }
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 12px;
  justify-content: flex-end;
  margin-top: 20px;
`;

const Button = styled.button<{ $variant: 'primary' | 'secondary' }>`
  padding: 12px 24px;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  border: none;

  ${({ $variant }) => {
    switch ($variant) {
      case 'primary':
        return 'background: #3b82f6; color: white; &:hover { background: #2563eb; }';
      case 'secondary':
        return 'background: #f3f4f6; color: #374151; &:hover { background: #e5e7eb; }';
    }
  }}
`;

const AddEventButton = styled.button`
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
`;

// Données de test pour les événements
const mockEvents = [
  {
    id: '1',
    title: 'Réunion équipe',
    type: 'meeting' as const,
    startTime: '09:00',
    endTime: '10:00',
    date: '2024-01-15',
    description: 'Réunion hebdomadaire avec l\'équipe'
  },
  {
    id: '2',
    title: 'Traitement commandes',
    type: 'work' as const,
    startTime: '10:30',
    endTime: '12:00',
    date: '2024-01-15',
    description: 'Traiter les commandes en attente'
  },
  {
    id: '3',
    title: 'Pause déjeuner',
    type: 'break' as const,
    startTime: '12:00',
    endTime: '13:00',
    date: '2024-01-15',
    description: 'Pause déjeuner'
  },
  {
    id: '4',
    title: 'Formation produit',
    type: 'task' as const,
    startTime: '14:00',
    endTime: '16:00',
    date: '2024-01-16',
    description: 'Formation sur les nouveaux produits'
  },
  {
    id: '5',
    title: 'Inventaire',
    type: 'work' as const,
    startTime: '16:30',
    endTime: '18:00',
    date: '2024-01-16',
    description: 'Vérification des stocks'
  }
];

export default function EmployeeSchedulePage() {
  const router = useRouter();
  const pathname = usePathname();
  const queryClient = useQueryClient();
  const [isAuthChecked, setIsAuthChecked] = useState(false);
  const [currentDate, setCurrentDate] = useState(new Date());
  const [viewMode, setViewMode] = useState<'month' | 'week'>('month');
  const [events, setEvents] = useState(mockEvents);
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newEvent, setNewEvent] = useState({
    title: '',
    type: 'work' as const,
    startTime: '',
    endTime: '',
    description: ''
  });

  // Vérifier l'authentification
  useEffect(() => {
    const checkAuth = () => {
      const token = localStorage.getItem('token');
      if (!token) {
        router.replace('/login?fromLogout=true');
        return;
      }

      try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        if (payload.role !== 'EMPLOYE') {
          router.replace('/login?fromLogout=true');
          return;
        }
        setIsAuthChecked(true);
      } catch (e) {
        router.replace('/login?fromLogout=true');
        return;
      }
    };

    checkAuth();
  }, [router]);

  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();
    
    const days = [];
    
    // Jours du mois précédent
    for (let i = startingDayOfWeek - 1; i >= 0; i--) {
      const prevDate = new Date(year, month, -i);
      days.push({ date: prevDate, isCurrentMonth: false });
    }
    
    // Jours du mois actuel
    for (let day = 1; day <= daysInMonth; day++) {
      const currentDate = new Date(year, month, day);
      days.push({ date: currentDate, isCurrentMonth: true });
    }
    
    // Jours du mois suivant pour compléter la grille
    const remainingDays = 42 - days.length;
    for (let day = 1; day <= remainingDays; day++) {
      const nextDate = new Date(year, month + 1, day);
      days.push({ date: nextDate, isCurrentMonth: false });
    }
    
    return days;
  };

  const getEventsForDate = (date: string) => {
    return events.filter(event => event.date === date);
  };

  const isToday = (date: Date) => {
    const today = new Date();
    return date.toDateString() === today.toDateString();
  };

  const formatDate = (date: Date) => {
    return date.toISOString().split('T')[0];
  };

  const getMonthName = (date: Date) => {
    return date.toLocaleDateString('fr-FR', { 
      month: 'long', 
      year: 'numeric' 
    });
  };

  const handlePreviousMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1));
  };

  const handleNextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1));
  };

  const handleDateClick = (date: Date) => {
    setSelectedDate(formatDate(date));
    setIsModalOpen(true);
  };

  const handleAddEvent = (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedDate && newEvent.title && newEvent.startTime && newEvent.endTime) {
      const event = {
        id: Date.now().toString(),
        ...newEvent,
        date: selectedDate
      };
      setEvents([...events, event]);
      setNewEvent({
        title: '',
        type: 'work',
        startTime: '',
        endTime: '',
        description: ''
      });
      setIsModalOpen(false);
    }
  };

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

  const todayEvents = events.filter(event => event.date === formatDate(new Date())).length;
  const thisWeekEvents = events.filter(event => {
    const eventDate = new Date(event.date);
    const today = new Date();
    const weekStart = new Date(today.setDate(today.getDate() - today.getDay()));
    const weekEnd = new Date(today.setDate(today.getDate() - today.getDay() + 6));
    return eventDate >= weekStart && eventDate <= weekEnd;
  }).length;

  if (!isAuthChecked) {
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
            <p style={{ marginTop: '1rem', color: '#6b7280' }}>Chargement du planning...</p>
          </div>
        </Content>
      </PageWrapper>
    );
  }

  const days = getDaysInMonth(currentDate);
  const weekDays = ['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim'];

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
            <Title>Mon Emploi du Temps</Title>
            <Subtitle>
              Gérez votre planning et organisez vos activités professionnelles. 
              Visualisez vos rendez-vous, tâches et événements importants.
            </Subtitle>
          </div>
        </HeaderContainer>

        <StatsGrid>
          <StatCard>
            <StatValue>{todayEvents}</StatValue>
            <StatLabel>Événements aujourd'hui</StatLabel>
          </StatCard>
          <StatCard>
            <StatValue>{thisWeekEvents}</StatValue>
            <StatLabel>Cette semaine</StatLabel>
          </StatCard>
          <StatCard>
            <StatValue>{events.length}</StatValue>
            <StatLabel>Total événements</StatLabel>
          </StatCard>
          <StatCard>
            <StatValue>8h</StatValue>
            <StatLabel>Heures travaillées</StatLabel>
          </StatCard>
        </StatsGrid>

        <CalendarControls>
          <MonthNavigation>
            <NavButton onClick={handlePreviousMonth}>
              <ChevronLeft size={20} />
            </NavButton>
            <CurrentMonth>{getMonthName(currentDate)}</CurrentMonth>
            <NavButton onClick={handleNextMonth}>
              <ChevronRight size={20} />
            </NavButton>
          </MonthNavigation>
          
          <ViewToggle>
            <ViewButton $active={viewMode === 'month'} onClick={() => setViewMode('month')}>
              Mois
            </ViewButton>
            <ViewButton $active={viewMode === 'week'} onClick={() => setViewMode('week')}>
              Semaine
            </ViewButton>
          </ViewToggle>
        </CalendarControls>

        <CalendarGrid>
          <CalendarHeader>
            {weekDays.map(day => (
              <DayHeader key={day}>{day}</DayHeader>
            ))}
          </CalendarHeader>
          <CalendarBody>
            {days.map((day, index) => {
              const dayEvents = getEventsForDate(formatDate(day.date));
              return (
                <DayCell
                  key={index}
                  $isCurrentMonth={day.isCurrentMonth}
                  $isToday={isToday(day.date)}
                  $hasEvents={dayEvents.length > 0}
                  onClick={() => handleDateClick(day.date)}
                >
                  <DayNumber $isToday={isToday(day.date)}>
                    {day.date.getDate()}
                  </DayNumber>
                  {dayEvents.length > 0 && (
                    <EventList>
                      {dayEvents.slice(0, 2).map(event => (
                        <EventItem key={event.id} $type={event.type}>
                          {event.startTime} - {event.title}
                        </EventItem>
                      ))}
                      {dayEvents.length > 2 && (
                        <EventItem $type="work">
                          +{dayEvents.length - 2} autres
                        </EventItem>
                      )}
                    </EventList>
                  )}
                </DayCell>
              );
            })}
          </CalendarBody>
        </CalendarGrid>

        <EventModal $isOpen={isModalOpen}>
          <ModalContent>
            <ModalHeader>
              <ModalTitle>Ajouter un événement</ModalTitle>
              <CloseButton onClick={() => setIsModalOpen(false)}>×</CloseButton>
            </ModalHeader>
            <EventForm onSubmit={handleAddEvent}>
              <FormGroup>
                <Label>Titre</Label>
                <Input
                  type="text"
                  value={newEvent.title}
                  onChange={(e) => setNewEvent({...newEvent, title: e.target.value})}
                  placeholder="Titre de l'événement"
                  required
                />
              </FormGroup>
              <FormGroup>
                <Label>Type</Label>
                <Select
                  value={newEvent.type}
                  onChange={(e) => setNewEvent({...newEvent, type: e.target.value as any})}
                >
                  <option value="work">Travail</option>
                  <option value="meeting">Réunion</option>
                  <option value="task">Tâche</option>
                  <option value="break">Pause</option>
                </Select>
              </FormGroup>
              <FormGroup>
                <Label>Heure de début</Label>
                <Input
                  type="time"
                  value={newEvent.startTime}
                  onChange={(e) => setNewEvent({...newEvent, startTime: e.target.value})}
                  required
                />
              </FormGroup>
              <FormGroup>
                <Label>Heure de fin</Label>
                <Input
                  type="time"
                  value={newEvent.endTime}
                  onChange={(e) => setNewEvent({...newEvent, endTime: e.target.value})}
                  required
                />
              </FormGroup>
              <FormGroup>
                <Label>Description</Label>
                <TextArea
                  value={newEvent.description}
                  onChange={(e) => setNewEvent({...newEvent, description: e.target.value})}
                  placeholder="Description de l'événement"
                />
              </FormGroup>
              <ButtonGroup>
                <Button type="button" $variant="secondary" onClick={() => setIsModalOpen(false)}>
                  Annuler
                </Button>
                <Button type="submit" $variant="primary">
                  Ajouter
                </Button>
              </ButtonGroup>
            </EventForm>
          </ModalContent>
        </EventModal>
      </Content>
    </PageWrapper>
  );
}
