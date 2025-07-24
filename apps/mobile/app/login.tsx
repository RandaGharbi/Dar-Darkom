import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  Alert,
  ActivityIndicator,
} from "react-native";
import { useRouter } from 'expo-router';
import { useAuth } from '../context/AuthContext';
import SocialButton from "../components/SocialButton";
import * as AppleAuthentication from 'expo-apple-authentication';
import * as Google from 'expo-auth-session/providers/google';
import * as WebBrowser from 'expo-web-browser';
import SafeAreaWrapper from '../components/SafeAreaWrapper';
import { API_BASE_URL } from '../services/api';

import appleIcon from "../assets/images/apple.png";
import googleIcon from "../assets/images/gmail.png";
import emailIcon from "../assets/images/email.png";

const LoginScreen: React.FC = () => {
  const router = useRouter();
  const { login, isAuthenticated, loading } = useAuth();
  const [showEmailForm, setShowEmailForm] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoggingIn, setIsLoggingIn] = useState(false);

  WebBrowser.maybeCompleteAuthSession();

  const [, response, promptAsync] = Google.useAuthRequest({
    clientId: 'TON_CLIENT_ID_WEB.apps.googleusercontent.com', // Pour Expo Go OU build, adapte selon ton usage
    iosClientId: 'TON_CLIENT_ID_IOS.apps.googleusercontent.com',   // Pour build iOS
    androidClientId: 'TON_CLIENT_ID_ANDROID.apps.googleusercontent.com', // Pour build Android
  });

  React.useEffect(() => {
    if (response?.type === 'success') {
      const idToken = response.authentication?.idToken;
      if (idToken) {
        fetch(`${API_BASE_URL}/api/auth/google`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ token: idToken }),
        })
          .then(res => res.json())
          .then(data => {
            // Ici, gère la connexion (stocke le JWT, etc.)
            // Par exemple : login(data.token, data.user)
          });
      }
    }
  }, [response]);

  // Rediriger si déjà connecté
  useEffect(() => {
    if (!loading && isAuthenticated) {
      router.replace('/');
    }
  }, [loading, isAuthenticated, router]);

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert('Error', 'Please fill all fields');
      return;
    }
    
    setIsLoggingIn(true);
    const res = await login(email, password);
    setIsLoggingIn(false);
    
    if (res) {
      router.replace('/');
    }
  };

  const handleAppleLogin = async () => {
    try {
      const credential = await AppleAuthentication.signInAsync({
        requestedScopes: [
          AppleAuthentication.AppleAuthenticationScope.FULL_NAME,
          AppleAuthentication.AppleAuthenticationScope.EMAIL,
        ],
      });
      if (credential.identityToken) {
        // Envoie le token au backend
        const res = await fetch(`${API_BASE_URL}/api/auth/apple`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ token: credential.identityToken }),
        });
        const data = await res.json();
        if (data.token) {
          // Ici tu peux stocker le token JWT et connecter l'utilisateur
          // Par exemple : await loginWithApple(data.token, data.user)
          // Ou rediriger, etc.
        } else {
          Alert.alert('Erreur', data.error || 'Erreur lors de la connexion Apple');
        }
      }
    } catch (e) {
      if (e.code === 'ERR_CANCELED') {
        // L'utilisateur a annulé
      } else {
        Alert.alert('Erreur', 'Erreur lors de la connexion Apple');
      }
    }
  };

  // Afficher un loader pendant la vérification de l'état d'authentification
  if (loading) {
    return (
      <SafeAreaWrapper backgroundColor="#fff">
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#F5A623" />
          <Text style={styles.loadingText}>Chargement...</Text>
        </View>
      </SafeAreaWrapper>
    );
  }

  // Si déjà connecté, ne pas afficher l'écran de login
  if (isAuthenticated) {
    return null;
  }

  return (
    <SafeAreaWrapper backgroundColor="#fff">
      {/* Go Back Button */}
      <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
        <Text style={styles.backText}>←</Text>
      </TouchableOpacity>

      {/* Help Icon */}
      <TouchableOpacity style={styles.helpIcon}>
        <Text style={{ fontSize: 18 }}>?</Text>
      </TouchableOpacity>

      <Text style={styles.title}>Welcome back</Text>

      <Text style={styles.subtitle}>
        Sign in to access your account and continue your journey with Guerlain.
      </Text>

      <View style={styles.buttonContainer}>
        <SocialButton
          icon={appleIcon}
          text="Continue with Apple"
          onPress={handleAppleLogin}
        />
        <SocialButton
          icon={googleIcon}
          text="Continue with Google"
          onPress={() => promptAsync()}
        />
        <SocialButton
          icon={emailIcon}
          text="Sign in with email"
          onPress={() => setShowEmailForm((v) => !v)}
          style={styles.emailButton}
          textStyle={{ color: "#fff" }}
        />
      </View>

      {showEmailForm && (
        <View style={{ marginTop: 24, paddingHorizontal: 24 }}>
          <Text style={styles.label}>Email</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter youremail"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
          />
          <Text style={styles.label}>Password</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter yourpassword"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
          />
          <TouchableOpacity 
            style={[styles.signupBtn, isLoggingIn && { opacity: 0.7 }]} 
            onPress={handleLogin}
            disabled={isLoggingIn}
          >
            {isLoggingIn ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.signupText}>Log in</Text>
            )}
          </TouchableOpacity>
        </View>
      )}

      <TouchableOpacity
        style={styles.signupLink}
        onPress={() => router.push('/signup')}
      >
        <Text style={styles.signupText}>
          Don&apos;t have an account?{" "}
          <Text style={{ textDecorationLine: "underline" }}>Sign up</Text>
        </Text>
      </TouchableOpacity>
    </SafeAreaWrapper>
  );
};

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: '#666',
  },
  backButton: {
    position: "absolute",
    top: 20,
    left: 20,
    zIndex: 2,
  },
  backText: {
    fontSize: 20,
    fontWeight: "bold",
  },
  helpIcon: { position: "absolute", top: 20, right: 20, zIndex: 1 },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    textAlign: "center",
    marginTop: 60,
  },
  subtitle: {
    textAlign: "center",
    color: "#444",
    marginTop: 12,
    fontSize: 15,
  },
  buttonContainer: {
    marginTop: 32,
    paddingHorizontal: 24,
  },
  emailButton: {
    backgroundColor: "#F5A623",
  },
  label: { fontWeight: 'bold', marginTop: 12, marginBottom: 4 },
  input: {
    backgroundColor: '#F6F3F2',
    borderRadius: 8,
    padding: 12,
    marginBottom: 8,
    fontSize: 15,
  },
  signupBtn: {
    backgroundColor: '#F5A623',
    borderRadius: 20,
    padding: 16,
    marginTop: 12,
    alignItems: 'center',
  },
  signupContainer: {
    position: "absolute",
    bottom: 32,
    left: 0,
    right: 0,
    alignItems: "center",
  },
  signupText: {
    color: "#888",
    fontSize: 14,
  },
  signupLink: {
    position: "absolute",
    bottom: 32,
    left: 0,
    right: 0,
    alignItems: "center",
  },
  signupLinkText: {
    color: "#888",
    fontSize: 14,
  },
  signupLinkBold: {
    textDecorationLine: "underline",
  },
});

export default LoginScreen;