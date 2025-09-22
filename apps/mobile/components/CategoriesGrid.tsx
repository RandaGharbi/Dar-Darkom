import React, { useEffect, useState } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, Image } from 'react-native';
import { useRouter } from 'expo-router';
import { useProducts } from '../hooks/useProducts';

interface CategoryItem {
  id: string;
  name: string;
  imageUrl: string;
  backgroundColor: string;
  route: string;
}

export default function CategoriesGrid() {
  const router = useRouter();
  const { data: products, isLoading } = useProducts();
  const [categories, setCategories] = useState<CategoryItem[]>([]);

  // Mapping des catégories vers les noms dans la base de données
  const categoryMapping = {
    'Plats Chauds': 'Plats chauds',
    'Viandes': 'Viandes', 
    'Entrées & Salades': 'Entrées & Salades',
    'Pâtisserie': 'Pâtisserie',
    'Poissons': 'Poissons',
    'Végé': 'Végé'
  };

  // Récupérer les images depuis la base de données
  useEffect(() => {
    if (products && products.length > 0) {
      const categoryData: CategoryItem[] = [
        {
          id: '1',
          name: 'Plats Chauds',
          imageUrl: getCategoryImage(products, 'Plats chauds'),
          backgroundColor: '#2C5F41',
          route: '/hot-dishes'
        },
        {
          id: '2',
          name: 'Viandes',
          imageUrl: getCategoryImage(products, 'Viandes'),
          backgroundColor: '#8B0000',
          route: '/meat'
        },
        {
          id: '3',
          name: 'Entrées & Salades',
          imageUrl: getCategoryImage(products, 'Entrées & Salades'),
          backgroundColor: '#4A4A4A',
          route: '/salads'
        },
        {
          id: '4',
          name: 'Pâtisserie',
          imageUrl: getCategoryImage(products, 'Pâtisserie'),
          backgroundColor: '#8B4513',
          route: '/pastries'
        },
        {
          id: '5',
          name: 'Poissons',
          imageUrl: getCategoryImage(products, 'Poissons'),
          backgroundColor: '#2E8B57',
          route: '/fish'
        },
        {
          id: '6',
          name: 'Végé',
          imageUrl: getCategoryImage(products, 'Végé'),
          backgroundColor: '#228B22',
          route: '/vegetarian'
        }
      ];
      setCategories(categoryData);
    }
  }, [products]);

  // Fonction pour récupérer l'image d'une catégorie
  const getCategoryImage = (products: any[], categoryName: string): string => {
    const categoryProducts = products.filter(product => product.category === categoryName);
    if (categoryProducts.length > 0) {
      // Prendre la première image disponible de la catégorie
      const product = categoryProducts[0];
      return product.Image || product.image || 'https://www.bennasafi.com/media/medium/1578061341_couscous.bel.alouch.png';
    }
    // Image par défaut si aucune trouvée
    return 'https://www.bennasafi.com/media/medium/1578061341_couscous.bel.alouch.png';
  };

  const handleCategoryPress = (route: string) => {
    // Navigation vers la page de détails de catégorie avec le nom de la catégorie
    const category = categories.find(cat => cat.route === route);
    if (category) {
      // Mapper les noms d'affichage vers les noms de la base de données
      const categoryMapping: { [key: string]: string } = {
        'Plats Chauds': 'Plats chauds',
        'Viandes': 'Viandes',
        'Entrées & Salades': 'Entrées & Salades',
        'Pâtisserie': 'Pâtisserie',
        'Poissons': 'Poissons',
        'Végé': 'Végé'
      };
      
      const dbCategoryName = categoryMapping[category.name] || category.name;
      console.log('Navigation vers catégorie:', dbCategoryName);
      router.push(`/category-details?category=${encodeURIComponent(dbCategoryName)}`);
    }
  };

  if (isLoading) {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>Categories</Text>
        <Text style={styles.loadingText}>Chargement des catégories...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Categories</Text>
      <View style={styles.grid}>
        {categories.map((category) => (
          <TouchableOpacity
            key={category.id}
            style={[styles.categoryCard, { backgroundColor: category.backgroundColor }]}
            onPress={() => handleCategoryPress(category.route)}
          >
            <Image 
              source={{ uri: category.imageUrl }} 
              style={styles.categoryImage}
              resizeMode="cover"
            />
            <View style={styles.categoryOverlay}>
              <Text style={styles.categoryName}>{category.name}</Text>
            </View>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 16,
    marginBottom: 32,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 16,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  categoryCard: {
    width: '48%',
    aspectRatio: 1.2,
    borderRadius: 16,
    marginBottom: 16,
    overflow: 'hidden',
    position: 'relative',
  },
  categoryImage: {
    width: '100%',
    height: '100%',
  },
  categoryOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    paddingVertical: 12,
    paddingHorizontal: 8,
  },
  categoryName: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
    textAlign: 'center',
  },
  loadingText: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginTop: 20,
  },
});
