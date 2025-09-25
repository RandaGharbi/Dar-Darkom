import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  Platform,
} from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { useAuth } from "../../context/AuthContext";
import { useOrder } from "../../context/OrderContext";
import { useOrderTracking } from "../../hooks/useOrderTracking";
import OrderNotificationBanner from "../../components/OrderNotificationBanner";

export default function OrderReceivedScreen() {
  const router = useRouter();
  const { user } = useAuth();
  const { lastOrder } = useOrder();
  const params = useLocalSearchParams();
  const orderId = params.orderId as string;
  
  // Récupérer la commande
  const order = params.order ? JSON.parse(params.order as string) : lastOrder;
  
  // Tracking en temps réel
  const { orderData, isConnected, isLoading } = useOrderTracking(orderId || '');
  
  // État pour la notification
  const [showNotification, setShowNotification] = useState(false);
  const [notificationMessage, setNotificationMessage] = useState('');
  const [previousStatus, setPreviousStatus] = useState<string>('');
  
  // Détecter les changements de statut pour afficher la notification et rediriger
  useEffect(() => {
    console.log('📱 MOBILE - OrderReceived - Statut de commande:', {
      current: orderData?.status,
      previous: previousStatus,
      orderId: orderData?.orderId,
      expectedOrderId: orderId
    });
    
    if (orderData?.status && previousStatus && previousStatus !== orderData.status) {
      console.log('📱 MOBILE - OrderReceived - Changement de statut détecté:', previousStatus, '→', orderData.status);
      
      // Si le statut passe à 'preparing', rediriger vers l'écran de statut
      if (orderData.status === 'preparing') {
        console.log('📱 MOBILE - OrderReceived - Redirection vers order-status');
        router.replace(`/order-status/${orderId}`);
        return;
      }
    }
    
    // Mettre à jour le statut précédent
    if (orderData?.status) {
      setPreviousStatus(orderData.status);
    }
  }, [orderData?.status, previousStatus, orderId, router]);

  // Polling de fallback pour vérifier le statut de la commande
  useEffect(() => {
    const interval = setInterval(async () => {
      try {
        console.log('📱 MOBILE - OrderReceived - Polling - Vérification du statut...');
        const response = await fetch(`http://192.168.1.73:5000/api/orders/${orderId}`);
        if (response.ok) {
          const orderData = await response.json();
          console.log('📱 MOBILE - OrderReceived - Polling - Statut actuel:', orderData.status);
          
          if (orderData.status === 'preparing') {
            console.log('📱 MOBILE - OrderReceived - Polling - Redirection vers order-status');
            router.replace(`/order-status/${orderId}`);
          }
        }
      } catch (error) {
        console.error('📱 MOBILE - OrderReceived - Polling - Erreur:', error);
      }
    }, 3000); // Vérifier toutes les 3 secondes

    return () => clearInterval(interval);
  }, [orderId, router]);
  
  // Calculer l'heure d'arrivée estimée (20-40 minutes)
  const now = new Date();
  const estimatedStart = new Date(now.getTime() + 20 * 60000); // +20 min
  const estimatedEnd = new Date(now.getTime() + 40 * 60000); // +40 min
  
  const formatTime = (date: Date) => 
    date.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' });
  
  const estimatedArrival = `${formatTime(estimatedStart)}-${formatTime(estimatedEnd)}`;
  
  // Fonction pour gérer le retour en arrière
  const safeBack = () => {
    router.back();
  };
  
  // Mapping des produits pour les icônes
  const products = order?.products || order?.items || [];
  
  // Icônes par défaut si pas de produits (correspondant à la maquette)
  const defaultIcons = [
    { name: 'restaurant', color: '#8B5CF6' }, // Violet pour le premier
    { name: 'cube', color: '#D97706' },      // Orange pour le deuxième  
    { name: 'wine', color: '#F59E0B' }       // Jaune pour le troisième
  ];
  
  const getProductIcon = (product: any, index: number) => {
    const defaultIcon = defaultIcons[index % defaultIcons.length];
    
    // Mapping basé sur le nom du produit avec les couleurs de la maquette
    if (product?.name?.toLowerCase().includes('burger')) {
      return { name: 'restaurant', color: '#8B5CF6' };
    } else if (product?.name?.toLowerCase().includes('drink') || product?.name?.toLowerCase().includes('boisson')) {
      return { name: 'wine', color: '#F59E0B' };
    } else if (product?.name?.toLowerCase().includes('dessert') || product?.name?.toLowerCase().includes('sweet')) {
      return { name: 'ice-cream', color: '#E91E63' };
    } else {
      return defaultIcon;
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Notification Banner */}
      <OrderNotificationBanner
        visible={showNotification}
        storeName="Dar Darkom"
        message={notificationMessage}
        onClose={() => setShowNotification(false)}
      />
      
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={safeBack}>
          <Ionicons name="close" size={24} color="#000" />
        </TouchableOpacity>
        
        <View style={styles.headerRight}>
          <TouchableOpacity style={styles.headerButton}>
            <Ionicons name="share-outline" size={20} color="#000" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.headerButton}>
            <Text style={styles.helpText}>Help</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Main Content */}
      <View style={styles.content}>
        {/* Order Status */}
        <View style={styles.statusSection}>
          <Text style={styles.title}>Order received</Text>
          <Text style={styles.subtitle}>Estimated arrival {estimatedArrival}</Text>
        </View>

        {/* Product Icons */}
        <View style={styles.iconsContainer}>
          {products.length > 0 ? (
            products.slice(0, 3).map((product: any, index: number) => {
              const icon = getProductIcon(product, index);
              return (
                <View key={index} style={styles.iconWrapper}>
                  <Ionicons 
                    name={icon.name as any} 
                    size={40} 
                    color={icon.color} 
                  />
                </View>
              );
            })
          ) : (
            defaultIcons.map((icon, index) => (
              <View key={index} style={styles.iconWrapper}>
                <Ionicons 
                  name={icon.name as any} 
                  size={40} 
                  color={icon.color} 
                />
              </View>
            ))
          )}
        </View>

        {/* Need Help Section */}
        <View style={styles.helpSection}>
          <View style={styles.helpHeader}>
            <View style={styles.basketIcon}>
              <Ionicons name="basket" size={24} color="#8B4513" />
              <View style={styles.notificationBadge}>
                <Ionicons name="chatbubble" size={12} color="#fff" />
              </View>
            </View>
            <Text style={styles.helpTitle}>Need help?</Text>
          </View>
          
          <Text style={styles.helpDescription}>
            Shop staff will deliver your order, so order tracking isn&apos;t as detailed. 
            You can call the shop for more information about your delivery.
          </Text>
          
          <TouchableOpacity style={styles.callButton}>
            <Ionicons name="call" size={18} color="#000" />
            <Text style={styles.callButtonText}>Call store</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: Platform.OS === 'ios' ? 10 : 20,
    paddingBottom: 20,
  },
  backButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerButton: {
    marginLeft: 16,
    padding: 8,
  },
  helpText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#000',
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
  },
  statusSection: {
    alignItems: 'center',
    marginBottom: 60,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#000',
    marginBottom: 8,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
  },
  iconsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 80,
  },
  iconWrapper: {
    marginHorizontal: 20,
    padding: 20,
    backgroundColor: '#f8f9fa',
    borderRadius: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  helpSection: {
    borderTopWidth: 1,
    borderTopColor: '#E0E0E0',
    paddingTop: 20,
  },
  helpHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  basketIcon: {
    position: 'relative',
    marginRight: 12,
  },
  notificationBadge: {
    position: 'absolute',
    top: -5,
    right: -5,
    backgroundColor: '#007AFF',
    borderRadius: 8,
    width: 16,
    height: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  badgeText: {
    color: '#fff',
    fontSize: 10,
    fontWeight: 'bold',
  },
  helpTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#000',
  },
  helpDescription: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
    marginBottom: 20,
  },
  callButton: {
    backgroundColor: '#F5F5F5',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: 12,
    alignSelf: 'center',
  },
  callButtonText: {
    color: '#000',
    fontSize: 16,
    fontWeight: '500',
    marginLeft: 8,
  },
});
