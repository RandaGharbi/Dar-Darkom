"use client";

import React, { useState, useEffect, useRef } from 'react';
import styled, { keyframes, css } from 'styled-components';
import { Bell, Check, Trash2, ShoppingCart, AlertTriangle, User, Settings, CreditCard, Package } from 'lucide-react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import notificationService from '../services/notificationService';
import { Notification } from '../types/notifications';
import { useWebSocket } from '../hooks/useWebSocket';

const slideDown = keyframes`
  from {
    opacity: 0;
    transform: translateY(-10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
`;

const pulse = keyframes`
  0%, 100% {
    opacity: 1;
    transform: scale(1);
  }
  50% {
    opacity: 0.8;
    transform: scale(1.1);
  }
`;

const badgePulse = keyframes`
  0%, 100% {
    opacity: 1;
  }
  50% {
    opacity: 0.9;
  }
`;

const NotificationContainer = styled.div`
  position: relative;
`;

const NotificationButton = styled.button<{ $hasUnread: boolean }>`
  position: relative;
  background: none;
  border: none;
  cursor: pointer;
  padding: 8px;
  border-radius: 50%;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  color: ${({ theme }) => theme.colors.text.primary};

  &:hover {
    background: ${({ theme }) => theme.colors.surface};
    color: ${({ theme }) => theme.colors.primary};
  }

  ${({ $hasUnread }) => $hasUnread && css`
    &::after {
      position: absolute;
      top: 4px;
      right: 4px;
      width: 8px;
      height: 8px;
      background: #dc2626;
      border-radius: 50%;
      animation: ${pulse} 2s infinite;
    }
  `}
`;

const NotificationBadge = styled.div<{ $count: number }>`
  position: absolute;
  top: 2px;
  right: 2px;
  background: #dc2626;
  color: white;
  border-radius: 50%;
  min-width: 18px;
  height: 18px;
  font-size: 10px;
  font-weight: 600;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0 4px;
  ${css`animation: ${badgePulse} 2s infinite;`}
  ${({ $count }) => $count > 99 && `
    font-size: 8px;
    min-width: 20px;
    height: 20px;
  `}
`;

const Dropdown = styled.div<{ $isOpen: boolean }>`
  position: absolute;
  top: 100%;
  right: 0;
  width: 400px;
  max-height: 500px;
  background: ${({ theme }) => theme.colors.background};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  z-index: 1000;
  opacity: ${({ $isOpen }) => ($isOpen ? 1 : 0)};
  visibility: ${({ $isOpen }) => ($isOpen ? "visible" : "hidden")};
  transform: ${({ $isOpen }) =>
    $isOpen ? "translateY(0)" : "translateY(-10px)"};
  transition: all 0.2s ease;
  ${({ $isOpen }) =>
    $isOpen &&
    css`
      animation: ${slideDown} 0.2s ease;
    `}
`;

const Header = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16px;
  border-bottom: 1px solid ${({ theme }) => theme.colors.border};
`;

const Title = styled.h3`
  margin: 0;
  font-size: 16px;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.text.primary};
`;

const MarkAllButton = styled.button`
  background: none;
  border: none;
  color: ${({ theme }) => theme.colors.text.secondary};
  font-size: 12px;
  cursor: pointer;
  padding: 4px 8px;
  border-radius: 4px;
  transition: color 0.2s ease;

  &:hover {
    color: ${({ theme }) => theme.colors.text.primary};
  }
`;

const NotificationList = styled.div`
  max-height: 400px;
  overflow-y: auto;
`;

const NotificationItem = styled.div<{ $isRead: boolean }>`
  display: flex;
  align-items: flex-start;
  gap: 12px;
  padding: 12px 16px;
  border-bottom: 1px solid ${({ theme }) => theme.colors.border};
  cursor: pointer;
  transition: background 0.2s ease;
  background: ${({ $isRead, theme }) => $isRead ? 'transparent' : theme.colors.surface};

  &:hover {
    background: ${({ theme }) => theme.colors.surface};
  }

  &:last-child {
    border-bottom: none;
  }
`;

const IconContainer = styled.div<{ $type: string }>`
  width: 32px;
  height: 32px;
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
  flex-shrink: 0;
`;

const Content = styled.div`
  flex: 1;
  min-width: 0;
`;

const NotificationTitle = styled.div<{ $isRead: boolean }>`
  font-size: 14px;
  font-weight: ${({ $isRead }) => ($isRead ? 400 : 600)};
  color: ${({ theme }) => theme.colors.text.primary};
  margin-bottom: 4px;
  line-height: 1.4;
`;

const NotificationMessage = styled.div`
  font-size: 12px;
  color: ${({ theme }) => theme.colors.text.secondary};
  line-height: 1.4;
  margin-bottom: 4px;
`;

const NotificationTime = styled.div`
  font-size: 11px;
  color: ${({ theme }) => theme.colors.text.muted};
`;

const Actions = styled.div`
  display: flex;
  gap: 4px;
  opacity: 0;
  transition: opacity 0.2s ease;
`;

const ActionButton = styled.button`
  background: none;
  border: none;
  padding: 4px;
  border-radius: 4px;
  cursor: pointer;
  color: ${({ theme }) => theme.colors.text.secondary};
  transition: all 0.2s ease;

  &:hover {
    background: ${({ theme }) => theme.colors.surface};
    color: ${({ theme }) => theme.colors.text.primary};
  }
`;

const EmptyState = styled.div`
  padding: 32px 16px;
  text-align: center;
  color: ${({ theme }) => theme.colors.text.secondary};
`;

const UnreadDot = styled.div`
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: #dc2626;
  margin-left: 8px;
  flex-shrink: 0;
`;

interface NotificationDropdownProps {
  userId: string;
}

const NotificationDropdown: React.FC<NotificationDropdownProps> = ({ userId }) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const queryClient = useQueryClient();
  
  // WebSocket pour les notifications en temps réel
  const { connected, onNotification } = useWebSocket();
  const [websocketNotifications, setWebsocketNotifications] = useState<any[]>([]);

  // Récupérer les notifications
  const { data: notificationsData, isLoading } = useQuery({
    queryKey: ['notifications', userId],
    queryFn: () => notificationService.getUserNotifications(userId),
    enabled: !!userId,
    refetchInterval: 30000, // Rafraîchir toutes les 30 secondes
  });

  const persistentNotifications = notificationsData?.notifications || [];
  const persistentUnreadCount = notificationsData?.unreadCount || 0;
  
  // Combiner les notifications persistantes et WebSocket
  const allNotifications = [...websocketNotifications, ...persistentNotifications];
  const totalUnreadCount = websocketNotifications.length + persistentUnreadCount;

  // Mutations
  const markAsReadMutation = useMutation({
    mutationFn: (notificationId: string) => notificationService.markAsRead(notificationId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notifications', userId] });
    },
  });

  const markAllAsReadMutation = useMutation({
    mutationFn: () => notificationService.markAllAsRead(userId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notifications', userId] });
    },
  });

  const deleteNotificationMutation = useMutation({
    mutationFn: (notificationId: string) => notificationService.deleteNotification(notificationId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notifications', userId] });
    },
  });

  // Écouter les notifications WebSocket
  useEffect(() => {
    if (!connected) return;

    const removeListener = onNotification((notification) => {
      console.log('🔔 Notification WebSocket reçue dans dropdown:', notification);
      
      // Convertir la notification WebSocket en format compatible
      const websocketNotification = {
        _id: `ws-${Date.now()}`,
        title: notification.title,
        message: notification.message,
        type: notification.type || 'order',
        isRead: false,
        createdAt: new Date().toISOString(),
        metadata: {
          orderId: notification.orderId,
          amount: notification.amount,
          customerName: notification.customerName
        }
      };
      
      setWebsocketNotifications(prev => [websocketNotification, ...prev]);
    });

    return removeListener;
  }, [connected, onNotification]);

  // Fermer le dropdown en cliquant à l'extérieur
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const getIcon = (type: Notification['type']) => {
    const iconSize = 16;
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

  const getTimeAgo = (dateString: string) => {
    const now = new Date();
    const date = new Date(dateString);
    const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60));
    const diffInHours = Math.floor(diffInMinutes / 60);
    const diffInDays = Math.floor(diffInHours / 24);

    if (diffInMinutes < 1) return "À l'instant";
    if (diffInMinutes < 60) return `Il y a ${diffInMinutes} min`;
    if (diffInHours < 24) return `Il y a ${diffInHours}h`;
    return `Il y a ${diffInDays}j`;
  };

  const handleNotificationClick = (notification: Notification) => {
    if (!notification.isRead) {
      markAsReadMutation.mutate(notification._id);
    }
    
    // Gérer les différents types de notifications
    if (notification.type === 'order') {
      // Utiliser l'ID de commande depuis les métadonnées si disponible
      if (notification.metadata?.orderId) {
        window.location.href = `/orders/${notification.metadata.orderId}`;
      } else {
        // Fallback: extraire l'ID de commande du message
        const orderIdMatch = notification.message.match(/#([a-f0-9]+)/);
        if (orderIdMatch) {
          const orderId = orderIdMatch[1];
          // Rediriger vers la page des détails de commande
          window.location.href = `/orders/${orderId}`;
        }
      }
    } else if (notification.type === 'activity' && notification.title.includes('message')) {
      // Rediriger vers la page des messages pour les notifications de messages
      window.location.href = '/contact';
    }
    
    setIsOpen(false);
  };

  const handleMarkAllAsRead = () => {
    markAllAsReadMutation.mutate();
  };

  const handleDeleteNotification = (e: React.MouseEvent, notificationId: string) => {
    e.stopPropagation();
    deleteNotificationMutation.mutate(notificationId);
  };

  return (
    <NotificationContainer ref={dropdownRef}>
      <NotificationButton
        onClick={() => setIsOpen(!isOpen)}
        $hasUnread={totalUnreadCount > 0}
        title="Notifications"
      >
        <Bell size={20} />
        {totalUnreadCount > 0 && (
          <NotificationBadge $count={totalUnreadCount}>
            {totalUnreadCount > 99 ? '99+' : totalUnreadCount}
          </NotificationBadge>
        )}
      </NotificationButton>

      <Dropdown $isOpen={isOpen}>
        <Header>
          <Title>
            Notifications {totalUnreadCount > 0 && `(${totalUnreadCount})`}
          </Title>
          {totalUnreadCount > 0 && (
            <MarkAllButton onClick={handleMarkAllAsRead}>
              Tout marquer comme lu
            </MarkAllButton>
          )}
        </Header>

        <NotificationList>
          {isLoading ? (
            <EmptyState>Chargement...</EmptyState>
          ) : allNotifications.length === 0 ? (
            <EmptyState>
              <Bell size={32} style={{ opacity: 0.5, marginBottom: 8, color: 'inherit' }} />
              <div>Aucune notification</div>
            </EmptyState>
          ) : (
            allNotifications.map((notification) => (
              <NotificationItem
                key={notification._id}
                $isRead={notification.isRead}
                onClick={() => handleNotificationClick(notification)}
              >
                <IconContainer $type={notification.type}>
                  {getIcon(notification.type)}
                </IconContainer>
                
                <Content>
                  <NotificationTitle $isRead={notification.isRead}>
                    {notification.title}
                    {!notification.isRead && <UnreadDot />}
                  </NotificationTitle>
                  <NotificationMessage>
                    {notification.message}
                  </NotificationMessage>
                  <NotificationTime>
                    {getTimeAgo(notification.createdAt)}
                  </NotificationTime>
                </Content>

                <Actions>
                  {!notification.isRead && (
                    <ActionButton
                      onClick={(e) => {
                        e.stopPropagation();
                        markAsReadMutation.mutate(notification._id);
                      }}
                      title="Marquer comme lu"
                    >
                      <Check size={14} />
                    </ActionButton>
                  )}
                  <ActionButton
                    onClick={(e) => handleDeleteNotification(e, notification._id)}
                    title="Supprimer"
                  >
                    <Trash2 size={14} />
                  </ActionButton>
                </Actions>
              </NotificationItem>
            ))
          )}
        </NotificationList>
      </Dropdown>
    </NotificationContainer>
  );
};

export default NotificationDropdown;