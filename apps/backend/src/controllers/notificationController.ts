import { Request, Response } from 'express';

// Interface pour les notifications
interface Notification {
  _id: string;
  userId: string;
  title: string;
  message: string;
  createdAt: string;
  isRead: boolean;
  type: 'order' | 'stock' | 'user' | 'system' | 'payment' | 'product' | 'activity';
}

// Stockage en mémoire des notifications par utilisateur
let userNotifications: { [userId: string]: Notification[] } = {};

// Fonction pour ajouter une notification dynamique
export const addDynamicNotification = (notification: Notification) => {
  if (!userNotifications[notification.userId]) {
    userNotifications[notification.userId] = [];
  }
  userNotifications[notification.userId].unshift(notification);
  console.log('Notification dynamique ajoutée:', notification);
};

// Notifications de test pour un utilisateur
const generateTestNotifications = (userId: string): Notification[] => {
  if (!userNotifications[userId]) {
    // Retourner un tableau vide par défaut
    userNotifications[userId] = [];
  }
  return userNotifications[userId];
};

// Récupérer toutes les notifications d'un utilisateur
export const getNotifications = async (req: Request, res: Response) => {
  try {
    const { userId } = req.params;
    const notifications = generateTestNotifications(userId);
    const unreadCount = notifications.filter(n => !n.isRead).length;
    
    res.json({
      notifications,
      unreadCount
    });
  } catch (error) {
    console.error('Erreur lors de la récupération des notifications:', error);
    res.status(500).json({ success: false, message: 'Erreur serveur' });
  }
};

// Marquer une notification comme lue
export const markAsRead = async (req: Request, res: Response) => {
  try {
    const { id, userId } = req.params;
    
    // Vérifier si c'est pour marquer toutes les notifications d'un utilisateur
    if (req.path.includes('/user/') && req.path.includes('/read-all')) {
      console.log(`Marquage de toutes les notifications comme lues pour l'utilisateur: ${userId}`);
      
      if (userNotifications[userId]) {
        userNotifications[userId].forEach(notification => {
          notification.isRead = true;
        });
      }
      
      res.json({ success: true, message: 'Toutes les notifications marquées comme lues' });
    } else if (id === 'read-all') {
      // Marquer toutes les notifications comme lues (route générale)
      console.log('Marquage de toutes les notifications comme lues');
      
      Object.keys(userNotifications).forEach(userId => {
        userNotifications[userId].forEach(notification => {
          notification.isRead = true;
        });
      });
      
      res.json({ success: true, message: 'Toutes les notifications marquées comme lues' });
    } else {
      // Marquer une notification spécifique comme lue
      console.log(`Marquage de la notification ${id} comme lue`);
      
      // Chercher la notification dans tous les utilisateurs
      Object.keys(userNotifications).forEach(userId => {
        const notification = userNotifications[userId].find(n => n._id === id);
        if (notification) {
          notification.isRead = true;
        }
      });
      
      res.json({ success: true, message: 'Notification marquée comme lue' });
    }
  } catch (error) {
    console.error('Erreur lors du marquage de la notification:', error);
    res.status(500).json({ success: false, message: 'Erreur serveur' });
  }
};

// Supprimer une notification
export const deleteNotification = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    
    // Supprimer la notification de tous les utilisateurs
    Object.keys(userNotifications).forEach(userId => {
      userNotifications[userId] = userNotifications[userId].filter(n => n._id !== id);
    });
    
    res.json({ success: true, message: 'Notification supprimée' });
  } catch (error) {
    console.error('Erreur lors de la suppression de la notification:', error);
    res.status(500).json({ success: false, message: 'Erreur serveur' });
  }
}; 