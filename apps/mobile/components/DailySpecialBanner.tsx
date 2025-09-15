import React from 'react';
import { StyleSheet, View, Text, ImageBackground } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export default function DailySpecialBanner() {
  return (
    <View style={styles.container}>
      <View style={styles.bannerContainer}>
        <ImageBackground 
          source={require('../assets/images/sidiBousaid.jpg')} 
          style={styles.backgroundImage}
          resizeMode="cover"
        >
          {/* Overlay semi-transparent pour améliorer la lisibilité du texte */}
          <View style={styles.overlay}>
            <View style={styles.bannerContent}>
              <View style={styles.locationInfo}>
                <Ionicons name="location" size={16} color="#fff" />
                <Text style={styles.locationText}>Sidi Bou Said</Text>
              </View>
              <Text style={styles.bannerTitle}>Saveurs du jour</Text>
            </View>
          </View>
        </ImageBackground>
        
        {/* Tag "Fraîchement ajoutés" */}
        <View style={styles.freshTag}>
          <Text style={styles.freshTagText}>Fraîchement ajoutés</Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginHorizontal: 16,
    marginBottom: 20,
  },
  bannerContainer: {
    position: 'relative',
    borderRadius: 16,
    overflow: 'hidden',
    height: 120,
  },
  backgroundImage: {
    width: '100%',
    height: '100%',
  },
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.3)', // Overlay semi-transparent
    justifyContent: 'flex-end',
    padding: 16,
  },
  bannerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
  },
  locationInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  locationText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
    textShadowColor: 'rgba(0, 0, 0, 0.8)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 3,
  },
  bannerTitle: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
    textShadowColor: 'rgba(0, 0, 0, 0.8)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 3,
  },
  freshTag: {
    position: 'absolute',
    top: 12,
    right: 12,
    backgroundColor: '#FF6B6B',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    zIndex: 1,
  },
  freshTagText: {
    color: '#fff',
    fontSize: 10,
    fontWeight: '600',
  },
});
