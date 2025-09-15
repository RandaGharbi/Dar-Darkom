import React, { useState, useEffect } from 'react';
import {
  TouchableOpacity,
  StyleSheet,
  Text,
  View,
  Modal,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { AudioPlayer } from './AudioPlayer';
import { AudioPlaylist } from './AudioPlaylist';
import { useAudioPlayer } from '../hooks/useAudioPlayer';
import { AudioTrack } from '../constants/AudioConfig';

interface AudioToggleButtonProps {
  style?: any;
  size?: 'small' | 'medium' | 'large';
  showLabel?: boolean;
  position?: 'top-right' | 'top-left' | 'bottom-right' | 'bottom-left';
}

export const AudioToggleButton: React.FC<AudioToggleButtonProps> = ({
  style,
  size = 'medium',
  showLabel = true,
  position = 'top-right',
}) => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const { isPlaying, currentTrack, stop } = useAudioPlayer();

  const getSizeStyles = () => {
    switch (size) {
      case 'small':
        return { button: styles.smallButton, icon: 16, text: 12 };
      case 'large':
        return { button: styles.largeButton, icon: 28, text: 16 };
      default:
        return { button: styles.mediumButton, icon: 20, text: 14 };
    }
  };

  const getPositionStyles = () => {
    switch (position) {
      case 'top-left':
        return styles.topLeft;
      case 'bottom-right':
        return styles.bottomRight;
      case 'bottom-left':
        return styles.bottomLeft;
      default:
        return styles.topRight;
    }
  };

  const sizeConfig = getSizeStyles();
  const positionConfig = getPositionStyles();

  const handlePress = () => {
    if (isPlaying) {
      // Si une musique joue, arrêter
      stop();
    } else {
      // Sinon, ouvrir la modal de sélection
      setIsModalVisible(true);
    }
  };

  const handleTrackSelect = (track: AudioTrack) => {
    setIsModalVisible(false);
  };

  const handleCloseModal = () => {
    setIsModalVisible(false);
  };

  return (
    <>
      <TouchableOpacity
        style={[
          styles.button,
          sizeConfig.button,
          positionConfig,
          style,
          isPlaying && styles.playingButton,
        ]}
        onPress={handlePress}
        activeOpacity={0.7}
      >
        <Ionicons
          name={isPlaying ? 'musical-notes' : 'musical-notes-outline'}
          size={sizeConfig.icon}
          color={isPlaying ? '#fff' : '#007AFF'}
        />
        {showLabel && (
          <Text style={[
            styles.buttonText,
            { fontSize: sizeConfig.text },
            isPlaying && styles.playingButtonText,
          ]}>
            {isPlaying ? 'Musique' : 'Audio'}
          </Text>
        )}
        {isPlaying && (
          <View style={styles.playingIndicator}>
            <View style={styles.playingDot} />
            <View style={[styles.playingDot, styles.playingDotDelay]} />
            <View style={[styles.playingDot, styles.playingDotDelay2]} />
          </View>
        )}
      </TouchableOpacity>

      <Modal
        visible={isModalVisible}
        animationType="slide"
        presentationStyle="pageSheet"
        onRequestClose={handleCloseModal}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>🎵 Tonalités Traditionnelles</Text>
            <TouchableOpacity
              style={styles.closeButton}
              onPress={handleCloseModal}
            >
              <Ionicons name="close" size={24} color="#666" />
            </TouchableOpacity>
          </View>

          <View style={styles.modalContent}>
            <AudioPlayer
              track={currentTrack}
              onTrackChange={handleTrackSelect}
              showControls={true}
            />

            <View style={styles.playlistSection}>
              <Text style={styles.playlistTitle}>Sélectionnez une piste</Text>
              <AudioPlaylist
                onTrackSelect={handleTrackSelect}
                showThumbnails={true}
              />
            </View>
          </View>
        </View>
      </Modal>
    </>
  );
};

const styles = StyleSheet.create({
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 25,
    paddingHorizontal: 12,
    paddingVertical: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    borderWidth: 1,
    borderColor: '#e5e5e7',
  },
  smallButton: {
    paddingHorizontal: 6,
    paddingVertical: 4,
    borderRadius: 16,
  },
  mediumButton: {
    paddingHorizontal: 8,
    paddingVertical: 6,
    borderRadius: 20,
  },
  largeButton: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 25,
  },
  topRight: {
    position: 'absolute',
    top: 50,
    right: 16,
    zIndex: 1000,
  },
  topLeft: {
    position: 'absolute',
    top: 50,
    left: 16,
    zIndex: 1000,
  },
  bottomRight: {
    position: 'absolute',
    bottom: 100,
    right: 16,
    zIndex: 1000,
  },
  bottomLeft: {
    position: 'absolute',
    bottom: 100,
    left: 16,
    zIndex: 1000,
  },
  playingButton: {
    backgroundColor: '#007AFF',
    borderColor: '#007AFF',
  },
  buttonText: {
    marginLeft: 6,
    fontWeight: '600',
    color: '#007AFF',
  },
  playingButtonText: {
    color: '#fff',
  },
  playingIndicator: {
    flexDirection: 'row',
    marginLeft: 8,
    alignItems: 'center',
  },
  playingDot: {
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: '#fff',
    marginHorizontal: 1,
  },
  playingDotDelay: {
    animationDelay: '0.2s',
  },
  playingDotDelay2: {
    animationDelay: '0.4s',
  },
  modalContainer: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#fff',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#e5e5e7',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
  },
  closeButton: {
    padding: 4,
  },
  modalContent: {
    flex: 1,
  },
  playlistSection: {
    flex: 1,
    margin: 16,
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
  },
  playlistTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginBottom: 16,
    textAlign: 'center',
  },
});
