import { API_CONFIG } from '../config/api';
import AsyncStorage from '@react-native-async-storage/async-storage';

export interface TrackingData {
  orderId: string;
  status: 'preparing' | 'ready' | 'picked_up' | 'in_transit' | 'delivered' | 'cancelled';
  driverId?: string;
  driverName?: string;
  driverPhone?: string;
  currentLocation?: {
    latitude: number;
    longitude: number;
    address?: string;
  };
  estimatedDeliveryTime?: string;
  actualDeliveryTime?: string;
  deliveryNotes?: string;
  lastUpdated: string;
}

export interface TrackingUpdatePayload {
  status?: 'preparing' | 'ready' | 'picked_up' | 'in_transit' | 'delivered' | 'cancelled';
  driverId?: string;
  driverName?: string;
  driverPhone?: string;
  currentLocation?: {
    latitude: number;
    longitude: number;
    address?: string;
  };
  estimatedDeliveryTime?: string;
  deliveryNotes?: string;
}

// Récupérer le tracking d'une commande
export const getOrderTracking = async (orderId: string): Promise<TrackingData> => {
  try {
    const token = await AsyncStorage.getItem('authToken');
    if (!token) {
      throw new Error('Token d\'authentification manquant');
    }

    const response = await fetch(`${API_CONFIG.BASE_URL}/api/tracking/order/${orderId}`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`Erreur HTTP: ${response.status}`);
    }

    const data = await response.json();
    return data.tracking;
  } catch (error) {
    console.error('Erreur lors de la récupération du tracking:', error);
    throw error;
  }
};

// Mettre à jour le statut de tracking
export const updateTrackingStatus = async (orderId: string, updateData: TrackingUpdatePayload): Promise<TrackingData> => {
  try {
    const token = await AsyncStorage.getItem('authToken');
    if (!token) {
      throw new Error('Token d\'authentification manquant');
    }

    const response = await fetch(`${API_CONFIG.BASE_URL}/api/tracking/order/${orderId}`, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(updateData),
    });

    if (!response.ok) {
      throw new Error(`Erreur HTTP: ${response.status}`);
    }

    const data = await response.json();
    return data.tracking;
  } catch (error) {
    console.error('Erreur lors de la mise à jour du tracking:', error);
    throw error;
  }
};

// Créer un tracking pour une commande
export const createOrderTracking = async (orderId: string): Promise<TrackingData> => {
  try {
    const token = await AsyncStorage.getItem('authToken');
    if (!token) {
      throw new Error('Token d\'authentification manquant');
    }

    const response = await fetch(`${API_CONFIG.BASE_URL}/api/tracking/create`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ orderId }),
    });

    if (!response.ok) {
      throw new Error(`Erreur HTTP: ${response.status}`);
    }

    const data = await response.json();
    return data.tracking;
  } catch (error) {
    console.error('Erreur lors de la création du tracking:', error);
    throw error;
  }
};

// Récupérer les trackings d'un driver
export const getDriverTrackings = async (driverId: string, status?: string): Promise<TrackingData[]> => {
  try {
    const token = await AsyncStorage.getItem('authToken');
    if (!token) {
      throw new Error('Token d\'authentification manquant');
    }

    const url = status 
      ? `${API_CONFIG.BASE_URL}/api/tracking/driver/${driverId}?status=${status}`
      : `${API_CONFIG.BASE_URL}/api/tracking/driver/${driverId}`;

    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`Erreur HTTP: ${response.status}`);
    }

    const data = await response.json();
    return data.trackings;
  } catch (error) {
    console.error('Erreur lors de la récupération des trackings du driver:', error);
    throw error;
  }
};

// Fonction utilitaire pour obtenir le texte du statut
export const getStatusText = (status: string): string => {
  switch (status) {
    case 'preparing':
      return 'En préparation';
    case 'ready':
      return 'Prête à être récupérée';
    case 'picked_up':
      return 'Récupérée par le livreur';
    case 'in_transit':
      return 'En cours de livraison';
    case 'delivered':
      return 'Livrée';
    case 'cancelled':
      return 'Annulée';
    default:
      return 'Statut inconnu';
  }
};

// Fonction utilitaire pour obtenir la couleur du statut
export const getStatusColor = (status: string): string => {
  switch (status) {
    case 'preparing':
      return '#FFA500'; // Orange
    case 'ready':
      return '#FFD700'; // Or
    case 'picked_up':
      return '#4169E1'; // Bleu royal
    case 'in_transit':
      return '#32CD32'; // Vert lime
    case 'delivered':
      return '#228B22'; // Vert forêt
    case 'cancelled':
      return '#DC143C'; // Rouge
    default:
      return '#666666'; // Gris
  }
};

// Fonction utilitaire pour calculer le temps estimé d'arrivée
export const getEstimatedTime = (estimatedDeliveryTime?: string): string => {
  if (!estimatedDeliveryTime) return 'Non disponible';
  
  const now = new Date();
  const deliveryTime = new Date(estimatedDeliveryTime);
  const diffMs = deliveryTime.getTime() - now.getTime();
  const diffMinutes = Math.round(diffMs / (1000 * 60));
  
  if (diffMinutes <= 0) return 'Arrivé';
  if (diffMinutes < 60) return `${diffMinutes} min`;
  
  const hours = Math.floor(diffMinutes / 60);
  const minutes = diffMinutes % 60;
  return minutes > 0 ? `${hours}h ${minutes}min` : `${hours}h`;
};
