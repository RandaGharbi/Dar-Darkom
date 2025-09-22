import React from 'react';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { View, Text, StyleSheet, Image, ScrollView, TouchableOpacity, Alert, Share } from 'react-native';
import { Link } from 'expo-router';
import { useSafeNavigation } from '../../hooks/useSafeNavigation';
import { useProducts } from '../../hooks/useProducts';
import { useAuth } from '../../context/AuthContext';
import { useCartStore } from '../../context/CartStore';
import { getCorrectImageUrl } from '../../utils/imageUtils';

export default function ProductDetailsScreen() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const { data: products, isLoading, error } = useProducts();
  const { safeBack } = useSafeNavigation();
  const { isAuthenticated, user } = useAuth();
  const { addToCart } = useCartStore();

  if (isLoading) return <Text style={styles.loading}>Chargement...</Text>;
  if (error) return <Text style={styles.error}>Erreur : {error.message}</Text>;

  const product = products?.find((p) => p.id.toString() === id);

  if (!product) {
    return <Text style={styles.error}>Produit introuvable</Text>;
  }

  // Valeurs statiques si absentes
  const staticDescription = "A luxurious, handmade cream crafted with natural ingredients to hydrate and protect your skin throughout the day. Infused with shea butter, jojoba oil, and chamomile extract, this cream provides a soothing and nourishing experience.";
  const staticBenefits = "Deeply hydrates and nourishes the skin, protects against environmental stressors, soothes and calms irritation, promotes a healthy and radiant complexion.";
  const staticHowToUse = "Apply a small amount to clean, dry skin in the morning. Gently massage in circular motions until fully absorbed. For best results, use daily.";
  const staticIngredients = "Shea Butter, Jojoba Oil, Chamomile Extract, Aloe Vera, Vitamin E, Lavender Essential Oil";

  // Marque : product.brand ou product.productBrand
  const brand = product.brand || product.productBrand || 'Brand';
  const title = product.title || product.name || 'Product';
  const description = product.description || staticDescription;
  const ingredients = product.ingredients || staticIngredients;
  const benefits = product.benefits || staticBenefits;
  const howToUse = product.howToUse || staticHowToUse;

  const handleAddToBag = async () => {
    if (!isAuthenticated) {
      router.push('/login');
      return;
    }
    try {
      await addToCart(user?._id || '', product.id.toString()); // Utilise l'id numérique
      Alert.alert('Succès', 'Produit ajouté au panier !');
    } catch (error) {
      console.error('Erreur lors de l\'ajout au panier:', error);
      Alert.alert('Erreur', 'Erreur serveur');
    }
  };

  const handleShare = async () => {
    try {
      const shareUrl = `https://votre-app.com/product-details/${id}`;
      await Share.share({
        message: `Découvrez ${title} - ${brand}\n${description}\n${shareUrl}`,
        url: shareUrl,
        title: title,
      });
    } catch (error) {
      console.error('Erreur lors du partage:', error);
    }
  };

  const handleAddToFavorites = () => {
    Alert.alert('Favoris', `${title} ajouté aux favoris !`);
  };

  return (
    <View style={{ flex: 1, backgroundColor: '#fff' }}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.iconBtn} onPress={safeBack}>
          <Text style={styles.icon}>←</Text>
        </TouchableOpacity>
        <View style={styles.headerActions}>
          <Link href={`/product-details/${id}`}>
            <Link.Trigger>
              <TouchableOpacity style={styles.shareBtn}>
                <Text style={styles.shareIcon}>📤</Text>
              </TouchableOpacity>
            </Link.Trigger>
            <Link.Menu>
              <Link.MenuAction 
                title="Partager" 
                icon="square.and.arrow.up" 
                onPress={handleShare} 
              />
              <Link.MenuAction 
                title="Favoris" 
                icon="heart" 
                onPress={handleAddToFavorites} 
              />
            </Link.Menu>
          </Link>
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Image produit */}
        <Image
          source={{ uri: getCorrectImageUrl(product.image_url || product.image || null) || product.image_url || product.image || 'https://via.placeholder.com/150' }}
          style={styles.image}
        />

        {/* Bloc central style maquette */}
        <View style={styles.centerBlock}>
          <Text style={styles.brand}>{brand}</Text>
          <Text style={styles.title}>{title}</Text>
          <Text style={styles.description}>{description}</Text>

          <Text style={styles.sectionTitle}>Ingredients</Text>
          <Text style={styles.sectionText}>{ingredients}</Text>

          <Text style={styles.sectionTitle}>Benefits</Text>
          <Text style={styles.description}>{benefits}</Text>

          <Text style={styles.sectionTitle}>How to Use</Text>
          <Text style={styles.description}>{howToUse}</Text>
        </View>
      </ScrollView>

      {/* Bouton Add to Bag */}
      <TouchableOpacity style={styles.addButton} onPress={handleAddToBag}>
        <Text style={styles.addButtonText}>Add to Bag</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 48,
    paddingHorizontal: 20,
    backgroundColor: '#fff',
  },
  headerActions: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  shareBtn: {
    padding: 8,
  },
  shareIcon: {
    fontSize: 20,
  },
  iconBtn: {
    padding: 8,
  },
  icon: {
    fontSize: 24,
  },
  scrollContent: {
    padding: 0,
    paddingBottom: 120,
  },
  image: {
    width: '100%',
    height: 500,
    marginBottom: 0,

  },
  centerBlock: {
    paddingHorizontal: 20,
    paddingTop: 24,
    paddingBottom: 16,
    backgroundColor: '#fff',
  },
  brand: {
    fontWeight: 'bold',
    fontSize: 14,
    marginBottom: 8,
    color: '#827e7e',
  },
  title: {
    fontWeight: 'bold',
    fontSize: 22,
    marginBottom: 12,
    textTransform: 'capitalize',
    color: '#222',
  },
  description: {
    fontSize: 15,
    color: '#171412',
    marginBottom: 18,
    fontFamily: 'sans-serif',
    lineHeight: 24,
  },
  sectionTitle: {
    fontWeight: 'bold',
    fontSize: 16,
    marginTop: 18,
    marginBottom: 4,
    color: '#222',
  },
  sectionText: {
    fontSize: 15,
    color: '#444',
    marginBottom: 8,
  },
  addButton: {
    position: 'absolute',
    left: 20,
    right: 20,
    bottom: 30,
    backgroundColor: '#ED9626',
    borderRadius: 24,
    paddingVertical: 16,
    alignItems: 'center',
    elevation: 2,
  },
  addButtonText: {
    color: '#000',
    fontWeight: 'bold',
    fontSize: 18,
  },
  loading: {
    marginTop: 40,
    textAlign: 'center',
    fontSize: 18,
  },
  error: {
    marginTop: 40,
    textAlign: 'center',
    fontSize: 18,
    color: 'red',
  },
}); 