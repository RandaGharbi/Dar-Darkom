import { Audio } from 'expo-av';
import { TRADITIONAL_AUDIO_TRACKS, AudioTrack, AUDIO_SETTINGS } from '../constants/AudioConfig';
import { audioApiService } from './audioApiService';
import { LOCAL_AUDIO_FILES } from '../constants/AudioFiles';

export interface AudioState {
  isPlaying: boolean;
  currentTrack: AudioTrack | null;
  volume: number;
  position: number;
  duration: number;
  isLoading: boolean;
  error: string | null;
}

class AudioService {
  private sound: Audio.Sound | null = null;
  private preloadedSounds: Map<string, Audio.Sound> = new Map(); // Cache des sons préchargés
  private currentState: AudioState = {
    isPlaying: false,
    currentTrack: null,
    volume: AUDIO_SETTINGS.defaultVolume,
    position: 0,
    duration: 0,
    isLoading: false,
    error: null
  };
  private listeners: ((state: AudioState) => void)[] = [];

  constructor() {
    this.initializeAudio();
    // Délai réduit pour un démarrage plus rapide
    setTimeout(() => {
      this.preloadPopularTracks();
    }, 300);
    
    // Fallback pour s'assurer que la musique se lance
    if (AUDIO_SETTINGS.autoPlay) {
      setTimeout(() => {
        if (!this.currentState.isPlaying && !this.currentState.currentTrack) {
          console.log('🔄 Fallback: Lancement automatique de la musique...');
          this.playTrack('traditional-1');
        }
      }, 2000);
    }
  }

  private async initializeAudio() {
    try {
      await Audio.setAudioModeAsync({
        allowsRecordingIOS: false,
        staysActiveInBackground: true,
        playsInSilentModeIOS: true,
        shouldDuckAndroid: true,
        playThroughEarpieceAndroid: false,
      });
    } catch (error) {
      console.error('❌ Erreur lors de l\'initialisation audio:', error);
      this.updateState({ error: 'Erreur d\'initialisation audio' });
    }
  }

  private notifyListeners() {
    this.listeners.forEach(listener => listener(this.currentState));
  }

  private updateState(updates: Partial<AudioState>) {
    this.currentState = { ...this.currentState, ...updates };
    this.notifyListeners();
  }

  // S'abonner aux changements d'état
  subscribe(listener: (state: AudioState) => void) {
    this.listeners.push(listener);
    return () => {
      this.listeners = this.listeners.filter(l => l !== listener);
    };
  }

  // Obtenir l'état actuel
  getState(): AudioState {
    return { ...this.currentState };
  }

  // Charger et jouer une piste
  async playTrack(trackId: string) {
    try {
      this.updateState({ isLoading: true, error: null });

      const track = TRADITIONAL_AUDIO_TRACKS.find(t => t.id === trackId);
      if (!track) {
        throw new Error('Piste audio introuvable');
      }

      // Arrêter la piste actuelle si elle joue (sans attendre)
      if (this.sound) {
        this.sound.stopAsync().catch(console.error);
      }

      // Vérifier si la piste est déjà préchargée
      let sound = this.preloadedSounds.get(trackId);
      
      if (!sound) {
        // Utiliser le fichier audio local
        const audioFile = LOCAL_AUDIO_FILES[trackId as keyof typeof LOCAL_AUDIO_FILES] || LOCAL_AUDIO_FILES['traditional-1'];
        
        const { sound: newSound } = await Audio.Sound.createAsync(
          audioFile,
          {
            shouldPlay: false, // Ne pas jouer immédiatement
            volume: this.currentState.volume,
            isLooping: AUDIO_SETTINGS.autoLoop,
          }
        );
        
        // S'assurer que le volume est correctement défini
        await newSound.setVolumeAsync(this.currentState.volume);
        
        sound = newSound;
        this.preloadedSounds.set(trackId, sound);
      }

      this.sound = sound;

      // Vérifier si le son est chargé, sinon le recharger
      const soundStatus = await sound.getStatusAsync();
      if (!soundStatus.isLoaded) {
        console.log('🔄 Rechargement du son...');
        const audioFile = LOCAL_AUDIO_FILES[trackId as keyof typeof LOCAL_AUDIO_FILES] || LOCAL_AUDIO_FILES['traditional-1'];
        const { sound: reloadedSound } = await Audio.Sound.createAsync(
          audioFile,
          {
            shouldPlay: false,
            volume: this.currentState.volume,
            isLooping: AUDIO_SETTINGS.autoLoop,
          }
        );
        this.sound = reloadedSound;
        this.preloadedSounds.set(trackId, reloadedSound);
        sound = reloadedSound; // Mettre à jour la référence
      }

      // Configurer les callbacks
      sound.setOnPlaybackStatusUpdate((status) => {
        if (status.isLoaded) {
          this.updateState({
            isPlaying: status.isPlaying,
            position: status.positionMillis || 0,
            duration: status.durationMillis || 0,
            isLoading: false
          });
        }
      });

      // Attendre que le son soit chargé avant de jouer
      const finalStatus = await sound.getStatusAsync();
      
      if (finalStatus.isLoaded) {
        // S'assurer que le volume est correct avant de jouer
        await sound.setVolumeAsync(this.currentState.volume);
        await sound.playAsync();
        this.updateState({
          currentTrack: track,
          isPlaying: true,
          isLoading: false
        });
      } else {
        console.error('❌ Le son n\'est pas chargé, statut:', finalStatus);
        this.updateState({
          isLoading: false,
          error: 'Le son n\'est pas encore chargé'
        });
        throw new Error('Le son n\'est pas encore chargé');
      }

    } catch (error) {
      console.error('Erreur lors de la lecture:', error);
      this.updateState({
        isLoading: false,
        error: error instanceof Error ? error.message : 'Erreur inconnue'
      });
    }
  }


  // Jouer/Pause
  async togglePlayPause() {
    
    if (!this.sound) {
      // Essayer de recharger la piste actuelle
      if (this.currentState.currentTrack) {
        await this.playTrack(this.currentState.currentTrack.id);
      } else {
        await this.playTrack('traditional-1');
      }
      return;
    }

    try {
      const status = await this.sound.getStatusAsync();
      
      if (status.isLoaded) {
        if (this.currentState.isPlaying) {
          await this.sound.stopAsync();
          this.updateState({ 
            isPlaying: false,
            position: 0
          });
        } else {
          // S'assurer que le volume est correct avant de jouer
          await this.sound.setVolumeAsync(this.currentState.volume);
          await this.sound.playAsync();
          this.updateState({ isPlaying: true });
        }
      } else {
        // Recharger le son
        if (this.currentState.currentTrack) {
          await this.playTrack(this.currentState.currentTrack.id);
        } else {
          await this.playTrack('traditional-1');
        }
      }
    } catch (error) {
      console.error('❌ Erreur lors du toggle play/pause:', error);
      // En cas d'erreur, essayer de recharger
      if (this.currentState.currentTrack) {
        await this.playTrack(this.currentState.currentTrack.id);
      } else {
        await this.playTrack('traditional-1');
      }
    }
  }

  // Arrêter la lecture
  async stop() {
    if (!this.sound) return;

    try {
      const status = await this.sound.getStatusAsync();
      if (status.isLoaded) {
        await this.sound.stopAsync();
        // Ne pas décharger le son, juste l'arrêter pour pouvoir le relancer
        // await this.sound.unloadAsync();
      }
      // Ne pas mettre this.sound = null pour garder la référence
      
      this.updateState({
        isPlaying: false,
        currentTrack: null,
        position: 0,
        duration: 0
      });
    } catch (error) {
      console.error('Erreur lors de l\'arrêt:', error);
      this.updateState({
        isPlaying: false,
        currentTrack: null,
        position: 0,
        duration: 0
      });
    }
  }

  // Changer le volume
  async setVolume(volume: number) {
    const clampedVolume = Math.max(0, Math.min(1, volume));
    
    if (this.sound) {
      try {
        await this.sound.setVolumeAsync(clampedVolume);
      } catch (error) {
        console.error('Erreur lors du changement de volume:', error);
      }
    }

    this.updateState({ volume: clampedVolume });
  }

  // Aller à une position spécifique
  async seekTo(positionMillis: number) {
    if (!this.sound) return;

    try {
      await this.sound.setPositionAsync(positionMillis);
      this.updateState({ position: positionMillis });
    } catch (error) {
      console.error('Erreur lors du seek:', error);
    }
  }

  // Obtenir les pistes par catégorie
  async getTracksByCategory(category: string): Promise<AudioTrack[]> {
    try {
      const response = await audioApiService.getTracksByCategory(category);
      return response.data || [];
    } catch (error) {
      console.error('Erreur lors de la récupération des pistes par catégorie:', error);
      // Fallback sur les pistes locales
      return TRADITIONAL_AUDIO_TRACKS.filter(track => track.category === category);
    }
  }

  // Obtenir toutes les pistes
  async getAllTracks(): Promise<AudioTrack[]> {
    try {
      const response = await audioApiService.getAllTracks();
      return response.data || [];
    } catch (error) {
      console.error('Erreur lors de la récupération des pistes:', error);
      // Fallback sur les pistes locales
      return [...TRADITIONAL_AUDIO_TRACKS];
    }
  }

  // Obtenir les pistes populaires
  async getPopularTracks(): Promise<AudioTrack[]> {
    try {
      const response = await audioApiService.getPopularTracks();
      return response.data || [];
    } catch (error) {
      console.error('Erreur lors de la récupération des pistes populaires:', error);
      return [];
    }
  }

  // Rechercher des pistes
  async searchTracks(query: string, category?: string): Promise<AudioTrack[]> {
    try {
      const response = await audioApiService.searchTracks(query, category);
      return response.data || [];
    } catch (error) {
      console.error('Erreur lors de la recherche de pistes:', error);
      return [];
    }
  }

  // Précharger les pistes populaires
  private async preloadPopularTracks() {
    try {
      // Précharger seulement la première piste pour éviter les erreurs
      const track = TRADITIONAL_AUDIO_TRACKS[0];
      if (track) {
        try {
          const audioFile = LOCAL_AUDIO_FILES[track.id as keyof typeof LOCAL_AUDIO_FILES] || LOCAL_AUDIO_FILES['traditional-1'];
          const { sound } = await Audio.Sound.createAsync(
            audioFile,
            { shouldPlay: false, volume: 0 } // Volume 0 pour le préchargement
          );
          this.preloadedSounds.set(track.id, sound);
          console.log(`✅ Piste préchargée: ${track.title} (Andalous.mp3)`);
        } catch (error) {
        }
      }
    } catch (error) {
      console.error('Erreur lors du préchargement:', error);
    }
  }

  // Nettoyer les ressources
  async cleanup() {
    if (this.sound) {
      await this.stop();
    }
    
    // Nettoyer le cache de préchargement
    for (const [trackId, sound] of this.preloadedSounds) {
      try {
        await sound.unloadAsync();
      } catch (error) {
      }
    }
    this.preloadedSounds.clear();
    this.listeners = [];
  }
}

// Instance singleton
export const audioService = new AudioService();
