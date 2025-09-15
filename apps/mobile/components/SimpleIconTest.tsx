import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';

export default function SimpleIconTest() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Test des Icônes de Base</Text>
      
      <View style={styles.iconRow}>
        <Ionicons name="home" size={24} color="blue" />
        <Text style={styles.iconText}>home</Text>
      </View>
      
      <View style={styles.iconRow}>
        <Ionicons name="search" size={24} color="green" />
        <Text style={styles.iconText}>search</Text>
      </View>
      
      <View style={styles.iconRow}>
        <Ionicons name="heart" size={24} color="red" />
        <Text style={styles.iconText}>heart</Text>
      </View>
      
      <View style={styles.iconRow}>
        <Ionicons name="navigate" size={24} color="orange" />
        <Text style={styles.iconText}>navigate</Text>
      </View>
      
      <View style={styles.iconRow}>
        <Ionicons name="fast-food" size={24} color="brown" />
        <Text style={styles.iconText}>fast-food</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  iconRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 10,
    padding: 10,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
  },
  iconText: {
    marginLeft: 15,
    fontSize: 16,
  },
});
