import React, { createContext, useContext, useState, ReactNode } from 'react';

interface MiniPlayerContextType {
  isVisible: boolean;
  showMiniPlayer: () => void;
  hideMiniPlayer: () => void;
  toggleMiniPlayer: () => void;
}

const MiniPlayerContext = createContext<MiniPlayerContextType | undefined>(undefined);

interface MiniPlayerProviderProps {
  children: ReactNode;
}

export const MiniPlayerProvider: React.FC<MiniPlayerProviderProps> = ({ children }) => {
  const [isVisible, setIsVisible] = useState(false);

  const showMiniPlayer = () => {
    setIsVisible(true);
  };

  const hideMiniPlayer = () => {
    setIsVisible(false);
  };

  const toggleMiniPlayer = () => {
    setIsVisible(prev => !prev);
  };

  return (
    <MiniPlayerContext.Provider
      value={{
        isVisible,
        showMiniPlayer,
        hideMiniPlayer,
        toggleMiniPlayer,
      }}
    >
      {children}
    </MiniPlayerContext.Provider>
  );
};

export const useMiniPlayer = (): MiniPlayerContextType => {
  const context = useContext(MiniPlayerContext);
  if (context === undefined) {
    throw new Error('useMiniPlayer must be used within a MiniPlayerProvider');
  }
  return context;
};
