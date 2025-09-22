import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { StripeProvider, useStripe } from '@stripe/stripe-react-native';
import { getApplePayConfig, createApplePayPayment, confirmApplePayPayment, ApplePayConfig } from '../services/applePayService';
import ApplePayModal from './ApplePayModal';

interface ApplePayButtonProps {
  amount: number;
  onPaymentSuccess: (order: any) => void;
  onPaymentError: (error: string) => void;
  disabled?: boolean;
}

const ApplePayButtonComponent: React.FC<ApplePayButtonProps> = ({
  amount,
  onPaymentSuccess,
  onPaymentError,
  disabled = false,
}) => {
  const { presentApplePay, confirmPayment } = useStripe();
  const [isLoading, setIsLoading] = useState(false);
  const [applePayConfig, setApplePayConfig] = useState<ApplePayConfig | null>(null);
  const [showModal, setShowModal] = useState(false);

  // Vérifier si Apple Pay est disponible
  const isApplePayAvailable = Platform.OS === 'ios';

  useEffect(() => {
    if (isApplePayAvailable && amount > 0) {
      loadApplePayConfig();
    }
  }, [amount, isApplePayAvailable]);

  const loadApplePayConfig = async () => {
    try {
      const config = await getApplePayConfig(amount);
      if (config) {
        setApplePayConfig(config);
      }
    } catch (error) {
      console.error('Erreur chargement config Apple Pay:', error);
    }
  };

  const handleApplePayPress = async () => {
    if (!isApplePayAvailable) {
      Alert.alert('Apple Pay non disponible', 'Apple Pay n\'est disponible que sur iOS');
      return;
    }

    setShowModal(true);
  };

  const handleModalClose = () => {
    setShowModal(false);
  };

  const handlePaymentConfirm = async () => {
    setIsLoading(true);
    setShowModal(false);

    try {
      // Simuler un paiement réussi avec plus de détails
      const mockOrder = {
        _id: 'mock_order_' + Date.now(),
        total: amount,
        subtotal: amount * 0.95, // 95% du total (sans TVA)
        tax: amount * 0.05, // 5% TVA
        shipping: 0,
        status: 'confirmed',
        paymentMethod: 'apple_pay',
        paymentIntentId: 'pi_mock_' + Date.now(),
        createdAt: new Date().toISOString(),
        products: [], // Sera rempli par le contexte du panier
      };
      
      // Appeler le callback de succès pour créer la commande et vider le panier
      onPaymentSuccess(mockOrder);
    } catch (error) {
      onPaymentError('Erreur simulation paiement');
    } finally {
      setIsLoading(false);
    }
  };

  if (!isApplePayAvailable) {
    return null;
  }

  return (
    <>
      <TouchableOpacity
        style={[styles.applePayButton, disabled && styles.disabledButton]}
        onPress={handleApplePayPress}
        disabled={disabled || isLoading || !applePayConfig}
      >
        <View style={styles.buttonContent}>
          <Ionicons name="logo-apple" size={20} color="#fff" />
          <Text style={styles.buttonText}>
            {isLoading ? 'Traitement...' : 'Payer avec Apple Pay'}
          </Text>
        </View>
      </TouchableOpacity>

      <ApplePayModal
        visible={showModal}
        amount={amount}
        onClose={handleModalClose}
        onConfirm={handlePaymentConfirm}
        merchantName="Dar Darkom"
      />
    </>
  );
};

const ApplePayButton: React.FC<ApplePayButtonProps> = (props) => {
  // Clé Stripe de test
  const publishableKey = 'pk_test_51S7dtN2L9pIN7jnXtw1RwV3GFxrif49mPlh06CPwh6MqnwGo9d6O7KKVYkeieAC8yAVfzpWwFeWYuDzuSfWhq9IC00FTP21PeH';

  return (
    <StripeProvider publishableKey={publishableKey}>
      <ApplePayButtonComponent {...props} />
    </StripeProvider>
  );
};

const styles = StyleSheet.create({
  applePayButton: {
    backgroundColor: '#000',
    borderRadius: 8,
    paddingVertical: 16,
    paddingHorizontal: 20,
    marginVertical: 8,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  disabledButton: {
    backgroundColor: '#ccc',
    opacity: 0.6,
  },
  buttonContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
});

export default ApplePayButton;
