import React from 'react';
import { StyleSheet, View, Text, TouchableOpacity } from 'react-native';

export default function CartSummary() {
  return (
    <View style={styles.container}>
      <View style={styles.summaryContent}>
        <View style={styles.cartInfo}>
          <Text style={styles.cartItems}>2 articles dans le panier</Text>
        </View>
        
        <View style={styles.totalSection}>
          <Text style={styles.totalText}>Total: 56,00 DT</Text>
          <TouchableOpacity>
            <Text style={styles.viewCartLink}>Voir le panier</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  summaryContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  cartInfo: {
    flex: 1,
  },
  cartItems: {
    fontSize: 14,
    color: '#666',
  },
  totalSection: {
    alignItems: 'flex-end',
  },
  totalText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  viewCartLink: {
    fontSize: 14,
    color: '#8B4513',
    fontWeight: '600',
  },
});
