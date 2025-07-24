import React from "react";
import { View, Text, Image, TouchableOpacity, StyleSheet } from "react-native";

type CartItem = {
  id: string | number;
  name: string;
  volume: string;
  image: string;
  price: number;
  quantity: number;
};

type Props = {
  item: CartItem;
  onChangeQuantity: (delta: number) => void;
  onDelete?: () => void;
};

const CartItemRow: React.FC<Props> = ({ item, onChangeQuantity, onDelete }) => (
  <View style={styles.itemRow}>
    <Image source={{ uri: item.image }} style={styles.image} />
    <View style={{ flex: 1 }}>
      <Text style={styles.itemName}>{item.name}</Text>
      <Text style={styles.itemVolume}>{item.volume}</Text>
    </View>
    <View style={styles.quantityContainer}>
      <TouchableOpacity
        onPress={() => {
          if (item.quantity === 1 && onDelete) {
            onDelete();
          } else {
            onChangeQuantity(-1);
          }
        }}
        style={styles.qtyBtn}
      >
        <Text style={styles.qtyBtnText}>-</Text>
      </TouchableOpacity>
      <Text style={styles.qtyText}>{item.quantity}</Text>
      <TouchableOpacity
        onPress={() => onChangeQuantity(1)}
        style={styles.qtyBtn}
      >
        <Text style={styles.qtyBtnText}>+</Text>
      </TouchableOpacity>
    </View>
  </View>
);

const styles = StyleSheet.create({
  itemRow: { flexDirection: "row", alignItems: "center", marginVertical: 8, paddingHorizontal: 10 },
  image: { width: 40, height: 40, borderRadius: 8, marginRight: 12 },
  itemName: {},
  itemVolume: { color: "#8A7861", fontSize: 12 },
  quantityContainer: { flexDirection: "row", alignItems: "center" },
  qtyBtn: {
    backgroundColor: "#eee",
    borderRadius: 16,
    padding: 6,
    marginHorizontal: 4,
  },
  qtyBtnText: { fontSize: 13, fontWeight: "bold" },
  qtyText: { minWidth: 24, textAlign: "center" },
});

export default CartItemRow;
