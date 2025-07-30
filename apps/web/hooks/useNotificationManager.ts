import { useEffect, useRef } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import notificationService from '../services/notificationService';

interface UseNotificationManagerProps {
  userId: string;
  products: any[];
  orders: any[];
  users: any[];
}

export const useNotificationManager = ({ userId, products, orders, users }: UseNotificationManagerProps) => {
  const queryClient = useQueryClient();
  const lastProcessedData = useRef<{
    productsCount: number;
    ordersCount: number;
    usersCount: number;
  }>({ productsCount: 0, ordersCount: 0, usersCount: 0 });

  useEffect(() => {
    if (!userId || !products || !orders || !users) return;

    const currentData = {
      productsCount: products.length,
      ordersCount: orders.length,
      usersCount: users.length,
    };

    const previousData = lastProcessedData.current;

    // Vérifier les nouvelles commandes
    if (currentData.ordersCount > previousData.ordersCount) {
      const newOrders = orders.slice(previousData.ordersCount);
      newOrders.forEach(async (order) => {
        try {
          const totalItems = order.products?.reduce((sum: number, product: any) => sum + (product.qty || 0), 0) || 0;
          
          await notificationService.createNotification({
            userId,
            type: 'order',
            title: `Nouvelle commande #${order._id.slice(-8)}`,
            message: `${totalItems} article${totalItems > 1 ? 's' : ''} - Total: ${order.total.toFixed(2)}€`,
            metadata: {
              orderId: order._id,
              amount: order.total,
            },
          });
        } catch (error) {
          console.error('Erreur création notification commande:', error);
        }
      });
    }

    // Vérifier les nouveaux utilisateurs (exclure admin)
    if (currentData.usersCount > previousData.usersCount) {
      const newUsers = users.slice(previousData.usersCount).filter((user: any) => user.role !== 'admin');
      newUsers.forEach(async (user) => {
        try {
          await notificationService.createNotification({
            userId,
            type: 'user',
            title: 'Nouvel utilisateur inscrit',
            message: `${user.name} s'est inscrit sur la plateforme`,
            metadata: {
              userId: user._id,
            },
          });
        } catch (error) {
          console.error('Erreur création notification utilisateur:', error);
        }
      });
    }

    // Vérifier les produits en rupture de stock (simulation)
    const lowStockProducts = products.filter((product: any) => product.price > 80);
    if (lowStockProducts.length > 0) {
      lowStockProducts.slice(0, 1).forEach(async (product) => {
        try {
          await notificationService.createNotification({
            userId,
            type: 'stock',
            title: 'Alerte stock',
            message: `Le produit "${product.name}" est en rupture de stock`,
            metadata: {
              productId: product._id,
            },
          });
        } catch (error) {
          console.error('Erreur création notification stock:', error);
        }
      });
    }

    // Mettre à jour les données traitées
    lastProcessedData.current = currentData;

    // Invalider le cache des notifications pour forcer le rafraîchissement
    queryClient.invalidateQueries({ queryKey: ['notifications', userId] });
  }, [userId, products, orders, users, queryClient]);
}; 