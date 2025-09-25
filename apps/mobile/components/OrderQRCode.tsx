import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import QRCode from 'react-native-qrcode-svg';
import { Ionicons } from '@expo/vector-icons';
import { OrientalColors } from '../constants/Colors';

interface OrderQRCodeProps {
  orderId: string;
  orderData?: {
    customerName?: string;
    restaurantName?: string;
    totalAmount?: number;
    items?: string[];
  };
  size?: number;
  showDetails?: boolean;
  onShare?: () => void;
}

export default function OrderQRCode({
  orderId,
  orderData,
  size = 200,
  showDetails = true,
  onShare,
}: OrderQRCodeProps) {
  
  // Créer les données du QR code
  const qrData = JSON.stringify({
    orderId,
    type: 'order_tracking',
    timestamp: new Date().toISOString(),
    ...orderData,
  });

  const handleShare = () => {
    if (onShare) {
      onShare();
    } else {
      Alert.alert(
        'Share QR Code',
        'This QR code contains your order information for tracking.',
        [
          { text: 'Cancel', style: 'cancel' },
          { text: 'Share', onPress: () => {
            // Ici vous pourriez implémenter le partage
            console.log('Sharing QR code for order:', orderId);
          }}
        ]
      );
    }
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>Order QR Code</Text>
        <TouchableOpacity style={styles.shareButton} onPress={handleShare}>
          <Ionicons name="share-outline" size={20} color={OrientalColors.primary} />
        </TouchableOpacity>
      </View>

      {/* QR Code */}
      <View style={styles.qrContainer}>
        <QRCode
          value={qrData}
          size={size}
          color="#000000"
          backgroundColor="#FFFFFF"
          logo={undefined} // Vous pourriez ajouter un logo ici
          logoSize={30}
          logoBackgroundColor="transparent"
          logoMargin={2}
          logoBorderRadius={15}
          quietZone={10}
          enableLinearGradient={false}
          gradientDirection="vertical"
          linearGradient={['rgb(255,0,0)', 'rgb(0,255,255)']}
          ecl="M"
        />
      </View>

      {/* Order Details */}
      {showDetails && orderData && (
        <View style={styles.detailsContainer}>
          <Text style={styles.orderId}>Order #{orderId.slice(-8).toUpperCase()}</Text>
          
          {orderData.restaurantName && (
            <Text style={styles.restaurantName}>{orderData.restaurantName}</Text>
          )}
          
          {orderData.customerName && (
            <Text style={styles.customerName}>Customer: {orderData.customerName}</Text>
          )}
          
          {orderData.totalAmount && (
            <Text style={styles.totalAmount}>Total: ${orderData.totalAmount.toFixed(2)}</Text>
          )}
          
          {orderData.items && orderData.items.length > 0 && (
            <View style={styles.itemsContainer}>
              <Text style={styles.itemsTitle}>Items:</Text>
              {orderData.items.slice(0, 3).map((item, index) => (
                <Text key={index} style={styles.itemText}>• {item}</Text>
              ))}
              {orderData.items.length > 3 && (
                <Text style={styles.moreItems}>+{orderData.items.length - 3} more items</Text>
              )}
            </View>
          )}
        </View>
      )}

      {/* Instructions */}
      <View style={styles.instructionsContainer}>
        <Text style={styles.instructionsTitle}>Instructions:</Text>
        <Text style={styles.instructionText}>
          • Show this QR code to the driver when they arrive
        </Text>
        <Text style={styles.instructionText}>
          • The driver will scan this code to confirm delivery
        </Text>
        <Text style={styles.instructionText}>
          • Keep this code safe until your order is delivered
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 20,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
    marginBottom: 20,
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
  },
  shareButton: {
    padding: 8,
    borderRadius: 20,
    backgroundColor: '#f5f5f5',
  },
  qrContainer: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 12,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  detailsContainer: {
    width: '100%',
    marginBottom: 20,
  },
  orderId: {
    fontSize: 16,
    fontWeight: '600',
    color: OrientalColors.primary,
    textAlign: 'center',
    marginBottom: 8,
  },
  restaurantName: {
    fontSize: 14,
    fontWeight: '500',
    color: '#333',
    textAlign: 'center',
    marginBottom: 4,
  },
  customerName: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    marginBottom: 4,
  },
  totalAmount: {
    fontSize: 14,
    fontWeight: '500',
    color: '#333',
    textAlign: 'center',
    marginBottom: 12,
  },
  itemsContainer: {
    alignItems: 'center',
  },
  itemsTitle: {
    fontSize: 14,
    fontWeight: '500',
    color: '#333',
    marginBottom: 4,
  },
  itemText: {
    fontSize: 12,
    color: '#666',
    marginBottom: 2,
  },
  moreItems: {
    fontSize: 12,
    color: '#999',
    fontStyle: 'italic',
  },
  instructionsContainer: {
    width: '100%',
    backgroundColor: '#f8f9fa',
    borderRadius: 8,
    padding: 16,
  },
  instructionsTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
  },
  instructionText: {
    fontSize: 12,
    color: '#666',
    marginBottom: 4,
    lineHeight: 16,
  },
});
