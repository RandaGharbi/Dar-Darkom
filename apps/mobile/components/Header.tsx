import React from 'react';
import { StyleSheet, View, Text, TouchableOpacity, Image } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useAudioPlayer } from '../hooks/useAudioPlayer';

export default function Header() {
  // Hook audio (toujours appelé)
  const audioState = useAudioPlayer();
  const { isPlaying, togglePlayPause, playTrack } = audioState;
  const [hasAutoStarted, setHasAutoStarted] = React.useState(false);
  const insets = useSafeAreaInsets();

  // Démarrer automatiquement la musique au chargement (une seule fois)
  React.useEffect(() => {
    if (!hasAutoStarted) {
      setHasAutoStarted(true);
      const timer = setTimeout(() => {
        console.log('🎵 Démarrage automatique de la musique...');
        playTrack('traditional-1');
      }, 1500); // 1.5 seconde de délai pour s'assurer que tout est chargé
      
      return () => clearTimeout(timer);
    }
  }, [hasAutoStarted, playTrack]); // Retirer isPlaying de la dépendance

  const handleAudioPress = () => {
    console.log('🎵 Bouton audio pressé, état actuel:', isPlaying);
    togglePlayPause();
  };

  // Supprimer les fonctions de modal qui ne sont plus nécessaires

  return (
    <View style={[styles.container, { top: insets.top }]}>
      {/* En-tête principal */}
      <View style={styles.mainHeader}>
        {/* Logo à gauche */}
        <Image 
          source={require('../assets/images/DarLogo.png')} 
          style={styles.logo}
          resizeMode="contain"
        />
        
        {/* Titre centré */}
        <Text style={styles.title}>Dar Darkom</Text>
        
        {/* Icône tonalité audio */}
        <TouchableOpacity 
          style={styles.audioButton} 
          onPress={handleAudioPress}
        >
          <Text style={styles.musicSymbol}>
            {isPlaying ? "♪" : "♩"}
          </Text>
        </TouchableOpacity>
      </View>

      {/* Modal supprimée - plus nécessaire */}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    paddingHorizontal: 16,
    paddingTop: 20,
    paddingBottom: 16,
    position: 'absolute',
    left: 0,
    right: 0,
    zIndex: 1000,
  },
  mainHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    position: 'relative',
  },
  logo: {
    width: 80,
    height: 60,
  },
  title: {
    fontSize: 28,
    fontWeight: '800',
    fontFamily: 'System',
    color: '#D4AF37', // Couleur dorée comme le logo
    textAlign: 'center',
    flex: 1,
    letterSpacing: 2,
    textShadowColor: 'rgba(0, 0, 0, 0.1)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  audioButton: {
    padding: 8,
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  musicSymbol: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    color: '#000',
  },
});
