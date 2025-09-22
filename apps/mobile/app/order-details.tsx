import React, { useState, useEffect, useCallback } from 'react';
import {
  StyleSheet,
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Image,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useSafeNavigation } from '../hooks/useSafeNavigation';
import SafeAreaWrapper from '../components/SafeAreaWrapper';
import { useAuth } from '../context/AuthContext';
import { API_CONFIG } from '../config/api';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useLocalSearchParams } from 'expo-router';
import { OrientalColors } from '../constants/Colors';
import { getAddressesByUser } from '../services/api';
import { Address } from './shipping-address';
import TrackingCard from '../components/TrackingCard';

interface Order {
  _id: string;
  userId: string;
  products: {
    name: string;
    qty: number;
    image: string;
    price: number;
  }[];
  subtotal: number;
  shipping: number;
  tax: number;
  total: number;
  createdAt: string;
  isOrdered: boolean;
  status: 'active' | 'completed' | 'cancelled' | 'confirmed';
  shippingAddress: {
    fullName?: string;
    street: string;
    city: string;
    postalCode: string;
    country: string;
  };
  paymentMethod?: string;
  paymentIntentId?: string;
}

export default function OrderDetailsScreen() {
  const insets = useSafeAreaInsets();
  const { safeBack } = useSafeNavigation();
  const { user } = useAuth();
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [userAddress, setUserAddress] = useState<Address | null>(null);

  const { orderId } = useLocalSearchParams<{ orderId: string }>();

  // Fonction pour récupérer les détails de la commande
  const fetchOrderDetails = useCallback(async () => {
    if (!user?._id || !orderId) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);
      
      const token = await AsyncStorage.getItem('authToken');
      if (!token) {
        throw new Error('Token d\'authentification manquant');
      }
      
      const response = await fetch(`${API_CONFIG.BASE_URL}/api/orders/${orderId}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`Erreur HTTP: ${response.status}`);
      }

      const data = await response.json();
      console.log('📦 Données de la commande récupérées:', JSON.stringify(data, null, 2));
      console.log('💳 Informations de paiement:', {
        paymentMethod: data.paymentMethod,
        paymentIntentId: data.paymentIntentId,
        isOrdered: data.isOrdered
      });
      setOrder(data);
    } catch (err) {
      console.error('❌ Erreur lors de la récupération des détails de la commande:', err);
      setError(err instanceof Error ? err.message : 'Erreur inconnue');
    } finally {
      setLoading(false);
    }
  }, [user?._id, orderId]);

  // Fonction pour récupérer l'adresse de l'utilisateur
  const fetchUserAddress = useCallback(async () => {
    if (!user?._id) return;

    try {
      // D'abord, essayer de récupérer les adresses depuis la table Address
      const addresses = await getAddressesByUser(user._id);
      console.log('🏠 Adresses de l\'utilisateur récupérées:', addresses);
      
      // Prendre l'adresse par défaut ou la première disponible
      const defaultAddress = addresses.find((addr: Address) => addr.isDefault) || addresses[0];
      
      if (defaultAddress) {
        setUserAddress(defaultAddress);
        console.log('🏠 Adresse sélectionnée depuis la table Address:', defaultAddress);
      } else if (user.address) {
        // Si pas d'adresse dans la table Address, utiliser l'adresse du profil utilisateur
        console.log('🏠 Utilisation de l\'adresse du profil utilisateur:', user.address);
        
        // Parser l'adresse du profil pour créer un objet Address
        // Format attendu: "123 Rue de la Paix, 75001 Paris, France"
        const addressParts = user.address.split(', ');
        let streetAddress = addressParts[0] || user.address;
        let city = 'Ville inconnue';
        let postalCode = '00000';
        let country = 'Pays inconnu';
        
        if (addressParts.length >= 2) {
          // Extraire le code postal et la ville de "75001 Paris"
          const cityPart = addressParts[1].trim();
          const cityMatch = cityPart.match(/^(\d+)\s+(.+)$/);
          if (cityMatch) {
            postalCode = cityMatch[1];
            city = cityMatch[2];
          } else {
            city = cityPart;
          }
        }
        
        if (addressParts.length >= 3) {
          country = addressParts[2].trim();
        }
        
        const userAddressFromProfile: Address = {
          _id: 'profile-address',
          userId: user._id,
          fullName: user.name || 'Utilisateur',
          streetAddress: streetAddress,
          city: city,
          state: '', // Pas d'état dans ce format
          postalCode: postalCode,
          country: country,
          isDefault: true
        };
        
        setUserAddress(userAddressFromProfile);
        console.log('🏠 Adresse du profil formatée:', userAddressFromProfile);
      }
    } catch (error) {
      console.error('❌ Erreur lors de la récupération de l\'adresse:', error);
      
      // En cas d'erreur, utiliser l'adresse du profil utilisateur
      if (user.address) {
        console.log('🏠 Fallback: utilisation de l\'adresse du profil utilisateur:', user.address);
        
        // Parser l'adresse du profil pour créer un objet Address
        const addressParts = user.address.split(', ');
        let streetAddress = addressParts[0] || user.address;
        let city = 'Ville inconnue';
        let postalCode = '00000';
        let country = 'Pays inconnu';
        
        if (addressParts.length >= 2) {
          const cityPart = addressParts[1].trim();
          const cityMatch = cityPart.match(/^(\d+)\s+(.+)$/);
          if (cityMatch) {
            postalCode = cityMatch[1];
            city = cityMatch[2];
          } else {
            city = cityPart;
          }
        }
        
        if (addressParts.length >= 3) {
          country = addressParts[2].trim();
        }
        
        const userAddressFromProfile: Address = {
          _id: 'profile-address',
          userId: user._id,
          fullName: user.name || 'Utilisateur',
          streetAddress: streetAddress,
          city: city,
          state: '', // Pas d'état dans ce format
          postalCode: postalCode,
          country: country,
          isDefault: true
        };
        setUserAddress(userAddressFromProfile);
      }
    }
  }, [user?._id, user?.address, user?.name]);

  useEffect(() => {
    fetchOrderDetails();
    fetchUserAddress();
  }, [orderId, fetchOrderDetails, fetchUserAddress]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return OrientalColors.success;
      case 'active':
      case 'confirmed':
        return OrientalColors.warning;
      case 'cancelled':
        return OrientalColors.error;
      default:
        return OrientalColors.textSecondary;
    }
  };

  const getStatusDisplayText = (status: string) => {
    switch (status) {
      case 'completed':
        return 'Livré';
      case 'active':
        return 'En cours';
      case 'confirmed':
        return 'Confirmé';
      case 'cancelled':
        return 'Annulé';
      default:
        return status;
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('fr-FR', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const handleCancelOrder = () => {
    Alert.alert(
      'Annuler la commande',
      'Êtes-vous sûr de vouloir annuler cette commande ?',
      [
        { text: 'Non', style: 'cancel' },
        { text: 'Oui', style: 'destructive', onPress: () => {
          console.log('Annulation de la commande:', orderId);
        }}
      ]
    );
  };

  if (loading) {
    return (
      <SafeAreaWrapper backgroundColor={OrientalColors.background} edges={['top']}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={OrientalColors.primary} />
          <Text style={styles.loadingText}>Chargement des détails...</Text>
        </View>
      </SafeAreaWrapper>
    );
  }

  if (!orderId) {
    return (
      <SafeAreaWrapper backgroundColor={OrientalColors.background} edges={['top']}>
        <View style={styles.errorContainer}>
          <Ionicons name="alert-circle" size={48} color={OrientalColors.error} />
          <Text style={styles.errorTitle}>Erreur</Text>
          <Text style={styles.errorMessage}>ID de commande manquant</Text>
          <TouchableOpacity style={styles.retryButton} onPress={safeBack}>
            <Text style={styles.retryButtonText}>Retour</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaWrapper>
    );
  }

  if (error || !order) {
  return (
      <SafeAreaWrapper backgroundColor={OrientalColors.background} edges={['top']}>
        <View style={styles.errorContainer}>
          <Ionicons name="alert-circle" size={48} color={OrientalColors.error} />
          <Text style={styles.errorTitle}>Erreur de chargement</Text>
          <Text style={styles.errorMessage}>{error || 'Commande introuvable'}</Text>
          <TouchableOpacity style={styles.retryButton} onPress={fetchOrderDetails}>
            <Text style={styles.retryButtonText}>Réessayer</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaWrapper>
    );
  }

  return (
    <SafeAreaWrapper backgroundColor="#f5f5f5" edges={['top']}>
      {/* Header */}
      <View style={[styles.header, { paddingTop: insets.top + 8 }]}>
        <TouchableOpacity style={styles.backButton} onPress={safeBack}>
          <Ionicons name="arrow-back" size={24} color="#333" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Détails de la commande</Text>
        <View style={styles.placeholder} />
              </View>

      <ScrollView 
        style={styles.container} 
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Order Info Card */}
        <View style={styles.card}>
          <View style={styles.orderHeader}>
            <Text style={styles.orderNumber}>Commande #{order._id.slice(-8).toUpperCase()}</Text>
            <View style={[styles.statusBadge, { backgroundColor: getStatusColor(order.status) }]}>
              <Text style={[styles.statusText, { color: '#fff' }]}>
                {getStatusDisplayText(order.status)}
              </Text>
            </View>
          </View>
          <Text style={styles.orderDate}>Commandé le {formatDate(order.createdAt)}</Text>
        </View>

        {/* Products List */}
        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Produits commandés</Text>
          {order.products && order.products.length > 0 ? (
            order.products.map((product, index) => (
              <View key={index} style={styles.productItem}>
                <Image
                  source={{ uri: product.image }}
                  style={styles.productImage}
                  resizeMode="cover"
                />
                <View style={styles.productDetails}>
                  <Text style={styles.productName}>{product.name}</Text>
                  <Text style={styles.productQuantity}>Quantité: {product.qty}</Text>
                  <Text style={styles.productPrice}>
                    {(product.price * product.qty).toFixed(2)} €
                  </Text>
                </View>
              </View>
            ))
          ) : (
            <Text style={styles.noProductsText}>Aucun produit trouvé</Text>
          )}
        </View>

        {/* Order Summary */}
        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Résumé de la commande</Text>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Sous-total</Text>
            <Text style={styles.summaryValue}>{order.subtotal.toFixed(2)} €</Text>
          </View>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Livraison</Text>
            <Text style={styles.summaryValue}>{order.shipping.toFixed(2)} €</Text>
          </View>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>TVA (5%)</Text>
            <Text style={styles.summaryValue}>{order.tax.toFixed(2)} €</Text>
          </View>
          <View style={styles.summarySeparator} />
          <View style={styles.totalRow}>
            <Text style={styles.totalLabel}>Total</Text>
            <Text style={styles.totalValue}>{order.total.toFixed(2)} €</Text>
          </View>
        </View>

        {/* Payment Info */}
        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Informations de paiement</Text>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Méthode de paiement</Text>
            <Text style={styles.infoValue}>
              {order.paymentMethod === 'apple_pay' ? 'Apple Pay' : 
               order.paymentMethod === 'card' ? 'Carte bancaire' :
               order.paymentMethod === 'cash' ? 'Espèces' :
               order.paymentIntentId ? 'Apple Pay' : // Si paymentIntentId existe, c'est probablement Apple Pay
               order.paymentMethod || 'Apple Pay'} {/* Par défaut Apple Pay pour les commandes payées */}
          </Text>
          </View>
          {order.paymentIntentId && (
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>ID de transaction</Text>
              <Text style={styles.infoValue}>{order.paymentIntentId.slice(-8)}</Text>
            </View>
          )}
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Statut du paiement</Text>
            <Text style={[styles.infoValue, { color: '#228B22' }]}>Payé</Text>
          </View>
        </View>

        {/* Shipping Address */}
        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Adresse de livraison</Text>
          <View style={styles.addressContainer}>
            <Ionicons name="location-outline" size={20} color="#666" />
            <View style={styles.addressText}>
              {userAddress ? (
                <>
                  <Text style={styles.addressLine}>{userAddress.streetAddress}</Text>
                  <Text style={styles.addressLine}>
                    {userAddress.postalCode} {userAddress.city}
                  </Text>
                  <Text style={styles.addressLine}>
                    {userAddress.state ? `${userAddress.state}, ` : ''}{userAddress.country}
                  </Text>
                </>
              ) : (
                <>
                  {order.shippingAddress.fullName && (
                    <Text style={styles.addressLine}>{order.shippingAddress.fullName}</Text>
                  )}
                  <Text style={styles.addressLine}>
                    {order.shippingAddress.street || 'Adresse non spécifiée'}
                  </Text>
                  <Text style={styles.addressLine}>
                    {order.shippingAddress.postalCode || 'Code postal non spécifié'} {order.shippingAddress.city || 'Ville non spécifiée'}
                  </Text>
                  <Text style={styles.addressLine}>
                    {order.shippingAddress.country || 'Pays non spécifié'}
                  </Text>
                </>
              )}
            </View>
          </View>
        </View>

        {/* Tracking Section */}
        {order.status === 'active' && (
          <TrackingCard 
            orderId={order._id}
          />
        )}

        {/* Action Buttons */}
        {order.status === 'active' && (
          <View style={styles.actionButtons}>
            <TouchableOpacity style={styles.cancelButton} onPress={handleCancelOrder}>
              <Ionicons name="close-circle-outline" size={20} color="#FF3B30" />
              <Text style={styles.cancelButtonText}>Annuler la commande</Text>
          </TouchableOpacity>
        </View>
        )}
      </ScrollView>
    </SafeAreaWrapper>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  scrollContent: {
    paddingBottom: 100, // Espace pour la tabBar
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingBottom: 16,
    backgroundColor: '#f5f5f5',
  },
  backButton: {
    padding: 8,
  },
  headerTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  placeholder: {
    width: 40,
  },
  card: {
    backgroundColor: '#fff',
    marginHorizontal: 16,
    marginBottom: 16,
    borderRadius: 12,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.05,
    shadowRadius: 1,
    elevation: 1,
  },
  orderHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  orderNumber: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#333',
  },
  orderDate: {
    fontSize: 12,
    color: '#666',
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
    opacity: 0.8,
  },
  statusText: {
    fontSize: 10,
    fontWeight: 'bold',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 16,
  },
  productItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  productImage: {
    width: 60,
    height: 60,
    borderRadius: 8,
    marginRight: 16,
  },
  productDetails: {
    flex: 1,
  },
  productName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 4,
  },
  productQuantity: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
  },
  productPrice: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#2E86AB',
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
    fontWeight: '500',
  },
  summarySeparator: {
    height: 1,
    backgroundColor: '#E5E5E5',
    marginVertical: 12,
  },
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  totalLabel: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  totalValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2E86AB',
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  infoLabel: {
    fontSize: 14,
    color: '#666',
  },
  infoValue: {
    fontSize: 14,
    color: '#333',
    fontWeight: '500',
  },
  addressContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  addressText: {
    marginLeft: 12,
    flex: 1,
  },
  addressLine: {
    fontSize: 14,
    color: '#333',
    marginBottom: 4,
  },
  actionButtons: {
    paddingHorizontal: 16,
    paddingBottom: 20,
  },
  cancelButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#FF3B30',
    borderRadius: 12,
    paddingVertical: 16,
    paddingHorizontal: 20,
  },
  cancelButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FF3B30',
    marginLeft: 8,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: '#666',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  errorTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FF3B30',
    marginTop: 16,
    marginBottom: 8,
  },
  errorMessage: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    marginBottom: 20,
  },
  retryButton: {
    backgroundColor: '#2E86AB',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  retryButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  noProductsText: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    fontStyle: 'italic',
    marginVertical: 20,
  },
});