"use client";

import { useParams, useRouter } from "next/navigation";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { DashboardLayout } from "../../../components/layout/DashboardLayout";
import { GlobalStyles } from "../../../components/styled/GlobalStyles";
import styled from "styled-components";
import { ArrowLeft, Truck, Package, CheckCircle, Circle, MapPin, CreditCard, User, Clock, ChevronDown, Check } from "lucide-react";
import { ordersAPI, Order } from "../../../lib/api";
import { useState, useEffect, useRef } from "react";
import Modal from "../../../components/ui/Modal";
import { useModal } from "../../../hooks/useModal";
import { ModernButton } from "../../../components/ui/ModernForm";

const Container = styled.div`
  background: linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%);
  min-height: 100vh;
  padding: 40px 0 0 0;
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
    padding: 20px 0 0 0;
  }
  
  @media (max-width: 480px) {
    padding: 16px 0 0 0;
  }
`;

const ContentWrapper = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 2rem;
  position: relative;
  z-index: 1;
  
  @media (max-width: 768px) {
    padding: 0 1rem;
  }
`;

const Header = styled.div`
  margin-bottom: 40px;
`;

const Title = styled.h1`
  font-size: 3rem;
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
    width: 100px;
    height: 4px;
    background: linear-gradient(90deg, #3b82f6, #8b5cf6, #06b6d4);
    border-radius: 2px;
  }
  
  @media (max-width: 1120px) {
    font-size: 2.5rem;
  }
  
  @media (max-width: 480px) {
    font-size: 2rem;
  }
`;

const OrderDate = styled.p`
  color: #64748b;
  font-size: 1.2rem;
  margin: 0;
  font-weight: 500;
  
  @media (max-width: 1120px) {
    font-size: 1.1rem;
  }
  
  @media (max-width: 480px) {
    font-size: 1rem;
  }
`;

const Grid = styled.div`
  display: grid;
  grid-template-columns: 2fr 1fr;
  gap: 32px;
  margin-bottom: 40px;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    gap: 24px;
  }
`;

const Section = styled.div`
  background: linear-gradient(135deg, #ffffff 0%, #f8fafc 100%);
  border-radius: 20px;
  padding: 2rem;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
  margin-bottom: 24px;
  border: 1px solid rgba(226, 232, 240, 0.8);
  position: relative;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 32px rgba(0, 0, 0, 0.12);
  }
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 4px;
    background: linear-gradient(90deg, #3b82f6, #8b5cf6, #06b6d4);
    border-radius: 20px 20px 0 0;
  }
  
  @media (max-width: 768px) {
    padding: 1.5rem;
    border-radius: 16px;
  }
`;

const SectionTitle = styled.h2`
  font-size: 1.5rem;
  font-weight: 700;
  color: #1e293b;
  margin: 0 0 24px 0;
  display: flex;
  align-items: center;
  gap: 12px;
  
  @media (max-width: 768px) {
    font-size: 1.3rem;
    margin-bottom: 20px;
  }
`;

const InfoGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 24px;

  @media (max-width: 480px) {
    grid-template-columns: 1fr;
    gap: 16px;
  }
`;

const InfoItem = styled.div`
  padding: 20px;
  background: linear-gradient(135deg, rgba(59, 130, 246, 0.05), rgba(139, 92, 246, 0.05));
  border-radius: 16px;
  border: 1px solid rgba(59, 130, 246, 0.1);
  transition: all 0.3s ease;
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 20px rgba(59, 130, 246, 0.15);
  }
`;

const InfoLabel = styled.div`
  font-size: 0.9rem;
  color: #64748b;
  margin-bottom: 8px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.5px;
`;

const InfoValue = styled.div`
  font-size: 1.1rem;
  color: #1e293b;
  font-weight: 700;
`;

const Table = styled.table`
  width: 100%;
  border-collapse: separate;
  border-spacing: 0;
  margin-bottom: 24px;
  border-radius: 16px;
  overflow: hidden;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
`;

const Th = styled.th`
  text-align: left;
  padding: 20px 24px;
  background: linear-gradient(135deg, rgba(59, 130, 246, 0.1), rgba(139, 92, 246, 0.1));
  color: #64748b;
  font-weight: 700;
  font-size: 0.95rem;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  
  &:first-child {
    border-radius: 16px 0 0 0;
  }
  
  &:last-child {
    border-radius: 0 16px 0 0;
  }
`;

const Td = styled.td`
  padding: 20px 24px;
  border-bottom: 1px solid rgba(226, 232, 240, 0.5);
  color: #1e293b;
  font-size: 1rem;
  font-weight: 500;
  background: white;
  
  &:hover {
    background: rgba(59, 130, 246, 0.02);
  }
`;

const TotalSection = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px 24px;
  margin: 16px 0;
  background: linear-gradient(135deg, rgba(59, 130, 246, 0.05), rgba(139, 92, 246, 0.05));
  border-radius: 16px;
  border: 1px solid rgba(59, 130, 246, 0.1);
  transition: all 0.3s ease;
  
  &:hover {
    transform: translateY(-1px);
    box-shadow: 0 4px 12px rgba(59, 130, 246, 0.15);
  }
`;

const TotalLabel = styled.span`
  font-size: 1.2rem;
  font-weight: 700;
  color: #1e293b;
`;

const TotalValue = styled.span`
  font-size: 1.4rem;
  font-weight: 800;
  background: linear-gradient(135deg, #3b82f6, #8b5cf6);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
`;

const Timeline = styled.div`
  position: relative;
  padding-left: 8px;
`;

const TimelineItem = styled.div<{ completed?: boolean }>`
  display: flex;
  align-items: flex-start;
  gap: 20px;
  margin-bottom: 32px;
  position: relative;
  padding-left: 16px;

  &::before {
    content: '';
    position: absolute;
    left: 20px;
    top: 40px;
    width: 3px;
    height: 40px;
    background: ${props => props.completed ? 'linear-gradient(135deg, #3b82f6, #8b5cf6)' : 'rgba(226, 232, 240, 0.8)'};
    border-radius: 2px;
  }

  &:last-child::before {
    display: none;
  }
`;

const TimelineIcon = styled.div<{ completed?: boolean }>`
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: ${props => props.completed 
    ? 'linear-gradient(135deg, #3b82f6, #8b5cf6)' 
    : 'linear-gradient(135deg, #f1f5f9, #e2e8f0)'
  };
  display: flex;
  align-items: center;
  justify-content: center;
  color: ${props => props.completed ? '#fff' : '#94a3b8'};
  z-index: 2;
  box-shadow: ${props => props.completed 
    ? '0 4px 12px rgba(59, 130, 246, 0.3)' 
    : '0 2px 8px rgba(0, 0, 0, 0.1)'
  };
  transition: all 0.3s ease;
  
  &:hover {
    transform: scale(1.1);
  }
`;

const TimelineContent = styled.div`
  flex: 1;
  padding-top: 4px;
`;

const TimelineTitle = styled.div<{ completed?: boolean }>`
  font-weight: 700;
  font-size: 1.1rem;
  color: ${props => props.completed ? '#1e293b' : '#64748b'};
  margin-bottom: 8px;
`;

const TimelineDate = styled.div`
  font-size: 0.95rem;
  color: #64748b;
  font-weight: 500;
`;

const UpdateSection = styled.div`
  margin-top: 32px;
`;

// Select moderne inspiré de React Native Reusables
const SelectContainer = styled.div`
  position: relative;
  margin-bottom: 16px;
`;

const SelectTrigger = styled.button<{ $isOpen: boolean }>`
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16px 20px;
  background: linear-gradient(135deg, #ffffff 0%, #f8fafc 100%);
  border: 2px solid ${({ $isOpen }) => $isOpen ? '#3b82f6' : 'rgba(226, 232, 240, 0.8)'};
  border-radius: 16px;
  font-size: 1rem;
  font-weight: 500;
  color: #1e293b;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
  
  &:hover {
    border-color: #3b82f6;
    box-shadow: 0 4px 12px rgba(59, 130, 246, 0.15);
    transform: translateY(-1px);
  }
  
  &:focus {
    outline: none;
    border-color: #3b82f6;
    box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
  }
`;

const SelectValue = styled.span<{ $placeholder?: boolean }>`
  color: ${({ $placeholder }) => $placeholder ? '#9ca3af' : '#1e293b'};
  font-weight: ${({ $placeholder }) => $placeholder ? '400' : '500'};
`;

const SelectIcon = styled.div<{ $isOpen: boolean }>`
  display: flex;
  align-items: center;
  justify-content: center;
  color: #6b7280;
  transition: transform 0.3s ease;
  transform: ${({ $isOpen }) => $isOpen ? 'rotate(180deg)' : 'rotate(0deg)'};
`;

const SelectContent = styled.div<{ $isOpen: boolean }>`
  position: absolute;
  top: 100%;
  left: 0;
  right: 0;
  z-index: 50;
  margin-top: 4px;
  background: white;
  border: 1px solid rgba(226, 232, 240, 0.8);
  border-radius: 16px;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
  overflow: hidden;
  opacity: ${({ $isOpen }) => $isOpen ? '1' : '0'};
  visibility: ${({ $isOpen }) => $isOpen ? 'visible' : 'hidden'};
  transform: ${({ $isOpen }) => $isOpen ? 'translateY(0)' : 'translateY(-10px)'};
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
`;

const SelectItem = styled.button<{ $isSelected?: boolean }>`
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16px 20px;
  background: ${({ $isSelected }) => $isSelected ? 'linear-gradient(135deg, rgba(59, 130, 246, 0.1), rgba(139, 92, 246, 0.1))' : 'white'};
  color: ${({ $isSelected }) => $isSelected ? '#3b82f6' : '#1e293b'};
  font-weight: ${({ $isSelected }) => $isSelected ? '600' : '500'};
  font-size: 1rem;
  border: none;
  cursor: pointer;
  transition: all 0.2s ease;
  text-align: left;
  
  &:hover {
    background: linear-gradient(135deg, rgba(59, 130, 246, 0.1), rgba(139, 92, 246, 0.1));
    color: #3b82f6;
  }
  
  &:first-child {
    border-radius: 16px 16px 0 0;
  }
  
  &:last-child {
    border-radius: 0 0 16px 16px;
  }
`;

const SelectItemIcon = styled.div<{ $isSelected?: boolean }>`
  display: flex;
  align-items: center;
  justify-content: center;
  color: ${({ $isSelected }) => $isSelected ? '#3b82f6' : 'transparent'};
  transition: color 0.2s ease;
`;

const BackButton = styled.button`
  background: linear-gradient(135deg, rgba(59, 130, 246, 0.1), rgba(139, 92, 246, 0.1));
  border: 1px solid rgba(59, 130, 246, 0.2);
  border-radius: 12px;
  color: #3b82f6;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px 20px;
  margin-bottom: 24px;
  transition: all 0.3s ease;
  
  &:hover {
    background: linear-gradient(135deg, rgba(59, 130, 246, 0.2), rgba(139, 92, 246, 0.2));
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(59, 130, 246, 0.2);
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
  const [isSelectOpen, setIsSelectOpen] = useState(false);
  const selectRef = useRef<HTMLDivElement>(null);

  // Options du select
  const statusOptions = [
    { value: "", label: "Sélectionner un statut...", disabled: true },
    { value: "active", label: "Active" },
    { value: "completed", label: "Completed" },
    { value: "cancelled", label: "Cancelled" }
  ];

  // Fonction pour gérer la sélection
  const handleSelectChange = (value: string) => {
    if (value && !statusOptions.find(opt => opt.value === value)?.disabled) {
      setStatusUpdate(value);
      setIsSelectOpen(false);
    }
  };

  // Fonction pour obtenir le label de la valeur sélectionnée
  const getSelectedLabel = () => {
    const selectedOption = statusOptions.find(opt => opt.value === statusUpdate);
    return selectedOption ? selectedOption.label : "Sélectionner un statut...";
  };

  // Effet pour fermer le select quand on clique à l'extérieur
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (selectRef.current && !selectRef.current.contains(event.target as Node)) {
        setIsSelectOpen(false);
      }
    };

    if (isSelectOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isSelectOpen]);

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
          <ContentWrapper>
            <BackButton onClick={() => router.back()}>
              <ArrowLeft size={20} />
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
                  <SectionTitle>
                    <User size={24} />
                    Customer Information
                  </SectionTitle>
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
                  <SectionTitle>
                    <Package size={24} />
                    Order Details
                  </SectionTitle>
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
                  <SectionTitle>
                    <MapPin size={24} />
                    Shipping Address
                  </SectionTitle>
                  <InfoValue>
                    {order.shippingAddress ? 
                      `${order.shippingAddress.street}, ${order.shippingAddress.city}, ${order.shippingAddress.postalCode}, ${order.shippingAddress.country}` : 
                      '123 Elm Street, Anytown, CA 91234'
                    }
                  </InfoValue>
                </Section>

                <Section>
                  <SectionTitle>
                    <CreditCard size={24} />
                    Payment Information
                  </SectionTitle>
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
                  <SectionTitle>
                    <Clock size={24} />
                    Order Timeline
                  </SectionTitle>
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
                  <SectionTitle>
                    <Truck size={24} />
                    Update Order Status
                  </SectionTitle>
                  <UpdateSection>
                    <SelectContainer ref={selectRef}>
                      <SelectTrigger
                        $isOpen={isSelectOpen}
                        onClick={() => setIsSelectOpen(!isSelectOpen)}
                        type="button"
                      >
                        <SelectValue $placeholder={!statusUpdate}>
                          {getSelectedLabel()}
                        </SelectValue>
                        <SelectIcon $isOpen={isSelectOpen}>
                          <ChevronDown size={20} />
                        </SelectIcon>
                      </SelectTrigger>
                      
                      <SelectContent $isOpen={isSelectOpen}>
                        {statusOptions.map((option) => (
                          <SelectItem
                            key={option.value}
                            $isSelected={statusUpdate === option.value}
                            onClick={() => handleSelectChange(option.value)}
                            disabled={option.disabled}
                            type="button"
                          >
                            {option.label}
                            <SelectItemIcon $isSelected={statusUpdate === option.value}>
                              <Check size={16} />
                            </SelectItemIcon>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </SelectContainer>
                    
                    <ModernButton
                      variant="primary"
                      onClick={() => {
                        if (statusUpdate.trim()) {
                          updateStatusMutation.mutate(statusUpdate);
                          setStatusUpdate("");
                        }
                      }}
                      disabled={!statusUpdate.trim()}
                      loading={updateStatusMutation.isPending}
                    >
                      {updateStatusMutation.isPending ? 'Mise à jour...' : 'Update Status'}
                    </ModernButton>
                  </UpdateSection>
                </Section>
              </div>
            </Grid>
          </ContentWrapper>

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