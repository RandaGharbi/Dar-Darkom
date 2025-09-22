import React, { useState, useEffect, useCallback } from "react";
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
import { useRouter, useFocusEffect } from "expo-router";
import { useAuth } from "../context/AuthContext";
import { useSafeNavigation } from "../hooks/useSafeNavigation";
import { apiService, Card } from "../services/api";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useSelectedCard } from "../context/PaymentContext";
import SafeAreaWrapper from "../components/SafeAreaWrapper";

// Images locales
import VisaIcon from "../assets/images/visa.png";
import MastercardIcon from "../assets/images/masterCard.png";
import CardIcon from "../assets/images/card.png";

export default function PaymentMethodsScreen() {
  const router = useRouter();
  const { user } = useAuth();
  const { safeBack } = useSafeNavigation();
  const [cards, setCards] = useState<Card[]>([]);
  const [loadingCards, setLoadingCards] = useState(true);
  const { selectedCardId, setSelectedCardId } = useSelectedCard();

  const fetchCards = useCallback(async () => {
    console.log('🔄 fetchCards appelé');
    setLoadingCards(true);
    const token = await AsyncStorage.getItem("authToken");
    console.log('🔑 Token:', token ? 'présent' : 'manquant');
    console.log('👤 User ID:', user?._id);
    
    if (token && user?._id) {
      try {
        const res = await apiService.getCards(token, user._id);
        console.log('📡 Réponse API getCards:', res);
        
        if (res.success && res.data) {
          console.log('✅ Cartes récupérées:', res.data);
          setCards(res.data);
          // Si aucune carte n'est sélectionnée et qu'il y a des cartes, sélectionner la dernière
          if (!selectedCardId && res.data.length > 0) {
            setSelectedCardId(res.data[res.data.length - 1]._id!);
          }
        } else {
          console.log('❌ Aucune carte trouvée ou erreur API');
          setCards([]);
        }
      } catch (error) {
        console.error('❌ Erreur lors de la récupération des cartes:', error);
        setCards([]);
      }
    } else {
      console.log('❌ Token ou user ID manquant');
      setCards([]);
    }
    setLoadingCards(false);
  }, [user, selectedCardId, setSelectedCardId]);

  useEffect(() => {
    fetchCards();
  }, [fetchCards]);

  // Recharger les cartes à chaque fois que l'écran devient actif
  useFocusEffect(
    useCallback(() => {
      fetchCards();
    }, [fetchCards])
  );

  // Helper pour logo
  const getCardLogo = (number: string) => {
    if (number.startsWith("4")) return VisaIcon;
    if (number.startsWith("5")) return MastercardIcon;
    return CardIcon;
  };

  const handleGoBack = () => {
    safeBack();
  };

  const handleAddCard = () => {
    router.push("/payment");
  };

  const renderSavedCard = (card: Card, index: number) => (
    <TouchableOpacity
      key={card._id}
      style={[
        styles.cardItem,
        selectedCardId === card._id && styles.selectedCard,
        index === cards.length - 1 && styles.lastCardItem
      ]}
      onPress={() => setSelectedCardId(card._id!)}
    >
      <Image source={getCardLogo(card.cardNumber)} style={styles.cardIcon} />
      <View style={styles.cardInfo}>
        <Text style={styles.cardNumber}>
          {card.cardNumber ? `•••• ${card.cardNumber.slice(-4)}` : "Carte"}
        </Text>
        <Text style={styles.cardExpiry}>Expire le {card.expiryDate}</Text>
      </View>
      {selectedCardId === card._id && (
        <Ionicons name="checkmark" size={20} color="#007AFF" />
      )}
    </TouchableOpacity>
  );

  const renderAddMethod = () => {
    return (
      <TouchableOpacity
        style={styles.addCardButton}
        onPress={!loadingCards ? handleAddCard : undefined}
        disabled={loadingCards}
      >
        <View style={styles.addCardIcon}>
          <Ionicons name="add" size={20} color="#007AFF" />
        </View>
        <View style={styles.addCardText}>
          <Text style={styles.addCardTitle}>Ajouter une carte</Text>
          <Text style={styles.addCardSubtitle}>Carte de crédit ou de débit</Text>
        </View>
        {loadingCards ? (
          <ActivityIndicator size="small" color="#007AFF" />
        ) : (
          <Ionicons name="chevron-forward" size={16} color="#C7C7CC" />
        )}
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaWrapper backgroundColor="#f5f5f5" edges={['top']}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={handleGoBack}>
          <Ionicons name="arrow-back" size={24} color="#000" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Méthodes de paiement</Text>
        <View style={styles.headerSpacer} />
      </View>

      {/* Content */}
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Saved Payment Methods */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>CARTES ENREGISTRÉES</Text>
          
          {loadingCards ? (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="small" color="#007AFF" />
              <Text style={styles.loadingText}>Chargement des cartes...</Text>
            </View>
          ) : cards.length > 0 ? (
            <View style={styles.cardsContainer}>
              {cards.map(renderSavedCard)}
            </View>
          ) : (
            <View style={styles.emptyState}>
              <Ionicons name="card-outline" size={48} color="#8E8E93" />
              <Text style={styles.emptyStateTitle}>Aucune carte enregistrée</Text>
              <Text style={styles.emptyStateSubtitle}>
                Ajoutez votre première carte pour faciliter vos achats
              </Text>
            </View>
          )}
        </View>

        {/* Add Payment Method */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>AJOUTER UNE MÉTHODE</Text>
          <View style={styles.addMethodContainer}>
            {renderAddMethod()}
          </View>
        </View>
      </ScrollView>
    </SafeAreaWrapper>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: "#fff",
  },
  backButton: {
    padding: 8,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#000",
    textAlign: "center",
  },
  headerSpacer: {
    width: 40,
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
  },
  section: {
    marginTop: 24,
  },
  sectionTitle: {
    fontSize: 13,
    fontWeight: "600",
    color: "#8E8E93",
    marginBottom: 8,
    letterSpacing: 0.5,
  },
  cardsContainer: {
    backgroundColor: "#fff",
    borderRadius: 12,
    overflow: "hidden",
  },
  cardItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 16,
    paddingHorizontal: 16,
    borderBottomWidth: 0.5,
    borderBottomColor: "#E5E5EA",
  },
  lastCardItem: {
    borderBottomWidth: 0,
  },
  selectedCard: {
    backgroundColor: "#F2F2F7",
  },
  cardIcon: {
    width: 32,
    height: 20,
    resizeMode: "contain",
  },
  cardInfo: {
    flex: 1,
    marginLeft: 12,
  },
  cardNumber: {
    fontSize: 16,
    fontWeight: "500",
    color: "#000",
    marginBottom: 2,
  },
  cardExpiry: {
    fontSize: 14,
    color: "#8E8E93",
  },
  addMethodContainer: {
    backgroundColor: "#fff",
    borderRadius: 12,
    overflow: "hidden",
  },
  addCardButton: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 16,
    paddingHorizontal: 16,
  },
  addCardIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: "#E3F2FD",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  addCardText: {
    flex: 1,
  },
  addCardTitle: {
    fontSize: 16,
    fontWeight: "500",
    color: "#000",
    marginBottom: 2,
  },
  addCardSubtitle: {
    fontSize: 14,
    color: "#8E8E93",
  },
  loadingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 20,
    backgroundColor: "#fff",
    borderRadius: 12,
  },
  loadingText: {
    fontSize: 14,
    color: "#8E8E93",
    marginLeft: 8,
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: 40,
    paddingHorizontal: 20,
    backgroundColor: "#fff",
    borderRadius: 12,
  },
  emptyStateTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: "#000",
    marginTop: 16,
    marginBottom: 8,
  },
  emptyStateSubtitle: {
    fontSize: 14,
    color: "#8E8E93",
    textAlign: 'center',
    lineHeight: 20,
  },
});