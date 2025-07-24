import React from "react";
import { View, Text, Image, StyleSheet } from "react-native";
import { getCorrectImageUrl } from '../utils/imageUtils';

interface Product {
  name: string;
  qty: number;
  image?: string;
  price?: number;
}

interface OrderSummaryProps {
  products: Product[];
  subtotal: number;
  shipping: number | string;
  total: number;
}

const OrderSummary: React.FC<OrderSummaryProps> = ({ products = [], subtotal, shipping, total }) => {
  return (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>Order Summary</Text>
      {products.filter(item => item && item.name).map((item, idx) => (
        <View key={item.name} style={styles.productRow}>
          {item.image && typeof item.image === 'string' && item.image.length > 0 ? (
            <Image source={{ uri: getCorrectImageUrl(item.image) || item.image }} style={styles.productImg} />
          ) : null}
          <View style={{ flex: 1 }}>
            <Text style={styles.productName}>{item.name}</Text>
            <Text style={styles.productQty}>x{item.qty}</Text>
          </View>
        </View>
      ))}
      <View style={styles.summaryRow}>
        <Text style={styles.summaryLabel}>Subtotal</Text>
        <Text style={styles.summaryValue}>{typeof subtotal === 'number' ? `${subtotal} €` : '0 €'}</Text>
      </View>
      <View style={styles.summaryRow}>
        <Text style={styles.summaryLabel}>Shipping</Text>
        <Text style={styles.summaryValue}>{typeof shipping === 'number' ? (shipping === 0 ? 'Gratuit' : `${shipping} €`) : (shipping || 'Gratuit')}</Text>
      </View>
      <View style={styles.summaryRow}>
        <Text style={styles.summaryLabel}>Total</Text>
        <Text style={styles.totalLabel}>{typeof total === 'number' ? `${total} €` : '0 €'}</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
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
  productRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  productImg: {
    width: 44,
    height: 44,
    borderRadius: 8,
    marginRight: 12,
    backgroundColor: '#eee',
  },
  productName: {
    fontSize: 14,
    color: '#222',
    fontWeight: '500',
    textTransform: 'capitalize',
  },
  productQty: {
    fontSize: 13,
    color: '#8A7861',
    fontWeight: '400',
  },
  productPrice: {
    fontSize: 13,
    color: '#222',
    fontWeight: '400',
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
  },
  summaryLabel: {
    fontSize: 13,
    color: '#8A7861',
  },
  summaryValue: {
    fontSize: 13,
    color: '#222',
  },
  totalLabel: {
    color: '#000',
    fontSize: 13,
  },
});

export default OrderSummary; 