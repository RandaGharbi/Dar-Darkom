import React, { useCallback } from "react";
import { FlatList, StyleSheet, View } from "react-native";
import Header from "../../components/Header";
import ProductList from "../../components/ProductList";
import { useProductsByType } from "../../hooks/useProducts";
import SafeAreaWrapper from "../../components/SafeAreaWrapper";

export default function App() {
  const onLayoutRootView = useCallback(() => {
    // Plus besoin de gérer le splash ici
  }, []);

  // Utiliser React Query pour récupérer les données par type
  const { data: featuredProducts } = useProductsByType('product');
  const { data: ingredients } = useProductsByType('ingredient');

  const sections = [
    { id: 'header', type: 'header' },
    { id: 'featured', type: 'featured' },
    { id: 'ingredients', type: 'ingredients' }
  ];

  const renderItem = ({ item }: { item: any }) => {
    switch (item.type) {
      case 'header':
        return <Header />;
      case 'featured':
        return (
          <View>
            <ProductList title="Produits en vedette" products={featuredProducts} layout="horizontal" />
          </View>
        );
      case 'ingredients':
        return (
          <View>
            <ProductList title="Ingrédients" products={ingredients} layout="grid" />
          </View>
        );
      default:
        return null;
    }
  };

  return (
    <SafeAreaWrapper 
      backgroundColor="#fff"
      edges={['top']} // Exclure le bottom car la tab bar gère déjà les safe areas
    >
      <FlatList
        style={styles.container}
        data={sections}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        onLayout={onLayoutRootView}
        showsVerticalScrollIndicator={false}
      />
    </SafeAreaWrapper>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#fff",
  },

  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  errorText: {
    fontSize: 16,
    color: '#FF3B30',
    textAlign: 'center',
  },
});
