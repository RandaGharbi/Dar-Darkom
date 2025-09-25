import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Image,
  ActivityIndicator,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useSafeNavigation } from '../hooks/useSafeNavigation';
import { useAuth } from '../context/AuthContext';
import API_CONFIG from '../config/api';
import SafeAreaWrapper from '../components/SafeAreaWrapper';
import { OrientalColors } from '../constants/Colors';
import AsyncStorage from '@react-native-async-storage/async-storage';

const OrdersHistoryScreen = () => {
  const router = useRouter();
  const { user } = useAuth();
  const { safeBack } = useSafeNavigation();
  const [tab, setTab] = useState<'active' | 'history'>('active');
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const userId = user?._id;

  useEffect(() => {
    if (userId) {
      fetchOrders();
    }
  }, [userId]);

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const token = await AsyncStorage.getItem('authToken');
      if (!token) return;

      const response = await fetch(`${API_CONFIG.BASE_URL}/api/orders/user/${userId}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        const data = await response.json();
        setOrders(data);
      }
    } catch (error) {
      console.error('Erreur lors de la récupération des commandes:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredOrders = orders.filter(order => {
    const isHistory = order.status === 'delivered' || order.status === 'cancelled';
    return tab === 'history' ? isHistory : !isHistory;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return OrientalColors.warning;
      case 'confirmed': return OrientalColors.warning;
      case 'preparing': return OrientalColors.warning;
      case 'ready': return OrientalColors.warning;
      case 'delivered': return OrientalColors.success;
      case 'cancelled': return OrientalColors.error;
      default: return OrientalColors.warning;
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'pending': return 'EN ATTENTE';
      case 'confirmed': return 'CONFIRMÉE';
      case 'preparing': return 'EN PRÉPARATION';
      case 'ready': return 'PRÊTE';
      case 'delivered': return 'LIVRÉE';
      case 'cancelled': return 'ANNULÉE';
      default: return 'EN COURS';
    }
  };

  const renderOrderItem = ({ item }: { item: any }) => (
    <TouchableOpacity
      style={styles.orderItem}
      onPress={() => router.push({
        pathname: '/order-details',
        params: { order: JSON.stringify(item) }
      })}
    >
      <Image
        source={{ 
          uri: item.image || item.products?.[0]?.image || 'https://via.placeholder.com/80'
        }}
        style={styles.orderImage}
        resizeMode="cover"
      />
      <View style={styles.orderInfo}>
        <Text style={styles.orderNumber}>
          Commande #{item.orderNumber || item._id?.slice(-8)}
        </Text>
        <Text style={styles.orderDate}>
          {item.createdAt ? new Date(item.createdAt).toLocaleDateString('fr-FR') : 'Date inconnue'}
        </Text>
        <Text style={styles.orderTotal}>
          Total: {item.total ? `€${item.total.toFixed(2)}` : '€0.00'}
        </Text>
        <View style={[styles.statusBadge, { backgroundColor: getStatusColor(item.status) }]}>
          <Ionicons name="time-outline" size={12} color="#fff" />
          <Text style={styles.statusText}>{getStatusText(item.status)}</Text>
        </View>
      </View>
      <Ionicons name="chevron-forward" size={20} color="#8E8E93" />
    </TouchableOpacity>
  );

  return (
    <SafeAreaWrapper backgroundColor="#f5f5f5" edges={['top']}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={safeBack}>
          <Ionicons name="arrow-back" size={24} color="#000" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Commandes & Retours</Text>
        <TouchableOpacity style={styles.returnsButton}>
          <Ionicons name="refresh-outline" size={24} color="#000" />
        </TouchableOpacity>
      </View>

      {/* Tabs */}
      <View style={styles.tabsContainer}>
        <View style={styles.tabs}>
          <TouchableOpacity
            style={[styles.tab, tab === 'active' && styles.activeTab]}
            onPress={() => setTab('active')}
          >
            <Text style={[styles.tabText, tab === 'active' && styles.activeTabText]}>
              Actives
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.tab, tab === 'history' && styles.activeTab]}
            onPress={() => setTab('history')}
          >
            <Text style={[styles.tabText, tab === 'history' && styles.activeTabText]}>
              Historique
            </Text>
          </TouchableOpacity>
        </View>
        <View style={styles.tabIndicator} />
      </View>

      {/* Content */}
      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={OrientalColors.warning} />
          <Text style={styles.loadingText}>Chargement des commandes...</Text>
        </View>
      ) : (
        <FlatList
          data={filteredOrders}
          keyExtractor={(item) => item._id || item.id}
          renderItem={renderOrderItem}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={
            <View style={styles.emptyState}>
              <Ionicons name="receipt-outline" size={64} color="#8E8E93" />
              <Text style={styles.emptyTitle}>Aucune commande</Text>
              <Text style={styles.emptyMessage}>
                {tab === 'active' 
                  ? 'Vous n\'avez pas de commandes actives' 
                  : 'Aucune commande dans l\'historique'
                }
              </Text>
            </View>
          }
        />
      )}
    </SafeAreaWrapper>
  );
};

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: '#f5f5f5',
  },
  backButton: {
    padding: 8,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#000',
    textAlign: 'center',
  },
  returnsButton: {
    padding: 8,
  },
  tabsContainer: {
    backgroundColor: '#f5f5f5',
    paddingHorizontal: 20,
    paddingBottom: 8,
  },
  tabs: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 4,
  },
  tab: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
    borderRadius: 6,
  },
  activeTab: {
    backgroundColor: '#fff',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  tabText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#8E8E93',
  },
  activeTabText: {
    color: '#000',
    fontWeight: '600',
  },
  tabIndicator: {
    height: 2,
    backgroundColor: '#E5E5EA',
    marginTop: 8,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 60,
  },
  loadingText: {
    fontSize: 16,
    color: '#8E8E93',
    marginTop: 16,
  },
  listContent: {
    padding: 20,
  },
  orderItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  orderImage: {
    width: 60,
    height: 60,
    borderRadius: 8,
    marginRight: 12,
  },
  orderInfo: {
    flex: 1,
  },
  orderNumber: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 4,
  },
  orderDate: {
    fontSize: 14,
    color: '#8E8E93',
    marginBottom: 2,
  },
  orderTotal: {
    fontSize: 14,
    color: '#8E8E93',
    marginBottom: 8,
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    alignSelf: 'flex-start',
  },
  statusText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#fff',
    marginLeft: 4,
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 80,
    paddingHorizontal: 40,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#333',
    marginTop: 16,
    marginBottom: 8,
  },
  emptyMessage: {
    fontSize: 16,
    color: '#8E8E93',
    textAlign: 'center',
    lineHeight: 22,
  },
});

export default OrdersHistoryScreen;