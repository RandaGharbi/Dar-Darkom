import FontAwesome from '@expo/vector-icons/FontAwesome';
import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import React, { useEffect, useState } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

import { useColorScheme } from '@/hooks/useColorScheme';
import { StatusBar } from 'expo-status-bar';
import { FavoritesProvider } from '../context/FavoritesContext';
import { AuthProvider } from '../context/AuthContext';
import { OrderProvider } from "../context/OrderContext";
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SelectedCardProvider } from '../context/PaymentContext';
import AnimatedSplashScreen from '../components/AnimatedSplashScreen';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { View } from 'react-native';

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

function AppContent() {
  const colorScheme = useColorScheme();
  
  return (
    <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      <AuthProvider>
        <FavoritesProvider>
          <OrderProvider>
            <SelectedCardProvider>
              <View style={{ flex: 1, backgroundColor: '#ffffff' }}>
              <Stack screenOptions={{ headerShown: false }}>
                <Stack.Screen name="(tabs)" />
                <Stack.Screen name="login" options={{ headerShown: false }} />
                <Stack.Screen name="signup" options={{ headerShown: false }} />
                <Stack.Screen name="cart" options={{ headerShown: false }} />
                <Stack.Screen name="profile" options={{ headerShown: false }} />
                <Stack.Screen name="order-history" options={{ headerShown: false }} />
                <Stack.Screen name="order-details/[id]" options={{ headerShown: false }} />
                <Stack.Screen name="payment-methods" options={{ headerShown: false }} />
                <Stack.Screen name="personal-info" options={{ headerShown: false }} />
                <Stack.Screen name="contact-us" options={{ headerShown: false }} />
                <Stack.Screen name="help-center" options={{ headerShown: false }} />
              </Stack>
              <StatusBar style="auto" />
              </View>
            </SelectedCardProvider>
          </OrderProvider>
        </FavoritesProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default function RootLayout() {
  const [loaded] = useFonts({
    SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
    ...FontAwesome.font,
  });

  // Créer une instance QueryClient
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 5 * 60 * 1000, // 5 minutes
        gcTime: 10 * 60 * 1000, // 10 minutes (anciennement cacheTime)
        retry: 2,
        refetchOnWindowFocus: false,
      },
    },
  });

  // Splash animé personnalisé (premier lancement)
  const [showAnimatedSplash, setShowAnimatedSplash] = useState(false);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const checkFirstLaunch = async () => {
      //await AsyncStorage.removeItem('hasSeenAnimatedSplash');
      const seen = await AsyncStorage.getItem('hasSeenAnimatedSplash');
      if (!seen) {
        setShowAnimatedSplash(true);
        await AsyncStorage.setItem('hasSeenAnimatedSplash', 'true');
      }
      setReady(true);
    };
    checkFirstLaunch();
  }, []);

  useEffect(() => {
    if (loaded && ready) {
      // Cacher le splash screen natif quand tout est prêt
      SplashScreen.hideAsync();
    }
  }, [loaded, ready]);

  if (!loaded || !ready) {
    return null;
  }

  return (
    <SafeAreaProvider>
      <GestureHandlerRootView style={{ flex: 1 }}>
        <QueryClientProvider client={queryClient}>
          {showAnimatedSplash ? (
            <AnimatedSplashScreen onFinish={() => setShowAnimatedSplash(false)} />
          ) : (
            <AppContent />
          )}
        </QueryClientProvider>
      </GestureHandlerRootView>
    </SafeAreaProvider>
  );
}