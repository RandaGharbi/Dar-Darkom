import React, { useState } from 'react';
import { StyleSheet, View, Text, ScrollView, TouchableOpacity, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useSafeNavigation } from '../../hooks/useSafeNavigation';
import SafeAreaWrapper from '../../components/SafeAreaWrapper';

interface Order {
  id: string;
  orderNumber: string;
  status: 'Delivered' | 'Pending' | 'Cancelled';
  date: string;
  total: string;
  imageUrl: string;
}

export default function OrdersScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { safeBack } = useSafeNavigation();
  const [isScrolled, setIsScrolled] = useState(false);
  const orders: Order[] = [
    {
      id: '1',
      orderNumber: '20231201-001',
      status: 'Delivered',
      date: 'Dec 1, 2023',
      total: '$45.00',
      imageUrl: 'https://www.bennasafi.com/media/medium/1578061341_couscous.bel.alouch.png'
    },
    {
      id: '2',
      orderNumber: '20231115-002',
      status: 'Delivered',
      date: 'Nov 15, 2023',
      total: '$32.50',
      imageUrl: 'https://fac.img.pmdstatic.net/fit/~1~fac~2022~02~26~2e3f76f3-0921-4668-a1c1-e67b9cfb3030.jpeg/750x562/quality/80/crop-from/center/cr/wqkgSVNUT0NLIC8gRmVtbWUgQWN0dWVsbGU%3D/focus-point/749%2C1284/ojja-tunisienne.jpeg'
    },
    {
      id: '3',
      orderNumber: '20231020-003',
      status: 'Pending',
      date: 'Oct 20, 2023',
      total: '$68.75',
      imageUrl: 'https://www.bennasafi.com/media/medium/1578061341_couscous.bel.alouch.png'
    },
    {
      id: '4',
      orderNumber: '20230905-004',
      status: 'Cancelled',
      date: 'Sep 5, 2023',
      total: '$22.00',
      imageUrl: 'https://fac.img.pmdstatic.net/fit/~1~fac~2022~02~26~2e3f76f3-0921-4668-a1c1-e67b9cfb3030.jpeg/750x562/quality/80/crop-from/center/cr/wqkgSVNUT0NLIC8gRmVtbWUgQWN0dWVsbGU%3D/focus-point/749%2C1284/ojja-tunisienne.jpeg'
    },
    {
      id: '5',
      orderNumber: '20230812-005',
      status: 'Delivered',
      date: 'Aug 12, 2023',
      total: '$55.20',
      imageUrl: 'https://www.bennasafi.com/media/medium/1578061341_couscous.bel.alouch.png'
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Delivered':
        return '#E8F5E8'; // Light green background
      case 'Pending':
        return '#FFF3CD'; // Light yellow background
      case 'Cancelled':
        return '#F8D7DA'; // Light red background
      default:
        return '#F8F9FA'; // Light grey background
    }
  };

  const getStatusTextColor = (status: string) => {
    switch (status) {
      case 'Delivered':
        return '#28A745'; // Dark green text
      case 'Pending':
        return '#856404'; // Dark yellow text
      case 'Cancelled':
        return '#721C24'; // Dark red text
      default:
        return '#6C757D'; // Dark grey text
    }
  };

  const handleOrderPress = (orderId: string) => {
    console.log('Voir les détails de la commande:', orderId);
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
        <Text style={styles.headerTitle}>Order History</Text>
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

        {/* Orders List */}
        <View style={styles.ordersList}>
          {orders.map((order) => (
            <TouchableOpacity
              key={order.id}
              style={styles.orderCard}
              onPress={() => handleOrderPress(order.id)}
            >
              <View style={styles.orderTopRow}>
                <Text style={styles.orderNumber}>Order #{order.orderNumber}</Text>
                <View style={[styles.statusBadge, { backgroundColor: getStatusColor(order.status) }]}>
                  <Text style={[styles.statusText, { color: getStatusTextColor(order.status) }]}>{order.status}</Text>
                </View>
              </View>
              <View style={styles.orderBottomRow}>
                <Image
                  source={{ uri: order.imageUrl }}
                  style={styles.orderImage}
                  resizeMode="cover"
                />
                <View style={styles.orderDetails}>
                  <Text style={styles.orderDate}>Date: {order.date}</Text>
                  <Text style={styles.orderTotal}>Total: {order.total}</Text>
                </View>
                <Ionicons name="chevron-forward" size={16} color="#666" style={styles.chevron} />
              </View>
            </TouchableOpacity>
          ))}
        </View>
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
    paddingBottom: 20,
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
    marginRight: 16,
  },
  orderDetails: {
    flex: 1,
  },
  orderNumber: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#333',
  },
  orderBottomRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  orderDetails: {
    flex: 1,
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
});