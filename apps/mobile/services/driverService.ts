import { API_BASE_URL } from '../config/api';
import AsyncStorage from '@react-native-async-storage/async-storage';

export interface DriverProfile {
  id: string;
  user: {
    name: string;
    email: string;
    phoneNumber?: string;
    profileImage?: string;
  };
  licenseNumber: string;
  vehicleType: 'bike' | 'scooter' | 'car' | 'motorcycle';
  vehicleModel?: string;
  vehiclePlate?: string;
  isOnline: boolean;
  currentLocation?: {
    latitude: number;
    longitude: number;
    address?: string;
    lastUpdated: string;
  };
  deliveryZone?: string[];
  rating: number;
  totalDeliveries: number;
  isAvailable: boolean;
  maxDeliveryRadius: number;
  workingHours: {
    start: string;
    end: string;
    days: number[];
  };
  bankAccount?: {
    accountNumber: string;
    bankName: string;
    accountHolderName: string;
  };
  documents: {
    licenseImage?: string;
    vehicleImage?: string;
    insuranceImage?: string;
    idCardImage?: string;
  };
  status: 'pending' | 'approved' | 'rejected' | 'suspended';
  rejectionReason?: string;
}

export interface DriverOrder {
  trackingId: string;
  orderId: {
    _id: string;
    orderNumber: string;
    totalAmount: number;
    customerName: string;
    customerPhone: string;
    deliveryAddress: {
      street: string;
      city: string;
      postalCode: string;
      coordinates?: {
        latitude: number;
        longitude: number;
      };
    };
    items: Array<{
      product: {
        name: string;
        image?: string;
      };
      quantity: number;
      price: number;
    }>;
  };
  status: 'preparing' | 'ready' | 'picked_up' | 'in_transit' | 'delivered' | 'cancelled';
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
  createdAt: string;
}

export interface DriverStats {
  totalDeliveries: number;
  pendingDeliveries: number;
  todayDeliveries: number;
  rating: number;
  isOnline: boolean;
  isAvailable: boolean;
}

export interface LocationUpdate {
  latitude: number;
  longitude: number;
  address?: string;
}

export interface StatusUpdate {
  isOnline?: boolean;
  isAvailable?: boolean;
}

class DriverService {
  private async getAuthToken(): Promise<string | null> {
    return await AsyncStorage.getItem('authToken');
  }

  private async getHeaders() {
    const token = await this.getAuthToken();
    return {
      'Content-Type': 'application/json',
      ...(token && { 'Authorization': `Bearer ${token}` }),
    };
  }

  // Inscription d'un nouveau livreur
  async registerDriver(driverData: {
    userId: string;
    licenseNumber: string;
    vehicleType: 'bike' | 'scooter' | 'car' | 'motorcycle';
    vehicleModel?: string;
    vehiclePlate?: string;
    deliveryZone?: string[];
    workingHours?: {
      start: string;
      end: string;
      days: number[];
    };
    bankAccount?: {
      accountNumber: string;
      bankName: string;
      accountHolderName: string;
    };
    documents?: {
      licenseImage?: string;
      vehicleImage?: string;
      insuranceImage?: string;
      idCardImage?: string;
    };
  }) {
    const response = await fetch(`${API_BASE_URL}/driver/register`, {
      method: 'POST',
      headers: await this.getHeaders(),
      body: JSON.stringify(driverData),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Erreur lors de l\'inscription');
    }

    return response.json();
  }

  // Récupérer le profil du livreur
  async getDriverProfile(): Promise<DriverProfile> {
    const response = await fetch(`${API_BASE_URL}/driver/profile`, {
      method: 'GET',
      headers: await this.getHeaders(),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Erreur lors de la récupération du profil');
    }

    const data = await response.json();
    return data.driver;
  }

  // Mettre à jour le profil du livreur
  async updateDriverProfile(updateData: Partial<DriverProfile>) {
    const response = await fetch(`${API_BASE_URL}/driver/profile`, {
      method: 'PUT',
      headers: await this.getHeaders(),
      body: JSON.stringify(updateData),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Erreur lors de la mise à jour du profil');
    }

    return response.json();
  }

  // Mettre à jour la position du livreur
  async updateLocation(location: LocationUpdate) {
    const response = await fetch(`${API_BASE_URL}/driver/location`, {
      method: 'PUT',
      headers: await this.getHeaders(),
      body: JSON.stringify(location),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Erreur lors de la mise à jour de la position');
    }

    return response.json();
  }

  // Changer le statut en ligne/hors ligne
  async updateStatus(status: StatusUpdate) {
    const response = await fetch(`${API_BASE_URL}/driver/status`, {
      method: 'PUT',
      headers: await this.getHeaders(),
      body: JSON.stringify(status),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Erreur lors de la mise à jour du statut');
    }

    return response.json();
  }

  // Récupérer les commandes du livreur
  async getDriverOrders(status?: string): Promise<DriverOrder[]> {
    const url = status 
      ? `${API_BASE_URL}/driver/orders?status=${status}`
      : `${API_BASE_URL}/driver/orders`;

    const response = await fetch(url, {
      method: 'GET',
      headers: await this.getHeaders(),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Erreur lors de la récupération des commandes');
    }

    const data = await response.json();
    return data.orders;
  }

  // Accepter une commande
  async acceptOrder(orderId: string) {
    const response = await fetch(`${API_BASE_URL}/driver/orders/accept`, {
      method: 'POST',
      headers: await this.getHeaders(),
      body: JSON.stringify({ orderId }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Erreur lors de l\'acceptation de la commande');
    }

    return response.json();
  }

  // Mettre à jour le statut d'une livraison
  async updateDeliveryStatus(orderId: string, status: string, deliveryNotes?: string) {
    const response = await fetch(`${API_BASE_URL}/driver/orders/status`, {
      method: 'PUT',
      headers: await this.getHeaders(),
      body: JSON.stringify({ orderId, status, deliveryNotes }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Erreur lors de la mise à jour du statut');
    }

    return response.json();
  }

  // Récupérer les statistiques du livreur
  async getDriverStats(): Promise<DriverStats> {
    const response = await fetch(`${API_BASE_URL}/driver/stats`, {
      method: 'GET',
      headers: await this.getHeaders(),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Erreur lors de la récupération des statistiques');
    }

    const data = await response.json();
    return data.stats;
  }
}

export const driverService = new DriverService();
