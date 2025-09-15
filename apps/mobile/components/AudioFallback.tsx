import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface AudioFallbackProps {
  onPress?: () => void;
}

export const AudioFallback: React.FC<AudioFallbackProps> = ({ onPress }) => {
  return (
    <TouchableOpacity style={styles.container} onPress={onPress}>
      <Text style={styles.musicSymbol}>♪</Text>
      <Text style={styles.text}>Audio</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    fontSize: 12,
    color: '#666',
    marginTop: 2,
  },
  musicSymbol: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#666',
  },
});
