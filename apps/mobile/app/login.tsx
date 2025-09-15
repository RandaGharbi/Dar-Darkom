import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  Alert,
  ActivityIndicator,
  ImageBackground,
  ScrollView,
  Image,
} from "react-native";
import { useRouter } from 'expo-router';
import { useAuth } from '../context/AuthContext';
import { useSafeNavigation } from '../hooks/useSafeNavigation';
import SafeAreaWrapper from '../components/SafeAreaWrapper';
import { OrientalColors } from '../constants/Colors';
import { OrientalStyles } from '../constants/OrientalStyles';
import { Ionicons } from '@expo/vector-icons';

import DarLogo from "../assets/images/DarLogo.png";

const LoginScreen: React.FC = () => {
  const router = useRouter();
  const { login, loginWithApple, loginWithGoogle, isAuthenticated, loading } = useAuth();
  const { safeBack } = useSafeNavigation();
  const [showEmailForm, setShowEmailForm] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoggingIn, setIsLoggingIn] = useState(false);

  const handleAppleLogin = async () => {
    const success = await loginWithApple();
    if (success) {
      router.replace('/');
    }
  };

  const handleGoogleLogin = async () => {
    const success = await loginWithGoogle();
    if (success) {
      router.replace('/');
    }
  };

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
    <SafeAreaWrapper backgroundColor="#fff" edges={['top']}>
      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        {/* Header avec motif oriental */}
        <View style={styles.header}>
          <TouchableOpacity style={styles.backButton} onPress={safeBack}>
            <Ionicons name="arrow-back" size={24} color={OrientalColors.textPrimary} />
          </TouchableOpacity>
          
          <View style={styles.logoContainer}>
            <Image source={DarLogo} style={styles.logo} resizeMode="contain" />
          </View>
          
          <TouchableOpacity style={styles.helpButton}>
            <Ionicons name="help-circle-outline" size={24} color={OrientalColors.textSecondary} />
          </TouchableOpacity>
        </View>

        {/* Motif décoratif oriental */}
        <View style={styles.decorativePattern}>
          <View style={styles.patternLine} />
          <View style={styles.patternDots}>
            <View style={[styles.dot, styles.dotGold]} />
            <View style={[styles.dot, styles.dotBlue]} />
            <View style={[styles.dot, styles.dotGold]} />
          </View>
          <View style={styles.patternLine} />
        </View>

        {/* Contenu principal */}
        <View style={styles.content}>
          <Text style={[OrientalStyles.text.title, styles.title]}>
            مرحباً بك
          </Text>
          <Text style={[OrientalStyles.text.subtitle, styles.subtitle]}>
            Welcome back
          </Text>
          
          <Text style={[OrientalStyles.text.body, styles.description]}>
            Connectez-vous pour accéder à votre compte et continuer votre voyage culinaire avec Dar Darkom.
          </Text>

          {/* Boutons de connexion */}
          <View style={styles.buttonContainer}>
            <TouchableOpacity 
              style={[OrientalStyles.button.primary, styles.socialButton]}
              onPress={handleAppleLogin}
            >
              <Ionicons name="logo-apple" size={20} color={OrientalColors.textPrimary} />
              <Text style={[OrientalStyles.text.button, styles.buttonText]}>
                Continuer avec Apple
              </Text>
            </TouchableOpacity>

            <TouchableOpacity 
              style={[OrientalStyles.button.outline, styles.socialButton]}
              onPress={handleGoogleLogin}
            >
              <Ionicons name="logo-google" size={20} color={OrientalColors.primary} />
              <Text style={[OrientalStyles.text.button, styles.buttonTextOutline]}>
                Continuer avec Google
              </Text>
            </TouchableOpacity>

            <TouchableOpacity 
              style={[OrientalStyles.button.secondary, styles.socialButton, styles.emailButton]}
              onPress={() => setShowEmailForm((v) => !v)}
            >
              <Ionicons name="mail" size={20} color="#fff" />
              <Text style={[OrientalStyles.text.button, styles.buttonTextWhite]}>
                Se connecter avec l'email
              </Text>
            </TouchableOpacity>
          </View>

          {/* Formulaire email */}
          {showEmailForm && (
            <View style={styles.emailForm}>
              <View style={styles.inputContainer}>
                <Text style={[OrientalStyles.text.heading, styles.inputLabel]}>Email</Text>
                <TextInput
                  style={[OrientalStyles.searchBar, styles.input]}
                  placeholder="Entrez votre email"
                  placeholderTextColor={OrientalColors.textLight}
                  value={email}
                  onChangeText={setEmail}
                  keyboardType="email-address"
                  autoCapitalize="none"
                  autoCorrect={false}
                  spellCheck={false}
                />
              </View>
              
              <View style={styles.inputContainer}>
                <Text style={[OrientalStyles.text.heading, styles.inputLabel]}>Mot de passe</Text>
                <TextInput
                  style={[OrientalStyles.searchBar, styles.input]}
                  placeholder="Entrez votre mot de passe"
                  placeholderTextColor={OrientalColors.textLight}
                  value={password}
                  onChangeText={setPassword}
                  secureTextEntry
                  autoCorrect={false}
                  spellCheck={false}
                />
              </View>
              
              <TouchableOpacity 
                style={[OrientalStyles.button.primary, styles.loginButton, isLoggingIn && { opacity: 0.7 }]} 
                onPress={handleLogin}
                disabled={isLoggingIn}
              >
                {isLoggingIn ? (
                  <ActivityIndicator color={OrientalColors.textPrimary} />
                ) : (
                  <Text style={[OrientalStyles.text.button, styles.buttonText]}>
                    Se connecter
                  </Text>
                )}
              </TouchableOpacity>
            </View>
          )}

          {/* Lien d'inscription */}
          <TouchableOpacity
            style={styles.signupLink}
            onPress={() => router.push('/signup')}
          >
            <Text style={[OrientalStyles.text.caption, styles.signupText]}>
              Vous n'avez pas de compte ?{" "}
              <Text style={styles.signupLinkText}>S'inscrire</Text>
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaWrapper>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: OrientalColors.textSecondary,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 10,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  logoContainer: {
    alignItems: 'center',
  },
  logo: {
    width: 120,
    height: 90,
  },
  helpButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  decorativePattern: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 20,
    paddingHorizontal: 40,
  },
  patternLine: {
    flex: 1,
    height: 2,
    backgroundColor: OrientalColors.primary,
    borderRadius: 1,
  },
  patternDots: {
    flexDirection: 'row',
    marginHorizontal: 20,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginHorizontal: 4,
  },
  dotGold: {
    backgroundColor: OrientalColors.accent,
  },
  dotBlue: {
    backgroundColor: '#4169E1',
  },
  content: {
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: 20,
  },
  title: {
    textAlign: 'center',
    marginBottom: 8,
    color: OrientalColors.primary,
  },
  subtitle: {
    textAlign: 'center',
    marginBottom: 16,
    color: OrientalColors.textSecondary,
  },
  description: {
    textAlign: 'center',
    marginBottom: 32,
    lineHeight: 24,
    color: OrientalColors.textSecondary,
  },
  buttonContainer: {
    marginBottom: 24,
  },
  socialButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
    paddingVertical: 16,
    paddingHorizontal: 24,
    ...OrientalStyles.shadow.medium,
  },
  emailButton: {
    backgroundColor: OrientalColors.secondary,
  },
  buttonText: {
    marginLeft: 12,
    color: OrientalColors.textPrimary,
  },
  buttonTextOutline: {
    marginLeft: 12,
    color: OrientalColors.primary,
  },
  buttonTextWhite: {
    marginLeft: 12,
    color: '#fff',
  },
  emailForm: {
    marginTop: 24,
    padding: 20,
    backgroundColor: OrientalColors.card,
    borderRadius: 16,
    ...OrientalStyles.shadow.light,
  },
  inputContainer: {
    marginBottom: 20,
  },
  inputLabel: {
    marginBottom: 8,
    color: OrientalColors.textPrimary,
  },
  input: {
    backgroundColor: OrientalColors.surface,
    borderColor: OrientalColors.border,
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 16,
    color: OrientalColors.textPrimary,
  },
  loginButton: {
    marginTop: 8,
    paddingVertical: 16,
    ...OrientalStyles.shadow.medium,
  },
  signupLink: {
    alignItems: 'center',
    marginTop: 32,
    marginBottom: 40,
  },
  signupText: {
    textAlign: 'center',
    color: OrientalColors.textSecondary,
  },
  signupLinkText: {
    color: OrientalColors.primary,
    fontWeight: '600',
    textDecorationLine: 'underline',
  },
});

export default LoginScreen;