import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Image,
  ScrollView,
  ActivityIndicator,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useAuth } from "../context/AuthContext";
import { apiService, Card } from "../services/api";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useSelectedCard } from "../context/PaymentContext";

// Images locales
import VisaIcon from "../assets/images/visa.png";
import MastercardIcon from "../assets/images/masterCard.png";
import PayPalIcon from "../assets/images/paypal.png";
import CardIcon from "../assets/images/card.png";

// Types

// Icônes dynamiques selon type
const icons = {
  Visa: VisaIcon,
  Mastercard: MastercardIcon,
  PayPal: PayPalIcon,
  Card: CardIcon,
};

const CHECK_COLOR = "#F2910D";

export default function PaymentMethodsScreen() {
  const router = useRouter();
  const { user } = useAuth();
  const [cards, setCards] = useState<Card[]>([]);
  const [loadingCards, setLoadingCards] = useState(true);
  const { selectedCardId, setSelectedCardId } = useSelectedCard();

  useEffect(() => {
    const fetchCards = async () => {
      setLoadingCards(true);
      const token = await AsyncStorage.getItem("authToken");
      if (token && user?._id) {
        const res = await apiService.getCards(token, user._id);
        if (res.success && res.data) {
          setCards(res.data);
          // Si aucune carte n'est sélectionnée et qu'il y a des cartes, sélectionner la dernière
          if (!selectedCardId && res.data.length > 0) {
            setSelectedCardId(res.data[res.data.length - 1]._id!);
          }
        } else {
          setCards([]);
        }
      }
      setLoadingCards(false);
    };
    fetchCards();
  }, [user, selectedCardId, setSelectedCardId]);

  // Helper pour logo
  const getCardLogo = (number: string) => {
    if (number.startsWith("4")) return VisaIcon;
    if (number.startsWith("5")) return MastercardIcon;
    return CardIcon;
  };

  // Toutes les cartes sont dans la section "Saved Payment Methods"
  const savedCards = cards;


  const handleGoBack = () => {
    router.back();
  };

  const handleAddCard = () => {
    router.push("/payment");
  };

  const renderSavedCard = (card: Card) => (
    <TouchableOpacity
      key={card._id}
      style={styles.item}
      onPress={() => setSelectedCardId(card._id!)}
    >
      <Image source={getCardLogo(card.cardNumber)} style={styles.icon} />
      <View style={styles.info}>
        <Text style={styles.label}>
          {card.cardNumber ? `•••• ${card.cardNumber.slice(-4)}` : "Carte"}
        </Text>
        <Text style={styles.subText}>Expires {card.expiryDate}</Text>
      </View>
      <Ionicons
        name={selectedCardId === card._id ? "checkmark-circle" : undefined}
        size={20}
        color={selectedCardId === card._id ? CHECK_COLOR : "transparent"}
      />
    </TouchableOpacity>
  );

  const renderAddMethod = (label: "Credit or Debit Card" | "PayPal") => {
    const iconSource = label === "PayPal" ? icons.PayPal : icons.Card;
    return (
      <TouchableOpacity
        key={label}
        style={[styles.item, loadingCards && styles.disabledItem]}
        onPress={
          label === "Credit or Debit Card" && !loadingCards
            ? handleAddCard
            : undefined
        }
        disabled={loadingCards}
      >
        <Image source={iconSource} style={styles.icon} />
        <Text style={[styles.label, { marginLeft: 10 }]}>{label}</Text>
        {loadingCards && label === "Credit or Debit Card" ? (
          <ActivityIndicator
            size="small"
            color="#888"
            style={{ marginLeft: "auto" }}
          />
        ) : (
          <Ionicons
            name="chevron-forward"
            size={20}
            color="#888"
            style={{ marginLeft: "auto" }}
          />
        )}
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.goBackButton} onPress={handleGoBack}>
          <Ionicons name="arrow-back" size={24} color="#000" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Payment Methods</Text>
      </View>

      {/* Content */}
      <ScrollView style={styles.content}>
        {/* Saved Payment Methods */}
        <Text style={styles.title}>Saved Payment Methods</Text>
        {loadingCards ? (
          <ActivityIndicator size="small" color="#888" />
        ) : savedCards.length > 0 ? (
          savedCards.map(renderSavedCard)
        ) : (
          <Text style={styles.subText}>Aucune carte enregistrée</Text>
        )}
        {/* Add Payment Method */}
        <Text style={styles.title}>Add Payment Method</Text>
        {renderAddMethod("Credit or Debit Card")}
        {renderAddMethod("PayPal")}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
    marginTop: 50,
    paddingHorizontal: 20,
  },
  goBackButton: {
    flexDirection: "row",
    alignItems: "center",
  },
  goBackText: {
    fontSize: 16,
    color: "#000",
    marginLeft: 6,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#000",
    marginLeft: 20,
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    marginTop: 20,
    marginBottom: 8,
  },
  item: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f9f9f9",
    borderRadius: 10,
    paddingVertical: 12,
    paddingHorizontal: 14,
    marginBottom: 8,
  },
  disabledItem: {
    opacity: 0.6,
  },
  icon: {
    width: 40,
    height: 26,
    resizeMode: "contain",
  },
  info: {
    marginLeft: 10,
    flex: 1,
  },
  label: {
    fontSize: 16,
    fontWeight: "500",
  },
  subText: {
    fontSize: 14,
    color: "#888",
    marginTop: 2,
  },
});
