import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  Pressable,
  KeyboardAvoidingView,
  Platform,
  Alert,
  Image,
  ActivityIndicator,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useAuth } from '../context/AuthContext';
import { useSafeNavigation } from '../hooks/useSafeNavigation';
import AsyncStorage from '@react-native-async-storage/async-storage';
import API_CONFIG from '../config/api';

import BackIcon from '../assets/images/back.png';

export default function PersonalInfo() {
  const router = useRouter();
  const { user, isAuthenticated, setUser } = useAuth();
  const { safeBack } = useSafeNavigation();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);

  // Charger les données utilisateur au démarrage
  useEffect(() => {
    const loadUserData = async () => {
      console.log('👤 User object:', user);
      if (user) {
        console.log('📝 Setting user data:', {
          name: user.name,
          email: user.email,
          displayEmail: user.displayEmail,
          phoneNumber: user.phoneNumber,
          address: user.address
        });
        setName(user.name || '');
        // Utiliser displayEmail si disponible (pour masquer les emails Apple privés), sinon utiliser l'email normal
        setEmail(user.displayEmail || user.email || '');
        setPhone(user.phoneNumber || '');
        setAddress(user.address || '');
      } else {
        console.log('❌ No user object available');
      }
      setInitialLoading(false);
    };

    loadUserData();
  }, [user]);

  const handleSave = async () => {
    if (!name.trim()) {
      Alert.alert('Error', 'Please enter your name.');
      return;
    }
    
    // Pour les utilisateurs Apple/Google, l'email peut être privé
    if (user?.appleId || user?.googleId) {
      if (!name.trim()) {
        Alert.alert('Error', 'Please enter your name.');
        return;
      }
    } else {
      // Pour les utilisateurs avec mot de passe, vérifier email et téléphone
      if (!email.trim() || !phone.trim()) {
        Alert.alert('Error', 'Please fill in all fields.');
        return;
      }
    }
    
    // Valider l'email seulement si ce n'est pas un utilisateur Apple/Google avec email privé
    if (!user?.appleId && !user?.googleId) {
      const emailRegex = /\S+@\S+\.\S+/;
      if (!emailRegex.test(email)) {
        Alert.alert('Error', 'Please enter a valid email address.');
        return;
      }
    }

    if (!isAuthenticated) {
      Alert.alert('Error', 'You must be logged in to update your information.');
      return;
    }

    setLoading(true);
    try {
      const token = await AsyncStorage.getItem('authToken');
      const url = `${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.UPDATE_USER}`;
      console.log('🔗 Making request to:', url);
      console.log('🔑 Token:', token ? 'Present' : 'Missing');
      
      const response = await fetch(url, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          name: name.trim(),
          // Pour les utilisateurs Apple avec email privé, ne pas envoyer l'email modifié
          ...(user?.email?.includes('@privaterelay.appleid.com') ? {} : { email: email.trim() }),
          phoneNumber: phone.trim(),
          address: address.trim(),
        }),
      });

      console.log('📡 Response status:', response.status);
      console.log('📡 Response headers:', response.headers);

      if (response.ok) {
        const responseData = await response.json();
        console.log('✅ Success response:', responseData);
        
        // Recharger les données utilisateur depuis le backend
        try {
          const meResponse = await fetch(`${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.ME}`, {
            headers: {
              'Authorization': `Bearer ${token}`,
            },
          });
          
          if (meResponse.ok) {
            const meData = await meResponse.json();
            console.log('🔄 Updated user data:', meData.user);
            // Mettre à jour le contexte utilisateur avec les nouvelles données
            setUser(meData.user);
          }
        } catch (reloadError) {
          console.log('⚠️ Could not reload user data:', reloadError);
        }
        
        Alert.alert('Success', 'Your information has been updated successfully!');
        safeBack();
      } else {
        const responseText = await response.text();
        console.log('❌ Error response text:', responseText);
        try {
          const errorData = JSON.parse(responseText);
          Alert.alert('Error', errorData.message || 'An error occurred while updating your information.');
        } catch {
          console.log('❌ Could not parse error response as JSON');
          Alert.alert('Error', `Server error: ${response.status} - ${responseText.substring(0, 100)}`);
        }
      }
    } catch (error: any) {
      console.error('❌ Network error:', error);
      Alert.alert('Error', `Network error: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  if (initialLoading) {
    return (
      <View style={[styles.container, styles.centerContent]}>
        <ActivityIndicator size="large" color="#000" />
        <Text style={styles.loadingText}>Loading your information...</Text>
      </View>
    );
  }

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 100 : 0}
    >
      {/* Header horizontal avec icône back + titre */}
      <View style={styles.header}>
        <Pressable onPress={safeBack} style={styles.backButton}>
          <Image source={BackIcon} style={styles.backIcon} />
        </Pressable>

        <Text style={styles.title}>Personal Information</Text>

        {/* View vide pour équilibrer le flex */}
        <View style={{ width: 40 }} />
      </View>

      <Text style={styles.label}>Name</Text>
      <TextInput
        style={styles.input}
        placeholder="Your name"
        value={name}
        onChangeText={setName}
        autoCapitalize="words"
        autoCorrect={false}
        spellCheck={false}
        autoFocus
        accessibilityLabel="Name input"
      />

      <Text style={styles.label}>
        Email {user?.appleId || user?.googleId ? '(Optionnel)' : ''}
      </Text>
      <TextInput
        style={[
          styles.input,
          (user?.appleId || user?.googleId) && styles.disabledInput
        ]}
        placeholder={user?.appleId || user?.googleId ? "Email privé (Apple/Google)" : "Your email"}
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
        autoCorrect={false}
        spellCheck={false}
        editable={!user?.appleId && !user?.googleId}
        accessibilityLabel="Email input"
      />
      {(user?.appleId || user?.googleId) && (
        <Text style={styles.privateEmailNote}>
          🔒 Email protégé par {user?.appleId ? 'Apple' : 'Google'} - Non modifiable
        </Text>
      )}

      <Text style={styles.label}>Phone Number</Text>
      <TextInput
        style={styles.input}
        placeholder="Your phone number"
        value={phone}
        onChangeText={setPhone}
        keyboardType="phone-pad"
        autoCorrect={false}
        spellCheck={false}
        accessibilityLabel="Phone number input"
      />

      <Text style={styles.label}>Address</Text>
      <TextInput
        style={styles.input}
        placeholder="Enter your address"
        value={address}
        onChangeText={setAddress}
        multiline
        numberOfLines={3}
        autoCorrect={false}
        spellCheck={false}
        accessibilityLabel="Address input"
      />

      <Pressable 
        style={[styles.saveButton, loading && styles.saveButtonDisabled]} 
        onPress={handleSave}
        disabled={loading}
      >
        {loading ? (
          <ActivityIndicator size="small" color="white" />
        ) : (
          <Text style={styles.saveText}>Save Changes</Text>
        )}
      </Pressable>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    paddingTop: 60,
    backgroundColor: '#fff',
  },
  centerContent: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: '#666',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  backButton: {
    paddingHorizontal: 10,
    paddingVertical: 6,
  },
  backIcon: {
    width: 24,
    height: 24,
    resizeMode: 'contain',
    tintColor: '#000', // icône en noir
  },
  title: {
    flex: 1,
    fontSize: 22,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  label: {
    fontSize: 16,
    marginBottom: 6,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    marginBottom: 20,
    fontSize: 16,
  },
  disabledInput: {
    backgroundColor: '#f5f5f5',
    borderColor: '#ddd',
    color: '#666',
  },
  privateEmailNote: {
    fontSize: 12,
    color: '#666',
    fontStyle: 'italic',
    marginTop: -15,
    marginBottom: 15,
    textAlign: 'center',
  },
  saveButton: {
    backgroundColor: 'black',
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 'auto',
    marginBottom: 30, // marge en bas ajoutée
  },
  saveButtonDisabled: {
    backgroundColor: '#ccc',
  },
  saveText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
});
