import { API_CONFIG } from '../config/api';
import { AudioTrack } from '../constants/AudioConfig';
import { AUDIO_CONFIG as FALLBACK_CONFIG } from '../config/audioConfig';

export interface AudioApiResponse {
  success: boolean;
  data: AudioTrack[];
  pagination?: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
}

export interface SingleAudioResponse {
  success: boolean;
  data: AudioTrack;
}

export class AudioApiService {
  private baseUrl = API_CONFIG?.BASE_URL || FALLBACK_CONFIG.BASE_URL;

  // Obtenir toutes les pistes audio
  async getAllTracks(params?: {
    category?: string;
    search?: string;
    limit?: number;
    page?: number;
  }): Promise<AudioApiResponse> {
    try {
      const queryParams = new URLSearchParams();
      
      if (params?.category) queryParams.append('category', params.category);
      if (params?.search) queryParams.append('search', params.search);
      if (params?.limit) queryParams.append('limit', params.limit.toString());
      if (params?.page) queryParams.append('page', params.page.toString());

      const url = `${this.baseUrl}/api/audio?${queryParams.toString()}`;
      
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`Erreur HTTP: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Erreur lors de la récupération des pistes audio:', error);
      throw error;
    }
  }

  // Obtenir une piste par ID
  async getTrackById(id: string): Promise<SingleAudioResponse> {
    try {
      const url = `${this.baseUrl}/api/audio/${id}`;
      
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`Erreur HTTP: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Erreur lors de la récupération de la piste:', error);
      throw error;
    }
  }

  // Obtenir les pistes populaires
  async getPopularTracks(limit: number = 10): Promise<AudioApiResponse> {
    try {
      const url = `${this.baseUrl}/api/audio/popular?limit=${limit}`;
      
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`Erreur HTTP: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Erreur lors de la récupération des pistes populaires:', error);
      throw error;
    }
  }

  // Incrémenter le compteur de lecture
  async incrementPlayCount(id: string): Promise<{ success: boolean; data: { playCount: number } }> {
    try {
      const url = `${this.baseUrl}/api/audio/${id}/play`;
      
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`Erreur HTTP: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Erreur lors de l\'incrémentation du compteur:', error);
      throw error;
    }
  }

  // Obtenir l'URL d'embed YouTube
  async getYouTubeEmbedUrl(youtubeId: string, autoplay: boolean = false): Promise<{ success: boolean; data: { embedUrl: string } }> {
    try {
      const url = `${this.baseUrl}/api/audio/youtube/${youtubeId}/embed?autoplay=${autoplay}`;
      
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`Erreur HTTP: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Erreur lors de la récupération de l\'URL d\'embed:', error);
      throw error;
    }
  }

  // Rechercher des pistes
  async searchTracks(query: string, category?: string): Promise<AudioApiResponse> {
    return this.getAllTracks({
      search: query,
      category,
      limit: 20,
    });
  }

  // Obtenir les pistes par catégorie
  async getTracksByCategory(category: string, limit: number = 50): Promise<AudioApiResponse> {
    return this.getAllTracks({
      category,
      limit,
    });
  }
}

// Instance singleton
export const audioApiService = new AudioApiService();
