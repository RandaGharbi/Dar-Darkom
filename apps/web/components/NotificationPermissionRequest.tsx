import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { Bell, X } from 'lucide-react';
import pushNotificationService from '../services/pushNotificationService';

const PermissionContainer = styled.div<{ $isVisible: boolean }>`
  position: fixed;
  top: 20px;
  right: 20px;
  width: 350px;
  background: ${({ theme }) => theme.colors.background};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  z-index: 10000;
  padding: 16px;
  opacity: ${({ $isVisible }) => ($isVisible ? 1 : 0)};
  transform: ${({ $isVisible }) => ($isVisible ? 'translateX(0)' : 'translateX(100%)')};
  transition: all 0.3s ease;
`;

const Header = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 12px;
`;

const Title = styled.h3`
  margin: 0;
  font-size: 16px;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.text.primary};
  display: flex;
  align-items: center;
  gap: 8px;
`;

const Message = styled.p`
  margin: 0 0 16px 0;
  font-size: 14px;
  color: ${({ theme }) => theme.colors.text.secondary};
  line-height: 1.4;
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 8px;
`;

const Button = styled.button<{ $primary?: boolean }>`
  flex: 1;
  padding: 8px 16px;
  border: 1px solid ${({ $primary, theme }) => 
    $primary ? theme.colors.primary : theme.colors.border};
  border-radius: 6px;
  background: ${({ $primary, theme }) => 
    $primary ? theme.colors.primary : 'transparent'};
  color: ${({ $primary, theme }) => 
    $primary ? 'white' : theme.colors.text.primary};
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    background: ${({ $primary, theme }) => 
      $primary ? theme.colors.primary : theme.colors.surface};
  }
`;

const CloseButton = styled.button`
  background: none;
  border: none;
  color: ${({ theme }) => theme.colors.text.muted};
  cursor: pointer;
  padding: 4px;
  border-radius: 4px;
  transition: all 0.2s ease;

  &:hover {
    background: ${({ theme }) => theme.colors.surface};
    color: ${({ theme }) => theme.colors.text.primary};
  }
`;

interface NotificationPermissionRequestProps {
  userId: string;
}

const NotificationPermissionRequest: React.FC<NotificationPermissionRequestProps> = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    // Vérifier si on doit afficher la demande de permission
    const checkPermission = async () => {
      const status = pushNotificationService.getPermissionStatus();
      
      // Afficher seulement si la permission n'a pas encore été demandée
      if (status === 'default') {
        // Attendre un peu avant d'afficher la demande
        setTimeout(() => {
          setIsVisible(true);
        }, 3000);
      }
    };

    checkPermission();
  }, []);

  const handleAllow = async () => {
    setIsLoading(true);
    try {
      const granted = await pushNotificationService.requestPermission();
      if (granted) {
        // Enregistrer le Service Worker
        await pushNotificationService.registerServiceWorker();
        setIsVisible(false);
      }
    } catch {
      // Gérer l'erreur silencieusement
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeny = () => {
    setIsVisible(false);
  };

  const handleClose = () => {
    setIsVisible(false);
  };

  if (!isVisible) return null;

  return (
    <PermissionContainer $isVisible={isVisible}>
      <Header>
        <Title>
          <Bell size={16} />
          Notifications
        </Title>
        <CloseButton onClick={handleClose} title="Fermer">
          <X size={14} />
        </CloseButton>
      </Header>
      
      <Message>
        Recevez des notifications en temps réel pour rester informé des nouvelles commandes, 
        alertes de stock et activités importantes.
      </Message>
      
      <ButtonGroup>
        <Button onClick={handleDeny} disabled={isLoading}>
          Plus tard
        </Button>
        <Button $primary onClick={handleAllow} disabled={isLoading}>
          {isLoading ? 'Autorisation...' : 'Autoriser'}
        </Button>
      </ButtonGroup>
    </PermissionContainer>
  );
};

export default NotificationPermissionRequest; 