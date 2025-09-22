import { Tabs } from "expo-router";
import React, { useEffect, useState } from "react";
import { Platform, View, Text, StyleSheet, Animated, DeviceEventEmitter } from "react-native";
import { BlurView } from 'expo-blur';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from "../../context/AuthContext";
import { useCartStore } from '../../context/CartStore';

export default function TabLayout() {
  const { isAuthenticated, user } = useAuth();
  const { cart, fetchCart } = useCartStore();
  const [isCheckoutModalOpen, setIsCheckoutModalOpen] = useState(false);
  
  // Initialiser le panier de manière sécurisée
  useEffect(() => {
    const initializeCart = async () => {
      try {
        if (isAuthenticated && user?._id) {
          console.log('🛒 Initialisation sécurisée du panier pour:', user._id);
          await fetchCart(user._id);
        }
      } catch (error) {
        console.error('❌ Erreur initialisation panier:', error);
      }
    };

    initializeCart();
  }, [isAuthenticated, user?._id, fetchCart]);

  // Écouter les événements de la modal de checkout
  useEffect(() => {
    const subscription = DeviceEventEmitter.addListener('checkoutModalToggle', (isOpen) => {
      setIsCheckoutModalOpen(isOpen);
    });

    return () => {
      subscription.remove();
    };
  }, []);
  
  const cartCount = cart?.items ? cart.items.reduce((sum: number, item: any) => sum + item.quantity, 0) : 0;

  // Composant Liquid Glass Icon corrigé
  const LiquidGlassIcon = ({ name, focused, badge, title }: { name: string; focused?: boolean; badge?: number; title?: string }) => {
    const scaleAnim = React.useRef(new Animated.Value(1)).current;
    const opacityAnim = React.useRef(new Animated.Value(0.7)).current;

    React.useEffect(() => {
      if (focused) {
        Animated.parallel([
          Animated.spring(scaleAnim, {
            toValue: 1.2,
            useNativeDriver: true,
            tension: 120,
            friction: 7,
          }),
          Animated.timing(opacityAnim, {
            toValue: 1,
            duration: 250,
            useNativeDriver: true,
          }),
        ]).start();
      } else {
        Animated.parallel([
          Animated.spring(scaleAnim, {
            toValue: 1,
            useNativeDriver: true,
            tension: 120,
            friction: 7,
          }),
          Animated.timing(opacityAnim, {
            toValue: 0.6,
            duration: 200,
            useNativeDriver: true,
          }),
        ]).start();
      }
    }, [focused, scaleAnim, opacityAnim]);

    if (Platform.OS !== 'ios') {
      return (
        <View style={styles.iconContainer}>
          <Ionicons name={name as any} size={24} color={focused ? "#007AFF" : "#8E8E93"} />
          {badge && badge > 0 && (
            <View style={styles.badge}>
              <Text style={styles.badgeText}>{badge}</Text>
            </View>
          )}
        </View>
      );
    }

    return (
      <View style={styles.iconContainer}>
        {focused ? (
          <Animated.View 
            style={[
              styles.liquidGlassContainer, 
              { 
                transform: [{ scale: scaleAnim }],
                opacity: opacityAnim,
              }
            ]}
          >
            <BlurView intensity={80} tint="systemUltraThinMaterialLight" style={styles.blurContainer}>
              <View style={styles.glassContent}>
                <Ionicons name={name as any} size={20} color="white" />
                {title ? (
                  <Text style={styles.glassText}>{title}</Text>
                ) : null}
              </View>
              {/* Effet de brillance */}
              <View style={styles.glassHighlight} />
            </BlurView>
          </Animated.View>
        ) : (
          <Animated.View 
            style={[
              {
                opacity: opacityAnim,
                transform: [{ scale: scaleAnim }],
              },
              styles.normalIconContainer
            ]}
          >
            <Ionicons name={name as any} size={24} color="#8E8E93" />
          </Animated.View>
        )}
        
        {badge && badge > 0 ? (
          <View style={styles.badge}>
            <Text style={styles.badgeText}>{badge}</Text>
          </View>
        ) : null}
      </View>
    );
  };

  return (
    <View style={{ flex: 1 }}>
      <Tabs
        screenOptions={{
          tabBarActiveTintColor: "#007AFF",
          tabBarInactiveTintColor: "#8E8E93",
          headerShown: false,
          tabBarStyle: isCheckoutModalOpen ? { display: 'none' } : Platform.select({
            ios: {
              backgroundColor: 'transparent',
              borderTopWidth: 0,
              position: 'absolute',
              elevation: 0,
              height: 70,
              paddingBottom: 15,
              paddingTop: 8,
              paddingHorizontal: 16,
              marginHorizontal: 16,
               marginBottom: 35, // Décoller plus du bas
               borderRadius: 50, // Coins ultra arrondis
               shadowColor: '#000',
               shadowOffset: {
                 width: 0,
                 height: -2,
               },
               shadowOpacity: 0.1,
               shadowRadius: 12,
            },
            android: {
              position: "absolute",
              elevation: 8,
              borderTopWidth: 0,
              backgroundColor: 'white',
              height: 60,
              paddingBottom: 10,
              paddingTop: 6,
              paddingHorizontal: 16,
              marginHorizontal: 16,
               marginBottom: 35, // Décoller plus du bas
               borderRadius: 50, // Coins ultra arrondis
               shadowColor: '#000',
               shadowOffset: {
                 width: 0,
                 height: -2,
               },
               shadowOpacity: 0.15,
               shadowRadius: 8,
            },
          }),
          tabBarBackground: () => (
            <BlurView 
              intensity={80} 
              tint="light" 
               style={[StyleSheet.absoluteFill, { 
                 borderRadius: 50,
                 overflow: 'hidden',
                 backgroundColor: Platform.OS === 'android' ? 'rgba(255, 255, 255, 0.9)' : 'transparent'
               }]}
            />
          ),
          tabBarLabelStyle: {
            display: 'none', // Cache le texte en dehors de la bulle
          },
          tabBarIconStyle: {
            marginBottom: -2,
          },
        }}
      >
        <Tabs.Screen
          name="index"
          options={{
            title: "Accueil",
            tabBarIcon: ({ focused }) => (
              <LiquidGlassIcon name={focused ? "home" : "home-outline"} focused={focused} title="Accueil" />
            ),
          }}
        />
        
        <Tabs.Screen
          name="menu"
          options={{
            title: "Menu",
            tabBarIcon: ({ focused }) => (
              <LiquidGlassIcon name={focused ? "restaurant" : "restaurant-outline"} focused={focused} title="Menu" />
            ),
          }}
        />
        
        <Tabs.Screen
          name="cart"
          options={{
            title: "Panier",
            tabBarIcon: ({ focused }) => (
              <LiquidGlassIcon name={focused ? "bag" : "bag-outline"} focused={focused} badge={cartCount} title="Panier" />
            ),
          }}
        />
        
        <Tabs.Screen
          name="orders"
          options={{
            title: "Commandes",
            tabBarIcon: ({ focused }) => (
              <LiquidGlassIcon name={focused ? "receipt" : "receipt-outline"} focused={focused} title="Commandes" />
            ),
          }}
        />
        
        <Tabs.Screen
          name="profile"
          options={{
            title: "Profil",
            tabBarIcon: ({ focused }) => (
              <LiquidGlassIcon name={focused ? "person" : "person-outline"} focused={focused} title="Profil" />
            ),
          }}
        />
      </Tabs>
    </View>
  );
}

const styles = StyleSheet.create({
  iconContainer: {
    position: 'relative',
    alignItems: 'center',
    justifyContent: 'center',
    width: 60,
    height: 60,
  },
  liquidGlassContainer: {
    width: 70,
    height: 45,
    borderRadius: 22,
    overflow: 'visible', // Permet à l'ombre de déborder
    marginTop: 8, // Position ajustée
    alignSelf: 'center', // Centre la bulle horizontalement
    // Ombre extérieure plus subtile
    shadowColor: '#007AFF',
    shadowOffset: {
      width: 0,
      height: 6,
    },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 10,
  },
  glassBackground: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    borderRadius: 22,
    backgroundColor: 'rgba(0, 122, 255, 0.2)',
    // Ombre interne
    shadowColor: '#007AFF',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.4,
    shadowRadius: 10,
  },
  blurContainer: {
    flex: 1,
    borderRadius: 22,
    overflow: 'hidden',
    backgroundColor: 'rgba(0, 122, 255, 0.15)', // Couleur bleue transparente
  },
  glassContent: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'column',
    paddingVertical: 4,
    backgroundColor: 'rgba(0, 122, 255, 0.1)',
    zIndex: 3,
  },
  glassText: {
    fontSize: 9,
    fontWeight: '600',
    color: 'white',
    marginTop: 2,
    textAlign: 'center',
  },
  glassHighlight: {
    position: 'absolute',
    top: 2,
    left: 4,
    right: 4,
    height: 10,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    borderRadius: 22,
    opacity: 0.6,
    zIndex: 4,
  },
  normalIconContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'column',
    width: 50,
    height: 50,
    padding: 8,
    // Suppression du background gris
  },
  normalTabText: {
    fontSize: 8,
    fontWeight: '500',
    color: '#8E8E93',
    marginTop: 2,
    textAlign: 'center',
  },
  badge: {
    position: 'absolute',
    top: 2,
    right: 2,
    backgroundColor: '#FF3B30',
    borderRadius: 12,
    minWidth: 24,
    height: 24,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 6,
    zIndex: 30,
    borderWidth: 2.5,
    borderColor: 'white',
    // Ombre pour le badge
    shadowColor: '#FF3B30',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.4,
    shadowRadius: 8,
    elevation: 8,
  },
  badgeText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '800',
  },
});