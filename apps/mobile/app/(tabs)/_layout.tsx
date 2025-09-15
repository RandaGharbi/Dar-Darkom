import { Tabs } from "expo-router";
import React, { useEffect } from "react";
import { Platform, View, Text } from "react-native";
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from "../../context/AuthContext";
import { useCartStore } from '../../context/CartStore';

import { HapticTab } from "../../components/collapsible/HapticTab";
import TabBarBackground from "../../components/ui/TabBarBackground";

export default function TabLayout() {
  const { isAuthenticated, user } = useAuth();
  const { cart, fetchCart } = useCartStore();
  
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
  
  const cartCount = cart?.items ? cart.items.reduce((sum: number, item: any) => sum + item.quantity, 0) : 0;
  console.log('🛒 Badge panier - count:', cartCount, 'items:', cart?.items?.length || 0);

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: "black",
        tabBarInactiveTintColor: "#8A7861",
        headerShown: false,
        tabBarButton: HapticTab,
        tabBarBackground: TabBarBackground,
        tabBarStyle: Platform.select({
          android: {
            position: "absolute",
            elevation: 0,
            borderTopWidth: 0,
          },
          default: {},
        }),
        tabBarLabelStyle: {
          fontSize: 11,
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Home",
          tabBarIcon: ({ focused, color }) => (
            <Ionicons 
              name={focused ? "home" : "home-outline"} 
              size={20} 
              color={focused ? "#2E86AB" : "#999"} 
            />
          ),
        }}
      />
      <Tabs.Screen
        name="menu"
        options={{
          title: "Menu",
          tabBarIcon: ({ focused, color }) => (
            <Ionicons 
              name={focused ? "restaurant" : "restaurant-outline"} 
              size={20} 
              color={focused ? "#2E86AB" : "#999"} 
            />
          ),
        }}
      />
      <Tabs.Screen
        name="cart"
        options={{
          title: "Cart",
          tabBarIcon: ({ focused, color }) => (
            <View>
              <Ionicons 
                name={focused ? "bag" : "bag-outline"} 
                size={20} 
                color={focused ? "#2E86AB" : "#999"} 
              />
              {cartCount > 0 && (
                <View style={{
                  position: 'absolute',
                  top: -6,
                  right: -10,
                  backgroundColor: '#2E86AB',
                  borderRadius: 8,
                  minWidth: 16,
                  height: 16,
                  justifyContent: 'center',
                  alignItems: 'center',
                  paddingHorizontal: 4,
                }}>
                  <Text style={{ color: '#fff', fontSize: 10, fontWeight: 'bold' }}>{cartCount}</Text>
                </View>
              )}
            </View>
          ),
        }}
      />
                  <Tabs.Screen
                    name="orders"
                    options={{
                      title: "Orders",
                      tabBarIcon: ({ focused, color }) => (
                        <Ionicons 
                          name={focused ? "receipt" : "receipt-outline"} 
                          size={20} 
                          color={focused ? "#2E86AB" : "#999"} 
                        />
                      ),
                    }}
                  />
      <Tabs.Screen
        name="profile"
        options={{
          title: "Profile",
          tabBarIcon: ({ focused, color }) => (
            <Ionicons 
              name={focused ? "person" : "person-outline"} 
              size={20} 
              color={focused ? "#2E86AB" : "#999"} 
            />
          ),
        }}
      />
    </Tabs>
  );
}
