import React from 'react';
import { StyleSheet, View, Text, TouchableOpacity, ImageBackground } from 'react-native';
import { useRouter } from 'expo-router';

export default function TodaysSpecial() {
  const router = useRouter();

  const handlePreOrder = () => {
    router.push('/product-detail');
  };

  return (
    <View style={styles.container}>
      <ImageBackground
        source={require('../assets/images/sidiBousaid.jpg')}
        style={styles.backgroundImage}
        resizeMode="cover"
      >
        <View style={styles.overlay}>
          <Text style={styles.title}>Today's Special</Text>
          <Text style={styles.description}>
            Freshly made Couscous with lamb, a taste of tradition.
          </Text>
          
          
          <TouchableOpacity style={styles.orderButton} onPress={handlePreOrder}>
            <Text style={styles.orderButtonText}>Pre-order Now</Text>
          </TouchableOpacity>
        </View>
      </ImageBackground>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginHorizontal: 16,
    marginBottom: 32,
    borderRadius: 16,
    overflow: 'hidden',
  },
  backgroundImage: {
    width: '100%',
    height: 200,
    justifyContent: 'center',
    alignItems: 'center',
  },
  overlay: {
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
    paddingHorizontal: 32,
    paddingVertical: 24,
    alignItems: 'center',
    width: '100%',
    height: '100%',
    justifyContent: 'center',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#fff',
    textAlign: 'center',
    marginBottom: 12,
    textShadowColor: 'rgba(0, 0, 0, 0.8)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 3,
  },
  description: {
    fontSize: 16,
    color: '#fff',
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 24,
    textShadowColor: 'rgba(0, 0, 0, 0.8)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 3,
  },
  orderButton: {
    backgroundColor: '#2E86AB',
    paddingHorizontal: 32,
    paddingVertical: 16,
    borderRadius: 25,
  },
  orderButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});
