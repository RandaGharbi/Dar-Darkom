import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  SafeAreaView,
  Image,
  Platform,
} from "react-native";
import { useRouter, useLocalSearchParams } from "expo-router";
import VisaIcon from "../assets/images/visa.png";
import MastercardIcon from "../assets/images/masterCard.png";
import CardIcon from "../assets/images/card.png";
import { getCorrectImageUrl } from '../utils/imageUtils';
import { StatusBadge } from '../components/StatusBadge';

export default function OrderDetailsScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();

  // Récupération des données passées via navigation
  const order = params.order ? JSON.parse(params.order as string) : null;
  const card = params.card ? JSON.parse(params.card as string) : null;

  const products = order ? order.products : [];
  const subtotal = order ? order.subtotal : 0;
  const shipping = order ? order.shipping : 0;
  const tax = order ? order.tax : 0;
  const total = order ? order.total : 0;
  const address = order && order.shippingAddress ? order.shippingAddress : { fullName: '', street: '', city: '', postalCode: '', country: '' };
  const status = order ? order.status : "pending";

  const getCardLogo = (number: string) => {
    if (!number) return CardIcon;
    if (number.startsWith('4')) return VisaIcon;
    if (number.startsWith('5')) return MastercardIcon;
    return CardIcon;
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.container}>
        <View style={styles.headerRow}>
          <TouchableOpacity
            style={styles.backBtn}
            onPress={() => router.back()}
          >
            <Text style={styles.backText}>←</Text>
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Order Details</Text>
          <View style={{ width: 32 }} />
        </View>
        <Text style={styles.orderId}>Order #{order && order._id ? order._id : ''}</Text>

        {/* Produits */}
        {products.map((item: any, idx: number) => (
          <View key={idx} style={styles.productBlock}>
            {item.image ? (
              <Image source={{ uri: getCorrectImageUrl(item.image) || item.image }} style={styles.productImg} />
            ) : null}
            <View style={{ flex: 1 }}>
              <Text style={styles.productName}>{item.name}</Text>
              {item.desc ? (
                <Text style={styles.productDesc}>{item.desc}</Text>
              ) : null}
              <Text style={styles.productQty}>x{item.qty}</Text>
            </View>
          </View>
        ))}

        {/* Paiement */}
        <Text style={styles.sectionTitle}>Payment</Text>
        <View style={styles.paymentBlock}>
          {card && card.cardNumber ? (
            <>
              <Image
                source={getCardLogo(card.cardNumber)}
                style={{ width: 32, height: 32, marginRight: 8 }}
              />
              <Text style={styles.paymentText}>
                {card.cardNumber ? `•••• ${card.cardNumber.slice(-4)}` : 'Credit Card'}
              </Text>
            </>
          ) : (
            <Text style={styles.paymentText}>Credit Card</Text>
          )}
        </View>

        {/* Adresse livraison */}
        <Text style={styles.sectionTitle}>Shipping Address</Text>
        <View style={styles.addressBlock}>
          <Text style={styles.addressName}>{address.fullName}</Text>
          <Text style={styles.addressText}>{address.street}</Text>
          <Text style={styles.addressText}>
            {address.postalCode ? address.postalCode + ', ' : ''}
            {address.city}
          </Text>
          <Text style={styles.addressText}>{address.country}</Text>
        </View>

        {/* Adresse facturation */}
        <Text style={styles.sectionTitle}>Billing Address</Text>
        <View style={styles.addressBlock}>
          <Text style={styles.addressName}>{address.fullName}</Text>
          <Text style={styles.addressText}>{address.street}</Text>
          <Text style={styles.addressText}>
            {address.postalCode ? address.postalCode + ', ' : ''}
            {address.city}
          </Text>
          <Text style={styles.addressText}>{address.country}</Text>
        </View>

        {/* Résumé */}
        <Text style={styles.sectionTitle}>Order Summary</Text>
        <View style={styles.summaryBlock}>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Subtotal</Text>
            <Text style={styles.summaryValue}>€{subtotal.toFixed(2)}</Text>
          </View>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Shipping</Text>
            <Text style={styles.summaryValue}>€{shipping.toFixed(2)}</Text>
          </View>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Tax</Text>
            <Text style={styles.summaryValue}>€{tax.toFixed(2)}</Text>
          </View>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Total</Text>
            <Text style={styles.summaryTotal}>€{total.toFixed(2)}</Text>
          </View>
        </View>

        {/* Statut */}
        <Text style={styles.sectionTitle}>Order Status</Text>
        <View style={styles.statusBlock}>
          <StatusBadge status={status} size="large" />
          <Text style={styles.statusDate}>
            {/* Date de livraison estimée */}
            {(() => {
              const today = new Date();
              const deliveryStart = new Date(today);
              deliveryStart.setDate(today.getDate() + 2);
              const deliveryEnd = new Date(today);
              deliveryEnd.setDate(today.getDate() + 5);
              const formatDate = (date: Date) =>
                date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
              return `${formatDate(deliveryStart)} - ${formatDate(deliveryEnd)}`;
            })()}
          </Text>
        </View>

        {/* Tracking */}
        <Text style={styles.sectionTitle}>Tracking Information</Text>
        <View style={styles.trackingBlock}>
          <Text style={styles.trackingText}>Tracking Number: 9876543210</Text>
          <TouchableOpacity
            onPress={() => router.push({
              pathname: '/order-tracking',
              params: {
                orderId: order?._id,
                trackingNumber: order?.trackingNumber || '9876543210',
                products: JSON.stringify(order?.products || []),
                address: JSON.stringify(order?.shippingAddress || order?.address || order?.deliveryAddress || {}),
                steps: JSON.stringify(order?.trackingSteps || []),
                orderDate: order?.createdAt || order?.orderDate || new Date().toISOString(),
              }
            })}
          >
            <Text style={styles.trackingArrow}>→</Text>
          </TouchableOpacity>
        </View>

        {/* Boutons */}
        <View style={styles.btnRow}>
          <TouchableOpacity
            style={styles.reorderBtn}
            onPress={() => router.push("/shop")}
          >
            <Text style={styles.reorderBtnText}>Reorder</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.supportBtn}
            onPress={() => router.push("/contact-us")}
          >
            <Text style={styles.supportBtnText}>Contact Support</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#fff",
  },
  container: {
    padding: 24,
    paddingBottom: 40,
    backgroundColor: "#fff",
  },
  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: Platform.OS === "android" ? 32 : 0,
    marginBottom: 12,
    paddingHorizontal: 0,
  },
  backBtn: {
    width: 32,
    height: 32,
    justifyContent: "center",
    alignItems: "center",
  },
  backText: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#222",
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "bold",
    textAlign: "center",
    flex: 1,
    marginTop: 8,
  },
  orderId: {
    fontWeight: "bold",
    fontSize: 15,
    color: "#222",
    marginBottom: 18,
    marginLeft: 2,
  },
  productBlock: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 5,
    padding: 10,
  },
  productImg: {
    width: 54,
    height: 54,
    borderRadius: 10,
    marginRight: 14,
    backgroundColor: "#fff",
  },
  productName: {
    fontSize: 14,
    color: "#222",
    fontWeight: "bold",
    marginBottom: 2,
  },
  productDesc: {
    fontSize: 12,
    color: "#8A7861",
    marginBottom: 2,
  },
  productQty: {
    fontSize: 13,
    color: "#8A7861",
    fontWeight: "400",
    marginRight: 12,
    marginTop: 2,
  },
  sectionTitle: {
    fontSize: 15,
    fontWeight: "bold",
    color: "#222",
    marginTop: 18,
    marginBottom: 8,
  },
  paymentBlock: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },
  paymentIcon: {
    width: 24,
    height: 24,
    borderRadius: 6,
    backgroundColor: "#F6F3F2",
    marginRight: 10,
  },
  paymentText: {
    fontSize: 14,
    color: "#222",
  },
  addressBlock: {
    marginBottom: 10,
    marginLeft: 2,
  },
  addressName: {
    fontSize: 14,
    color: "#222",
    marginBottom: 2,
    fontWeight: "500",
  },
  addressText: {
    color: "#827869",
    fontSize: 13,
    marginBottom: 0,
  },
  summaryBlock: {
    marginBottom: 0,
    marginLeft: 2,
  },
  summaryRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 14,
  },
  summaryLabel: {
    fontSize: 13,
    color: "#8A7861",
  },
  summaryValue: {
    fontSize: 13,
    color: "#222",
  },
  summaryTotal: {
    fontSize: 13,
    color: "#000",
    fontWeight: "bold",
  },
  statusBlock: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  statusDate: {
    fontSize: 13,
    color: '#8A7861',
    textAlign: 'right',
    minWidth: 90,
  },
  trackingBlock: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 18,
    marginTop: 2,
  },
  trackingText: {
    fontSize: 13,
    color: "#222",
    flex: 1,
  },
  trackingArrow: {
    fontSize: 18,
    color: "#8A7861",
    marginLeft: 8,
    fontWeight: "bold",
  },
  btnRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 18,
    marginBottom: 18,
  },
  reorderBtn: {
    backgroundColor: "#EDD9BF",
    borderRadius: 20,
    paddingVertical: 10,
    paddingHorizontal: 22,
    alignItems: "center",
    minWidth: 100,
    marginRight: 8,
    alignSelf: "flex-start",
  },
  reorderBtnText: {
    color: "#222",
    fontWeight: "bold",
    fontSize: 15,
  },
  supportBtn: {
    backgroundColor: "#F6F3F2",
    borderRadius: 20,
    paddingVertical: 10,
    paddingHorizontal: 22,
    alignItems: "center",
    minWidth: 140,
    marginLeft: 8,
    alignSelf: "flex-end",
  },
  supportBtnText: {
    color: "#222",
    fontWeight: "bold",
    fontSize: 15,
  },
});
