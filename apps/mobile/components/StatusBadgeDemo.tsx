import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { StatusBadge } from './StatusBadge';

export const StatusBadgeDemo: React.FC = () => {
  const statuses = [
    'active',
    'pending', 
    'shipped',
    'delivered',
    'completed',
    'cancelled'
  ];

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Démonstration des badges de statut</Text>
      
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Taille Small</Text>
        <View style={styles.badgeRow}>
          {statuses.map(status => (
            <StatusBadge key={status} status={status} size="small" />
          ))}
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Taille Medium (défaut)</Text>
        <View style={styles.badgeRow}>
          {statuses.map(status => (
            <StatusBadge key={status} status={status} size="medium" />
          ))}
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Taille Large</Text>
        <View style={styles.badgeRow}>
          {statuses.map(status => (
            <StatusBadge key={status} status={status} size="large" />
          ))}
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f5f5f5',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 30,
    color: '#333',
  },
  section: {
    marginBottom: 30,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 15,
    color: '#555',
  },
  badgeRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
});
