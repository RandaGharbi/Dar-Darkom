"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { usersAPI } from "../../lib/api";
import { DashboardLayout } from "../../components/layout/DashboardLayout";
import { GlobalStyles } from "../../components/styled/GlobalStyles";
import styled, { DefaultTheme } from "styled-components";
import { Search } from "lucide-react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { useTranslation } from "../../hooks/useTranslation";

// Fonction pour convertir RGB en hex
const rgbToHex = (r: number, g: number, b: number) => {
  return '#' + [r, g, b].map(x => {
    const hex = x.toString(16);
    return hex.length === 1 ? '0' + hex : hex;
  }).join('');
};

// Fonction pour convertir les couleurs hexadécimales en couleurs adaptatives
const getAdaptiveColor = (color: string, theme: DefaultTheme) => {
  // Convertir RGB en hex si nécessaire
  let hexColor = color;
  if (color.startsWith('rgb(')) {
    const rgbMatch = color.match(/rgb\((\d+),\s*(\d+),\s*(\d+)\)/);
    if (rgbMatch) {
      const r = parseInt(rgbMatch[1] ?? "0");
      const g = parseInt(rgbMatch[2] ?? "0");
      const b = parseInt(rgbMatch[3] ?? "0");
      hexColor = rgbToHex(r, g, b);
    }
  }
  
  // Couleurs sombres qui deviennent claires en mode sombre
  const darkToLightColors = {
    '#171412': theme.colors.text.primary, // Marron foncé → Blanc en mode sombre
    '#000000': theme.colors.text.primary, // Noir → Blanc en mode sombre
    '#333333': theme.colors.text.primary, // Gris foncé → Blanc en mode sombre
    '#666666': theme.colors.text.primary, // Gris moyen → Blanc en mode sombre
    '#444444': theme.colors.text.primary, // Gris foncé → Blanc en mode sombre
    '#222222': theme.colors.text.primary, // Gris très foncé → Blanc en mode sombre
    '#1a1a1a': theme.colors.text.primary, // Gris très foncé → Blanc en mode sombre
    '#2d2d2d': theme.colors.text.primary, // Gris foncé → Blanc en mode sombre
    '#555555': theme.colors.text.primary, // Gris moyen → Blanc en mode sombre
    '#777777': theme.colors.text.primary, // Gris moyen → Blanc en mode sombre
    '#888888': theme.colors.text.primary, // Gris moyen → Blanc en mode sombre
    '#999999': theme.colors.text.primary, // Gris clair → Blanc en mode sombre
  };
  
  // Couleurs qui restent inchangées
  const unchangedColors = {
    '#b47b48': '#b47b48', // Marron clair reste inchangé
    '#22c55e': '#22c55e', // Vert reste vert
    '#ffffff': '#ffffff', // Blanc reste blanc
    '#f5f5f5': '#f5f5f5', // Gris très clair reste inchangé
  };
  
  // Vérifier d'abord les couleurs inchangées
  if (unchangedColors[hexColor as keyof typeof unchangedColors]) {
    return unchangedColors[hexColor as keyof typeof unchangedColors];
  }
  
  // Vérifier les couleurs sombres à convertir
  if (darkToLightColors[hexColor as keyof typeof darkToLightColors]) {
    return darkToLightColors[hexColor as keyof typeof darkToLightColors];
  }
  
  // Pour toute autre couleur, utiliser la couleur du thème
  return theme.colors.text.primary;
};

const Container = styled.div`
  padding: 2rem;
  background: linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%);
  min-height: 100vh;
  font-family: 'Inter', 'Segoe UI', Arial, sans-serif;
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
  
  @media (max-width: 1120px) {
    padding: 1.5rem;
  }
  
  @media (max-width: 480px) {
    padding: 1rem;
  }
`;

const Header = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 2rem;
  
  @media (max-width: 1120px) {
    flex-direction: column;
    align-items: flex-start;
    gap: 1rem;
    margin-bottom: 1.5rem;
  }
  
  @media (max-width: 480px) {
    margin-bottom: 1rem;
  }
`;

const Title = styled.h1`
  font-size: 2.8rem;
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
    width: 80px;
    height: 4px;
    background: linear-gradient(90deg, #3b82f6, #8b5cf6, #06b6d4);
    border-radius: 2px;
  }
  
  @media (max-width: 1120px) {
    font-size: 2.4rem;
  }
  
  @media (max-width: 480px) {
    font-size: 2rem;
  }
`;

const SearchInput = styled.div`
  position: relative;
  width: 100%;
  margin-bottom: 20px;
  
  @media (max-width: 1120px) {
    margin-bottom: 18px;
  }
  
  @media (max-width: 480px) {
    margin-bottom: 16px;
  }
`;

const Input = styled.input`
  width: 100%;
  padding: 16px 20px 16px 56px;
  border-radius: 16px;
  font-size: 1rem;
  border: 1px solid rgba(226, 232, 240, 0.8);
  background: linear-gradient(135deg, #ffffff 0%, #f8fafc 100%);
  color: #1e293b;
  font-weight: 500;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  position: relative;
  z-index: 1;

  &:focus {
    outline: none;
    border-color: rgba(59, 130, 246, 0.3);
    box-shadow: 0 8px 32px rgba(0, 0, 0, 0.12);
    transform: translateY(-2px);
  }
  
  &::placeholder {
    color: #64748b;
    font-weight: 400;
  }
  
  @media (max-width: 1120px) {
    padding: 14px 18px 14px 52px;
    font-size: 0.95rem;
  }
  
  @media (max-width: 480px) {
    padding: 12px 16px 12px 48px;
    font-size: 0.9rem;
  }
`;

const SearchIcon = styled.div`
  position: absolute;
  left: 20px;
  top: 50%;
  transform: translateY(-50%);
  color: #64748b;
  z-index: 2;
  
  @media (max-width: 1120px) {
    left: 18px;
  }
  
  @media (max-width: 480px) {
    left: 16px;
  }
`;

const FiltersRow = styled.div`
  display: flex;
  gap: 12px;
  margin-bottom: 16px;
  
  @media (max-width: 1120px) {
    gap: 10px;
    margin-bottom: 14px;
    flex-wrap: wrap;
  }
  
  @media (max-width: 480px) {
    gap: 8px;
    margin-bottom: 12px;
  }
`;

const FilterButton = styled.button<{ $active?: boolean }>`
  padding: 12px 20px;
  border-radius: 12px;
  border: 1px solid ${({ $active }) => 
    $active 
      ? 'rgba(59, 130, 246, 0.2)' 
      : 'rgba(226, 232, 240, 0.8)'
  };
  background: ${({ $active }) => 
    $active 
      ? 'linear-gradient(135deg, rgba(59, 130, 246, 0.1), rgba(139, 92, 246, 0.1))' 
      : 'linear-gradient(135deg, #ffffff 0%, #f8fafc 100%)'
  };
  color: ${({ $active }) => $active ? '#1e293b' : '#64748b'};
  font-size: 0.95rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
  position: relative;
  z-index: 1;
  
  &:hover {
    background: linear-gradient(135deg, rgba(59, 130, 246, 0.1), rgba(139, 92, 246, 0.1));
    border-color: rgba(59, 130, 246, 0.2);
    color: #1e293b;
    transform: translateY(-2px);
    box-shadow: 0 4px 16px rgba(0, 0, 0, 0.1);
  }
  
  @media (max-width: 1120px) {
    padding: 10px 16px;
    font-size: 0.9rem;
  }
  
  @media (max-width: 480px) {
    padding: 8px 14px;
    font-size: 0.85rem;
  }
`;

const TableWrapper = styled.div`
  background: linear-gradient(135deg, #ffffff 0%, #f8fafc 100%);
  overflow-x: auto;
  border: 1px solid rgba(226, 232, 240, 0.8);
  border-radius: 20px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
  position: relative;
  z-index: 1;
  
  @media (max-width: 480px) {
    border-radius: 16px;
  }
`;

const UsersTable = styled.table`
  width: 100%;
  border-collapse: separate;
  border-spacing: 0;
  
  @media (max-width: 1120px) {
    min-width: 600px;
  }
`;

const Th = styled.th`
  text-align: left;
  padding: 20px 24px 16px 24px;
  color: #64748b;
  font-weight: 600;
  font-size: 0.95rem;
  background: linear-gradient(135deg, rgba(59, 130, 246, 0.05), rgba(139, 92, 246, 0.05));
  text-transform: uppercase;
  letter-spacing: 0.5px;
  
  &:first-child {
    border-radius: 20px 0 0 0;
  }
  
  &:last-child {
    border-radius: 0 20px 0 0;
  }
  
  @media (max-width: 1120px) {
    padding: 18px 20px 14px 20px;
    font-size: 0.9rem;
  }
  
  @media (max-width: 480px) {
    padding: 16px 18px 12px 18px;
    font-size: 0.85rem;
  }
`;

const Td = styled.td`
  padding: 20px 24px;
  border-top: 1px solid rgba(226, 232, 240, 0.5);
  font-size: 0.95rem;
  color: #1e293b;
  background: transparent;
  transition: all 0.2s ease;
  font-weight: 500;

  &:hover {
    background: rgba(59, 130, 246, 0.02);
  }
  
  @media (max-width: 1120px) {
    padding: 18px 20px;
    font-size: 0.9rem;
  }
  
  @media (max-width: 480px) {
    padding: 16px 18px;
    font-size: 0.85rem;
  }
`;

const UserCell = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  
  @media (max-width: 1120px) {
    gap: 10px;
  }
  
  @media (max-width: 480px) {
    gap: 8px;
  }
`;

const UserAvatar = styled.div`
  width: 48px;
  height: 48px;
  border-radius: 16px;
  background: linear-gradient(135deg, #3b82f6, #8b5cf6);
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-weight: 700;
  font-size: 1.2rem;
  box-shadow: 0 4px 16px rgba(59, 130, 246, 0.3);
  transition: all 0.3s ease;
  
  &:hover {
    transform: scale(1.05);
    box-shadow: 0 6px 20px rgba(59, 130, 246, 0.4);
  }
`;

const UserName = styled.span`
  font-weight: 700;
  font-size: 1.1rem;
  color: #1e293b;
`;


const DateBadge = styled.span`
  display: inline-block;
  padding: 6px 16px;
  border-radius: 12px;
  background: linear-gradient(135deg, rgba(59, 130, 246, 0.1), rgba(139, 92, 246, 0.1));
  font-size: 0.9rem;
  font-weight: 600;
  color: #1e293b;
  border: 1px solid rgba(59, 130, 246, 0.2);
  transition: all 0.3s ease;
  
  &:hover {
    transform: scale(1.05);
  }
  
  @media (max-width: 1120px) {
    padding: 5px 14px;
    font-size: 0.85rem;
  }
  
  @media (max-width: 480px) {
    padding: 4px 12px;
    font-size: 0.8rem;
  }
`;

const StatusBadge = styled.span<{ active: boolean }>`
  display: inline-block;
  padding: 0.4em 1.2em;
  border-radius: 16px;
  font-size: 0.9em;
  font-weight: 600;
  background: ${({ active }) => 
    active 
      ? 'linear-gradient(135deg, rgba(34, 197, 94, 0.1), rgba(16, 185, 129, 0.1))' 
      : 'linear-gradient(135deg, rgba(239, 68, 68, 0.1), rgba(220, 38, 38, 0.1))'
  };
  color: ${({ active }) => (active ? '#059669' : '#dc2626')};
  border: 1px solid ${({ active }) => 
    active 
      ? 'rgba(34, 197, 94, 0.2)' 
      : 'rgba(239, 68, 68, 0.2)'
  };
  transition: all 0.3s ease;
  
  &:hover {
    transform: scale(1.05);
  }
  
  @media (max-width: 1120px) {
    padding: 0.3em 1em;
    font-size: 0.85em;
  }
  
  @media (max-width: 480px) {
    padding: 0.25em 0.8em;
    font-size: 0.8em;
  }
`;

const Pagination = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 8px;
  margin: 32px 0 0 0;
  background: none;
`;

const PageBtn = styled.button<{ active?: boolean }>`
  width: 48px;
  height: 48px;
  border-radius: 12px;
  border: 1px solid ${({ active }) => 
    active 
      ? 'rgba(59, 130, 246, 0.3)' 
      : 'rgba(226, 232, 240, 0.8)'
  };
  background: ${({ active }) => 
    active 
      ? 'linear-gradient(135deg, #3b82f6, #8b5cf6)' 
      : 'linear-gradient(135deg, #ffffff 0%, #f8fafc 100%)'
  };
  color: ${({ active }) => (active ? '#fff' : '#1e293b')};
  font-weight: 600;
  font-size: 1rem;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: ${({ active }) => 
    active 
      ? '0 4px 20px rgba(59, 130, 246, 0.3)' 
      : '0 2px 8px rgba(0, 0, 0, 0.06)'
  };
  position: relative;
  z-index: 1;
  
  &:hover:not(:disabled) {
    background: ${({ active }) => 
      active 
        ? 'linear-gradient(135deg, #2563eb, #7c3aed)' 
        : 'linear-gradient(135deg, rgba(59, 130, 246, 0.1), rgba(139, 92, 246, 0.1))'
    };
    transform: translateY(-2px);
    box-shadow: ${({ active }) => 
      active 
        ? '0 8px 32px rgba(59, 130, 246, 0.4)' 
        : '0 4px 16px rgba(0, 0, 0, 0.1)'
    };
  }
  
  &:disabled {
    opacity: 0.5;
    cursor: default;
  }
`;

const EmptyState = styled.div`
  text-align: center;
  padding: 4rem 2rem;
  color: #64748b;
  font-size: 1.1rem;
  font-weight: 500;
  
  @media (max-width: 1120px) {
    padding: 3rem 1.5rem;
  }
  
  @media (max-width: 480px) {
    padding: 2rem 1rem;
  }
`;


const PAGE_SIZE = 10;

export default function UsersPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [page, setPage] = useState(1);
  const router = useRouter();
  const { t } = useTranslation();

  const { data: users = [], isLoading } = useQuery({
    queryKey: ["users"],
    queryFn: async () => {
      const response = await usersAPI.getAll();
      return response.data;
    },
  });


  const filteredUsers = users.filter(
    (user) =>
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Pagination
  const totalPages = Math.ceil(filteredUsers.length / PAGE_SIZE);
  const paginatedUsers = filteredUsers.slice(
    (page - 1) * PAGE_SIZE,
    page * PAGE_SIZE
  );

  return (
    <>
      <GlobalStyles />
      <DashboardLayout hideSidebar>
        <Container>
          <Header>
            <Title>CLIENTS</Title>
          </Header>

          <SearchInput>
            <SearchIcon>
              <Search size={20} />
            </SearchIcon>
            <Input
              type="text"
              placeholder="Search customers"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </SearchInput>
          <FiltersRow>
            <FilterButton $active>Status</FilterButton>
            <FilterButton $active>Date</FilterButton>
            <FilterButton>More filters</FilterButton>
          </FiltersRow>
          {isLoading ? (
            <EmptyState>{t('common.loading')}</EmptyState>
          ) : filteredUsers.length === 0 ? (
            <EmptyState>{t('users.table.noUsers') || 'Aucun utilisateur trouvé'}</EmptyState>
          ) : (
            <TableWrapper>
              <UsersTable>
                <thead>
                  <tr>
                    <Th>Name</Th>
                    <Th>Email</Th>
                    <Th>Registration date</Th>
                    <Th>Status</Th>
                    <Th>Last login</Th>
                  </tr>
                </thead>
                <tbody>
                  {paginatedUsers.map((user) => (
                    <tr
                      key={user._id}
                      style={{ cursor: user.role === 'admin' ? "default" : "pointer" }}
                      onClick={() => {
                        if (user.role !== 'admin') {
                          router.push(`/users/${user._id}`);
                        }
                      }}
                    >
                      <Td>
                        <UserCell>
                        {user.profileImage ? (
                          <div style={{ position: 'relative', width: 40, height: 40 }}>
                            <Image
                              src={user.profileImage.replace('192.168.1.73', 'localhost').replace('10.0.2.2', 'localhost')}
                              alt={user.name}
                              width={40}
                              height={40}
                              style={{ 
                                borderRadius: "50%",
                                width: '100%',
                                height: '100%',
                                objectFit: 'cover'
                              }}
                              unoptimized
                              onError={(e) => {
                                const target = e.currentTarget;
                                target.style.display = 'none';
                                const fallback = target.parentElement?.querySelector('.avatar-fallback');
                                if (fallback) {
                                  (fallback as HTMLElement).style.display = 'flex';
                                }
                              }}
                              onLoad={() => {
                              }}
                            />
                            <UserAvatar 
                              className="avatar-fallback" 
                              style={{ 
                                position: 'absolute', 
                                top: 0, 
                                left: 0, 
                                display: 'none',
                                width: '100%',
                                height: '100%'
                              }}
                            >
                              {user.name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)}
                            </UserAvatar>
                          </div>
                        ) : (
                          <UserAvatar>
                            {user.name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)}
                          </UserAvatar>
                        )}
                          <UserName>{user.name}</UserName>
                        </UserCell>
                      </Td>
                      <Td>{user.email}</Td>
                      <Td>
                        <DateBadge>
                          {user.createdAt ? new Date(user.createdAt).toLocaleDateString("en-US") : "01/15/2023"}
                        </DateBadge>
                      </Td>
                      <Td>
                        {user.role === 'admin' ? (
                          <span style={{ color: '#666', fontSize: '0.9rem' }}>-</span>
                        ) : (
                          <StatusBadge active={user._id.charCodeAt(0) % 2 === 0}>
                            {user._id.charCodeAt(0) % 2 === 0 ? "Active" : "Inactive"}
                          </StatusBadge>
                        )}
                      </Td>
                      <Td>
                        {user.lastLogin ? new Date(user.lastLogin).toLocaleDateString("en-US") : "03/10/2024"}
                      </Td>
                    </tr>
                  ))}
                </tbody>
              </UsersTable>
            </TableWrapper>
          )}
          {/* Pagination */}
          {totalPages > 1 && (
            <Pagination>
                  {Array.from({ length: totalPages }, (_, i) => (
                <PageBtn
                      key={i + 1}
                      onClick={() => setPage(i + 1)}
                  active={page === i + 1}
                    >
                      {i + 1}
                </PageBtn>
              ))}
            </Pagination>
          )}
        </Container>
      </DashboardLayout>
    </>
  );
}

