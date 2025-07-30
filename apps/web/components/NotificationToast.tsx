'use client';

import React, { useState, useEffect } from 'react';
import styled, { keyframes } from 'styled-components';
import { X, ShoppingCart, AlertTriangle, User, Settings, CreditCard, Package, Bell } from 'lucide-react';
import { Notification } from '../types/notifications';

const slideIn = keyframes`
  from {
    transform: translateX(100%);
    opacity: 0;
  }
  to {
    transform: translateX(0);
    opacity: 1;
  }
`;

const slideOut = keyframes`
  from {
    transform: translateX(0);
    opacity: 1;
  }
  to {
    transform: translateX(100%);
    opacity: 0;
  }
`;

const ToastContainer = styled.div<{ $isVisible: boolean; $isExiting: boolean }>`
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
  animation: ${({ $isVisible, $isExiting }) => 
    $isVisible && !$isExiting ? slideIn : $isExiting ? slideOut : 'none'} 0.3s ease;
  transform: ${({ $isVisible, $isExiting }) => 
    $isVisible && !$isExiting ? 'translateX(0)' : 'translateX(100%)'};
  opacity: ${({ $isVisible, $isExiting }) => 
    $isVisible && !$isExiting ? 1 : 0};
`;

const ToastHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 8px;
`;

const IconContainer = styled.div<{ $type: string }>`
  width: 24px;
  height: 24px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  background: ${({ $type }) => {
    switch ($type) {
      case 'order': return '#EDD9BF';
      case 'stock': return '#FEF3C7';
      case 'user': return '#E8DECF';
      case 'system': return '#F5F5F5';
      case 'payment': return '#DBEAFE';
      case 'product': return '#D1FAE5';
      case 'activity': return '#F3E8FF';
      default: return '#EDD9BF';
    }
  }};
  color: ${({ $type }) => {
    switch ($type) {
      case 'order': return '#171412';
      case 'stock': return '#D97706';
      case 'user': return '#171412';
      case 'system': return '#171412';
      case 'payment': return '#2563EB';
      case 'product': return '#059669';
      case 'activity': return '#7C3AED';
      default: return '#171412';
    }
  }};
  margin-right: 12px;
`;

const ToastContent = styled.div`
  flex: 1;
`;

const ToastTitle = styled.div`
  font-size: 14px;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.text.primary};
  margin-bottom: 4px;
  line-height: 1.4;
`;

const ToastMessage = styled.div`
  font-size: 12px;
  color: ${({ theme }) => theme.colors.text.secondary};
  line-height: 1.4;
`;

const CloseButton = styled.button`
  background: none;
  border: none;
  color: ${({ theme }) => theme.colors.text.muted};
  cursor: pointer;
  padding: 4px;
  border-radius: 4px;
  transition: all 0.2s ease;
  margin-left: 8px;

  &:hover {
    background: ${({ theme }) => theme.colors.surface};
    color: ${({ theme }) => theme.colors.text.primary};
  }
`;

const ToastRow = styled.div`
  display: flex;
  align-items: flex-start;
`;

interface NotificationToastProps {
  notification: Notification;
  onClose: () => void;
  duration?: number;
}

const NotificationToast: React.FC<NotificationToastProps> = ({ 
  notification, 
  onClose, 
  duration = 5000 
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const [isExiting, setIsExiting] = useState(false);

  useEffect(() => {
    // Animation d'entrée
    const timer = setTimeout(() => setIsVisible(true), 100);
    
    // Auto-fermeture
    const closeTimer = setTimeout(() => {
      setIsExiting(true);
      setTimeout(onClose, 300); // Attendre la fin de l'animation
    }, duration);

    return () => {
      clearTimeout(timer);
      clearTimeout(closeTimer);
    };
  }, [duration, onClose]);

  const getIcon = (type: Notification['type']) => {
    const iconSize = 14;
    switch (type) {
      case 'order':
        return <ShoppingCart size={iconSize} />;
      case 'stock':
        return <AlertTriangle size={iconSize} />;
      case 'user':
        return <User size={iconSize} />;
      case 'system':
        return <Settings size={iconSize} />;
      case 'payment':
        return <CreditCard size={iconSize} />;
      case 'product':
        return <Package size={iconSize} />;
      case 'activity':
        return <Bell size={iconSize} />;
      default:
        return <Bell size={iconSize} />;
    }
  };

  const handleClose = () => {
    setIsExiting(true);
    setTimeout(onClose, 300);
  };

  return (
    <ToastContainer $isVisible={isVisible} $isExiting={isExiting}>
      <ToastHeader>
        <ToastRow>
          <IconContainer $type={notification.type}>
            {getIcon(notification.type)}
          </IconContainer>
          <ToastContent>
            <ToastTitle>{notification.title}</ToastTitle>
            <ToastMessage>{notification.message}</ToastMessage>
          </ToastContent>
        </ToastRow>
        <CloseButton onClick={handleClose} title="Fermer">
          <X size={14} />
        </CloseButton>
      </ToastHeader>
    </ToastContainer>
  );
};

export default NotificationToast; 