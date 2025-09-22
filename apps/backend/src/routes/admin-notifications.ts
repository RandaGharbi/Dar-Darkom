import express from 'express';
import { auth } from '../middleware/auth';
import NotificationService from '../services/notificationService';
import { io } from '../index';
import { Types } from 'mongoose';

const router = express.Router();

/**
 * POST /api/admin/notifications/send
 * Envoyer une notification à un utilisateur spécifique
 */
router.post('/send', auth, async (req, res) => {
  try {
    const { userId, type, title, message, data } = req.body;

    if (!userId || !type || !title || !message) {
      return res.status(400).json({ 
        error: 'userId, type, title et message sont requis' 
      });
    }

    // Créer la notification dans la base de données
    const notification = await NotificationService.createNotification({
      userId,
      type,
      title,
      message,
      data: data || {},
      priority: 'high'
    });

    // Envoyer via WebSocket
    io.to(`notifications-${userId}`).emit('notification', {
      type,
      title,
      message,
      data: data || {},
      userId
    });

    res.json({
      success: true,
      data: notification,
      message: 'Notification envoyée avec succès'
    });
  } catch (error) {
    console.error('Erreur lors de l\'envoi de la notification:', error);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

/**
 * POST /api/admin/notifications/broadcast
 * Envoyer une notification à tous les utilisateurs
 */
router.post('/broadcast', auth, async (req, res) => {
  try {
    const { type, title, message, data } = req.body;

    if (!type || !title || !message) {
      return res.status(400).json({ 
        error: 'type, title et message sont requis' 
      });
    }

    // Envoyer à tous les clients connectés
    io.emit('notification', {
      type,
      title,
      message,
      data: data || {}
    });

    res.json({
      success: true,
      message: 'Notification diffusée à tous les utilisateurs'
    });
  } catch (error) {
    console.error('Erreur lors de la diffusion de la notification:', error);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

/**
 * POST /api/admin/notifications/order-update
 * Envoyer une mise à jour de commande
 */
router.post('/order-update', auth, async (req, res) => {
  try {
    const { userId, orderId, status, message } = req.body;

    if (!userId || !orderId || !status) {
      return res.status(400).json({ 
        error: 'userId, orderId et status sont requis' 
      });
    }

    // Créer la notification de commande
    const notification = await NotificationService.createOrderNotification(
      userId,
      orderId,
      status,
      message || `Votre commande #${orderId} a été ${status}`
    );

    // Envoyer via WebSocket
    io.to(`notifications-${userId}`).emit('order_update', {
      orderId,
      status,
      message: message || `Votre commande #${orderId} a été ${status}`,
      timestamp: new Date()
    });

    res.json({
      success: true,
      data: notification,
      message: 'Mise à jour de commande envoyée'
    });
  } catch (error) {
    console.error('Erreur lors de l\'envoi de la mise à jour de commande:', error);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

/**
 * POST /api/admin/notifications/delivery-update
 * Envoyer une mise à jour de livraison
 */
router.post('/delivery-update', auth, async (req, res) => {
  try {
    const { userId, orderId, driverName, estimatedTime, status } = req.body;

    if (!userId || !orderId) {
      return res.status(400).json({ 
        error: 'userId et orderId sont requis' 
      });
    }

    // Créer la notification de livraison
    const notification = await NotificationService.createDeliveryNotification(
      userId,
      orderId,
      driverName || 'Notre livreur',
      estimatedTime || '30 minutes'
    );

    // Envoyer via WebSocket
    io.to(`notifications-${userId}`).emit('delivery_update', {
      orderId,
      driverName: driverName || 'Notre livreur',
      estimatedTime: estimatedTime || '30 minutes',
      status: status || 'in_transit',
      timestamp: new Date()
    });

    res.json({
      success: true,
      data: notification,
      message: 'Mise à jour de livraison envoyée'
    });
  } catch (error) {
    console.error('Erreur lors de l\'envoi de la mise à jour de livraison:', error);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

/**
 * POST /api/admin/notifications/promotion
 * Envoyer une notification de promotion
 */
router.post('/promotion', auth, async (req, res) => {
  try {
    const { userIds, promotionId, title, message, data } = req.body;

    if (!promotionId || !title || !message) {
      return res.status(400).json({ 
        error: 'promotionId, title et message sont requis' 
      });
    }

    const results = [];

    // Si userIds est fourni, envoyer à des utilisateurs spécifiques
    if (userIds && Array.isArray(userIds)) {
      for (const userId of userIds) {
        const notification = await NotificationService.createPromotionNotification(
          userId,
          promotionId,
          title,
          message
        );

        // Envoyer via WebSocket
        io.to(`notifications-${userId}`).emit('promotion', {
          promotionId,
          title,
          message,
          data: data || {},
          timestamp: new Date()
        });

        results.push(notification);
      }
    } else {
      // Sinon, diffuser à tous les utilisateurs
      io.emit('promotion', {
        promotionId,
        title,
        message,
        data: data || {},
        timestamp: new Date()
      });
    }

    res.json({
      success: true,
      data: results,
      message: 'Notification de promotion envoyée'
    });
  } catch (error) {
    console.error('Erreur lors de l\'envoi de la promotion:', error);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

/**
 * GET /api/admin/notifications/stats
 * Obtenir les statistiques des notifications
 */
router.get('/stats', auth, async (req, res) => {
  try {
    // Cette route pourrait être étendue pour fournir des statistiques
    // Pour l'instant, on retourne les clients connectés
    const connectedClients = io.engine.clientsCount;
    
    res.json({
      success: true,
      data: {
        connectedClients,
        timestamp: new Date()
      }
    });
  } catch (error) {
    console.error('Erreur lors de la récupération des statistiques:', error);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

export default router;
