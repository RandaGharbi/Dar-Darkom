import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text, ScrollView, TouchableOpacity, Image, ImageBackground, Alert, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter, useLocalSearchParams } from 'expo-router';
import SafeAreaWrapper from '../components/SafeAreaWrapper';
import { useSafeNavigation } from '../hooks/useSafeNavigation';
import { useAuth } from '../context/AuthContext';
import { useCartStore } from '../context/CartStore';
import { useFavorites } from '../context/FavoritesContext';
import { productApi } from '../services/productApi';
import { Product } from '../constants/types';

export default function ProductDetailScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const { isAuthenticated, user } = useAuth();
  const { addToCart } = useCartStore();
  const { addToFavorites, removeFromFavorites, isFavorite } = useFavorites();
  const { safeBack } = useSafeNavigation();
  const [quantity, setQuantity] = useState(1);
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Récupérer les données du produit
  useEffect(() => {
    const fetchProduct = async () => {
      if (!id) {
        setError('ID du produit manquant');
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const productData = await productApi.getProductById(id);
        console.log('=== DEBUG PRODUIT ===');
        console.log('Produit chargé:', productData);
        console.log('Image URL:', productData.image);
        console.log('Type de l\'image:', typeof productData.image);
        console.log('Image existe:', !!productData.image);
        console.log('===================');
        setProduct(productData);
      } catch (err: any) {
        console.error('Erreur lors du chargement du produit:', err);
        const errorMessage = err.response?.data?.message || err.message || 'Erreur lors du chargement du produit';
        setError(errorMessage);
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  const handleBack = () => {
    safeBack();
  };

  const handleShare = () => {
    // Fonction de partage
    console.log('Partage...');
  };

  const handleToggleFavorite = async () => {
    if (!isAuthenticated) {
      Alert.alert('Connexion requise', 'Veuillez vous connecter pour ajouter des produits aux favoris');
      router.push('/login');
      return;
    }
    
    if (!product) return;

    const favoriteProduct = {
      _id: product.id.toString(),
      name: product.name,
      price: product.price,
      image: product.image || 'https://via.placeholder.com/150',
      description: product.subtitle || product.description,
      category: product.category
    };

    if (isFavorite(product.id.toString())) {
      await removeFromFavorites(product.id.toString());
      Alert.alert('Favoris', `${product.name} supprimé des favoris !`);
    } else {
      await addToFavorites(favoriteProduct);
      Alert.alert('Favoris', `${product.name} ajouté aux favoris !`);
    }
  };

  const handleAddToCart = async () => {
    if (!isAuthenticated || !user?._id) {
      Alert.alert('Connexion requise', 'Veuillez vous connecter pour ajouter des produits au panier');
      router.push('/login');
      return;
    }

    if (!product || !id) {
      Alert.alert('Erreur', 'Produit non trouvé');
      return;
    }
    
    try {
      const result = await addToCart(user._id, id, quantity);
      if (result) {
        // Produit ajouté au panier avec succès (pas d'alert)
      } else {
        Alert.alert('Erreur', 'Impossible d\'ajouter le produit au panier');
      }
    } catch (error) {
      console.error('Erreur lors de l\'ajout au panier:', error);
      Alert.alert('Erreur', 'Erreur lors de l\'ajout au panier');
    }
  };

  const handleQuantityChange = (change: number) => {
    const newQuantity = quantity + change;
    if (newQuantity >= 1) {
      setQuantity(newQuantity);
    }
  };

  // Écran de chargement
  if (loading) {
    return (
      <SafeAreaWrapper backgroundColor="#fff" edges={['top']}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#2E86AB" />
          <Text style={styles.loadingText}>Chargement du produit...</Text>
        </View>
      </SafeAreaWrapper>
    );
  }

  // Écran d'erreur
  if (error || !product) {
    return (
      <SafeAreaWrapper backgroundColor="#fff" edges={['top']}>
        <View style={styles.errorContainer}>
          <Ionicons name="alert-circle" size={64} color="#2E86AB" />
          <Text style={styles.errorText}>{error || 'Produit non trouvé'}</Text>
          <TouchableOpacity style={styles.retryButton} onPress={handleBack}>
            <Text style={styles.retryButtonText}>Retour</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaWrapper>
    );
  }

  return (
    <SafeAreaWrapper backgroundColor="#000" edges={['top']}>
      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        {/* Image Section */}
        <View style={styles.imageSection}>
          <ImageBackground
            source={{ 
              uri: product.image || 'https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=400&h=300&fit=crop'
            }}
            style={styles.productImage}
            resizeMode="cover"
            onError={(error) => {
              console.log('Erreur de chargement de l\'image du produit:', error);
              console.log('URL de l\'image:', product.image);
            }}
          >
            <View style={styles.imageOverlay}>
              <TouchableOpacity style={styles.backButton} onPress={handleBack}>
                <Ionicons name="arrow-back" size={24} color="#fff" />
              </TouchableOpacity>
              <View style={styles.headerActions}>
                <TouchableOpacity style={styles.favoriteButton} onPress={handleToggleFavorite}>
                  <Ionicons 
                    name={product && isFavorite(product.id.toString()) ? "heart" : "heart-outline"} 
                    size={24} 
                    color="#fff" 
                  />
                </TouchableOpacity>
                <TouchableOpacity style={styles.shareButton} onPress={handleShare}>
                  <Ionicons name="share-outline" size={24} color="#fff" />
                </TouchableOpacity>
              </View>
            </View>
          </ImageBackground>
        </View>

        {/* Content Section */}
        <View style={styles.contentSection}>
          {/* Title and Price */}
          <View style={styles.titleRow}>
            <Text style={styles.productTitle}>{product.name}</Text>
            <Text style={styles.productPrice}>{product.price.toFixed(2)} €</Text>
          </View>

          {/* Category */}
          {product.category && (
            <View style={styles.categoryContainer}>
              <Text style={styles.categoryText}>{product.category}</Text>
            </View>
          )}

          {/* Description */}
          <Text style={styles.description}>
            {product.subtitle || product.description || 'Un classique de la cuisine tunisienne traditionnelle avec viande et légumes.'}
          </Text>

          {/* Daily Special Badge */}
          {product.dailySpecial && (
            <View style={styles.specialBadge}>
              <Ionicons name="star" size={16} color="#FFD700" />
              <Text style={styles.specialBadgeText}>Plat du jour</Text>
            </View>
          )}

          {/* Chef Section */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>À propos du chef</Text>
            <View style={styles.chefCard}>
              <Image 
                source={{ uri: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face' }}
                style={styles.chefImage}
                resizeMode="cover"
              />
              <View style={styles.chefInfo}>
                <Text style={styles.chefName}>Chef Mohamed</Text>
                <Text style={styles.chefKitchen}>Cuisine Traditionnelle Tunisienne</Text>
                <Text style={styles.chefDescription}>
                  Chef expérimenté avec plus de 15 ans d'expérience dans la cuisine traditionnelle tunisienne. 
                  Spécialisé dans les plats authentiques et les recettes transmises de génération en génération.
                </Text>
              </View>
            </View>
          </View>

          {/* Quantity Selector */}
          <View style={styles.quantitySection}>
            <Text style={styles.quantityLabel}>Quantité</Text>
            <View style={styles.quantitySelector}>
              <TouchableOpacity 
                style={styles.quantityButton} 
                onPress={() => handleQuantityChange(-1)}
              >
                <Ionicons name="remove" size={20} color="#2E86AB" />
              </TouchableOpacity>
              <Text style={styles.quantityText}>{quantity}</Text>
              <TouchableOpacity 
                style={styles.quantityButton} 
                onPress={() => handleQuantityChange(1)}
              >
                <Ionicons name="add" size={20} color="#2E86AB" />
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </ScrollView>

      {/* Add to Cart Button */}
      <View style={styles.bottomButtonContainer}>
        <TouchableOpacity style={styles.addToCartButton} onPress={handleAddToCart}>
          <Text style={styles.addToCartText}>Ajouter au panier - {(product.price * quantity).toFixed(2)} €</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaWrapper>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  imageSection: {
    height: 300,
  },
  productImage: {
    width: '100%',
    height: '100%',
  },
  imageOverlay: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    paddingTop: 50,
    paddingHorizontal: 20,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  favoriteButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  shareButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  contentSection: {
    padding: 20,
    backgroundColor: '#fff',
  },
  titleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  productTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    flex: 1,
  },
  productPrice: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#2E86AB',
  },
  description: {
    fontSize: 16,
    color: '#666',
    lineHeight: 24,
    marginBottom: 24,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 12,
  },
  ingredients: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
  },
  chefCard: {
    flexDirection: 'row',
    backgroundColor: '#f8f9fa',
    padding: 16,
    borderRadius: 12,
  },
  chefImage: {
    width: 60,
    height: 60,
    borderRadius: 30,
    marginRight: 16,
  },
  chefInfo: {
    flex: 1,
  },
  chefName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  chefKitchen: {
    fontSize: 14,
    color: '#666',
    marginBottom: 8,
  },
  chefDescription: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
  },
  quantitySection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  quantityLabel: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  quantitySelector: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  quantityButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#f8f9fa',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#2E86AB',
  },
  quantityText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginHorizontal: 20,
  },
  bottomButtonContainer: {
    padding: 20,
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
  },
  addToCartButton: {
    backgroundColor: '#2E86AB',
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  addToCartText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: '#666',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 20,
  },
  errorText: {
    marginTop: 16,
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginBottom: 20,
  },
  retryButton: {
    backgroundColor: '#2E86AB',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  retryButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  categoryContainer: {
    marginBottom: 16,
  },
  categoryText: {
    fontSize: 14,
    color: '#2E86AB',
    fontWeight: '600',
    backgroundColor: '#FFF5F0',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    alignSelf: 'flex-start',
  },
  specialBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF8DC',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    alignSelf: 'flex-start',
    marginBottom: 16,
  },
  specialBadgeText: {
    fontSize: 14,
    color: '#B8860B',
    fontWeight: '600',
    marginLeft: 4,
  },
  imagePlaceholder: {
    width: '100%',
    height: '100%',
    backgroundColor: '#f8f9fa',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  imagePlaceholderText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#2E86AB',
    marginTop: 16,
    textAlign: 'center',
  },
  imagePlaceholderSubtext: {
    fontSize: 16,
    color: '#666',
    marginTop: 8,
    textAlign: 'center',
  },
});
