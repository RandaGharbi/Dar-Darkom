import React from 'react';
import { StyleSheet, View, Text, TouchableOpacity, Image } from 'react-native';
import { useRouter } from 'expo-router';

interface CategoryItem {
  id: string;
  name: string;
  imageUrl: string;
  backgroundColor: string;
  route: string;
}

export default function CategoriesGrid() {
  const router = useRouter();

  // Images représentatives de chaque catégorie depuis la base de données
  const categories: CategoryItem[] = [
    {
      id: '1',
      name: 'Plats Chauds',
      imageUrl: 'https://www.bennasafi.com/media/medium/1578061341_couscous.bel.alouch.png',
      backgroundColor: '#2C5F41',
      route: '/hot-dishes'
    },
    {
      id: '2',
      name: 'Viandes',
      imageUrl: 'https://www.bennasafi.com/media/medium/1578061341_couscous.bel.alouch.png',
      backgroundColor: '#8B0000',
      route: '/meat'
    },
    {
      id: '3',
      name: 'Entrées & Salades',
      imageUrl: 'https://fac.img.pmdstatic.net/fit/~1~fac~2022~02~26~2e3f76f3-0921-4668-a1c1-e67b9cfb3030.jpeg/750x562/quality/80/crop-from/center/cr/wqkgSVNUT0NLIC8gRmVtbWUgQWN0dWVsbGU%3D/focus-point/749%2C1284/ojja-tunisienne.jpeg',
      backgroundColor: '#4A4A4A',
      route: '/salads'
    },
    {
      id: '4',
      name: 'Pâtisserie',
      imageUrl: 'https://cuisine.nessma.tv/uploads/11/2019-11/189127a525113fd0dc613fb76b8509af.png',
      backgroundColor: '#8B4513',
      route: '/pastries'
    },
    {
      id: '5',
      name: 'Poissons',
      imageUrl: 'https://cuisine.nessma.tv/uploads/7/2022-01/daurade-grillee-citron.jpg',
      backgroundColor: '#2E8B57',
      route: '/fish'
    },
    {
      id: '6',
      name: 'Végé',
      imageUrl: 'https://fac.img.pmdstatic.net/fit/~1~fac~2022~02~26~2e3f76f3-0921-4668-a1c1-e67b9cfb3030.jpeg/750x562/quality/80/crop-from/center/cr/wqkgSVNUT0NLIC8gRmVtbWUgQWN0dWVsbGU%3D/focus-point/749%2C1284/ojja-tunisienne.jpeg',
      backgroundColor: '#228B22',
      route: '/vegetarian'
    }
  ];

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
      router.push(`/category-details?category=${dbCategoryName}`);
    }
  };

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
});
