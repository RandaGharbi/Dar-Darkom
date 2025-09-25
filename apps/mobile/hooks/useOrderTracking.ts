import { useState, useEffect, useCallback } from 'react';
import { qrTrackingService, OrderTrackingData, ChatMessage } from '../services/qrTrackingService';
import { useAuth } from '../context/AuthContext';

export interface UseOrderTrackingReturn {
  orderData: OrderTrackingData | null;
  messages: ChatMessage[];
  isConnected: boolean;
  isLoading: boolean;
  error: string | null;
  sendMessage: (message: string) => void;
  refreshOrder: () => void;
}

export function useOrderTracking(orderId: string): UseOrderTrackingReturn {
  const { user } = useAuth();
  const [orderData, setOrderData] = useState<OrderTrackingData | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isConnected, setIsConnected] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  console.log('📱 MOBILE - Hook: useOrderTracking initialisé avec orderId:', orderId);

  // Initialiser la connexion
  useEffect(() => {
    // URL du serveur - utiliser la même IP que les API
    const serverUrl = 'http://192.168.1.73:5000';
    console.log('📱 MOBILE - Hook: Connexion WebSocket à:', serverUrl);
    console.log('📱 MOBILE - Hook: orderId pour la connexion:', orderId);
    console.log('📱 MOBILE - Hook: Tentative de connexion...');
    
    // Se connecter immédiatement, même sans orderId
    try {
      qrTrackingService.connect(serverUrl);
      console.log('📱 MOBILE - Hook: Connexion WebSocket initiée');
    } catch (error) {
      console.error('📱 MOBILE - Hook: Erreur de connexion WebSocket:', error);
    }

    return () => {
      console.log('📱 MOBILE - Hook: Déconnexion WebSocket');
      qrTrackingService.disconnect();
    };
  }, []); // Supprimer orderId de la dépendance

  // Rejoindre la room de la commande
  useEffect(() => {
    if (orderId && isConnected) {
      console.log('📱 Rejoindre la room avec orderId:', orderId);
      console.log('📱 MOBILE - Hook: user.id pour la room:', user?.id);
      // Utiliser orderId comme room name au lieu de user.id
      qrTrackingService.joinOrderRoom(orderId);
    }

    return () => {
      if (orderId) {
        console.log('📱 Quitter la room avec orderId:', orderId);
        qrTrackingService.leaveOrderRoom(orderId);
      }
    };
  }, [orderId, isConnected, user?.id]);

  // Écouter les événements de connexion
  useEffect(() => {
    const handleConnection = (data: { connected: boolean }) => {
      console.log('📱 MOBILE - Hook: Événement de connexion reçu:', data);
      setIsConnected(data.connected);
      if (data.connected) {
        console.log('📱 MOBILE - Hook: WebSocket connecté, prêt à rejoindre la room');
        setError(null);
      } else {
        console.log('📱 MOBILE - Hook: WebSocket déconnecté');
      }
    };

    console.log('📱 MOBILE - Hook: Souscription aux événements de connexion');
    qrTrackingService.subscribe('connection', handleConnection);
    return () => {
      console.log('📱 MOBILE - Hook: Désabonnement des événements de connexion');
      qrTrackingService.unsubscribe('connection', handleConnection);
    };
  }, []);

  // Écouter les mises à jour de statut de commande
  useEffect(() => {
    const handleOrderStatusUpdate = (data: OrderTrackingData) => {
      console.log('📱 MOBILE - Hook: Mise à jour du statut reçue:', data);
      console.log('📱 MOBILE - Hook: Ancien statut:', orderData?.status, '→ Nouveau statut:', data.status);
      console.log('📱 MOBILE - Hook: orderId attendu:', orderId, 'orderId reçu:', data.orderId);
      setOrderData(data);
      setIsLoading(false);
      setError(null);
    };

    console.log('📱 MOBILE - Hook: Souscription à order_status_update pour orderId:', orderId);
    qrTrackingService.subscribe('order_status_update', handleOrderStatusUpdate);
    return () => {
      console.log('📱 MOBILE - Hook: Désabonnement de order_status_update');
      qrTrackingService.unsubscribe('order_status_update', handleOrderStatusUpdate);
    };
  }, [orderId, orderData?.status]);

  // Écouter les messages de chat
  useEffect(() => {
    const handleChatMessage = (message: ChatMessage) => {
      setMessages(prev => [...prev, message]);
    };

    qrTrackingService.subscribe('chat_message', handleChatMessage);
    return () => qrTrackingService.unsubscribe('chat_message', handleChatMessage);
  }, []);

  // Écouter l'activation du chat
  useEffect(() => {
    const handleChatEnabled = (data: { orderId: string; driverInfo: any }) => {
      setOrderData(prev => prev ? {
        ...prev,
        chatEnabled: true,
        driverInfo: data.driverInfo,
      } : null);
    };

    qrTrackingService.subscribe('chat_enabled', handleChatEnabled);
    return () => qrTrackingService.unsubscribe('chat_enabled', handleChatEnabled);
  }, []);

  // Écouter les erreurs
  useEffect(() => {
    const handleError = (error: any) => {
      setError(error.message || 'Erreur de connexion');
      setIsLoading(false);
    };

    qrTrackingService.subscribe('error', handleError);
    return () => qrTrackingService.unsubscribe('error', handleError);
  }, []);

  // Fonction pour envoyer un message
  const sendMessage = useCallback((message: string) => {
    if (message.trim() && orderId) {
      qrTrackingService.sendChatMessage(orderId, message);
      
      // Ajouter le message localement immédiatement
      const newMessage: ChatMessage = {
        id: Date.now().toString(),
        orderId,
        text: message.trim(),
        sender: 'customer',
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, newMessage]);
    }
  }, [orderId]);

  // Fonction pour rafraîchir les données de commande
  const refreshOrder = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      // Appel API pour récupérer les vraies données de la commande
      const response = await fetch(`http://192.168.1.73:5000/api/orders/${orderId}`, {
        headers: {
          'Content-Type': 'application/json',
        },
      });
      
      if (!response.ok) {
        throw new Error('Erreur lors de la récupération de la commande');
      }
      
      const orderData = await response.json();
      
      // Convertir les données de l'API en format OrderTrackingData
      const trackingData: OrderTrackingData = {
        orderId: orderData._id,
        status: orderData.status || 'confirmed',
        qrScanned: false, // Par défaut
        chatEnabled: false, // Par défaut
        estimatedTime: '20-40 min', // Estimation par défaut
        lastUpdated: new Date(),
      };
      
      console.log('📱 Données de commande récupérées:', trackingData);
      setOrderData(trackingData);
    } catch (err) {
      console.error('❌ Erreur lors de la récupération de la commande:', err);
      setError(err instanceof Error ? err.message : 'Erreur inconnue');
    } finally {
      setIsLoading(false);
    }
  }, [orderId]);

  // Charger les données initiales
  useEffect(() => {
    refreshOrder();
  }, [refreshOrder]);

  return {
    orderData,
    messages,
    isConnected,
    isLoading,
    error,
    sendMessage,
    refreshOrder,
  };
}
