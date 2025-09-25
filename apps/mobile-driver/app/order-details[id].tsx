import { useLocalSearchParams } from 'expo-router';
import { View, Text } from 'react-native';

export default function OrderDetails() {
  const { id } = useLocalSearchParams();

  return (
    <View>
      <Text>Details for Order #{id}</Text>
    </View>
  );
}
