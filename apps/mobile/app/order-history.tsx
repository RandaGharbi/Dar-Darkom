import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  SafeAreaView,
  StatusBar,
  TouchableOpacity,
  Image,
  Dimensions,
} from 'react-native';
import { OrderCard } from '@/components/OrderCard';
import { useRouter } from 'expo-router';
import { useSafeNavigation } from '../hooks/useSafeNavigation';
import goBackIcon from '../assets/images/back.png';
import panierIcon from '../assets/images/basket.png';
import { useAuth } from '../context/AuthContext';
import API_CONFIG from '../config/api';

const screenWidth = Dimensions.get('window').width;

const OrdersHistoryScreen = () => {
  const router = useRouter();
  const { user } = useAuth();
  const { safeBack } = useSafeNavigation();
  const [tab, setTab] = useState<'active' | 'history'>('active');
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const userId = user?._id; // Utilise l'ID utilisateur réel

  useEffect(() => {
    if (!userId) return;
    const fetchOrders = async () => {
      setLoading(true);
      try {
        // ✅ Utiliser l'endpoint existant qui fonctionne
        const endpoint = tab === 'active'
          ? `${API_CONFIG.BASE_URL}/api/orders/active/${userId}` // ✅ Endpoint existant
          : `${API_CONFIG.BASE_URL}/api/orders/active/${userId}`; // ✅ Même endpoint pour les deux tabs
        console.log('🔗 Fetching orders from:', endpoint);
        const res = await fetch(endpoint);
        const data = await res.json();
        console.log('📦 Commandes récupérées:', data.length, 'avec statuts:', data.map((o: any) => o.status));
        console.log('🔍 Détail des commandes:', data.map((o: any) => ({
          id: o._id,
          status: o.status,
          date: o.createdAt
        })));
        setOrders(data);
      } catch (error) {
        console.error('Erreur lors de la récupération des commandes:', error);
        setOrders([]);
      }
      setLoading(false);
    };
    fetchOrders();
  }, [tab, userId]);

  // ✅ Filtrage local corrigé pour séparer correctement les commandes
  const filteredOrders = orders.filter(order => {
    console.log(`🔍 Commande ${order._id}: status="${order.status}"`);
    
    if (tab === 'active') {
      // Tab "Active" : SEULEMENT les commandes vraiment actives (pas annulées, pas terminées)
      const isActive = order.status === 'active' || order.status === 'processing' || order.status === 'shipped';
      console.log(`  → Tab Active: ${isActive ? '✅ AFFICHÉE' : '❌ FILTRÉE'}`);
      return isActive;
    } else {
      // Tab "History" : SEULEMENT les commandes terminées ou annulées
      const isHistory = order.status === 'completed' || order.status === 'cancelled';
      console.log(`  → Tab History: ${isHistory ? '✅ AFFICHÉE' : '❌ FILTRÉE'}`);
      return isHistory;
    }
  });
  
  console.log(`📊 Tab "${tab}": ${filteredOrders.length} commandes affichées sur ${orders.length} total`);

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />
      {/* header avec GoBack, titre centré, panier */}
      <View style={styles.headerRow}>
        <TouchableOpacity style={styles.goBackButton} onPress={safeBack}>
          <Image source={goBackIcon} style={styles.goBackIcon} />
        </TouchableOpacity>
        <View style={styles.titleWrapper}>
          <Text style={styles.title}>Orders & Returns</Text>
        </View>
        <TouchableOpacity style={styles.cartButton} onPress={() => alert('Panier cliqué')}>
          <Image source={panierIcon} style={styles.cartIcon} />
        </TouchableOpacity>
      </View>
      <View style={styles.tabsWrapper}>
        <View style={styles.tabs}>
          <TouchableOpacity onPress={() => setTab('active')} style={[styles.tabBtn, tab === 'active' && styles.tabBtnActive]}>
            <Text style={tab === 'active' ? styles.tabActive : styles.tabInactive}>Active</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => setTab('history')} style={[styles.tabBtn, tab === 'history' && styles.tabBtnActive]}>
            <Text style={tab === 'history' ? styles.tabActive : styles.tabInactive}>History</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.tabsUnderline} />
      </View>
      {loading ? (
        <Text style={{ textAlign: 'center', marginTop: 30 }}>Chargement...</Text>
      ) : (
        <FlatList
          data={filteredOrders}
          keyExtractor={(item) => item._id || item.id}
          renderItem={({ item }) => (
            <OrderCard
              image={item.image || { uri: item.products?.[0]?.image || '' }}
              orderNumber={item.orderNumber || item._id}
              date={item.createdAt ? new Date(item.createdAt).toLocaleDateString() : item.date}
              total={item.total ? `€${item.total}` : item.total}
              status={item.status}
              onPress={() => router.push({
                pathname: '/order-details',
                params: { order: JSON.stringify(item) }
              })}
            />
          )}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={<Text style={{ textAlign: 'center', marginTop: 30 }}>Aucune commande</Text>}
        />
      )}
    </SafeAreaView>
  );
};

export default OrdersHistoryScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 16,
    backgroundColor: '#FAFAFA',
    paddingTop: 40,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    justifyContent: 'space-between',
  },
  goBackButton: {
    padding: 8,
    width: 40, // fixe la largeur pour aligner correctement
  },
  goBackIcon: {
    width: 24,
    height: 24,
    tintColor: 'black',
    resizeMode: 'contain',
  },
  titleWrapper: {
    flex: 1,
    alignItems: 'center',
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
  },
  cartButton: {
    padding: 8,
    width: 40, // fixe la largeur pour symétrie
  },
  cartIcon: {
    width: 24,
    height: 24,
    tintColor: 'black',
    resizeMode: 'contain',
  },
  tabsWrapper: {
    alignItems: 'center',
    marginBottom: 16,
  },
  tabs: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 0,
    gap: 24, // si non supporté, utiliser marginHorizontal sur tabBtn
  },
  tabBtn: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    marginHorizontal: 8,
    borderRadius: 8,
  },
  tabBtnActive: {
    backgroundColor: '#fff',
    borderBottomWidth: 2,
    borderBottomColor: '#222',
  },
  tabActive: {
    fontSize: 15,
    fontWeight: '600',
    color: 'black',
  },
  tabInactive: {
    fontSize: 15,
    color: '#999',
  },
  tabsUnderline: {
    width: screenWidth * 0.8, // 80% de la largeur de l’écran
    borderBottomWidth: 2,
    borderBottomColor: '#E5E8EB',
  },
  listContent: {
    paddingBottom: 40,
  },
});
