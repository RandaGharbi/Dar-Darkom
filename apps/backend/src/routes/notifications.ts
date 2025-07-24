import express from 'express';
import { getNotifications, markAsRead, deleteNotification } from '../controllers/notificationController';
import { auth } from '../middleware/auth';

const router = express.Router();

// Routes protégées par authentification
router.use(auth);

// Récupérer toutes les notifications
router.get('/', getNotifications);

// Marquer une notification comme lue
router.put('/:id/read', markAsRead);

// Marquer toutes les notifications comme lues
router.put('/read-all', markAsRead);

// Supprimer une notification
router.delete('/:id', deleteNotification);

export default router; 