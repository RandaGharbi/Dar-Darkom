import React, { useCallback } from "react";
import { ScrollView, StyleSheet } from "react-native";
import Header from "../../components/Header";
import TodaysSpecial from "../../components/TodaysSpecial";
import CategoriesGrid from "../../components/CategoriesGrid";
import SafeAreaWrapper from "../../components/SafeAreaWrapper";
// MiniAudioPlayer supprimé - intégré dans Today's Special

export default function App() {
  const onLayoutRootView = useCallback(() => {
    // Plus besoin de gérer le splash ici
  }, []);

  return (
    <SafeAreaWrapper 
      backgroundColor="#fff"
      edges={['top']} // Exclure le bottom car la tab bar gère déjà les safe areas
    >
      <Header />
      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.scrollContent}
        onLayout={onLayoutRootView}
        showsVerticalScrollIndicator={false}
      >
        <TodaysSpecial />
        <CategoriesGrid />
      </ScrollView>
    </SafeAreaWrapper>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#fff",
    flex: 1,
  },
  scrollContent: {
    paddingTop: 140, // Espace pour le header fixe + safe area
    paddingBottom: 100, // Espace pour la tabbar + marge de sécurité
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  errorText: {
    fontSize: 16,
    color: '#FF3B30',
    textAlign: 'center',
  },
});
