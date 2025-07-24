import React, { useEffect } from 'react';
import { View, Image, StyleSheet, Dimensions } from 'react-native';

const { width, height } = Dimensions.get('window');

export default function AnimatedSplashScreen({ onFinish }: { onFinish: () => void }) {
  useEffect(() => {
    // Afficher le logo pendant 3 secondes puis finir
    const timer = setTimeout(() => {
      onFinish();
    }, 3000);

    return () => clearTimeout(timer);
  }, [onFinish]);

  return (
    <View style={styles.container}>
      <Image
        source={require('../assets/images/logoGuerlain.png')}
        style={styles.fallbackImage}
        resizeMode="contain"
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    width,
    height,
    backgroundColor: '#ffffff',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 9999,
  },
  image: {
    width: width * 0.8,
    height: height * 0.8,
  },
  fallbackImage: {
    width: 200,
    height: 200,
  },
}); 