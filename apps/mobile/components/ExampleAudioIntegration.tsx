import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { AudioToggleButton } from './AudioToggleButton';

// Exemple d'intégration du bouton audio dans un écran existant
export const ExampleAudioIntegration: React.FC = () => {
  return (
    <View style={styles.container}>
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
        <Text style={styles.title}>Exemple d'intégration audio</Text>
        
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>🎵 Fonctionnalités audio</Text>
          <Text style={styles.description}>
            Ce composant montre comment intégrer les tonalités traditionnelles 
            dans n'importe quel écran de votre application.
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>📍 Boutons disponibles</Text>
          <View style={styles.buttonList}>
            <View style={styles.buttonItem}>
              <Ionicons name="musical-notes" size={20} color="#007AFF" />
              <Text style={styles.buttonText}>Bouton principal (haut-droite)</Text>
            </View>
            <View style={styles.buttonItem}>
              <Ionicons name="musical-notes-outline" size={20} color="#666" />
              <Text style={styles.buttonText}>Bouton compact (bas-gauche)</Text>
            </View>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>🎛️ Contrôles disponibles</Text>
          <View style={styles.featureList}>
            <View style={styles.featureItem}>
              <Ionicons name="play" size={16} color="#4CAF50" />
              <Text style={styles.featureText}>Lecture/Pause automatique</Text>
            </View>
            <View style={styles.featureItem}>
              <Ionicons name="list" size={16} color="#4CAF50" />
              <Text style={styles.featureText}>Playlist complète</Text>
            </View>
            <View style={styles.featureItem}>
              <Ionicons name="volume-high" size={16} color="#4CAF50" />
              <Text style={styles.featureText}>Contrôle du volume</Text>
            </View>
            <View style={styles.featureItem}>
              <Ionicons name="repeat" size={16} color="#4CAF50" />
              <Text style={styles.featureText}>Lecture en boucle</Text>
            </View>
            <View style={styles.featureItem}>
              <Ionicons name="musical-notes" size={16} color="#4CAF50" />
              <Text style={styles.featureText}>Musique traditionnelle</Text>
            </View>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>🔧 Comment utiliser</Text>
          <Text style={styles.instructionText}>
            1. Appuyez sur le bouton audio pour ouvrir la playlist{'\n'}
            2. Sélectionnez une tonalité traditionnelle{'\n'}
            3. La musique joue en arrière-plan pendant votre navigation{'\n'}
            4. Utilisez les contrôles pour gérer la lecture
          </Text>
        </View>

        <View style={styles.codeExample}>
          <Text style={styles.codeTitle}>Exemple de code :</Text>
          <Text style={styles.codeText}>
{`import { AudioToggleButton } from './components/AudioToggleButton';

// Dans votre composant
<AudioToggleButton
  position="top-right"
  size="medium"
  showLabel={true}
/>`}
          </Text>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  content: {
    flex: 1,
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 20,
    textAlign: 'center',
  },
  section: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginBottom: 12,
  },
  description: {
    fontSize: 16,
    color: '#666',
    lineHeight: 24,
  },
  buttonList: {
    gap: 12,
  },
  buttonItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
  },
  buttonText: {
    fontSize: 16,
    color: '#333',
    marginLeft: 12,
  },
  featureList: {
    gap: 8,
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 4,
  },
  featureText: {
    fontSize: 14,
    color: '#333',
    marginLeft: 12,
  },
  instructionText: {
    fontSize: 14,
    color: '#666',
    lineHeight: 22,
  },
  codeExample: {
    backgroundColor: '#f8f9fa',
    borderRadius: 8,
    padding: 16,
    borderLeftWidth: 4,
    borderLeftColor: '#007AFF',
  },
  codeTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
  },
  codeText: {
    fontSize: 12,
    color: '#333',
    fontFamily: 'monospace',
    lineHeight: 18,
  },
});
