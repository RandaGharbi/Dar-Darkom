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
  RefreshCw
} from 'lucide-react';
import Select from '../../../components/ui/Select';
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
  background: white;
  height: 80px;
  padding: 0 32px;
  border-bottom: 1px solid #e5e7eb;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);

  @media (max-width: 1120px) {
    padding: 0 16px;
    height: 70px;
  }

  @media (max-width: 480px) {
    padding: 0 12px;
    height: 60px;
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
  background: white;
  border-radius: 12px;
  padding: 24px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  border: 1px solid #e5e7eb;
  text-align: center;
  position: relative;
  overflow: hidden;
  transition: all 0.2s ease;
  
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
    transform: translateY(-2px);
    box-shadow: 0 4px 16px rgba(0, 0, 0, 0.15);
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

const FiltersSection = styled.div`
  background: white;
  border-radius: 12px;
  padding: 24px;
  margin-bottom: 24px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  border: 1px solid #e5e7eb;
  display: flex;
  gap: 16px;
  align-items: center;
  flex-wrap: wrap;

  @media (max-width: 768px) {
    flex-direction: column;
    align-items: stretch;
  }
`;

const SearchInput = styled.input`
  flex: 1;
  min-width: 200px;
  padding: 12px 16px;
  border: 1px solid #d1d5db;
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
    background: white;
    box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
  }
`;


const AddTaskButton = styled.button`
  background: #3b82f6;
  color: white;
  border: none;
  padding: 12px 20px;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 8px;
  transition: all 0.2s ease;
  box-shadow: 0 2px 4px rgba(59, 130, 246, 0.2);

  &:hover {
    background: #2563eb;
    box-shadow: 0 4px 8px rgba(59, 130, 246, 0.3);
  }
`;

const RefreshButton = styled.button`
  background: #6b7280;
  color: white;
  border: none;
  padding: 12px 20px;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 8px;
  transition: all 0.2s ease;
  box-shadow: 0 2px 4px rgba(107, 114, 128, 0.2);

  &:hover {
    background: #4b5563;
    box-shadow: 0 4px 8px rgba(107, 114, 128, 0.3);
  }
`;

const TasksSection = styled.div`
  background: white;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  border: 1px solid #e5e7eb;
  overflow: hidden;
  position: relative;
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

const TasksList = styled.div`
  overflow: visible;
`;

const TaskCard = styled.div<{ $priority: 'high' | 'medium' | 'low' }>`
  padding: 20px 24px;
  border-bottom: 1px solid #f3f4f6;
  transition: all 0.2s ease;
  position: relative;
  background: white;

  &:hover {
    background: #f8fafc;
  }

  &:last-child {
    border-bottom: none;
  }

  ${({ $priority }) => {
    switch ($priority) {
      case 'high':
        return 'border-left: 4px solid #dc2626;';
      case 'medium':
        return 'border-left: 4px solid #dc2626;';
      case 'low':
        return 'border-left: 4px solid #0369a1;';
    }
  }}
`;

const TaskHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 16px;
`;

const TaskInfo = styled.div`
  flex: 1;
  display: flex;
  align-items: flex-start;
  gap: 12px;
`;

const TaskCheckbox = styled.button<{ $completed: boolean }>`
  width: 20px;
  height: 20px;
  border: 2px solid ${({ $completed }) => $completed ? '#10b981' : '#d1d5db'};
  border-radius: 4px;
  background: ${({ $completed }) => $completed ? '#10b981' : 'transparent'};
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s ease;
  margin-top: 2px;

  &:hover {
    border-color: ${({ $completed }) => $completed ? '#059669' : '#9ca3af'};
  }
`;

const TaskContent = styled.div`
  flex: 1;
`;

const TaskTitle = styled.div<{ $completed: boolean }>`
  font-size: 16px;
  font-weight: 600;
  color: ${({ $completed }) => $completed ? '#9ca3af' : '#1f2937'};
  margin-bottom: 4px;
  text-decoration: ${({ $completed }) => $completed ? 'line-through' : 'none'};
`;

const TaskDescription = styled.div<{ $completed: boolean }>`
  font-size: 14px;
  color: ${({ $completed }) => $completed ? '#9ca3af' : '#6b7280'};
  margin-bottom: 8px;
`;

const TaskMeta = styled.div`
  display: flex;
  gap: 16px;
  align-items: center;
  flex-wrap: wrap;
`;

const TaskDate = styled.div`
  font-size: 12px;
  color: #9ca3af;
  display: flex;
  align-items: center;
  gap: 4px;
`;

const TaskPriority = styled.div<{ $priority: 'high' | 'medium' | 'low' }>`
  padding: 4px 8px;
  border-radius: 6px;
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

const TaskStatus = styled.div<{ $status: 'pending' | 'in_progress' | 'completed' }>`
  padding: 4px 8px;
  border-radius: 6px;
  font-size: 11px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  
  ${({ $status }) => {
    switch ($status) {
      case 'pending':
        return 'background: #fef2f2; color: #dc2626;';
      case 'in_progress':
        return 'background: #fef3c7; color: #d97706;';
      case 'completed':
        return 'background: #ecfdf5; color: #059669;';
    }
  }}
`;

const TaskActions = styled.div`
  display: flex;
  gap: 8px;
  align-items: center;
`;

const ActionButton = styled.button<{ $variant: 'edit' | 'delete' | 'complete' }>`
  padding: 8px 16px;
  border-radius: 6px;
  font-size: 12px;
  font-weight: 500;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 4px;
  transition: all 0.2s ease;
  border: none;

  ${({ $variant }) => {
    switch ($variant) {
      case 'edit':
        return 'background: #f3f4f6; color: #374151; &:hover { background: #e5e7eb; }';
      case 'delete':
        return 'background: #fee2e2; color: #dc2626; &:hover { background: #fecaca; }';
      case 'complete':
        return 'background: #f0f9ff; color: #0369a1; &:hover { background: #e0f2fe; }';
      default:
        return 'background: #f3f4f6; color: #374151;';
    }
  }}
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

// Données de test pour les tâches
const mockTasks = [
  {
    id: '1',
    title: 'Traiter les commandes en attente',
    description: 'Vérifier et traiter les 5 commandes en attente de validation',
    priority: 'high' as const,
    status: 'in_progress' as const,
    dueDate: '2024-01-15',
    completed: false,
    createdAt: '2024-01-10'
  },
  {
    id: '2',
    title: 'Vérifier l\'inventaire',
    description: 'Contrôle des stocks disponibles et mise à jour des quantités',
    priority: 'medium' as const,
    status: 'pending' as const,
    dueDate: '2024-01-16',
    completed: false,
    createdAt: '2024-01-11'
  },
  {
    id: '3',
    title: 'Préparer les livraisons',
    description: 'Emballage et préparation des commandes prêtes à expédier',
    priority: 'high' as const,
    status: 'pending' as const,
    dueDate: '2024-01-14',
    completed: false,
    createdAt: '2024-01-12'
  },
  {
    id: '4',
    title: 'Mise à jour des prix',
    description: 'Actualiser les prix des produits selon les nouvelles tarifications',
    priority: 'low' as const,
    status: 'completed' as const,
    dueDate: '2024-01-13',
    completed: true,
    createdAt: '2024-01-09'
  },
  {
    id: '5',
    title: 'Formation produit',
    description: 'Assister à la session de formation sur les nouveaux produits',
    priority: 'medium' as const,
    status: 'pending' as const,
    dueDate: '2024-01-18',
    completed: false,
    createdAt: '2024-01-13'
  }
];

export default function EmployeeTasksPage() {
  const router = useRouter();
  const pathname = usePathname();
  const queryClient = useQueryClient();
  const [isAuthChecked, setIsAuthChecked] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [priorityFilter, setPriorityFilter] = useState('ALL');
  const [tasks, setTasks] = useState(mockTasks);

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

  // Filtrer les tâches
  const filteredTasks = tasks.filter(task => {
    const matchesSearch = task.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         task.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'ALL' || task.status === statusFilter;
    const matchesPriority = priorityFilter === 'ALL' || task.priority === priorityFilter;
    return matchesSearch && matchesStatus && matchesPriority;
  });

  const completedTasks = tasks.filter(task => task.completed).length;
  const pendingTasks = tasks.filter(task => !task.completed).length;
  const highPriorityTasks = tasks.filter(task => task.priority === 'high' && !task.completed).length;

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

  const toggleTaskComplete = (taskId: string) => {
    setTasks(tasks.map(task => 
      task.id === taskId 
        ? { ...task, completed: !task.completed, status: !task.completed ? 'completed' as const : 'pending' as const }
        : task
    ));
  };

  const deleteTask = (taskId: string) => {
    setTasks(tasks.filter(task => task.id !== taskId));
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('fr-FR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

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
            <p style={{ marginTop: '1rem', color: '#6b7280' }}>Chargement des tâches...</p>
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
            <Title>Gestion des Tâches</Title>
            <Subtitle>
              Organisez et suivez vos tâches quotidiennes. Gérez vos priorités et 
              assurez-vous de respecter les délais pour une productivité optimale.
            </Subtitle>
          </div>
        </HeaderContainer>

        <StatsGrid>
          <StatCard>
            <StatValue>{pendingTasks}</StatValue>
            <StatLabel>Tâches en cours</StatLabel>
          </StatCard>
          <StatCard>
            <StatValue>{completedTasks}</StatValue>
            <StatLabel>Tâches terminées</StatLabel>
          </StatCard>
          <StatCard>
            <StatValue>{highPriorityTasks}</StatValue>
            <StatLabel>Priorité haute</StatLabel>
          </StatCard>
          <StatCard>
            <StatValue>{tasks.length}</StatValue>
            <StatLabel>Total des tâches</StatLabel>
          </StatCard>
        </StatsGrid>

        <FiltersSection>
          <SearchInput
            type="text"
            placeholder="Rechercher une tâche..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <Select
            options={[
              { value: 'ALL', label: 'Tous les statuts' },
              { value: 'pending', label: 'En attente' },
              { value: 'in_progress', label: 'En cours' },
              { value: 'completed', label: 'Terminée' }
            ]}
            value={statusFilter}
            placeholder="Sélectionner un statut"
            onChange={setStatusFilter}
          />
          <Select
            options={[
              { value: 'ALL', label: 'Toutes les priorités' },
              { value: 'high', label: 'Haute priorité' },
              { value: 'medium', label: 'Priorité moyenne' },
              { value: 'low', label: 'Basse priorité' }
            ]}
            value={priorityFilter}
            placeholder="Sélectionner une priorité"
            onChange={setPriorityFilter}
          />
          <AddTaskButton>
            <Plus size={16} />
            Nouvelle tâche
          </AddTaskButton>
          <RefreshButton onClick={() => window.location.reload()}>
            <RefreshCw size={16} />
            Actualiser
          </RefreshButton>
        </FiltersSection>

        <TasksSection>
          <SectionHeader>
            <SectionTitle>Mes Tâches ({filteredTasks.length})</SectionTitle>
          </SectionHeader>

          <TasksList>
            {filteredTasks.length === 0 ? (
              <EmptyState>
                <h3>Aucune tâche trouvée</h3>
                <p>
                  {searchTerm || statusFilter !== 'ALL' || priorityFilter !== 'ALL'
                    ? 'Aucune tâche ne correspond à vos critères de recherche.' 
                    : 'Il n\'y a actuellement aucune tâche assignée.'}
                </p>
              </EmptyState>
            ) : (
              filteredTasks.map((task) => (
                <TaskCard key={task.id} $priority={task.priority}>
                  <TaskHeader>
                    <TaskInfo>
                      <TaskCheckbox 
                        $completed={task.completed}
                        onClick={() => toggleTaskComplete(task.id)}
                      >
                        {task.completed && <CheckSquare size={12} color="white" />}
                      </TaskCheckbox>
                      <TaskContent>
                        <TaskTitle $completed={task.completed}>{task.title}</TaskTitle>
                        <TaskDescription $completed={task.completed}>{task.description}</TaskDescription>
                        <TaskMeta>
                          <TaskDate>
                            <Calendar size={12} />
                            Échéance: {formatDate(task.dueDate)}
                          </TaskDate>
                          <TaskPriority $priority={task.priority}>
                            <Flag size={10} />
                            {task.priority === 'high' ? 'Haute' : 
                             task.priority === 'medium' ? 'Moyenne' : 'Basse'}
                          </TaskPriority>
                          <TaskStatus $status={task.status}>
                            {task.status === 'pending' ? 'En attente' : 
                             task.status === 'in_progress' ? 'En cours' : 'Terminée'}
                          </TaskStatus>
                        </TaskMeta>
                      </TaskContent>
                    </TaskInfo>
                    <TaskActions>
                      {!task.completed && (
                        <ActionButton $variant="complete" onClick={() => toggleTaskComplete(task.id)}>
                          <CheckCircle size={12} />
                          Terminer
                        </ActionButton>
                      )}
                      <ActionButton $variant="edit">
                        <Edit3 size={12} />
                        Modifier
                      </ActionButton>
                      <ActionButton $variant="delete" onClick={() => deleteTask(task.id)}>
                        <Trash2 size={12} />
                        Supprimer
                      </ActionButton>
                    </TaskActions>
                  </TaskHeader>
                </TaskCard>
              ))
            )}
          </TasksList>
        </TasksSection>
      </Content>
    </PageWrapper>
  );
}
