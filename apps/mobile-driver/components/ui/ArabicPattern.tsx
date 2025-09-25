import React from 'react';
import { View, StyleSheet } from 'react-native';
import Svg, { Path, Circle, Polygon } from 'react-native-svg';
import { OrientalColors } from '../../constants/Colors';

interface ArabicPatternProps {
  type: 'geometric' | 'floral' | 'border' | 'separator';
  size?: 'small' | 'medium' | 'large';
  color?: string;
  style?: any;
}

const ArabicPattern: React.FC<ArabicPatternProps> = ({
  type,
  size = 'medium',
  color = OrientalColors.primary,
  style,
}) => {
  const getSize = () => {
    switch (size) {
      case 'small': return 16;
      case 'medium': return 24;
      case 'large': return 32;
      default: return 24;
    }
  };

  const patternSize = getSize();

  const renderGeometric = () => (
    <Svg width={patternSize} height={patternSize} viewBox="0 0 24 24">
      <Path
        d="M12 2L15.09 8.26L22 9L17 14L18.18 21L12 17.77L5.82 21L7 14L2 9L8.91 8.26L12 2Z"
        fill={color}
        stroke={color}
        strokeWidth="0.5"
      />
    </Svg>
  );

  const renderFloral = () => (
    <Svg width={patternSize} height={patternSize} viewBox="0 0 24 24">
      <Circle cx="12" cy="12" r="3" fill={color} />
      <Path
        d="M12 2C12 2 8 6 8 12C8 18 12 22 12 22C12 22 16 18 16 12C16 6 12 2 12 2Z"
        fill="none"
        stroke={color}
        strokeWidth="1.5"
      />
      <Path
        d="M2 12C2 12 6 8 12 8C18 8 22 12 22 12C22 12 18 16 12 16C6 16 2 12 2 12Z"
        fill="none"
        stroke={color}
        strokeWidth="1.5"
      />
    </Svg>
  );

  const renderBorder = () => (
    <Svg width={patternSize} height={patternSize} viewBox="0 0 24 24">
      <Circle cx="4" cy="4" r="1" fill={color} />
      <Circle cx="12" cy="4" r="1" fill={color} />
      <Circle cx="20" cy="4" r="1" fill={color} />
      <Circle cx="4" cy="12" r="1" fill={color} />
      <Circle cx="20" cy="12" r="1" fill={color} />
      <Circle cx="4" cy="20" r="1" fill={color} />
      <Circle cx="12" cy="20" r="1" fill={color} />
      <Circle cx="20" cy="20" r="1" fill={color} />
    </Svg>
  );

  const renderSeparator = () => (
    <Svg width={patternSize} height={patternSize} viewBox="0 0 24 24">
      <Path
        d="M2 12H22M6 8L8 12L6 16M18 8L16 12L18 16"
        fill="none"
        stroke={color}
        strokeWidth="2"
        strokeLinecap="round"
      />
    </Svg>
  );

  const renderPattern = () => {
    switch (type) {
      case 'geometric':
        return renderGeometric();
      case 'floral':
        return renderFloral();
      case 'border':
        return renderBorder();
      case 'separator':
        return renderSeparator();
      default:
        return renderGeometric();
    }
  };

  return (
    <View style={[styles.container, style]}>
      {renderPattern()}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default ArabicPattern;