"use client";

import React from 'react';
import { useQuery } from "@tanstack/react-query";
import { DashboardLayout } from "../../../components/layout/DashboardLayout";
import { GlobalStyles } from "../../../components/styled/GlobalStyles";
import styled from "styled-components";
import { usersAPI } from "../../../lib/api";
import { useState, useEffect } from "react";
import Image from "next/image";
import { OrdersTab, FavoritesTab, PaymentMethodsTab, ActivityLogTab } from "../../../components/user-tabs";

const Container = styled.div`
  background: ${({ theme }) => theme.colors.background};
  min-height: 100vh;
  padding: 2.5rem 2rem 2rem 2rem;
  font-family: 'Inter', 'Segoe UI', Arial, sans-serif;
  @media (max-width: 900px) {
    padding: 2rem 1rem 1rem 1rem;
  }
  @media (max-width: 600px) {
    padding: 1rem 0.5rem;
  }
`;

const Header = styled.div`
  display: flex;
  align-items: center;
  gap: 1.5rem;
  margin-bottom: 2rem;
  @media (max-width: 600px) {
    flex-direction: column;
    align-items: flex-start;
    gap: 0.7rem;
  }
`;

const Avatar = styled.div`
  width: 90px;
  height: 90px;
  border-radius: 50%;
  background: ${({ theme }) => theme.colors.surface};
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 2.5rem;
  color: ${({ theme }) => theme.colors.primary};
  overflow: hidden;
  @media (max-width: 600px) {
    width: 60px;
    height: 60px;
    font-size: 1.5rem;
  }
`;

const Name = styled.h2`
  margin: 0;
  font-size: 2rem;
  font-weight: 700;
  color: ${({ theme }) => theme.colors.text.primary};
`;

const Email = styled.div`
  color: ${({ theme }) => theme.colors.text.secondary};
  font-size: 1.1rem;
  margin-bottom: 0.3rem;
`;

const Since = styled.div`
  color: ${({ theme }) => theme.colors.text.muted};
  font-size: 1rem;
`;

const Tabs = styled.div`
  display: flex;
  gap: 2.5rem;
  border-bottom: 1px solid ${({ theme }) => theme.colors.border};
  margin-bottom: 2.5rem;
  overflow-x: auto;
  @media (max-width: 600px) {
    gap: 1rem;
    font-size: 13px;
  }
`;

const Tab = styled.button<{ active?: boolean }>`
  background: none;
  border: none;
  font-size: 15px;
  font-weight: 500;
  color: ${props => props.active ? props.theme.colors.text.primary : props.theme.colors.text.secondary};
  font-weight: ${props => props.active ? 'bold' : '100'};
  border-bottom: 2.5px solid ${props => props.active ? props.theme.colors.text.primary : 'transparent'};
  padding: 0.7rem 0;
  cursor: pointer;
  transition: color 0.15s;
`;

const SectionTitle = styled.h3`
  font-size: 1.2rem;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.text.primary};
  margin-bottom: 1.5rem;
`;

const FormWrapper = styled.div`
  background: ${({ theme }) => theme.colors.card.background};
  border-radius: ${({ theme }) => theme.borderRadius.lg};
  padding: 2rem;
  box-shadow: ${({ theme }) => theme.colors.card.shadow};
  border: 1px solid ${({ theme }) => theme.colors.border};
`;

const Form = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1.5rem;
  margin-bottom: 2rem;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
`;

const Label = styled.label`
  font-size: 0.9rem;
  font-weight: 500;
  color: ${({ theme }) => theme.colors.text.secondary};
  margin-bottom: 0.5rem;
`;

const Input = styled.input`
  padding: 0.75rem;
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  background: ${({ theme }) => theme.colors.background};
  color: ${({ theme }) => theme.colors.text.primary};
  font-size: 1rem;
  transition: border-color 0.2s;

  &:focus {
    outline: none;
    border-color: ${({ theme }) => theme.colors.primary};
  }

  &::placeholder {
    color: ${({ theme }) => theme.colors.text.muted};
  }
`;

const ButtonRow = styled.div`
  display: flex;
  gap: 1rem;
  justify-content: flex-end;

  @media (max-width: 768px) {
    flex-direction: column;
  }
`;

const UpdateButton = styled.button`
  padding: 0.75rem 1.5rem;
  background: ${({ theme }) => theme.colors.button.primary};
  color: ${({ theme }) => theme.colors.button.text};
  border: none;
  border-radius: ${({ theme }) => theme.borderRadius.md};
  font-size: 1rem;
  font-weight: 500;
  cursor: pointer;
  transition: background 0.2s;

  &:hover:not(:disabled) {
    background: ${({ theme }) => theme.colors.primary};
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

const DeleteButton = styled.button`
  padding: 0.75rem 1.5rem;
  background: ${({ theme }) => theme.colors.error};
  color: white;
  border: none;
  border-radius: ${({ theme }) => theme.borderRadius.md};
  font-size: 1rem;
  font-weight: 500;
  cursor: pointer;
  transition: background 0.2s;

  &:hover:not(:disabled) {
    background: #c53030;
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
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

  if (isLoading || !user) return <div style={{ padding: 40 }}>Chargement...</div>;

  // Fonction pour gérer les changements dans les champs
  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  // Fonction pour mettre à jour le profil
  const handleUpdateProfile = async () => {
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
  };

  // Fonction pour ouvrir le modal de suppression
  const handleDeleteClick = () => {
    setShowDeleteModal(true);
  };

  // Fonction pour supprimer le profil
  const handleDeleteProfile = async () => {
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
  };

  return (
    <>
      <GlobalStyles />
      <DashboardLayout hideSidebar>
        <Container>
 
          <Header>
            <Avatar>
              {user.profileImage ? (
                <Image
                  src={user.profileImage.includes('10.0.2.2') 
                    ? user.profileImage.replace('10.0.2.2', 'localhost')
                    : user.profileImage}
                  alt={user.name}
                  width={90}
                  height={90}
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
                  fontSize: '2.5rem',
                  color: '#827869',
                  fontWeight: 'bold'
                  }}
              >
                {user.name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)}
              </div>
            </Avatar>
            <div>
              <Name>{user.name}</Name>
              <Email>{user.email}</Email>
              <Since>Customer since {createdAtFormatted || '-'}</Since>
            </div>
          </Header>
          <Tabs>
            <Tab active={activeTab === 'Profile'} onClick={() => setActiveTab('Profile')}>Profile</Tab>
            <Tab active={activeTab === 'Orders'} onClick={() => setActiveTab('Orders')}>Orders</Tab>
            <Tab active={activeTab === 'Favorites'} onClick={() => setActiveTab('Favorites')}>Favorites</Tab>
            <Tab active={activeTab === 'Payment Methods'} onClick={() => setActiveTab('Payment Methods')}>Payment Methods</Tab>
            <Tab active={activeTab === 'Activity Log'} onClick={() => setActiveTab('Activity Log')}>Activity Log</Tab>
          </Tabs>
          
          {/* Tab Content */}
          {activeTab === 'Profile' && (
            <>
              <SectionTitle>Profile Information</SectionTitle>
              <FormWrapper>
                <Form>
                  <FormGroup>
                    <Label>Full Name</Label>
                    <Input 
                      type="text" 
                      value={formData.name} 
                      onChange={(e) => handleInputChange('name', e.target.value)}
                    />
                  </FormGroup>
                  <FormGroup>
                    <Label>Email</Label>
                    <Input 
                      type="email" 
                      value={formData.email} 
                      onChange={(e) => handleInputChange('email', e.target.value)}
                    />
                  </FormGroup>
                  <FormGroup>
                    <Label>Phone Number</Label>
                    <Input 
                      type="text" 
                      value={formData.phoneNumber} 
                      onChange={(e) => handleInputChange('phoneNumber', e.target.value)}
                    />
                  </FormGroup>
                  <FormGroup>
                    <Label>Address</Label>
                    <Input 
                      type="text" 
                      value={formData.address} 
                      onChange={(e) => handleInputChange('address', e.target.value)}
                      placeholder="Enter your address" 
                    />
                  </FormGroup>
                  <FormGroup>
                    <Label>Gender</Label>
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
              </FormWrapper>
            </>
          )}

          {activeTab === 'Orders' && (
            <OrdersTab userId={id} />
          )}

          {activeTab === 'Favorites' && (
            <FavoritesTab userId={id} />
          )}

          {activeTab === 'Payment Methods' && (
            <PaymentMethodsTab userId={id} />
          )}

          {activeTab === 'Activity Log' && (
            <ActivityLogTab userId={id} />
          )}
        </Container>
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

