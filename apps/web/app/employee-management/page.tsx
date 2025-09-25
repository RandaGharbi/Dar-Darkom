"use client";
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import styled from 'styled-components';
import { usersAPI, User } from '../../lib/api';
import { GlobalStyles } from '../../components/styled/GlobalStyles';
import { toast } from 'react-hot-toast';
import { 
  Users, 
  UserPlus, 
  Edit, 
  Trash2, 

  Building,
  Truck,
  CheckCircle,
  RefreshCw,
  ArrowLeft
} from 'lucide-react';

const Container = styled.div`
  min-height: 100vh;
  background: linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%);
  padding: 0;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', sans-serif;
`;

const Header = styled.div`
  background: white;
  border-bottom: 1px solid #e2e8f0;
  padding: 20px 32px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
`;

const HeaderLeft = styled.div`
  display: flex;
  align-items: center;
  gap: 16px;
`;

const Logo = styled.div`
  font-size: 24px;
  font-weight: 800;
  background: linear-gradient(135deg, #667eea, #764ba2);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
`;

const Title = styled.h1`
  font-size: 20px;
  font-weight: 600;
  color: #1f2937;
  margin: 0;
`;

const BackButton = styled.button`
  background: #e2e8f0;
  color: #4a5568;
  border: none;
  padding: 8px 16px;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  gap: 6px;
  text-decoration: none;

  &:hover {
    background: #cbd5e0;
    transform: translateY(-1px);
  }
`;

const Content = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 32px;
`;

const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 24px;
  margin-bottom: 32px;
`;

const StatCard = styled.div`
  background: white;
  border-radius: 12px;
  padding: 24px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  border: 1px solid #e5e7eb;
`;

const StatHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 16px;
`;

const StatIcon = styled.div<{ $color: string }>`
  width: 40px;
  height: 40px;
  border-radius: 8px;
  background: ${({ $color }) => $color};
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
`;

const StatTitle = styled.h3`
  font-size: 16px;
  font-weight: 600;
  color: #374151;
  margin: 0;
`;

const StatValue = styled.div`
  font-size: 32px;
  font-weight: 800;
  color: #1f2937;
  margin-bottom: 4px;
`;

const StatLabel = styled.div`
  font-size: 14px;
  color: #6b7280;
`;

const ManagementSection = styled.div`
  background: white;
  border-radius: 12px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  border: 1px solid #e5e7eb;
  overflow: hidden;
`;

const SectionHeader = styled.div`
  padding: 24px;
  border-bottom: 1px solid #e5e7eb;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const SectionTitle = styled.h2`
  font-size: 20px;
  font-weight: 600;
  color: #1f2937;
  margin: 0;
`;

const ActionButtons = styled.div`
  display: flex;
  gap: 12px;
`;

const Button = styled.button<{ $variant?: 'primary' | 'secondary' | 'danger' }>`
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
  text-decoration: none;

  ${({ $variant = 'primary' }) => {
    switch ($variant) {
      case 'primary':
        return 'background: #3b82f6; color: white; &:hover { background: #2563eb; transform: translateY(-1px); }';
      case 'secondary':
        return 'background: #6b7280; color: white; &:hover { background: #4b5563; transform: translateY(-1px); }';
      case 'danger':
        return 'background: #ef4444; color: white; &:hover { background: #dc2626; transform: translateY(-1px); }';
      default:
        return 'background: #3b82f6; color: white;';
    }
  }}

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
    transform: none;
  }
`;

const SearchBar = styled.div`
  padding: 24px;
  border-bottom: 1px solid #e5e7eb;
  display: flex;
  gap: 16px;
  align-items: center;
`;

const SearchInput = styled.input`
  flex: 1;
  padding: 12px 16px;
  border: 1px solid #d1d5db;
  border-radius: 8px;
  font-size: 14px;

  &:focus {
    outline: none;
    border-color: #3b82f6;
    box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
  }
`;

const FilterSelect = styled.select`
  padding: 12px 16px;
  border: 1px solid #d1d5db;
  border-radius: 8px;
  font-size: 14px;
  background: white;

  &:focus {
    outline: none;
    border-color: #3b82f6;
  }
`;

const UsersList = styled.div`
  max-height: 600px;
  overflow-y: auto;
`;

const UserCard = styled.div`
  padding: 24px;
  border-bottom: 1px solid #e5e7eb;
  display: flex;
  justify-content: space-between;
  align-items: center;
  transition: all 0.2s ease;

  &:hover {
    background: #f9fafb;
  }

  &:last-child {
    border-bottom: none;
  }
`;

const UserInfo = styled.div`
  flex: 1;
`;

const UserName = styled.div`
  font-size: 16px;
  font-weight: 600;
  color: #1f2937;
  margin-bottom: 4px;
`;

const UserDetails = styled.div`
  font-size: 14px;
  color: #6b7280;
  display: flex;
  align-items: center;
  gap: 16px;
`;

const UserRole = styled.span<{ $role: string }>`
  padding: 4px 8px;
  border-radius: 12px;
  font-size: 12px;
  font-weight: 600;
  text-transform: uppercase;
  
  ${({ $role }) => {
    switch ($role) {
      case 'EMPLOYE':
        return 'background: #dbeafe; color: #1e40af;';
      case 'LIVREUR':
        return 'background: #dcfce7; color: #166534;';
      case 'admin':
        return 'background: #fef3c7; color: #92400e;';
      default:
        return 'background: #f3f4f6; color: #374151;';
    }
  }}
`;

const UserActions = styled.div`
  display: flex;
  gap: 8px;
`;

const ActionButton = styled.button<{ $variant?: 'primary' | 'secondary' | 'danger' }>`
  padding: 6px 12px;
  border-radius: 6px;
  font-size: 12px;
  font-weight: 500;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 4px;
  transition: all 0.2s ease;
  border: none;

  ${({ $variant = 'primary' }) => {
    switch ($variant) {
      case 'primary':
        return 'background: #3b82f6; color: white; &:hover { background: #2563eb; }';
      case 'secondary':
        return 'background: #6b7280; color: white; &:hover { background: #4b5563; }';
      case 'danger':
        return 'background: #ef4444; color: white; &:hover { background: #dc2626; }';
      default:
        return 'background: #3b82f6; color: white;';
    }
  }}

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
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

export default function EmployeeManagementPage() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');

  // Vérifier l'authentification admin
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      router.push('/login');
      return;
    }

    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      if (payload.role !== 'admin') {
        router.push('/');
        return;
      }
    } catch (e) {
      router.push('/login');
      return;
    }
  }, [router]);

  // Récupérer tous les utilisateurs
  const { data: users = [], isLoading, refetch } = useQuery({
    queryKey: ['users'],
    queryFn: () => usersAPI.getAll().then(res => res.data),
  });

  // Filtrer les utilisateurs selon les critères
  const filteredUsers = users.filter((user: User) => {
    const matchesSearch = user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = roleFilter === 'all' || user.role === roleFilter;
    return matchesSearch && matchesRole;
  });

  // Filtrer par rôle
  const employees = users.filter((user: User) => user.role === 'EMPLOYE');
  const livreurs = users.filter((user: User) => user.role === 'LIVREUR');
  const admins = users.filter((user: User) => user.role === 'admin');

  // Mutation pour supprimer un utilisateur
  const deleteUserMutation = useMutation({
    mutationFn: (userId: string) => usersAPI.delete(userId),
    onSuccess: () => {
      toast.success('Utilisateur supprimé avec succès');
      queryClient.invalidateQueries({ queryKey: ['users'] });
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Erreur lors de la suppression');
    },
  });

  const handleDeleteUser = (userId: string, userName: string) => {
    if (confirm(`Êtes-vous sûr de vouloir supprimer l'utilisateur "${userName}" ?`)) {
      deleteUserMutation.mutate(userId);
    }
  };

  const getRoleIcon = (role: string) => {
    switch (role) {
      case 'EMPLOYE':
        return <Building size={16} />;
      case 'LIVREUR':
        return <Truck size={16} />;
      case 'admin':
        return <Users size={16} />;
      default:
        return <Users size={16} />;
    }
  };

  const getRoleLabel = (role: string) => {
    switch (role) {
      case 'EMPLOYE':
        return 'Employé';
      case 'LIVREUR':
        return 'Livreur';
      case 'admin':
        return 'Administrateur';
      default:
        return role;
    }
  };

  if (isLoading) {
    return (
      <Container>
        <GlobalStyles />
        <Header>
          <HeaderLeft>
            <Logo>👑</Logo>
            <Title>Gestion des Employés</Title>
          </HeaderLeft>
        </Header>
        <Content>
          <div style={{ textAlign: 'center', padding: '2rem' }}>
            <LoadingSpinner />
            <p style={{ marginTop: '1rem', color: '#6b7280' }}>Chargement des utilisateurs...</p>
          </div>
        </Content>
      </Container>
    );
  }

  return (
    <Container>
      <GlobalStyles />
      <Header>
        <HeaderLeft>
          <Link href="/">
            <BackButton>
              <ArrowLeft size={16} />
              Retour
            </BackButton>
          </Link>
          <Logo>👑</Logo>
          <Title>Gestion des Employés</Title>
        </HeaderLeft>
      </Header>

      <Content>
        <StatsGrid>
          <StatCard>
            <StatHeader>
              <StatIcon $color="#3b82f6">
                <Building size={20} />
              </StatIcon>
              <StatTitle>Employés</StatTitle>
            </StatHeader>
            <StatValue>{employees.length}</StatValue>
            <StatLabel>Employés actifs</StatLabel>
          </StatCard>

          <StatCard>
            <StatHeader>
              <StatIcon $color="#10b981">
                <Truck size={20} />
              </StatIcon>
              <StatTitle>Livreurs</StatTitle>
            </StatHeader>
            <StatValue>{livreurs.length}</StatValue>
            <StatLabel>Livreurs disponibles</StatLabel>
          </StatCard>

          <StatCard>
            <StatHeader>
              <StatIcon $color="#f59e0b">
                <Users size={20} />
              </StatIcon>
              <StatTitle>Total</StatTitle>
            </StatHeader>
            <StatValue>{users.length}</StatValue>
            <StatLabel>Utilisateurs au total</StatLabel>
          </StatCard>
        </StatsGrid>

        <ManagementSection>
          <SectionHeader>
            <SectionTitle>Liste des Utilisateurs</SectionTitle>
            <ActionButtons>
              <Button onClick={() => refetch()}>
                <RefreshCw size={16} />
                Actualiser
              </Button>
              <Link href="/employee/register">
                <Button>
                  <UserPlus size={16} />
                  Nouvel Employé
                </Button>
              </Link>
            </ActionButtons>
          </SectionHeader>

          <SearchBar>
            <SearchInput
              type="text"
              placeholder="Rechercher par nom ou email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <FilterSelect
              value={roleFilter}
              onChange={(e) => setRoleFilter(e.target.value)}
            >
              <option value="all">Tous les rôles</option>
              <option value="EMPLOYE">Employés</option>
              <option value="LIVREUR">Livreurs</option>
              <option value="admin">Administrateurs</option>
            </FilterSelect>
          </SearchBar>

          <UsersList>
            {filteredUsers.length === 0 ? (
              <EmptyState>
                <h3>Aucun utilisateur trouvé</h3>
                <p>Aucun utilisateur ne correspond à vos critères de recherche.</p>
              </EmptyState>
            ) : (
              filteredUsers.map((user: User) => (
                <UserCard key={user._id}>
                  <UserInfo>
                    <UserName>{user.name}</UserName>
                    <UserDetails>
                      <span>{user.email}</span>
                      {user.phoneNumber && <span>• {user.phoneNumber}</span>}
                      <UserRole $role={user.role || 'user'}>
                        {getRoleIcon(user.role || 'user')}
                        {getRoleLabel(user.role || 'user')}
                      </UserRole>
                      {user.isOnline && (
                        <span style={{ color: '#10b981', display: 'flex', alignItems: 'center', gap: '4px' }}>
                          <CheckCircle size={14} />
                          En ligne
                        </span>
                      )}
                    </UserDetails>
                  </UserInfo>
                  <UserActions>
                    <ActionButton
                      $variant="secondary"
                      onClick={() => {
                        // TODO: Implémenter l'édition
                        toast.info('Fonctionnalité d\'édition à venir');
                      }}
                    >
                      <Edit size={14} />
                      Modifier
                    </ActionButton>
                    <ActionButton
                      $variant="danger"
                      onClick={() => handleDeleteUser(user._id, user.name)}
                      disabled={deleteUserMutation.isPending}
                    >
                      {deleteUserMutation.isPending ? (
                        <LoadingSpinner />
                      ) : (
                        <Trash2 size={14} />
                      )}
                      Supprimer
                    </ActionButton>
                  </UserActions>
                </UserCard>
              ))
            )}
          </UsersList>
        </ManagementSection>
      </Content>
    </Container>
  );
}
