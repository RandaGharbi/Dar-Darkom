import React, { useState } from 'react';
import { StyleSheet, View, Text, ScrollView, TouchableOpacity, Image, ImageBackground, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import SafeAreaWrapper from '../components/SafeAreaWrapper';
import { useSafeNavigation } from '../hooks/useSafeNavigation';
import { useAuth } from '../context/AuthContext';
import { useCartStore } from '../context/CartStore';

export default function ProductDetailScreen() {
  const router = useRouter();
  const { isAuthenticated, user } = useAuth();
  const { addToCart } = useCartStore();
  const { safeBack } = useSafeNavigation();
  const [quantity, setQuantity] = useState(1);

  const handleBack = () => {
    safeBack();
  };

  const handleShare = () => {
    // Fonction de partage
    console.log('Partage...');
  };

  const handleAddToCart = async () => {
    if (!isAuthenticated || !user?._id) {
      Alert.alert('Connexion requise', 'Veuillez vous connecter pour ajouter des produits au panier');
      router.push('/login');
      return;
    }
    
    try {
      // Pour cette page statique, on utilise un ID fictif
      const result = await addToCart(user._id, '1');
      if (result) {
        Alert.alert('Succès', 'Produit ajouté au panier !');
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

  return (
    <SafeAreaWrapper backgroundColor="#000" edges={['top']}>
      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        {/* Image Section */}
        <View style={styles.imageSection}>
          <ImageBackground
            source={{ uri: 'https://www.bennasafi.com/media/medium/1578061341_couscous.bel.alouch.png' }}
            style={styles.productImage}
            resizeMode="cover"
          >
            <View style={styles.imageOverlay}>
              <TouchableOpacity style={styles.backButton} onPress={handleBack}>
                <Ionicons name="arrow-back" size={24} color="#fff" />
              </TouchableOpacity>
              <TouchableOpacity style={styles.shareButton} onPress={handleShare}>
                <Ionicons name="share-outline" size={24} color="#fff" />
              </TouchableOpacity>
            </View>
          </ImageBackground>
        </View>

        {/* Content Section */}
        <View style={styles.contentSection}>
          {/* Title and Price */}
          <View style={styles.titleRow}>
            <Text style={styles.productTitle}>Homemade Couscous</Text>
            <Text style={styles.productPrice}>$15.99</Text>
          </View>

          {/* Description */}
          <Text style={styles.description}>
            A classic North African dish, our couscous is made with semolina grains, tender meat, and a medley of fresh vegetables, simmered in a rich, aromatic broth. A hearty and flavorful meal that brings the taste of home to your table.
          </Text>

          {/* Ingredients */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Ingredients</Text>
            <Text style={styles.ingredients}>
              Semolina, lamb or chicken, carrots, potatoes, zucchini, chickpeas, onions, tomatoes, spices (turmeric, cumin, coriander, paprika), olive oil, vegetable broth.
            </Text>
          </View>

          {/* About the Chef */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>About the Chef</Text>
            <View style={styles.chefCard}>
              <Image
                source={{ uri: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=100&h=100&fit=crop&crop=face' }}
                style={styles.chefImage}
              />
              <View style={styles.chefInfo}>
                <Text style={styles.chefName}>Fatima Ben Ali</Text>
                <Text style={styles.chefKitchen}>Fatima's Kitchen</Text>
                <Text style={styles.chefDescription}>
                  Fatima Ben Ali brings over 20 years of experience in traditional North African cuisine, specializing in authentic couscous and tagine dishes.
                </Text>
              </View>
            </View>
          </View>

          {/* Quantity Selector */}
          <View style={styles.quantitySection}>
            <Text style={styles.quantityLabel}>Quantity</Text>
            <View style={styles.quantitySelector}>
              <TouchableOpacity 
                style={styles.quantityButton} 
                onPress={() => handleQuantityChange(-1)}
              >
                <Ionicons name="remove" size={20} color="#FF6B35" />
              </TouchableOpacity>
              <Text style={styles.quantityText}>{quantity}</Text>
              <TouchableOpacity 
                style={styles.quantityButton} 
                onPress={() => handleQuantityChange(1)}
              >
                <Ionicons name="add" size={20} color="#FF6B35" />
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </ScrollView>

      {/* Add to Cart Button */}
      <View style={styles.bottomButtonContainer}>
        <TouchableOpacity style={styles.addToCartButton} onPress={handleAddToCart}>
          <Text style={styles.addToCartText}>Add to Cart</Text>
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
    color: '#FF6B35',
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
    borderColor: '#FF6B35',
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
    backgroundColor: '#FF6B35',
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  addToCartText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
});
