import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import SafeAreaWrapper from '../../components/SafeAreaWrapper';
import OrderQRCode from '../../components/OrderQRCode';
import { OrientalColors } from '../../constants/Colors';

interface OrderData {
  id: string;
  customerName: string;
  restaurantName: string;
  totalAmount: number;
  items: string[];
  status: string;
  createdAt: string;
}

export default function OrderQRScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { orderId } = useLocalSearchParams<{ orderId: string }>();

  const [orderData, setOrderData] = useState<OrderData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadOrderData();
  }, [orderId]);

  const loadOrderData = async () => {
    try {
      setLoading(true);
      
      // Simuler le chargement des données de commande
      // Dans une vraie app, vous feriez un appel API ici
      const mockData: OrderData = {
        id: orderId || '12345',
        customerName: 'John Doe',
        restaurantName: 'Best Burger',
        totalAmount: 24.99,
        items: [
          'Cheeseburger Deluxe',
          'French Fries Large',
          'Coca Cola',
          'Chocolate Milkshake',
        ],
        status: 'confirmed',
        createdAt: new Date().toISOString(),
      };

      setOrderData(mockData);
    } catch (error) {
      console.error('Erreur lors du chargement de la commande:', error);
      Alert.alert('Error', 'Unable to load order data');
    } finally {
      setLoading(false);
    }
  };

  const handleShareQR = () => {
    Alert.alert(
      'Share QR Code',
      'Share this QR code with the driver or save it for later use.',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Share', onPress: () => {
          // Implémenter le partage
          console.log('Sharing QR code for order:', orderId);
        }},
        { text: 'Save to Photos', onPress: () => {
          // Implémenter la sauvegarde
          console.log('Saving QR code to photos');
        }}
      ]
    );
  };

  const handleTrackOrder = () => {
    router.push(`/order-status/${orderId}`);
  };

  if (loading) {
    return (
      <SafeAreaWrapper backgroundColor="#f5f5f5" edges={['top']}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={OrientalColors.primary} />
          <Text style={styles.loadingText}>Loading order data...</Text>
        </View>
      </SafeAreaWrapper>
    );
  }

  if (!orderData) {
    return (
      <SafeAreaWrapper backgroundColor="#f5f5f5" edges={['top']}>
        <View style={styles.errorContainer}>
          <Ionicons name="alert-circle" size={48} color={OrientalColors.error} />
          <Text style={styles.errorText}>Unable to load order data</Text>
          <TouchableOpacity style={styles.retryButton} onPress={loadOrderData}>
            <Text style={styles.retryButtonText}>Retry</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaWrapper>
    );
  }

  return (
    <SafeAreaWrapper backgroundColor="#f5f5f5" edges={['top']}>
      <View style={styles.container}>
        {/* Header */}
        <View style={[styles.header, { paddingTop: insets.top + 8 }]}>
          <TouchableOpacity 
            style={styles.backButton} 
            onPress={() => router.back()}
          >
            <Ionicons name="arrow-back" size={24} color="#333" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Order QR Code</Text>
          <View style={styles.placeholder} />
        </View>

        <ScrollView 
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {/* QR Code Component */}
          <OrderQRCode
            orderId={orderData.id}
            orderData={{
              customerName: orderData.customerName,
              restaurantName: orderData.restaurantName,
              totalAmount: orderData.totalAmount,
              items: orderData.items,
            }}
            size={250}
            showDetails={true}
            onShare={handleShareQR}
          />

          {/* Status Card */}
          <View style={styles.statusCard}>
            <View style={styles.statusHeader}>
              <Ionicons name="checkmark-circle" size={24} color="#4CAF50" />
              <Text style={styles.statusTitle}>Order Confirmed</Text>
            </View>
            <Text style={styles.statusDescription}>
              Your order has been confirmed and is being prepared. 
              Show this QR code to the driver when they arrive.
            </Text>
          </View>

          {/* Action Buttons */}
          <View style={styles.actionsContainer}>
            <TouchableOpacity 
              style={styles.primaryButton}
              onPress={handleTrackOrder}
            >
              <Ionicons name="location" size={20} color="#fff" />
              <Text style={styles.primaryButtonText}>Track Order</Text>
            </TouchableOpacity>

            <TouchableOpacity 
              style={styles.secondaryButton}
              onPress={handleShareQR}
            >
              <Ionicons name="share-outline" size={20} color={OrientalColors.primary} />
              <Text style={styles.secondaryButtonText}>Share QR Code</Text>
            </TouchableOpacity>
          </View>

          {/* Information Card */}
          <View style={styles.infoCard}>
            <Text style={styles.infoTitle}>How it works:</Text>
            <View style={styles.infoList}>
              <View style={styles.infoItem}>
                <Ionicons name="restaurant" size={20} color={OrientalColors.primary} />
                <Text style={styles.infoText}>Restaurant prepares your order</Text>
              </View>
              <View style={styles.infoItem}>
                <Ionicons name="car" size={20} color={OrientalColors.primary} />
                <Text style={styles.infoText}>Driver picks up your order</Text>
              </View>
              <View style={styles.infoItem}>
                <Ionicons name="qr-code" size={20} color={OrientalColors.primary} />
                <Text style={styles.infoText}>Driver scans your QR code</Text>
              </View>
              <View style={styles.infoItem}>
                <Ionicons name="checkmark-circle" size={20} color={OrientalColors.primary} />
                <Text style={styles.infoText}>Order delivered successfully</Text>
              </View>
            </View>
          </View>
        </ScrollView>
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
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingBottom: 40,
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
    paddingHorizontal: 20,
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
  statusCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginVertical: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  statusHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  statusTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginLeft: 8,
  },
  statusDescription: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
  },
  actionsContainer: {
    marginVertical: 16,
  },
  primaryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: OrientalColors.primary,
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: 12,
    marginBottom: 12,
  },
  primaryButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
  secondaryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#fff',
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: OrientalColors.primary,
  },
  secondaryButtonText: {
    color: OrientalColors.primary,
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
  infoCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginTop: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  infoTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 16,
  },
  infoList: {
    gap: 12,
  },
  infoItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  infoText: {
    fontSize: 14,
    color: '#666',
    marginLeft: 12,
    flex: 1,
  },
});
