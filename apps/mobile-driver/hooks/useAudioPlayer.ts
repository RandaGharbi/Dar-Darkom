import { useState, useEffect, useCallback } from 'react';
import { audioService, AudioState } from '../services/audioService';

export const useAudioPlayer = () => {
  const [audioState, setAudioState] = useState<AudioState>(audioService.getState());

  useEffect(() => {
    const unsubscribe = audioService.subscribe(setAudioState);
    return unsubscribe;
  }, []);

  const playTrack = useCallback((trackId: string) => {
    audioService.playTrack(trackId);
  }, []);

  const togglePlayPause = useCallback(() => {
    audioService.togglePlayPause();
  }, []);

  const stop = useCallback(() => {
    audioService.stop();
  }, []);

  const setVolume = useCallback((volume: number) => {
    audioService.setVolume(volume);
  }, []);

  const seekTo = useCallback((positionMillis: number) => {
    audioService.seekTo(positionMillis);
  }, []);

  const getTracksByCategory = useCallback((category: string) => {
    return audioService.getTracksByCategory(category);
  }, []);

  const getAllTracks = useCallback(() => {
    return audioService.getAllTracks();
  }, []);

  return {
    ...audioState,
    playTrack,
    togglePlayPause,
    stop,
    setVolume,
    seekTo,
    getTracksByCategory,
    getAllTracks,
  };
};
