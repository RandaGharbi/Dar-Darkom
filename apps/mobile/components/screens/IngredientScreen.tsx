import React from 'react';
import { View, Text, FlatList, StyleSheet } from 'react-native';
import { rawIngredient } from '../../constants/data'; 
import { IngredientCard } from '../IngredientCard';

 const IngredientsScreen = () => {
  return (
    <FlatList
      data={rawIngredient}
      keyExtractor={(item) => item.category}
      renderItem={({ item }) => (
        <View style={styles.section}>
          <Text style={styles.category}>{item.category}</Text>
          <View style={styles.grid}>
            {item.ingredients.map((ingredient) => (
              <IngredientCard
                key={ingredient.id}
                name={ingredient.name}
                description={ingredient.description}
                image={ingredient.image}
              />
            ))}
          </View>
        </View>
      )}
    />
  );
};

const styles = StyleSheet.create({
  section: {
    marginBottom: 24,
    paddingHorizontal: 16,
  },
  category: {
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 12,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
});

export default IngredientsScreen;