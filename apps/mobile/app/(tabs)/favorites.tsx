import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, Image, TouchableOpacity } from 'react-native';
import FavoriteButton from '../../components/FavoriteButton';
import { useFavoritesStore } from '../../context/FavoritesStore';
import { useAuth } from '../../context/AuthContext';
import { useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import goBackIcon from '../../assets/images/back.png';
import { getCorrectImageUrl } from '../../utils/imageUtils';

export default function FavoritesScreen() {
  const { favorites, hydrate } = useFavoritesStore();
  const { isAuthenticated } = useAuth();
  const [token, setToken] = useState<string | undefined>();
  const router = useRouter();

  // Récupérer le token depuis AsyncStorage
  useEffect(() => {
    const getToken = async () => {
      const authToken = await AsyncStorage.getItem('authToken');
      setToken(authToken || undefined);
    };
    getToken();
  }, []);

  // Hydrate les favoris au chargement de l'écran
  useEffect(() => {
    if (token !== undefined) {
      hydrate(isAuthenticated, token);
    }
  }, [hydrate, isAuthenticated, token]);

  // Fonction utilitaire pour garantir le mapping correct
  const mapFavorite = (item: any) => ({
    id: item.productId || item.id,
    title: item.title || item.name || 'Sans titre',
    subtitle: item.subtitle || '',
    image_url: item.image_url || item.image || '',
    price: typeof item.price === 'number' ? item.price : 0,
    category: item.category || item.productCollection || 'product',
    productType: item.productType || 'product',
    _id: item._id,
  });

  const mappedFavorites = favorites.map(mapFavorite);

  return (
    <View style={styles.container}>
      <View style={styles.headerRow}>
        <TouchableOpacity onPress={() => router.replace('/shop')} style={styles.backBtn}>
          <Image source={goBackIcon} style={styles.goBackIcon} />
        </TouchableOpacity>
        <View style={styles.titleContainer}>
      <Text style={styles.title}>Wishlist</Text>
        </View>
        <View style={{ width: 32 }} /> {/* Pour équilibrer le header */}
      </View>
      <FlatList
        data={mappedFavorites.filter(item => item.title && item.image_url && item.price > 0)}
        keyExtractor={(item: any) => item._id || item.id?.toString()}
        contentContainerStyle={{ paddingHorizontal: 16, paddingTop: 24 }}
        renderItem={({ item }: { item: any }) => (
          <View style={styles.itemRow}>
            <Image source={{ uri: getCorrectImageUrl(item.image_url) || item.image_url }} style={styles.image} />
            <View style={styles.textBlock}>
              <Text style={styles.itemTitle}>{item.title}</Text>
              <Text style={styles.itemPrice}>${item.price?.toFixed(2) ?? '0.00'}</Text>
            </View>
            <FavoriteButton product={{
              id: item.productId || item.id || item._id,
              title: item.title,
              subtitle: item.subtitle,
              image_url: item.image_url,
              price: item.price,
              category: item.category,
              productType: item.productType,
              name: item.title, // fallback pour compatibilité
              brand: '',
              ingredients: '',
              benefits: '',
              howToUse: '',
            }} size={24} />
          </View>
        )}
        ItemSeparatorComponent={() => <View style={{ height: 16 }} />}
        ListEmptyComponent={
          <View style={{ alignItems: 'center', marginTop: 60 }}>
            <Text style={{ color: '#888', fontSize: 16 }}>
              Aucun favori pour le moment
            </Text>
            {/* Debug : afficher les données brutes si vide */}
            <Text style={{ color: '#aaa', fontSize: 12, marginTop: 20 }}>Debug : {JSON.stringify(favorites)}</Text>
          </View>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 70,
    marginBottom: 12,
    paddingHorizontal: 16,
  },
  backBtn: {
    width: 32,
    height: 32,
    justifyContent: 'center',
    alignItems: 'center',
  },
  goBackIcon: {
    width: 22,
    height: 22,
    tintColor: '#000',
    resizeMode: 'contain',
  },
  titleContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  itemRow: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 12,
    paddingVertical: 6,
    paddingHorizontal: 0,
    marginTop: 0,
  },
  image: {
    width: 54,
    height: 54,
    borderRadius: 12,
    marginRight: 14,
    backgroundColor: '#F6F6F6',
  },
  textBlock: {
    flex: 1,
    justifyContent: 'center',
  },
  itemTitle: {
    fontSize: 16,
    fontWeight: '400',
    color: '#222',
    textTransform: 'capitalize',
  },
  itemPrice: {
    fontSize: 13,
    color: '#827869',
    marginTop: 4,
  },
});