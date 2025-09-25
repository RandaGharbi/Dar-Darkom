import { useEffect, useState } from 'react';
import { io, Socket } from 'socket.io-client';
import { WEBSOCKET_CONFIG } from '../config/websocket';

export const useWebSocket = () => {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [connected, setConnected] = useState(false);

  useEffect(() => {
    console.log('🚀 Tentative de connexion WebSocket à:', WEBSOCKET_CONFIG.url);
    const newSocket = io(WEBSOCKET_CONFIG.url, WEBSOCKET_CONFIG.options);

    newSocket.on('connect', () => {
      console.log('🔌 WebSocket connecté:', newSocket.id);
      setConnected(true);
      
      // Rejoindre les notifications admin
      newSocket.emit('join-notifications', 'admin');
      console.log('👑 Admin connecté aux notifications WebSocket');
    });

    newSocket.on('disconnect', (reason) => {
      console.log('🔌 WebSocket déconnecté:', reason);
      setConnected(false);
    });

    newSocket.on('connect_error', (error) => {
      console.error('❌ Erreur de connexion WebSocket:', error);
      console.error('❌ URL tentée:', WEBSOCKET_CONFIG.url);
      setConnected(false);
    });

    setSocket(newSocket);

    return () => {
      newSocket.close();
    };
  }, []);

  const onNotification = (callback: (notification: any) => void) => {
    if (socket) {
      socket.on('new-notification', callback);
      
      return () => {
        socket.off('new-notification', callback);
      };
    }
    return () => {};
  };

  return {
    socket,
    connected,
    onNotification,
  };
};
