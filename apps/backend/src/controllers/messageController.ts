import { Request, Response } from 'express';
import { Message, IMessage } from '../models/Message';
import User from '../models/User';
import { emailService } from '../services/emailService';
import { io, sendNotification } from '../index';
import { addDynamicNotification } from './notificationController';
import { MessageGroup, MessageNotification } from '../types/message.types';

// Fonction pour diffuser un message en temps réel
const broadcastMessage = (userId: string, message: IMessage) => {
  
  try {
    io.to(`conversation-${userId}`).emit('new-message', message);
    console.log('✅ Message diffusé en temps réel à:', userId);
  } catch (error) {
    console.error('❌ Erreur lors de la diffusion WebSocket:', error);
  }
};

// Récupérer tous les messages (pour l'admin)
export const getAllMessages = async (req: Request, res: Response) => {
  try {
    const messages = await Message.find()
      .sort({ createdAt: -1 })
      .populate('userId', 'name email')
      .limit(100);

    // Grouper par utilisateur
    const messagesByUser = messages.reduce((acc, message) => {
      // S'assurer que userId est toujours une string simple
      let userId: string;
      if (typeof message.userId === 'object' && message.userId !== null) {
        // Si c'est un objet (populate), prendre l'ID
        userId = (
          typeof message.userId === 'object' && message.userId !== null && '_id' in message.userId
            ? String((message.userId as { _id: unknown })._id)
            : String(message.userId)
        );
      } else {
        // Si c'est déjà une string ou un ObjectId
        userId = String(message.userId);
      }
      
      if (!acc[userId]) {
        acc[userId] = {
          userId: userId, // Toujours une string simple
          userEmail: message.userEmail,
          userName: message.userName,
          messages: [],
          unreadCount: 0
        };
      }
      acc[userId].messages.push(message);
      if (message.isFromUser && !message.isRead) {
        acc[userId].unreadCount++;
      }
      return acc;
    }, {} as Record<string, MessageGroup>);

    res.json(Object.values(messagesByUser));
  } catch (error) {
    console.error('Erreur lors de la récupération des messages:', error);
    res.status(500).json({ message: 'Erreur serveur' });
  }
};

// Récupérer les messages d'un utilisateur spécifique
export const getMessagesByUser = async (req: Request, res: Response) => {
  try {
    const { userId } = req.params;
    
    const messages = await Message.find({ userId })
      .sort({ createdAt: 1 })
      .limit(50);

    res.json(messages);
  } catch (error) {
    console.error('Erreur lors de la récupération des messages:', error);
    res.status(500).json({ message: 'Erreur serveur' });
  }
};

// Envoyer un message depuis l'utilisateur
export const sendUserMessage = async (req: Request, res: Response) => {
  try {
    const { content } = req.body;
    const userId = req.user?.id;

    if (!userId) {
      return res.status(401).json({ message: 'Utilisateur non authentifié' });
    }

    if (!content || content.trim().length === 0) {
      return res.status(400).json({ message: 'Le contenu du message est requis' });
    }

    // Récupérer les informations de l'utilisateur
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'Utilisateur non trouvé' });
    }

    const message = new Message({
      userId,
      userEmail: user.email,
      userName: user.name,
      content: content.trim(),
      isFromUser: true,
      isRead: false
    });

    await message.save();

    // Diffuser le message via WebSocket pour le temps réel
    try {
      io.emit('new-message', {
        userId: message.userId,
        message: message,
        userEmail: user.email,
        userName: user.name
      });
      console.log('✅ Message utilisateur diffusé via WebSocket');
    } catch (error) {
      console.error('❌ Erreur lors de la diffusion WebSocket:', error);
    }

    // Créer une notification pour l'administrateur
    try {
      const admin = await User.findOne({ role: 'admin' });
      if (admin) {
        const notification: MessageNotification = {
          _id: `message-${message._id}`,
          userId: (admin._id as string).toString(),
          title: "Nouveau message de support",
          message: `Message de ${user.name} (${user.email})`,
          createdAt: new Date().toISOString(),
          isRead: false,
          type: 'activity',
          metadata: {
            messageId: (message._id as string).toString(),
            userId: userId,
            userName: user.name,
            userEmail: user.email
          }
        };
        
        sendNotification((admin._id as string).toString(), notification);
        addDynamicNotification(notification);
        console.log("✅ Notification de message envoyée à l'administrateur");
      } else {
        console.log("⚠️ Aucun administrateur trouvé pour les notifications de messages");
      }
    } catch (notificationError) {
      console.error("❌ Erreur lors de l'envoi de la notification de message:", notificationError);
    }

    res.status(201).json(message);
  } catch (error) {
    console.error('Erreur lors de l\'envoi du message:', error);
    res.status(500).json({ message: 'Erreur serveur' });
  }
};

// Répondre à un message (admin vers utilisateur)
export const sendAdminReply = async (req: Request, res: Response) => {
  try {
    const { userId, content } = req.body;

    console.log('🔍 sendAdminReply - userId reçu:', userId);
    console.log('🔍 sendAdminReply - type de userId:', typeof userId);

    if (!content || content.trim().length === 0) {
      return res.status(400).json({ message: 'Le contenu du message est requis' });
    }

    // Traiter le userId - peut être un objet stringifié ou une string simple
    let actualUserId: string;
    if (typeof userId === 'string') {
      // Si c'est un objet JavaScript avec new ObjectId(), extraire l'ID
      if (userId.includes('new ObjectId(')) {
        const match = userId.match(/new ObjectId\('([^']+)'\)/);
        if (match) {
          actualUserId = match[1];
          console.log('🔍 userId extrait depuis ObjectId:', actualUserId);
        } else {
          actualUserId = userId;
        }
      } else if (userId.startsWith('{')) {
        // Si c'est un objet JSON stringifié, essayer de le parser
        try {
          const parsed = JSON.parse(userId);
          actualUserId = parsed._id || parsed.id || userId;
          console.log('🔍 userId parsé depuis JSON:', actualUserId);
        } catch (parseError) {
          console.error('❌ Erreur lors du parsing de userId:', parseError);
          actualUserId = userId;
        }
      } else {
        actualUserId = userId;
      }
    } else {
      actualUserId = userId?.toString() || '';
    }

    console.log('🔍 userId final utilisé:', actualUserId);

    if (!actualUserId) {
      return res.status(400).json({ message: 'userId invalide' });
    }

    // Récupérer les informations de l'utilisateur
    const user = await User.findById(actualUserId);
    if (!user) {
      return res.status(404).json({ message: 'Utilisateur non trouvé' });
    }

    const message = new Message({
      userId: actualUserId,
      userEmail: user.email,
      userName: user.name,
      content: content.trim(),
      isFromUser: false,
      isRead: false
    });

    await message.save();

    // Diffuser le message en temps réel
    broadcastMessage(actualUserId, message);
    
    // Diffuser aussi à tous les clients connectés (pour l'interface admin)
    try {
      io.emit('admin-new-message', {
        userId: actualUserId,
        message: message,
        userEmail: user.email,
        userName: user.name
      });
      console.log('✅ Message diffusé globalement pour l\'admin');
    } catch (error) {
      console.error('❌ Erreur lors de la diffusion globale:', error);
    }

    // Envoyer un email à l'utilisateur (optionnel)
    try {
      console.log('📧 Tentative d\'envoi d\'email à:', user.email);
      
      // Vérifier si les variables d'environnement email sont configurées
      if (!process.env.EMAIL_USER || !process.env.EMAIL_PASSWORD) {
        console.log('⚠️ Configuration email manquante. Email non envoyé.');
      } else {
        await emailService.sendMessageNotification({
          to: user.email,
          userName: user.name,
          message: content.trim(),
          replyUrl: `${process.env.FRONTEND_URL || 'http://localhost:3000'}/contact`
        });
        console.log('✅ Email envoyé avec succès à:', user.email);
      }
    } catch (emailError) {
      console.error('❌ Erreur lors de l\'envoi de l\'email:', emailError);
      console.log('⚠️ L\'email n\'a pas pu être envoyé, mais le message a été sauvegardé');
      // On continue même si l'email échoue - le message est déjà sauvegardé
    }

    res.status(201).json(message);
  } catch (error) {
    console.error('Erreur lors de l\'envoi de la réponse:', error);
    res.status(500).json({ message: 'Erreur serveur' });
  }
};

// Marquer les messages comme lus
export const markMessagesAsRead = async (req: Request, res: Response) => {
  try {
    const { userId } = req.params;
    
    console.log('🔍 markMessagesAsRead - userId reçu:', userId);
    console.log('🔍 markMessagesAsRead - type de userId:', typeof userId);
    
    // Si userId est un objet JSON stringifié, le parser
    let actualUserId = userId;
    if (typeof userId === 'string' && userId.startsWith('{')) {
      try {
        const parsed = JSON.parse(userId);
        actualUserId = parsed._id || parsed.id || userId;
        console.log('🔍 userId parsé:', actualUserId);
      } catch (parseError) {
        console.error('❌ Erreur lors du parsing de userId:', parseError);
        actualUserId = userId;
      }
    }
    
    console.log('🔍 userId final utilisé:', actualUserId);

    await Message.updateMany(
      { userId: actualUserId, isFromUser: true, isRead: false },
      { isRead: true }
    );

    res.json({ message: 'Messages marqués comme lus' });
  } catch (error) {
    console.error('Erreur lors du marquage des messages:', error);
    res.status(500).json({ message: 'Erreur serveur' });
  }
};

// Récupérer le nombre de messages non lus
export const getUnreadCount = async (req: Request, res: Response) => {
  try {
    const count = await Message.countDocuments({
      isFromUser: true,
      isRead: false
    });

    res.json({ unreadCount: count });
  } catch (error) {
    console.error('Erreur lors du comptage des messages:', error);
    res.status(500).json({ message: 'Erreur serveur' });
  }
}; 