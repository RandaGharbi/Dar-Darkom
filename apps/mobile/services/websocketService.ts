import { io, Socket } from 'socket.io-client';

class WebSocketService {
  private socket: Socket | null = null;
  private isConnected = false;
  private reconnectAttempts = 0;
  private maxReconnectAttempts = 5;
  private reconnectDelay = 1000;

  connect(userId: string) {
    if (this.socket?.connected) {
      console.log('🔌 WebSocket déjà connecté');
      return;
    }

    const serverUrl = 'http://localhost:5000'; // À remplacer par votre URL de serveur
    
    this.socket = io(serverUrl, {
      transports: ['websocket'],
      timeout: 20000,
    });

    this.socket.on('connect', () => {
      console.log('🔌 WebSocket connecté:', this.socket?.id);
      this.isConnected = true;
      this.reconnectAttempts = 0;
      
      // Rejoindre les rooms nécessaires
      this.joinNotifications(userId);
      this.joinOrderNotifications(userId);
    });

    this.socket.on('disconnect', (reason) => {
      console.log('🔌 WebSocket déconnecté:', reason);
      this.isConnected = false;
      
      if (reason === 'io server disconnect') {
        // Le serveur a forcé la déconnexion, ne pas reconnecter automatiquement
        return;
      }
      
      this.attemptReconnect(userId);
    });

    this.socket.on('connect_error', (error) => {
      console.error('❌ Erreur de connexion WebSocket:', error);
      this.attemptReconnect(userId);
    });

    return this.socket;
  }

  private attemptReconnect(userId: string) {
    if (this.reconnectAttempts >= this.maxReconnectAttempts) {
      console.log('❌ Nombre maximum de tentatives de reconnexion atteint');
      return;
    }

    this.reconnectAttempts++;
    const delay = this.reconnectDelay * Math.pow(2, this.reconnectAttempts - 1);
    
    console.log(`🔄 Tentative de reconnexion ${this.reconnectAttempts}/${this.maxReconnectAttempts} dans ${delay}ms`);
    
    setTimeout(() => {
      this.connect(userId);
    }, delay);
  }

  joinNotifications(userId: string) {
    if (this.socket?.connected) {
      this.socket.emit('join-notifications', userId);
      console.log(`📧 Rejoint les notifications pour l'utilisateur ${userId}`);
    }
  }

  joinOrderNotifications(userId: string) {
    if (this.socket?.connected) {
      this.socket.emit('join-order-notifications', { userId });
      console.log(`📦 Rejoint les notifications de commandes pour l'utilisateur ${userId}`);
    }
  }

  leaveNotifications(userId: string) {
    if (this.socket?.connected) {
      this.socket.emit('leave-order-notifications', { userId });
      console.log(`📦 Quitte les notifications de commandes pour l'utilisateur ${userId}`);
    }
  }

  // Écouter les notifications générales
  onNotification(callback: (notification: any) => void) {
    if (this.socket) {
      this.socket.on('new-notification', callback);
    }
  }

  // Écouter les mises à jour de statut de commande
  onOrderStatusUpdate(callback: (update: any) => void) {
    if (this.socket) {
      this.socket.on('order-status-update', callback);
    }
  }

  // Écouter les mises à jour de tracking
  onTrackingUpdate(callback: (update: any) => void) {
    if (this.socket) {
      this.socket.on('tracking-update', callback);
    }
  }

  // Écouter les mises à jour de position du driver
  onDriverLocationUpdate(callback: (update: any) => void) {
    if (this.socket) {
      this.socket.on('driver-location-update', callback);
    }
  }

  // Rejoindre le tracking d'une commande
  joinTracking(orderId: string, userId: string) {
    if (this.socket?.connected) {
      this.socket.emit('join-tracking', { orderId, userId });
      console.log(`📍 Rejoint le tracking de la commande ${orderId}`);
    }
  }

  // Quitter le tracking d'une commande
  leaveTracking(orderId: string) {
    if (this.socket?.connected) {
      this.socket.emit('leave-tracking', { orderId });
      console.log(`📍 Quitte le tracking de la commande ${orderId}`);
    }
  }

  // Nettoyer les listeners
  removeAllListeners() {
    if (this.socket) {
      this.socket.removeAllListeners();
    }
  }

  // Déconnecter
  disconnect() {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
      this.isConnected = false;
      console.log('🔌 WebSocket déconnecté');
    }
  }

  // Vérifier si connecté
  get connected() {
    return this.isConnected && this.socket?.connected;
  }

  // Obtenir l'instance du socket
  get socketInstance() {
    return this.socket;
  }
}

export default new WebSocketService();
