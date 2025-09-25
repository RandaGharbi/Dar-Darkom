import React from 'react';
import { StyleSheet, View, Text, ScrollView, ActivityIndicator, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import ProductCard from './ProductCard';
import { useDailySpecialProducts } from '../hooks/useProducts';
import { FoodProduct } from '../constants/types';
import { useAuth } from '../context/AuthContext';
import { useCartStore } from '../context/CartStore';

export default function DailySpecialSection() {
  const router = useRouter();
  const { isAuthenticated, user } = useAuth();
  const { addToCart } = useCartStore();
  const { data: dailyProducts, isLoading, error } = useDailySpecialProducts();

  const handleAddToCart = async (productId: number) => {
    if (!isAuthenticated) {
      router.push('/login');
      return;
    }
    
    try {
      await addToCart(user?._id || '', productId.toString());
      // Produit ajouté au panier avec succès (pas d'alert)
    } catch (error) {
      console.error('Erreur lors de l\'ajout au panier:', error);
      Alert.alert('Erreur', 'Erreur lors de l\'ajout au panier');
    }
  };

  if (isLoading) {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>Plats du jour</Text>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#8B4513" />
        </View>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>Plats du jour</Text>
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>Erreur lors du chargement des plats du jour</Text>
        </View>
      </View>
    );
  }

  if (!dailyProducts || dailyProducts.length === 0) {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>Plats du jour</Text>
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>Aucun plat du jour disponible</Text>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Plats du jour</Text>
      
      <ScrollView 
        horizontal 
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.productsContainer}
      >
        {dailyProducts.map((product: FoodProduct) => (
          <ProductCard
            key={product.id}
            name={product.name}
            price={`${product.price.toFixed(2)} DT`}
            tag={product.category}
            onAddToCart={() => handleAddToCart(product.id)}
          />
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 20,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginHorizontal: 16,
    marginBottom: 16,
  },
  productsContainer: {
    paddingHorizontal: 16,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorText: {
    color: 'red',
    fontSize: 16,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 16,
    color: '#888',
  },
});
