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
  const response = await fetch('http://localhost:5000/api/notifications', {
    headers: {
      'Authorization': `Bearer ${localStorage.getItem('token')}`,
    },
  });
  
  if (!response.ok) {
    throw new Error('Erreur lors de la récupération des notifications');
  }
  
  return response.json();
}

// Notifications par défaut avec vraies données
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
    },
    {
      id: "4",
      text: "Mise à jour du système terminée",
      time: "Il y a 3 heures",
      read: false,
      type: 'system'
    },
    {
      id: "5",
      text: "Commande #12344 expédiée",
      time: "Il y a 4 heures",
      read: true,
      type: 'order'
    }
  ];
}

// Hook pour utiliser les notifications
export function useNotifications() {
  const token = localStorage.getItem('token');
  
  return useQuery<Notification[]>({
    queryKey: ["notifications"],
    queryFn: fetchNotifications,
    staleTime: 5 * 60 * 1000, // 5 minutes
    refetchInterval: false, // Désactiver le refetch automatique
    refetchOnWindowFocus: false, // Désactiver le refetch au focus
    enabled: !!token, // Ne pas exécuter si pas de token
    initialData: token ? undefined : getDefaultNotifications(), // Utiliser les données par défaut si pas de token
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