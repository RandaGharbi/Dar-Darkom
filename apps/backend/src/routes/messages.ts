import express from 'express';
import { auth } from '../middleware/auth';
import {
  getAllMessages,
  getMessagesByUser,
  sendUserMessage,
  sendAdminReply,
  markMessagesAsRead,
  getUnreadCount
} from '../controllers/messageController';

const router = express.Router();

// Routes pour l'admin (nécessitent une authentification)
router.get('/admin/all', auth, getAllMessages);
router.get('/admin/unread-count', auth, getUnreadCount);
router.post('/admin/reply', auth, sendAdminReply);
router.patch('/admin/mark-read/:userId', auth, markMessagesAsRead);

// Routes pour les utilisateurs
router.get('/user/:userId', auth, getMessagesByUser);
router.post('/user/send', auth, sendUserMessage);

export default router; 