import React from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  Dimensions,
  TouchableOpacity,
} from "react-native";
import favoritesIconInactive from "../assets/images/inactiveFavorites.png";
import favoritesIconActive from "../assets/images/activeFavorites.png";
import basket from "../assets/images/basket.png";

type Product = {
  id: number;
  title: string;
  subtitle: string;
  price: number;
  image_url: string;
};

type ProductItemProps = {
  product: Product;
  isFavorite: boolean;
  onToggleFavorite: () => void;
  onPressBasket: () => void;
};

const ProductItem: React.FC<ProductItemProps> = ({
  product,
  isFavorite,
  onToggleFavorite,
  onPressBasket
}) => {

  return (
    <View style={styles.card}>
      <View style={styles.imageContainer}>
        <Image
          source={{ uri: product.image_url }}
          style={styles.image}
          resizeMode="cover"
        />
        <TouchableOpacity style={styles.heartIcon} onPress={onToggleFavorite}>
          <Image
            source={isFavorite ? favoritesIconActive : favoritesIconInactive}
            style={styles.wishlistIcon}
          />
        </TouchableOpacity>
      </View>
      <Text style={styles.brand}>{product.subtitle}</Text>
      <Text style={styles.name}>{product.title}</Text>

      {/* Align price and basket to the right */}
      <View style={styles.bottomRow}>
        <View style={{ flex: 1 }} />
        <View style={styles.priceRow}>
          <Text style={styles.price}>${product.price}</Text>
          <TouchableOpacity onPress={onPressBasket}>
            <Image
              source={basket}
              style={[styles.wishlistIcon, { marginLeft: 6 }]}
            />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

const { width } = Dimensions.get("window");
const cardWidth = (width - 48) / 2;

const styles = StyleSheet.create({
  card: {
    width: cardWidth,
    marginBottom: 20,
  },
  imageContainer: {
    position: "relative",
  },
  image: {
    width: "100%",
    height: cardWidth * 1.2,
    borderRadius: 12,
    marginBottom: 8,
  },
  heartIcon: {
    position: "absolute",
    top: 8,
    right: 8,
    padding: 4, // plus de background ici
  },
  wishlistIcon: {
    width: 14,
    height: 14,
    tintColor: "black",
    resizeMode: "contain",
  },
  name: {
    fontSize: 12,
    fontWeight: "500",
    textTransform: "capitalize",
  },
  brand: {
    fontSize: 9,
    color: "#827869",
  },
  bottomRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 4,
  },
  priceRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  price: {
    fontSize: 10,
    color: "#827869",
  },
});

export default ProductItem;
