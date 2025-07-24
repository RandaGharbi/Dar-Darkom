import React from "react";
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  Image,
  Alert,
} from "react-native";
import CartItemRow from "../../components/CartItemRow";
import GoBackIcon from "../../assets/images/back.png";
import { useRouter } from "expo-router";
import { useCart } from "../../context/CartContext";
import { useAuth } from "../../context/AuthContext";
import { Swipeable } from "react-native-gesture-handler";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { API_BASE_URL } from "../../services/api";

const CartScreen: React.FC = () => {
  const { cart, updateCartItem, removeFromCart } = useCart();
  const router = useRouter();
  const { isAuthenticated } = useAuth();
  const insets = useSafeAreaInsets();

  // Redirige si non connecté
  React.useEffect(() => {
    if (!isAuthenticated) {
      router.replace("/"); // ou '/login'
    }
  }, [isAuthenticated, router]);

  const subtotal =
    cart?.items?.reduce((sum, item) => {
      const product = typeof item.productId === "object" ? item.productId : {};
      const price =
        product && "price" in product && typeof product.price === "number"
          ? product.price
          : 0;
      return sum + price * item.quantity;
    }, 0) || 0;
  const taxRate = 0.1; // 10% de taxes (modifie selon ton besoin)
  const taxes = subtotal * taxRate;
  const total = subtotal + taxes;

  // Bloc Order Summary à placer juste après la liste
  const renderOrderSummary = () => (
    <SafeAreaView style={{ backgroundColor: "transparent" }}>
      <View style={styles.orderSummaryContainer}>
        <View style={styles.divider} />
        <Text style={styles.summaryTitle}>Order Summary</Text>
        <View style={styles.summaryRow}>
          <Text style={styles.summaryLabel}>Subtotal</Text>
          <Text style={styles.summaryValue}>${subtotal.toFixed(2)}</Text>
        </View>
        <View style={styles.summaryRow}>
          <Text style={styles.summaryLabel}>Shipping</Text>
          <Text style={styles.summaryValue}>Free</Text>
        </View>
        <View style={styles.summaryRow}>
          <Text style={styles.summaryLabel}>Taxes</Text>
          <Text style={styles.summaryValue}>${taxes.toFixed(2)}</Text>
        </View>
        <View style={styles.summaryRow}>
          <Text style={[styles.summaryLabel, styles.totalText]}>Total</Text>
          <Text style={[styles.summaryValue, styles.totalText]}>
            ${total.toFixed(2)}
          </Text>
        </View>
      </View>
    </SafeAreaView>
  );

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#fff", paddingTop: 32 }}>
      {/* Header avec GoBack et titre centré */}
      <View style={styles.headerRow}>
        <TouchableOpacity
          style={styles.goBackBtn}
          onPress={() => router.back()}
        >
          <Image source={GoBackIcon} style={styles.goBackIcon} />
        </TouchableOpacity>
        <Text style={styles.title}>Cart</Text>
        <View style={{ width: 32 }} />
      </View>

      {/* Affichage conditionnel si panier vide */}
      {!cart?.items || cart.items.length === 0 ? (
        <View
          style={{
            flex: 1,
            justifyContent: "center",
            alignItems: "center",
            marginTop: 60,
          }}
        >
          <Text style={{ color: "#888", fontSize: 18, textAlign: "center" }}>
            Votre panier est vide
          </Text>
        </View>
      ) : (
        <>
          {/* Liste des produits + Order Summary juste après */}
          <FlatList
            data={cart.items}
            keyExtractor={(item, index) => {
              const product =
                typeof item.productId === "object" ? item.productId : {};
              return product &&
                "_id" in product &&
                typeof product._id === "string"
                ? product._id
                : typeof item.productId === "string"
                  ? item.productId
                  : index.toString();
            }}
            renderItem={({ item }) => {
              const product =
                typeof item.productId === "object" ? item.productId : {};
              // Correction : on récupère l'id numérique
              const id =
                product && "id" in product && typeof product.id === "number"
                  ? product.id
                  : typeof item.productId === "number"
                    ? item.productId
                    : null;
              const name =
                product && "name" in product && typeof product.name === "string"
                  ? product.name
                  : "";
              const volume =
                product &&
                "subtitle" in product &&
                typeof product.subtitle === "string"
                  ? product.subtitle
                  : "";
              const image =
                (product &&
                  "image_url" in product &&
                  typeof product.image_url === "string" &&
                  product.image_url) ||
                (product &&
                  "image" in product &&
                  typeof product.image === "string" &&
                  product.image) ||
                `${API_BASE_URL}/images/placeholder.png`;
              const price =
                product &&
                "price" in product &&
                typeof product.price === "number"
                  ? product.price
                  : 0;
              return (
                <Swipeable
                  renderRightActions={() => (
                    <TouchableOpacity
                      style={{
                        backgroundColor: "#FF4D4F",
                        justifyContent: "center",
                        alignItems: "center",
                        width: 80,
                        height: "90%",
                        borderRadius: 10,
                        marginVertical: 5,
                      }}
                      onPress={() =>
                        id !== null && Alert.alert(
                          "Confirmation",
                          "Voulez-vous vraiment supprimer ce produit du panier ?",
                          [
                            { text: "Annuler", style: "cancel" },
                            {
                              text: "Supprimer",
                              style: "destructive",
                              onPress: () => removeFromCart(id),
                            },
                          ]
                        )
                      }
                    >
                      <Text style={{ color: "white", fontWeight: "bold" }}>
                        Supprimer
                      </Text>
                    </TouchableOpacity>
                  )}
                >
                  <CartItemRow
                    item={{
                      id,
                      name,
                      volume,
                      image,
                      price,
                      quantity: item.quantity,
                    }}
                    onChangeQuantity={(delta) =>
                      id !== null && updateCartItem(id, item.quantity + delta)
                    }
                    onDelete={() =>
                      id !== null && Alert.alert(
                        "Confirmation",
                        "Voulez-vous vraiment supprimer ce produit du panier ?",
                        [
                          { text: "Annuler", style: "cancel" },
                          {
                            text: "Supprimer",
                            style: "destructive",
                            onPress: () => removeFromCart(id),
                          },
                        ]
                      )
                    }
                  />
                </Swipeable>
              );
            }}
            style={{ marginTop: 8 }}
            ItemSeparatorComponent={() => <View style={styles.itemSeparator} />}
            ListFooterComponent={renderOrderSummary}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{ paddingBottom: 120 }}
          />

          {/* Bouton Checkout flottant en bas */}
          <SafeAreaView
            style={{
              position: "absolute",
              left: 0,
              right: 0,
              bottom: 0,
              backgroundColor: "#fff",
              padding: 16,
              borderTopLeftRadius: 18,
              borderTopRightRadius: 18,
              shadowColor: "#000",
              shadowOpacity: 0.08,
              shadowRadius: 8,
              elevation: 8,
              paddingBottom: (insets.bottom || 0) + 70,
            }}
          >
            <TouchableOpacity
              style={{
                backgroundColor: "#ED9626",
                borderRadius: 24,
                paddingVertical: 13,
                alignItems: "center",
                justifyContent: "center",
                width: "100%",
              }}
              onPress={() => router.push("/checkout")}
            >
              <Text style={{ color: "#000", fontWeight: "bold", fontSize: 18 }}>
                Checkout
              </Text>
            </TouchableOpacity>
          </SafeAreaView>
        </>
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    paddingHorizontal: 20,
    paddingTop: 0,
  },
  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: 8,
    marginBottom: 8,
  },
  goBackBtn: {
    width: 32,
    height: 32,
    justifyContent: "center",
    alignItems: "center",
  },
  goBackIcon: {
    width: 20,
    height: 20,
    resizeMode: "contain",
    tintColor: "#000",
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    textAlign: "center",
    flex: 1,
  },
  itemSeparator: {
    height: 1,
    backgroundColor: "#F2F2F2",
    marginVertical: 2,
  },
  divider: {
    height: 1,
    backgroundColor: "#E5E5E5",
    marginVertical: 16,
  },
  orderSummaryContainer: {
    marginTop: 0,
    marginBottom: 0,
    paddingBottom: 0,
    paddingHorizontal: 17,
  },
  summaryTitle: { fontWeight: "bold", fontSize: 16, marginBottom: 8 },
  summaryRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginVertical: 10,
  },
  summaryLabel: {
    fontSize: 12,
    color: "#8A7861",
  },
  summaryValue: {
    fontSize: 13,
    color: "#222",
  },
  totalText: { fontSize: 13 },
  checkoutButton: {
    position: "absolute",
    left: 20,
    right: 20,
    backgroundColor: "#ED9626",
    borderRadius: 24,
    paddingVertical: 16,
    alignItems: "center",
    elevation: 2,
  },
  checkoutButtonText: {
    color: "#000",
    fontWeight: "bold",
    fontSize: 18,
  },
});
export default CartScreen;
