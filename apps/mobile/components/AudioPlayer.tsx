import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  Alert,
} from 'react-native';
import Slider from '@react-native-community/slider';
import { Ionicons } from '@expo/vector-icons';
import { useAudioPlayer } from '../hooks/useAudioPlayer';
import { AudioTrack } from '../constants/AudioConfig';

interface AudioPlayerProps {
  track?: AudioTrack;
  onTrackChange?: (track: AudioTrack) => void;
  showControls?: boolean;
  compact?: boolean;
}

export const AudioPlayer: React.FC<AudioPlayerProps> = ({
  track,
  onTrackChange,
  showControls = true,
  compact = false,
}) => {
  const {
    isPlaying,
    currentTrack,
    volume,
    position,
    duration,
    isLoading,
    error,
    playTrack,
    togglePlayPause,
    stop,
    setVolume,
    seekTo,
    getAllTracks,
  } = useAudioPlayer();

  const formatTime = (milliseconds: number) => {
    const seconds = Math.floor(milliseconds / 1000);
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  const handlePlayTrack = () => {
    if (track) {
      playTrack(track.id);
      onTrackChange?.(track);
    }
  };

  const handleSeek = (value: number) => {
    const newPosition = value * duration;
    seekTo(newPosition);
  };

  const handleVolumeChange = (value: number) => {
    setVolume(value);
  };

  if (error) {
    return (
      <View style={styles.errorContainer}>
        <Ionicons name="warning" size={20} color="#ff6b6b" />
        <Text style={styles.errorText}>{error}</Text>
      </View>
    );
  }

  if (compact) {
    return (
      <View style={styles.compactContainer}>
        <TouchableOpacity
          style={styles.compactButton}
          onPress={isPlaying ? togglePlayPause : handlePlayTrack}
          disabled={isLoading}
        >
          {isLoading ? (
            <ActivityIndicator size="small" color="#fff" />
          ) : (
            <Ionicons
              name={isPlaying ? 'pause' : 'play'}
              size={20}
              color="#fff"
            />
          )}
        </TouchableOpacity>
        <Text style={styles.compactTitle} numberOfLines={1}>
          {currentTrack?.title || track?.title || 'Aucune piste'}
        </Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.trackInfo}>
        <Text style={styles.trackTitle}>
          {currentTrack?.title || track?.title || 'Aucune piste sélectionnée'}
        </Text>
        <Text style={styles.trackDescription}>
          {currentTrack?.description || track?.description || ''}
        </Text>
      </View>

      {showControls && (
        <>
          {/* Contrôles de lecture */}
          <View style={styles.controls}>
            <TouchableOpacity
              style={styles.controlButton}
              onPress={stop}
              disabled={!currentTrack}
            >
              <Ionicons name="stop" size={24} color="#666" />
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.controlButton, styles.playButton]}
              onPress={isPlaying ? togglePlayPause : handlePlayTrack}
              disabled={isLoading}
            >
              {isLoading ? (
                <ActivityIndicator size="small" color="#fff" />
              ) : (
                <Ionicons
                  name={isPlaying ? 'pause' : 'play'}
                  size={32}
                  color="#fff"
                />
              )}
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.controlButton}
              onPress={() => {
                const tracks = getAllTracks();
                const currentIndex = tracks.findIndex(t => t.id === currentTrack?.id);
                const nextTrack = tracks[(currentIndex + 1) % tracks.length];
                if (nextTrack) {
                  playTrack(nextTrack.id);
                  onTrackChange?.(nextTrack);
                }
              }}
              disabled={!currentTrack}
            >
              <Ionicons name="play-skip-forward" size={24} color="#666" />
            </TouchableOpacity>
          </View>

          {/* Barre de progression */}
          <View style={styles.progressContainer}>
            <Text style={styles.timeText}>{formatTime(position)}</Text>
            <Slider
              style={styles.progressSlider}
              minimumValue={0}
              maximumValue={1}
              value={duration > 0 ? position / duration : 0}
              onValueChange={handleSeek}
              minimumTrackTintColor="#007AFF"
              maximumTrackTintColor="#E5E5E7"
              thumbStyle={styles.sliderThumb}
            />
            <Text style={styles.timeText}>{formatTime(duration)}</Text>
          </View>

          {/* Contrôle du volume */}
          <View style={styles.volumeContainer}>
            <Ionicons name="volume-low" size={20} color="#666" />
            <Slider
              style={styles.volumeSlider}
              minimumValue={0}
              maximumValue={1}
              value={volume}
              onValueChange={handleVolumeChange}
              minimumTrackTintColor="#007AFF"
              maximumTrackTintColor="#E5E5E7"
              thumbStyle={styles.sliderThumb}
            />
            <Ionicons name="volume-high" size={20} color="#666" />
          </View>
        </>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    margin: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  compactContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#007AFF',
    borderRadius: 16,
    paddingHorizontal: 8,
    paddingVertical: 6,
    margin: 2,
  },
  compactButton: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: 'rgba(255,255,255,0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 6,
  },
  compactTitle: {
    color: '#fff',
    fontSize: 11,
    fontWeight: '500',
    flex: 1,
  },
  trackInfo: {
    marginBottom: 16,
  },
  trackTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginBottom: 4,
  },
  trackDescription: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
  },
  controls: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  controlButton: {
    padding: 8,
    marginHorizontal: 8,
  },
  playButton: {
    backgroundColor: '#007AFF',
    borderRadius: 30,
    width: 60,
    height: 60,
    justifyContent: 'center',
    alignItems: 'center',
  },
  progressContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  timeText: {
    fontSize: 12,
    color: '#666',
    minWidth: 40,
    textAlign: 'center',
  },
  progressSlider: {
    flex: 1,
    marginHorizontal: 8,
  },
  volumeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  volumeSlider: {
    flex: 1,
    marginHorizontal: 8,
  },
  sliderThumb: {
    backgroundColor: '#007AFF',
    width: 20,
    height: 20,
  },
  errorContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ffebee',
    padding: 12,
    borderRadius: 8,
    margin: 8,
  },
  errorText: {
    color: '#c62828',
    marginLeft: 8,
    flex: 1,
  },
});
