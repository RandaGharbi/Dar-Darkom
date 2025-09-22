"use client";

import React, { useMemo, useCallback } from 'react';
import { useQuery } from "@tanstack/react-query";
import { DashboardLayout } from "../../../components/layout/DashboardLayout";
import { GlobalStyles } from "../../../components/styled/GlobalStyles";
import styled from "styled-components";
import { usersAPI } from "../../../lib/api";
import { useState, useEffect } from "react";
import Image from "next/image";
import { OrdersTab, FavoritesTab, PaymentMethodsTab, ActivityLogTab } from "../../../components/user-tabs";

const PageWrapper = styled.div`
  background: linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%);
  min-height: 100vh;
  padding: 0;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', sans-serif;
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
`;

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

const HeroSection = styled.div`
  background: linear-gradient(135deg, rgba(59, 130, 246, 0.1), rgba(139, 92, 246, 0.1));
  border-radius: 24px;
  padding: 40px;
  margin-bottom: 40px;
  position: relative;
  overflow: hidden;
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-image: 
      radial-gradient(circle at 20% 20%, rgba(59, 130, 246, 0.1) 0%, transparent 50%),
      radial-gradient(circle at 80% 80%, rgba(139, 92, 246, 0.1) 0%, transparent 50%);
    pointer-events: none;
  }
`;

const HeroContent = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 40px;
  align-items: center;
  position: relative;
  z-index: 1;
  
  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    gap: 24px;
  }
`;

const HeroText = styled.div`
  h2 {
    font-size: 2.5rem;
    font-weight: 800;
    background: linear-gradient(135deg, #1e293b, #475569);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
    margin-bottom: 16px;
    line-height: 1.2;
  }
  
  p {
    font-size: 1.1rem;
    color: #64748b;
    line-height: 1.6;
    margin-bottom: 24px;
  }
  
  @media (max-width: 768px) {
    h2 {
      font-size: 2rem;
    }
    
    p {
      font-size: 1rem;
    }
  }
`;

const HeroImages = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;
  height: 300px;
  
  @media (max-width: 768px) {
    height: 200px;
  }
`;

const ImageContainer = styled.div`
  position: relative;
  border-radius: 16px;
  overflow: hidden;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
  transition: transform 0.3s ease;
  
  &:hover {
    transform: scale(1.05);
  }
  
  &:nth-child(1) {
    grid-row: 1 / 3;
  }
  
  &:nth-child(2) {
    grid-row: 1 / 2;
  }
  
  &:nth-child(3) {
    grid-row: 2 / 3;
  }
`;

const ImageOverlay = styled.div`
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  background: linear-gradient(transparent, rgba(0, 0, 0, 0.7));
  color: white;
  padding: 16px;
  font-size: 0.9rem;
  font-weight: 600;
`;

const TwoColumnGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 24px;
  margin-bottom: 32px;
  
  @media (max-width: 1120px) {
    grid-template-columns: 1fr;
    gap: 20px;
    margin-bottom: 24px;
  }
  
  @media (max-width: 480px) {
    gap: 16px;
    margin-bottom: 20px;
  }
`;

const UserProfileCard = styled.div`
  background: linear-gradient(135deg, rgba(59, 130, 246, 0.1), rgba(139, 92, 246, 0.1));
  border-radius: 24px;
  padding: 40px;
  margin-bottom: 40px;
  position: relative;
  overflow: hidden;
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-image: 
      radial-gradient(circle at 20% 20%, rgba(59, 130, 246, 0.1) 0%, transparent 50%),
      radial-gradient(circle at 80% 80%, rgba(139, 92, 246, 0.1) 0%, transparent 50%);
    pointer-events: none;
  }
`;

const UserProfileContent = styled.div`
  display: grid;
  grid-template-columns: auto 1fr;
  gap: 40px;
  align-items: center;
  position: relative;
  z-index: 1;
  
  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    gap: 24px;
    text-align: center;
  }
`;

const Avatar = styled.div`
  width: 120px;
  height: 120px;
  border-radius: 50%;
  background: linear-gradient(135deg, #3b82f6, #8b5cf6);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 3rem;
  color: white;
  overflow: hidden;
  position: relative;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
  transition: transform 0.3s ease;
  
  &:hover {
    transform: scale(1.05);
  }
  
  @media (max-width: 768px) {
    width: 100px;
    height: 100px;
    font-size: 2.5rem;
  }
`;

const UserInfo = styled.div`
  h2 {
    font-size: 2.5rem;
    font-weight: 800;
    background: linear-gradient(135deg, #1e293b, #475569);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
    margin-bottom: 16px;
    line-height: 1.2;
  }
  
  p {
  font-size: 1.1rem;
    color: #64748b;
    line-height: 1.6;
    margin-bottom: 24px;
  }
  
  @media (max-width: 768px) {
    h2 {
      font-size: 2rem;
    }
    
    p {
  font-size: 1rem;
    }
  }
`;

const TabsContainer = styled.div`
  background: linear-gradient(135deg, #ffffff 0%, #f8fafc 100%);
  border: 1px solid rgba(226, 232, 240, 0.8);
  border-radius: 20px;
  padding: 0.5rem;
  margin-bottom: 32px;
  display: flex;
  gap: 0.5rem;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
  overflow-x: auto;
  
  @media (max-width: 600px) {
    gap: 0.25rem;
    padding: 0.25rem;
    margin-bottom: 24px;
  }
`;

const Tab = styled.button<{ active?: boolean }>`
  background: ${props => props.active 
    ? 'linear-gradient(135deg, #3b82f6, #8b5cf6)' 
    : 'transparent'
  };
  border: none;
  font-size: 14px;
  font-weight: 600;
  color: ${props => props.active ? 'white' : '#64748b'};
  padding: 0.75rem 1.5rem;
  border-radius: 16px;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  white-space: nowrap;
  position: relative;
  overflow: hidden;
  outline: none;
  
  &:hover:not([data-active="true"]) {
    background: rgba(59, 130, 246, 0.1);
    color: #3b82f6;
    transform: translateY(-1px);
  }
  
  &:active {
    transform: translateY(0);
  }
  
  &:focus {
    outline: 2px solid rgba(59, 130, 246, 0.5);
    outline-offset: 2px;
  }
  
  @media (max-width: 600px) {
    padding: 0.5rem 1rem;
    font-size: 12px;
  }
`;

const SectionTitle = styled.h3`
  font-size: 28px;
  font-weight: 800;
  background: linear-gradient(135deg, #1e293b, #475569, #64748b);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  margin-bottom: 24px;
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
    font-size: 24px;
  }
  
  @media (max-width: 480px) {
    font-size: 20px;
  }
`;

const Card = styled.div`
  background: linear-gradient(135deg, #ffffff 0%, #f8fafc 100%);
  border: 1px solid rgba(226, 232, 240, 0.8);
  border-radius: 20px;
  padding: 32px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
  position: relative;
  overflow: hidden;
  
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
  
  @media (max-width: 600px) {
    padding: 24px;
  }
`;

const Form = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 2rem;
  margin-bottom: 2.5rem;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    gap: 1.5rem;
  }
`;

const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
  position: relative;
`;

const Label = styled.label`
  font-size: 0.95rem;
  font-weight: 600;
  color: #374151;
  margin-bottom: 0.75rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const Input = styled.input`
  padding: 0.75rem;
  border: 1px solid rgba(226, 232, 240, 0.8);
  border-radius: 12px;
  background: #ffffff;
  color: #1f2937;
  font-size: 1rem;
  font-weight: 500;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  position: relative;

  &:focus {
    outline: none;
    border-color: #3b82f6;
    box-shadow: 0 0 0 4px rgba(59, 130, 246, 0.1);
  }
  
  &:hover:not(:focus) {
    border-color: #9ca3af;
  }

  &::placeholder {
    color: #9ca3af;
    font-weight: 400;
  }
`;

const ButtonRow = styled.div`
  display: flex;
  gap: 1.5rem;
  justify-content: flex-end;
  margin-top: 1rem;

  @media (max-width: 768px) {
    flex-direction: column;
    gap: 1rem;
  }
`;

const UpdateButton = styled.button`
  padding: 0.75rem 1.5rem;
  background: linear-gradient(135deg, #3b82f6, #8b5cf6);
  color: white;
  border: none;
  border-radius: 12px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  position: relative;
  overflow: hidden;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);

  &:hover:not(:disabled) {
    transform: translateY(-2px);
    box-shadow: 0 8px 25px rgba(59, 130, 246, 0.3);
  }
  
  &:active {
    transform: translateY(0);
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
    transform: none;
  }
`;

const DeleteButton = styled.button`
  padding: 0.75rem 1.5rem;
  background: linear-gradient(135deg, #ef4444, #dc2626);
  color: white;
  border: none;
  border-radius: 12px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  position: relative;
  overflow: hidden;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);

  &:hover:not(:disabled) {
    transform: translateY(-2px);
    box-shadow: 0 8px 25px rgba(239, 68, 68, 0.3);
  }
  
  &:active {
    transform: translateY(0);
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
    transform: none;
  }
`;

// Modal styles
const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
`;

const ModalContent = styled.div`
  background: ${({ theme }) => theme.colors.card.background};
  border-radius: ${({ theme }) => theme.borderRadius.lg};
  padding: 2rem;
  max-width: 400px;
  width: 90%;
  box-shadow: ${({ theme }) => theme.shadows.lg};
  text-align: center;
  border: 1px solid ${({ theme }) => theme.colors.border};
`;

const ModalTitle = styled.h3`
  margin: 0 0 1rem 0;
  font-size: 1.3rem;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.text.primary};
`;

const ModalMessage = styled.p`
  margin: 0 0 1.5rem 0;
  color: ${({ theme }) => theme.colors.text.secondary};
  line-height: 1.5;
`;

const ModalButtons = styled.div`
  display: flex;
  gap: 1rem;
  justify-content: center;
`;

const ModalButton = styled.button<{ variant?: 'primary' | 'secondary' | 'danger' }>`
  padding: 0.7rem 1.5rem;
  border-radius: ${({ theme }) => theme.borderRadius.md};
  font-weight: 500;
  cursor: pointer;
  border: none;
  transition: all 0.2s;
  
  ${props => {
    if (props.variant === 'danger') {
      return `
        background: ${props.theme.colors.error};
        color: white;
        &:hover {
          background: #c82333;
        }
      `;
    }
    if (props.variant === 'secondary') {
      return `
        background: ${props.theme.colors.surface};
        color: ${props.theme.colors.text.secondary};
        border: 1px solid ${props.theme.colors.border};
        &:hover {
          background: ${props.theme.colors.border};
        }
      `;
    }
    return `
      background: ${props.theme.colors.primary};
      color: white;
      &:hover {
        background: ${props.theme.colors.secondary};
      }
    `;
  }}
`;

export default function UserDetailsPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = React.use(params);
  const { data: user, isLoading } = useQuery({
    queryKey: ['user', id],
    queryFn: () => usersAPI.getById(id).then(res => res.data),
    enabled: !!id,
  });
  const [activeTab, setActiveTab] = useState('Profile');
  // Ajout pour corriger l'hydratation :
  const [createdAtFormatted, setCreatedAtFormatted] = useState<string | null>(null);
  
  // États pour les champs du formulaire
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phoneNumber: '',
    address: '',
    gender: ''
  });

  // États pour les modals
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [showErrorModal, setShowErrorModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [modalMessage, setModalMessage] = useState('');
  const [isActionLoading, setIsActionLoading] = useState(false);

  useEffect(() => {
    if (user && user.createdAt) {
      setCreatedAtFormatted(
        new Date(user.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })
      );
    }
    // Initialiser les données du formulaire quand l'utilisateur est chargé
    if (user) {
      setFormData({
        name: user.name || '',
        email: user.email || '',
        phoneNumber: user.phoneNumber || '',
        address: user.address || '',
        gender: user.gender || ''
      });
    }
  }, [user?.createdAt, user]);

  // Fonction pour gérer les changements dans les champs
  const handleInputChange = useCallback((field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  }, []);

  // Handler optimisé pour les onglets
  const handleTabChange = useCallback((tab: string) => {
    setActiveTab(tab);
  }, []);

  // Fonction pour mettre à jour le profil
  const handleUpdateProfile = useCallback(async () => {
    setIsActionLoading(true);
    try {
      await usersAPI.update(id, formData);
      setModalMessage('Profil mis à jour avec succès !');
      setShowSuccessModal(true);
          } catch {
        setModalMessage('Erreur lors de la mise à jour du profil');
        setShowErrorModal(true);
      } finally {
      setIsActionLoading(false);
    }
  }, [id, formData]);

  // Fonction pour ouvrir le modal de suppression
  const handleDeleteClick = useCallback(() => {
    setShowDeleteModal(true);
  }, []);

  // Fonction pour supprimer le profil
  const handleDeleteProfile = useCallback(async () => {
    setIsActionLoading(true);
    try {
      await usersAPI.delete(id);
      setModalMessage('Profil supprimé avec succès !');
      setShowSuccessModal(true);
          } catch {
        setModalMessage('Erreur lors de la suppression du profil');
        setShowErrorModal(true);
      } finally {
      setIsActionLoading(false);
      setShowDeleteModal(false);
    }
  }, [id]);

  // Mémorisation du contenu des onglets pour éviter les re-renders
  const tabContent = useMemo(() => {
    switch (activeTab) {
      case 'Profile':
        return (
          <>
            <SectionTitle>Profile Information</SectionTitle>
            <Card>
              <Form>
                <FormGroup>
                  <Label>
                    <span>👤</span>
                    Full Name
                  </Label>
                  <Input 
                    type="text" 
                    value={formData.name} 
                    onChange={(e) => handleInputChange('name', e.target.value)}
                  />
                </FormGroup>
                <FormGroup>
                  <Label>
                    <span>📧</span>
                    Email
                  </Label>
                  <Input 
                    type="email" 
                    value={formData.email} 
                    onChange={(e) => handleInputChange('email', e.target.value)}
                  />
                </FormGroup>
                <FormGroup>
                  <Label>
                    <span>📱</span>
                    Phone Number
                  </Label>
                  <Input 
                    type="text" 
                    value={formData.phoneNumber} 
                    onChange={(e) => handleInputChange('phoneNumber', e.target.value)}
                  />
                </FormGroup>
                <FormGroup>
                  <Label>
                    <span>🏠</span>
                    Address
                  </Label>
                  <Input 
                    type="text" 
                    value={formData.address} 
                    onChange={(e) => handleInputChange('address', e.target.value)}
                    placeholder="Enter your address" 
                  />
                </FormGroup>
                <FormGroup>
                  <Label>
                    <span>⚧</span>
                    Gender
                  </Label>
                  <Input 
                    type="text" 
                    value={formData.gender} 
                    onChange={(e) => handleInputChange('gender', e.target.value)}
                    placeholder="Enter your gender"
                  />
                </FormGroup>
              </Form>
              <ButtonRow>
                <UpdateButton onClick={handleUpdateProfile} disabled={isActionLoading}>
                  {isActionLoading ? 'Mise à jour...' : 'Update Profile'}
                </UpdateButton>
                <DeleteButton onClick={handleDeleteClick} disabled={isActionLoading}>
                  Delete Profile
                </DeleteButton>
              </ButtonRow>
            </Card>
          </>
        );
      case 'Orders':
        return (
          <Card>
            <OrdersTab userId={id} />
          </Card>
        );
      case 'Favorites':
        return (
          <Card>
            <FavoritesTab userId={id} />
          </Card>
        );
      case 'Payment Methods':
        return (
          <Card>
            <PaymentMethodsTab userId={id} />
          </Card>
        );
      case 'Activity Log':
        return (
          <Card>
            <ActivityLogTab userId={id} />
          </Card>
        );
      default:
        return null;
    }
  }, [activeTab, formData, handleInputChange, handleUpdateProfile, handleDeleteClick, isActionLoading, id]);

  if (isLoading || !user) return <div style={{ padding: 40 }}>Chargement...</div>;

  return (
    <>
      <GlobalStyles />
      <DashboardLayout hideSidebar>
        <PageWrapper>
          <Content>
            <HeaderContainer>
              <div>
                <Title>Profil Utilisateur</Title>
                <Subtitle>
                  Gérez les informations de l'utilisateur et consultez ses données personnelles 
                  avec une interface moderne et intuitive.
                </Subtitle>
              </div>
            </HeaderContainer>

            <UserProfileCard>
              <UserProfileContent>
            <Avatar>
              {user.profileImage ? (
                <Image
                  src={user.profileImage.includes('10.0.2.2') 
                    ? user.profileImage.replace('10.0.2.2', 'localhost')
                    : user.profileImage}
                  alt={user.name}
                      width={120}
                      height={120}
                  style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                    borderRadius: '50%'
                  }}
                  onError={(e) => {
                    const target = e.currentTarget;
                    target.style.display = 'none';
                    const fallback = target.parentElement?.querySelector('.avatar-fallback');
                    if (fallback) {
                      (fallback as HTMLElement).style.display = 'flex';
                    }
                  }}
                />
              ) : null}
              <div 
                className="avatar-fallback" 
                style={{ 
                  display: user.profileImage ? 'none' : 'flex',
                    width: '100%', 
                    height: '100%', 
                  alignItems: 'center', 
                  justifyContent: 'center',
                      fontSize: '3rem',
                      color: 'white',
                  fontWeight: 'bold'
                  }}
              >
                {user.name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)}
              </div>
            </Avatar>
                <UserInfo>
                  <h2>{user.name}</h2>
                  <p>{user.email}</p>
                  <p>Customer since {createdAtFormatted || '-'}</p>
                </UserInfo>
              </UserProfileContent>
            </UserProfileCard>
            
            <TabsContainer>
              <Tab 
                active={activeTab === 'Profile'} 
                onClick={(e) => {
                  e.preventDefault();
                  handleTabChange('Profile');
                }}
                type="button"
              >
                Profile
              </Tab>
              <Tab 
                active={activeTab === 'Orders'} 
                onClick={(e) => {
                  e.preventDefault();
                  handleTabChange('Orders');
                }}
                type="button"
              >
                Orders
              </Tab>
              <Tab 
                active={activeTab === 'Favorites'} 
                onClick={(e) => {
                  e.preventDefault();
                  handleTabChange('Favorites');
                }}
                type="button"
              >
                Favorites
              </Tab>
              <Tab 
                active={activeTab === 'Payment Methods'} 
                onClick={(e) => {
                  e.preventDefault();
                  handleTabChange('Payment Methods');
                }}
                type="button"
              >
                Payment Methods
              </Tab>
              <Tab 
                active={activeTab === 'Activity Log'} 
                onClick={(e) => {
                  e.preventDefault();
                  handleTabChange('Activity Log');
                }}
                type="button"
              >
                Activity Log
              </Tab>
            </TabsContainer>
          
            {/* Tab Content - Optimisé avec useMemo */}
            <div style={{ minHeight: '400px' }}>
              {tabContent}
            </div>
          </Content>
        </PageWrapper>
      </DashboardLayout>

      {/* Modal de succès pour mise à jour */}
      {showSuccessModal && !modalMessage.includes('supprimé') && (
        <ModalOverlay onClick={() => setShowSuccessModal(false)}>
          <ModalContent onClick={(e) => e.stopPropagation()}>
            <ModalTitle>✅ Succès</ModalTitle>
            <ModalMessage>{modalMessage}</ModalMessage>
            <ModalButtons>
              <ModalButton onClick={() => {
                setShowSuccessModal(false);
                // Recharger la page après fermeture du modal
                window.location.reload();
              }}>
                OK
              </ModalButton>
            </ModalButtons>
          </ModalContent>
        </ModalOverlay>
      )}

      {/* Modal d'erreur */}
      {showErrorModal && (
        <ModalOverlay onClick={() => setShowErrorModal(false)}>
          <ModalContent onClick={(e) => e.stopPropagation()}>
            <ModalTitle>❌ Erreur</ModalTitle>
            <ModalMessage>{modalMessage}</ModalMessage>
            <ModalButtons>
              <ModalButton onClick={() => setShowErrorModal(false)}>
                OK
              </ModalButton>
            </ModalButtons>
          </ModalContent>
        </ModalOverlay>
      )}

      {/* Modal de confirmation de suppression */}
      {showDeleteModal && (
        <ModalOverlay onClick={() => setShowDeleteModal(false)}>
          <ModalContent onClick={(e) => e.stopPropagation()}>
            <ModalTitle>⚠️ Confirmation</ModalTitle>
            <ModalMessage>
              Êtes-vous sûr de vouloir supprimer ce profil ? Cette action est irréversible.
            </ModalMessage>
            <ModalButtons>
              <ModalButton variant="secondary" onClick={() => setShowDeleteModal(false)}>
                Annuler
              </ModalButton>
              <ModalButton variant="danger" onClick={handleDeleteProfile} disabled={isActionLoading}>
                {isActionLoading ? 'Suppression...' : 'Supprimer'}
              </ModalButton>
            </ModalButtons>
          </ModalContent>
        </ModalOverlay>
      )}

      {/* Modal de succès pour suppression */}
      {showSuccessModal && modalMessage.includes('supprimé') && (
        <ModalOverlay onClick={() => setShowSuccessModal(false)}>
          <ModalContent onClick={(e) => e.stopPropagation()}>
            <ModalTitle>✅ Succès</ModalTitle>
            <ModalMessage>{modalMessage}</ModalMessage>
            <ModalButtons>
              <ModalButton onClick={() => {
                setShowSuccessModal(false);
                // Rediriger vers la liste des utilisateurs
                window.location.href = '/users';
              }}>
                OK
              </ModalButton>
            </ModalButtons>
          </ModalContent>
        </ModalOverlay>
      )}
    </>
  );
}

