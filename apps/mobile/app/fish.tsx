import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text, ScrollView, TouchableOpacity, Image, ActivityIndicator, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useSafeNavigation } from '../hooks/useSafeNavigation';
import { apiService } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { useCartStore } from '../context/CartStore';

interface FishProduct {
  id: number;
  name: string;
  title: string;
  subtitle: string;
  image: string;
  product_url: string;
  price: number;
  category: string;
  arrivals: string;
  quantity: number;
  status: string;
  productType: string;
  dailySpecial: boolean;
  nessma_recipe?: {
    url: string;
    description: string;
  };
}

const FISH_CATEGORIES = [
  'Toutes',
  'Poissons',
  'Fruits de Mer',
  'Couscous',
  'Grillés',
  'Au Four'
];

export default function FishScreen() {
  const router = useRouter();
  const { isAuthenticated, user } = useAuth();
  const { addToCart } = useCartStore();
  const { safeBack } = useSafeNavigation();
  const [selectedCategory, setSelectedCategory] = useState('Toutes');
  const [products, setProducts] = useState<FishProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Récupérer les données depuis l'API
  useEffect(() => {
    fetchFishProducts();
  }, []);

  const fetchFishProducts = async () => {
    try {
      setLoading(true);
      const response = await apiService.getFishProducts();
      
      if (response.success && response.data) {
        setProducts(response.data);
        setError(null);
      } else {
        throw new Error(response.error || 'Erreur lors de la récupération des produits');
      }
    } catch (err) {
      console.error('Erreur lors de la récupération des produits:', err);
      setError('Impossible de charger les produits');
      // Données de démonstration en cas d'erreur
      setProducts(getMockFishProducts());
    } finally {
      setLoading(false);
    }
  };

  // Données de démonstration
  const getMockFishProducts = (): FishProduct[] => [
    {
      id: 1,
      name: "Dorade Grillée",
      title: "Dorade Grillée",
      subtitle: "Poissons & Fruits de Mer",
      image: "https://cuisine.nessma.tv/uploads/7/2022-01/daurade-grillee-citron.jpg",
      product_url: "https://example.com/produits/dorade_grillée",
      price: 25,
      arrivals: "NOUVEAU",
      category: "Poissons",
      quantity: 50,
      status: "Active",
      productType: "fish",
      dailySpecial: true,
      nessma_recipe: {
        url: "https://cuisine.nessma.tv/fr/recette/2510/cuisine-du-monde/fruit-de-mer/daurade-grillee-au-citron",
        description: "Une belle daurade grillée au barbecue, assaisonnée avec du citron et du thym."
      }
    },
    {
      id: 2,
      name: "Loup de Mer au Four",
      title: "Loup de Mer au Four",
      subtitle: "Poissons & Fruits de Mer",
      image: "https://cuisine.nessma.tv/uploads/7/2022-01/loup-de-mer-au-four.jpg",
      product_url: "https://example.com/produits/loup_de_mer_au_four",
      price: 28,
      arrivals: "Non",
      category: "Poissons",
      quantity: 49,
      status: "Active",
      productType: "fish",
      dailySpecial: false
    },
    {
      id: 3,
      name: "Couscous au Mérou",
      title: "Couscous au Mérou",
      subtitle: "Poissons & Fruits de Mer",
      image: "https://cuisine.nessma.tv/uploads/7/2022-01/couscous-tunisien-loup-mer.jpg",
      product_url: "https://example.com/produits/couscous_au_mérou",
      price: 30,
      arrivals: "Non",
      category: "Poissons",
      quantity: 48,
      status: "Active",
      productType: "fish",
      dailySpecial: false
    }
  ];

  const filteredProducts = selectedCategory === 'Toutes' 
    ? products 
    : products.filter(p => {
        switch(selectedCategory) {
          case 'Poissons':
            return p.category === 'Poissons';
          case 'Fruits de Mer':
            return p.category === 'Fruits de Mer';
          case 'Couscous':
            return p.name.toLowerCase().includes('couscous');
          case 'Grillés':
            return p.name.toLowerCase().includes('grillé');
          case 'Au Four':
            return p.name.toLowerCase().includes('four');
          default:
            return true;
        }
      });

  const handleAddToCart = async (productId: number) => {
    if (!isAuthenticated) {
      router.push('/login');
      return;
    }
    
    try {
      await addToCart(user?._id || '', productId.toString());
      const product = products.find(p => p.id === productId);
      // Produit ajouté au panier avec succès (pas d'alert)
    } catch (error) {
      console.error('Erreur lors de l\'ajout au panier:', error);
      Alert.alert('Erreur', 'Erreur lors de l\'ajout au panier');
    }
  };

  const handleProductPress = (product: FishProduct) => {
    router.push(`/product-details/${product.id}`);
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#8B4513" />
          <Text style={styles.loadingText}>Chargement des produits...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerContent}>
          <TouchableOpacity 
            style={styles.backButton}
            onPress={safeBack}
          >
            <Ionicons name="arrow-back" size={24} color="#8B4513" />
          </TouchableOpacity>
          <View style={styles.headerCenter}>
            <Text style={styles.headerTitle}>Poissons & Fruits de Mer</Text>
          </View>
          <View style={styles.headerActions}>
            <TouchableOpacity style={styles.filterButton}>
              <Ionicons name="options-outline" size={20} color="#8B4513" />
              <Text style={styles.filterText}>Filtrer</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.sortButton}>
              <Ionicons name="swap-vertical-outline" size={20} color="#8B4513" />
              <Text style={styles.sortText}>Trier</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>

      {/* Onglets Catégories */}
      <View style={styles.tabsContainer}>
        <View style={styles.tabs}>
          <TouchableOpacity 
            style={[styles.tab, styles.tabActive]}
          >
            <Text style={styles.tabTextActive}>🐟 Poissons & Fruits de Mer</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Categories horizontales */}
      <View style={styles.categoriesSection}>
        <ScrollView 
          horizontal 
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.categoriesContainer}
        >
          {FISH_CATEGORIES.map((category) => (
            <TouchableOpacity
              key={category}
              style={[
                styles.categoryChip,
                selectedCategory === category && styles.categoryChipSelected
              ]}
              onPress={() => setSelectedCategory(category)}
            >
              <Text style={[
                styles.categoryText,
                selectedCategory === category && styles.categoryTextSelected
              ]}>
                {category}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {/* Message d'erreur */}
      {error && (
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>{error}</Text>
          <TouchableOpacity style={styles.retryButton} onPress={fetchFishProducts}>
            <Text style={styles.retryButtonText}>Réessayer</Text>
          </TouchableOpacity>
        </View>
      )}

      {/* Contenu principal */}
      <ScrollView style={styles.mainContent} showsVerticalScrollIndicator={false}>
        {/* Bannière spéciale poissons */}
        <View style={styles.fishBanner}>
          <View style={styles.bannerContent}>
            <View style={styles.bannerIcon}>
              <Text style={styles.fishEmoji}>🐟</Text>
            </View>
            <View style={styles.bannerText}>
              <Text style={styles.bannerTitle}>Frais du Jour</Text>
              <Text style={styles.bannerSubtitle}>Poissons & fruits de mer • Livraison gratuite</Text>
            </View>
          </View>
        </View>

        {/* Grille produits */}
        <View style={styles.productsGrid}>
          {filteredProducts.map((product) => (
            <TouchableOpacity 
              key={product.id} 
              style={styles.productCard}
              onPress={() => handleProductPress(product)}
            >
              <View style={styles.productBadge}>
                <Text style={styles.productBadgeText}>
                  {product.arrivals === 'NOUVEAU' ? 'NOUVEAU' : 'Poisson'}
                </Text>
              </View>
              
              {product.dailySpecial && (
                <View style={styles.specialBadge}>
                  <Text style={styles.specialBadgeText}>⭐ Spécial</Text>
                </View>
              )}

              <View style={styles.productImageContainer}>
                {product.image ? (
                  <Image 
                    source={{ uri: product.image }} 
                    style={styles.productImage}
                    resizeMode="cover"
                  />
                ) : (
                  <View style={styles.productPlaceholder}>
                    <Text style={styles.productEmoji}>🐟</Text>
                  </View>
                )}
              </View>

              <View style={styles.productInfo}>
                <Text style={styles.productName} numberOfLines={2}>
                  {product.name}
                </Text>
                <Text style={styles.productSubtitle} numberOfLines={1}>
                  {product.subtitle}
                </Text>
                <Text style={styles.productPrice}>{product.price.toFixed(2)} DT</Text>
                
                {product.nessma_recipe && (
                  <View style={styles.recipeInfo}>
                    <Ionicons name="restaurant-outline" size={12} color="#8B4513" />
                    <Text style={styles.recipeText}>Recette disponible</Text>
                  </View>
                )}
              </View>

              <TouchableOpacity 
                style={styles.addButton}
                onPress={() => handleAddToCart(product.id)}
              >
                <Text style={styles.addButtonText}>+ Ajouter</Text>
              </TouchableOpacity>
            </TouchableOpacity>
          ))}
        </View>

        {filteredProducts.length === 0 && !loading && (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyEmoji}>🐟</Text>
            <Text style={styles.emptyTitle}>Aucun produit trouvé</Text>
            <Text style={styles.emptySubtitle}>
              Essayez de changer de catégorie ou de réessayer plus tard
            </Text>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F8F8',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: '#8B4513',
  },
  header: {
    backgroundColor: '#fff',
    paddingHorizontal: 20,
    paddingVertical: 15,
  },
  headerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  backButton: {
    padding: 8,
  },
  headerCenter: {
    flex: 1,
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
  },
  headerActions: {
    flexDirection: 'row',
    gap: 12,
  },
  filterButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 12,
    paddingVertical: 6,
    backgroundColor: '#F8F8F8',
    borderRadius: 15,
  },
  filterText: {
    color: '#8B4513',
    fontSize: 12,
    fontWeight: '500',
  },
  sortButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 12,
    paddingVertical: 6,
    backgroundColor: '#F8F8F8',
    borderRadius: 15,
  },
  sortText: {
    color: '#8B4513',
    fontSize: 12,
    fontWeight: '500',
  },
  tabsContainer: {
    backgroundColor: '#fff',
    paddingHorizontal: 20,
    paddingBottom: 10,
  },
  tabs: {
    flexDirection: 'row',
  },
  tab: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
    marginRight: 10,
  },
  tabActive: {
    backgroundColor: '#E3F2FD',
  },
  tabTextActive: {
    color: '#1976D2',
    fontSize: 14,
    fontWeight: '600',
  },
  categoriesSection: {
    backgroundColor: '#fff',
    paddingVertical: 15,
  },
  categoriesContainer: {
    paddingHorizontal: 20,
  },
  categoryChip: {
    backgroundColor: '#F0F0F0',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 15,
    marginRight: 10,
  },
  categoryChipSelected: {
    backgroundColor: '#1976D2',
  },
  categoryText: {
    color: '#666',
    fontSize: 14,
    fontWeight: '500',
  },
  categoryTextSelected: {
    color: '#fff',
  },
  errorContainer: {
    backgroundColor: '#FFEBEE',
    padding: 15,
    margin: 20,
    borderRadius: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  errorText: {
    color: '#C62828',
    fontSize: 14,
    flex: 1,
  },
  retryButton: {
    backgroundColor: '#C62828',
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 15,
  },
  retryButtonText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '600',
  },
  mainContent: {
    flex: 1,
    backgroundColor: '#F8F8F8',
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  fishBanner: {
    backgroundColor: '#E3F2FD',
    borderRadius: 15,
    marginBottom: 20,
    padding: 20,
    borderWidth: 1,
    borderColor: '#BBDEFB',
  },
  bannerContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  bannerIcon: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#1976D2',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  fishEmoji: {
    fontSize: 28,
  },
  bannerText: {
    flex: 1,
  },
  bannerTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1976D2',
    marginBottom: 4,
  },
  bannerSubtitle: {
    fontSize: 14,
    color: '#1976D2',
    fontWeight: '500',
  },
  productsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    paddingBottom: 30,
  },
  productCard: {
    backgroundColor: '#fff',
    borderRadius: 16,
    width: '48%',
    marginBottom: 20,
    padding: 16,
    position: 'relative',
    elevation: 6,
    shadowColor: '#1976D2',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.15,
    shadowRadius: 6,
    borderWidth: 1,
    borderColor: 'rgba(25, 118, 210, 0.08)',
  },
  productBadge: {
    position: 'absolute',
    top: 12,
    left: 12,
    backgroundColor: '#1976D2',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 12,
    zIndex: 1,
  },
  productBadgeText: {
    color: '#fff',
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 0.3,
  },
  specialBadge: {
    position: 'absolute',
    top: 12,
    right: 12,
    backgroundColor: '#FF9800',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 10,
    zIndex: 1,
  },
  specialBadgeText: {
    color: '#fff',
    fontSize: 9,
    fontWeight: '700',
  },
  productImageContainer: {
    alignItems: 'center',
    marginBottom: 14,
    marginTop: 8,
  },
  productImage: {
    width: 90,
    height: 90,
    borderRadius: 10,
  },
  productPlaceholder: {
    width: 90,
    height: 90,
    backgroundColor: '#F5F5F5',
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  productEmoji: {
    fontSize: 44,
  },
  productInfo: {
    alignItems: 'center',
    paddingHorizontal: 4,
  },
  productName: {
    fontSize: 15,
    fontWeight: '700',
    color: '#2C1810',
    textAlign: 'center',
    marginBottom: 6,
    lineHeight: 20,
  },
  productSubtitle: {
    fontSize: 12,
    color: '#666',
    textAlign: 'center',
    marginBottom: 8,
  },
  productPrice: {
    fontSize: 18,
    fontWeight: '800',
    color: '#1976D2',
    marginBottom: 8,
  },
  recipeInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  recipeText: {
    fontSize: 10,
    color: '#8B4513',
    marginLeft: 4,
    fontStyle: 'italic',
  },
  addButton: {
    backgroundColor: '#1976D2',
    paddingHorizontal: 24,
    paddingVertical: 10,
    borderRadius: 20,
    elevation: 4,
    shadowColor: '#1976D2',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.35,
    shadowRadius: 4,
  },
  addButtonText: {
    color: '#fff',
    fontSize: 13,
    fontWeight: '700',
    letterSpacing: 0.5,
    textAlign: 'center',
  },
  emptyContainer: {
    alignItems: 'center',
    paddingVertical: 60,
  },
  emptyEmoji: {
    fontSize: 64,
    marginBottom: 16,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#666',
    marginBottom: 8,
  },
  emptySubtitle: {
    fontSize: 14,
    color: '#999',
    textAlign: 'center',
    lineHeight: 20,
  },
});
