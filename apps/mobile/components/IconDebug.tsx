import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';

export default function IconDebug() {
  const testIcons = [
    { name: 'home', color: 'blue' },
    { name: 'search', color: 'green' },
    { name: 'heart', color: 'red' },
    { name: 'navigate', color: 'orange' },
    { name: 'fast-food', color: 'brown' },
    { name: 'cafe', color: 'purple' },
    { name: 'location', color: 'teal' },
    { name: 'restaurant', color: 'maroon' }
  ];

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Test des Icônes Ionicons</Text>
      <Text style={styles.subtitle}>Version: @expo/vector-icons@14.1.0</Text>
      
      {testIcons.map((icon, index) => (
        <View key={index} style={styles.iconRow}>
          <Ionicons name={icon.name} size={32} color={icon.color} />
          <Text style={styles.iconName}>{icon.name}</Text>
          <Text style={styles.iconColor}>Couleur: {icon.color}</Text>
        </View>
      ))}
      
      <View style={styles.status}>
        <Text style={styles.statusText}>
          Si vous voyez des icônes colorées au lieu de "?", 
          alors le problème est résolu ! 🎉
        </Text>
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
    marginBottom: 10,
    textAlign: 'center',
    color: '#333',
  },
  subtitle: {
    fontSize: 16,
    marginBottom: 30,
    textAlign: 'center',
    color: '#666',
    fontStyle: 'italic',
  },
  iconRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 15,
    padding: 15,
    borderWidth: 2,
    borderColor: '#ddd',
    borderRadius: 12,
    backgroundColor: '#f9f9f9',
  },
  iconName: {
    marginLeft: 20,
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    flex: 1,
  },
  iconColor: {
    fontSize: 14,
    color: '#666',
    fontStyle: 'italic',
  },
  status: {
    marginTop: 30,
    padding: 20,
    backgroundColor: '#e8f5e8',
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#4caf50',
  },
  statusText: {
    fontSize: 16,
    textAlign: 'center',
    color: '#2e7d32',
    lineHeight: 24,
  },
});
