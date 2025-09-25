import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import SafeAreaWrapper from '../../components/SafeAreaWrapper';
import LiveTrackingMap from '../../components/LiveTrackingMap';
import OrderNotificationBanner from '../../components/OrderNotificationBanner';
import { useOrderTracking } from '../../hooks/useOrderTracking';
import { OrientalColors } from '../../constants/Colors';

interface OrderStatus {
  id: string;
  status: 'confirmed' | 'received' | 'preparing' | 'ready' | 'out_for_delivery' | 'delivered';
  estimatedTime?: string;
  driverName?: string;
  driverPhone?: string;
  storePhone?: string;
  qrScanned?: boolean;
  chatEnabled?: boolean;
}

export default function OrderStatusScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { orderId } = useLocalSearchParams<{ orderId: string }>();

  const { orderData, isConnected, isLoading, error, refreshOrder } = useOrderTracking(orderId || '');
  
  // État pour la notification
  const [showNotification, setShowNotification] = useState(false);
  const [notificationMessage, setNotificationMessage] = useState('');
  const [previousStatus, setPreviousStatus] = useState<string>('');

  // Détecter les changements de statut pour afficher la notification
  useEffect(() => {
    console.log('📱 Statut de commande:', {
      current: orderData?.status,
      previous: previousStatus,
      orderId: orderData?.orderId
    });
    
    if (orderData?.status && previousStatus && previousStatus !== orderData.status) {
      console.log('📱 Changement de statut détecté:', previousStatus, '→', orderData.status);
      
      // Si le statut passe de 'confirmed' à 'preparing', c'est que l'admin a accepté
      if (previousStatus === 'confirmed' && orderData.status === 'preparing') {
        console.log('📱 Notification: Commande acceptée par admin');
        setNotificationMessage('Dar Darkom is preparing your order.');
        setShowNotification(true);
      }
      // Si le statut passe de 'preparing' à 'ready', c'est que la commande est prête
      else if (previousStatus === 'preparing' && orderData.status === 'ready') {
        console.log('📱 Notification: Commande prête');
        setNotificationMessage('Your order is ready for pickup.');
        setShowNotification(true);
      }
      // Si le statut passe de 'ready' à 'out_for_delivery', c'est que la commande est en route
      else if (previousStatus === 'ready' && orderData.status === 'out_for_delivery') {
        console.log('📱 Notification: Commande en route');
        setNotificationMessage('Your order is on its way.');
        setShowNotification(true);
      }
    }
    
    // Mettre à jour le statut précédent
    if (orderData?.status) {
      setPreviousStatus(orderData.status);
    }
  }, [orderData?.status, previousStatus]);

  const getStatusConfig = (status: string) => {
    switch (status) {
      case 'confirmed':
        return {
          title: 'Hang tight...',
          subtitle: 'Your order has been confirmed',
          icon: 'checkmark-circle',
          color: '#4CAF50',
          showMap: false,
          showChat: false,
        };
      case 'received':
        return {
          title: 'Order received',
          subtitle: 'We\'ve got your order',
          icon: 'bag',
          color: '#FF9800',
          showMap: false,
          showChat: false,
        };
      case 'preparing':
        return {
          title: 'Preparing your order...',
          subtitle: 'Estimated arrival 12:05-12:25',
          icon: 'restaurant',
          color: '#FF9800',
          showMap: false,
          showChat: false,
        };
      case 'ready':
        return {
          title: 'Heading your way...',
          subtitle: 'Your order is on its way',
          icon: 'car',
          color: '#2196F3',
          showMap: false,
          showChat: false,
        };
      case 'out_for_delivery':
        return {
          title: 'Heading your way...',
          subtitle: orderData?.qrScanned ? 'once QR code is scanned' : 'Your order is on its way',
          icon: 'car',
          color: '#2196F3',
          showMap: orderData?.qrScanned || false,
          showChat: orderData?.chatEnabled || false,
        };
      case 'delivered':
        return {
          title: 'Enjoy your order',
          subtitle: 'Thank you for choosing us!',
          icon: 'checkmark-circle',
          color: '#4CAF50',
          showMap: false,
          showChat: false,
        };
      default:
        return {
          title: 'Processing...',
          subtitle: 'Please wait',
          icon: 'time',
          color: '#666',
          showMap: false,
          showChat: false,
        };
    }
  };

  const handleCallStore = () => {
    // Pour l'instant, on utilise un numéro fixe
    const storePhone = '+0987654321';
    Alert.alert(
      'Call Store',
      `Call the store at ${storePhone}?`,
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Call', onPress: () => {
          // Implémenter l'appel téléphonique
          console.log('Calling store:', storePhone);
        }}
      ]
    );
  };

  const handleChatWithDriver = () => {
    if (orderData?.chatEnabled) {
      router.push(`/chat/${orderId}`);
    }
  };

  if (isLoading) {
    return (
      <SafeAreaWrapper backgroundColor="#f5f5f5" edges={['top']}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={OrientalColors.primary} />
          <Text style={styles.loadingText}>Loading order status...</Text>
        </View>
      </SafeAreaWrapper>
    );
  }

  if (error || !orderData) {
    return (
      <SafeAreaWrapper backgroundColor="#f5f5f5" edges={['top']}>
        <View style={styles.errorContainer}>
          <Ionicons name="alert-circle" size={48} color={OrientalColors.error} />
          <Text style={styles.errorText}>{error || 'Unable to load order status'}</Text>
          <TouchableOpacity style={styles.retryButton} onPress={refreshOrder}>
            <Text style={styles.retryButtonText}>Retry</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaWrapper>
    );
  }

  const config = getStatusConfig(orderData.status);

  return (
    <SafeAreaWrapper backgroundColor="#f5f5f5" edges={['top']}>
      <View style={styles.container}>
        {/* Notification Banner */}
        <OrderNotificationBanner
          visible={showNotification}
          storeName="Dar Darkom"
          message={notificationMessage}
          onClose={() => setShowNotification(false)}
        />

        {/* Header */}
        <View style={[styles.header, { paddingTop: insets.top + 8 }]}>
          <TouchableOpacity 
            style={styles.backButton} 
            onPress={() => router.back()}
          >
            <Ionicons name="arrow-back" size={24} color="#333" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Order Status</Text>
          <View style={styles.placeholder} />
        </View>

        {/* Status Content */}
        <View style={styles.content}>
          {/* Status Icon and Title */}
          <View style={styles.statusSection}>
            {/* Icônes de cuisine pour le statut "preparing" */}
            {orderData.status === 'preparing' ? (
              <View style={styles.cookingIcons}>
                <View style={styles.cookingIcon}>
                  <Ionicons name="restaurant" size={24} color="#8B5CF6" />
                </View>
                <View style={styles.cookingIcon}>
                  <Ionicons name="wine" size={20} color="#D97706" />
                </View>
                <View style={styles.cookingIcon}>
                  <Ionicons name="flask" size={18} color="#F59E0B" />
                </View>
              </View>
            ) : (
              <View style={[styles.statusIcon, { backgroundColor: config.color }]}>
                <Ionicons name={config.icon as any} size={32} color="#fff" />
              </View>
            )}
            
            <Text style={styles.statusTitle}>{config.title}</Text>
            <Text style={styles.statusSubtitle}>{config.subtitle}</Text>
            
            {orderData.estimatedTime && orderData.status !== 'preparing' && (
              <Text style={styles.estimatedTime}>
                Estimated arrival: {orderData.estimatedTime}
              </Text>
            )}
          </View>

          {/* Map Section - Only show if QR code is scanned */}
          {config.showMap && (
            <View style={styles.mapSection}>
              <LiveTrackingMap
                driverLocation={orderData.driverLocation}
                driverName={orderData.driverInfo?.name}
                estimatedTime={orderData.estimatedTime}
                onRefresh={refreshOrder}
              />
            </View>
          )}

          {/* Chat Section - Only show if chat is enabled */}
          {config.showChat && (
            <View style={styles.chatSection}>
              <TouchableOpacity 
                style={styles.chatButton}
                onPress={handleChatWithDriver}
              >
                <View style={styles.chatHeader}>
                  <Text style={styles.chatTitle}>Message From Driver</Text>
                  <View style={styles.chatBadge}>
                    <Text style={styles.chatBadgeText}>Push notifications check</Text>
                  </View>
                </View>
                <View style={styles.chatInput}>
                  <Text style={styles.chatPlaceholder}>Message...</Text>
                </View>
              </TouchableOpacity>
            </View>
          )}

          {/* Help Section */}
          <View style={styles.helpSection}>
            <View style={styles.helpHeader}>
              <View style={styles.basketIcon}>
                <Ionicons name="basket" size={24} color="#8B4513" />
                <View style={styles.notificationBadge}>
                  <Ionicons name="chatbubble" size={12} color="#fff" />
                </View>
              </View>
              <Text style={styles.helpTitle}>Need help?</Text>
            </View>
            <Text style={styles.helpDescription}>
              Shop staff will deliver your order, so order tracking isn't as detailed. 
              You can call the shop for more information about your delivery.
            </Text>
            <TouchableOpacity 
              style={styles.callButton}
              onPress={handleCallStore}
            >
              <Ionicons name="call" size={18} color="#000" />
              <Text style={styles.callButtonText}>Call store</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </SafeAreaWrapper>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingBottom: 16,
    backgroundColor: '#f5f5f5',
  },
  backButton: {
    padding: 8,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
  },
  placeholder: {
    width: 40,
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: '#666',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorText: {
    fontSize: 16,
    color: '#666',
    marginTop: 16,
    textAlign: 'center',
  },
  retryButton: {
    backgroundColor: OrientalColors.primary,
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
    marginTop: 16,
  },
  retryButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  statusSection: {
    alignItems: 'center',
    paddingVertical: 40,
  },
  statusIcon: {
    width: 80,
    height: 80,
    borderRadius: 40,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  cookingIcons: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
    gap: 16,
  },
  cookingIcon: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  statusTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    textAlign: 'center',
    marginBottom: 8,
  },
  statusSubtitle: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginBottom: 16,
  },
  estimatedTime: {
    fontSize: 14,
    color: '#999',
    textAlign: 'center',
  },
  mapSection: {
    marginTop: 20,
  },
  mapTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginBottom: 12,
  },
  mapContainer: {
    height: 200,
    borderRadius: 12,
    overflow: 'hidden',
    backgroundColor: '#fff',
  },
  mapPlaceholder: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f8f9fa',
  },
  mapPlaceholderText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginTop: 12,
  },
  mapSubtext: {
    fontSize: 14,
    color: '#666',
    marginTop: 8,
  },
  chatSection: {
    marginTop: 20,
  },
  chatButton: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  chatHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  chatTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  chatBadge: {
    backgroundColor: '#e3f2fd',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  chatBadgeText: {
    fontSize: 12,
    color: '#1976d2',
    fontWeight: '500',
  },
  chatInput: {
    backgroundColor: '#f5f5f5',
    borderRadius: 8,
    padding: 12,
  },
  chatPlaceholder: {
    fontSize: 16,
    color: '#999',
  },
  helpSection: {
    marginTop: 40,
    alignItems: 'center',
  },
  helpHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  basketIcon: {
    position: 'relative',
    marginRight: 12,
  },
  notificationBadge: {
    position: 'absolute',
    bottom: -2,
    right: -2,
    width: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: '#007AFF',
    justifyContent: 'center',
    alignItems: 'center',
  },
  helpTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000',
  },
  helpDescription: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: 20,
    paddingHorizontal: 20,
  },
  callButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F5F5F5',
    paddingHorizontal: 24,
    paddingVertical: 16,
    borderRadius: 12,
  },
  callButtonText: {
    color: '#000',
    fontSize: 16,
    fontWeight: '500',
    marginLeft: 8,
  },
});
