import React from 'react';
import { View, Text, ScrollView, StyleSheet } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import EvilIcons from '@expo/vector-icons/EvilIcons';

export default function IconTest() {
  const ionicons = [
    'location-outline', 'location', 'location-sharp',
    'restaurant-outline', 'restaurant', 'restaurant-sharp',
    'home-outline', 'home', 'home-sharp',
    'search-outline', 'search', 'search-sharp',
    'heart-outline', 'heart', 'heart-sharp'
  ];

  const materialIcons = [
    'food-variant', 'cake-variant', 'food',
    'home', 'magnify', 'heart'
  ];

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Test des Icônes</Text>
      
      <Text style={styles.sectionTitle}>Ionicons:</Text>
      <View style={styles.iconGrid}>
        {ionicons.map((name, index) => (
          <View key={index} style={styles.iconItem}>
            <Ionicons name={name} size={24} color="#333" />
            <Text style={styles.iconName}>{name}</Text>
          </View>
        ))}
      </View>

      <Text style={styles.sectionTitle}>MaterialCommunityIcons:</Text>
      <View style={styles.iconGrid}>
        {materialIcons.map((name, index) => (
          <View key={index} style={styles.iconItem}>
            <MaterialCommunityIcons name={name} size={24} color="#333" />
            <Text style={styles.iconName}>{name}</Text>
          </View>
        ))}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginTop: 20,
    marginBottom: 10,
  },
  iconGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-around',
  },
  iconItem: {
    alignItems: 'center',
    margin: 10,
    padding: 10,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    width: 80,
  },
  iconName: {
    fontSize: 10,
    textAlign: 'center',
    marginTop: 5,
  },
});
