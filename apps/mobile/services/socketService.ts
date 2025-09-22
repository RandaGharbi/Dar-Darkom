import { io, Socket } from 'socket.io-client';
import { getFullUrl } from '../config/api';

class SocketService {
  private socket: Socket | null = null;
  private isConnected = false;

  // Connexion au serveur WebSocket
  connect(token: string) {
    if (this.socket && this.isConnected) {
      return this.socket;
    }

    // Utiliser l'URL de base correcte pour WebSocket
    const baseUrl = getFullUrl('').replace('http://', 'ws://').replace('https://', 'wss://');
    const socketUrl = baseUrl.replace('/api', '');
    
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
      console.log('🔌 WebSocket connecté');
      this.isConnected = true;
    });

    this.socket.on('disconnect', () => {
      console.log('🔌 WebSocket déconnecté');
      this.isConnected = false;
    });

    this.socket.on('connect_error', (error) => {
      console.error('❌ Erreur de connexion WebSocket:', error);
    });

    return this.socket;
  }

  // Rejoindre une conversation
  joinConversation(userId: string) {
    if (this.socket) {
      this.socket.emit('join-conversation', { userId });
      console.log('👥 Rejoint la conversation:', userId);
    }
  }

  // Quitter une conversation
  leaveConversation(userId: string) {
    if (this.socket) {
      this.socket.emit('leave-conversation', { userId });
      console.log('👋 Quitté la conversation:', userId);
    }
  }

  // Écouter les nouveaux messages
  onNewMessage(callback: (message: any) => void) {
    if (this.socket) {
      this.socket.on('new-message', callback);
    }
  }

  // Écouter les messages de l'admin
  onAdminMessage(callback: (message: any) => void) {
    if (this.socket) {
      this.socket.on('admin-new-message', callback);
    }
  }

  // Envoyer un message
  sendMessage(userId: string, content: string) {
    if (this.socket) {
      this.socket.emit('send-message', { userId, content });
      console.log('📤 Message envoyé via WebSocket');
    }
  }

  // Écouter les notifications
  onNotification(callback: (notification: any) => void) {
    if (this.socket) {
      this.socket.on('notification', callback);
    }
  }

  // Rejoindre les notifications
  joinNotifications(userId: string) {
    if (this.socket) {
      this.socket.emit('join-notifications', { userId });
      console.log('🔔 Rejoint les notifications pour:', userId);
    }
  }

  // Écouter les mises à jour de commande
  onOrderUpdate(callback: (data: any) => void) {
    if (this.socket) {
      this.socket.on('order_update', callback);
    }
  }

  // Écouter les mises à jour de livraison
  onDeliveryUpdate(callback: (data: any) => void) {
    if (this.socket) {
      this.socket.on('delivery_update', callback);
    }
  }

  // Écouter les promotions
  onPromotion(callback: (data: any) => void) {
    if (this.socket) {
      this.socket.on('promotion', callback);
    }
  }

  // Déconnexion
  disconnect() {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
      this.isConnected = false;
      console.log('🔌 WebSocket déconnecté');
    }
  }

  // Vérifier si connecté
  isSocketConnected() {
    return this.isConnected;
  }
}

export const socketService = new SocketService();
export default socketService; 