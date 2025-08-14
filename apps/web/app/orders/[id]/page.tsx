"use client";

import { useParams, useRouter } from "next/navigation";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { DashboardLayout } from "../../../components/layout/DashboardLayout";
import { GlobalStyles } from "../../../components/styled/GlobalStyles";
import styled from "styled-components";
import { ArrowLeft, Truck, Package, CheckCircle, Circle } from "lucide-react";
import { ordersAPI, Order } from "../../../lib/api";
import { useState } from "react";
import Modal from "../../../components/ui/Modal";
import { useModal } from "../../../hooks/useModal";

const Container = styled.div`
  padding: 2rem;
  background: ${({ theme }) => theme.colors.background};
  min-height: 100vh;
  font-family: 'Inter', 'Segoe UI', Arial, sans-serif;
  color: ${({ theme }) => theme.colors.text.primary};
`;


const Header = styled.div`
  margin-bottom: 2rem;
`;

const Title = styled.h1`
  font-size: 2.5rem;
  font-weight: bold;
  color: ${({ theme }) => theme.colors.text.primary};
  margin: 0 0 0.5rem 0;
`;

const OrderDate = styled.p`
  color: ${({ theme }) => theme.colors.text.secondary};
  font-size: 1rem;
  margin: 0;
`;

const Grid = styled.div`
  display: grid;
  grid-template-columns: 2fr 1fr;
  gap: 2rem;
  margin-bottom: 2rem;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const Section = styled.div`
  background: ${({ theme }) => theme.colors.card.background};
  border-radius: 12px;
  padding: 1.5rem;
  box-shadow: ${({ theme }) => theme.colors.card.shadow};
  margin-bottom: 1.5rem;
  border: 1px solid ${({ theme }) => theme.colors.border};
`;

const SectionTitle = styled.h2`
  font-size: 1.2rem;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.text.primary};
  margin: 0 0 1rem 0;
`;

const InfoGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;

  @media (max-width: 480px) {
    grid-template-columns: 1fr;
  }
`;

const InfoItem = styled.div`
  margin-bottom: 1rem;
`;

const InfoLabel = styled.div`
  font-size: 0.9rem;
  color: ${({ theme }) => theme.colors.text.secondary};
  margin-bottom: 0.25rem;
`;

const InfoValue = styled.div`
  font-size: 1rem;
  color: ${({ theme }) => theme.colors.text.primary};
  font-weight: 500;
`;

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  margin-bottom: 1rem;
`;

const Th = styled.th`
  text-align: left;
  padding: 0.75rem;
  background: ${({ theme }) => theme.colors.table.header};
  color: ${({ theme }) => theme.colors.text.secondary};
  font-weight: 600;
  font-size: 0.9rem;
`;

const Td = styled.td`
  padding: 0.75rem;
  border-bottom: 1px solid ${({ theme }) => theme.colors.border};
  color: ${({ theme }) => theme.colors.text.primary};
  font-size: 0.95rem;
`;

const TotalSection = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem 0;
  margin-top: 1rem;
`;

const TotalLabel = styled.span`
  font-size: 1.1rem;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.text.primary};
`;

const TotalValue = styled.span`
  font-size: 1.3rem;
  font-weight: bold;
  color: #b47b48;
`;

const Timeline = styled.div`
  position: relative;
`;

const TimelineItem = styled.div<{ completed?: boolean }>`
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 1.5rem;
  position: relative;

  &::before {
    content: '';
    position: absolute;
    left: 12px;
    top: 32px;
    width: 2px;
    height: 24px;
    background: ${props => props.completed ? '#b47b48' : '#e0e0e0'};
  }

  &:last-child::before {
    display: none;
  }
`;

const TimelineIcon = styled.div<{ completed?: boolean }>`
  width: 24px;
  height: 24px;
  border-radius: 50%;
  background: ${props => props.completed ? '#b47b48' : '#f0f0f0'};
  display: flex;
  align-items: center;
  justify-content: center;
  color: ${props => props.completed ? '#fff' : '#666'};
  z-index: 1;
`;

const TimelineContent = styled.div`
  flex: 1;
`;

const TimelineTitle = styled.div<{ completed?: boolean }>`
  font-weight: 600;
  color: ${props => props.completed ? props.theme.colors.text.primary : props.theme.colors.text.secondary};
  margin-bottom: 0.25rem;
`;

const TimelineDate = styled.div`
  font-size: 0.9rem;
  color: ${({ theme }) => theme.colors.text.secondary};
`;

const UpdateSection = styled.div`
  margin-top: 2rem;
`;

const UpdateSelect = styled.select`
  width: 100%;
  padding: 1rem;
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: 8px;
  font-size: 1rem;
  margin-bottom: 1rem;
  background: ${({ theme }) => theme.colors.background};
  color: ${({ theme }) => theme.colors.text.primary};
  cursor: pointer;
  appearance: none;
  background-image: url("data:image/svg+xml;charset=UTF-8,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3e%3cpolyline points='6,9 12,15 18,9'%3e%3c/polyline%3e%3c/svg%3e");
  background-repeat: no-repeat;
  background-position: right 1rem center;
  background-size: 1em;
  padding-right: 2.5rem;

  &:focus {
    outline: none;
    border-color: ${({ theme }) => theme.colors.primary};
    box-shadow: 0 0 0 2px ${({ theme }) => theme.colors.primary}20;
  }

  &:hover {
    border-color: ${({ theme }) => theme.colors.primary};
  }

  option {
    background: ${({ theme }) => theme.colors.background};
    color: ${({ theme }) => theme.colors.text.primary};
    padding: 0.5rem;
  }

  &::-ms-expand {
    display: none;
  }
`;

const UpdateButton = styled.button`
  background: ${({ theme }) => theme.colors.button.primary};
  color: ${({ theme }) => theme.colors.button.text};
  border: none;
  border-radius: 8px;
  padding: 0.75rem 1.5rem;
  font-weight: 600;
  font-size: 1rem;
  cursor: pointer;
  transition: background 0.2s;

  &:hover {
    background: ${({ theme }) => theme.colors.primary};
  }
`;

const BackButton = styled.button`
  background: none;
  border: none;
  color: ${({ theme }) => theme.colors.text.secondary};
  font-size: 0.9rem;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0;
  margin-bottom: 1rem;

  &:hover {
    color: ${({ theme }) => theme.colors.primary};
  }
`;

interface OrderProduct {
  name?: string;
  qty: number;
  price?: number;
}

export default function OrderDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const queryClient = useQueryClient();
  const { modalState, showSuccess, hideModal } = useModal();
  const orderId = params.id as string;

  const { data: order, isLoading, error } = useQuery({
    queryKey: ["order", orderId],
    queryFn: () => ordersAPI.getById(orderId).then((res) => res.data),
    enabled: !!orderId,
  });

  const updateStatusMutation = useMutation({
    mutationFn: async (statusUpdate: string) => {
      // Valider que le statut est valide
      const validStatuses: Order['status'][] = ['active', 'completed', 'cancelled'];
      if (!validStatuses.includes(statusUpdate as Order['status'])) {
        throw new Error('Statut invalide');
      }
      
      // Appeler l'API pour mettre à jour le statut
      return ordersAPI.updateStatus(orderId, statusUpdate as Order['status']);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["order", orderId] });
      showSuccess('Statut mis à jour avec succès !');
    },
    onError: () => {
      // Ici vous pourriez afficher une notification d'erreur
    },
  });

  const [statusUpdate, setStatusUpdate] = useState("");

  if (isLoading) {
    return (
      <>
        <GlobalStyles />
        <DashboardLayout hideSidebar>
          <Container>
            <div style={{ textAlign: 'center', padding: '2rem', color: '#827869' }}>
              Chargement des détails de la commande...
            </div>
          </Container>
        </DashboardLayout>
      </>
    );
  }

  if (error || !order) {
    return (
      <>
        <GlobalStyles />
        <DashboardLayout hideSidebar>
          <Container>
            <div style={{ textAlign: 'center', padding: '2rem', color: '#d84315' }}>
              <h2>Erreur lors du chargement de la commande</h2>
              <p>La commande demandée n&apos;existe pas ou n&apos;est pas accessible.</p>
              <button 
                onClick={() => router.push('/orders')}
                style={{
                  background: '#b47b48',
                  color: 'white',
                  border: 'none',
                  padding: '0.75rem 1.5rem',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  marginTop: '1rem'
                }}
              >
                Retour à la liste des commandes
              </button>
            </div>
          </Container>
        </DashboardLayout>
      </>
    );
  }

  const customerName = typeof order.userId === 'object' && order.userId?.name 
    ? order.userId.name 
    : order.shippingAddress?.fullName || 'Unknown Customer';

  const customerEmail = typeof order.userId === 'object' && order.userId?.email 
    ? order.userId.email 
    : 'N/A';

  const customerPhone = typeof order.userId === 'object' && order.userId?.phoneNumber 
    ? order.userId.phoneNumber 
    : 'N/A';

  // Fonction pour calculer les dates de la chronologie
  const calculateTimelineDates = () => {
    const orderDate = new Date(order.createdAt);
    const addDays = (date: Date, days: number) => {
      const newDate = new Date(date);
      newDate.setDate(date.getDate() + days);
      return newDate;
    };

    const formatDate = (date: Date) => {
      return date.toLocaleDateString('en-US', { 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
      });
    };

    return {
      orderPlaced: formatDate(orderDate),
      orderShipped: formatDate(addDays(orderDate, 2)),
      outForDelivery: formatDate(addDays(orderDate, 7)),
      delivered: formatDate(addDays(orderDate, 10))
    };
  };

  const dates = calculateTimelineDates();

      const timelineSteps = [
      {
        title: "Order Placed",
        date: dates.orderPlaced,
        icon: <Circle size={16} />,
        completed: true
      },
      {
        title: "Order Shipped",
        date: dates.orderShipped,
        icon: <Truck size={16} />,
        completed: order.status === "completed" || order.status === "cancelled"
      },
      {
        title: "Out for Delivery",
        date: dates.outForDelivery,
        icon: <Package size={16} />,
        completed: order.status === "completed"
      },
      {
        title: "Delivered",
        date: dates.delivered,
        icon: <CheckCircle size={16} />,
        completed: order.status === "completed"
      }
    ];

  return (
    <>
      <GlobalStyles />
      <DashboardLayout hideSidebar>
        <Container>
          <BackButton onClick={() => router.back()}>
            <ArrowLeft size={16} />
            Orders / Order #{order._id.slice(-6)}
          </BackButton>

          <Header>
            <Title>Order #{order._id.slice(-6)}</Title>
            <OrderDate>
              Placed on {new Date(order.createdAt).toLocaleDateString('en-US', { 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric' 
              })}
            </OrderDate>
          </Header>

          <Grid>
            <div>
              <Section>
                <SectionTitle>Customer Information</SectionTitle>
                <InfoGrid>
                  <InfoItem>
                    <InfoLabel>Name</InfoLabel>
                    <InfoValue>{customerName}</InfoValue>
                  </InfoItem>
                  <InfoItem>
                    <InfoLabel>Email</InfoLabel>
                    <InfoValue>{customerEmail}</InfoValue>
                  </InfoItem>
                  <InfoItem>
                    <InfoLabel>Phone</InfoLabel>
                    <InfoValue>{customerPhone}</InfoValue>
                  </InfoItem>
                </InfoGrid>
              </Section>

              <Section>
                <SectionTitle>Order Details</SectionTitle>
                <Table>
                  <thead>
                    <tr>
                      <Th>Product</Th>
                      <Th>Quantity</Th>
                      <Th>Price</Th>
                      <Th>Total</Th>
                    </tr>
                  </thead>
                  <tbody>
                    {order.products?.map((item: OrderProduct, index: number) => (
                      <tr key={index}>
                        <Td>{item.name || 'Product Name'}</Td>
                        <Td>{item.qty}</Td>
                        <Td>{item.price?.toFixed(2) || '0.00'} €</Td>
                        <Td>{((item.price || 0) * item.qty).toFixed(2)} €</Td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
                <TotalSection>
                  <TotalLabel>Subtotal</TotalLabel>
                  <TotalValue>{(order.total - 5).toFixed(2)} €</TotalValue>
                </TotalSection>
                <TotalSection>
                  <TotalLabel>Shipping</TotalLabel>
                  <TotalValue>5.00 €</TotalValue>
                </TotalSection>
                <TotalSection>
                  <TotalLabel>Total</TotalLabel>
                  <TotalValue>{order.total.toFixed(2)} €</TotalValue>
                </TotalSection>
              </Section>

              <Section>
                <SectionTitle>Shipping Address</SectionTitle>
                <InfoValue>
                  {order.shippingAddress ? 
                    `${order.shippingAddress.street}, ${order.shippingAddress.city}, ${order.shippingAddress.postalCode}, ${order.shippingAddress.country}` : 
                    '123 Elm Street, Anytown, CA 91234'
                  }
                </InfoValue>
              </Section>

              <Section>
                <SectionTitle>Payment Information</SectionTitle>
                <InfoGrid>
                  <InfoItem>
                    <InfoLabel>Payment Method</InfoLabel>
                    <InfoValue>Credit Card</InfoValue>
                  </InfoItem>
                  <InfoItem>
                    <InfoLabel>Card Number</InfoLabel>
                    <InfoValue>************{Math.floor(Math.random() * 9000) + 1000}</InfoValue>
                  </InfoItem>
                </InfoGrid>
              </Section>
            </div>

            <div>
              <Section>
                <SectionTitle>Order Timeline</SectionTitle>
                <Timeline>
                  {timelineSteps.map((step, index) => (
                    <TimelineItem key={index} completed={step.completed}>
                      <TimelineIcon completed={step.completed}>
                        {step.icon}
                      </TimelineIcon>
                      <TimelineContent>
                        <TimelineTitle completed={step.completed}>
                          {step.title}
                        </TimelineTitle>
                        <TimelineDate>{step.date}</TimelineDate>
                      </TimelineContent>
                    </TimelineItem>
                  ))}
                </Timeline>
              </Section>

              <Section>
                <SectionTitle>Update Order Status</SectionTitle>
                <UpdateSection>
                  <UpdateSelect
                    value={statusUpdate}
                    onChange={(e) => setStatusUpdate(e.target.value)}
                  >
                    <option value="">Sélectionner un statut...</option>
                    <option value="active">Active</option>
                    <option value="completed">Completed</option>
                    <option value="cancelled">Cancelled</option>
                  </UpdateSelect>
                  <UpdateButton
                    onClick={() => {
                      if (statusUpdate.trim()) {
                        updateStatusMutation.mutate(statusUpdate);
                        setStatusUpdate("");
                      }
                    }}
                    disabled={!statusUpdate.trim()}
                  >
                    Update Status
                  </UpdateButton>
                </UpdateSection>
              </Section>
            </div>
          </Grid>

          {/* Modal pour les notifications */}
          <Modal
            isOpen={modalState.isOpen}
            onClose={hideModal}
            title={modalState.title}
            message={modalState.message}
            type={modalState.type}
            onConfirm={modalState.onConfirm}
            confirmText={modalState.confirmText}
            cancelText={modalState.cancelText}
            showCancel={modalState.showCancel}
          />
        </Container>
      </DashboardLayout>
    </>
  );
} 