import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  SafeAreaView,
  Platform,
} from "react-native";
import { useRouter, useLocalSearchParams } from "expo-router";
import { useSafeNavigation } from "../hooks/useSafeNavigation";
import OrderSummary from "../components/OrderSummary";
import { useAuth } from "../context/AuthContext";
import { useOrder } from "../context/OrderContext";

export default function OrderConfirmationScreen() {
  const router = useRouter();
  const { user } = useAuth();
  const { safeBack } = useSafeNavigation();
  const { lastOrder } = useOrder();
  const params = useLocalSearchParams();

  // Si pas de commande, fallback sur panier (pour dev)
  const order = params.order ? JSON.parse(params.order as string) : lastOrder;
  const address = order && order.shippingAddress ? order.shippingAddress : {};

  // Log debug pour voir la structure de la commande et des produits
  console.log('[DEBUG ORDER]', order);
  console.log('[DEBUG ORDER PRODUCTS]', order?.products);

  // Calcul de la date de livraison estimée
  const today = new Date();
  const deliveryStart = new Date(today);
  deliveryStart.setDate(today.getDate() + 2); // début dans 2 jours
  const deliveryEnd = new Date(today);
  deliveryEnd.setDate(today.getDate() + 5); // fin dans 5 jours

  const formatDate = (date: Date) =>
    date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });

  const estimatedDelivery = `${formatDate(deliveryStart)} - ${formatDate(deliveryEnd)}`;

  // Si pas de commande, afficher un message d'erreur
  if (!order) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.container}>
          <View style={styles.headerRow}>
            <TouchableOpacity style={styles.backBtn} onPress={safeBack}>
              <Text style={styles.backText}>←</Text>
            </TouchableOpacity>
            <Text style={styles.headerTitle}>Order Confirmation</Text>
            <View style={{ width: 32 }} />
          </View>
          <View style={styles.errorContainer}>
            <Text style={styles.errorTitle}>Aucune commande trouvée</Text>
            <Text style={styles.errorMessage}>
              Il semble qu'aucune commande n'ait été trouvée. Veuillez retourner à l'écran précédent.
            </Text>
            <TouchableOpacity style={styles.retryButton} onPress={safeBack}>
              <Text style={styles.retryButtonText}>Retour</Text>
            </TouchableOpacity>
          </View>
        </View>
      </SafeAreaView>
    );
  }

  // Log pour debug

  // Mapping des produits pour OrderSummary
  const products =
    order?.products ||
    (order?.items
      ? order.items.map((item: any) => {
          const product = typeof item.productId === 'object' && item.productId !== null ? item.productId : {};
          return {
            name: product.title || product.name || '',
            qty: item.quantity,
            image: product.image_url || product.image || '',
            price: typeof product.price === 'number' ? product.price : 0,
          };
        })
      : []);

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.container}>
        <View style={styles.headerRow}>
          <TouchableOpacity style={styles.backBtn} onPress={safeBack}>
            <Text style={styles.backText}>←</Text>
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Order Confirmation</Text>
          <View style={{ width: 32 }} />
        </View>
        <Text style={styles.title}>Thank you, {user?.name || 'Guest'}!</Text>
        <Text style={styles.subtitle}>
          Your order has been placed and is on its way. You&apos;ll receive a notification when it ships.
        </Text>

        <OrderSummary
          products={products}
          subtotal={typeof order?.subtotal === 'number' ? order.subtotal : 0}
          shipping={typeof order?.shipping === 'number' ? order.shipping : 0}
          total={typeof order?.total === 'number' ? order.total : 0}
        />

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Shipping Address</Text>
          <Text style={styles.addressName}>{address.fullName || ''}</Text>
          <Text style={styles.addressText}>{address.street || ''}</Text>
          <Text style={styles.addressText}>
            {address.postalCode ? address.postalCode + ', ' : ''}
            {address.city || ''}
          </Text>
          <Text style={styles.addressText}>{address.country || ''}</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Estimated Delivery</Text>
          <Text style={styles.delivery}>{estimatedDelivery}</Text>
        </View>

        <TouchableOpacity
          style={styles.detailsBtn}
          onPress={() => router.push({
            pathname: '/order-details',
            params: {
              order: params.order,
              card: params.card,
            }
          })}
        >
          <Text style={styles.detailsBtnText}>View Order Details</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#fff',
  },
  container: {
    padding: 24,
    paddingBottom: 40,
    backgroundColor: '#fff',
  },
  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: Platform.OS === 'android' ? 32 : 0,
    marginBottom: 12,
    paddingHorizontal: 0,
  },
  backBtn: {
    width: 32,
    height: 32,
    justifyContent: 'center',
    alignItems: 'center',
  },
  backText: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#222',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "bold",
    textAlign: "center",
    flex: 1,
    marginTop: 8,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'left',
    marginTop: 16,
    marginBottom: 8,
    color: '#222',
    paddingHorizontal: 2,
  },
  subtitle: {
    fontSize: 14,
    color: '#222',
    textAlign: 'left',
    marginBottom: 28,
    marginHorizontal: 10,
  },
  section: {
    marginBottom: 0,
    padding: 18,
  },
  sectionTitle: {
    fontSize: 15,
    fontWeight: 'bold',
    color: '#222',
    marginBottom: 12,
  },
  addressName: {
    fontSize: 14,
    color: '#222',
    marginBottom: 2,
  },
  addressText: {
    color: '#222',
    fontSize: 13,
    marginBottom: 0,
  },
  delivery: {
    fontSize: 15,
    color: '#222',
    marginTop: 2,
  },
  detailsBtn: {
    backgroundColor: '#ED9626',
    borderRadius: 30,
    paddingVertical: 16,
    alignItems: 'center',
    marginTop: 18,
    width: '100%',
    shadowColor: '#ED9626',
    shadowOpacity: 0.10,
    shadowRadius: 8,
    elevation: 2,
  },
  detailsBtnText: {
    color: '#111',
    fontWeight: 'bold',
    fontSize: 16,
    letterSpacing: 0.5,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
    marginTop: 50,
  },
  errorTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FF3B30',
    marginBottom: 12,
    textAlign: 'center',
  },
  errorMessage: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    marginBottom: 24,
    lineHeight: 20,
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
}); 