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
import { useRouter } from 'expo-router';
import { OrientalColors } from '../constants/Colors';
import { OrientalStyles } from '../constants/OrientalStyles';

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
}

interface TrackingCardProps {
  orderId: string;
  onTrackingUpdate?: (tracking: TrackingData) => void;
}

export default function TrackingCard({ orderId, onTrackingUpdate }: TrackingCardProps) {
  const router = useRouter();
  const [tracking, setTracking] = useState<TrackingData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isConnected, setIsConnected] = useState(true);

  // Fonctions utilitaires simplifiées
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
    try {
      setLoading(true);
      setError(null);
      
      // Simuler des données de tracking
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
        deliveryNotes: 'Livraison à l\'entrée principale'
      };
      
      setTracking(mockTrackingData);
      onTrackingUpdate?.(mockTrackingData);
    } catch (err) {
      console.error('Erreur lors de la récupération du tracking:', err);
      setError(err instanceof Error ? err.message : 'Erreur inconnue');
    } finally {
      setLoading(false);
    }
  }, [orderId, onTrackingUpdate]);

  useEffect(() => {
    fetchTracking();
  }, [orderId, fetchTracking]);

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
    <View style={[styles.card, OrientalStyles.card]}>
      <View style={styles.header}>
        <View style={styles.titleContainer}>
          <Ionicons name="location" size={20} color={OrientalColors.primary} />
          <Text style={styles.title}>Suivi de livraison</Text>
          <View style={[styles.connectionIndicator, { 
            backgroundColor: isConnected ? OrientalColors.success : OrientalColors.warning 
          }]} />
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
          <Ionicons name="person" size={16} color={OrientalColors.textSecondary} />
          <Text style={styles.driverText}>
            Livreur: {tracking.driverName}
            {tracking.driverPhone && ` • ${tracking.driverPhone}`}
          </Text>
        </View>
      )}

      {tracking.currentLocation && (
        <View style={styles.locationContainer}>
          <View style={styles.locationHeader}>
            <Ionicons name="location" size={20} color={OrientalColors.primary} />
            <Text style={styles.locationTitle}>Position actuelle</Text>
          </View>
          <View style={styles.locationInfo}>
            <Text style={styles.locationAddress}>
              {tracking.currentLocation.address || 'Position du livreur'}
            </Text>
            <Text style={styles.locationCoordinates}>
              {tracking.currentLocation.latitude.toFixed(4)}, {tracking.currentLocation.longitude.toFixed(4)}
            </Text>
          </View>
          <TouchableOpacity style={styles.openMapButton}>
            <Ionicons name="map" size={16} color={OrientalColors.primary} />
            <Text style={styles.openMapText}>Ouvrir dans Maps</Text>
          </TouchableOpacity>
        </View>
      )}

      {tracking.deliveryNotes && (
        <View style={styles.notesContainer}>
          <Ionicons name="document-text" size={16} color={OrientalColors.textSecondary} />
          <Text style={styles.notesText}>{tracking.deliveryNotes}</Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    marginBottom: 12,
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
    color: OrientalColors.textSecondary,
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
    color: OrientalColors.textPrimary,
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
    color: OrientalColors.textSecondary,
  },
  driverInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  driverText: {
    fontSize: 14,
    color: OrientalColors.textSecondary,
    marginLeft: 8,
  },
  locationContainer: {
    backgroundColor: OrientalColors.surface,
    borderRadius: 8,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: OrientalColors.border,
  },
  locationHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  locationTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: OrientalColors.textPrimary,
    marginLeft: 8,
  },
  locationInfo: {
    marginBottom: 12,
  },
  locationAddress: {
    fontSize: 14,
    color: OrientalColors.textPrimary,
    marginBottom: 4,
  },
  locationCoordinates: {
    fontSize: 12,
    color: OrientalColors.textSecondary,
    fontFamily: 'monospace',
  },
  openMapButton: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    paddingHorizontal: 12,
    paddingVertical: 8,
    backgroundColor: OrientalColors.primary,
    borderRadius: 6,
  },
  openMapText: {
    fontSize: 14,
    color: '#FFFFFF',
    marginLeft: 6,
    fontWeight: '500',
  },
  notesContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  notesText: {
    fontSize: 14,
    color: OrientalColors.textSecondary,
    marginLeft: 8,
    flex: 1,
  },
});
