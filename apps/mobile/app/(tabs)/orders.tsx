import React, { useState, useEffect, useCallback } from 'react';
import { StyleSheet, View, Text, ScrollView, TouchableOpacity, Image, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useSafeNavigation } from '../../hooks/useSafeNavigation';
import { useRouter } from 'expo-router';
import SafeAreaWrapper from '../../components/SafeAreaWrapper';
import { useAuth } from '../../context/AuthContext';
import { API_CONFIG } from '../../config/api';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface Order {
  _id: string;
  userId: string;
  products: {
    name: string;
    qty: number;
    image: string;
    price: number;
  }[];
  subtotal: number;
  shipping: number;
  tax: number;
  total: number;
  createdAt: string;
  isOrdered: boolean;
  status: 'active' | 'completed' | 'cancelled' | 'confirmed';
  shippingAddress: {
    fullName?: string;
    street: string;
    city: string;
    postalCode: string;
    country: string;
  };
  paymentMethod?: string;
  paymentIntentId?: string;
}

export default function OrdersScreen() {
  const insets = useSafeAreaInsets();
  const { safeBack } = useSafeNavigation();
  const { user } = useAuth();
  const router = useRouter();
  const [isScrolled, setIsScrolled] = useState(false);
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fonction pour récupérer les commandes depuis l'API
  const fetchOrders = useCallback(async () => {
    if (!user?._id) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);
      
      // Récupérer le token depuis AsyncStorage
      const token = await AsyncStorage.getItem('authToken');
      if (!token) {
        throw new Error('Token d\'authentification manquant');
      }
      
      const response = await fetch(`${API_CONFIG.BASE_URL}/api/orders/active/${user._id}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`Erreur HTTP: ${response.status}`);
      }

      const data = await response.json();
      console.log('📦 Commandes récupérées:', data.length);
      setOrders(data);
    } catch (err) {
      console.error('❌ Erreur lors de la récupération des commandes:', err);
      setError(err instanceof Error ? err.message : 'Erreur inconnue');
      setOrders([]);
    } finally {
      setLoading(false);
    }
  }, [user?._id]);

  // Charger les commandes au montage du composant
  useEffect(() => {
    if (user?._id) {
      fetchOrders();
    }
  }, [user?._id]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return '#E8F5E8'; // Light green background
      case 'active':
      case 'confirmed':
        return '#FFF3CD'; // Light yellow background
      case 'cancelled':
        return '#F8D7DA'; // Light red background
      default:
        return '#F8F9FA'; // Light grey background
    }
  };

  const getStatusTextColor = (status: string) => {
    switch (status) {
      case 'completed':
        return '#28A745'; // Dark green text
      case 'active':
      case 'confirmed':
        return '#856404'; // Dark yellow text
      case 'cancelled':
        return '#721C24'; // Dark red text
      default:
        return '#6C757D'; // Dark grey text
    }
  };

  const getStatusDisplayText = (status: string) => {
    switch (status) {
      case 'completed':
        return 'Livré';
      case 'active':
        return 'En cours';
      case 'confirmed':
        return 'Confirmé';
      case 'cancelled':
        return 'Annulé';
      default:
        return status;
    }
  };

  // Fonction pour formater la date
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('fr-FR', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });
  };

  // Fonction pour obtenir les images des produits
  const getOrderImages = (order: Order) => {
    if (order.products && order.products.length > 0) {
      return order.products.map(product => product.image);
    }
    return [];
  };

  const handleOrderPress = (orderId: string) => {
    router.push({
      pathname: '/order-details',
      params: { orderId }
    });
  };

  const handleScroll = (event: any) => {
    const scrollY = event.nativeEvent.contentOffset.y;
    setIsScrolled(scrollY > 10);
  };

  return (
    <SafeAreaWrapper backgroundColor="#f5f5f5" edges={['top']}>
      {/* Header sticky */}
      <View style={[
        styles.stickyHeader, 
        { top: insets.top },
        isScrolled && styles.stickyHeaderScrolled
      ]}>
        <TouchableOpacity style={styles.backButton} onPress={safeBack}>
          <Ionicons name="arrow-back" size={24} color="#333" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Historique des commandes</Text>
        <View style={styles.placeholder} />
      </View>
      
      <ScrollView 
        style={styles.container}
        contentContainerStyle={styles.scrollContent}
        bounces={false}
        showsVerticalScrollIndicator={false}
        onScroll={handleScroll}
        scrollEventThrottle={16}
      >
        {/* Loading State */}
        {loading && (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#007AFF" />
            <Text style={styles.loadingText}>Chargement des commandes...</Text>
          </View>
        )}

        {/* Error State */}
        {error && !loading && (
          <View style={styles.errorContainer}>
            <Ionicons name="alert-circle" size={48} color="#FF3B30" />
            <Text style={styles.errorTitle}>Erreur de chargement</Text>
            <Text style={styles.errorMessage}>{error}</Text>
            <TouchableOpacity style={styles.retryButton} onPress={fetchOrders}>
              <Text style={styles.retryButtonText}>Réessayer</Text>
            </TouchableOpacity>
          </View>
        )}

        {/* Empty State */}
        {!loading && !error && orders.length === 0 && (
          <View style={styles.emptyContainer}>
            <Ionicons name="receipt-outline" size={64} color="#C7C7CC" />
            <Text style={styles.emptyTitle}>Aucune commande</Text>
            <Text style={styles.emptyMessage}>Vous n&apos;avez pas encore passé de commande.</Text>
          </View>
        )}

        {/* Orders List */}
        {!loading && !error && orders.length > 0 && (
          <View style={styles.ordersList}>
            {orders.map((order) => (
              <TouchableOpacity
                key={order._id}
                style={styles.orderCard}
                onPress={() => handleOrderPress(order._id)}
              >
                <View style={styles.orderTopRow}>
                  <Text style={styles.orderNumber}>Commande #{order._id.slice(-8).toUpperCase()}</Text>
                  <View style={[styles.statusBadge, { backgroundColor: getStatusColor(order.status) }]}>
                    <Text style={[styles.statusText, { color: getStatusTextColor(order.status) }]}>
                      {getStatusDisplayText(order.status)}
                    </Text>
                  </View>
                </View>
                <View style={styles.orderBottomRow}>
                  <View style={styles.productsImagesContainer}>
                    {getOrderImages(order).slice(0, 3).map((image, index) => (
                      <Image
                        key={index}
                        source={{ uri: image }}
                        style={[
                          styles.orderImage,
                          index > 0 && styles.additionalImage
                        ]}
                        resizeMode="cover"
                      />
                    ))}
                    {order.products.length > 3 && (
                      <View style={[styles.orderImage, styles.moreProductsOverlay]}>
                        <Text style={styles.moreProductsText}>+{order.products.length - 3}</Text>
                      </View>
                    )}
                  </View>
                  <View style={styles.orderDetails}>
                    <Text style={styles.orderDate}>Date: {formatDate(order.createdAt)}</Text>
                    <Text style={styles.orderTotal}>Total: {order.total.toFixed(2)} €</Text>
                    <Text style={styles.orderProducts}>
                      {order.products.length} produit{order.products.length > 1 ? 's' : ''}
                    </Text>
                  </View>
                  <Ionicons name="chevron-forward" size={16} color="#666" style={styles.chevron} />
                </View>
              </TouchableOpacity>
            ))}
          </View>
        )}
      </ScrollView>
    </SafeAreaWrapper>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  scrollContent: {
    flexGrow: 1,
    backgroundColor: '#f5f5f5',
    paddingTop: 100, // Espace pour le header sticky + safe area
    paddingBottom: 100, // Espace pour la tabBar
  },
  stickyHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 16,
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 1000,
  },
  stickyHeaderScrolled: {
    backgroundColor: '#f5f5f5',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: '#fff',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  backButton: {
    padding: 8,
  },
  headerTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  placeholder: {
    width: 40,
  },
  ordersList: {
    paddingHorizontal: 16,
    paddingTop: 20,
  },
  orderCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 20,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.05,
    shadowRadius: 1,
    elevation: 1,
  },
  orderTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  orderBottomRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  orderImage: {
    width: 70,
    height: 70,
    borderRadius: 8,
  },
  productsImagesContainer: {
    flexDirection: 'row',
    marginRight: 16,
    position: 'relative',
  },
  additionalImage: {
    marginLeft: -20,
    borderWidth: 2,
    borderColor: '#fff',
    zIndex: 1,
  },
  moreProductsOverlay: {
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: -20,
    zIndex: 2,
  },
  moreProductsText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold',
  },
  orderDetails: {
    flex: 1,
  },
  orderNumber: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#333',
  },
  orderDate: {
    fontSize: 12,
    color: '#666',
    marginBottom: 2,
  },
  orderTotal: {
    fontSize: 12,
    color: '#000',
    fontWeight: 'bold',
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
    opacity: 0.8,
  },
  statusText: {
    fontSize: 10,
    fontWeight: 'bold',
  },
  chevron: {
    marginLeft: 8,
  },
  // Loading styles
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 60,
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: '#666',
  },
  // Error styles
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 60,
    paddingHorizontal: 20,
  },
  errorTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FF3B30',
    marginTop: 16,
    marginBottom: 8,
  },
  errorMessage: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    marginBottom: 20,
  },
  retryButton: {
    backgroundColor: '#007AFF',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  retryButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  // Empty state styles
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 60,
    paddingHorizontal: 20,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginTop: 16,
    marginBottom: 8,
  },
  emptyMessage: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
  },
  // Order products count
  orderProducts: {
    fontSize: 11,
    color: '#999',
    marginTop: 2,
  },
});