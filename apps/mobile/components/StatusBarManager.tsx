import React from 'react';
import { StatusBar, Platform, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

interface StatusBarManagerProps {
  backgroundColor?: string;
  barStyle?: 'default' | 'light-content' | 'dark-content';
  translucent?: boolean;
}

export default function StatusBarManager({ 
  backgroundColor = 'transparent',
  barStyle = 'dark-content',
  translucent = true
}: StatusBarManagerProps) {
  const insets = useSafeAreaInsets();

  if (Platform.OS === 'android') {
    return (
      <View style={{ 
        height: translucent ? insets.top : 0,
        backgroundColor: translucent ? backgroundColor : 'transparent'
      }}>
        <StatusBar
          backgroundColor={translucent ? 'transparent' : backgroundColor}
          barStyle={barStyle}
          translucent={translucent}
        />
      </View>
    );
  }

  // Pour iOS, la StatusBar est gérée automatiquement par SafeAreaView
  return (
    <StatusBar
      barStyle={barStyle}
    />
  );
} 