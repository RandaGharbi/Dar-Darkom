import React from "react";
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

const stepIcon = require("../assets/images/step.png");
const deliveryIcon = require("../assets/images/delivery.png");
const orderIcon = require("../assets/images/order.png");

export default function OrderTrackingScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();

  // Lecture des données dynamiques
  const orderId = params.orderId || "";
  const products = params.products ? JSON.parse(params.products as string) : [];
  const address = params.address ? JSON.parse(params.address as string) : {};
  const steps = params.steps ? JSON.parse(params.steps as string) : [];

  const orderDateStr = params.orderDate || null;
  const orderDate = orderDateStr ? new Date(orderDateStr as string) : new Date();
  function addDays(date: Date, days: number) {
    const d = new Date(date);
    d.setDate(d.getDate() + days);
    return d;
  }
  function formatDate(date: Date) {
    return date.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
  }
  // Valeurs fallback si steps vide
  const defaultSteps = [
    { label: "Order placed", date: formatDate(orderDate), icon: stepIcon, done: true },
    { label: "Order processed", date: formatDate(addDays(orderDate, 1)), icon: stepIcon, done: true },
    { label: "Order shipped", date: formatDate(addDays(orderDate, 2)), icon: deliveryIcon, done: true },
    { label: "Order delivered", date: "Estimated " + formatDate(addDays(orderDate, 5)), icon: orderIcon, done: false },
  ];
  const timelineSteps = steps.length > 0 ? steps : defaultSteps;

  // Mock data
  const subtotal = 50;
  const shipping = 5;
  const total = 55;

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.container}>
        <View style={styles.headerRow}>
          <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
            <Text style={styles.backText}>←</Text>
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Order Tracking</Text>
          <View style={{ width: 32 }} />
        </View>
        <Text style={styles.orderId}>Order {orderId}</Text>

        {/* Timeline */}
        <View style={styles.timelineBlock}>
          {timelineSteps.map((step: any, idx: number) => (
            <View key={step.label} style={styles.timelineRow}>
              <View style={styles.timelineIconCol}>
                <Image source={step.icon || stepIcon} style={[styles.timelineIcon, !step.done && { opacity: 0.3 }]} />
                {idx < timelineSteps.length - 1 && (
                  <View style={styles.timelineLine} />
                )}
              </View>
              <View style={styles.timelineTextCol}>
                <Text style={[styles.timelineLabel, !step.done && { color: '#8A7861' }]}>{step.label}</Text>
                <Text style={[styles.timelineDate, !step.done && { color: '#8A7861' }]}>{step.date}</Text>
              </View>
            </View>
          ))}
        </View>

        {/* Adresse */}
        <Text style={styles.sectionTitle}>Shipping Address</Text>
        <View style={styles.addressBlock}>
          <Text style={styles.addressName}>
            {address.fullName || address.name || ''}
          </Text>
          <Text style={styles.addressText}>
            {(address.street || address.streetAddress || '') +
              (address.city ? ', ' + address.city : '')}
          </Text>
          <Text style={styles.addressText}>
            {(address.postalCode ? address.postalCode + ', ' : '') +
              (address.country || '')}
          </Text>
        </View>

        {/* Résumé de commande */}
        <Text style={styles.sectionTitle}>Order Summary</Text>
        <View style={styles.summaryBlock}>
          {products.map((item: any, idx: number) => {
            const imageUri =
              (item.image_url && typeof item.image_url === 'string' && item.image_url) ||
              (item.image && typeof item.image === 'string' && item.image) ||
              'https://via.placeholder.com/150';
            return (
              <View key={idx} style={styles.productRow}>
                <Image source={{ uri: imageUri }} style={{ width: 40, height: 40, borderRadius: 8, marginRight: 10 }} />
                <Text style={styles.productQty}>{item.qty || item.quantity || 1} x</Text>
                <View style={{ flex: 1 }}>
                  <Text style={styles.productName}>{item.name}</Text>
                  {item.desc && <Text style={styles.productDesc}>{item.desc}</Text>}
                </View>
              </View>
            );
          })}
                  <View style={styles.summaryRow}>
          <Text style={styles.summaryLabel}>Subtotal</Text>
          <Text style={styles.summaryValue}>€{subtotal.toFixed(2)}</Text>
        </View>
        <View style={styles.summaryRow}>
          <Text style={styles.summaryLabel}>Shipping</Text>
          <Text style={styles.summaryValue}>€{shipping.toFixed(2)}</Text>
        </View>
        <View style={styles.summaryRow}>
          <Text style={styles.summaryLabel}>Total</Text>
          <Text style={styles.summaryTotal}>€{total.toFixed(2)}</Text>
        </View>
        </View>

        <TouchableOpacity style={styles.ctaBtn} onPress={() => router.push('/contact-us')}>
          <Text style={styles.ctaBtnText}>Contact Support</Text>
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
  orderId: {
    fontWeight: 'bold',
    fontSize: 15,
    color: '#222',
    marginBottom: 18,
    marginLeft: 2,
  },
  timelineBlock: {
    marginBottom: 24,
    marginLeft: 2,
  },
  timelineRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 8,
    minHeight: 54,
  },
  timelineIconCol: {
    alignItems: 'center',
    justifyContent: 'center',
    width: 32,
    position: 'relative',
  },
  timelineIcon: {
    width: 18,
    height: 18,
    marginTop: 2,
    marginBottom: 2,
    resizeMode: 'contain',
  },
  timelineLine: {
    width: 2,
    backgroundColor: '#E6E6E6',
    flex: 1,
    alignSelf: 'center',
    marginTop: 2,
  },
  timelineTextCol: {
    flex: 1,
    marginLeft: 12,
  },
  timelineLabel: {
    fontWeight: 'bold',
    fontSize: 14,
    color: '#222',
    marginBottom: 2,
  },
  timelineDate: {
    fontSize: 13,
    color: '#8A7861',
    marginBottom: 0,
  },
  sectionTitle: {
    fontSize: 15,
    fontWeight: 'bold',
    color: '#222',
    marginTop: 18,
    marginBottom: 8,
  },
  addressBlock: {
    marginBottom: 10,
    marginLeft: 2,
  },
  addressName: {
    fontSize: 14,
    color: '#222',
    marginBottom: 2,
    fontWeight: 'bold',
  },
  addressText: {
    color: '#222',
    fontSize: 13,
    marginBottom: 0,
  },
  summaryBlock: {
    marginBottom: 0,
    marginLeft: 2,
  },
  productRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 10,
  },
  productQty: {
    fontSize: 13,
    color: '#8A7861',
    fontWeight: '400',
    marginRight: 8,
    marginTop: 2,
  },
  productName: {
    fontSize: 14,
    color: '#222',
    fontWeight: '500',
  },
  productDesc: {
    fontSize: 12,
    color: '#8A7861',
    marginTop: 2,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 14,
  },
  summaryLabel: {
    fontSize: 13,
    color: '#8A7861',
  },
  summaryValue: {
    fontSize: 13,
    color: '#222',
  },
  summaryTotal: {
    fontSize: 13,
    color: '#000',
    fontWeight: 'bold',
  },
  ctaBtn: {
    backgroundColor: '#ED9626',
    borderRadius: 30,
    paddingVertical: 16,
    alignItems: 'center',
    marginTop: 28,
    width: '100%',
    shadowColor: '#ED9626',
    shadowOpacity: 0.10,
    shadowRadius: 8,
    elevation: 2,
  },
  ctaBtnText: {
    color: '#111',
    fontWeight: 'bold',
    fontSize: 16,
    letterSpacing: 0.5,
  },
}); 