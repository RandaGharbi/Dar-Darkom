import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text, ScrollView, TouchableOpacity, Image, TextInput, ActivityIndicator, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import SafeAreaWrapper from '../../components/SafeAreaWrapper';
import { apiService, Product } from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import { useCartStore } from '../../context/CartStore';

export default function MenuScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { isAuthenticated, user } = useAuth();
  const { addToCart } = useCartStore();
  const [products, setProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('Tous');
  const [isScrolled, setIsScrolled] = useState(false);

  const categories = ['Tous', 'Plats chauds', 'Viandes', 'Entrées & Salades', 'Pâtisserie', 'Poissons', 'Végé'];

  useEffect(() => {
    fetchAllProducts();
  }, []);

  useEffect(() => {
    filterProducts();
  }, [products, searchQuery, selectedCategory]);

  const fetchAllProducts = async () => {
    try {
      setLoading(true);
      const response = await apiService.getProducts();
      console.log('API Response:', response);
      
      // L'API retourne maintenant directement les produits
      if (Array.isArray(response)) {
        setProducts(response);
      } else if (response.success && response.data) {
        setProducts(response.data);
      }
    } catch (error) {
      console.error('Erreur lors du chargement des produits:', error);
    } finally {
      setLoading(false);
    }
  };

  const filterProducts = () => {
    let filtered = products;

    // Filtrer par catégorie
    if (selectedCategory !== 'Tous') {
      // Mapping des catégories de l'interface vers la base de données
      const categoryMapping: { [key: string]: string } = {
        'Plats chauds': 'Viandes',  // Les plats chauds incluent "Viandes" et "Poissons"
        'Viandes': 'Viandes',
        'Entrées & Salades': 'Entrées & Salades',
        'Pâtisserie': 'Pâtisserie',
        'Poissons': 'Poissons',
        'Végé': 'Végé'
      };
      
      const dbCategory = categoryMapping[selectedCategory] || selectedCategory;
      console.log('Filtrage par catégorie:', selectedCategory, '->', dbCategory);
      
      // Pour "Plats chauds", inclure à la fois "Viandes" et "Poissons" et les mélanger
      if (selectedCategory === 'Plats chauds') {
        const viandes = filtered.filter(product => 
          product.category === 'Viandes' && product.status === "Active"
        );
        const poissons = filtered.filter(product => 
          product.category === 'Poissons' && product.status === "Active"
        );
        
        // Mélanger les plats de façon alternée : viande, poisson, viande, poisson...
        filtered = [];
        const maxLength = Math.max(viandes.length, poissons.length);
        
        for (let i = 0; i < maxLength; i++) {
          if (i < viandes.length) filtered.push(viandes[i]);
          if (i < poissons.length) filtered.push(poissons[i]);
        }
      } else {
        // Pour les autres catégories, filtrage normal
        filtered = filtered.filter(product => product.category === dbCategory);
      }
    }

    // Filtrer par recherche
    if (searchQuery.trim()) {
      filtered = filtered.filter(product => 
        product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.subtitle.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    setFilteredProducts(filtered);
  };

  const handleProductPress = (product: Product) => {
    router.push(`/product-detail?id=${product.id}`);
  };

  const handleAddToCart = async (product: Product) => {
    if (!isAuthenticated) {
      router.push('/login');
      return;
    }
    
    try {
      await addToCart(user?._id || '', product.id.toString());
      Alert.alert('Succès', `${product.name} ajouté au panier !`);
    } catch (error) {
      console.error('Erreur lors de l\'ajout au panier:', error);
      Alert.alert('Erreur', 'Erreur lors de l\'ajout au panier');
    }
  };

  const handleScroll = (event: any) => {
    const scrollY = event.nativeEvent.contentOffset.y;
    setIsScrolled(scrollY > 10);
  };

  return (
    <SafeAreaWrapper backgroundColor="#fff" edges={['top']}>
      {/* Header sticky */}
      <View style={[
        styles.stickyHeader, 
        { top: insets.top },
        isScrolled && styles.stickyHeaderScrolled
      ]}>
        <Text style={styles.title}>Notre Menu</Text>
        <Text style={styles.subtitle}>Découvrez tous nos plats</Text>
      </View>
      
      <ScrollView 
        style={styles.container} 
        contentContainerStyle={styles.scrollContent}
        onScroll={handleScroll}
        scrollEventThrottle={16}
      >

        {/* Search Bar */}
        <View style={styles.searchContainer}>
          <View style={styles.searchBar}>
            <Ionicons name="search" size={20} color="#666" style={styles.searchIcon} />
            <TextInput
              style={styles.searchInput}
              placeholder="Rechercher un plat..."
              value={searchQuery}
              onChangeText={setSearchQuery}
              placeholderTextColor="#666"
            />
            {searchQuery.length > 0 && (
              <TouchableOpacity onPress={() => setSearchQuery('')}>
                <Ionicons name="close-circle" size={20} color="#666" />
              </TouchableOpacity>
            )}
          </View>
        </View>

        {/* Category Filters */}
        <ScrollView 
          horizontal 
          showsHorizontalScrollIndicator={false}
          style={styles.categoryFilters}
          contentContainerStyle={styles.categoryFiltersContent}
        >
          {categories.map((category) => (
            <TouchableOpacity
              key={category}
              style={[
                styles.categoryFilter,
                selectedCategory === category && styles.categoryFilterActive
              ]}
              onPress={() => setSelectedCategory(category)}
            >
              <Text style={[
                styles.categoryFilterText,
                selectedCategory === category && styles.categoryFilterTextActive
              ]}>
                {category}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* Products List */}
        <View style={styles.productsContainer}>
          {loading ? (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="large" color="#2E86AB" />
              <Text style={styles.loadingText}>Chargement du menu...</Text>
            </View>
          ) : filteredProducts.length > 0 ? (
            filteredProducts.map((product) => (
              <TouchableOpacity
                key={product.id}
                style={styles.productCard}
                onPress={() => handleProductPress(product)}
              >
                <Image
                  source={{ uri: product.image }}
                  style={styles.productImage}
                  resizeMode="cover"
                />
                <View style={styles.productInfo}>
                  <View style={styles.productHeader}>
                    <Text style={styles.productName}>{product.name}</Text>
                    {product.dailySpecial && (
                      <View style={styles.specialBadge}>
                        <Text style={styles.specialBadgeText}>Spécial</Text>
                      </View>
                    )}
                  </View>
                  <Text style={styles.productDescription}>{product.subtitle}</Text>
                  <View style={styles.productFooter}>
                    <Text style={styles.productPrice}>{product.price.toFixed(2)} DT</Text>
                    <Text style={styles.productCategory}>{product.category}</Text>
                  </View>
                </View>
                <View style={styles.productActions}>
                  <TouchableOpacity 
                    style={styles.addToCartButton}
                    onPress={() => handleAddToCart(product)}
                  >
                    <Ionicons name="add" size={20} color="#fff" />
                  </TouchableOpacity>
                  <TouchableOpacity onPress={() => handleProductPress(product)}>
                    <Ionicons name="chevron-forward" size={20} color="#ccc" />
                  </TouchableOpacity>
                </View>
              </TouchableOpacity>
            ))
          ) : (
            <View style={styles.emptyContainer}>
              <Ionicons name="restaurant-outline" size={64} color="#ccc" />
              <Text style={styles.emptyTitle}>Aucun plat trouvé</Text>
              <Text style={styles.emptyText}>
                {searchQuery ? 'Essayez avec d\'autres mots-clés' : 'Aucun plat dans cette catégorie'}
              </Text>
            </View>
          )}
        </View>
      </ScrollView>
    </SafeAreaWrapper>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  scrollContent: {
    paddingTop: 120, // Espace pour le header sticky + safe area
    paddingBottom: 20,
  },
  stickyHeader: {
    paddingHorizontal: 20,
    paddingVertical: 24,
    alignItems: 'center',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 1000,
  },
  stickyHeaderScrolled: {
    backgroundColor: '#fff',
  },
  header: {
    paddingHorizontal: 20,
    paddingVertical: 24,
    alignItems: 'center',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
  },
  searchContainer: {
    paddingHorizontal: 20,
    marginBottom: 16,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  searchIcon: {
    marginRight: 12,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: '#333',
  },
  categoryFilters: {
    marginBottom: 20,
  },
  categoryFiltersContent: {
    paddingHorizontal: 20,
  },
  categoryFilter: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#f5f5f5',
    marginRight: 12,
  },
  categoryFilterActive: {
    backgroundColor: '#2E86AB',
  },
  categoryFilterText: {
    fontSize: 14,
    color: '#666',
    fontWeight: '500',
  },
  categoryFilterTextActive: {
    color: '#fff',
    fontWeight: '600',
  },
  productsContainer: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  productCard: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    alignItems: 'center',
  },
  productImage: {
    width: 80,
    height: 80,
    borderRadius: 8,
    marginRight: 16,
  },
  productInfo: {
    flex: 1,
  },
  productHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  productName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    flex: 1,
  },
  specialBadge: {
    backgroundColor: '#2E86AB',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 12,
    marginLeft: 8,
  },
  specialBadgeText: {
    color: '#fff',
    fontSize: 10,
    fontWeight: 'bold',
  },
  productDescription: {
    fontSize: 14,
    color: '#666',
    marginBottom: 8,
    lineHeight: 20,
  },
  productFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  productPrice: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#2E86AB',
  },
  productCategory: {
    fontSize: 12,
    color: '#999',
    backgroundColor: '#f0f0f0',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  productActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  addToCartButton: {
    backgroundColor: '#2E86AB',
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 40,
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: '#666',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 60,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginTop: 16,
    marginBottom: 8,
  },
  emptyText: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
  },
});
