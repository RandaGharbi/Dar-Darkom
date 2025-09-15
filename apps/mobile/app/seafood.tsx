import React from 'react';
import { StyleSheet, View, Text, ScrollView } from 'react-native';
import SafeAreaWrapper from '../components/SafeAreaWrapper';

export default function SeafoodScreen() {
  return (
    <SafeAreaWrapper backgroundColor="#fff" edges={['top']}>
      <ScrollView style={styles.container}>
        <View style={styles.content}>
          <Text style={styles.title}>Poissons & Fruits de mer</Text>
          <Text style={styles.subtitle}>Découvrez nos délicieux plats de poisson et fruits de mer</Text>
        </View>
      </ScrollView>
    </SafeAreaWrapper>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  content: {
    padding: 20,
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
  },
});
