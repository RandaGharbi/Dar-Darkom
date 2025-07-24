import { Request, Response } from 'express';

// Récupérer toutes les notifications d'un utilisateur
export const getNotifications = async (req: Request, res: Response) => {
  try {
    // Retourner un tableau vide pour l'instant
    res.json({ success: true, data: [] });
  } catch (error) {
    console.error('Erreur lors de la récupération des notifications:', error);
    res.status(500).json({ success: false, message: 'Erreur serveur' });
  }
};

// Marquer une notification comme lue
export const markAsRead = async (req: Request, res: Response) => {
  try {
    res.json({ success: true, message: 'Notification marquée comme lue' });
  } catch (error) {
    console.error('Erreur lors du marquage de la notification:', error);
    res.status(500).json({ success: false, message: 'Erreur serveur' });
  }
};

// Supprimer une notification
export const deleteNotification = async (req: Request, res: Response) => {
  try {
    res.json({ success: true, message: 'Notification supprimée' });
  } catch (error) {
    console.error('Erreur lors de la suppression de la notification:', error);
    res.status(500).json({ success: false, message: 'Erreur serveur' });
  }
}; 