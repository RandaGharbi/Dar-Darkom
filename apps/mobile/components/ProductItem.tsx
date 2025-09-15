import React from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  Dimensions,
  TouchableOpacity,
} from "react-native";

import basket from "../assets/images/basket.png";
import { getCorrectImageUrl } from "../utils/imageUtils";

type Product = {
  id: number | string;
  title: string;
  subtitle: string;
  price: number;
  image_url: string;
};

type ProductItemProps = {
  product: Product;
  onPressBasket: () => void;
  isAddedToCart?: boolean;
};

const ProductItem: React.FC<ProductItemProps> = ({
  product,
  onPressBasket,
  isAddedToCart = false
}) => {

  // Vérifications de sécurité pour éviter les erreurs de rendu
  if (!product || !product.title || !product.price) {
    return null;
  }

  return (
    <View style={styles.card}>
      <View style={styles.imageContainer}>
        <Image
          source={{ 
            uri: getCorrectImageUrl(product.image_url) || product.image_url || 'https://via.placeholder.com/200x150/FF6B35/FFFFFF?text=Plat+Tunisien'
          }}
          style={styles.image}
          resizeMode="cover"
          onError={() => {
            console.log('❌ Image failed to load:', product.image_url);
          }}
        />

      </View>
      <Text style={styles.brand}>{product.subtitle || ''}</Text>
      <Text style={styles.name}>{product.title || ''}</Text>

      {/* Align price and basket to the right */}
      <View style={styles.bottomRow}>
        <View style={{ flex: 1 }} />
        <View style={styles.priceRow}>
          <Text style={styles.price}>€{product.price || 0}</Text>
          <TouchableOpacity onPress={onPressBasket}>
            <Image
              source={basket}
              style={[
                styles.wishlistIcon, 
                { marginLeft: 6 },
                isAddedToCart && { tintColor: '#4CAF50' }
              ]}
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
