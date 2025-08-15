"use client";

import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { DashboardLayout } from "../../components/layout/DashboardLayout";
import { GlobalStyles } from "../../components/styled/GlobalStyles";
import styled from "styled-components";
import { Search } from "lucide-react";
import { ordersAPI } from "../../lib/api";
import { useRouter } from "next/navigation";
import { useTranslation } from "../../hooks/useTranslation";

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
  margin-bottom: 2rem;
  
  @media (max-width: 1120px) {
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
  margin: 0 0 0.5rem 0;
  
  @media (max-width: 1120px) {
    font-size: 1.7rem;
  }
  
  @media (max-width: 480px) {
    font-size: 1.4rem;
  }
`;

const Subtitle = styled.p`
  color: ${({ theme }) => theme.colors.text.secondary};
  font-size: 1rem;
  margin: 0;
  
  @media (max-width: 1120px) {
    font-size: 0.9rem;
  }
  
  @media (max-width: 480px) {
    font-size: 0.85rem;
  }
`;

const SearchContainer = styled.div`
  position: relative;
  margin-bottom: 2rem;
  
  @media (max-width: 1120px) {
    margin-bottom: 1.5rem;
  }
  
  @media (max-width: 480px) {
    margin-bottom: 1rem;
  }
`;

const SearchInput = styled.input`
  width: 100%;
  padding: 0.75rem 1rem 0.75rem 2.5rem;
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: 8px;
  font-size: 0.95rem;
  background-color: transparent;
  color: ${({ theme }) => theme.colors.text.primary};

  &:focus {
    outline: none;
    border-color: ${({ theme }) => theme.colors.warning};
    box-shadow: 0 0 0 3px rgb(245 166 35 / 0.08);
  }
  
  @media (max-width: 1120px) {
    padding: 0.6rem 0.8rem 0.6rem 2.2rem;
    font-size: 0.9rem;
  }
  
  @media (max-width: 480px) {
    padding: 0.5rem 0.7rem 0.5rem 2rem;
    font-size: 0.85rem;
  }
`;

const SearchIcon = styled.div`
  position: absolute;
  left: 0.75rem;
  top: 50%;
  transform: translateY(-50%);
  color: ${({ theme }) => theme.colors.text.muted};
  
  @media (max-width: 1120px) {
    left: 0.6rem;
  }
  
  @media (max-width: 480px) {
    left: 0.5rem;
  }
`;

const Tabs = styled.div`
  display: flex;
  gap: 2rem;
  margin-bottom: 2rem;
  
  @media (max-width: 1120px) {
    gap: 1.5rem;
    margin-bottom: 1.5rem;
  }
  
  @media (max-width: 480px) {
    gap: 1rem;
    margin-bottom: 1rem;
    flex-wrap: wrap;
  }
`;

const Tab = styled.button<{ active?: boolean }>`
  background: none;
  border: none;
  font-size: 1rem;
  font-weight: 500;
  color: ${({ active, theme }) => active ? theme.colors.text.primary : theme.colors.text.muted};
  padding: 0.75rem 0;
  cursor: pointer;
  border-bottom: 2px solid ${({ active, theme }) => active ? theme.colors.warning : 'transparent'};
  transition: all 0.2s ease;

  &:hover {
    color: ${({ theme }) => theme.colors.text.primary};
  }
  
  @media (max-width: 1120px) {
    font-size: 0.9rem;
    padding: 0.6rem 0;
  }
  
  @media (max-width: 480px) {
    font-size: 0.85rem;
    padding: 0.5rem 0;
  }
`;

const TableContainer = styled.div`
  background: ${({ theme }) => theme.colors.background};
  border-radius: 12px;
  box-shadow: ${({ theme }) => theme.shadows.md};
  overflow: hidden;
  
  @media (max-width: 1120px) {
    border-radius: 8px;
    overflow-x: auto;
  }
`;

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  background: ${({ theme }) => theme.colors.background};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  border: 1px solid ${({ theme }) => theme.colors.border};
  
  @media (max-width: 1120px) {
    min-width: 600px;
  }
`;

const Th = styled.th`
  text-align: left;
  padding: 1rem;
  background: transparent;
  color: ${({ theme }) => theme.colors.text.muted};
  font-weight: 200;
  font-size: 0.9rem;
  border-top: 1px solid ${({ theme }) => theme.colors.border};
  border-bottom: 1px solid ${({ theme }) => theme.colors.border};
  
  &:last-child {
    border-right: none;
  }
  
  @media (max-width: 1120px) {
    padding: 0.8rem;
    font-size: 0.85rem;
  }
  
  @media (max-width: 480px) {
    padding: 0.6rem;
    font-size: 0.8rem;
  }
`;

const Td = styled.td`
  padding: 1rem;
  border-bottom: 1px solid ${({ theme }) => theme.colors.border};
  color: ${({ theme }) => theme.colors.text.primary};
  font-size: 0.95rem;
  cursor: pointer;
  transition: background-color 0.2s ease;

  &:hover {
    background-color: ${({ theme }) => theme.colors.table.hover};
  }
  
  &:last-child {
    border-right: none;
  }
  
  @media (max-width: 1120px) {
    padding: 0.8rem;
    font-size: 0.9rem;
  }
  
  @media (max-width: 480px) {
    padding: 0.6rem;
    font-size: 0.85rem;
  }
`;

const TableRow = styled.tr`
  cursor: pointer;
  transition: background-color 0.2s ease;

  &:hover {
    background-color: ${({ theme }) => theme.colors.table.hover};
  }
`;

const StatusBadge = styled.span<{ status: string }>`
  display: inline-block;
  padding: 0.3em 1em;
  border-radius: 12px;
  font-size: 0.85em;
  font-weight: 500;
  background: transparent;
  color: ${({ status }) => {
    switch (status) {
      case 'active':
        return '#22c55e';
      case 'completed':
        return '#3b82f6';
      case 'cancelled':
        return '#ef4444';
      default:
        return '#6b7280';
    }
  }};
  
  @media (max-width: 1120px) {
    padding: 0.25em 0.8em;
    font-size: 0.8em;
  }
  
  @media (max-width: 480px) {
    padding: 0.2em 0.6em;
    font-size: 0.75em;
  }
`;

const Pagination = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 1.5rem;
  gap: 0.5rem;
  
  @media (max-width: 1120px) {
    padding: 1.2rem;
    gap: 0.4rem;
  }
  
  @media (max-width: 480px) {
    padding: 1rem;
    gap: 0.3rem;
  }
`;

const PageButton = styled.button<{ active?: boolean }>`
  background: ${({ active, theme }) => active ? theme.colors.primary : 'none'};
  border: none;
  color: ${({ active, theme }) => active ? '#fff' : theme.colors.text.primary};
  padding: 0.5rem 0.75rem;
  border-radius: 6px;
  cursor: pointer;
  font-weight: ${({ active }) => active ? '600' : '400'};
  transition: all 0.2s ease;

  &:hover:not(:disabled) {
    background: ${({ active, theme }) => active ? theme.colors.primary : theme.colors.surface};
  }

  &:disabled {
    color: #ccc;
    cursor: default;
  }
  
  @media (max-width: 1120px) {
    padding: 0.4rem 0.6rem;
    font-size: 0.9rem;
  }
  
  @media (max-width: 480px) {
    padding: 0.3rem 0.5rem;
    font-size: 0.85rem;
  }
`;

const formatStatus = (status: string) => {
  return status.charAt(0).toUpperCase() + status.slice(1);
};

const formatPrice = (price: number) => {
  return `€${price.toFixed(2)}`;
};

export default function OrdersPage() {
  const router = useRouter();
  const { t } = useTranslation();
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    setMounted(true);
  }, []);
  const [activeTab, setActiveTab] = useState('All');
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);

  // Récupération des vraies données depuis l'API
  const { data: orders = [], isLoading, error } = useQuery({
    queryKey: ["orders"],
    queryFn: () => ordersAPI.getAll().then((res) => res.data),
  });

  const filteredOrders = orders.filter(order => {
    // Utiliser le nom de l'utilisateur depuis les données peuplées
    const customerName = typeof order.userId === 'object' && order.userId?.name 
      ? order.userId.name 
      : order.shippingAddress?.fullName || t('orders.table.customer');
    const matchesSearch = order._id.includes(searchTerm) || 
                         customerName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = activeTab === "All" || formatStatus(order.status) === activeTab;
    return matchesSearch && matchesStatus;
  });

  const totalPages = Math.ceil(filteredOrders.length / 5);
  const paginatedOrders = filteredOrders.slice((currentPage - 1) * 5, currentPage * 5);

  return (
    <>
      <GlobalStyles />
      <DashboardLayout hideSidebar>
        <Container>
          <Header>
            <Title>{mounted ? t('orders.title') : ""}</Title>
            <Subtitle>{mounted ? t('orders.subtitle') : ""}</Subtitle>
          </Header>

          <SearchContainer>
            <SearchIcon>
              <Search size={20} />
            </SearchIcon>
            <SearchInput
              type="text"
              placeholder={mounted ? t('orders.search') : ""}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </SearchContainer>

          <Tabs>
            <Tab 
              active={activeTab === "All"} 
              onClick={() => setActiveTab("All")}
            >
              {mounted ? t('orders.tabs.all') : ""}
            </Tab>
            <Tab 
              active={activeTab === "Active"} 
              onClick={() => setActiveTab("Active")}
            >
              {mounted ? t('orders.tabs.pending') : ""}
            </Tab>
            <Tab 
              active={activeTab === "Completed"} 
              onClick={() => setActiveTab("Completed")}
            >
              {mounted ? t('orders.tabs.delivered') : ""}
            </Tab>
            <Tab 
              active={activeTab === "Cancelled"} 
              onClick={() => setActiveTab("Cancelled")}
            >
              {mounted ? t('orders.tabs.cancelled') : ""}
            </Tab>
          </Tabs>

          {isLoading ? (
            <div style={{ textAlign: 'center', padding: '2rem', color: '#666' }}>
              {mounted ? t('common.loading') : ""}
            </div>
          ) : error ? (
            <div style={{ textAlign: 'center', padding: '2rem', color: '#e74c3c' }}>
              {mounted ? t('common.error') : ""}: {error.message}
            </div>
          ) : filteredOrders.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '2rem', color: '#666' }}>
              {mounted ? (t('orders.table.noOrders') || 'Aucune commande trouvée') : ""}
            </div>
          ) : (
            <TableContainer>
              <Table>
                <thead>
                  <tr>
                    <Th>{mounted ? t('orders.table.order') : ""}</Th>
                    <Th>{mounted ? t('orders.table.customer') : ""}</Th>
                    <Th>{mounted ? t('orders.table.date') : ""}</Th>
                    <Th>{mounted ? t('orders.table.status') : ""}</Th>
                    <Th>{mounted ? t('orders.table.total') : ""}</Th>
                  </tr>
                </thead>
                <tbody>
                  {paginatedOrders.map((order) => (
                    <TableRow 
                      key={order._id}
                      onClick={() => router.push(`/orders/${order._id}`)}
                    >
                      <Td>#{order._id.slice(-6)}</Td>
                      <Td>
                        {typeof order.userId === 'object' && order.userId?.name 
                          ? order.userId.name 
                          : order.shippingAddress?.fullName || (mounted ? t('orders.table.customer') : "")}
                      </Td>
                      <Td>{new Date(order.createdAt).toLocaleDateString('en-US')}</Td>
                      <Td>
                        <StatusBadge status={order.status}>
                          {formatStatus(order.status)}
                        </StatusBadge>
                      </Td>
                      <Td>{formatPrice(order.total)}</Td>
                    </TableRow>
                  ))}
                </tbody>
              </Table>
            </TableContainer>
          )}

          {!isLoading && filteredOrders.length > 0 && (
            <Pagination>
              <PageButton
                onClick={() => setCurrentPage(currentPage - 1)}
                disabled={currentPage === 1}
                >
                {mounted ? t('common.previous') : ""}
              </PageButton>
              {Array.from({ length: totalPages }, (_, i) => (
                <PageButton
                  key={i + 1}
                  active={currentPage === i + 1}
                  onClick={() => setCurrentPage(i + 1)}
                >
                  {i + 1}
                </PageButton>
              ))}
              <PageButton
                onClick={() => setCurrentPage(currentPage + 1)}
                disabled={currentPage === totalPages}
                >
                {mounted ? t('common.next') : ""}
              </PageButton>
            </Pagination>
          )}
        </Container>
      </DashboardLayout>
    </>
  );
} 