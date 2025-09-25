import { Tabs } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useColorScheme } from '../../hooks/useColorScheme';
import { OrientalColors } from '../../constants/Colors';
import { OrientalStyles } from '../../constants/OrientalStyles';

export default function TabLayout() {
  const colorScheme = useColorScheme();

  return (
      <Tabs
        screenOptions={{
        tabBarActiveTintColor: OrientalColors.primary,
        tabBarInactiveTintColor: OrientalColors.textSecondary,
        tabBarStyle: {
          ...OrientalStyles.tabBar,
          backgroundColor: colorScheme === 'dark' ? '#1a1a1a' : OrientalColors.surface,
          height: 60,
          paddingBottom: 8,
              paddingTop: 8,
        },
        headerStyle: {
          ...OrientalStyles.header,
          backgroundColor: OrientalColors.primary,
        },
        headerTintColor: '#ffffff',
        headerTitleStyle: {
          fontWeight: '600',
          },
        }}
      >
        <Tabs.Screen
          name="index"
          options={{
          title: 'Scan QR Code',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="qr-code" size={size} color={color} />
            ),
          headerShown: false,
          tabBarStyle: { display: 'none' },
          }}
        />
        <Tabs.Screen
        name="orders"
          options={{
          title: 'Commandes',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="list" size={size} color={color} />
            ),
          }}
        />
        <Tabs.Screen
        name="tracking"
          options={{
          title: 'Suivi',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="location" size={size} color={color} />
            ),
          }}
        />
        <Tabs.Screen
          name="profile"
          options={{
          title: 'Profil',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="person" size={size} color={color} />
            ),
          }}
        />
      </Tabs>
  );
}