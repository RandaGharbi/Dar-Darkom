import express from 'express';
import { auth } from '../middleware/auth';
import NotificationService from '../services/notificationService';
import { Types } from 'mongoose';

const router = express.Router();

/**
 * GET /api/notifications
 * Récupérer les notifications de l'utilisateur
 */
router.get('/', auth, async (req, res) => {
  try {
    const userId = req.user?.id;
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 20;
    const unreadOnly = req.query.unreadOnly === 'true';

    if (!userId) {
      return res.status(401).json({ error: 'Utilisateur non authentifié' });
    }

    const result = await NotificationService.getUserNotifications(
      userId,
      page,
      limit,
      unreadOnly
    );

    res.json({
      success: true,
      data: result
    });
  } catch (error) {
    console.error('Erreur lors de la récupération des notifications:', error);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

/**
 * GET /api/notifications/settings
 * Récupérer les paramètres de notification de l'utilisateur
 */
router.get('/settings', auth, async (req, res) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({ error: 'Utilisateur non authentifié' });
    }

    let settings = await NotificationService.getUserNotificationSettings(userId);
    
    // Créer des paramètres par défaut si l'utilisateur n'en a pas
    if (!settings) {
      settings = await NotificationService.updateUserNotificationSettings(userId, {});
    }

    res.json({
      success: true,
      data: settings
    });
  } catch (error) {
    console.error('Erreur lors de la récupération des paramètres:', error);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

/**
 * PUT /api/notifications/settings
 * Mettre à jour les paramètres de notification
 */
router.put('/settings', auth, async (req, res) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({ error: 'Utilisateur non authentifié' });
    }

    const {
      pushNotifications,
      orderUpdates,
      promotions,
      deliveryUpdates,
      soundEnabled,
      vibrationEnabled,
      quietHours,
      quietStartTime,
      quietEndTime,
      emailNotifications,
      smsNotifications
    } = req.body;

    const settings = await NotificationService.updateUserNotificationSettings(userId, {
      pushNotifications,
      orderUpdates,
      promotions,
      deliveryUpdates,
      soundEnabled,
      vibrationEnabled,
      quietHours,
      quietStartTime,
      quietEndTime,
      emailNotifications,
      smsNotifications
    });

    res.json({
      success: true,
      data: settings
    });
  } catch (error) {
    console.error('Erreur lors de la mise à jour des paramètres:', error);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

/**
 * POST /api/notifications/device-token
 * Ajouter un token de device pour les notifications push
 */
router.post('/device-token', auth, async (req, res) => {
  try {
    const userId = req.user?.id;
    const { token } = req.body;

    if (!userId) {
      return res.status(401).json({ error: 'Utilisateur non authentifié' });
    }

    if (!token) {
      return res.status(400).json({ error: 'Token de device requis' });
    }

    await NotificationService.addDeviceToken(userId, token);

    res.json({
      success: true,
      message: 'Token de device ajouté avec succès'
    });
  } catch (error) {
    console.error('Erreur lors de l\'ajout du token:', error);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

/**
 * DELETE /api/notifications/device-token
 * Supprimer un token de device
 */
router.delete('/device-token', auth, async (req, res) => {
  try {
    const userId = req.user?.id;
    const { token } = req.body;

    if (!userId) {
      return res.status(401).json({ error: 'Utilisateur non authentifié' });
    }

    if (!token) {
      return res.status(400).json({ error: 'Token de device requis' });
    }

    await NotificationService.removeDeviceToken(userId, token);

    res.json({
      success: true,
      message: 'Token de device supprimé avec succès'
    });
  } catch (error) {
    console.error('Erreur lors de la suppression du token:', error);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

/**
 * PUT /api/notifications/:id/read
 * Marquer une notification comme lue
 */
router.put('/:id/read', auth, async (req, res) => {
  try {
    const userId = req.user?.id;
    const notificationId = req.params.id;

    if (!userId) {
      return res.status(401).json({ error: 'Utilisateur non authentifié' });
    }

    const notification = await NotificationService.markAsRead(notificationId, userId);

    if (!notification) {
      return res.status(404).json({ error: 'Notification non trouvée' });
    }

    res.json({
      success: true,
      data: notification
    });
  } catch (error) {
    console.error('Erreur lors du marquage de la notification:', error);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

/**
 * PUT /api/notifications/read-all
 * Marquer toutes les notifications comme lues
 */
router.put('/read-all', auth, async (req, res) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({ error: 'Utilisateur non authentifié' });
    }

    const result = await NotificationService.markAllAsRead(userId);

    res.json({
      success: true,
      data: result
    });
  } catch (error) {
    console.error('Erreur lors du marquage des notifications:', error);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

/**
 * DELETE /api/notifications/:id
 * Supprimer une notification
 */
router.delete('/:id', auth, async (req, res) => {
  try {
    const userId = req.user?.id;
    const notificationId = req.params.id;

    if (!userId) {
      return res.status(401).json({ error: 'Utilisateur non authentifié' });
    }

    const deleted = await NotificationService.deleteNotification(notificationId, userId);

    if (!deleted) {
      return res.status(404).json({ error: 'Notification non trouvée' });
    }

    res.json({
      success: true,
      message: 'Notification supprimée avec succès'
    });
  } catch (error) {
    console.error('Erreur lors de la suppression de la notification:', error);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

/**
 * DELETE /api/notifications/read
 * Supprimer toutes les notifications lues
 */
router.delete('/read', auth, async (req, res) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({ error: 'Utilisateur non authentifié' });
    }

    const result = await NotificationService.deleteReadNotifications(userId);

    res.json({
      success: true,
      data: result
    });
  } catch (error) {
    console.error('Erreur lors de la suppression des notifications:', error);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

/**
 * POST /api/notifications/test
 * Créer une notification de test (pour le développement)
 */
router.post('/test', auth, async (req, res) => {
  try {
    const userId = req.user?.id;
    const { type, title, message } = req.body;

    if (!userId) {
      return res.status(401).json({ error: 'Utilisateur non authentifié' });
    }

    const notification = await NotificationService.createNotification({
      userId,
      type: type || 'general',
      title: title || 'Notification de test',
      message: message || 'Ceci est une notification de test',
      priority: 'medium'
    });

    res.json({
      success: true,
      data: notification
    });
  } catch (error) {
    console.error('Erreur lors de la création de la notification de test:', error);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

export default router;