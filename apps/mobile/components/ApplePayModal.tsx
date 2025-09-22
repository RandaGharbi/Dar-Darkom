import React, { useEffect, useRef } from 'react';
import {
  View,
  Text,
  Modal,
  TouchableOpacity,
  StyleSheet,
  Animated,
  Dimensions,
  StatusBar,
  Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface ApplePayModalProps {
  visible: boolean;
  amount: number;
  onClose: () => void;
  onConfirm: () => void;
  merchantName?: string;
}

const { width, height } = Dimensions.get('window');

const ApplePayModal: React.FC<ApplePayModalProps> = ({
  visible,
  amount,
  onClose,
  onConfirm,
  merchantName = 'Dar Darkom - Restaurant Oriental',
}) => {
  const slideAnim = useRef(new Animated.Value(height)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.95)).current;

  useEffect(() => {
    if (visible) {
      StatusBar.setBarStyle('dark-content', true);
      
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.spring(slideAnim, {
          toValue: 0,
          tension: 100,
          friction: 8,
          useNativeDriver: true,
        }),
        Animated.spring(scaleAnim, {
          toValue: 1,
          tension: 100,
          friction: 8,
          useNativeDriver: true,
        }),
      ]).start();
    } else {
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 0,
          duration: 200,
          useNativeDriver: true,
        }),
        Animated.timing(slideAnim, {
          toValue: height,
          duration: 200,
          useNativeDriver: true,
        }),
        Animated.timing(scaleAnim, {
          toValue: 0.95,
          duration: 200,
          useNativeDriver: true,
        }),
      ]).start();
    }
  }, [visible]);

  const handleClose = () => {
    onClose();
  };

  const handleConfirm = () => {
    onConfirm();
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="none"
      statusBarTranslucent
      onRequestClose={handleClose}
    >
      <Animated.View style={[styles.overlay, { opacity: fadeAnim }]}>
        <TouchableOpacity
          style={styles.backdrop}
          activeOpacity={1}
          onPress={handleClose}
        />
        
        <Animated.View
          style={[
            styles.modalContainer,
            {
              transform: [
                { translateY: slideAnim },
                { scale: scaleAnim },
              ],
            },
          ]}
        >
          {/* Header */}
          <View style={styles.header}>
            <View style={styles.headerLeft}>
              <Ionicons name="logo-apple" size={24} color="#000" />
              <Text style={styles.applePayText}>Pay</Text>
            </View>
            <TouchableOpacity onPress={handleClose} style={styles.closeButton}>
              <Ionicons name="close" size={20} color="#666" />
            </TouchableOpacity>
          </View>

          {/* Payment Method Card */}
          <View style={styles.paymentMethodCard}>
            <View style={styles.cardContent}>
              <View style={styles.cardLeft}>
                <View style={styles.cardIcon}>
                  <Text style={styles.cardText}>swile</Text>
                </View>
                <Text style={styles.cardName}>Swile</Text>
              </View>
              <Text style={styles.cardNumber}>•••• 2856</Text>
            </View>
          </View>

          {/* Change Payment Method */}
          <View style={styles.changePaymentCard}>
            <Text style={styles.changePaymentText}>Changer de mode de paiement</Text>
            <Ionicons name="chevron-forward" size={20} color="#999" />
          </View>

          {/* Transaction Details */}
          <View style={styles.transactionSection}>
            <View style={styles.transactionDescription}>
              <Text style={styles.descriptionText}>Payer {merchantName}</Text>
            </View>
            
            <View style={styles.amountSection}>
              <Text style={styles.amountValue}>{amount.toFixed(2).replace('.', ',')} €</Text>
              <Ionicons name="chevron-forward" size={20} color="#999" />
            </View>
          </View>

          {/* Pay Button Section */}
          <View style={styles.payButtonSection}>
            <TouchableOpacity 
              style={styles.payButton}
              onPress={onConfirm}
            >
              <Text style={styles.payButtonText}>Payer</Text>
            </TouchableOpacity>
          </View>
        </Animated.View>
      </Animated.View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    justifyContent: 'flex-end',
    alignItems: 'stretch',
  },
  backdrop: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  modalContainer: {
    width: '100%',
    backgroundColor: '#E5E5E7',
    borderRadius: 20,
    marginBottom: 0,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 25,
    },
    shadowOpacity: 0.25,
    shadowRadius: 50,
    elevation: 25,
    overflow: 'hidden',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0, 0, 0, 0.1)',
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  applePayText: {
    fontSize: 22,
    fontWeight: '600',
    color: '#000',
  },
  closeButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(0, 0, 0, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  paymentMethodCard: {
    margin: 16,
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 2,
  },
  cardContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  cardLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  cardIcon: {
    width: 40,
    height: 26,
    backgroundColor: '#000',
    borderRadius: 4,
    justifyContent: 'center',
    alignItems: 'center',
  },
  cardText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#fff',
    textTransform: 'lowercase',
  },
  cardName: {
    fontSize: 18,
    fontWeight: '500',
    color: '#000',
  },
  cardNumber: {
    fontSize: 18,
    fontWeight: '400',
    color: '#000',
    letterSpacing: 0.5,
  },
  changePaymentCard: {
    marginHorizontal: 16,
    marginBottom: 16,
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 2,
  },
  changePaymentText: {
    fontSize: 18,
    color: '#000',
    fontWeight: '400',
  },
  transactionSection: {
    marginBottom: 24,
  },
  transactionDescription: {
    marginHorizontal: 16,
    marginBottom: 8,
  },
  descriptionText: {
    fontSize: 16,
    color: '#8E8E93',
    fontWeight: '400',
  },
  amountSection: {
    marginHorizontal: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  amountValue: {
    fontSize: 36,
    fontWeight: '700',
    color: '#000',
    letterSpacing: -1,
  },
  payButtonSection: {
    alignItems: 'center',
    marginBottom: 32,
    paddingHorizontal: 16,
  },
  payButton: {
    backgroundColor: '#007AFF',
    borderRadius: 12,
    paddingVertical: 16,
    paddingHorizontal: 32,
    minWidth: 120,
    alignItems: 'center',
    shadowColor: '#007AFF',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  payButtonText: {
    fontSize: 18,
    color: '#fff',
    fontWeight: '600',
    textAlign: 'center',
  },
});

export default ApplePayModal;