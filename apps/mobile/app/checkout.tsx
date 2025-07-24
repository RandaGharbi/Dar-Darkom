import React, { useEffect, useState, useCallback } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  ScrollView,
  Alert,
} from "react-native";
import { useRouter, useFocusEffect } from "expo-router";
import { useCart } from "../context/CartContext";
import { useSelectedCard } from "../context/PaymentContext";
import ChevronRight from '../assets/images/chevronRight.png';
import CardIcon from '../assets/images/card.png';
import { apiService, Card, AddressPayload , getAddressesByUser } from "../services/api";
import AsyncStorage from '@react-native-async-storage/async-storage';
import VisaIcon from '../assets/images/visa.png';
import MastercardIcon from '../assets/images/masterCard.png';
import { useAuth } from "../context/AuthContext";
import { useOrder } from "../context/OrderContext";
import { useMutation } from '@tanstack/react-query';

export default function CheckoutScreen() {
  const router = useRouter();
  const { cart } = useCart();
  const { user } = useAuth();
  const { selectedCardId } = useSelectedCard();
  const [cards, setCards] = useState<Card[]>([]);
  const [loadingCard, setLoadingCard] = useState(true);
  const [shippingAddress, setShippingAddress] = useState<AddressPayload | null>(null);
  const { setLastOrder } = useOrder();
  const { clearCart, fetchCart } = useCart();
  const [checkoutDone, setCheckoutDone] = useState(false);

  // Calculs dynamiques
  const subtotal = cart?.items?.reduce(
    (sum, item) => {
      const product = typeof item.productId === 'object' ? item.productId : {};
      const price = product && 'price' in product && typeof product.price === 'number' ? product.price : 0;
      return sum + price * item.quantity;
    },
    0
  ) || 0;
  const shipping = 5;
  const taxes = 0.1 * subtotal;
  const total = subtotal + shipping + taxes;

  useEffect(() => {
    const fetchCards = async () => {
      setLoadingCard(true);
      const token = await AsyncStorage.getItem('authToken');
      if (token && user?._id) {
        const res = await apiService.getCards(token, user._id);
        if (res.success && res.data) {
          setCards(res.data);
        } else {
          setCards([]);
        }
      }
      setLoadingCard(false);
    };
    fetchCards();
  }, [user]);

  // Recharger les cartes quand on revient sur cette page
  useFocusEffect(
    useCallback(() => {
      const fetchCards = async () => {
        setLoadingCard(true);
        const token = await AsyncStorage.getItem('authToken');
        if (token && user?._id) {
          const res = await apiService.getCards(token, user._id);
          if (res.success && res.data) {
            setCards(res.data);
          } else {
            setCards([]);
          }
        }
        setLoadingCard(false);
      };
      fetchCards();
    }, [user])
  );

  useFocusEffect(
    useCallback(() => {
      const fetchAddress = async () => {
        if (user?._id) {
          const addresses = await getAddressesByUser(user._id);
          const selectedId = await AsyncStorage.getItem('selectedShippingAddressId');
          let main = null;
          if (selectedId) {
            main = addresses.find((a: any) => a._id === selectedId);
          }
          if (!main) {
            main = addresses.find((a: any) => a.isDefault) || addresses[addresses.length - 1];
          }
          setShippingAddress(main);
        }
      };
      fetchAddress();
    }, [user])
  );

  // Helper pour logo
  const getCardLogo = (number: string) => {
    if (number.startsWith('4')) return VisaIcon;
    if (number.startsWith('5')) return MastercardIcon;
    return CardIcon;
  };

  // Affichage carte paiement
  const cardToShow = selectedCardId
    ? cards.find(card => card._id === selectedCardId)
    : cards.length > 0
      ? cards[cards.length - 1]
      : null;

  const { mutate: submitOrder, status: orderStatus } = useMutation<any, Error, any>({
    mutationFn: async (orderData) => {
      const token = await AsyncStorage.getItem('authToken');
      return apiService.createOrder(orderData, token || undefined);
    },
    onSuccess: async (data, variables) => {
      setLastOrder(data.data || variables);
      clearCart();
      await fetchCart();
      setCheckoutDone(true); // Indique que le checkout est terminé
      Alert.alert(
        "Commande validée",
        "Votre commande a bien été enregistrée !",
        [
          {
            text: "OK",
            onPress: () => {
              router.push({
                pathname: '/order-confirmation',
                params: { order: JSON.stringify(data.data || variables), card: JSON.stringify(cardToShow) }
              });
            }
          }
        ]
      );
    },
    onError: (err) => {
      alert('Erreur lors de la création de la commande');
    }
  });

  useEffect(() => {
    if (checkoutDone) {
      setCheckoutDone(false);
    }
  }, [cart, checkoutDone]);

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={{ paddingBottom: 32 }}
    >
      <View style={styles.headerRow}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <Text style={styles.backText}>←</Text>
        </TouchableOpacity>
        <Text style={styles.title}>Checkout</Text>
        <View style={{ width: 32 }} />
      </View>

      <Text style={styles.sectionTitle}>Order Summary</Text>
      {cart?.items && cart.items.map((item) => {
        const product = typeof item.productId === 'object' ? item.productId : {};
        const imageUri =
          (product && 'image_url' in product && typeof product.image_url === 'string' && product.image_url) ||
          (product && 'image' in product && typeof product.image === 'string' && product.image) ||
          'https://via.placeholder.com/150';
        const name = product && ('title' in product ? product.title : product.name) || '';
        const key = product && '_id' in product && typeof product._id === 'string' ? product._id : (typeof item.productId === 'string' ? item.productId : Math.random().toString());
        return (
          <View key={key} style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 8 }}>
            <Image source={{ uri: imageUri }} style={{ width: 40, height: 40, borderRadius: 8, marginRight: 10 }} />
            <View style={{ flex: 1 }}>
              <Text style={{ fontWeight: 'bold', fontSize: 15, color: '#222' }}>{name}</Text>
              <Text style={{ color: '#888', fontSize: 13, marginTop: 2 }}>
                x{item.quantity}
              </Text>
            </View>
          </View>
        );
      })}

      <View style={styles.summaryBlock}>
        <View style={styles.summaryRow}>
          <Text style={styles.summaryLabel}>Subtotal</Text>
          <Text style={styles.summaryValue}>${subtotal.toFixed(2)}</Text>
        </View>
        <View style={styles.summaryRow}>
          <Text style={styles.summaryLabel}>Shipping</Text>
          <Text style={styles.summaryValue}>${shipping.toFixed(2)}</Text>
        </View>
        <View style={styles.summaryRow}>
          <Text style={styles.summaryLabel}>Taxes</Text>
          <Text style={styles.summaryValue}>${taxes.toFixed(2)}</Text>
        </View>
        <View style={styles.summaryRow}>
          <Text style={[styles.summaryLabel, styles.totalLabel]}>Total</Text>
          <Text style={[styles.summaryValue, styles.totalLabel]}>
            ${total.toFixed(2)}
          </Text>
        </View>
      </View>

      <Text style={styles.sectionTitle}>Payment Method</Text>
      <TouchableOpacity style={styles.rowBtn} onPress={() => router.push('/payment-methods')}>
        <View style={{ flexDirection: 'row', alignItems: 'center', flex: 1 }}>
          <View style={styles.iconBg}>
            {cardToShow && !loadingCard ? (
              <Image source={getCardLogo(cardToShow.cardNumber)} style={styles.icon} />
            ) : (
              <Image source={CardIcon} style={styles.icon} />
            )}
          </View>
          <View style={{ marginLeft: 12 }}>
            <Text style={styles.rowBtnText}>
              {cardToShow && cardToShow.cardNumber
                ? `•••• ${cardToShow.cardNumber.slice(-4)}`
                : 'Credit Card'}
            </Text>
            {cardToShow && !loadingCard && cardToShow.expiryDate && (
              <Text style={{ fontSize: 12, color: '#888' }}>
                Expires {cardToShow.expiryDate}
              </Text>
            )}
          </View>
        </View>
        <Image source={ChevronRight} style={styles.chevronIcon} />
      </TouchableOpacity>

      <Text style={styles.sectionTitle}>Shipping Address</Text>
      <TouchableOpacity
        style={styles.rowBtn}
        onPress={() => router.push('/shipping-address')}
      >
        <View style={styles.addressBlock}>
          <Text style={styles.addressName}>
            {shippingAddress ? shippingAddress.fullName : "Ajouter une adresse de livraison"}
          </Text>
          <Text style={styles.addressText}>
            {shippingAddress
              ? `${shippingAddress.streetAddress}\n${shippingAddress.city}${shippingAddress.state ? ', ' + shippingAddress.state : ''} ${shippingAddress.postalCode}, ${shippingAddress.country}`
              : ""}
          </Text>
        </View>
        <Image source={ChevronRight} style={styles.chevronIcon} />
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.purchaseBtn}
        onPress={() => {
          const orderData = {
            userId: user?._id || '',
            shippingAddress: shippingAddress
              ? {
                  fullName: shippingAddress.fullName,
                  street: shippingAddress.streetAddress,
                  city: shippingAddress.city,
                  postalCode: shippingAddress.postalCode,
                  country: shippingAddress.country,
                }
              : { fullName: '', street: '', city: '', postalCode: '', country: '' },
            payment: cardToShow
              ? `**** ${cardToShow.cardNumber.slice(-4)}`
              : 'Credit Card',
            items: cart?.items || [], // Ajout des produits du panier
          };
          submitOrder(orderData);
        }}
        disabled={orderStatus === 'pending'}
      >
        <Text style={styles.purchaseText}>{orderStatus === 'pending' ? 'Enregistrement...' : 'Complete Purchase'}</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff" },
  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: 70,
    marginBottom: 12,
    paddingHorizontal: 16,
  },
  backBtn: {
    width: 32,
    height: 32,
    justifyContent: "center",
    alignItems: "center",
  },
  backText: { fontSize: 20, fontWeight: "bold" },
  title: { fontSize: 18, fontWeight: "bold", textAlign: "center" },
  sectionTitle: {
    fontSize: 14,
    fontWeight: "bold",
    marginTop: 22,
    marginBottom: 10,
    marginLeft: 16,
  },
  productRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
    marginLeft: 16,
  },
  productImage: {
    width: 48,
    height: 48,
    borderRadius: 8,
    marginRight: 12,
    backgroundColor: "#F6F6F6",
  },
  productName: {
    fontSize: 15,
    fontWeight: "400",
    color: "#222",
    textTransform: 'capitalize'
  },
  productQuantity: { fontSize: 13, color: "#8A7861" },
  productPrice: { fontSize: 13, color: "#222" },
  summaryBlock: { marginHorizontal: 16, marginTop: 8, marginBottom: 16 },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: 12,
  },
  summaryLabel: { fontSize: 13, color: "#000", fontWeight: "300" },
  summaryValue: { fontSize: 13, color: "#222" },
  totalLabel: { fontWeight: "bold", color: "#000" },
  rowBtn: {
    borderRadius: 12,
    backgroundColor: '#fff',
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
    paddingHorizontal: 16,
    marginHorizontal: 16,
    marginBottom: 10,
  },
  rowBtnText: {
    fontSize: 13,
    color: "#222",
    flex: 1,
    paddingLeft: 0,
    marginLeft: 10,
    marginRight: 0,
    textAlign: 'left',
  },
  icon: { width: 24, height: 24, resizeMode: "contain" },
  chevron: { fontSize: 18, color: "#8A7861" },
  chevronIcon: {
    width: 18,
    height: 18,
    tintColor: '#8A7861',
    resizeMode: 'contain',
    marginLeft: 8,
  },
  addressBlock: { flex: 1, marginLeft: -13 },
  addressName: { fontWeight: "500", fontSize: 14, color: "#222" },
  addressText: { fontSize: 13, color: "#8A7861" },
  purchaseBtn: {
    backgroundColor: "#F2910D",
    borderRadius: 25,
    padding: 14,
    marginTop: 24,
    alignItems: "center",
    marginHorizontal: 16,
  },
  purchaseText: { color: "#000", fontWeight: "bold", fontSize: 16 },
  iconBg: {
    width: 38,
    height: 38,
    borderRadius: 12,
    backgroundColor: '#F6F6F6',
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: -20,
    marginRight: 10,
    paddingHorizontal: 4,
  },
});
 