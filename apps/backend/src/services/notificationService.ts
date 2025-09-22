import Notification, { INotification } from '../models/Notification';
import UserNotificationSettings, { IUserNotificationSettings } from '../models/UserNotificationSettings';
import { Types } from 'mongoose';

export interface CreateNotificationData {
  userId: string | Types.ObjectId;
  type: 'order_update' | 'promotion' | 'delivery_update' | 'general' | 'system';
  title: string;
  message: string;
  data?: any;
  priority?: 'low' | 'medium' | 'high';
  scheduledFor?: Date;
}

export class NotificationService {
  /**
   * Créer une nouvelle notification
   */
  static async createNotification(data: CreateNotificationData): Promise<INotification> {
    const notification = new Notification({
      userId: data.userId,
      type: data.type,
      title: data.title,
      message: data.message,
      data: data.data || {},
      priority: data.priority || 'medium',
      scheduledFor: data.scheduledFor
    });

    return await notification.save();
  }

  /**
   * Récupérer les notifications d'un utilisateur
   */
  static async getUserNotifications(
    userId: string | Types.ObjectId,
    page: number = 1,
    limit: number = 20,
    unreadOnly: boolean = false
  ): Promise<{ notifications: INotification[]; total: number; hasMore: boolean; unreadCount: number }> {
    const skip = (page - 1) * limit;
    
    const query: any = { userId };
    if (unreadOnly) {
      query.read = false;
    }

    const [notifications, total, unreadCount] = await Promise.all([
      Notification.find(query)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean(),
      Notification.countDocuments(query),
      Notification.countDocuments({ userId, read: false })
    ]);

    return {
      notifications,
      total,
      hasMore: skip + notifications.length < total,
      unreadCount
    };
  }

  /**
   * Marquer une notification comme lue
   */
  static async markAsRead(notificationId: string, userId: string | Types.ObjectId): Promise<INotification | null> {
    return await Notification.findOneAndUpdate(
      { _id: notificationId, userId },
      { read: true },
      { new: true }
    );
  }

  /**
   * Marquer toutes les notifications comme lues
   */
  static async markAllAsRead(userId: string | Types.ObjectId): Promise<{ modifiedCount: number }> {
    const result = await Notification.updateMany(
      { userId, read: false },
      { read: true }
    );
    return { modifiedCount: result.modifiedCount };
  }

  /**
   * Supprimer une notification
   */
  static async deleteNotification(notificationId: string, userId: string | Types.ObjectId): Promise<boolean> {
    const result = await Notification.deleteOne({ _id: notificationId, userId });
    return result.deletedCount > 0;
  }

  /**
   * Supprimer toutes les notifications lues
   */
  static async deleteReadNotifications(userId: string | Types.ObjectId): Promise<{ deletedCount: number }> {
    const result = await Notification.deleteMany({ userId, read: true });
    return { deletedCount: result.deletedCount };
  }

  /**
   * Récupérer les paramètres de notification d'un utilisateur
   */
  static async getUserNotificationSettings(userId: string | Types.ObjectId): Promise<IUserNotificationSettings | null> {
    return await UserNotificationSettings.findOne({ userId });
  }

  /**
   * Mettre à jour les paramètres de notification
   */
  static async updateUserNotificationSettings(
    userId: string | Types.ObjectId,
    settings: Partial<IUserNotificationSettings>
  ): Promise<IUserNotificationSettings> {
    return await UserNotificationSettings.findOneAndUpdate(
      { userId },
      { ...settings, lastUpdated: new Date() },
      { upsert: true, new: true }
    );
  }

  /**
   * Ajouter un token de device pour les notifications push
   */
  static async addDeviceToken(userId: string | Types.ObjectId, token: string): Promise<IUserNotificationSettings> {
    return await UserNotificationSettings.findOneAndUpdate(
      { userId },
      { 
        $addToSet: { deviceTokens: token },
        lastUpdated: new Date()
      },
      { upsert: true, new: true }
    );
  }

  /**
   * Supprimer un token de device
   */
  static async removeDeviceToken(userId: string | Types.ObjectId, token: string): Promise<IUserNotificationSettings | null> {
    return await UserNotificationSettings.findOneAndUpdate(
      { userId },
      { 
        $pull: { deviceTokens: token },
        lastUpdated: new Date()
      },
      { new: true }
    );
  }

  /**
   * Vérifier si un utilisateur veut recevoir un type de notification
   */
  static async shouldSendNotification(
    userId: string | Types.ObjectId,
    type: 'order_update' | 'promotion' | 'delivery_update' | 'general' | 'system'
  ): Promise<boolean> {
    const settings = await this.getUserNotificationSettings(userId);
    if (!settings || !settings.pushNotifications) return false;

    switch (type) {
      case 'order_update':
        return settings.orderUpdates;
      case 'promotion':
        return settings.promotions;
      case 'delivery_update':
        return settings.deliveryUpdates;
      case 'general':
      case 'system':
        return true;
      default:
        return false;
    }
  }

  /**
   * Créer des notifications pour les mises à jour de commande
   */
  static async createOrderNotification(
    userId: string | Types.ObjectId,
    orderId: string,
    status: string,
    message: string
  ): Promise<INotification | null> {
    const shouldSend = await this.shouldSendNotification(userId, 'order_update');
    if (!shouldSend) return null;

    const statusMessages: { [key: string]: string } = {
      'confirmed': 'Commande confirmée',
      'preparing': 'Commande en préparation',
      'ready': 'Commande prête',
      'out_for_delivery': 'Commande en cours de livraison',
      'delivered': 'Commande livrée',
      'cancelled': 'Commande annulée'
    };

    return await this.createNotification({
      userId,
      type: 'order_update',
      title: statusMessages[status] || 'Mise à jour de commande',
      message,
      data: { orderId, status },
      priority: 'high'
    });
  }

  /**
   * Créer des notifications pour les promotions
   */
  static async createPromotionNotification(
    userId: string | Types.ObjectId,
    promotionId: string,
    title: string,
    message: string
  ): Promise<INotification | null> {
    const shouldSend = await this.shouldSendNotification(userId, 'promotion');
    if (!shouldSend) return null;

    return await this.createNotification({
      userId,
      type: 'promotion',
      title,
      message,
      data: { promotionId },
      priority: 'medium'
    });
  }

  /**
   * Créer des notifications pour les mises à jour de livraison
   */
  static async createDeliveryNotification(
    userId: string | Types.ObjectId,
    orderId: string,
    driverName: string,
    estimatedTime: string
  ): Promise<INotification | null> {
    const shouldSend = await this.shouldSendNotification(userId, 'delivery_update');
    if (!shouldSend) return null;

    return await this.createNotification({
      userId,
      type: 'delivery_update',
      title: 'Livreur en route',
      message: `${driverName} est en route. Livraison estimée dans ${estimatedTime}`,
      data: { orderId, driverName, estimatedTime },
      priority: 'high'
    });
  }

  /**
   * Récupérer les notifications programmées à envoyer
   */
  static async getScheduledNotifications(): Promise<INotification[]> {
    const now = new Date();
    return await Notification.find({
      scheduledFor: { $lte: now },
      sentAt: { $exists: false }
    }).lean();
  }

  /**
   * Marquer une notification comme envoyée
   */
  static async markAsSent(notificationId: string): Promise<void> {
    await Notification.findByIdAndUpdate(notificationId, { sentAt: new Date() });
  }
}

export default NotificationService;
