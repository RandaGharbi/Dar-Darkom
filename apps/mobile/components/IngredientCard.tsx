import React from 'react';
import { View, Text, Image, StyleSheet } from 'react-native';

type Props = {
  name: string;
  description: string;
  image: string;
};

export const IngredientCard = ({ name, description, image }: Props) => {
  // Fonction pour valider les URLs d'images
  const isValidImageUrl = (url: string): boolean => {
    if (!url || typeof url !== 'string') return false;
    try {
      const urlObj = new URL(url);
      return urlObj.protocol === 'http:' || urlObj.protocol === 'https:';
    } catch {
      return false;
    }
  };

  // Fonction pour obtenir une URL d'image valide
  const getValidImageUrl = (): string => {
    if (isValidImageUrl(image)) {
      return image;
    }
    return 'https://via.placeholder.com/150';
  };

  return (
    <View style={styles.card}>
      <Image source={{ uri: getValidImageUrl() }} style={styles.image} />
      <Text style={styles.name}>{name}</Text>
      <Text style={styles.description}>{description}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    width: '48%',
    borderRadius: 16,
    padding: 12,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 4 },
    elevation: 4,
  },
  image: {
    width: '100%',
    height: 120,
    borderRadius: 12,
    marginBottom: 10,
    resizeMode: 'cover',
  },
  name: {
    fontSize: 15,
    marginBottom: 6,
    color: '#111',
  },
  description: {
    fontSize: 10,
    color: '#8A7861',
  },
});
