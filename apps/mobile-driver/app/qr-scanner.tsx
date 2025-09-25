import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
  Dimensions,
  Animated,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

const { width, height } = Dimensions.get('window');

interface ScannedOrder {
  id: string;
  timestamp: string;
  status: string;
  source: string;
}

export default function QRScannerScreen() {
  const router = useRouter();
  const [isScanning, setIsScanning] = useState(false);
  const [scannedOrders, setScannedOrders] = useState<ScannedOrder[]>([]);
  const [isFlashOn, setIsFlashOn] = useState(false);
  const [isBatchMode, setIsBatchMode] = useState(true);
  const scanLineAnim = useRef(new Animated.Value(0)).current;

  // Animation de la ligne de scan
  useEffect(() => {
    if (isScanning) {
      const animateScanLine = () => {
        Animated.loop(
          Animated.sequence([
            Animated.timing(scanLineAnim, {
              toValue: 1,
              duration: 2000,
              useNativeDriver: true,
            }),
            Animated.timing(scanLineAnim, {
              toValue: 0,
              duration: 2000,
              useNativeDriver: true,
            }),
          ])
        ).start();
      };
      animateScanLine();
    } else {
      scanLineAnim.setValue(0);
    }
  }, [isScanning]);

  const handleScan = () => {
    if (isScanning) {
      // Simuler le scan d'un QR code
      const newOrder = {
        id: `ORD-${Date.now()}`,
        timestamp: new Date().toISOString(),
        status: 'scanned',
        source: 'QR Code Scan',
      };
      
      setScannedOrders(prev => [...prev, newOrder]);
      
      if (isBatchMode) {
        Alert.alert(
          'Order Scanned!',
          `Order ${newOrder.id} added to batch`,
          [{ text: 'OK' }]
        );
      } else {
        Alert.alert(
          'Order Scanned!',
          `Order ${newOrder.id} details would open here`,
          [{ text: 'OK' }]
        );
      }
    }
  };

  const startScanning = () => {
    setIsScanning(true);
    // Simuler le scan après 1 seconde
    setTimeout(() => {
      handleScan();
      if (!isBatchMode) {
        setIsScanning(false);
      }
    }, 1000);
  };

  const stopScanning = () => {
    setIsScanning(false);
  };

  const toggleFlash = () => {
    setIsFlashOn(!isFlashOn);
  };

  const toggleBatchMode = () => {
    setIsBatchMode(!isBatchMode);
  };

  const handleEnterOrderID = () => {
    Alert.alert(
      'Enter Order ID',
      'Manual order ID entry feature would open here',
      [{ text: 'OK' }]
    );
  };

  const handleGallery = () => {
    Alert.alert(
      'Gallery',
      'Gallery feature would open here to select QR code from images',
      [{ text: 'OK' }]
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <Ionicons name="arrow-back" size={24} color="#FFFFFF" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Scan QR Code</Text>
        <View style={styles.headerSpacer} />
      </View>

      {/* Camera View */}
      <View style={styles.cameraContainer}>
        <View style={styles.scannerFrame}>
          {/* Corner markers */}
          <View style={[styles.cornerMarker, styles.topLeft]} />
          <View style={[styles.cornerMarker, styles.topRight]} />
          <View style={[styles.cornerMarker, styles.bottomLeft]} />
          <View style={[styles.cornerMarker, styles.bottomRight]} />
          
          {/* Scanning line */}
          {isScanning && (
            <Animated.View 
              style={[
                styles.scanLine,
                {
                  transform: [{
                    translateY: scanLineAnim.interpolate({
                      inputRange: [0, 1],
                      outputRange: [0, 200],
                    })
                  }]
                }
              ]}
            />
          )}
        </View>
      </View>

      {/* Instructions */}
      <View style={styles.instructionsContainer}>
        <Text style={styles.instructionText}>Point your camera at a QR code to scan.</Text>
        <Text style={styles.instructionText}>Supports batch scanning.</Text>
      </View>

      {/* Control Icons */}
      <View style={styles.controlsContainer}>
        <TouchableOpacity 
          style={styles.controlButton}
          onPress={handleGallery}
        >
          <Ionicons name="image-outline" size={24} color="#9CA3AF" />
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={[styles.controlButton, isBatchMode && styles.activeControlButton]}
          onPress={toggleBatchMode}
        >
          <Ionicons name="grid-outline" size={24} color={isBatchMode ? "#FFFFFF" : "#9CA3AF"} />
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={styles.controlButton}
          onPress={toggleFlash}
        >
          <Ionicons 
            name={isFlashOn ? "flash" : "flash-off-outline"} 
            size={24} 
            color={isFlashOn ? "#3B82F6" : "#9CA3AF"} 
          />
        </TouchableOpacity>
      </View>

      {/* Action Buttons */}
      <View style={styles.actionButtonsContainer}>
        <TouchableOpacity 
          style={styles.scanButton}
          onPress={isScanning ? stopScanning : startScanning}
        >
          <Text style={styles.scanButtonText}>Scan</Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={styles.enterOrderButton}
          onPress={handleEnterOrderID}
        >
          <Text style={styles.enterOrderText}>Enter Order ID</Text>
        </TouchableOpacity>
      </View>

      {/* Scanned Orders Counter */}
      {scannedOrders.length > 0 && (
        <View style={styles.scannedCounter}>
          <Text style={styles.scannedCounterText}>
            {scannedOrders.length} order{scannedOrders.length > 1 ? 's' : ''} scanned
          </Text>
        </View>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000000', // Dark theme comme dans la maquette
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: '#000000', // Header sombre
  },
  backButton: {
    padding: 8,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  headerSpacer: {
    width: 40, // Même largeur que le bouton retour pour centrer
  },
  cameraContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#1A1A1A', // Fond sombre pour la zone de scan
    margin: 20,
    borderRadius: 16,
  },
  scannerFrame: {
    width: width * 0.7,
    height: width * 0.7,
    position: 'relative',
    justifyContent: 'center',
    alignItems: 'center',
  },
  cornerMarker: {
    position: 'absolute',
    width: 20,
    height: 20,
    borderColor: '#FFFFFF', // Marqueurs blancs comme dans la maquette
    borderWidth: 3,
  },
  topLeft: {
    top: 0,
    left: 0,
    borderRightWidth: 0,
    borderBottomWidth: 0,
  },
  topRight: {
    top: 0,
    right: 0,
    borderLeftWidth: 0,
    borderBottomWidth: 0,
  },
  bottomLeft: {
    bottom: 0,
    left: 0,
    borderRightWidth: 0,
    borderTopWidth: 0,
  },
  bottomRight: {
    bottom: 0,
    right: 0,
    borderLeftWidth: 0,
    borderTopWidth: 0,
  },
  scanLine: {
    position: 'absolute',
    width: '100%',
    height: 2,
    backgroundColor: '#3B82F6', // Ligne bleue comme dans la maquette
    top: 0,
  },
  instructionsContainer: {
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  instructionText: {
    fontSize: 14,
    color: '#9CA3AF', // Texte gris clair comme dans la maquette
    textAlign: 'center',
    marginBottom: 4,
  },
  controlsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 20,
    gap: 40,
  },
  controlButton: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#374151', // Fond gris pour les boutons inactifs
    justifyContent: 'center',
    alignItems: 'center',
  },
  activeControlButton: {
    backgroundColor: '#3B82F6', // Fond bleu pour le bouton actif (batch)
  },
  actionButtonsContainer: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    paddingBottom: 20,
    gap: 12,
  },
  scanButton: {
    flex: 1,
    backgroundColor: '#3B82F6', // Bouton bleu comme dans la maquette
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  scanButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  enterOrderButton: {
    flex: 1,
    backgroundColor: '#1F2937', // Fond sombre avec bordure bleue
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#3B82F6',
  },
  enterOrderText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#3B82F6', // Texte bleu
  },
  scannedCounter: {
    position: 'absolute',
    top: 100,
    right: 20,
    backgroundColor: 'rgba(59, 130, 246, 0.9)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  scannedCounterText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#FFFFFF',
  },
});
