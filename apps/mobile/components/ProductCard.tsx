import React from 'react';
import { StyleSheet, View, Text, TouchableOpacity, Image } from 'react-native';

interface ProductCardProps {
  name: string;
  price: string;
  tag: string;
  image?: string;
  onAddToCart: () => void;
}

export default function ProductCard({ name, price, tag, image, onAddToCart }: ProductCardProps) {
  return (
    <View style={styles.container}>
      {/* Image du produit */}
      <View style={styles.imageContainer}>
        <View style={styles.productImage}>
          <Text style={styles.imagePlaceholder}>🍽️</Text>
        </View>
        <View style={styles.tagContainer}>
          <Text style={styles.tagText}>{tag}</Text>
        </View>
      </View>
      
      {/* Informations du produit */}
      <View style={styles.productInfo}>
        <Text style={styles.productName} numberOfLines={2}>
          {name}
        </Text>
        <Text style={styles.productPrice}>{price}</Text>
      </View>
      
      {/* Bouton d'ajout au panier - toujours en bas */}
      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.addButton} onPress={onAddToCart}>
          <Text style={styles.addButtonText}>+ Ajouter</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 12,
    marginRight: 12,
    width: 140,
    height: 200, // Hauteur fixe pour toutes les cartes
    justifyContent: 'space-between', // Distribue l'espace entre les éléments
  },
  imageContainer: {
    position: 'relative',
    marginBottom: 8,
  },
  productImage: {
    width: '100%',
    height: 80,
    backgroundColor: '#f5f5f5',
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  imagePlaceholder: {
    fontSize: 28,
  },
  tagContainer: {
    position: 'absolute',
    top: 6,
    left: 6,
    backgroundColor: '#8B4513',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 8,
  },
  tagText: {
    color: '#fff',
    fontSize: 10,
    fontWeight: '600',
  },
  productInfo: {
    marginBottom: 8,
  },
  productName: {
    fontSize: 13,
    fontWeight: '600',
    color: '#333',
    marginBottom: 4,
    lineHeight: 16,
  },
  productPrice: {
    fontSize: 15,
    fontWeight: 'bold',
    color: '#8B4513',
  },
  buttonContainer: {
    // Plus de positionnement absolu, le bouton sera naturellement en bas
  },
  addButton: {
    backgroundColor: '#8B4513',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 20,
    alignItems: 'center',
  },
  addButtonText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '600',
  },
});
