import express from 'express';
import { getNotifications, markAsRead, deleteNotification } from '../controllers/notificationController';
import { auth } from '../middleware/auth';

const router = express.Router();

// Routes protégées par authentification
router.use(auth);

// Récupérer toutes les notifications
router.get('/', getNotifications);

// Récupérer les notifications d'un utilisateur spécifique
router.get('/user/:userId', getNotifications);

// Marquer une notification comme lue
router.patch('/:id/read', markAsRead);

// Marquer toutes les notifications comme lues
router.patch('/read-all', markAsRead);

// Marquer toutes les notifications d'un utilisateur comme lues
router.patch('/user/:userId/read-all', markAsRead);

// Supprimer une notification
router.delete('/:id', deleteNotification);

export default router; 