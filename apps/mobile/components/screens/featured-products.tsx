import React from 'react';
import { SafeAreaView, StyleSheet } from 'react-native';
import { products } from '../../constants/data';
import ProductList from '../ProductList';

const FeaturedProductsScreen = () => {
  return (
    <SafeAreaView style={styles.container}>
      <ProductList title="Featured Products" products={products} />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
});

export default FeaturedProductsScreen;
