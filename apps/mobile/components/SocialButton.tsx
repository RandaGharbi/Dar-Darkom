import React from 'react';
import { TouchableOpacity, Text, StyleSheet, ViewStyle, Image, ImageSourcePropType, View } from 'react-native';

type Props = {
  text: string;
  onPress: () => void;
  style?: ViewStyle;
  textStyle?: object;
  icon?: ImageSourcePropType;
};

const SocialButton: React.FC<Props> = ({ text, onPress, style, textStyle, icon }) => (
  <TouchableOpacity style={[styles.button, style]} onPress={onPress}>
    <View style={styles.contentRow}>
      {icon && <Image source={icon} style={styles.icon} />}
    <Text style={[styles.buttonText, textStyle]}>{text}</Text>
    </View>
  </TouchableOpacity>
);

const styles = StyleSheet.create({
  button: {
    backgroundColor: '#F6F4F2',
    borderRadius: 24,
    paddingVertical: 14,
    alignItems: 'center',
    marginVertical: 6,
  },
  contentRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  icon: {
    width: 22,
    height: 22,
    marginRight: 10,
    resizeMode: 'contain',
  },
  buttonText: {
    fontWeight: 'bold',
    color: '#222',
    fontSize: 16,
  },
});

export default SocialButton;