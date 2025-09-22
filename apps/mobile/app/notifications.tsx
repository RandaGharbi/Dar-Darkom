import React, { useState, useEffect, useCallback } from 'react';
import { StyleSheet, View, Text, ScrollView, TouchableOpacity, RefreshControl, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useSafeNavigation } from '../hooks/useSafeNavigation';
import SafeAreaWrapper from '../components/SafeAreaWrapper';
import notificationService, { Notification } from '../services/notificationService';

export default function NotificationsScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { safeBack } = useSafeNavigation();
  
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [unreadCount, setUnreadCount] = useState(0);

  // Charger les notifications
  const loadNotifications = useCallback(async (pageNum: number = 1, reset: boolean = false) => {
    try {
      const response = await notificationService.getNotifications(pageNum, 20, false);
      
      if (reset) {
        setNotifications(response.notifications);
      } else {
        setNotifications(prev => [...prev, ...response.notifications]);
      }
      
      setHasMore(response.hasMore);
      setPage(pageNum);
      
      // Compter les notifications non lues
      const unreadResponse = await notificationService.getNotifications(1, 100, true);
      setUnreadCount(unreadResponse.total);
    } catch (error) {
      console.error('Erreur lors du chargement des notifications:', error);
      Alert.alert('Erreur', 'Impossible de charger les notifications');
    } finally {
      setIsLoading(false);
      setRefreshing(false);
    }
  }, []);

  // Charger au montage
  useEffect(() => {
    loadNotifications(1, true);
  }, [loadNotifications]);

  // Rafraîchir
  const onRefresh = useCallback(() => {
    setRefreshing(true);
    loadNotifications(1, true);
  }, [loadNotifications]);

  // Charger plus
  const loadMore = useCallback(() => {
    if (hasMore && !isLoading) {
      loadNotifications(page + 1, false);
    }
  }, [hasMore, isLoading, page, loadNotifications]);

  // Marquer comme lu
  const markAsRead = async (notification: Notification) => {
    if (notification.read) return;
    
    try {
      await notificationService.markAsRead(notification._id);
      setNotifications(prev => 
        prev.map(n => 
          n._id === notification._id ? { ...n, read: true } : n
        )
      );
      setUnreadCount(prev => Math.max(0, prev - 1));
    } catch (error) {
      console.error('Erreur lors du marquage:', error);
    }
  };

  // Supprimer une notification
  const deleteNotification = async (notification: Notification) => {
    Alert.alert(
      'Supprimer la notification',
      'Êtes-vous sûr de vouloir supprimer cette notification ?',
      [
        { text: 'Annuler', style: 'cancel' },
        {
          text: 'Supprimer',
          style: 'destructive',
          onPress: async () => {
            try {
              await notificationService.deleteNotification(notification._id);
              setNotifications(prev => prev.filter(n => n._id !== notification._id));
              if (!notification.read) {
                setUnreadCount(prev => Math.max(0, prev - 1));
              }
            } catch (error) {
              console.error('Erreur lors de la suppression:', error);
              Alert.alert('Erreur', 'Impossible de supprimer la notification');
            }
          }
        }
      ]
    );
  };

  // Marquer toutes comme lues
  const markAllAsRead = async () => {
    try {
      await notificationService.markAllAsRead();
      setNotifications(prev => prev.map(n => ({ ...n, read: true })));
      setUnreadCount(0);
    } catch (error) {
      console.error('Erreur lors du marquage:', error);
      Alert.alert('Erreur', 'Impossible de marquer toutes les notifications comme lues');
    }
  };

  // Supprimer toutes les lues
  const deleteReadNotifications = async () => {
    Alert.alert(
      'Supprimer les notifications lues',
      'Êtes-vous sûr de vouloir supprimer toutes les notifications lues ?',
      [
        { text: 'Annuler', style: 'cancel' },
        {
          text: 'Supprimer',
          style: 'destructive',
          onPress: async () => {
            try {
              await notificationService.deleteReadNotifications();
              setNotifications(prev => prev.filter(n => !n.read));
            } catch (error) {
              console.error('Erreur lors de la suppression:', error);
              Alert.alert('Erreur', 'Impossible de supprimer les notifications');
            }
          }
        }
      ]
    );
  };

  // Créer une notification de test
  const createTestNotification = async () => {
    try {
      const notification = await notificationService.createTestNotification(
        'general',
        'Test de notification',
        'Ceci est une notification de test créée depuis l\'application'
      );
      setNotifications(prev => [notification, ...prev]);
      setUnreadCount(prev => prev + 1);
    } catch (error) {
      console.error('Erreur lors de la création:', error);
      Alert.alert('Erreur', 'Impossible de créer la notification de test');
    }
  };

  // Obtenir l'icône selon le type
  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'order_update':
        return 'receipt-outline';
      case 'promotion':
        return 'gift-outline';
      case 'delivery_update':
        return 'bicycle-outline';
      case 'system':
        return 'settings-outline';
      default:
        return 'notifications-outline';
    }
  };

  // Obtenir la couleur selon le type
  const getNotificationColor = (type: string) => {
    switch (type) {
      case 'order_update':
        return '#2E86AB';
      case 'promotion':
        return '#FF6B35';
      case 'delivery_update':
        return '#4CAF50';
      case 'system':
        return '#9C27B0';
      default:
        return '#666';
    }
  };

  // Formater la date
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    
    if (diff < 60000) { // Moins d'1 minute
      return 'À l\'instant';
    } else if (diff < 3600000) { // Moins d'1 heure
      const minutes = Math.floor(diff / 60000);
      return `Il y a ${minutes} min`;
    } else if (diff < 86400000) { // Moins d'1 jour
      const hours = Math.floor(diff / 3600000);
      return `Il y a ${hours}h`;
    } else {
      return date.toLocaleDateString('fr-FR', {
        day: 'numeric',
        month: 'short',
        hour: '2-digit',
        minute: '2-digit'
      });
    }
  };

  if (isLoading && notifications.length === 0) {
    return (
      <SafeAreaWrapper backgroundColor="#fff" edges={['top']}>
        <View style={styles.loadingContainer}>
          <Text style={styles.loadingText}>Chargement des notifications...</Text>
        </View>
      </SafeAreaWrapper>
    );
  }

  return (
    <SafeAreaWrapper backgroundColor="#fff" edges={['top']}>
      {/* Header */}
      <View style={[styles.header, { paddingTop: insets.top }]}>
        <TouchableOpacity style={styles.backButton} onPress={safeBack}>
          <Ionicons name="arrow-back" size={24} color="#333" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Notifications</Text>
        <View style={styles.headerActions}>
          {unreadCount > 0 && (
            <TouchableOpacity style={styles.actionButton} onPress={markAllAsRead}>
              <Ionicons name="checkmark-done" size={20} color="#2E86AB" />
            </TouchableOpacity>
          )}
          <TouchableOpacity style={styles.actionButton} onPress={createTestNotification}>
            <Ionicons name="add" size={20} color="#2E86AB" />
          </TouchableOpacity>
        </View>
      </View>

      {/* Actions rapides */}
      {notifications.length > 0 && (
        <View style={styles.quickActions}>
          <TouchableOpacity style={styles.quickAction} onPress={markAllAsRead}>
            <Ionicons name="checkmark-done" size={16} color="#2E86AB" />
            <Text style={styles.quickActionText}>Tout marquer comme lu</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.quickAction} onPress={deleteReadNotifications}>
            <Ionicons name="trash" size={16} color="#FF3B30" />
            <Text style={styles.quickActionText}>Supprimer les lues</Text>
          </TouchableOpacity>
        </View>
      )}

      <ScrollView 
        style={styles.container}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor="#2E86AB"
            colors={['#2E86AB']}
          />
        }
        onScroll={({ nativeEvent }) => {
          const { layoutMeasurement, contentOffset, contentSize } = nativeEvent;
          const isCloseToBottom = layoutMeasurement.height + contentOffset.y >= contentSize.height - 20;
          if (isCloseToBottom && hasMore && !isLoading) {
            loadMore();
          }
        }}
        scrollEventThrottle={400}
      >
        {notifications.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Ionicons name="notifications-off" size={64} color="#ccc" />
            <Text style={styles.emptyTitle}>Aucune notification</Text>
            <Text style={styles.emptyText}>Vous n'avez pas encore de notifications</Text>
            <TouchableOpacity style={styles.testButton} onPress={createTestNotification}>
              <Text style={styles.testButtonText}>Créer une notification de test</Text>
            </TouchableOpacity>
          </View>
        ) : (
          notifications.map((notification) => (
            <TouchableOpacity
              key={notification._id}
              style={[
                styles.notificationItem,
                !notification.read && styles.unreadNotification
              ]}
              onPress={() => markAsRead(notification)}
              onLongPress={() => deleteNotification(notification)}
            >
              <View style={styles.notificationLeft}>
                <View style={[
                  styles.notificationIcon,
                  { backgroundColor: getNotificationColor(notification.type) + '20' }
                ]}>
                  <Ionicons 
                    name={getNotificationIcon(notification.type)} 
                    size={20} 
                    color={getNotificationColor(notification.type)} 
                  />
                </View>
                <View style={styles.notificationContent}>
                  <Text style={[
                    styles.notificationTitle,
                    !notification.read && styles.unreadText
                  ]}>
                    {notification.title}
                  </Text>
                  <Text style={styles.notificationMessage}>
                    {notification.message}
                  </Text>
                  <Text style={styles.notificationTime}>
                    {formatDate(notification.createdAt)}
                  </Text>
                </View>
              </View>
              <View style={styles.notificationRight}>
                {!notification.read && <View style={styles.unreadDot} />}
                <Ionicons name="chevron-forward" size={16} color="#ccc" />
              </View>
            </TouchableOpacity>
          ))
        )}
      </ScrollView>
    </SafeAreaWrapper>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    fontSize: 16,
    color: '#666',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E5E5',
  },
  backButton: {
    padding: 8,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  headerActions: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  actionButton: {
    padding: 8,
    marginLeft: 8,
  },
  quickActions: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    marginHorizontal: 16,
    marginTop: 16,
    borderRadius: 12,
    padding: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  quickAction: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 8,
  },
  quickActionText: {
    fontSize: 14,
    color: '#666',
    marginLeft: 6,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 60,
    paddingHorizontal: 40,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginTop: 16,
    marginBottom: 8,
  },
  emptyText: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginBottom: 24,
  },
  testButton: {
    backgroundColor: '#2E86AB',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  testButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  notificationItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    marginHorizontal: 16,
    marginVertical: 4,
    padding: 16,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 1,
  },
  unreadNotification: {
    borderLeftWidth: 4,
    borderLeftColor: '#2E86AB',
  },
  notificationLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  notificationIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  notificationContent: {
    flex: 1,
  },
  notificationTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 4,
  },
  unreadText: {
    fontWeight: 'bold',
  },
  notificationMessage: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
    lineHeight: 20,
  },
  notificationTime: {
    fontSize: 12,
    color: '#999',
  },
  notificationRight: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  unreadDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#2E86AB',
    marginRight: 8,
  },
});
