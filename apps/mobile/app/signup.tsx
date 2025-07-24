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
  Platform,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useAuth } from '../context/AuthContext';
import uploadImg from '../assets/images/upload.png';
import * as ImagePicker from 'expo-image-picker';
import { ImagePickerResult, ImagePickerAsset } from 'expo-image-picker';
import API_CONFIG, { getFullUrl } from '../config/api';
import { getCorrectImageUrl } from '../utils/imageUtils';

type SignupProps = object;
const SignupScreen: React.FC<SignupProps> = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [profileImage, setProfileImage] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);

  const router = useRouter();
  const { signup, isAuthenticated, loading: authLoading } = useAuth();

  // Rediriger si déjà connecté
  useEffect(() => {
    if (!authLoading && isAuthenticated) {
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

  const handleSignup = async (profileImageUrl?: string | null) => {
    if (!name || !email || !password) {
      Alert.alert('Erreur', 'Tous les champs sont requis');
      return;
    }

    setLoading(true);

    const success = await signup(name, email, password, profileImageUrl || undefined);

    setLoading(false);

    if (success) {
      Alert.alert('Succès', 'Compte créé avec succès', [
        {
          text: 'OK',
          onPress: () => router.replace('/login')
        }
      ]);
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

  // Si déjà connecté, ne pas afficher l'écran de signup
  if (isAuthenticated) {
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
          style={styles.input}
          placeholder="Enter your name"
          value={name}
          onChangeText={setName}
          autoCapitalize="words"
        />

        <Text style={styles.label}>Email</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter your email"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
        />

        <Text style={styles.label}>Password</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter your password"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
        />
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
});

export default SignupScreen;
