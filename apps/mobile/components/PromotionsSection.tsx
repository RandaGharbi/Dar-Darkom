import React from 'react';
import { StyleSheet, View, Text } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export default function PromotionsSection() {
  return (
    <View style={styles.container}>
      <View style={styles.promotionItem}>
        <View style={styles.promotionIcon}>
          <Ionicons name="pricetag" size={20} color="#FF6B6B" />
        </View>
        <View style={styles.promotionContent}>
          <Text style={styles.promotionTitle}>-20% sur les Pâtisseries</Text>
          <Text style={styles.promotionSubtitle}>Aujourd'hui seulement</Text>
        </View>
      </View>
      
      <View style={styles.promotionItem}>
        <View style={styles.promotionIcon}>
          <Ionicons name="car" size={20} color="#4ECDC4" />
        </View>
        <View style={styles.promotionContent}>
          <Text style={styles.promotionTitle}>Livraison offerte</Text>
          <Text style={styles.promotionSubtitle}>À partir de 60 DT</Text>
        </View>
      </View>
      
      <View style={styles.promotionItem}>
        <View style={styles.promotionIcon}>
          <Ionicons name="time" size={20} color="#45B7D1" />
        </View>
        <View style={styles.promotionContent}>
          <Text style={styles.promotionTitle}>Précommande</Text>
          <Text style={styles.promotionSubtitle}>Planifiez pour ce soir</Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginHorizontal: 16,
    marginBottom: 20,
  },
  promotionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f8f9fa',
    padding: 12,
    borderRadius: 12,
    marginBottom: 8,
  },
  promotionIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  promotionContent: {
    flex: 1,
  },
  promotionTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    marginBottom: 2,
  },
  promotionSubtitle: {
    fontSize: 12,
    color: '#666',
  },
});
