// src/screens/HelpCenterScreen.tsx
import React from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Image,
} from "react-native";
import FAQItem from "../components/FAQItem";
import { FAQItemType } from "../constants/types";
import { useRouter } from 'expo-router';
import aboutIcon from "../assets/images/about.png";
import shippingIcon from "../assets/images/shipping.png";
import returnsIcon from "../assets/images/returns.png";
import contactIcon from "../assets/images/contact.png";
import goBackIcon from '../assets/images/back.png';

const faqData: FAQItemType[] = [
  {
    title: "About Our Products",
    subtitle: "Learn about our ingredients, sourcing, and production process.",
    icon: aboutIcon,
  },
  {
    title: "Orders & Shipping",
    subtitle: "Find answers to common questions about ordering and shipping.",
    icon: shippingIcon,
  },
  {
    title: "Returns & Exchanges",
    subtitle: "Get help with returns, exchanges, and refunds.",
    icon: returnsIcon,
  },
  {
    title: "Contact Us",
    subtitle: "Contact our support team for personalized assistance.",
    icon: contactIcon,
  },
];

const HelpCenterScreen = () => {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <View style={styles.headerContainer}>
        <TouchableOpacity
          style={styles.goBackButton}
          onPress={() => router.back()}
        >
          <Image source={goBackIcon} style={styles.goBackIcon} />
        </TouchableOpacity>

        <Text style={styles.header}>Help Center</Text>

        {/* Espace vide à droite pour équilibrer */}
        <View style={styles.goBackButton} />
      </View>

      <Text style={styles.title}>Frequently Asked Questions</Text>

      <FlatList
        data={faqData}
        keyExtractor={(item) => item.title}
        renderItem={({ item }) => <FAQItem item={item} />}
        contentContainerStyle={{ paddingBottom: 20 }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 60,
    paddingHorizontal: 20,
    backgroundColor: "#fff",
  },
  headerContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between", // bouton à gauche, titre centré, espace droite
    marginBottom: 10,
    position: 'relative',
  },
  goBackButton: {
    padding: 8,
    width: 40,
  },
  goBackIcon: {
    width: 24,
    height: 24,
    tintColor: "black",
    resizeMode: "contain",
  },
  header: {
    fontWeight: "bold",
    fontSize: 18,
    textAlign: "center",
    flex: 1,
  },
  title: {
    fontSize: 20,
    fontWeight: "700",
    marginBottom: 24,
    textAlign: "center",
  },
});

export default HelpCenterScreen;
