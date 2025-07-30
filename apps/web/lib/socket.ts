import { io, Socket } from 'socket.io-client';
import { WebSocketMessage, WebSocketNotification } from '../types/socket.types';

class WebSocketService {
  private socket: Socket | null = null;
  private isConnected = false;

  // Connexion au serveur WebSocket
  connect(token: string) {
    if (this.socket && this.isConnected) {
      return this.socket;
    }

    // Utiliser l'URL correcte pour WebSocket
    const socketUrl = 'http://127.0.0.1:5000';
    console.log('🔌 Tentative de connexion WebSocket à:', socketUrl);
    
    this.socket = io(socketUrl, {
      auth: {
        token: token
      },
      transports: ['websocket', 'polling'],
      timeout: 10000,
      forceNew: true
    });

    this.socket.on('connect', () => {
      console.log('🔌 WebSocket connecté (Web)');
      console.log('🔌 Socket ID:', this.socket?.id);
      this.isConnected = true;
    });

    this.socket.on('disconnect', () => {
      console.log('🔌 WebSocket déconnecté (Web)');
      this.isConnected = false;
    });

    this.socket.on('connect_error', (error) => {
      console.error('❌ Erreur de connexion WebSocket (Web):', error);
    });

    // Écouter tous les événements pour le débogage
    this.socket.onAny((eventName, ...args) => {
      console.log('🔍 Événement WebSocket reçu:', eventName, args);
    });

    return this.socket;
  }

  // Écouter les nouveaux messages
  onNewMessage(callback: (message: WebSocketMessage) => void) {
    if (this.socket) {
      this.socket.on('new-message', callback);
    }
  }

  // Écouter les messages de l'admin
  onAdminMessage(callback: (message: WebSocketMessage) => void) {
    if (this.socket) {
      this.socket.on('admin-new-message', callback);
    }
  }

  // Écouter les notifications
  onNotification(callback: (notification: WebSocketNotification) => void) {
    if (this.socket) {
      this.socket.on('notification', callback);
    }
  }

  // Déconnexion
  disconnect() {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
      this.isConnected = false;
      console.log('🔌 WebSocket déconnecté (Web)');
    }
  }

  // Vérifier si connecté
  isSocketConnected() {
    return this.isConnected;
  }
}

export const webSocketService = new WebSocketService();
export default webSocketService; 