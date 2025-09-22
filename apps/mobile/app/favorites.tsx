import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Image,
  ScrollView,
  ActivityIndicator,
  Alert,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
// import { useAuth } from "../context/AuthContext";
import { useSafeNavigation } from "../hooks/useSafeNavigation";
import { useFavorites } from "../context/FavoritesContext";
import SafeAreaWrapper from "../components/SafeAreaWrapper";
import { OrientalColors } from "../constants/Colors";

interface FavoriteProduct {
  _id: string;
  name: string;
  price: number;
  image: string;
  description?: string;
  category?: string;
}

export default function FavoritesScreen() {
  const router = useRouter();
  const { safeBack } = useSafeNavigation();
  const { favorites, removeFromFavorites, loading } = useFavorites();

  // Les favoris sont maintenant gérés par le contexte

  const handleGoBack = () => {
    safeBack();
  };

  const handleProductPress = (productId: string) => {
    router.push(`/product-details/${productId}`);
  };

  const handleRemoveFavorite = (productId: string) => {
    Alert.alert(
      'Supprimer des favoris',
      'Êtes-vous sûr de vouloir supprimer ce produit de vos favoris ?',
      [
        { text: 'Annuler', style: 'cancel' },
        {
          text: 'Supprimer',
          style: 'destructive',
          onPress: async () => {
            await removeFromFavorites(productId);
            Alert.alert('Succès', 'Produit supprimé de vos favoris');
          }
        }
      ]
    );
  };

  const handleAddToCart = (product: FavoriteProduct) => {
    Alert.alert('Ajouter au panier', `${product.name} ajouté au panier !`);
  };

  const renderFavoriteItem = (product: FavoriteProduct) => (
    <TouchableOpacity
      key={product._id}
      style={styles.favoriteItem}
      onPress={() => handleProductPress(product._id)}
    >
      <Image
        source={{ uri: product.image }}
        style={styles.productImage}
        resizeMode="cover"
      />
      <View style={styles.productInfo}>
        <Text style={styles.productName}>{product.name}</Text>
        <Text style={styles.productDescription} numberOfLines={2}>
          {product.description}
        </Text>
        <Text style={styles.productCategory}>{product.category}</Text>
        <Text style={styles.productPrice}>{product.price.toFixed(2)} €</Text>
      </View>
      <View style={styles.actionButtons}>
        <TouchableOpacity
          style={styles.actionButton}
          onPress={() => handleAddToCart(product)}
        >
          <Ionicons name="add-circle-outline" size={24} color={OrientalColors.warning} />
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.actionButton}
          onPress={() => handleRemoveFavorite(product._id)}
        >
          <Ionicons name="heart" size={24} color="#FF3B30" />
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaWrapper backgroundColor="#f5f5f5" edges={['top']}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={handleGoBack}>
          <Ionicons name="arrow-back" size={24} color="#000" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Plats favoris</Text>
        <View style={styles.headerSpacer} />
      </View>

      {/* Content */}
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {loading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color={OrientalColors.warning} />
            <Text style={styles.loadingText}>Chargement de vos favoris...</Text>
          </View>
        ) : favorites.length > 0 ? (
          <View style={styles.favoritesContainer}>
            {favorites.map(renderFavoriteItem)}
          </View>
        ) : (
          <View style={styles.emptyState}>
            <Ionicons name="heart-outline" size={64} color="#8E8E93" />
            <Text style={styles.emptyStateTitle}>Aucun plat favori</Text>
            <Text style={styles.emptyStateSubtitle}>
              Ajoutez des plats à vos favoris en cliquant sur l&apos;icône cœur
            </Text>
            <TouchableOpacity
              style={styles.exploreButton}
              onPress={() => router.push('/(tabs)')}
            >
              <Text style={styles.exploreButtonText}>Explorer les plats</Text>
            </TouchableOpacity>
          </View>
        )}
      </ScrollView>
    </SafeAreaWrapper>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: "#f5f5f5",
  },
  backButton: {
    padding: 8,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#000",
    textAlign: "center",
  },
  headerSpacer: {
    width: 40,
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 60,
  },
  loadingText: {
    fontSize: 16,
    color: "#8E8E93",
    marginTop: 16,
  },
  favoritesContainer: {
    paddingTop: 20,
  },
  favoriteItem: {
    flexDirection: "row",
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  productImage: {
    width: 80,
    height: 80,
    borderRadius: 8,
    marginRight: 12,
  },
  productInfo: {
    flex: 1,
    justifyContent: "space-between",
  },
  productName: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
    marginBottom: 4,
  },
  productDescription: {
    fontSize: 14,
    color: "#8E8E93",
    marginBottom: 4,
    lineHeight: 18,
  },
  productCategory: {
    fontSize: 12,
    color: OrientalColors.warning,
    fontWeight: "500",
    marginBottom: 4,
  },
  productPrice: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
  },
  actionButtons: {
    flexDirection: "column",
    justifyContent: "space-between",
    alignItems: "center",
    paddingLeft: 8,
  },
  actionButton: {
    padding: 8,
  },
  emptyState: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 80,
    paddingHorizontal: 40,
  },
  emptyStateTitle: {
    fontSize: 20,
    fontWeight: "600",
    color: "#333",
    marginTop: 16,
    marginBottom: 8,
  },
  emptyStateSubtitle: {
    fontSize: 16,
    color: "#8E8E93",
    textAlign: "center",
    lineHeight: 22,
    marginBottom: 24,
  },
  exploreButton: {
    backgroundColor: OrientalColors.warning,
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  exploreButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
});
