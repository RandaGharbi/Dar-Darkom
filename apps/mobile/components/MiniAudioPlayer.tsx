import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Animated,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAudioPlayer } from '../hooks/useAudioPlayer';

interface MiniAudioPlayerProps {
  onPress?: () => void;
}

export const MiniAudioPlayer: React.FC<MiniAudioPlayerProps> = ({ onPress }) => {
  const { isPlaying, currentTrack, togglePlayPause, stop } = useAudioPlayer();

  // Animation pour les points de lecture
  const dotAnimation = React.useRef(new Animated.Value(0)).current;

  React.useEffect(() => {
    if (isPlaying) {
      const animate = () => {
        Animated.sequence([
          Animated.timing(dotAnimation, {
            toValue: 1,
            duration: 500,
            useNativeDriver: true,
          }),
          Animated.timing(dotAnimation, {
            toValue: 0,
            duration: 500,
            useNativeDriver: true,
          }),
        ]).start(() => {
          if (isPlaying) animate();
        });
      };
      animate();
    } else {
      dotAnimation.setValue(0);
    }
  }, [isPlaying, dotAnimation]);

  if (!currentTrack) return null;

  const dotOpacity = dotAnimation.interpolate({
    inputRange: [0, 1],
    outputRange: [0.3, 1],
  });

  return (
    <TouchableOpacity style={styles.container} onPress={onPress} activeOpacity={0.8}>
      <View style={styles.content}>
        {/* Icône de musique avec animation */}
        <View style={styles.iconContainer}>
          <Text style={styles.musicSymbol}>♪</Text>
          {isPlaying && (
            <View style={styles.animationContainer}>
              <Animated.View style={[styles.playingDot, { opacity: dotOpacity }]} />
              <Animated.View style={[styles.playingDot, { opacity: dotOpacity }]} />
              <Animated.View style={[styles.playingDot, { opacity: dotOpacity }]} />
            </View>
          )}
        </View>

        {/* Informations de la piste */}
        <View style={styles.trackInfo}>
          <Text style={styles.trackTitle} numberOfLines={1}>
            {currentTrack.title}
          </Text>
          <Text style={styles.trackDescription} numberOfLines={1}>
            {currentTrack.description}
          </Text>
        </View>

        {/* Contrôles */}
        <View style={styles.controls}>
          <TouchableOpacity
            style={styles.controlButton}
            onPress={togglePlayPause}
          >
            <Ionicons
              name={isPlaying ? "pause" : "play"}
              size={20}
              color="#007AFF"
            />
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.controlButton}
            onPress={stop}
          >
            <Ionicons
              name="stop"
              size={20}
              color="#666"
            />
          </TouchableOpacity>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 80, // Au-dessus de la barre de navigation
    left: 16,
    right: 16,
    backgroundColor: '#fff',
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 3,
    borderWidth: 1,
    borderColor: '#e5e5e7',
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 8,
  },
  iconContainer: {
    position: 'relative',
    marginRight: 8,
  },
  animationContainer: {
    position: 'absolute',
    top: -6,
    right: -6,
    flexDirection: 'row',
    alignItems: 'center',
  },
  playingDot: {
    width: 2,
    height: 2,
    borderRadius: 1,
    backgroundColor: '#007AFF',
    marginHorizontal: 0.5,
  },
  trackInfo: {
    flex: 1,
    marginRight: 8,
  },
  trackTitle: {
    fontSize: 12,
    fontWeight: '600',
    color: '#333',
    marginBottom: 1,
  },
  trackDescription: {
    fontSize: 10,
    color: '#666',
  },
  controls: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  controlButton: {
    padding: 6,
    marginLeft: 3,
    borderRadius: 16,
    backgroundColor: '#f8f9fa',
  },
  musicSymbol: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#007AFF',
  },
});
