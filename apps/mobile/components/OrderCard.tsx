import React from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
  ImageSourcePropType,
} from 'react-native';
import ChevronIcon from '../assets/images/chevron.png';
import { StatusBadge } from './StatusBadge';

type Props = {
  image: ImageSourcePropType;
  orderNumber: string;
  date: string;
  total: string;
  status?: string;
  onPress: () => void;
};

export const OrderCard: React.FC<Props> = ({
  image,
  orderNumber,
  date,
  total,
  status = 'active',
  onPress,
}) => {
  return (
    <TouchableOpacity style={styles.container} onPress={onPress} activeOpacity={0.7}>
      <Image source={image} style={styles.image} />
      <View style={styles.details}>
        <Text style={styles.orderNumber}>Order number: {orderNumber}</Text>
        <Text style={styles.orderMeta}>Order date: {date}</Text>
        <Text style={styles.orderMeta}>Total: {total}</Text>
        {/* Badge de statut */}
        <StatusBadge status={status} size="small" />
      </View>
      <Image source={ChevronIcon} style={styles.chevron} />
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 20,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
  image: {
    width: 60,
    height: 60,
    borderRadius: 8,
    marginRight: 14,
  },
  details: {
    flex: 1,
  },
  orderNumber: {
    fontWeight: '600',
    fontSize: 14,
    marginBottom: 2,
  },
  orderMeta: {
    fontSize: 13,
    color: '#555',
    marginTop: 1,
  },
  chevron: {
    width: 15,
    height: 18,
    tintColor: '#000',
    resizeMode: 'contain',
  },
});
