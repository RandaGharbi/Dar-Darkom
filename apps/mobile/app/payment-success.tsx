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
import { useRouter } from "expo-router";
import { useSafeNavigation } from "../hooks/useSafeNavigation";

// Remplace ce chemin par le tien si tu ajoutes l'image dans assets/images/
const illustration = require("../assets/images/payment-success.png");

export default function PaymentSuccessScreen() {
  const router = useRouter();
  const { safeBack } = useSafeNavigation();

  // Mock data (à remplacer par les vraies infos de la commande)
  const transactionId = "#1234567890";
  const orderTotal = 55.0;

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.container}>
        <View style={styles.headerRow}>
          <TouchableOpacity style={styles.backBtn} onPress={safeBack}>
            <Text style={styles.backText}>←</Text>
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Payment Successful</Text>
          <View style={{ width: 32 }} />
        </View>

        <View style={styles.illustrationBlock}>
          {/* Remplace l'image par la tienne si besoin */}
          <Image
            source={illustration}
            style={styles.illustration}
            resizeMode="contain"
          />
        </View>

        <Text style={styles.thankTitle}>Thank you for your order!</Text>
        <Text style={styles.thankSubtitle}>
          Your payment has been successfully processed. Your order is on its way!
        </Text>

        <View style={styles.infoRow}>
          <View style={{ flex: 1 }}>
            <Text style={styles.infoLabel}>Transaction ID</Text>
            <Text style={styles.infoValue}>{transactionId}</Text>
          </View>
          <View style={{ flex: 1 }}>
            <Text style={styles.infoLabel}>Order Total</Text>
            <Text style={styles.infoValue}>€{orderTotal.toFixed(2)}</Text>
          </View>
        </View>

        <TouchableOpacity
          style={styles.ctaBtn}
          onPress={() => router.push('/shop')}
        >
          <Text style={styles.ctaBtnText}>Continue Shopping</Text>
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
  illustrationBlock: {
    alignItems: 'center',
    marginBottom: 24,
    marginTop: 8,
  },
  illustration: {
    width: 220,
    height: 220,
    borderRadius: 18,
    backgroundColor: '#F6E2D3',
  },
  thankTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#222',
    textAlign: 'center',
    marginTop: 10,
    marginBottom: 6,
  },
  thankSubtitle: {
    fontSize: 14,
    color: '#8A7861',
    textAlign: 'center',
    marginBottom: 24,
    marginHorizontal: 10,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderTopWidth: 1,
    borderColor: '#E6E6E6',
    paddingTop: 18,
    marginBottom: 32,
  },
  infoLabel: {
    fontSize: 13,
    color: '#8A7861',
    marginBottom: 2,
    textAlign: 'left',
  },
  infoValue: {
    fontSize: 15,
    color: '#222',
    fontWeight: 'bold',
    textAlign: 'left',
  },
  ctaBtn: {
    backgroundColor: '#ED9626',
    borderRadius: 30,
    paddingVertical: 16,
    alignItems: 'center',
    marginTop: 8,
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