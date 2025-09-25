import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import MapView, { Marker } from 'expo-maps';
import { useRouter } from 'expo-router';
import { TrackingData, getOrderTracking, getStatusText, getStatusColor, getEstimatedTime } from '../services/trackingService';
import { OrientalColors } from '../constants/Colors';
import { useTrackingWebSocket } from '../hooks/useTrackingWebSocket';
import { useAuth } from '../context/AuthContext';

interface TrackingCardProps {
  orderId: string;
  onTrackingUpdate?: (tracking: TrackingData) => void;
}

export default function TrackingCard({ orderId, onTrackingUpdate }: TrackingCardProps) {
  const router = useRouter();
  const { user } = useAuth();
  const [tracking, setTracking] = useState<TrackingData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Callbacks mémorisés pour éviter les boucles infinies
  const handleTrackingUpdate = useCallback((updatedTracking: TrackingData) => {
    setTracking(updatedTracking);
    onTrackingUpdate?.(updatedTracking);
  }, [onTrackingUpdate]);

  const handleDriverLocationUpdate = useCallback((location: { latitude: number; longitude: number; address?: string }) => {
    if (tracking) {
      const updatedTracking = {
        ...tracking,
        currentLocation: location,
      };
      setTracking(updatedTracking);
      onTrackingUpdate?.(updatedTracking);
    }
  }, [tracking, onTrackingUpdate]);

  // WebSocket pour les mises à jour en temps réel
  const { isConnected } = useTrackingWebSocket({
    orderId,
    userId: user?._id || '',
    onTrackingUpdate: handleTrackingUpdate,
    onDriverLocationUpdate: handleDriverLocationUpdate,
  });

  const fetchTracking = async () => {
    try {
      setLoading(true);
      setError(null);
      const trackingData = await getOrderTracking(orderId);
      setTracking(trackingData);
      onTrackingUpdate?.(trackingData);
    } catch (err) {
      console.error('Erreur lors de la récupération du tracking:', err);
      setError(err instanceof Error ? err.message : 'Erreur inconnue');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTracking();
  }, [orderId]);

  const handleViewFullTracking = () => {
    router.push(`/tracking/${orderId}`);
  };

  if (loading) {
    return (
      <View style={styles.card}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="small" color={OrientalColors.primary} />
          <Text style={styles.loadingText}>Chargement du suivi...</Text>
        </View>
      </View>
    );
  }

  if (error || !tracking) {
    return (
      <View style={styles.card}>
        <View style={styles.errorContainer}>
          <Ionicons name="alert-circle" size={24} color={OrientalColors.error} />
          <Text style={styles.errorText}>Impossible de charger le suivi</Text>
          <TouchableOpacity style={styles.retryButton} onPress={fetchTracking}>
            <Text style={styles.retryButtonText}>Réessayer</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  const statusText = getStatusText(tracking.status);
  const statusColor = getStatusColor(tracking.status);
  const estimatedTime = getEstimatedTime(tracking.estimatedDeliveryTime);

  return (
    <View style={styles.card}>
      <View style={styles.header}>
        <View style={styles.titleContainer}>
          <Ionicons name="location" size={20} color={OrientalColors.primary} />
          <Text style={styles.title}>Suivi de livraison</Text>
          <View style={[styles.connectionIndicator, { backgroundColor: isConnected ? '#4CAF50' : '#FF9800' }]} />
        </View>
        <TouchableOpacity style={styles.viewDetailsButton} onPress={handleViewFullTracking}>
          <Text style={styles.viewDetailsText}>Voir détails</Text>
          <Ionicons name="chevron-forward" size={16} color={OrientalColors.primary} />
        </TouchableOpacity>
      </View>

      <View style={styles.statusContainer}>
        <View style={[styles.statusBadge, { backgroundColor: statusColor }]}>
          <Text style={styles.statusText}>{statusText}</Text>
        </View>
        {estimatedTime !== 'Non disponible' && (
          <Text style={styles.estimatedTime}>Arrivée estimée: {estimatedTime}</Text>
        )}
      </View>

      {tracking.driverName && (
        <View style={styles.driverInfo}>
          <Ionicons name="person" size={16} color="#666" />
          <Text style={styles.driverText}>
            Livreur: {tracking.driverName}
            {tracking.driverPhone && ` • ${tracking.driverPhone}`}
          </Text>
        </View>
      )}

      {tracking.currentLocation && (
        <View style={styles.mapContainer}>
          {console.log('📍 Affichage de la carte avec position:', tracking.currentLocation)}
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
            showsUserLocation={false}
            showsMyLocationButton={false}
            scrollEnabled={true}
            zoomEnabled={true}
            rotateEnabled={true}
            pitchEnabled={true}
          >
            <Marker
              coordinate={{
                latitude: tracking.currentLocation.latitude,
                longitude: tracking.currentLocation.longitude,
              }}
              title="Position du livreur"
              description={tracking.currentLocation.address || 'Position actuelle'}
              pinColor={OrientalColors.primary}
            />
          </MapView>
        </View>
      )}

      {tracking.deliveryNotes && (
        <View style={styles.notesContainer}>
          <Ionicons name="document-text" size={16} color="#666" />
          <Text style={styles.notesText}>{tracking.deliveryNotes}</Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
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
  loadingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 20,
  },
  loadingText: {
    marginLeft: 8,
    fontSize: 14,
    color: '#666',
  },
  errorContainer: {
    alignItems: 'center',
    paddingVertical: 20,
  },
  errorText: {
    marginTop: 8,
    fontSize: 14,
    color: OrientalColors.error,
    textAlign: 'center',
  },
  retryButton: {
    marginTop: 12,
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: OrientalColors.primary,
    borderRadius: 6,
  },
  retryButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginLeft: 8,
  },
  connectionIndicator: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginLeft: 8,
  },
  viewDetailsButton: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  viewDetailsText: {
    fontSize: 14,
    color: OrientalColors.primary,
    marginRight: 4,
  },
  statusContainer: {
    marginBottom: 12,
  },
  statusBadge: {
    alignSelf: 'flex-start',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    marginBottom: 8,
  },
  statusText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '600',
  },
  estimatedTime: {
    fontSize: 14,
    color: '#666',
  },
  driverInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  driverText: {
    fontSize: 14,
    color: '#666',
    marginLeft: 8,
  },
  mapContainer: {
    height: 120,
    borderRadius: 8,
    overflow: 'hidden',
    marginBottom: 12,
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
  },
  mapPlaceholderText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginTop: 8,
  },
  mapCoordinates: {
    fontSize: 12,
    color: '#666',
    marginTop: 4,
  },
  mapAddress: {
    fontSize: 12,
    color: '#666',
    marginTop: 4,
    textAlign: 'center',
    paddingHorizontal: 16,
  },
  mapNote: {
    fontSize: 10,
    color: '#999',
    marginTop: 8,
    fontStyle: 'italic',
  },
  notesContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  notesText: {
    fontSize: 14,
    color: '#666',
    marginLeft: 8,
    flex: 1,
  },
});
