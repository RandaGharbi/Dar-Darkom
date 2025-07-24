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
import goBackIcon from '../assets/images/back.png';
import panierIcon from '../assets/images/basket.png';
import { useAuth } from '../context/AuthContext';

const screenWidth = Dimensions.get('window').width;

const OrdersHistoryScreen = () => {
  const router = useRouter();
  const { user } = useAuth();
  const [tab, setTab] = useState<'active' | 'history'>('active');
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const userId = user?._id; // Utilise l'ID utilisateur réel

  useEffect(() => {
    if (!userId) return;
    const fetchOrders = async () => {
      setLoading(true);
      try {
        const endpoint = tab === 'active'
          ? `http://localhost:5000/api/orders/active/${userId}`
: `http://localhost:5000/api/orders/history/${userId}`;
        const res = await fetch(endpoint);
        const data = await res.json();
        setOrders(data);
      } catch (error) {
        console.error('Erreur lors de la récupération des commandes:', error);
        setOrders([]);
      }
      setLoading(false);
    };
    fetchOrders();
  }, [tab, userId]);

  // Filtrage local selon le status pour plus de robustesse
  const filteredOrders = orders.filter(order => {
    if (tab === 'active') return order.status === 'active';
    return order.status === 'completed' || order.status === 'cancelled';
  });

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />
      {/* header avec GoBack, titre centré, panier */}
      <View style={styles.headerRow}>
        <TouchableOpacity style={styles.goBackButton} onPress={() => router.back()}>
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
              total={item.total ? `$${item.total}` : item.total}
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
