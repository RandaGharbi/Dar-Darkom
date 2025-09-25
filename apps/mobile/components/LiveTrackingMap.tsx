import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import MapView, { Marker, Polyline, PROVIDER_GOOGLE } from 'expo-maps';
import { Ionicons } from '@expo/vector-icons';
import * as Location from 'expo-location';
import { OrientalColors } from '../constants/Colors';

interface LocationData {
  latitude: number;
  longitude: number;
  address?: string;
}

interface LiveTrackingMapProps {
  driverLocation?: LocationData;
  customerLocation?: LocationData;
  driverName?: string;
  estimatedTime?: string;
  onRefresh?: () => void;
}

export default function LiveTrackingMap({
  driverLocation,
  customerLocation,
  driverName,
  estimatedTime,
  onRefresh,
}: LiveTrackingMapProps) {
  const [mapRegion, setMapRegion] = useState({
    latitude: 48.8566,
    longitude: 2.3522,
    latitudeDelta: 0.01,
    longitudeDelta: 0.01,
  });
  const [isLoading, setIsLoading] = useState(false);

  // Obtenir la localisation du client
  useEffect(() => {
    getCurrentLocation();
  }, []);

  // Mettre à jour la région de la carte quand la localisation du livreur change
  useEffect(() => {
    if (driverLocation) {
      setMapRegion({
        latitude: driverLocation.latitude,
        longitude: driverLocation.longitude,
        latitudeDelta: 0.01,
        longitudeDelta: 0.01,
      });
    }
  }, [driverLocation]);

  const getCurrentLocation = async () => {
    try {
      setIsLoading(true);
      const { status } = await Location.requestForegroundPermissionsAsync();
      
      if (status !== 'granted') {
        return;
      }

      const location = await Location.getCurrentPositionAsync({});
      const currentLocation = {
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
      };

      // Si on n'a pas encore de localisation du livreur, centrer sur le client
      if (!driverLocation) {
        setMapRegion({
          latitude: currentLocation.latitude,
          longitude: currentLocation.longitude,
          latitudeDelta: 0.01,
          longitudeDelta: 0.01,
        });
      }
    } catch (error) {
      console.error('Erreur lors de la récupération de la localisation:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleRefresh = () => {
    if (onRefresh) {
      onRefresh();
    }
  };

  const openInMaps = () => {
    if (driverLocation) {
      const url = `https://www.google.com/maps/dir/?api=1&destination=${driverLocation.latitude},${driverLocation.longitude}`;
      // Ici vous pourriez utiliser Linking.openURL(url) pour ouvrir dans l'app Maps
      console.log('Ouvrir dans Maps:', url);
    }
  };

  return (
    <View style={styles.container}>
      {/* Header de la carte */}
      <View style={styles.mapHeader}>
        <View style={styles.headerInfo}>
          <Text style={styles.mapTitle}>Track your delivery</Text>
          {driverName && (
            <Text style={styles.driverName}>Driver: {driverName}</Text>
          )}
          {estimatedTime && (
            <Text style={styles.estimatedTime}>ETA: {estimatedTime}</Text>
          )}
        </View>
        
        <TouchableOpacity 
          style={styles.refreshButton}
          onPress={handleRefresh}
          disabled={isLoading}
        >
          <Ionicons 
            name="refresh" 
            size={20} 
            color={OrientalColors.primary} 
          />
        </TouchableOpacity>
      </View>

      {/* Carte */}
      <View style={styles.mapContainer}>
        {isLoading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color={OrientalColors.primary} />
            <Text style={styles.loadingText}>Loading map...</Text>
          </View>
        ) : (
          <MapView
            style={styles.map}
            provider={PROVIDER_GOOGLE}
            region={mapRegion}
            showsUserLocation={true}
            showsMyLocationButton={false}
            showsCompass={false}
            showsScale={false}
            showsBuildings={true}
            showsTraffic={true}
            showsIndoors={true}
          >
            {/* Marqueur du livreur */}
            {driverLocation && (
              <Marker
                coordinate={{
                  latitude: driverLocation.latitude,
                  longitude: driverLocation.longitude,
                }}
                title="Driver Location"
                description={driverLocation.address || 'Driver is here'}
                pinColor="green"
              >
                <View style={styles.driverMarker}>
                  <Ionicons name="car" size={24} color="#fff" />
                </View>
              </Marker>
            )}

            {/* Marqueur du client */}
            {customerLocation && (
              <Marker
                coordinate={{
                  latitude: customerLocation.latitude,
                  longitude: customerLocation.longitude,
                }}
                title="Your Location"
                description="Delivery address"
                pinColor="blue"
              >
                <View style={styles.customerMarker}>
                  <Ionicons name="home" size={20} color="#fff" />
                </View>
              </Marker>
            )}

            {/* Ligne de route */}
            {driverLocation && customerLocation && (
              <Polyline
                coordinates={[
                  {
                    latitude: driverLocation.latitude,
                    longitude: driverLocation.longitude,
                  },
                  {
                    latitude: customerLocation.latitude,
                    longitude: customerLocation.longitude,
                  },
                ]}
                strokeColor={OrientalColors.primary}
                strokeWidth={3}
                lineDashPattern={[5, 5]}
              />
            )}
          </MapView>
        )}
      </View>

      {/* Actions */}
      <View style={styles.actionsContainer}>
        <TouchableOpacity 
          style={styles.actionButton}
          onPress={openInMaps}
        >
          <Ionicons name="map" size={20} color="#fff" />
          <Text style={styles.actionButtonText}>Open in Maps</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    borderRadius: 12,
    overflow: 'hidden',
    marginVertical: 8,
  },
  mapHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#f8f9fa',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  headerInfo: {
    flex: 1,
  },
  mapTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 4,
  },
  driverName: {
    fontSize: 14,
    color: '#666',
    marginBottom: 2,
  },
  estimatedTime: {
    fontSize: 14,
    color: OrientalColors.primary,
    fontWeight: '500',
  },
  refreshButton: {
    padding: 8,
    borderRadius: 20,
    backgroundColor: '#fff',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  mapContainer: {
    height: 250,
  },
  map: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f8f9fa',
  },
  loadingText: {
    marginTop: 8,
    fontSize: 14,
    color: '#666',
  },
  driverMarker: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#4CAF50',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 3,
    borderColor: '#fff',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
  },
  customerMarker: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#2196F3',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 3,
    borderColor: '#fff',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
  },
  actionsContainer: {
    padding: 16,
    backgroundColor: '#f8f9fa',
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: OrientalColors.primary,
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 25,
  },
  actionButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
});
