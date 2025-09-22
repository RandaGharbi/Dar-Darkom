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
  margin-bottom: 2rem;
  
  @media (max-width: 1120px) {
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
  margin: 0 0 12px 0;
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

const Subtitle = styled.p`
  color: #64748b;
  font-size: 1.2rem;
  margin: 0;
  font-weight: 500;
  line-height: 1.6;
  
  @media (max-width: 1120px) {
    font-size: 1.1rem;
  }
  
  @media (max-width: 480px) {
    font-size: 1rem;
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
  padding: 16px 20px 16px 56px;
  border: 1px solid rgba(226, 232, 240, 0.8);
  border-radius: 16px;
  font-size: 1rem;
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
  background: ${({ active }) => 
    active 
      ? 'linear-gradient(135deg, rgba(59, 130, 246, 0.1), rgba(139, 92, 246, 0.1))' 
      : 'transparent'
  };
  border: 1px solid ${({ active }) => 
    active 
      ? 'rgba(59, 130, 246, 0.2)' 
      : 'transparent'
  };
  border-radius: 12px;
  font-size: 1rem;
  font-weight: 600;
  color: ${({ active }) => active ? '#1e293b' : '#64748b'};
  padding: 12px 24px;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  position: relative;
  z-index: 1;

  &:hover {
    background: linear-gradient(135deg, rgba(59, 130, 246, 0.1), rgba(139, 92, 246, 0.1));
    border-color: rgba(59, 130, 246, 0.2);
    color: #1e293b;
    transform: translateY(-2px);
  }
  
  @media (max-width: 1120px) {
    font-size: 0.95rem;
    padding: 10px 20px;
  }
  
  @media (max-width: 480px) {
    font-size: 0.9rem;
    padding: 8px 16px;
  }
`;

const TableContainer = styled.div`
  background: linear-gradient(135deg, #ffffff 0%, #f8fafc 100%);
  border-radius: 20px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
  overflow: hidden;
  border: 1px solid rgba(226, 232, 240, 0.8);
  position: relative;
  z-index: 1;
  
  @media (max-width: 1120px) {
    border-radius: 16px;
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
  border-bottom: 1px solid rgba(226, 232, 240, 0.5);
  color: #1e293b;
  font-size: 0.95rem;
  cursor: pointer;
  transition: all 0.2s ease;
  font-weight: 500;

  &:hover {
    background: rgba(59, 130, 246, 0.02);
  }
  
  &:last-child {
    border-right: none;
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

const TableRow = styled.tr`
  cursor: pointer;
  transition: background-color 0.2s ease;

  &:hover {
    background-color: ${({ theme }) => theme.colors.table.hover};
  }
`;

const StatusBadge = styled.span<{ status: string }>`
  display: inline-block;
  padding: 0.4em 1.2em;
  border-radius: 16px;
  font-size: 0.9em;
  font-weight: 600;
  background: ${({ status }) => {
    switch (status) {
      case 'active':
        return 'linear-gradient(135deg, rgba(34, 197, 94, 0.1), rgba(16, 185, 129, 0.1))';
      case 'completed':
        return 'linear-gradient(135deg, rgba(59, 130, 246, 0.1), rgba(37, 99, 235, 0.1))';
      case 'cancelled':
        return 'linear-gradient(135deg, rgba(239, 68, 68, 0.1), rgba(220, 38, 38, 0.1))';
      default:
        return 'linear-gradient(135deg, rgba(107, 114, 128, 0.1), rgba(75, 85, 99, 0.1))';
    }
  }};
  color: ${({ status }) => {
    switch (status) {
      case 'active':
        return '#059669';
      case 'completed':
        return '#2563eb';
      case 'cancelled':
        return '#dc2626';
      default:
        return '#6b7280';
    }
  }};
  border: 1px solid ${({ status }) => {
    switch (status) {
      case 'active':
        return 'rgba(34, 197, 94, 0.2)';
      case 'completed':
        return 'rgba(59, 130, 246, 0.2)';
      case 'cancelled':
        return 'rgba(239, 68, 68, 0.2)';
      default:
        return 'rgba(107, 114, 128, 0.2)';
    }
  }};
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
  background: ${({ active }) => 
    active 
      ? 'linear-gradient(135deg, #3b82f6, #8b5cf6)' 
      : 'linear-gradient(135deg, #ffffff 0%, #f8fafc 100%)'
  };
  border: 1px solid ${({ active }) => 
    active 
      ? 'rgba(59, 130, 246, 0.3)' 
      : 'rgba(226, 232, 240, 0.8)'
  };
  color: ${({ active }) => active ? '#fff' : '#1e293b'};
  padding: 12px 20px;
  border-radius: 12px;
  cursor: pointer;
  font-weight: 600;
  font-size: 0.95rem;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
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
    color: #94a3b8;
    cursor: default;
    opacity: 0.5;
  }
  
  @media (max-width: 1120px) {
    padding: 10px 16px;
    font-size: 0.9rem;
  }
  
  @media (max-width: 480px) {
    padding: 8px 12px;
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
            <Title>COMMANDES</Title>
            <Subtitle>Gérez les commandes de vos clients avec style tunisien</Subtitle>
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