import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  Alert,
  ActivityIndicator,
  Image,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useAuth } from '../context/AuthContext';
import uploadImg from '../assets/images/upload.png';
import * as ImagePicker from 'expo-image-picker';
import { ImagePickerResult, ImagePickerAsset } from 'expo-image-picker';
import { getFullUrl } from '../config/api';
import { getCorrectImageUrl } from '../utils/imageUtils';

type SignupProps = object;

// Fonctions de validation
const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

const validatePassword = (password: string): { isValid: boolean; errors: string[] } => {
  const errors: string[] = [];
  
  if (password.length < 6) {
    errors.push('Au moins 6 caractères');
  }
  if (!/\d/.test(password)) {
    errors.push('Au moins 1 chiffre');
  }
  if (!/[a-z]/.test(password)) {
    errors.push('Au moins 1 lettre minuscule');
  }
  if (!/[A-Z]/.test(password)) {
    errors.push('Au moins 1 lettre majuscule');
  }
  if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
    errors.push('Au moins 1 caractère spécial');
  }
  
  return { isValid: errors.length === 0, errors };
};

const validateName = (name: string): boolean => {
  return name.trim().length >= 2;
};

const SignupScreen: React.FC<SignupProps> = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [profileImage, setProfileImage] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  
  // États de validation
  const [nameError, setNameError] = useState('');
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [showPasswordErrors, setShowPasswordErrors] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const router = useRouter();
  const { signup, isAuthenticated, loading: authLoading } = useAuth();

  // Rediriger si déjà connecté
  useEffect(() => {
    console.log('🔄 Auth state changed:', { authLoading, isAuthenticated });
    if (!authLoading && isAuthenticated) {
      console.log('🚀 Redirecting to home from signup screen...');
      router.replace('/');
    }
  }, [authLoading, isAuthenticated, router]);

  // Fonction pour sélectionner et uploader l'image
  const pickAndUploadImage = async () => {
    // Demander la permission
    const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permissionResult.granted) {
      alert('Permission d\'accéder à la galerie refusée');
      return;
    }
    // Ouvrir le sélecteur
    const pickerResult: ImagePickerResult = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.7,
    });
    if (pickerResult.canceled) return;
    setUploading(true);
    try {
      const asset: ImagePickerAsset = pickerResult.assets[0];
      const uri = asset.uri;
      const formData = new FormData();
      formData.append('profileImage', {
        uri,
        name: 'profile.jpg',
        type: 'image/jpeg',
      } as any);
      const res = await fetch(getFullUrl('/api/upload-profile-image'), {
        method: 'POST',
        body: formData,
      });
      const text = await res.text();
      if (res.ok) {
        try {
          const data = JSON.parse(text);
          if (data.url) {
            // Utiliser l'URL retournée par le backend et la corriger si nécessaire
            const correctedImageUrl = getCorrectImageUrl(data.url);
            setProfileImage(correctedImageUrl);
          } else {
            Alert.alert('Erreur', 'Réponse inattendue du serveur');
          }
        } catch (error) {
          console.error('Erreur lors de la récupération de l\'image:', error);
          Alert.alert('Erreur', 'Réponse non JSON du serveur');
        }
      } else {
        Alert.alert('Erreur', text);
      }
    } catch (error) {
      console.error('Erreur lors de l\'upload de l\'image:', error);
      Alert.alert('Erreur', 'Erreur lors de l\'upload de l\'image');
    }
    setUploading(false);
  };

  // Fonctions de validation en temps réel
  const validateNameField = (value: string) => {
    if (value.length > 0 && !validateName(value)) {
      setNameError('Le nom et le prénom doit contenir au moins 20 caractères');
    } else {
      setNameError('');
    }
  };

  const validateEmailField = (value: string) => {
    if (value.length > 0 && !validateEmail(value)) {
      setEmailError('Veuillez entrer un email valide');
    } else {
      setEmailError('');
    }
  };

  const validatePasswordField = (value: string) => {
    const validation = validatePassword(value);
    if (value.length > 0 && !validation.isValid) {
      setPasswordError(validation.errors.join(', '));
    } else {
      setPasswordError('');
    }
  };

  const handleSignup = async (profileImageUrl?: string | null) => {
    // Validation complète avant soumission
    const nameValidation = validateName(name);
    const emailValidation = validateEmail(email);
    const passwordValidation = validatePassword(password);

    if (!nameValidation) {
      setNameError('Le nom doit contenir au moins 2 caractères');
    }
    if (!emailValidation) {
      setEmailError('Veuillez entrer un email valide');
    }
    if (!passwordValidation.isValid) {
      setPasswordError(passwordValidation.errors.join(', '));
      setShowPasswordErrors(true);
    }

    if (!nameValidation || !emailValidation || !passwordValidation.isValid) {
      Alert.alert('Erreur de validation', 'Veuillez corriger les erreurs dans le formulaire');
      return;
    }

    setLoading(true);

    const success = await signup(name, email, password, profileImageUrl || undefined);

    setLoading(false);

    if (success) {
      console.log('✅ Signup successful, user should be automatically redirected...');
      // La redirection se fera automatiquement via le useEffect quand isAuthenticated devient true
    }
  };

  // Afficher un loader pendant la vérification de l'état d'authentification
  if (authLoading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#F5A623" />
          <Text style={styles.loadingText}>Chargement...</Text>
        </View>
      </SafeAreaView>
    );
  }

  // Si déjà connecté, rediriger vers l'accueil
  if (isAuthenticated) {
    console.log('🚀 User is authenticated, redirecting to home...');
    router.replace('/');
    return null;
  }

  return (
    <SafeAreaView style={styles.container}>
      <TouchableOpacity style={styles.closeIcon} onPress={() => router.back()}>
        <Text style={{ fontSize: 22 }}>×</Text>
      </TouchableOpacity>
      <Text style={styles.title}>Create your account</Text>

      {/* Sous-container pour les champs du formulaire */}
      <View style={styles.formFieldsContainer}>
        {/* Upload Profile Image */}
        <TouchableOpacity style={styles.profileImageContainer} onPress={pickAndUploadImage} activeOpacity={0.7} disabled={uploading}>
          <View style={styles.uploadRow}>
            <View style={styles.uploadIconBg}>
              {profileImage ? (
                <Image source={{ uri: getCorrectImageUrl(profileImage) || profileImage }} style={styles.uploadImage} resizeMode="cover" />
              ) : (
                <Image source={uploadImg} style={styles.uploadImage} resizeMode="contain" />
              )}
            </View>
            <Text style={styles.profileImageText}>{uploading ? 'Uploading...' : 'Upload Profile Image'}</Text>
          </View>
        </TouchableOpacity>

        <Text style={styles.label}>Name</Text>
        <TextInput
          style={[styles.input, nameError ? styles.inputError : null]}
          placeholder="Enter your name"
          value={name}
          onChangeText={(text) => {
            setName(text);
            validateNameField(text);
          }}
          autoCapitalize="words"
          autoCorrect={false}
          spellCheck={false}
          textContentType="none"
          keyboardType="default"
          returnKeyType="next"
          blurOnSubmit={false}
          autoComplete="off"
        />
        {nameError ? <Text style={styles.errorText}>{nameError}</Text> : null}

        <Text style={styles.label}>Email</Text>
        <TextInput
          style={[styles.input, emailError ? styles.inputError : null]}
          placeholder="Enter your email"
          value={email}
          onChangeText={(text) => {
            setEmail(text);
            validateEmailField(text);
          }}
          keyboardType="email-address"
          autoCapitalize="none"
          autoCorrect={false}
          spellCheck={false}
          textContentType="none"
        />
        {emailError ? <Text style={styles.errorText}>{emailError}</Text> : null}

        <Text style={styles.label}>Password</Text>
        <View style={styles.passwordContainer}>
                    <TextInput
            style={[styles.input, styles.passwordInput, passwordError ? styles.inputError : null]}
            placeholder="Enter your password"
            value={password}
            onChangeText={(text) => {
              setPassword(text);
              validatePasswordField(text);
            }}
            secureTextEntry={!showPassword}
            onFocus={() => setShowPasswordErrors(true)}
            autoCapitalize="none"
            autoCorrect={false}
            spellCheck={false}
            textContentType="none"
            keyboardType="default"
          />
          <TouchableOpacity
            style={styles.eyeButton}
            onPress={() => setShowPassword(!showPassword)}
          >
            <Ionicons 
              name={showPassword ? "eye-off" : "eye"} 
              size={20} 
              color="#666" 
            />
          </TouchableOpacity>
        </View>
        {passwordError && showPasswordErrors ? <Text style={styles.errorText}>{passwordError}</Text> : null}
      </View>

      <TouchableOpacity
        style={[styles.signupBtn, loading && { opacity: 0.7 }]}
        onPress={() => handleSignup(profileImage)}
        disabled={loading}
      >
        {loading ? (
          <ActivityIndicator color="#000" />
        ) : (
          <Text style={styles.signupText}>Sign up</Text>
        )}
      </TouchableOpacity>

      <TouchableOpacity onPress={() => router.push('/login')}>
        <Text style={styles.loginLink}>
          Already have an account? <Text style={styles.loginLinkAccent}>Log in</Text>
        </Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff', paddingHorizontal: 32, paddingTop: 20 },
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
  closeIcon: { position: 'absolute', top: 20, right: 20, zIndex: 1 },
  title: { fontSize: 28, fontWeight: 'bold', textAlign: 'center', marginTop: 48, marginBottom: 18 },
  profileImageContainer: {
    marginBottom: 18,
    marginTop: 4,
  },
  uploadRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
  },
  uploadIconBg: {
    backgroundColor: '#F6F3F2',
    borderRadius: 24,
    width: 48,
    height: 48,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.07,
    shadowRadius: 4,
    elevation: 2,
  },
  uploadImage: {
    width: 24,
    height: 24,
    tintColor: '#000',
  },
  label: { fontWeight: 'bold', marginTop: 10, marginBottom: 4, fontSize: 15 },
  input: {
    backgroundColor: '#F6F3F2',
    borderRadius: 14,
    paddingVertical: 14,
    paddingHorizontal: 14,
    marginBottom: 10,
    fontSize: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 2,
    elevation: 1,
  },
  signupBtn: {
    backgroundColor: '#ED9926',
    borderRadius: 24,
    paddingVertical: 14,
    width: '70%',
    alignItems: 'center',
    alignSelf: 'center',
    marginTop: 24,
    shadowColor: '#ED9926',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.18,
    shadowRadius: 6,
    elevation: 3,
  },
  signupText: { color: '#000', fontWeight: 'bold', fontSize: 16 },
  loginLink: {
    color: '#6B4F2B',
    fontSize: 14,
    textAlign: 'center',
    marginTop: 18,
  },
  loginLinkAccent: {
    color: '#6B4F2B',
    textDecorationLine: 'underline',
  },
  inputError: {
    // Pas de bordure rouge
  },
  errorText: {
    color: '#ff4444',
    fontSize: 12,
    marginBottom: 8,
    marginLeft: 4,
  },
  formFieldsContainer: {
    paddingHorizontal: 32,
    width: '100%',
  },
  profileImageText: {
    color: '#B0AFAF',
    fontSize: 13,
    marginLeft: 14,
    backgroundColor: 'transparent',
  },
  passwordContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  passwordInput: {
    flex: 1,
    marginBottom: 0,
  },
  eyeButton: {
    position: 'absolute',
    right: 14,
    padding: 8,
  },

});

export default SignupScreen;
