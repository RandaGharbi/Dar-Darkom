import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { OrientalColors } from '../../constants/Colors';

export default function TrackingScreen() {
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>Suivi des livraisons</Text>
        <Text style={styles.subtitle}>Fonctionnalité en cours de développement</Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: OrientalColors.background,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: OrientalColors.textPrimary,
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    color: OrientalColors.textSecondary,
    textAlign: 'center',
  },
});
