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
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import MapView, { Marker, Polyline } from 'expo-maps';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useSafeNavigation } from '../../hooks/useSafeNavigation';
import SafeAreaWrapper from '../../components/SafeAreaWrapper';
import { TrackingData, getOrderTracking, getStatusText, getStatusColor, getEstimatedTime } from '../../services/trackingService';
import { OrientalColors } from '../../constants/Colors';

export default function TrackingScreen() {
  const insets = useSafeAreaInsets();
  const { safeBack } = useSafeNavigation();
  const router = useRouter();
  const { orderId } = useLocalSearchParams<{ orderId: string }>();

  const [tracking, setTracking] = useState<TrackingData | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchTracking = useCallback(async () => {
    if (!orderId) return;

    try {
      setError(null);
      const trackingData = await getOrderTracking(orderId);
      setTracking(trackingData);
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
            // Ici vous pouvez implémenter l'appel téléphonique
            console.log('Appel du livreur:', tracking.driverPhone);
          }}
        ]
      );
    }
  };

  if (loading) {
    return (
      <SafeAreaWrapper backgroundColor="#f5f5f5" edges={['top']}>
        <View style={[styles.header, { paddingTop: insets.top + 8 }]}>
          <TouchableOpacity style={styles.backButton} onPress={safeBack}>
            <Ionicons name="arrow-back" size={24} color="#333" />
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
      <SafeAreaWrapper backgroundColor="#f5f5f5" edges={['top']}>
        <View style={[styles.header, { paddingTop: insets.top + 8 }]}>
          <TouchableOpacity style={styles.backButton} onPress={safeBack}>
            <Ionicons name="arrow-back" size={24} color="#333" />
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
    <SafeAreaWrapper backgroundColor="#f5f5f5" edges={['top']}>
      <View style={[styles.header, { paddingTop: insets.top + 8 }]}>
        <TouchableOpacity style={styles.backButton} onPress={safeBack}>
          <Ionicons name="arrow-back" size={24} color="#333" />
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
        <View style={styles.card}>
          <View style={styles.statusHeader}>
            <View style={[styles.statusBadge, { backgroundColor: statusColor }]}>
              <Text style={styles.statusText}>{statusText}</Text>
            </View>
            {estimatedTime !== 'Non disponible' && (
              <Text style={styles.estimatedTime}>Arrivée estimée: {estimatedTime}</Text>
            )}
          </View>
        </View>

        {/* Driver Info */}
        {tracking.driverName && (
          <View style={styles.card}>
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

        {/* Map */}
        {tracking.currentLocation && (
          <View style={styles.card}>
            <Text style={styles.sectionTitle}>Position actuelle</Text>
            <View style={styles.mapContainer}>
              <MapView
                style={styles.map}
                provider="google"
                initialRegion={{
                  latitude: tracking.currentLocation.latitude,
                  longitude: tracking.currentLocation.longitude,
                  latitudeDelta: 0.01,
                  longitudeDelta: 0.01,
                }}
                region={{
                  latitude: tracking.currentLocation.latitude,
                  longitude: tracking.currentLocation.longitude,
                  latitudeDelta: 0.01,
                  longitudeDelta: 0.01,
                }}
              >
                <Marker
                  coordinate={{
                    latitude: tracking.currentLocation.latitude,
                    longitude: tracking.currentLocation.longitude,
                  }}
                  title="Position du livreur"
                  description={tracking.currentLocation.address || 'Position actuelle'}
                />
              </MapView>
            </View>
          </View>
        )}

        {/* Delivery Notes */}
        {tracking.deliveryNotes && (
          <View style={styles.card}>
            <Text style={styles.sectionTitle}>Notes de livraison</Text>
            <Text style={styles.notesText}>{tracking.deliveryNotes}</Text>
          </View>
        )}

        {/* Order Info */}
        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Informations de la commande</Text>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Numéro de commande</Text>
            <Text style={styles.infoValue}>#{orderId?.slice(-8).toUpperCase()}</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Dernière mise à jour</Text>
            <Text style={styles.infoValue}>
              {new Date(tracking.lastUpdated).toLocaleString('fr-FR')}
            </Text>
          </View>
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
    color: '#666',
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
    color: '#666',
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
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginHorizontal: 20,
    marginBottom: 12,
    shadowColor: '#000',
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
    color: '#666',
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 12,
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
    color: '#333',
  },
  driverPhone: {
    fontSize: 14,
    color: '#666',
    marginTop: 2,
  },
  callButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#4CAF50',
    justifyContent: 'center',
    alignItems: 'center',
  },
  mapContainer: {
    height: 200,
    borderRadius: 8,
    overflow: 'hidden',
  },
  map: {
    flex: 1,
  },
  mapPlaceholder: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f8f9fa',
    borderRadius: 8,
    padding: 20,
  },
  mapPlaceholderText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginTop: 12,
  },
  mapCoordinates: {
    fontSize: 14,
    color: '#666',
    marginTop: 8,
  },
  mapAddress: {
    fontSize: 14,
    color: '#666',
    marginTop: 8,
    textAlign: 'center',
    paddingHorizontal: 16,
  },
  openMapsButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: OrientalColors.primary,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    marginTop: 16,
  },
  openMapsButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
    marginLeft: 8,
  },
  notesText: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  infoLabel: {
    fontSize: 14,
    color: '#666',
  },
  infoValue: {
    fontSize: 14,
    color: '#333',
    fontWeight: '500',
  },
});
