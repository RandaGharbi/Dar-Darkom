import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Animated,
  Dimensions,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAudioPlayer } from '../hooks/useAudioPlayer';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

interface MiniAudioPlayerProps {
  visible: boolean;
  onClose?: () => void;
}

const { width: screenWidth } = Dimensions.get('window');

export const MiniAudioPlayer: React.FC<MiniAudioPlayerProps> = ({
  visible,
  onClose,
}) => {
  const {
    isPlaying,
    currentTrack,
    position,
    duration,
    isLoading,
    togglePlayPause,
    playTrack,
    getAllTracks,
  } = useAudioPlayer();

  const insets = useSafeAreaInsets();
  const slideAnim = React.useRef(new Animated.Value(-100)).current;

  React.useEffect(() => {
    if (visible) {
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }).start();
    } else {
      Animated.timing(slideAnim, {
        toValue: -100,
        duration: 300,
        useNativeDriver: true,
      }).start();
    }
  }, [visible, slideAnim]);

  const formatTime = (milliseconds: number) => {
    const seconds = Math.floor(milliseconds / 1000);
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  const handleNextTrack = () => {
    const tracks = getAllTracks();
    const currentIndex = tracks.findIndex(t => t.id === currentTrack?.id);
    const nextTrack = tracks[(currentIndex + 1) % tracks.length];
    if (nextTrack) {
      playTrack(nextTrack.id);
    }
  };

  const handlePreviousTrack = () => {
    const tracks = getAllTracks();
    const currentIndex = tracks.findIndex(t => t.id === currentTrack?.id);
    const prevIndex = currentIndex <= 0 ? tracks.length - 1 : currentIndex - 1;
    const prevTrack = tracks[prevIndex];
    if (prevTrack) {
      playTrack(prevTrack.id);
    }
  };

  const progress = duration > 0 ? position / duration : 0;

  if (!visible || !currentTrack) {
    return null;
  }

  return (
    <Animated.View
      style={[
        styles.container,
        {
          top: insets.top,
          transform: [{ translateY: slideAnim }],
        },
      ]}
    >
      {/* Barre de progression en haut */}
      <View style={styles.progressBar}>
        <View
          style={[
            styles.progressFill,
            { width: `${progress * 100}%` },
          ]}
        />
      </View>

      {/* Contenu du mini-player */}
      <View style={styles.content}>
        {/* Informations de la piste */}
        <View style={styles.trackInfo}>
          <View style={styles.trackIcon}>
            <Ionicons name="musical-notes" size={16} color="#007AFF" />
          </View>
          <View style={styles.trackDetails}>
            <Text style={styles.trackTitle} numberOfLines={1}>
              {currentTrack.title}
            </Text>
            <Text style={styles.trackTime}>
              {formatTime(position)} / {formatTime(duration)}
            </Text>
          </View>
        </View>

        {/* Contrôles */}
        <View style={styles.controls}>
          <TouchableOpacity
            style={styles.controlButton}
            onPress={handlePreviousTrack}
            disabled={isLoading}
          >
            <Ionicons name="play-skip-back" size={20} color="#666" />
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.playButton}
            onPress={togglePlayPause}
            disabled={isLoading}
          >
            {isLoading ? (
              <Ionicons name="hourglass" size={20} color="#fff" />
            ) : (
              <Ionicons
                name={isPlaying ? 'pause' : 'play'}
                size={20}
                color="#fff"
              />
            )}
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.controlButton}
            onPress={handleNextTrack}
            disabled={isLoading}
          >
            <Ionicons name="play-skip-forward" size={20} color="#666" />
          </TouchableOpacity>

          {onClose && (
            <TouchableOpacity
              style={styles.closeButton}
              onPress={onClose}
            >
              <Ionicons name="close" size={18} color="#666" />
            </TouchableOpacity>
          )}
        </View>
      </View>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    left: 0,
    right: 0,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E5E7',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 5,
    zIndex: 1000,
  },
  progressBar: {
    height: 3,
    backgroundColor: '#E5E5E7',
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#007AFF',
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    minHeight: 60,
  },
  trackInfo: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 12,
  },
  trackIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#F0F0F0',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  trackDetails: {
    flex: 1,
  },
  trackTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    marginBottom: 2,
  },
  trackTime: {
    fontSize: 12,
    color: '#666',
  },
  controls: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  controlButton: {
    padding: 8,
    marginHorizontal: 4,
  },
  playButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#007AFF',
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 8,
  },
  closeButton: {
    padding: 8,
    marginLeft: 8,
  },
});