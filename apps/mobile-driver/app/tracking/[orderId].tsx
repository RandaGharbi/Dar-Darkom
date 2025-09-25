import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  RefreshControl,
  Dimensions,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useSafeNavigation } from '../../hooks/useSafeNavigation';
import SafeAreaWrapper from '../../components/SafeAreaWrapper';
import { OrientalColors } from '../../constants/Colors';
import { OrientalStyles } from '../../constants/OrientalStyles';

const { width } = Dimensions.get('window');

interface TrackingData {
  orderId: string;
  status: string;
  driverName?: string;
  driverPhone?: string;
  currentLocation?: {
    latitude: number;
    longitude: number;
    address?: string;
  };
  estimatedDeliveryTime?: string;
  deliveryNotes?: string;
  lastUpdated: string;
  restaurantName?: string;
  customerName?: string;
  customerAddress?: string;
  orderItems?: string[];
  totalAmount?: number;
}

export default function TrackingScreen() {
  const insets = useSafeAreaInsets();
  const { safeBack } = useSafeNavigation();
  const router = useRouter();
  const { orderId } = useLocalSearchParams<{ orderId: string }>();

  const [tracking, setTracking] = useState<TrackingData | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Fonctions utilitaires pour le statut
  const getStatusText = (status: string) => {
    const statusMap: { [key: string]: string } = {
      'preparing': 'En préparation',
      'ready': 'Prêt à livrer',
      'picked_up': 'Récupéré',
      'in_transit': 'En cours de livraison',
      'delivered': 'Livré',
      'cancelled': 'Annulé',
    };
    return statusMap[status] || status;
  };

  const getStatusColor = (status: string) => {
    const colorMap: { [key: string]: string } = {
      'preparing': OrientalColors.warning,
      'ready': '#2196F3',
      'picked_up': '#FF9800',
      'in_transit': OrientalColors.primary,
      'delivered': OrientalColors.success,
      'cancelled': OrientalColors.error,
    };
    return colorMap[status] || OrientalColors.textSecondary;
  };

  const getEstimatedTime = (time?: string) => {
    if (!time) return 'Non disponible';
    return time;
  };

  const fetchTracking = useCallback(async () => {
    if (!orderId) return;

    try {
      setError(null);
      // Simuler des données de tracking pour un livreur de repas
      const mockTrackingData: TrackingData = {
        orderId,
        status: 'in_transit',
        driverName: 'Ahmed Ben Ali',
        driverPhone: '+216 12 345 678',
        currentLocation: {
          latitude: 36.8065,
          longitude: 10.1815,
          address: 'Tunis, Tunisie'
        },
        estimatedDeliveryTime: '15-20 min',
        deliveryNotes: 'Livraison à l\'entrée principale',
        lastUpdated: new Date().toISOString(),
        restaurantName: 'Dar Darkom',
        customerName: 'Fatma Ben Salem',
        customerAddress: '123 Avenue Habib Bourguiba, Tunis',
        orderItems: ['Couscous aux légumes', 'Salade tunisienne', 'Brik à l\'œuf'],
        totalAmount: 25.50
      };
      
      setTracking(mockTrackingData);
    } catch (err) {
      console.error('Erreur lors de la récupération du tracking:', err);
      setError(err instanceof Error ? err.message : 'Erreur inconnue');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [orderId]);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    fetchTracking();
  }, [fetchTracking]);

  useEffect(() => {
    fetchTracking();
  }, [fetchTracking]);

  const handleCallDriver = () => {
    if (tracking?.driverPhone) {
      Alert.alert(
        'Appeler le livreur',
        `Voulez-vous appeler ${tracking.driverName || 'le livreur'} au ${tracking.driverPhone} ?`,
        [
          { text: 'Annuler', style: 'cancel' },
          { text: 'Appeler', onPress: () => {
            console.log('Appel du livreur:', tracking.driverPhone);
          }}
        ]
      );
    }
  };

  const handleOpenMaps = () => {
    if (tracking?.currentLocation) {
      const { latitude, longitude } = tracking.currentLocation;
      const url = `https://maps.google.com/?q=${latitude},${longitude}`;
      console.log('Ouverture de Maps:', url);
      Alert.alert('Maps', 'Ouverture de l\'application Maps...');
    }
  };

  if (loading) {
    return (
      <SafeAreaWrapper backgroundColor={OrientalColors.background} edges={['top']}>
        <View style={[styles.header, { paddingTop: insets.top + 8 }]}>
          <TouchableOpacity style={styles.backButton} onPress={safeBack}>
            <Ionicons name="arrow-back" size={24} color={OrientalColors.textPrimary} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Suivi de livraison</Text>
          <View style={styles.placeholder} />
        </View>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={OrientalColors.primary} />
          <Text style={styles.loadingText}>Chargement du suivi...</Text>
        </View>
      </SafeAreaWrapper>
    );
  }

  if (error || !tracking) {
    return (
      <SafeAreaWrapper backgroundColor={OrientalColors.background} edges={['top']}>
        <View style={[styles.header, { paddingTop: insets.top + 8 }]}>
          <TouchableOpacity style={styles.backButton} onPress={safeBack}>
            <Ionicons name="arrow-back" size={24} color={OrientalColors.textPrimary} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Suivi de livraison</Text>
          <View style={styles.placeholder} />
        </View>
        <View style={styles.errorContainer}>
          <Ionicons name="alert-circle" size={48} color={OrientalColors.error} />
          <Text style={styles.errorTitle}>Erreur de chargement</Text>
          <Text style={styles.errorMessage}>{error || 'Impossible de charger le suivi'}</Text>
          <TouchableOpacity style={styles.retryButton} onPress={fetchTracking}>
            <Text style={styles.retryButtonText}>Réessayer</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaWrapper>
    );
  }

  const statusText = getStatusText(tracking.status);
  const statusColor = getStatusColor(tracking.status);
  const estimatedTime = getEstimatedTime(tracking.estimatedDeliveryTime);

  return (
    <SafeAreaWrapper backgroundColor={OrientalColors.background} edges={['top']}>
      <View style={[styles.header, { paddingTop: insets.top + 8 }]}>
        <TouchableOpacity style={styles.backButton} onPress={safeBack}>
          <Ionicons name="arrow-back" size={24} color={OrientalColors.textPrimary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Suivi de livraison</Text>
        <View style={styles.placeholder} />
      </View>

      <ScrollView 
        style={styles.container}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        {/* Status Card */}
        <View style={[styles.card, OrientalStyles.card]}>
          <View style={styles.statusHeader}>
            <View style={[styles.statusBadge, { backgroundColor: statusColor }]}>
              <Text style={styles.statusText}>{statusText}</Text>
            </View>
            {estimatedTime !== 'Non disponible' && (
              <Text style={styles.estimatedTime}>Arrivée estimée: {estimatedTime}</Text>
            )}
          </View>
        </View>

        {/* Order Info */}
        <View style={[styles.card, OrientalStyles.card]}>
          <Text style={styles.sectionTitle}>Informations de la commande</Text>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Numéro de commande</Text>
            <Text style={styles.infoValue}>#{orderId?.slice(-8).toUpperCase()}</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Restaurant</Text>
            <Text style={styles.infoValue}>{tracking.restaurantName || 'Dar Darkom'}</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Client</Text>
            <Text style={styles.infoValue}>{tracking.customerName || 'Non disponible'}</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Montant total</Text>
            <Text style={styles.infoValue}>{tracking.totalAmount ? `${tracking.totalAmount} DT` : 'Non disponible'}</Text>
          </View>
        </View>

        {/* Order Items */}
        {tracking.orderItems && tracking.orderItems.length > 0 && (
          <View style={[styles.card, OrientalStyles.card]}>
            <Text style={styles.sectionTitle}>Articles commandés</Text>
            {tracking.orderItems.map((item, index) => (
              <View key={index} style={styles.orderItem}>
                <Ionicons name="restaurant" size={16} color={OrientalColors.primary} />
                <Text style={styles.orderItemText}>{item}</Text>
              </View>
            ))}
          </View>
        )}

        {/* Driver Info */}
        {tracking.driverName && (
          <View style={[styles.card, OrientalStyles.card]}>
            <Text style={styles.sectionTitle}>Informations du livreur</Text>
            <View style={styles.driverInfo}>
              <View style={styles.driverAvatar}>
                <Ionicons name="person" size={24} color="#fff" />
              </View>
              <View style={styles.driverDetails}>
                <Text style={styles.driverName}>{tracking.driverName}</Text>
                {tracking.driverPhone && (
                  <Text style={styles.driverPhone}>{tracking.driverPhone}</Text>
                )}
              </View>
              {tracking.driverPhone && (
                <TouchableOpacity style={styles.callButton} onPress={handleCallDriver}>
                  <Ionicons name="call" size={20} color="#fff" />
                </TouchableOpacity>
              )}
            </View>
          </View>
        )}

        {/* Delivery Address */}
        {tracking.customerAddress && (
          <View style={[styles.card, OrientalStyles.card]}>
            <Text style={styles.sectionTitle}>Adresse de livraison</Text>
            <View style={styles.addressContainer}>
              <Ionicons name="location" size={20} color={OrientalColors.primary} />
              <Text style={styles.addressText}>{tracking.customerAddress}</Text>
            </View>
            <TouchableOpacity style={styles.openMapsButton} onPress={handleOpenMaps}>
              <Ionicons name="map" size={16} color="#fff" />
              <Text style={styles.openMapsButtonText}>Ouvrir dans Maps</Text>
            </TouchableOpacity>
          </View>
        )}

        {/* Current Location */}
        {tracking.currentLocation && (
          <View style={[styles.card, OrientalStyles.card]}>
            <Text style={styles.sectionTitle}>Position actuelle du livreur</Text>
            <View style={styles.locationContainer}>
              <Ionicons name="navigate" size={20} color={OrientalColors.primary} />
              <Text style={styles.locationText}>
                {tracking.currentLocation.address || 'Position du livreur'}
              </Text>
            </View>
            <Text style={styles.coordinatesText}>
              {tracking.currentLocation.latitude.toFixed(4)}, {tracking.currentLocation.longitude.toFixed(4)}
            </Text>
          </View>
        )}

        {/* Delivery Notes */}
        {tracking.deliveryNotes && (
          <View style={[styles.card, OrientalStyles.card]}>
            <Text style={styles.sectionTitle}>Notes de livraison</Text>
            <Text style={styles.notesText}>{tracking.deliveryNotes}</Text>
          </View>
        )}

        {/* Last Update */}
        <View style={[styles.card, OrientalStyles.card]}>
          <Text style={styles.sectionTitle}>Dernière mise à jour</Text>
          <Text style={styles.lastUpdateText}>
            {new Date(tracking.lastUpdated).toLocaleString('fr-FR')}
          </Text>
        </View>
      </ScrollView>
    </SafeAreaWrapper>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingBottom: 16,
    backgroundColor: OrientalColors.background,
  },
  backButton: {
    padding: 8,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: OrientalColors.textPrimary,
  },
  placeholder: {
    width: 40,
  },
  container: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 100,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: OrientalColors.textSecondary,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  errorTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: OrientalColors.error,
    marginTop: 16,
  },
  errorMessage: {
    fontSize: 14,
    color: OrientalColors.textSecondary,
    textAlign: 'center',
    marginTop: 8,
    marginBottom: 20,
  },
  retryButton: {
    backgroundColor: OrientalColors.primary,
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  retryButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  card: {
    backgroundColor: OrientalColors.card,
    borderRadius: 12,
    padding: 16,
    marginHorizontal: 20,
    marginBottom: 12,
    shadowColor: OrientalColors.shadow,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  statusHeader: {
    alignItems: 'center',
  },
  statusBadge: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    marginBottom: 8,
  },
  statusText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  estimatedTime: {
    fontSize: 14,
    color: OrientalColors.textSecondary,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: OrientalColors.textPrimary,
    marginBottom: 12,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  infoLabel: {
    fontSize: 14,
    color: OrientalColors.textSecondary,
  },
  infoValue: {
    fontSize: 14,
    color: OrientalColors.textPrimary,
    fontWeight: '500',
  },
  orderItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  orderItemText: {
    fontSize: 14,
    color: OrientalColors.textPrimary,
    marginLeft: 8,
  },
  driverInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  driverAvatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: OrientalColors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  driverDetails: {
    flex: 1,
  },
  driverName: {
    fontSize: 16,
    fontWeight: '600',
    color: OrientalColors.textPrimary,
  },
  driverPhone: {
    fontSize: 14,
    color: OrientalColors.textSecondary,
    marginTop: 2,
  },
  callButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: OrientalColors.success,
    justifyContent: 'center',
    alignItems: 'center',
  },
  addressContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  addressText: {
    fontSize: 14,
    color: OrientalColors.textPrimary,
    marginLeft: 8,
    flex: 1,
  },
  openMapsButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: OrientalColors.primary,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    alignSelf: 'flex-start',
  },
  openMapsButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
    marginLeft: 8,
  },
  locationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  locationText: {
    fontSize: 14,
    color: OrientalColors.textPrimary,
    marginLeft: 8,
  },
  coordinatesText: {
    fontSize: 12,
    color: OrientalColors.textSecondary,
    fontFamily: 'monospace',
  },
  notesText: {
    fontSize: 14,
    color: OrientalColors.textSecondary,
    lineHeight: 20,
  },
  lastUpdateText: {
    fontSize: 14,
    color: OrientalColors.textSecondary,
  },
});
