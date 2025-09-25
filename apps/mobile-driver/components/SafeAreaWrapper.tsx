import React from 'react';
import { View, StyleSheet, Platform } from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';

interface SafeAreaWrapperProps {
  children: React.ReactNode;
  style?: any;
  edges?: ('top' | 'bottom' | 'left' | 'right')[];
  backgroundColor?: string;
}

export default function SafeAreaWrapper({ 
  children, 
  style, 
  edges = ['top', 'bottom', 'left', 'right'],
  backgroundColor = '#fff'
}: SafeAreaWrapperProps) {
  const insets = useSafeAreaInsets();

  if (Platform.OS === 'android') {
    // Pour Android, utiliser un View avec padding manuel pour l'affichage edge-to-edge
    return (
      <View 
        style={[
          styles.container,
          { 
            paddingTop: edges.includes('top') ? insets.top : 0,
            paddingBottom: edges.includes('bottom') ? insets.bottom : 0,
            paddingLeft: edges.includes('left') ? insets.left : 0,
            paddingRight: edges.includes('right') ? insets.right : 0,
            backgroundColor
          },
          style
        ]}
      >
        {children}
      </View>
    );
  }

  // Pour iOS, utiliser SafeAreaView
  return (
    <SafeAreaView 
      style={[styles.container, { backgroundColor }, style]}
      edges={edges}
    >
      {children}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
}); 