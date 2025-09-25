import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  SafeAreaView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { AudioToggleButton } from '../components/AudioToggleButton';
import { AudioPlayer } from '../components/AudioPlayer';
import { AudioPlaylist } from '../components/AudioPlaylist';
import { useAudioPlayer } from '../hooks/useAudioPlayer';

export default function ExampleAudioIntegrationScreen() {
  const { currentTrack, isPlaying } = useAudioPlayer();

  return (
    <SafeAreaView style={styles.container}>
      {/* Bouton audio flottant en haut à droite */}
      <AudioToggleButton
        position="top-right"
        size="medium"
        showLabel={true}
      />

      {/* Bouton audio compact en bas à gauche */}
      <AudioToggleButton
        position="bottom-left"
        size="small"
        showLabel={false}
      />

      <ScrollView style={styles.content}>
        <View style={styles.header}>
          <Text style={styles.title}>🎵 Exemple d'Intégration Audio</Text>
          <Text style={styles.subtitle}>
            Découvrez comment intégrer les tonalités traditionnelles
          </Text>
        </View>

        {/* Lecteur audio intégré */}
        <View style={styles.playerSection}>
          <Text style={styles.sectionTitle}>Lecteur Audio Intégré</Text>
          <AudioPlayer
            track={currentTrack}
            onTrackChange={(track) => console.log('Nouvelle piste:', track)}
            showControls={true}
          />
        </View>

        {/* Playlist intégrée */}
        <View style={styles.playlistSection}>
          <Text style={styles.sectionTitle}>Playlist Traditionnelle</Text>
          <AudioPlaylist
            category="traditional"
            onTrackSelect={(track) => console.log('Piste sélectionnée:', track)}
            showThumbnails={true}
          />
        </View>

        {/* Informations sur l'état actuel */}
        {currentTrack && (
          <View style={styles.statusSection}>
            <Text style={styles.sectionTitle}>État Actuel</Text>
            <View style={styles.statusCard}>
              <View style={styles.statusRow}>
                <Ionicons 
                  name={isPlaying ? "musical-notes" : "pause"} 
                  size={20} 
                  color={isPlaying ? "#4CAF50" : "#FF9800"} 
                />
                <Text style={styles.statusText}>
                  {isPlaying ? 'En cours de lecture' : 'En pause'}
                </Text>
              </View>
              <Text style={styles.trackTitle}>{currentTrack.title}</Text>
              <Text style={styles.trackDescription}>{currentTrack.description}</Text>
            </View>
          </View>
        )}

        {/* Instructions d'utilisation */}
        <View style={styles.instructionsSection}>
          <Text style={styles.sectionTitle}>Comment Utiliser</Text>
          <View style={styles.instructionList}>
            <View style={styles.instructionItem}>
              <Ionicons name="musical-notes" size={16} color="#007AFF" />
              <Text style={styles.instructionText}>
                Appuyez sur les boutons audio pour ouvrir la playlist
              </Text>
            </View>
            <View style={styles.instructionItem}>
              <Ionicons name="play" size={16} color="#007AFF" />
              <Text style={styles.instructionText}>
                Sélectionnez une tonalité traditionnelle
              </Text>
            </View>
            <View style={styles.instructionItem}>
              <Ionicons name="volume-high" size={16} color="#007AFF" />
              <Text style={styles.instructionText}>
                Utilisez les contrôles pour gérer la lecture
              </Text>
            </View>
            <View style={styles.instructionItem}>
              <Ionicons name="navigate" size={16} color="#007AFF" />
              <Text style={styles.instructionText}>
                La musique continue en arrière-plan
              </Text>
            </View>
          </View>
        </View>

        {/* Code d'exemple */}
        <View style={styles.codeSection}>
          <Text style={styles.sectionTitle}>Code d'Exemple</Text>
          <View style={styles.codeBlock}>
            <Text style={styles.codeText}>
{`// Bouton audio simple
<AudioToggleButton 
  position="top-right" 
  size="medium" 
  showLabel={true} 
/>

// Lecteur complet
<AudioPlayer 
  track={selectedTrack}
  onTrackChange={setSelectedTrack}
  showControls={true}
/>

// Playlist
<AudioPlaylist 
  category="traditional"
  onTrackSelect={handleTrackSelect}
  showThumbnails={true}
/>`}
            </Text>
          </View>
        </View>

        {/* Fonctionnalités disponibles */}
        <View style={styles.featuresSection}>
          <Text style={styles.sectionTitle}>Fonctionnalités Disponibles</Text>
          <View style={styles.featureGrid}>
            <View style={styles.featureCard}>
              <Ionicons name="musical-notes" size={24} color="#4CAF50" />
              <Text style={styles.featureTitle}>Musique Traditionnelle</Text>
              <Text style={styles.featureDescription}>
                Andalouse, berbère, gnawa, classique arabe
              </Text>
            </View>
            <View style={styles.featureCard}>
              <Ionicons name="repeat" size={24} color="#4CAF50" />
              <Text style={styles.featureTitle}>Lecture en Boucle</Text>
              <Text style={styles.featureDescription}>
                Continuité musicale automatique
              </Text>
            </View>
            <View style={styles.featureCard}>
              <Ionicons name="volume-high" size={24} color="#4CAF50" />
              <Text style={styles.featureTitle}>Contrôle du Volume</Text>
              <Text style={styles.featureDescription}>
                Ajustement précis du son
              </Text>
            </View>
            <View style={styles.featureCard}>
              <Ionicons name="list" size={24} color="#4CAF50" />
              <Text style={styles.featureTitle}>Playlist Complète</Text>
              <Text style={styles.featureDescription}>
                Sélection parmi de nombreuses pistes
              </Text>
            </View>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  content: {
    flex: 1,
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
  playerSection: {
    margin: 16,
  },
  playlistSection: {
    margin: 16,
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
  },
  statusSection: {
    margin: 16,
  },
  statusCard: {
    backgroundColor: '#e8f4fd',
    padding: 16,
    borderRadius: 12,
    borderLeftWidth: 4,
    borderLeftColor: '#007AFF',
  },
  statusRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  statusText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#007AFF',
    marginLeft: 8,
  },
  trackTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 4,
  },
  trackDescription: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
  },
  instructionsSection: {
    margin: 16,
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
  },
  instructionList: {
    gap: 12,
  },
  instructionItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  instructionText: {
    fontSize: 14,
    color: '#333',
    marginLeft: 12,
    flex: 1,
  },
  codeSection: {
    margin: 16,
    backgroundColor: '#f8f9fa',
    borderRadius: 12,
    padding: 16,
    borderLeftWidth: 4,
    borderLeftColor: '#007AFF',
  },
  codeBlock: {
    backgroundColor: '#2d3748',
    borderRadius: 8,
    padding: 16,
    marginTop: 12,
  },
  codeText: {
    fontSize: 12,
    color: '#e2e8f0',
    fontFamily: 'monospace',
    lineHeight: 18,
  },
  featuresSection: {
    margin: 16,
  },
  featureGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  featureCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    width: '48%',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  featureTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    marginTop: 8,
    marginBottom: 4,
    textAlign: 'center',
  },
  featureDescription: {
    fontSize: 12,
    color: '#666',
    textAlign: 'center',
    lineHeight: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginBottom: 12,
  },
});
