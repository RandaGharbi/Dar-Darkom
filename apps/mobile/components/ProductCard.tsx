import React from 'react';
import { Image, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { Product } from '../constants/types';

type ProductCardProps = {
  product: Product;
  cardWidth?: number;
};

const ProductCard = ({ product, cardWidth }: ProductCardProps) => {
  const router = useRouter();
  
  // Fonction pour valider les URLs d'images
  const isValidImageUrl = (url: string): boolean => {
    if (!url || typeof url !== 'string') return false;
    try {
      const urlObj = new URL(url);
      return urlObj.protocol === 'http:' || urlObj.protocol === 'https:';
    } catch {
      return false;
    }
  };

  // Fonction pour obtenir une URL d'image valide
  const getValidImageUrl = (): string => {
    const imageUrl = product.image_url || product.image;
    if (imageUrl && isValidImageUrl(imageUrl)) {
      return imageUrl;
    }
    return 'https://via.placeholder.com/150';
  };

  // Détecte si c'est un ingrédient (pas de prix, pas d'avis, champ name)
  const isIngredient = !!product.name && !product.price;

  // Fonction pour naviguer vers les détails du produit (seulement pour les produits, pas les ingrédients)
  const handleProductPress = () => {
    if (!isIngredient && product.id) {
      router.push(`/product-details/${product.id}`);
    }
  };

  return (
    <TouchableOpacity
      style={[styles.card, cardWidth ? { width: cardWidth } : null]}
      onPress={handleProductPress}
      activeOpacity={0.8}
    >
      <Image
        source={{ uri: getValidImageUrl() }}
        style={styles.image}
      />
      <Text style={styles.title}>{product.title || product.name || 'Sans nom'}</Text>
      {!isIngredient && (
        <Text style={styles.price}>
          {product.price
            ? `${product.price} €`
            : 'Prix inconnu'}
        </Text>
      )}

      {product.typeOfCare && <Text style={styles.care}>{product.typeOfCare}</Text>}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    flex: 1,
    margin: 8,
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 12,
    elevation: 2,
    minWidth: 160,
    maxWidth: 200,
  },
  image: { width: '100%', height: 120, borderRadius: 12 },
  title: { fontWeight: '600', marginTop: 8 },
  price: { color: '#2a9d8f', fontWeight: 'bold', marginTop: 4 },
  care: { color: '#aaa', fontSize: 12, marginTop: 2 },
});

export default ProductCard;
