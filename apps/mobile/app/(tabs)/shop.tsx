import React, { useState } from "react";
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  Image,
  ActivityIndicator,
  Alert,
} from "react-native";
import { useRouter, useNavigation } from "expo-router";
import { useFavoritesStore } from "../../context/FavoritesStore";
import { useProductsByCategory } from "../../hooks/useProducts";
import AsyncStorage from '@react-native-async-storage/async-storage';

import ProductItem from "../../components/ProductItem";

import goBackIcon from "../../assets/images/back.png";
import { useAuth } from "../../context/AuthContext";
import { useCartStore } from "../../context/CartStore";

const categories = ["All", "Face", "Body", "Hair"];

const ShopScreen: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [addedToCart, setAddedToCart] = useState<Set<string>>(new Set());
  const { isAuthenticated, user } = useAuth();
  const { addToCart } = useCartStore();
  
  const router = useRouter();
  const navigation = useNavigation();

  const { 
    data: products, 
    isLoading, 
    error 
  } = useProductsByCategory(selectedCategory);

  // Zustand favoris
  const { isFavorite, addFavorite, removeFavorite } = useFavoritesStore();

  const handleBasketPress = async (item: any) => {
    if (!isAuthenticated || !user?._id) {
      router.push('/login');
      return;
    }
    
    try {
      // Utilise d'abord l'ID numérique, sinon le _id MongoDB
      const productId = item.id || item._id;
      
      if (!productId) {
        Alert.alert('Erreur', 'ID du produit manquant');
        return;
      }
      
      await addToCart(user._id, productId.toString());
      
      // Feedback visuel immédiat
      setAddedToCart(prev => new Set([...prev, productId.toString()]));
      
      // Retirer l'indicateur après 2 secondes
      setTimeout(() => {
        setAddedToCart(prev => {
          const newSet = new Set(prev);
          newSet.delete(productId.toString());
          return newSet;
        });
      }, 2000);
    } catch (error) {
      Alert.alert('Erreur', 'Impossible d\'ajouter le produit au panier');
    }
  };

  // Nouvelle logique favoris
  const handleToggleFavorite = async (item: any) => {
    let token: string | undefined = undefined;
    if (isAuthenticated) {
      const t = await AsyncStorage.getItem('authToken');
      token = t || undefined;
    }
    // Construction d'un objet produit complet pour l'API favoris
    const product = {
      id: item.id,
      title: item.title || item.name,
      subtitle: item.subtitle || '',
      image_url: item.image_url || item.image || '',
      price: item.price,
      category: item.category,
      productType: item.productType,
      name: item.title || item.name
    };
    if (isFavorite(item.id)) {
      await removeFavorite(item.id, isAuthenticated, token);
    } else {
      await addFavorite(product, isAuthenticated, token);
    }
  };

  // Gestion du bouton retour
  const handleGoBack = () => {
    if (navigation.canGoBack && navigation.canGoBack()) {
      router.back();
    } else {
      router.replace('/'); // ou router.push('/home') selon ta structure
    }
  };

  // Transformer les produits pour correspondre au format attendu par ProductItem
  const transformedProducts = products
    ?.filter((item: any) => item && item.productType !== "ingredient")
    .map((item: any) => ({
      _id: item._id || item.id,
      id: item.id || item._id,
      uniqueId: (item._id || item.id)?.toString() || '',
      title: item.title || item.name || 'Produit sans nom',
      subtitle: item.subtitle || '',
      image_url: item.image_url || item.image || '',
      price: item.price || 0,
      category: item.category || '',
    }))
    .filter((item: any) => item.title && item.price !== undefined) || [];

  if (error) {
    Alert.alert(
      "Erreur",
      "Impossible de charger les produits. Veuillez réessayer.",
      [{ text: "OK" }]
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.goBackButton}
          onPress={handleGoBack}
        >
          <Image source={goBackIcon} style={styles.goBackIcon} />
        </TouchableOpacity>
        <Text style={styles.title}>Shop</Text>
        <View style={styles.goBackButton} /> {/* placeholder pour équilibrer */}
      </View>

      <View style={styles.categories}>
        {categories.map((cat) => (
          <TouchableOpacity
            key={cat}
            onPress={() => setSelectedCategory(cat)}
            style={[
              styles.categoryButton,
              selectedCategory === cat && styles.categorySelected,
            ]}
          >
            <Text
              style={[
                styles.categoryText,
                selectedCategory === cat && styles.categoryTextSelected,
              ]}
            >
              {cat}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {isLoading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#000" />
          <Text style={styles.loadingText}>Chargement des produits...</Text>
        </View>
      ) : (
        <FlatList
          data={transformedProducts}
          numColumns={2}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => (
            <ProductItem
              product={item}
              isFavorite={isFavorite(item.id)}
              onToggleFavorite={() => handleToggleFavorite(item)}
              onPressBasket={() => handleBasketPress(item)}
              isAddedToCart={addedToCart.has(item.id.toString())}
            />
          )}
          columnWrapperStyle={styles.row}
          contentContainerStyle={{ paddingBottom: 20 }}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyText}>
                Aucun produit trouvé pour cette catégorie
              </Text>
            </View>
          }
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    paddingHorizontal: 16,
    paddingTop: 50,
  },
  title: { fontSize: 24, fontWeight: "bold", marginVertical: 16 },
  categories: { flexDirection: "row", marginBottom: 16, flexWrap: "wrap" },
  categoryButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    backgroundColor: "#eee",
    marginRight: 8,
    marginBottom: 20,
  },
  categorySelected: {
    backgroundColor: "#000",
  },
  categoryText: {
    fontSize: 14,
    color: "#555",
  },
  categoryTextSelected: {
    color: "#fff",
  },
  row: {
    justifyContent: "space-between",
  },
  goBackButton: {
    padding: 8,
    width: 40,
    alignItems: "flex-start",
  },
  goBackIcon: {
    width: 24,
    height: 24,
    tintColor: "black",
    resizeMode: "contain",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    height: 60,
    paddingHorizontal: 16,
    backgroundColor: "#fff",
    justifyContent: "space-between",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: "#666",
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 50,
  },
  emptyText: {
    fontSize: 16,
    color: "#666",
    textAlign: "center",
  },
});

export default ShopScreen;
