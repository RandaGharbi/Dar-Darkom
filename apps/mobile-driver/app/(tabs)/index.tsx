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
import { CameraView, CameraType, useCameraPermissions } from 'expo-camera';

const { width, height } = Dimensions.get('window');

interface ScannedOrder {
  id: string;
  timestamp: string;
  status: string;
  source: string;
  rawData?: string;
}

export default function QRScannerScreen() {
  const router = useRouter();
  const [isScanning, setIsScanning] = useState(true);
  const [scannedOrders, setScannedOrders] = useState<ScannedOrder[]>([]);
  const [isFlashOn, setIsFlashOn] = useState(false);
  const [isBatchMode, setIsBatchMode] = useState(true);
  const [permission, requestPermission] = useCameraPermissions();
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

  const handleBarcodeScanned = ({ type, data }: { type: string; data: string }) => {
    if (!isScanning) return;
    
    // Arrêter temporairement le scan pour éviter les scans multiples
    setIsScanning(false);
    
    // Traiter les données du QR code scanné
    console.log('QR Code scanné:', { type, data });
    
    // Créer une nouvelle commande avec les données réelles du QR code
    const newOrder = {
      id: data || `ORD-${Date.now()}`,
      timestamp: new Date().toISOString(),
      status: 'scanned',
      source: `QR Code Scan (${type})`,
      rawData: data,
    };
    
    setScannedOrders(prev => [...prev, newOrder]);
    
    if (isBatchMode) {
      Alert.alert(
        'QR Code Scanné!',
        `Commande ${newOrder.id} ajoutée au batch\nDonnées: ${data}`,
        [{ 
          text: 'Continuer', 
          onPress: () => setIsScanning(true) // Reprendre le scan après confirmation
        }]
      );
    } else {
      Alert.alert(
        'QR Code Scanné!',
        `Commande ${newOrder.id} détectée\nDonnées: ${data}`,
        [{ 
          text: 'OK', 
          onPress: () => setIsScanning(true) // Reprendre le scan après confirmation
        }]
      );
    }
  };

  const startScanning = () => {
    setIsScanning(true);
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

  // Vérifier les permissions de caméra selon la documentation Expo
  if (!permission) {
    // Camera permissions are still loading
  return (
      <View style={styles.container}>
        <View style={styles.statusBarSpace} />
        <View style={styles.permissionContainer}>
          <Text style={styles.permissionText}>Chargement des permissions...</Text>
        </View>
        </View>
    );
  }

  if (!permission.granted) {
    // Camera permissions are not granted yet
    return (
      <View style={styles.container}>
        <View style={styles.statusBarSpace} />
        <View style={styles.permissionContainer}>
          <Text style={styles.permissionText}>
            Nous avons besoin de votre permission pour accéder à la caméra
                </Text>
          <TouchableOpacity style={styles.permissionButton} onPress={requestPermission}>
            <Text style={styles.permissionButtonText}>Autoriser la caméra</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Status Bar Space */}
      <View style={styles.statusBarSpace} />
      
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
        <CameraView
          style={styles.camera}
          facing="back"
          onBarcodeScanned={isScanning ? handleBarcodeScanned : undefined}
          barcodeScannerSettings={{
            barcodeTypes: ['qr', 'pdf417'],
          }}
          enableTorch={isFlashOn}
          autofocus="on"
        >
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
        </CameraView>
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
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000000', // Dark theme comme dans la maquette
  },
  statusBarSpace: {
    height: 44, // Hauteur de la barre de statut iOS
    backgroundColor: '#000000',
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
    margin: 20,
    borderRadius: 16,
    marginTop: 10,
    overflow: 'hidden',
  },
  camera: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  permissionContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  permissionText: {
    fontSize: 18,
    color: '#FFFFFF',
    textAlign: 'center',
    marginBottom: 20,
  },
  permissionButton: {
    backgroundColor: '#3B82F6',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 8,
  },
  permissionButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  scannerFrame: {
    width: width * 0.8,
    height: width * 0.8,
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
    paddingVertical: 30,
    gap: 50,
  },
  controlButton: {
    width: 60,
    height: 60,
    borderRadius: 30,
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
    paddingBottom: 30,
    gap: 15,
  },
  scanButton: {
    flex: 1,
    backgroundColor: '#3B82F6', // Bouton bleu comme dans la maquette
    paddingVertical: 18,
    borderRadius: 12,
    alignItems: 'center',
  },
  scanButtonText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#FFFFFF',
    textTransform: 'uppercase',
  },
  enterOrderButton: {
    flex: 1,
    backgroundColor: '#1F2937', // Fond sombre avec bordure bleue
    paddingVertical: 18,
    borderRadius: 12,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#3B82F6',
  },
  enterOrderText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#3B82F6', // Texte bleu
    textTransform: 'uppercase',
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
