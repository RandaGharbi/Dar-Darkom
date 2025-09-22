const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:5000';

export interface NotificationData {
  userId?: string;
  type: 'order_update' | 'promotion' | 'delivery_update' | 'general' | 'system';
  title: string;
  message: string;
  data?: any;
}

export interface OrderUpdateData {
  userId: string;
  orderId: string;
  status: string;
  message?: string;
}

export interface DeliveryUpdateData {
  userId: string;
  orderId: string;
  driverName?: string;
  estimatedTime?: string;
  status?: string;
}

export interface PromotionData {
  userIds?: string[];
  promotionId: string;
  title: string;
  message: string;
  data?: any;
}

class NotificationService {
  private async getAuthHeaders() {
    const token = localStorage.getItem('authToken');
    return {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    };
  }

  /**
   * Envoyer une notification à un utilisateur spécifique
   */
  async sendNotification(data: NotificationData) {
    const response = await fetch(`${API_BASE_URL}/api/admin/notifications/send`, {
      method: 'POST',
      headers: await this.getAuthHeaders(),
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return response.json();
  }

  /**
   * Diffuser une notification à tous les utilisateurs
   */
  async broadcastNotification(data: Omit<NotificationData, 'userId'>) {
    const response = await fetch(`${API_BASE_URL}/api/admin/notifications/broadcast`, {
      method: 'POST',
      headers: await this.getAuthHeaders(),
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return response.json();
  }

  /**
   * Envoyer une mise à jour de commande
   */
  async sendOrderUpdate(data: OrderUpdateData) {
    const response = await fetch(`${API_BASE_URL}/api/admin/notifications/order-update`, {
      method: 'POST',
      headers: await this.getAuthHeaders(),
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return response.json();
  }

  /**
   * Envoyer une mise à jour de livraison
   */
  async sendDeliveryUpdate(data: DeliveryUpdateData) {
    const response = await fetch(`${API_BASE_URL}/api/admin/notifications/delivery-update`, {
      method: 'POST',
      headers: await this.getAuthHeaders(),
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return response.json();
  }

  /**
   * Envoyer une promotion
   */
  async sendPromotion(data: PromotionData) {
    const response = await fetch(`${API_BASE_URL}/api/admin/notifications/promotion`, {
      method: 'POST',
      headers: await this.getAuthHeaders(),
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return response.json();
  }

  /**
   * Obtenir les notifications d'un utilisateur
   */
  async getUserNotifications(
    userId: string, 
    page: number = 1, 
    limit: number = 20, 
    unreadOnly: boolean = false
  ) {
    const response = await fetch(`${API_BASE_URL}/api/notifications?userId=${userId}&page=${page}&limit=${limit}&unreadOnly=${unreadOnly}`, {
      method: 'GET',
      headers: await this.getAuthHeaders(),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    console.log('🔔 API Response:', data);
    
    // L'API retourne les données dans data.data
    const result = data.data || data;
    return {
      notifications: result.notifications || [],
      unreadCount: result.unreadCount || 0,
      total: result.total || 0,
      hasMore: result.hasMore || false
    };
  }

  /**
   * Marquer une notification comme lue
   */
  async markAsRead(notificationId: string) {
    const response = await fetch(`${API_BASE_URL}/api/notifications/${notificationId}/read`, {
      method: 'PUT',
      headers: await this.getAuthHeaders(),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return response.json();
  }

  /**
   * Marquer toutes les notifications comme lues
   */
  async markAllAsRead() {
    const response = await fetch(`${API_BASE_URL}/api/notifications/read-all`, {
      method: 'PUT',
      headers: await this.getAuthHeaders(),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return response.json();
  }

  /**
   * Supprimer une notification
   */
  async deleteNotification(notificationId: string) {
    const response = await fetch(`${API_BASE_URL}/api/notifications/${notificationId}`, {
      method: 'DELETE',
      headers: await this.getAuthHeaders(),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return response.json();
  }

  /**
   * Obtenir les statistiques des notifications
   */
  async getStats() {
    const response = await fetch(`${API_BASE_URL}/api/admin/notifications/stats`, {
      method: 'GET',
      headers: await this.getAuthHeaders(),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return response.json();
  }
}

export default new NotificationService();