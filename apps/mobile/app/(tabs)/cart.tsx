import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text, ScrollView, TouchableOpacity, Image, ActivityIndicator, Alert, DeviceEventEmitter } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import SafeAreaWrapper from '../../components/SafeAreaWrapper';
import { useAuth } from '../../context/AuthContext';
import { useCartStore } from '../../context/CartStore';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { API_CONFIG } from '../../config/api';
import ApplePayButton from '../../components/ApplePayButton';


export default function CartScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { isAuthenticated, user } = useAuth();
  const { cart, fetchCart, updateCartItemQuantity, removeFromCart, clearCart } = useCartStore();
  const [isScrolled, setIsScrolled] = useState(false);
  const [loading, setLoading] = useState(true);
  const [showCheckoutModal, setShowCheckoutModal] = useState(false);

  // Charger les données du panier
  useEffect(() => {
    const loadCart = async () => {
      if (isAuthenticated && user?._id) {
        try {
          setLoading(true);
          await fetchCart(user._id);
        } catch (error) {
          console.error('Erreur lors du chargement du panier:', error);
        } finally {
          setLoading(false);
        }
      } else {
        setLoading(false);
      }
    };

    loadCart();
  }, [isAuthenticated, user?._id, fetchCart]);

  const handleQuantityChange = async (itemId: string, change: number) => {
    if (!isAuthenticated || !user?._id) {
      Alert.alert('Connexion requise', 'Veuillez vous connecter pour modifier le panier');
      return;
    }

    try {
      const currentItem = cart?.items?.find(item => item.productId === itemId);
      if (currentItem) {
        const newQuantity = currentItem.quantity + change;
        if (newQuantity > 0) {
          await updateCartItemQuantity(user._id, itemId, newQuantity);
        } else {
          await removeFromCart(user._id, itemId);
        }
      }
    } catch (error) {
      console.error('Erreur lors de la modification de la quantité:', error);
      Alert.alert('Erreur', 'Impossible de modifier la quantité');
    }
  };

  const handleRemoveItem = async (itemId: string) => {
    if (!isAuthenticated || !user?._id) {
      Alert.alert('Connexion requise', 'Veuillez vous connecter pour modifier le panier');
      return;
    }

    try {
      await removeFromCart(user._id, itemId);
    } catch (error) {
      console.error('Erreur lors de la suppression:', error);
      Alert.alert('Erreur', 'Impossible de supprimer l\'article');
    }
  };

  const handleClearCart = () => {
    if (!isAuthenticated || !user?._id) {
      Alert.alert('Connexion requise', 'Veuillez vous connecter pour modifier le panier');
      return;
    }

    if (!cart?.items || cart.items.length === 0) {
      Alert.alert('Panier vide', 'Votre panier est déjà vide');
      return;
    }

    Alert.alert(
      'Vider le panier',
      'Êtes-vous sûr de vouloir supprimer tous les articles de votre panier ?',
      [
        {
          text: 'Annuler',
          style: 'cancel',
        },
        {
          text: 'Vider',
          style: 'destructive',
          onPress: async () => {
            try {
              await clearCart(user._id!);
              Alert.alert('Succès', 'Votre panier a été vidé');
            } catch (error) {
              console.error('Erreur lors du vidage du panier:', error);
              Alert.alert('Erreur', 'Impossible de vider le panier');
            }
          },
        },
      ]
    );
  };

  const handleBack = () => {
    router.back();
  };

  const handleQuickCheckout = () => {
    if (!isAuthenticated || !user?._id) {
      Alert.alert('Connexion requise', 'Veuillez vous connecter pour passer commande');
      return;
    }

    if (!cart?.items || cart.items.length === 0) {
      Alert.alert('Panier vide', 'Votre panier est vide');
      return;
    }

    setShowCheckoutModal(true);
    DeviceEventEmitter.emit('checkoutModalToggle', true);
  };



  const handleApplePaySuccess = async (order: any) => {
    try {
      if (!user?._id) {
        Alert.alert('Erreur', 'Utilisateur non connecté');
        return;
      }

      // Créer la commande via l'API
      const orderData = {
        userId: user._id,
        shippingAddress: {
          street: 'Adresse par défaut',
          city: 'Tunis',
          postalCode: '1000',
          country: 'Tunisie'
        },
        paymentMethod: 'apple_pay',
        paymentIntentId: order.paymentIntentId
      };

      console.log('Création de la commande:', orderData);
      
      const response = await fetch(`${API_CONFIG.BASE_URL}/api/orders/create`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(orderData),
      });

      if (!response.ok) {
        throw new Error('Erreur lors de la création de la commande');
      }

      const createdOrder = await response.json();
      console.log('Commande créée avec succès:', createdOrder);

      // Vider le panier après création de la commande
      await clearCart(user._id);
      
      Alert.alert(
        'Paiement réussi !',
        `Votre commande #${createdOrder._id.slice(-8)} a été payée avec Apple Pay.`,
        [
          {
            text: 'OK',
            onPress: () => router.push('/(tabs)/orders')
          }
        ]
      );
    } catch (error) {
      console.error('Erreur lors de la création de la commande:', error);
      Alert.alert(
        'Erreur',
        'Erreur lors de la création de la commande. Veuillez réessayer.',
        [
          {
            text: 'OK',
            onPress: () => {}
          }
        ]
      );
    }
  };

  const handleApplePayError = (error: string) => {
    Alert.alert('Erreur de paiement', error);
  };

  const calculateSubtotal = () => {
    if (!cart?.items) return 0;
    return cart.items.reduce((total, item) => {
      const price = item.price || 0;
      const quantity = item.quantity || 0;
      return total + (price * quantity);
    }, 0);
  };

  const calculateTax = () => {
    return calculateSubtotal() * 0.05; // 5% tax
  };

  const calculateTotal = () => {
    return calculateSubtotal() + calculateTax();
  };

  const handleScroll = (event: any) => {
    const scrollY = event.nativeEvent.contentOffset.y;
    setIsScrolled(scrollY > 10);
  };

  // Écran de chargement
  if (loading) {
    return (
      <SafeAreaWrapper backgroundColor="#fff" edges={['top']}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#2E86AB" />
          <Text style={styles.loadingText}>Chargement du panier...</Text>
        </View>
      </SafeAreaWrapper>
    );
  }

  // Panier vide
  if (!cart?.items || cart.items.length === 0) {
    return (
      <SafeAreaWrapper backgroundColor="#fff" edges={['top']}>
        <View style={styles.stickyHeader}>
          <TouchableOpacity style={styles.backButton} onPress={handleBack}>
            <Ionicons name="arrow-back" size={24} color="#333" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Mon Panier</Text>
          <View style={styles.placeholder} />
        </View>
        <View style={styles.emptyContainer}>
          <Ionicons name="cart-outline" size={80} color="#ccc" />
          <Text style={styles.emptyTitle}>Votre panier est vide</Text>
          <Text style={styles.emptySubtitle}>Ajoutez des produits pour commencer vos achats</Text>
          <TouchableOpacity 
            style={styles.shopButton} 
            onPress={() => router.push('/(tabs)/menu')}
          >
            <Text style={styles.shopButtonText}>Voir le menu</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaWrapper>
    );
  }

  return (
    <SafeAreaWrapper backgroundColor="#fff" edges={['top']}>
      {/* Header sticky */}
      <View style={[
        styles.stickyHeader, 
        { top: insets.top },
        isScrolled && styles.stickyHeaderScrolled
      ]}>
        <TouchableOpacity style={styles.backButton} onPress={handleBack}>
          <Ionicons name="arrow-back" size={24} color="#333" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Mon Panier</Text>
        {cart?.items && cart.items.length > 0 && (
          <TouchableOpacity onPress={handleClearCart} style={styles.headerClearButton}>
            <Ionicons name="trash-outline" size={20} color="#2E86AB" />
          </TouchableOpacity>
        )}
      </View>
      
      <ScrollView 
        style={styles.container}
        bounces={false}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
        onScroll={handleScroll}
        scrollEventThrottle={16}
      >

        {/* Cart Items */}
        <View style={styles.cartItems}>
          {cart.items.map((item, index) => (
            <View key={`${item.id}-${index}`}>
              <View style={styles.cartItem}>
                <Image
                  source={{ uri: item.image || 'https://via.placeholder.com/100x100/FF6B35/FFFFFF?text=Image' }}
                  style={styles.itemImage}
                  resizeMode="cover"
                />
                <View style={styles.itemInfo}>
                  <Text style={styles.itemName}>{item.name || 'Produit sans nom'}</Text>
                  <Text style={styles.itemPrice}>{(item.price || 0).toFixed(2)} €</Text>
                </View>
                <View style={styles.quantityControls}>
                  <TouchableOpacity 
                    style={styles.quantityButton}
                    onPress={() => handleQuantityChange(item.productId, -1)}
                  >
                    <Ionicons name="remove" size={16} color="#333" />
                  </TouchableOpacity>
                  <Text style={styles.quantityText}>{item.quantity || 0}</Text>
                  <TouchableOpacity 
                    style={styles.quantityButton}
                    onPress={() => handleQuantityChange(item.productId, 1)}
                  >
                    <Ionicons name="add" size={16} color="#333" />
                  </TouchableOpacity>
                </View>
                <TouchableOpacity 
                  style={styles.removeButton}
                  onPress={() => handleRemoveItem(item.productId)}
                >
                  <Ionicons name="trash-outline" size={20} color="#2E86AB" />
                </TouchableOpacity>
              </View>
              {index < cart.items.length - 1 && <View style={styles.separator} />}
            </View>
          ))}
        </View>

        {/* Payment Summary */}
        <View style={styles.paymentSummary}>
          <Text style={styles.summaryTitle}>Résumé de la commande</Text>
          
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Sous-total</Text>
            <Text style={styles.summaryValue}>{calculateSubtotal().toFixed(2)} €</Text>
          </View>
          
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>TVA (5%)</Text>
            <Text style={styles.summaryValue}>{calculateTax().toFixed(2)} €</Text>
          </View>
          
          <View style={styles.summarySeparator} />
          
          <View style={styles.totalRow}>
            <Text style={styles.totalLabel}>Total</Text>
            <Text style={styles.totalValue}>{calculateTotal().toFixed(2)} €</Text>
          </View>
        </View>
      </ScrollView>

      {/* Apple Pay Button - Fixed at bottom */}
      <View style={styles.fixedActionButtons}>
        <ApplePayButton
          amount={calculateTotal()}
          onPaymentSuccess={handleApplePaySuccess}
          onPaymentError={handleApplePayError}
          disabled={loading}
        />
      </View>

    </SafeAreaWrapper>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  scrollContent: {
    flexGrow: 1,
    backgroundColor: '#fff',
    paddingTop: 100, // Espace pour le header sticky + safe area
    paddingBottom: 180, // Plus d'espace pour le bouton checkout + tab bar
  },
  stickyHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 16,
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 1000,
  },
  stickyHeaderScrolled: {
    backgroundColor: '#fff',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: '#fff',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  backButton: {
    padding: 8,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  placeholder: {
    width: 40,
  },
  headerClearButton: {
    padding: 8,
    borderRadius: 20,
    backgroundColor: 'rgba(46, 134, 171, 0.1)',
  },
  cartItems: {
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  cartItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
  },
  itemImage: {
    width: 60,
    height: 60,
    borderRadius: 8,
    marginRight: 16,
  },
  itemInfo: {
    flex: 1,
  },
  itemName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  itemPrice: {
    fontSize: 14,
    color: '#666',
  },
  quantityControls: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  quantityButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#f8f9fa',
    justifyContent: 'center',
    alignItems: 'center',
  },
  quantityText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginHorizontal: 16,
  },
  separator: {
    height: 1,
    backgroundColor: '#f0f0f0',
    marginLeft: 76,
  },
  paymentSummary: {
    paddingHorizontal: 20,
    paddingVertical: 24,
  },
  summaryTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 16,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  summaryLabel: {
    fontSize: 14,
    color: '#666',
  },
  summaryValue: {
    fontSize: 14,
    color: '#333',
  },
  summarySeparator: {
    height: 1,
    backgroundColor: '#f0f0f0',
    marginVertical: 12,
  },
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  totalLabel: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  totalValue: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  checkoutButton: {
    backgroundColor: '#2E86AB',
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  checkoutButtonDisabled: {
    backgroundColor: '#ccc',
    opacity: 0.6,
  },
  checkoutText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  // Styles pour la modal de confirmation Apple Pay
  modalOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
    zIndex: 1000,
  },
  checkoutModal: {
    backgroundColor: '#F2F2F7',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingTop: 20,
    paddingBottom: 34, // Espace pour la safe area
    paddingHorizontal: 20,
    maxHeight: '80%',
  },
  // Header Apple Pay
  applePayHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  applePayLogo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  applePayText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#000',
    marginLeft: 8,
  },
  applePayCloseButton: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: '#E5E5EA',
    justifyContent: 'center',
    alignItems: 'center',
  },
  // Payment Method Card
  paymentMethodCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  cardInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  cardIcon: {
    width: 32,
    height: 20,
    backgroundColor: '#000',
    borderRadius: 4,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  cardName: {
    fontSize: 16,
    fontWeight: '500',
    color: '#000',
    flex: 1,
  },
  cardNumber: {
    fontSize: 16,
    fontWeight: '500',
    color: '#000',
  },
  // Change Payment Method
  changePaymentCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  changePaymentText: {
    fontSize: 16,
    color: '#000',
  },
  // Transaction Details
  transactionDetails: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  merchantName: {
    fontSize: 14,
    color: '#8E8E93',
    marginBottom: 8,
  },
  amountContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  amountText: {
    fontSize: 24,
    fontWeight: '600',
    color: '#000',
  },
  // Confirmation Section
  confirmationSection: {
    alignItems: 'center',
    marginTop: 20,
    marginBottom: 10,
  },
  confirmationIconContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  phoneIcon: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#FFFFFF',
    borderWidth: 2,
    borderColor: '#007AFF',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 8,
  },
  arrowIcon: {
    marginLeft: 4,
  },
  confirmationText: {
    fontSize: 16,
    color: '#000',
    textAlign: 'center',
    lineHeight: 22,
    fontWeight: '400',
  },
  fixedActionButtons: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#fff',
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 120, // Plus d'espace pour la tab bar
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
    gap: 12,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: '#666',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40,
  },
  emptyTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginTop: 20,
    marginBottom: 8,
  },
  emptySubtitle: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginBottom: 30,
  },
  shopButton: {
    backgroundColor: '#2E86AB',
    paddingHorizontal: 30,
    paddingVertical: 15,
    borderRadius: 25,
  },
  shopButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  removeButton: {
    padding: 8,
    marginLeft: 10,
  },
});