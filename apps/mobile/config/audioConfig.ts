// Configuration audio de base pour éviter les erreurs d'import
export const AUDIO_CONFIG = {
  BASE_URL: 'http://localhost:5000',
  ENDPOINTS: {
    AUDIO: '/api/audio',
    POPULAR: '/api/audio/popular',
    YOUTUBE_EMBED: '/api/audio/youtube',
  }
};

export const FALLBACK_TRACKS = [
  {
    id: 'fallback-1',
    title: 'Musique Traditionnelle',
    youtubeId: 'lYKdL3TLLfw',
    duration: 180,
    category: 'traditional' as const,
    description: 'Musique traditionnelle de fallback',
    thumbnailUrl: 'https://img.youtube.com/vi/lYKdL3TLLfw/mqdefault.jpg',
  }
];
