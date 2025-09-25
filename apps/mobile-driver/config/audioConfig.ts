// Configuration de fallback pour l'API audio
export const AUDIO_CONFIG = {
  BASE_URL: 'http://192.168.1.73:5000',
  
  ENDPOINTS: {
    // Audio specific endpoints
    AUDIO_TRACKS: '/api/audio',
    AUDIO_TRACK_BY_ID: (id: string) => `/api/audio/${id}`,
    AUDIO_POPULAR: '/api/audio/popular',
    AUDIO_PLAY_COUNT: (id: string) => `/api/audio/${id}/play`,
    AUDIO_YOUTUBE_EMBED: (youtubeId: string) => `/api/audio/youtube/${youtubeId}/embed`,
    AUDIO_SEARCH: '/api/audio/search',
    AUDIO_CATEGORY: (category: string) => `/api/audio/category/${category}`,
  },
  
  // Configuration par défaut pour les requêtes audio
  DEFAULT_PARAMS: {
    limit: 20,
    page: 1,
    category: 'traditional',
  },
  
  // Timeouts et retry
  TIMEOUT: 10000, // 10 secondes
  MAX_RETRIES: 3,
  
  // Configuration des headers
  HEADERS: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  }
};

export default AUDIO_CONFIG;
