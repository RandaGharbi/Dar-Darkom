import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  Platform,
  Image,
} from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useSafeNavigation } from "../hooks/useSafeNavigation";
import { useAuth } from "../context/AuthContext";
import { useOrder } from "../context/OrderContext";
import { StatusBar } from "expo-status-bar";

export default function OrderReceivedScreen() {
  const router = useRouter();
  const { user } = useAuth();
  const { safeBack } = useSafeNavigation();
  const { lastOrder } = useOrder();
  const params = useLocalSearchParams();

  // Si pas de commande, fallback sur panier (pour dev)
  const order = params.order ? JSON.parse(params.order as string) : lastOrder;

  // Si pas de commande, afficher un message d'erreur
  if (!order) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.errorContainer}>
          <Text style={styles.errorTitle}>Aucune commande trouvée</Text>
          <Text style={styles.errorMessage}>
            Il semble qu&apos;aucune commande n&apos;ait été trouvée. Veuillez retourner à l&apos;écran précédent.
          </Text>
          <TouchableOpacity style={styles.retryButton} onPress={safeBack}>
            <Text style={styles.retryButtonText}>Retour</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="dark" />
      
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={safeBack} style={styles.closeButton}>
          <Text style={styles.closeButtonText}>✕</Text>
        </TouchableOpacity>
        <View style={styles.headerRight}>
          <TouchableOpacity style={styles.shareButton}>
            <Text style={styles.shareButtonText}>↗</Text>
          </TouchableOpacity>
          <TouchableOpacity>
            <Text style={styles.helpText}>Help</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Main Content */}
      <View style={styles.content}>
        {/* Title Section */}
        <View style={styles.titleSection}>
          <Text style={styles.title}>Order received</Text>
          <Text style={styles.estimatedTime}>Estimated arrival 12:05-12:25</Text>
        </View>

        {/* Products Section - Reproduire exactement la maquette */}
        <View style={styles.productsSection}>
          <View style={styles.productsContainer}>
            {/* Produit 1 - En haut à gauche (bouteille violette) */}
            <View style={[styles.productItem, { top: 0, left: 40 }]}>
              <View style={[styles.productCard, { backgroundColor: '#8A2BE2' }]}>
                <View style={styles.bottleShape}>
                  <View style={styles.bottleNeck} />
                  <View style={styles.bottleBody} />
                  <View style={styles.bottleCap} />
                </View>
              </View>
            </View>
            
            {/* Produit 2 - En bas au centre (boîte café marron) */}
            <View style={[styles.productItem, { bottom: 0, left: 120 }]}>
              <View style={[styles.productCard, { backgroundColor: '#8B4513' }]}>
                <View style={styles.coffeeBox}>
                  <View style={styles.coffeeLid} />
                  <View style={styles.coffeeBody} />
                  <View style={styles.coffeeHandle} />
                </View>
              </View>
            </View>
            
            {/* Produit 3 - À droite au milieu (jus orange) */}
            <View style={[styles.productItem, { top: 30, right: 40 }]}>
              <View style={[styles.productCard, { backgroundColor: '#FFA500' }]}>
                <View style={styles.juiceBottle}>
                  <View style={styles.juiceBody} />
                  <View style={styles.juiceLabel} />
                </View>
              </View>
            </View>
          </View>
        </View>

        {/* Bottom Section */}
        <View style={styles.bottomSection}>
          {/* Help Section */}
          <View style={styles.helpSection}>
            <View style={styles.helpHeader}>
              <View style={styles.avatarContainer}>
                <Image 
                  source={{ uri: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=40&h=40&fit=crop&crop=face' }}
                  style={styles.avatar}
                />
              </View>
              <Text style={styles.helpTitle}>Need help?</Text>
            </View>
            <Text style={styles.helpDescription}>
              Shop staff will deliver your order, so order tracking isn't as detailed. You can call the shop for more information about your delivery.
            </Text>
          </View>

          {/* Call Store Button */}
          <TouchableOpacity style={styles.callButton}>
            <Text style={styles.callButtonIcon}>📞</Text>
            <Text style={styles.callButtonText}>Call store</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F0F0F0', // Fond gris clair comme la maquette
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: Platform.OS === 'ios' ? 10 : 20,
    paddingBottom: 10,
    backgroundColor: '#F0F0F0',
  },
  closeButton: {
    width: 30,
    height: 30,
    justifyContent: 'center',
    alignItems: 'center',
  },
  closeButtonText: {
    fontSize: 18,
    color: '#000',
    fontWeight: '300',
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  shareButton: {
    width: 30,
    height: 30,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  shareButtonText: {
    fontSize: 16,
    color: '#000',
  },
  helpText: {
    fontSize: 16,
    color: '#000',
    fontWeight: '400',
  },
  content: {
    flex: 1,
    paddingHorizontal: 0,
  },
  titleSection: {
    alignItems: 'center',
    paddingHorizontal: 20,
    marginTop: 20,
    marginBottom: 60,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#000',
    marginBottom: 8,
    textAlign: 'center',
  },
  estimatedTime: {
    fontSize: 16,
    color: '#888',
    textAlign: 'center',
  },
  productsSection: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  productsContainer: {
    position: 'relative',
    width: 300,
    height: 200,
  },
  productItem: {
    position: 'absolute',
  },
  productCard: {
    width: 80,
    height: 80,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  // Styles pour la bouteille violette
  bottleShape: {
    alignItems: 'center',
  },
  bottleNeck: {
    width: 8,
    height: 15,
    backgroundColor: '#FFFFFF',
    borderRadius: 4,
    marginBottom: 2,
  },
  bottleBody: {
    width: 35,
    height: 40,
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    opacity: 0.9,
  },
  bottleCap: {
    position: 'absolute',
    top: -3,
    width: 12,
    height: 8,
    backgroundColor: '#FFFFFF',
    borderRadius: 2,
  },
  // Styles pour la boîte café
  coffeeBox: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  coffeeLid: {
    width: 30,
    height: 8,
    backgroundColor: '#654321',
    borderRadius: 4,
    marginBottom: 2,
  },
  coffeeBody: {
    width: 35,
    height: 35,
    backgroundColor: '#FFFFFF',
    borderRadius: 6,
    opacity: 0.9,
  },
  coffeeHandle: {
    position: 'absolute',
    right: -5,
    top: 15,
    width: 8,
    height: 15,
    borderWidth: 2,
    borderColor: '#FFFFFF',
    borderRadius: 8,
    backgroundColor: 'transparent',
  },
  // Styles pour le jus d'orange
  juiceBottle: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  juiceBody: {
    width: 35,
    height: 45,
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    opacity: 0.9,
  },
  juiceLabel: {
    position: 'absolute',
    width: 25,
    height: 15,
    backgroundColor: '#FF6B35',
    borderRadius: 4,
    top: 15,
  },
  bottomSection: {
    paddingHorizontal: 20,
    paddingBottom: Platform.OS === 'ios' ? 34 : 20,
  },
  helpSection: {
    marginBottom: 20,
  },
  helpHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  avatarContainer: {
    width: 32,
    height: 32,
    borderRadius: 16,
    overflow: 'hidden',
    marginRight: 12,
  },
  avatar: {
    width: '100%',
    height: '100%',
    borderRadius: 16,
    resizeMode: 'cover',
  },
  helpTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#000',
  },
  helpDescription: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
    marginLeft: 44,
  },
  callButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFFFFF',
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  callButtonIcon: {
    fontSize: 16,
    marginRight: 8,
  },
  callButtonText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#000',
  },
  // Error styles
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
    marginTop: 50,
  },
  errorTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FF3B30',
    marginBottom: 12,
    textAlign: 'center',
  },
  errorMessage: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    marginBottom: 24,
    lineHeight: 20,
  },
  retryButton: {
    backgroundColor: '#2E86AB',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  retryButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});