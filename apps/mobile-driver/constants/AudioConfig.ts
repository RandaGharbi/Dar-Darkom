// Configuration des tonalités traditionnelles
export interface AudioTrack {
  id: string;
  title: string;
  youtubeId: string;
  duration: number; // en secondes
  category: 'traditional' | 'ambient' | 'classical';
  description: string;
}

export const TRADITIONAL_AUDIO_TRACKS: AudioTrack[] = [
  {
    id: 'traditional-1',
    title: 'Musique Andalouse Traditionnelle',
    youtubeId: 'lYKdL3TLLfw', // Lien YouTube fourni
    duration: 180,
    category: 'traditional',
    description: 'Mélodie traditionnelle andalouse pour une ambiance authentique'
  },
  {
    id: 'traditional-2',
    title: 'Oud et Qanun Oriental',
    youtubeId: 'lYKdL3TLLfw', // Lien YouTube fourni
    duration: 240,
    category: 'traditional',
    description: 'Instruments traditionnels du Moyen-Orient'
  },
  {
    id: 'traditional-3',
    title: 'Musique Berbère du Maghreb',
    youtubeId: 'lYKdL3TLLfw', // Lien YouTube fourni
    duration: 200,
    category: 'traditional',
    description: 'Rythmes et mélodies berbères traditionnelles'
  },
  {
    id: 'ambient-1',
    title: 'Ambiance Souk Méditerranéen',
    youtubeId: 'lYKdL3TLLfw', // Lien YouTube fourni
    duration: 300,
    category: 'ambient',
    description: 'Ambiance sonore d\'un souk traditionnel'
  },
  {
    id: 'classical-1',
    title: 'Musique Classique Arabe',
    youtubeId: 'lYKdL3TLLfw', // Lien YouTube fourni
    duration: 220,
    category: 'classical',
    description: 'Compositions classiques de la musique arabe'
  }
];

export const AUDIO_SETTINGS = {
  // Volume par défaut (0.0 à 1.0)
  defaultVolume: 0.3,
  
  // Lecture automatique au démarrage de l'app
  autoPlay: true,
  
  // Boucle automatique
  autoLoop: true,
  
  // Fade in/out en millisecondes
  fadeInDuration: 1000, // Réduit de 2000 à 1000ms
  fadeOutDuration: 1500, // Réduit de 3000 à 1500ms
  
  // Catégorie par défaut
  defaultCategory: 'traditional' as const,
  
  // Durée minimum de lecture avant de pouvoir changer de piste
  minPlayDuration: 5000, // Réduit de 10 à 5 secondes
  
  // Configuration de performance
  preloadTracks: 3, // Nombre de pistes à précharger
  cacheSize: 5, // Taille maximale du cache
  bufferSize: 1024, // Taille du buffer audio
};

export const getYouTubeEmbedUrl = (videoId: string, autoplay: boolean = false) => {
  return `https://www.youtube.com/embed/${videoId}?autoplay=${autoplay ? 1 : 0}&loop=1&playlist=${videoId}&controls=0&showinfo=0&rel=0&modestbranding=1&iv_load_policy=3&fs=0&cc_load_policy=0&start=0&end=0&enablejsapi=1`;
};

export const getYouTubeThumbnail = (videoId: string, quality: 'default' | 'medium' | 'high' = 'medium') => {
  const qualityMap = {
    default: 'default',
    medium: 'mqdefault',
    high: 'hqdefault'
  };
  return `https://img.youtube.com/vi/${videoId}/${qualityMap[quality]}.jpg`;
};
