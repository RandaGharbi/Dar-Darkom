import React from 'react';
import { StyleSheet, View, Text, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import ProductCard from './ProductCard';
import { useAuth } from '../context/AuthContext';
import { useCartStore } from '../context/CartStore';

const recommendedProducts = [
  {
    id: 1,
    name: 'Couscous au poulet',
    price: '22,00 DT',
    tag: '450g',
  },
  {
    id: 2,
    name: 'Lablabi',
    price: '14,50 DT',
    tag: 'Bol',
  },
  {
    id: 3,
    name: 'Brik à l\'oeuf',
    price: '7,00 DT',
    tag: 'Pièce',
  },
  {
    id: 4,
    name: 'Zrir',
    price: '10,00 DT',
    tag: 'Portion',
  },
];

export default function RecommendedSection() {
  const router = useRouter();
  const { isAuthenticated, user } = useAuth();
  const { addToCart } = useCartStore();

  const handleAddToCart = async (productId: number) => {
    if (!isAuthenticated) {
      router.push('/login');
      return;
    }
    
    try {
      await addToCart(user?._id || '', productId.toString());
      const product = recommendedProducts.find(p => p.id === productId);
      Alert.alert('Succès', `${product?.name} ajouté au panier !`);
    } catch (error) {
      console.error('Erreur lors de l\'ajout au panier:', error);
      Alert.alert('Erreur', 'Erreur lors de l\'ajout au panier');
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Recommandés pour vous</Text>
        <TouchableOpacity>
          <Text style={styles.seeAllLink}>Tout voir</Text>
        </TouchableOpacity>
      </View>
      
      <ScrollView 
        horizontal 
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.productsContainer}
      >
        {recommendedProducts.map((product) => (
          <ProductCard
            key={product.id}
            name={product.name}
            price={product.price}
            tag={product.tag}
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
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginHorizontal: 16,
    marginBottom: 16,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  seeAllLink: {
    fontSize: 14,
    color: '#8B4513',
    fontWeight: '600',
  },
  productsContainer: {
    paddingHorizontal: 16,
  },
});
