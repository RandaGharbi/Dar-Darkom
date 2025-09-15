import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text, ScrollView, TouchableOpacity, Image, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import SafeAreaWrapper from '../components/SafeAreaWrapper';
import { useSafeNavigation } from '../hooks/useSafeNavigation';
import { getFullUrl } from '../config/api';

interface Dish {
  id: number;
  name: string;
  subtitle: string;
  image: string;
  price: number;
  category: string;
  status: string;
}

export default function CategoryDetailsScreen() {
  const { category } = useLocalSearchParams<{ category: string }>();
  const router = useRouter();
  const { safeBack } = useSafeNavigation();
  const [dishes, setDishes] = useState<Dish[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (category) {
      fetchCategoryDishes();
    }
  }, [category]);

  const fetchCategoryDishes = async () => {
    try {
      setLoading(true);
      console.log('Catégorie demandée:', category);
      // Utiliser directement l'URL qui fonctionne
      const url = `http://192.168.1.74:5000/api/products/category/${encodeURIComponent(category)}`;
      console.log('URL de la requête:', url);
      
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      console.log('Données reçues:', data);
      // Filtrer seulement les plats actifs
      const activeDishes = data.filter((dish: Dish) => dish.status === "Active");
      setDishes(activeDishes);
    } catch (error) {
      console.error('Erreur lors du chargement des plats:', error);
      setDishes([]);
    } finally {
      setLoading(false);
    }
  };

  const handleBack = () => {
    safeBack();
  };

  const handleDishPress = (dishId: string) => {
    console.log('Voir les détails du plat:', dishId);
  };

  const getCategoryTitle = () => {
    switch (category) {
      case 'Plats Chauds':
        return 'Plats Chauds';
      case 'Viandes':
        return 'Viandes';
      case 'Entrées & Salades':
        return 'Entrées & Salades';
      case 'Pâtisserie':
        return 'Pâtisserie';
      case 'Poissons':
        return 'Poissons';
      case 'Végé':
        return 'Végé';
      default:
        return category || 'Catégorie';
    }
  };

  return (
    <SafeAreaWrapper backgroundColor="#fff" edges={['top']}>
      <ScrollView 
        style={styles.container}
        bounces={false}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity style={styles.backButton} onPress={handleBack}>
            <Ionicons name="arrow-back" size={24} color="#333" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>{getCategoryTitle()}</Text>
          <View style={styles.placeholder} />
        </View>

        {/* Dishes List */}
        <View style={styles.dishesList}>
          {loading ? (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="large" color="#FF6B35" />
              <Text style={styles.loadingText}>Chargement des plats...</Text>
            </View>
          ) : dishes.length > 0 ? (
            dishes.map((dish) => (
              <TouchableOpacity
                key={dish.id}
                style={styles.dishCard}
                onPress={() => handleDishPress(dish.id.toString())}
              >
                <Image
                  source={{ uri: dish.image }}
                  style={styles.dishImage}
                  resizeMode="cover"
                />
                <View style={styles.dishInfo}>
                  <Text style={styles.dishName}>{dish.name}</Text>
                  <Text style={styles.dishDescription}>{dish.subtitle}</Text>
                  <Text style={styles.dishPrice}>{dish.price.toFixed(2)} €</Text>
                </View>
              </TouchableOpacity>
            ))
          ) : (
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyText}>Aucun plat disponible dans cette catégorie</Text>
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
    flexGrow: 1,
    backgroundColor: '#fff',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: '#fff',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  backButton: {
    padding: 8,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
  },
  placeholder: {
    width: 40,
  },
  dishesList: {
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  dishCard: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.05,
    shadowRadius: 1,
    elevation: 1,
  },
  dishImage: {
    width: 80,
    height: 80,
    borderRadius: 8,
    marginRight: 16,
  },
  dishInfo: {
    flex: 1,
    justifyContent: 'center',
  },
  dishName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
  },
  dishDescription: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
    marginBottom: 8,
  },
  dishPrice: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FF6B35',
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
    paddingVertical: 40,
  },
  emptyText: {
    fontSize: 16,
    color: '#666',
  },
});
