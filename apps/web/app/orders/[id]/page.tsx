"use client";

import { useParams, useRouter } from "next/navigation";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { DashboardLayout } from "../../../components/layout/DashboardLayout";
import { GlobalStyles } from "../../../components/styled/GlobalStyles";
import styled from "styled-components";
import { ArrowLeft, Truck, Package, CheckCircle, Circle } from "lucide-react";
import { ordersAPI } from "../../../lib/api";
import { useState } from "react";

const Container = styled.div`
  padding: 2rem;
  background: #fff;
  min-height: 100vh;
  font-family: 'Inter', 'Segoe UI', Arial, sans-serif;
`;


const Header = styled.div`
  margin-bottom: 2rem;
`;

const Title = styled.h1`
  font-size: 2.5rem;
  font-weight: bold;
  color: #222;
  margin: 0 0 0.5rem 0;
`;

const OrderDate = styled.p`
  color: #666;
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
  background: #fff;
  border-radius: 12px;
  padding: 1.5rem;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);
  margin-bottom: 1.5rem;
`;

const SectionTitle = styled.h2`
  font-size: 1.2rem;
  font-weight: 600;
  color: #222;
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
  color: #666;
  margin-bottom: 0.25rem;
`;

const InfoValue = styled.div`
  font-size: 1rem;
  color: #222;
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
  background: #f8f8f8;
  color: #666;
  font-weight: 600;
  font-size: 0.9rem;
`;

const Td = styled.td`
  padding: 0.75rem;
  border-bottom: 1px solid #f2f2f2;
  color: #222;
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
  color: #222;
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
  color: ${props => props.completed ? '#222' : '#666'};
  margin-bottom: 0.25rem;
`;

const TimelineDate = styled.div`
  font-size: 0.9rem;
  color: #666;
`;

const UpdateSection = styled.div`
  margin-top: 2rem;
`;

const UpdateInput = styled.textarea`
  width: 100%;
  padding: 1rem;
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  font-size: 1rem;
  resize: vertical;
  min-height: 100px;
  margin-bottom: 1rem;

  &:focus {
    outline: none;
    border-color: #b47b48;
  }
`;

const UpdateButton = styled.button`
  background: #b47b48;
  color: white;
  border: none;
  border-radius: 8px;
  padding: 0.75rem 1.5rem;
  font-weight: 600;
  font-size: 1rem;
  cursor: pointer;
  transition: background 0.2s;

  &:hover {
    background: #a06a3a;
  }
`;

const BackButton = styled.button`
  background: none;
  border: none;
  color: #666;
  font-size: 0.9rem;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0;
  margin-bottom: 1rem;

  &:hover {
    color: #b47b48;
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
  const orderId = params.id as string;

  const { data: order, isLoading, error } = useQuery({
    queryKey: ["order", orderId],
    queryFn: () => ordersAPI.getById(orderId).then((res) => res.data),
    enabled: !!orderId,
  });

  const updateStatusMutation = useMutation({
    mutationFn: async () => {
      // Ici vous pouvez implémenter la mise à jour du statut
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["order", orderId] });
      alert('Statut mis à jour avec succès !');
    },
  });

  const [statusUpdate, setStatusUpdate] = useState("");

  if (isLoading) {
    return (
      <>
        <GlobalStyles />
        <DashboardLayout hideSidebar>
          <Container>
            <div style={{ textAlign: 'center', padding: '2rem', color: '#666' }}>
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
            <div style={{ textAlign: 'center', padding: '2rem', color: '#e74c3c' }}>
              Erreur lors du chargement de la commande
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
      completed: order.status === 'completed' || order.status === 'cancelled'
    },
    {
      title: "Out for Delivery",
      date: dates.outForDelivery,
      icon: <Package size={16} />,
      completed: order.status === 'completed'
    },
    {
      title: "Delivered",
      date: dates.delivered,
      icon: <CheckCircle size={16} />,
      completed: order.status === 'completed'
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
                  <UpdateInput
                    placeholder="Enter status update..."
                    value={statusUpdate}
                    onChange={(e) => setStatusUpdate(e.target.value)}
                  />
                  <UpdateButton
                    onClick={() => {
                      if (statusUpdate.trim()) {
                        updateStatusMutation.mutate(statusUpdate);
                        setStatusUpdate("");
                      }
                    }}
                  >
                    Update Status
                  </UpdateButton>
                </UpdateSection>
              </Section>
            </div>
          </Grid>
        </Container>
      </DashboardLayout>
    </>
  );
} 