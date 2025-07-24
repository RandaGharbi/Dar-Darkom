// src/components/FAQItem.tsx
import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { FAQItemType } from '../constants/types';

type Props = {
  item: FAQItemType;
  onPress?: () => void;
};

const FAQItem: React.FC<Props> = ({ item, onPress }) => (
  <TouchableOpacity style={styles.container} onPress={onPress}>
    <View style={styles.iconWrapper}>
      <Image source={item.icon} style={styles.icon} resizeMode="contain" />
    </View>
    <View style={{ flex: 1 }}>
      <Text style={styles.title}>{item.title}</Text>
      <Text style={styles.subtitle}>{item.subtitle}</Text>
    </View>
  </TouchableOpacity>
);

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    paddingVertical: 16,
    alignItems: 'center',
  },
  iconWrapper: {
    backgroundColor: '#f3f3f3',
    borderRadius: 8,
    padding: 10,
    marginRight: 12,
  },
  icon: {
    width: 24,
    height: 24,
  },
  title: {
    fontWeight: '600',
    fontSize: 16,
  },
  subtitle: {
    color: '#777',
    fontSize: 14,
  },
});

export default FAQItem;
