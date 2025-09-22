// Configuration pour React Native Maps
export const MAPS_CONFIG = {
  // Clé API Google Maps (à remplacer par votre vraie clé)
  GOOGLE_MAPS_API_KEY: process.env.EXPO_PUBLIC_GOOGLE_MAPS_API_KEY || 'AIzaSyBvOkBw3cUyVbVl8Zx9qWrT2sEfGhI3jKl', // Clé de test
  
  // Configuration par défaut de la région
  DEFAULT_REGION: {
    latitude: 36.8065, // Tunis
    longitude: 10.1815,
    latitudeDelta: 0.01,
    longitudeDelta: 0.01,
  },
  
  // Configuration des marqueurs
  MARKERS: {
    DRIVER: {
      color: '#2E86AB', // Couleur du livreur
      size: 30,
    },
    RESTAURANT: {
      color: '#FF6B35', // Couleur du restaurant
      size: 25,
    },
    DESTINATION: {
      color: '#4CAF50', // Couleur de la destination
      size: 25,
    },
  },
  
  // Configuration de la carte
  MAP_STYLE: [
    {
      featureType: 'poi',
      elementType: 'labels',
      stylers: [{ visibility: 'off' }],
    },
  ],
  
  // Adresses par défaut (pour les tests)
  DEFAULT_LOCATIONS: {
    RESTAURANT: {
      latitude: 36.8065,
      longitude: 10.1815,
      address: 'Dar Darkom, Tunis, Tunisie',
    },
    // Adresse de test pour Paris
    TEST_DESTINATION: {
      latitude: 48.8566,
      longitude: 2.3522,
      address: '123 Rue de la Paix, 75001 Paris, France',
    },
  },
};

// Fonction pour calculer la distance entre deux points
export const calculateDistance = (
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number => {
  const R = 6371; // Rayon de la Terre en km
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a = 
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
    Math.sin(dLon/2) * Math.sin(dLon/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  return R * c;
};

// Fonction pour formater la distance
export const formatDistance = (distance: number): string => {
  if (distance < 1) {
    return `${Math.round(distance * 1000)} m`;
  }
  return `${distance.toFixed(1)} km`;
};

// Fonction pour estimer le temps de trajet
export const estimateTravelTime = (distance: number): number => {
  // Estimation basée sur une vitesse moyenne de 30 km/h en ville
  return Math.round((distance / 30) * 60); // en minutes
};

