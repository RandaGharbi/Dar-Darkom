import React from 'react';
import { TouchableOpacity, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useFavoritesStore } from '../context/FavoritesStore';
import { useAuth } from '../context/AuthContext';
import { Product } from '../constants/types';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface FavoriteButtonProps {
  product?: Product;
  size?: number;
  color?: string;
}

const FavoriteButton: React.FC<FavoriteButtonProps> = ({ product, size = 24, color = 'red' }) => {
  const { isAuthenticated } = useAuth();
  const { isFavorite, addFavorite, removeFavorite } = useFavoritesStore();

  if (!product) return null;

  const handleToggle = async () => {
    let token: string | undefined = undefined;
    if (isAuthenticated) {
      token = (await AsyncStorage.getItem('authToken')) || undefined;
    }
    if (isFavorite(product.id)) {
      // Si déjà favori, on propose la suppression
      try {
        await removeFavorite(product.id, isAuthenticated, token);
      } catch (error) {
        console.error('Erreur lors de la suppression du favori:', error);
        Alert.alert('Erreur', "Impossible de retirer des favoris. Veuillez réessayer.");
      }
      return;
    }
    // Ajout favori
    try {
      await addFavorite(product, isAuthenticated, token);
    } catch (error) {
      console.error('Erreur lors de l\'ajout du favori:', error);
      Alert.alert('Erreur', "Impossible d'ajouter aux favoris. Veuillez réessayer.");
    }
  };

  return (
    <TouchableOpacity onPress={handleToggle}>
      <Ionicons
        name={isFavorite(product.id) ? 'heart' : 'heart-outline'}
        size={size}
        color={isFavorite(product.id) ? 'black' : '#bbb'}
      />
    </TouchableOpacity>
  );
};

export default FavoriteButton;
