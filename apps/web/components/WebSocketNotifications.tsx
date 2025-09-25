'use client';

import React, { useEffect } from 'react';
import { useWebSocket } from '../hooks/useWebSocket';
import { useNotificationToast } from './NotificationToast';
import NotificationToast from './NotificationToast';

export default function WebSocketNotifications() {
  const { connected, onNotification } = useWebSocket();
  const { notifications, addNotification, removeNotification } = useNotificationToast();

  useEffect(() => {
    console.log('🔌 État de connexion WebSocket:', connected);
    
    if (!connected) {
      console.log('⚠️ WebSocket non connecté, notifications non disponibles');
      return;
    }

    console.log('✅ WebSocket connecté, écoute des notifications...');
    
    const removeListener = onNotification((notification) => {
      console.log('🔔 Notification reçue:', notification);
      console.log('🔔 Nombre de notifications avant ajout:', notifications.length);
      addNotification(notification);
    });

    return removeListener;
  }, [connected, onNotification, addNotification]);

  console.log('🎨 WebSocketNotifications rendu avec', notifications.length, 'notifications');

  return (
    <>
      {notifications.map((notification) => (
        <NotificationToast
          key={notification.id}
          notification={notification}
          onClose={() => removeNotification(notification.id)}
        />
      ))}
    </>
  );
}
