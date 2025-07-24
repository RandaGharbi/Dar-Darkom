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
  background: ${({ theme }) => theme.colors.background};
  min-height: 100vh;
  font-family: 'Inter', 'Segoe UI', Arial, sans-serif;
  
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
  font-size: 2rem;
  font-weight: bold;
  color: ${({ theme }) => theme.colors.text.primary};
  margin: 0;
  
  @media (max-width: 1120px) {
    font-size: 1.7rem;
  }
  
  @media (max-width: 480px) {
    font-size: 1.4rem;
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
  padding: 12px 16px 12px 48px;
  border-radius: 8px;
  font-size: 0.95rem;
  border: 1px solid ${({ theme }) => theme.colors.border};
  background: transparent;
  color: ${({ theme }) => theme.colors.text.primary};

  &:focus {
    outline: none;
    border-color: ${({ theme }) => theme.colors.primary};
  }
  
  &::placeholder {
    color: ${({ theme }) => theme.colors.text.muted};
  }
  
  @media (max-width: 1120px) {
    padding: 10px 14px 10px 44px;
    font-size: 0.9rem;
  }
  
  @media (max-width: 480px) {
    padding: 8px 12px 8px 40px;
    font-size: 0.85rem;
  }
`;

const SearchIcon = styled.div`
  position: absolute;
  left: 16px;
  top: 50%;
  transform: translateY(-50%);
  color: ${({ theme }) => theme.colors.text.muted};
  
  @media (max-width: 1120px) {
    left: 14px;
  }
  
  @media (max-width: 480px) {
    left: 12px;
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

const FilterButton = styled.button<{ active?: boolean }>`
  padding: 8px 16px;
  border-radius: 8px;
  border: 1px solid ${({ theme }) => theme.colors.border};
  background: ${({ active, theme }) => (active ? theme.colors.surface : 'transparent')};
  color: ${({ theme }) => theme.colors.text.primary};
  font-size: 0.9rem;
  cursor: pointer;
  
  &:hover {
    background: ${({ theme }) => theme.colors.surface};
  }
  
  @media (max-width: 1120px) {
    padding: 6px 14px;
    font-size: 0.85rem;
  }
  
  @media (max-width: 480px) {
    padding: 5px 12px;
    font-size: 0.8rem;
  }
`;

const TableWrapper = styled.div`
  background: ${({ theme }) => theme.colors.background};
  overflow-x: auto;
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: 8px;
  
  @media (max-width: 480px) {
    border-radius: 8px;
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
  padding: 16px 20px 12px 20px;
  color: ${({ theme }) => theme.colors.text.muted};
  font-weight: 400;
  font-size: 0.95rem;
  background: transparent;
  
  @media (max-width: 1120px) {
    padding: 14px 16px 10px 16px;
    font-size: 0.9rem;
  }
  
  @media (max-width: 480px) {
    padding: 12px 14px 8px 14px;
    font-size: 0.85rem;
  }
`;

const Td = styled.td`
  padding: 16px 20px;
  border-top: 1px solid ${({ theme }) => theme.colors.border};
  font-size: 0.95rem;
  color: ${({ theme }) => theme.colors.text.primary};
  background: ${({ theme }) => theme.colors.table.row};
  
  @media (max-width: 1120px) {
    padding: 14px 16px;
    font-size: 0.9rem;
  }
  
  @media (max-width: 480px) {
    padding: 12px 14px;
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
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: #b47b48;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-weight: bold;
  font-size: 1.1rem;
`;

const UserName = styled.span`
  font-weight: 600;
  color: ${({ theme }) => getAdaptiveColor('#171412', theme)};
`;


const DateBadge = styled.span`  display: inline-block;
  padding: 4px 12px;
  border-radius: 8px;
  background: ${({ theme }) => theme.colors.surface};
  font-size: 0.9rem;
  color: ${({ theme }) => getAdaptiveColor('#333333', theme)}; // Gris foncé → Blanc en mode sombre
  
  @media (max-width: 1120px) {
    padding: 3px 10px;
    font-size: 0.85rem;
  }
  
  @media (max-width: 480px) {
    padding: 2px 8px;
    font-size: 0.8rem;
  }
`;

const StatusBadge = styled.span<{ active: boolean }>`
  display: inline-block;
  padding: 0.3em 1em;
  border-radius: 12px;
  font-size: 0.95em;
  font-weight: 500;
  background: transparent;
  color: ${({ active, theme }) => {
    if (active) return '#22c55e'; // Vert reste vert
    return getAdaptiveColor('#ef4444', theme); // Rouge → Blanc en mode sombre
  }};
  
  @media (max-width: 1120px) {
    padding: 0.25em 0.8em;
    font-size: 0.85em;
  }
  
  @media (max-width: 480px) {
    padding: 0.2em 0.6em;
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
  width: 40px;
  height: 40px;
  border-radius: 8px;
  border: none;
  background: ${({ active, theme }) => (active ? theme.colors.surface : 'transparent')};
  color: ${({ active, theme }) => {
    if (active) return theme.colors.text.primary;
    return getAdaptiveColor('#171412', theme); // Gris foncé → Blanc en mode sombre
  }};
  font-weight: 500;
  font-size: 1rem;
  cursor: pointer;
  transition: all 0.2s;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: none;
  outline: none;
  
  &:hover {
    background: ${({ active, theme }) => (active ? theme.colors.surface : theme.colors.surface)};
  }
  
  &:disabled {
    opacity: 0.5;
    cursor: default;
  }
`;

const EmptyState = styled.div`
  text-align: center;
  padding: 4rem 2rem;
  color: ${({ theme }) => theme.colors.text.secondary};
  
  @media (max-width: 1120px) {
    padding: 3rem 1.5rem;
  }
  
  @media (max-width: 480px) {
    padding: 2rem 1rem;
  }
`;

const PAGE_SIZE = 5;

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
            <Title>{t('users.title')}</Title>
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
            <FilterButton active>Status</FilterButton>
            <FilterButton active>Date</FilterButton>
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
                      style={{ cursor: "pointer" }}
                      onClick={() => router.push(`/users/${user._id}`)}
                    >
                      <Td>
                        <UserCell>
                        {user.profileImage ? (
                          <div style={{ position: 'relative', width: 40, height: 40 }}>
                            <Image
                              src={user.profileImage.replace('10.0.2.2', 'localhost')}
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
                        <StatusBadge active={Math.random() > 0.5}>
                          {Math.random() > 0.5 ? "Active" : "Inactive"}
                        </StatusBadge>
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

