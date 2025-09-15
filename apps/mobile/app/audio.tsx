import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { AudioPlayer } from '../components/AudioPlayer';
import { AudioPlaylist } from '../components/AudioPlaylist';
import { useAudioPlayer } from '../hooks/useAudioPlayer';
import { AudioTrack } from '../constants/AudioConfig';

export default function AudioScreen() {
  const [selectedTrack, setSelectedTrack] = useState<AudioTrack | null>(null);
  const [showPlaylist, setShowPlaylist] = useState(false);
  const { currentTrack, isPlaying, stop } = useAudioPlayer();

  const handleTrackSelect = (track: AudioTrack) => {
    setSelectedTrack(track);
    setShowPlaylist(false);
  };

  const handleStop = () => {
    stop();
    setSelectedTrack(null);
  };

  const handleShowPlaylist = () => {
    setShowPlaylist(!showPlaylist);
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>🎵 Tonalités Traditionnelles</Text>
        <Text style={styles.subtitle}>
          Découvrez la musique traditionnelle du Maghreb
        </Text>
      </View>

      {/* Lecteur audio principal */}
      <View style={styles.playerContainer}>
        <AudioPlayer
          track={selectedTrack || currentTrack}
          onTrackChange={setSelectedTrack}
          showControls={true}
        />
      </View>

      {/* Boutons d'action */}
      <View style={styles.actionButtons}>
        <TouchableOpacity
          style={[styles.actionButton, showPlaylist && styles.activeButton]}
          onPress={handleShowPlaylist}
        >
          <Ionicons 
            name={showPlaylist ? "list" : "musical-notes"} 
            size={20} 
            color={showPlaylist ? "#fff" : "#007AFF"} 
          />
          <Text style={[styles.actionButtonText, showPlaylist && styles.activeButtonText]}>
            {showPlaylist ? 'Masquer' : 'Playlist'}
          </Text>
        </TouchableOpacity>

        {(currentTrack || selectedTrack) && (
          <TouchableOpacity
            style={[styles.actionButton, styles.stopButton]}
            onPress={handleStop}
          >
            <Ionicons name="stop" size={20} color="#fff" />
            <Text style={[styles.actionButtonText, styles.stopButtonText]}>
              Arrêter
            </Text>
          </TouchableOpacity>
        )}
      </View>

      {/* Playlist */}
      {showPlaylist && (
        <View style={styles.playlistContainer}>
          <Text style={styles.playlistTitle}>Sélectionnez une piste</Text>
          <AudioPlaylist
            onTrackSelect={handleTrackSelect}
            showThumbnails={true}
          />
        </View>
      )}

      {/* Informations sur la piste actuelle */}
      {currentTrack && (
        <View style={styles.currentTrackInfo}>
          <View style={styles.currentTrackHeader}>
            <Ionicons name="musical-notes" size={16} color="#007AFF" />
            <Text style={styles.currentTrackLabel}>En cours de lecture</Text>
          </View>
          <Text style={styles.currentTrackTitle}>{currentTrack.title}</Text>
          <Text style={styles.currentTrackDescription}>{currentTrack.description}</Text>
        </View>
      )}

      {/* Instructions */}
      <View style={styles.instructions}>
        <Text style={styles.instructionsTitle}>💡 Comment utiliser</Text>
        <Text style={styles.instructionsText}>
          • Appuyez sur "Playlist" pour voir toutes les tonalités disponibles{'\n'}
          • Sélectionnez une piste pour commencer la lecture{'\n'}
          • Utilisez les contrôles pour gérer la lecture{'\n'}
          • La musique continue en arrière-plan pendant votre navigation
        </Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  header: {
    backgroundColor: '#fff',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#e5e5e7',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    textAlign: 'center',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
  },
  playerContainer: {
    margin: 16,
  },
  actionButtons: {
    flexDirection: 'row',
    justifyContent: 'center',
    paddingHorizontal: 20,
    marginBottom: 16,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 25,
    marginHorizontal: 8,
    borderWidth: 2,
    borderColor: '#007AFF',
  },
  activeButton: {
    backgroundColor: '#007AFF',
  },
  stopButton: {
    backgroundColor: '#ff6b6b',
    borderColor: '#ff6b6b',
  },
  actionButtonText: {
    marginLeft: 8,
    fontSize: 16,
    fontWeight: '600',
    color: '#007AFF',
  },
  activeButtonText: {
    color: '#fff',
  },
  stopButtonText: {
    color: '#fff',
  },
  playlistContainer: {
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
  currentTrackInfo: {
    backgroundColor: '#e8f4fd',
    margin: 16,
    padding: 16,
    borderRadius: 12,
    borderLeftWidth: 4,
    borderLeftColor: '#007AFF',
  },
  currentTrackHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  currentTrackLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#007AFF',
    marginLeft: 8,
  },
  currentTrackTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 4,
  },
  currentTrackDescription: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
  },
  instructions: {
    backgroundColor: '#fff3cd',
    margin: 16,
    padding: 16,
    borderRadius: 12,
    borderLeftWidth: 4,
    borderLeftColor: '#ffc107',
  },
  instructionsTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#856404',
    marginBottom: 8,
  },
  instructionsText: {
    fontSize: 14,
    color: '#856404',
    lineHeight: 20,
  },
});
