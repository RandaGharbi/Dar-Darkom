// Utilitaires pour YouTube

export const getYouTubeThumbnail = (videoId: string, quality: 'default' | 'medium' | 'high' = 'medium'): string => {
  const qualityMap = {
    default: 'default',
    medium: 'mqdefault',
    high: 'hqdefault'
  };
  return `https://img.youtube.com/vi/${videoId}/${qualityMap[quality]}.jpg`;
};

export const getYouTubeEmbedUrl = (videoId: string, autoplay: boolean = false): string => {
  return `https://www.youtube.com/embed/${videoId}?autoplay=${autoplay ? 1 : 0}&loop=1&playlist=${videoId}&controls=0&showinfo=0&rel=0&modestbranding=1&iv_load_policy=3&fs=0&cc_load_policy=0&start=0&end=0&enablejsapi=1`;
};

export const getYouTubeWatchUrl = (videoId: string): string => {
  return `https://www.youtube.com/watch?v=${videoId}`;
};

export const extractYouTubeId = (url: string): string | null => {
  const regex = /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/;
  const match = url.match(regex);
  return match ? match[1] : null;
};

export const isValidYouTubeId = (videoId: string): boolean => {
  return /^[a-zA-Z0-9_-]{11}$/.test(videoId);
};
