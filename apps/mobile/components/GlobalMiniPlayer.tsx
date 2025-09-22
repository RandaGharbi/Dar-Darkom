import React from 'react';
import { MiniAudioPlayer } from './MiniAudioPlayer';
import { useMiniPlayer } from '../context/MiniPlayerContext';
import { useMiniPlayerManager } from '../hooks/useMiniPlayerManager';

export const GlobalMiniPlayer: React.FC = () => {
  const { isVisible, hideMiniPlayer } = useMiniPlayer();
  
  // Gérer automatiquement l'affichage du mini-player
  useMiniPlayerManager();

  return (
    <MiniAudioPlayer
      visible={isVisible}
      onClose={hideMiniPlayer}
    />
  );
};
