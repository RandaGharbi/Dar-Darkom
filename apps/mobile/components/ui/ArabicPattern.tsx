import React from 'react';
import { View, StyleSheet } from 'react-native';
import { OrientalColors } from '../../constants/Colors';

interface ArabicPatternProps {
  type?: 'geometric' | 'floral' | 'border' | 'separator';
  size?: 'small' | 'medium' | 'large';
  color?: string;
  style?: any;
}

/**
 * Composant de motif arabe décoratif
 * Inspiré de l'art islamique et de l'architecture arabe
 */
export default function ArabicPattern({ 
  type = 'geometric', 
  size = 'medium', 
  color = OrientalColors.primary,
  style 
}: ArabicPatternProps) {
  
  const getPatternStyle = () => {
    switch (type) {
      case 'geometric':
        return styles.geometric;
      case 'floral':
        return styles.floral;
      case 'border':
        return styles.border;
      case 'separator':
        return styles.separator;
      default:
        return styles.geometric;
    }
  };

  const getSizeStyle = () => {
    switch (size) {
      case 'small':
        return styles.small;
      case 'large':
        return styles.large;
      default:
        return styles.medium;
    }
  };

  return (
    <View style={[styles.container, getPatternStyle(), getSizeStyle(), style]}>
      {/* Motif géométrique - forme d'étoile à 8 branches */}
      {type === 'geometric' && (
        <View style={[styles.star, { borderColor: color }]}>
          <View style={[styles.starInner, { backgroundColor: color }]} />
        </View>
      )}
      
      {/* Motif floral - fleur stylisée */}
      {type === 'floral' && (
        <View style={styles.flower}>
          {[...Array(6)].map((_, index) => (
            <View
              key={index}
              style={[
                styles.petal,
                { backgroundColor: color },
                { transform: [{ rotate: `${index * 60}deg` }] }
              ]}
            />
          ))}
          <View style={[styles.flowerCenter, { backgroundColor: color }]} />
        </View>
      )}
      
      {/* Bordure décorative */}
      {type === 'border' && (
        <View style={styles.borderPattern}>
          {[...Array(8)].map((_, index) => (
            <View
              key={index}
              style={[
                styles.borderDot,
                { backgroundColor: color },
                { transform: [{ rotate: `${index * 45}deg` }] }
              ]}
            />
          ))}
        </View>
      )}
      
      {/* Séparateur décoratif */}
      {type === 'separator' && (
        <View style={styles.separatorPattern}>
          <View style={[styles.separatorLine, { backgroundColor: color }]} />
          <View style={[styles.separatorDot, { backgroundColor: color }]} />
          <View style={[styles.separatorLine, { backgroundColor: color }]} />
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  
  // Motif géométrique - étoile à 8 branches
  geometric: {
    width: 40,
    height: 40,
  },
  
  star: {
    width: 40,
    height: 40,
    borderWidth: 2,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  
  starInner: {
    width: 20,
    height: 20,
    borderRadius: 10,
  },
  
  // Motif floral
  floral: {
    width: 50,
    height: 50,
    alignItems: 'center',
    justifyContent: 'center',
  },
  
  flower: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  
  petal: {
    position: 'absolute',
    width: 8,
    height: 20,
    borderRadius: 4,
  },
  
  flowerCenter: {
    width: 12,
    height: 12,
    borderRadius: 6,
  },
  
  // Bordure décorative
  border: {
    width: 60,
    height: 60,
    alignItems: 'center',
    justifyContent: 'center',
  },
  
  borderPattern: {
    width: 50,
    height: 50,
    alignItems: 'center',
    justifyContent: 'center',
  },
  
  borderDot: {
    position: 'absolute',
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  
  // Séparateur décoratif
  separator: {
    width: 80,
    height: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  
  separatorPattern: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
  },
  
  separatorLine: {
    width: 30,
    height: 2,
    borderRadius: 1,
  },
  
  separatorDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  
  // Tailles
  small: {
    transform: [{ scale: 0.7 }],
  },
  
  medium: {
    transform: [{ scale: 1 }],
  },
  
  large: {
    transform: [{ scale: 1.3 }],
  },
});
