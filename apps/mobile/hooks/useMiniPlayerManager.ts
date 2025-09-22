import { useEffect } from 'react';
import { usePathname } from 'expo-router';
import { useAudioPlayer } from './useAudioPlayer';
import { useMiniPlayer } from '../context/MiniPlayerContext';

export const useMiniPlayerManager = () => {
  const { isPlaying, currentTrack } = useAudioPlayer();
  const { showMiniPlayer, hideMiniPlayer } = useMiniPlayer();
  const pathname = usePathname();

  useEffect(() => {
    // Ne pas afficher le mini-player uniquement sur l'écran d'accueil principal
    const isMainHomeScreen = pathname === '/' || 
                            pathname === '/(tabs)' || 
                            pathname === '/(tabs)/' ||
                            pathname === '/(tabs)/index';
    
    if (isPlaying && currentTrack && !isMainHomeScreen) {
      showMiniPlayer();
    } else if (isMainHomeScreen) {
      hideMiniPlayer();
    }
  }, [isPlaying, currentTrack, pathname, showMiniPlayer, hideMiniPlayer]);

  return {
    isPlaying,
    currentTrack,
  };
};
