import { ImageBackground, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export const Banner = () => {
  return (
    <ImageBackground
      source={{ uri: 'https://via.placeholder.com/800x400?text=Promo+Image' }}
      style={styles.banner}
      imageStyle={{ borderRadius: 12 }}
    >
      <View style={styles.overlay}>
        <Text style={styles.title}>Découvre nos nouveautés</Text>
        <TouchableOpacity style={styles.button}>
          <Text style={styles.buttonText}>Voir plus</Text>
        </TouchableOpacity>
      </View>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  banner: {
    height: 200,
    borderRadius: 12,
    overflow: 'hidden',
    marginBottom: 20,
  },
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  title: {
    color: '#fff',
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 12,
    textAlign: 'center',
  },
  button: {
    backgroundColor: '#fff',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 25,
  },
  buttonText: {
    color: '#000',
    fontWeight: '600',
  },
});
