import { io, Socket } from 'socket.io-client';
import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';

export interface OrderTrackingData {
  orderId: string;
  status: 'confirmed' | 'received' | 'preparing' | 'ready' | 'out_for_delivery' | 'delivered';
  qrScanned: boolean;
  chatEnabled: boolean;
  driverLocation?: {
    latitude: number;
    longitude: number;
    address?: string;
  };
  driverInfo?: {
    name: string;
    phone: string;
  };
  estimatedTime?: string;
  lastUpdated: Date;
}

export interface ChatMessage {
  id: string;
  orderId: string;
  text: string;
  sender: 'driver' | 'customer';
  timestamp: Date;
}

class QRTrackingService {
  private socket: Socket | null = null;
  private listeners: Map<string, Function[]> = new Map();
  private isConnected = false;

  constructor() {
    this.initializeNotifications();
  }

  private async initializeNotifications() {
    // Configurer les notifications
    Notifications.setNotificationHandler({
      handleNotification: async () => ({
        shouldShowAlert: true,
        shouldPlaySound: true,
        shouldSetBadge: false,
      }),
    });

    // Demander les permissions
    const { status } = await Notifications.requestPermissionsAsync();
    if (status !== 'granted') {
    }
  }

  // Connexion au serveur Socket.io
  connect(serverUrl: string) {
    if (this.socket) {
      this.disconnect();
    }

    console.log('📱 Connexion au serveur WebSocket:', serverUrl);
    this.socket = io(serverUrl, {
      transports: ['websocket'],
      timeout: 20000,
    });

    this.socket.on('connect', () => {
      console.log('📱 MOBILE - Connecté au serveur de tracking');
      console.log('📱 MOBILE - Socket ID:', this.socket?.id);
      console.log('📱 MOBILE - URL de connexion:', serverUrl);
      this.isConnected = true;
      this.emit('connection', { connected: true });
    });

    this.socket.on('disconnect', () => {
      console.log('📱 MOBILE - Déconnecté du serveur de tracking');
      this.isConnected = false;
      this.emit('connection', { connected: false });
    });

    this.socket.on('error', (error) => {
      console.error('📱 MOBILE - Erreur Socket.io:', error);
      console.error('📱 MOBILE - URL de connexion:', serverUrl);
      this.emit('error', error);
    });

    this.socket.on('connect_error', (error) => {
      console.error('📱 MOBILE - Erreur de connexion Socket.io:', error);
      console.error('📱 MOBILE - URL de connexion:', serverUrl);
      this.emit('error', error);
    });

    // Écouter les événements de tracking
    this.socket.on('order-status-update', (data: any) => {
      console.log('📱 MOBILE - WebSocket: order-status-update reçu:', data);
      console.log('📱 MOBILE - WebSocket: Type de données:', typeof data);
      console.log('📱 MOBILE - WebSocket: Clés disponibles:', Object.keys(data || {}));
      this.handleOrderStatusUpdate(data);
    });

    this.socket.on('qr_code_scanned', (data: { orderId: string; driverInfo: any }) => {
      this.handleQRCodeScanned(data);
    });

    this.socket.on('driver_location_update', (data: { orderId: string; location: any }) => {
      this.handleDriverLocationUpdate(data);
    });

    this.socket.on('chat_message', (message: ChatMessage) => {
      this.handleChatMessage(message);
    });

    this.socket.on('chat_enabled', (data: { orderId: string; driverInfo: any }) => {
      this.handleChatEnabled(data);
    });
  }

  disconnect() {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
      this.isConnected = false;
    }
  }

  // S'abonner aux événements
  subscribe(event: string, callback: Function) {
    if (!this.listeners.has(event)) {
      this.listeners.set(event, []);
    }
    this.listeners.get(event)!.push(callback);
  }

  // Se désabonner des événements
  unsubscribe(event: string, callback: Function) {
    const callbacks = this.listeners.get(event);
    if (callbacks) {
      const index = callbacks.indexOf(callback);
      if (index > -1) {
        callbacks.splice(index, 1);
      }
    }
  }

  // Émettre des événements
  private emit(event: string, data: any) {
    const callbacks = this.listeners.get(event);
    if (callbacks) {
      callbacks.forEach(callback => callback(data));
    }
  }

  // Rejoindre une room pour une commande spécifique
  joinOrderRoom(orderId: string) {
    if (this.socket && this.isConnected) {
      console.log('📱 MOBILE - Rejoindre la room pour la commande:', orderId);
      console.log('📱 MOBILE - Socket connecté:', this.isConnected);
      console.log('📱 MOBILE - Socket ID:', this.socket.id);
      this.socket.emit('join-order-notifications', { userId: orderId });
    } else {
      console.log('📱 MOBILE - Impossible de rejoindre la room - Socket:', !!this.socket, 'Connected:', this.isConnected);
    }
  }

  // Quitter une room
  leaveOrderRoom(orderId: string) {
    if (this.socket && this.isConnected) {
      console.log('📱 Quitter la room pour la commande:', orderId);
      this.socket.emit('leave-order-notifications', { userId: orderId });
    }
  }

  // Envoyer un message de chat
  sendChatMessage(orderId: string, message: string) {
    if (this.socket && this.isConnected) {
      this.socket.emit('send_chat_message', {
        orderId,
        message,
        sender: 'customer',
        timestamp: new Date(),
      });
    }
  }

  // Gestionnaires d'événements
  private async handleOrderStatusUpdate(data: any) {
    console.log('📱 MOBILE - handleOrderStatusUpdate - Données reçues:', data);
    console.log('📱 MOBILE - handleOrderStatusUpdate - data.orderId:', data.orderId);
    console.log('📱 MOBILE - handleOrderStatusUpdate - data.status:', data.status);
    console.log('📱 MOBILE - handleOrderStatusUpdate - data.type:', data.type);
    
    // Convertir les données du backend en format OrderTrackingData
    const trackingData: OrderTrackingData = {
      orderId: data.orderId || data._id,
      status: data.status || 'confirmed',
      qrScanned: data.qrScanned || false,
      chatEnabled: data.chatEnabled || false,
      estimatedTime: data.estimatedTime || '20-40 min',
      lastUpdated: new Date(),
    };
    
    console.log('📱 MOBILE - handleOrderStatusUpdate - Données converties:', trackingData);
    
    // Émettre l'événement
    console.log('📱 MOBILE - handleOrderStatusUpdate - Émission de order_status_update');
    this.emit('order_status_update', trackingData);

    // Envoyer une notification si nécessaire
    if (data.status === 'preparing') {
      await this.sendNotification(
        'Commande acceptée!',
        'Votre commande est maintenant en préparation.',
        { orderId: data.orderId }
      );
    } else if (data.status === 'out_for_delivery' && data.qrScanned) {
      await this.sendNotification(
        'Votre commande est en cours de livraison!',
        'Le livreur a scanné votre QR code et est en route.',
        { orderId: data.orderId }
      );
    }
  }

  private async handleQRCodeScanned(data: { orderId: string; driverInfo: any }) {
    console.log('QR code scanné:', data);
    
    this.emit('qr_code_scanned', data);

    await this.sendNotification(
      'QR Code scanné!',
      'Votre commande est maintenant en cours de livraison.',
      { orderId: data.orderId }
    );
  }

  private handleDriverLocationUpdate(data: { orderId: string; location: any }) {
    console.log('Mise à jour de localisation du livreur:', data);
    this.emit('driver_location_update', data);
  }

  private async handleChatMessage(message: ChatMessage) {
    console.log('Nouveau message de chat:', message);
    
    this.emit('chat_message', message);

    // Notification pour les messages du livreur
    if (message.sender === 'driver') {
      await this.sendNotification(
        'Message du livreur',
        message.text,
        { orderId: message.orderId, type: 'chat' }
      );
    }
  }

  private async handleChatEnabled(data: { orderId: string; driverInfo: any }) {
    console.log('Chat activé:', data);
    
    this.emit('chat_enabled', data);

    await this.sendNotification(
      'Chat activé',
      `${data.driverInfo.name} a activé le chat. Vous pouvez maintenant communiquer directement.`,
      { orderId: data.orderId, type: 'chat_enabled' }
    );
  }

  // Envoyer une notification push
  private async sendNotification(title: string, body: string, data?: any) {
    try {
      await Notifications.scheduleNotificationAsync({
        content: {
          title,
          body,
          data,
          sound: true,
        },
        trigger: null, // Immédiat
      });
    } catch (error) {
      console.error('Erreur lors de l\'envoi de notification:', error);
    }
  }

  // Obtenir le statut de connexion
  getConnectionStatus(): boolean {
    return this.isConnected;
  }

  // Obtenir l'ID de la socket
  getSocketId(): string | null {
    return this.socket?.id || null;
  }
}

// Instance singleton
export const qrTrackingService = new QRTrackingService();
export default qrTrackingService;
