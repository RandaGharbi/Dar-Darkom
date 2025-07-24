import { useQuery } from "@tanstack/react-query";

export interface Notification {
  id: string;
  text: string;
  time: string;
  read: boolean;
  type: 'order' | 'stock' | 'user' | 'system';
}

// Fonction pour récupérer les notifications depuis l'API
async function fetchNotifications(): Promise<Notification[]> {
  try {
    const response = await fetch('http://localhost:5000/api/notifications', {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`,
      },
    });
    
    if (!response.ok) {
      throw new Error('Erreur lors de la récupération des notifications');
    }
    
    return response.json();
  } catch (error) {
    console.error('Erreur fetchNotifications:', error);
    // Retourner des notifications par défaut en cas d'erreur
    return getDefaultNotifications();
  }
}

// Notifications par défaut
function getDefaultNotifications(): Notification[] {
  return [
    {
      id: "1",
      text: "Nouvelle commande reçue #12345",
      time: "Il y a 5 minutes",
      read: false,
      type: 'order'
    },
    {
      id: "2", 
      text: "Stock faible pour le produit \"Crème Hydratante\"",
      time: "Il y a 1 heure",
      read: false,
      type: 'stock'
    },
    {
      id: "3",
      text: "Nouveau client inscrit",
      time: "Il y a 2 heures",
      read: true,
      type: 'user'
    }
  ];
}

// Hook pour utiliser les notifications
export function useNotifications() {
  return useQuery<Notification[]>({
    queryKey: ["notifications"],
    queryFn: fetchNotifications,
    staleTime: 30 * 1000, // 30 secondes
    refetchInterval: 60 * 1000, // Rafraîchir toutes les minutes
    refetchOnWindowFocus: true,
  });
}

// Fonction pour marquer une notification comme lue
export async function markNotificationAsRead(notificationId: string): Promise<void> {
  try {
    await fetch(`http://localhost:5000/api/notifications/${notificationId}/read`, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`,
        'Content-Type': 'application/json',
      },
    });
  } catch (error) {
    console.error('Erreur markNotificationAsRead:', error);
  }
}

// Fonction pour marquer toutes les notifications comme lues
export async function markAllNotificationsAsRead(): Promise<void> {
  try {
    await fetch('http://localhost:5000/api/notifications/read-all', {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`,
        'Content-Type': 'application/json',
      },
    });
  } catch (error) {
    console.error('Erreur markAllNotificationsAsRead:', error);
  }
} 