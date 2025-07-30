import React from "react";
import { View, Text, StyleSheet, FlatList, RefreshControl, Dimensions } from "react-native";
import { Product } from "../constants/types";
import ProductCard from "./ProductCard";
import { useProducts } from '../hooks/useProducts';

const CARD_MARGIN = 8;
const CARD_WIDTH = (Dimensions.get('window').width - CARD_MARGIN * 3) / 2;

type ProductListProps = {
  title: string;
  products?: Product[];
  layout?: 'grid' | 'horizontal';
};

const ProductList = ({ title, products: propProducts, layout = 'grid' } : ProductListProps) => {
  const { data: products, isLoading, error, refetch } = useProducts();

  // Utilise les produits des props si fournis, sinon utilise ceux du hook
  const displayProducts = propProducts || products || [];

  if (isLoading) return <Text style={styles.loadingText}>Chargement...</Text>;
  if (error) return <Text style={styles.errorText}>Erreur : {error.message}</Text>;

  if (!displayProducts.length) return null;

  return (
    <View style={styles.container}>
      <Text style={styles.header}>{title}</Text>
      <FlatList
        data={displayProducts}
        keyExtractor={(item, index) => `${item.id}-${index}`}
        renderItem={({ item }) => <ProductCard product={item} cardWidth={layout === 'grid' ? CARD_WIDTH : undefined} />}
        numColumns={layout === 'grid' ? 2 : 1}
        horizontal={layout === 'horizontal'}
        showsHorizontalScrollIndicator={layout === 'horizontal'}
        showsVerticalScrollIndicator={layout === 'grid'}
        columnWrapperStyle={layout === 'grid' ? styles.row : undefined}
        contentContainerStyle={styles.listContent}
        refreshControl={
          <RefreshControl
            refreshing={isLoading}
            onRefresh={refetch}
            colors={['#007AFF']}
            tintColor="#007AFF"
          />
        }
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: 12,
  },
  header: {
    fontWeight: "bold",
    fontSize: 20,
    marginBottom: 12,
    marginLeft: 8,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: CARD_MARGIN,
  },
  listContent: {
    paddingHorizontal: CARD_MARGIN,
    paddingBottom: 16,
  },
  loadingText: {
    textAlign: 'center',
    padding: 20,
    fontSize: 16,
    color: '#666',
  },
  errorText: {
    textAlign: 'center',
    padding: 20,
    fontSize: 16,
    color: '#FF3B30',
  },
});

export default ProductList;
