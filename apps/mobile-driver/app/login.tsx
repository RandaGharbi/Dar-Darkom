import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Alert,
  Dimensions,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StatusBar,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useDriverAuth } from '../hooks/useDriverAuth';
import { Country, defaultCountry, getCountryByDialCode } from '../constants/countries';

const { width } = Dimensions.get('window');

export default function LoginScreen() {
  const router = useRouter();
  const { loginWithApple, loginWithGoogle, isLoading } = useDriverAuth();
  const [phoneInput, setPhoneInput] = useState('');
  const [detectedCountry, setDetectedCountry] = useState<Country>(defaultCountry);
  const [isPhoneLoading, setIsPhoneLoading] = useState(false);

  // Fonction pour détecter le pays à partir du numéro saisi
  const detectCountryFromInput = (input: string) => {
    // Nettoyer l'input (supprimer espaces, tirets, etc.)
    const cleanInput = input.replace(/[\s\-\(\)]/g, '');
    
    // Chercher le code pays le plus long qui correspond
    let bestMatch: Country | null = null;
    let longestMatch = 0;
    
    // Trier les pays par longueur de code décroissante pour trouver le match le plus long
    const countriesByDialCode = [
      { code: '+216', country: getCountryByDialCode('+216') }, // Tunisie
      { code: '+213', country: getCountryByDialCode('+213') }, // Algérie
      { code: '+212', country: getCountryByDialCode('+212') }, // Maroc
      { code: '+218', country: getCountryByDialCode('+218') }, // Libye
      { code: '+20', country: getCountryByDialCode('+20') },   // Égypte
      { code: '+1', country: getCountryByDialCode('+1') },     // US/Canada
      { code: '+33', country: getCountryByDialCode('+33') },    // France
      { code: '+44', country: getCountryByDialCode('+44') },    // UK
      { code: '+49', country: getCountryByDialCode('+49') },   // Allemagne
      { code: '+39', country: getCountryByDialCode('+39') },   // Italie
      { code: '+34', country: getCountryByDialCode('+34') },   // Espagne
      { code: '+966', country: getCountryByDialCode('+966') }, // Arabie Saoudite
      { code: '+971', country: getCountryByDialCode('+971') },  // Émirats
      { code: '+974', country: getCountryByDialCode('+974') }, // Qatar
      { code: '+86', country: getCountryByDialCode('+86') },   // Chine
      { code: '+91', country: getCountryByDialCode('+91') },    // Inde
      { code: '+81', country: getCountryByDialCode('+81') },   // Japon
      { code: '+82', country: getCountryByDialCode('+82') },    // Corée
      { code: '+7', country: getCountryByDialCode('+7') },      // Russie
      { code: '+90', country: getCountryByDialCode('+90') },   // Turquie
    ].filter(item => item.country).sort((a, b) => b.code.length - a.code.length);
    
    for (const item of countriesByDialCode) {
      if (cleanInput.startsWith(item.code) && item.code.length > longestMatch) {
        bestMatch = item.country!;
        longestMatch = item.code.length;
      }
    }
    
    return bestMatch;
  };

  // Fonction appelée quand l'utilisateur tape dans l'input
  const handlePhoneInputChange = (text: string) => {
    setPhoneInput(text);
    
    // Détecter le pays si l'input commence par +
    if (text.startsWith('+')) {
      const detected = detectCountryFromInput(text);
      if (detected) {
        setDetectedCountry(detected);
      }
    } else {
      // Si pas de code pays, garder le pays par défaut
      setDetectedCountry(defaultCountry);
    }
  };

  const handleContinue = async () => {
    if (!phoneInput) {
      Alert.alert('Erreur', 'Veuillez saisir votre numéro de téléphone');
      return;
    }

    setIsPhoneLoading(true);
    
    // Utiliser le numéro tel qu'il est saisi ou avec le pays détecté
    let fullPhoneNumber = phoneInput;
    if (detectedCountry && !phoneInput.startsWith('+')) {
      fullPhoneNumber = `${detectedCountry.dialCode}${phoneInput}`;
    }
    
    console.log('Numéro complet:', fullPhoneNumber);
    console.log('Pays détecté:', detectedCountry?.name || 'Non détecté');
    
    setTimeout(() => {
      setIsPhoneLoading(false);
      Alert.alert('Succès', `Connexion réussie avec ${fullPhoneNumber} !`, [
        { text: 'OK', onPress: () => router.replace('/(tabs)') }
      ]);
    }, 2000);
  };

  const handleAppleLogin = async () => {
    try {
      const result = await loginWithApple();
      
      if (result.success) {
        // Redirection directe vers l'écran d'accueil
        router.replace('/(tabs)');
      } else {
        Alert.alert('Erreur', result.error || 'Erreur lors de la connexion Apple');
      }
    } catch (error) {
      console.error('Erreur Apple Login:', error);
      Alert.alert('Erreur', 'Erreur lors de la connexion avec Apple');
    }
  };

  const handleGoogleLogin = async () => {
    try {
      const result = await loginWithGoogle();
      
      if (result.success) {
        Alert.alert('Succès', 'Connexion Google réussie !', [
          { text: 'OK', onPress: () => router.replace('/(tabs)') }
        ]);
      } else {
        Alert.alert('Erreur', result.error || 'Erreur lors de la connexion Google');
      }
    } catch (error) {
      console.error('Erreur Google Login:', error);
      Alert.alert('Erreur', 'Erreur lors de la connexion avec Google');
    }
  };

  const handleFindAccount = () => {
    Alert.alert('Recherche', 'Fonctionnalité de recherche de compte en cours de développement');
  };


  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#1E3A8A" />
      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardView}
      >
        <ScrollView 
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {/* Titre principal */}
          <View style={styles.titleContainer}>
            <Text style={styles.appTitle}>DarDarkom Driver</Text>
            <Text style={styles.welcomeText}>Welcome back</Text>
            <Text style={styles.subtitleText}>Enter your details to log in</Text>
          </View>

          {/* Formulaire de connexion */}
          <View style={styles.formContainer}>
            {/* Champ de saisie avec drapeau */}
            <View style={styles.inputContainer}>
              {/* Drapeau du pays */}
              <View style={styles.flagContainer}>
                <Text style={styles.flag}>{detectedCountry.flag}</Text>
              </View>
              
              <TextInput
                style={styles.input}
                value={phoneInput}
                onChangeText={handlePhoneInputChange}
                keyboardType="phone-pad"
                autoCapitalize="none"
                autoCorrect={false}
                placeholder="Phone number or email"
                placeholderTextColor="#9CA3AF"
              />
            </View>

            {/* Bouton Continue */}
            <TouchableOpacity 
              style={[styles.continueButton, isPhoneLoading && styles.continueButtonDisabled]}
              onPress={handleContinue}
              disabled={isPhoneLoading}
            >
              <Text style={styles.continueButtonText}>
                {isPhoneLoading ? 'Connexion...' : 'Continue'}
              </Text>
            </TouchableOpacity>

            {/* Séparateur */}
            <View style={styles.separator}>
              <View style={styles.separatorLine} />
              <Text style={styles.separatorText}>ou</Text>
              <View style={styles.separatorLine} />
            </View>

            {/* Connexions sociales */}
            <TouchableOpacity 
              style={[styles.socialButton, isLoading && styles.continueButtonDisabled]} 
              onPress={handleAppleLogin}
              disabled={isLoading}
            >
              <Ionicons name="logo-apple" size={20} color="#FFFFFF" />
              <Text style={styles.socialButtonText}>
                {isLoading ? 'Connexion...' : 'Sign in with Apple'}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.socialButton} onPress={handleGoogleLogin}>
              <Ionicons name="logo-google" size={20} color="#FFFFFF" />
              <Text style={styles.socialButtonText}>Sign in with Google</Text>
            </TouchableOpacity>
          </View>

          {/* Texte de consentement */}
          <View style={styles.consentContainer}>
            <Text style={styles.consentText}>
              By continuing, you agree to our{' '}
              <Text style={styles.linkText}>Terms of Service</Text>
              {' '}and{' '}
              <Text style={styles.linkText}>Privacy Policy</Text>
            </Text>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1E3A8A', // Bleu foncé selon la maquette
  },
  keyboardView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: 24,
    paddingVertical: 40,
    justifyContent: 'center',
  },
  titleContainer: {
    alignItems: 'center',
    marginBottom: 60,
  },
  appTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 40,
    textAlign: 'center',
  },
  welcomeText: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 8,
    textAlign: 'center',
  },
  subtitleText: {
    fontSize: 16,
    color: '#9CA3AF', // Gris clair
    textAlign: 'center',
    fontWeight: '400',
  },
  formContainer: {
    marginBottom: 40,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 12,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  flagContainer: {
    paddingHorizontal: 16,
    paddingVertical: 16,
    borderRightWidth: 1,
    borderRightColor: 'rgba(255, 255, 255, 0.2)',
  },
  flag: {
    fontSize: 20,
  },
  input: {
    flex: 1,
    paddingHorizontal: 16,
    paddingVertical: 16,
    fontSize: 16,
    color: '#FFFFFF',
  },
  continueButton: {
    backgroundColor: '#3B82F6', // Bleu selon la maquette
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
    marginBottom: 20,
  },
  continueButtonDisabled: {
    opacity: 0.6,
  },
  continueButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  separator: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 20,
  },
  separatorLine: {
    flex: 1,
    height: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
  },
  separatorText: {
    marginHorizontal: 16,
    color: '#9CA3AF',
    fontSize: 14,
  },
  socialButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 12,
    paddingVertical: 16,
    paddingHorizontal: 16,
    marginBottom: 12,
  },
  socialButtonText: {
    marginLeft: 12,
    fontSize: 16,
    color: '#FFFFFF',
    fontWeight: '500',
  },
  consentContainer: {
    marginTop: 40,
    paddingHorizontal: 20,
  },
  consentText: {
    fontSize: 14,
    color: '#9CA3AF',
    lineHeight: 20,
    textAlign: 'center',
  },
  linkText: {
    color: '#3B82F6',
    fontWeight: '500',
  },
});