import React, { useState, useCallback, useRef } from 'react';
import { StyleSheet, View, Text, ScrollView, TouchableOpacity, Image, Alert, RefreshControl } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useSafeNavigation } from '../../hooks/useSafeNavigation';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as ImagePicker from 'expo-image-picker';
import SafeAreaWrapper from '../../components/SafeAreaWrapper';
import { useAuth } from '../../context/AuthContext';
import { getFullUrl } from '../../config/api';
import { getCorrectImageUrl } from '../../utils/imageUtils';

export default function ProfileScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { safeBack } = useSafeNavigation();
  const [isScrolled, setIsScrolled] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [imageError, setImageError] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [currentImageUrl, setCurrentImageUrl] = useState<string | null>(null);
  const [isUpdatingProfile, setIsUpdatingProfile] = useState(false);
  const { user, logout, isAuthenticated, refreshUserData } = useAuth();
  
  // Refs pour éviter les dépendances circulaires
  const userRef = useRef(user);
  const refreshUserDataRef = useRef(refreshUserData);
  
  // Mettre à jour les refs quand les valeurs changent
  React.useEffect(() => {
    userRef.current = user;
    refreshUserDataRef.current = refreshUserData;
  });
  
  const handleLogout = async () => {
    Alert.alert(
      'Déconnexion',
      'Êtes-vous sûr de vouloir vous déconnecter ?',
      [
        {
          text: 'Annuler',
          style: 'cancel',
        },
        {
          text: 'Déconnexion',
          style: 'destructive',
          onPress: async () => {
            await logout();
            router.replace('/login');
          },
        },
      ]
    );
  };

  const handleEditProfile = () => {
    router.push('/personal-info');
  };

  // Fonction pour changer la photo de profil
  const changeProfileImage = async () => {
    Alert.alert(
      'Changer la photo de profil',
      'Choisissez une option',
      [
        {
          text: 'Annuler',
          style: 'cancel',
        },
        {
          text: 'Prendre une photo',
          onPress: () => pickImage('camera'),
        },
        {
          text: 'Choisir dans la galerie',
          onPress: () => pickImage('library'),
        },
      ]
    );
  };

  const pickImage = async (source: 'camera' | 'library') => {
    try {
      // Demander les permissions
      if (source === 'camera') {
        const cameraPermission = await ImagePicker.requestCameraPermissionsAsync();
        if (!cameraPermission.granted) {
          Alert.alert('Erreur', 'Permission d\'accéder à la caméra refusée');
          return;
        }
      } else {
        const libraryPermission = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (!libraryPermission.granted) {
          Alert.alert('Erreur', 'Permission d\'accéder à la galerie refusée');
          return;
        }
      }

      // Ouvrir le sélecteur
      const pickerResult = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.7,
      });

      if (pickerResult.canceled) return;

      setUploading(true);
      
      // Uploader l'image
      const asset = pickerResult.assets[0];
      const formData = new FormData();
      formData.append('profileImage', {
        uri: asset.uri,
        name: 'profile.jpg',
        type: 'image/jpeg',
      } as any);

      const response = await fetch(getFullUrl('/api/upload-profile-image'), {
        method: 'POST',
        body: formData,
      });

      if (response.ok) {
        const data = await response.json();
        if (data.url) {
          const correctedImageUrl = getCorrectImageUrl(data.url);
          
          // Mettre à jour le profil avec la nouvelle image
          const updateResponse = await fetch(`${process.env.EXPO_PUBLIC_API_BASE_URL || 'http://192.168.1.74:5000'}/api/update`, {
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${await AsyncStorage.getItem('authToken')}`,
            },
            body: JSON.stringify({
              profileImage: correctedImageUrl
            })
          });

          if (updateResponse.ok) {
            await refreshUserData();
            Alert.alert('Succès', 'Photo de profil mise à jour avec succès');
          } else {
            Alert.alert('Erreur', 'Impossible de mettre à jour le profil');
          }
        }
      } else {
        Alert.alert('Erreur', 'Impossible d\'uploader l\'image');
      }
    } catch (error) {
      console.error('Erreur lors du changement de photo:', error);
      Alert.alert('Erreur', 'Une erreur est survenue');
    } finally {
      setUploading(false);
    }
  };

  const handleOrderHistory = () => {
    router.push('/order-history');
  };

  const handlePaymentMethods = () => {
    router.push('/payment-methods');
  };

  const handleDeliveryAddresses = () => {
    router.push('/personal-info');
  };

  const handleScroll = (event: any) => {
    const scrollY = event.nativeEvent.contentOffset.y;
    setIsScrolled(scrollY > 10);
  };

  const onRefresh = async () => {
    setRefreshing(true);
    try {
      await refreshUserData();
    } catch (error) {
      console.error('❌ Erreur lors du rafraîchissement:', error);
      Alert.alert('Erreur', 'Impossible de rafraîchir les données');
    } finally {
      setRefreshing(false);
    }
  };

  // Fonction pour forcer la mise à jour de la photo de profil
  const updateUserProfileImage = useCallback(async () => {
    const currentUser = userRef.current;
    if (!currentUser?.name || currentUser.profileImage || isUpdatingProfile) return; // Ne pas mettre à jour si déjà une photo ou en cours de mise à jour
    
    setIsUpdatingProfile(true);
    try {
      const avatarUrl = `https://ui-avatars.com/api/?name=${encodeURIComponent(currentUser.name)}&size=200&background=2E86AB&color=ffffff&format=png&bold=true`;
      
      // Appel au backend pour mettre à jour la photo
      const response = await fetch(`${process.env.EXPO_PUBLIC_API_BASE_URL || 'http://192.168.1.74:5000'}/api/update`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${await AsyncStorage.getItem('authToken')}`,
        },
        body: JSON.stringify({
          profileImage: avatarUrl
        })
      });

      if (response.ok) {
        console.log('✅ Photo de profil mise à jour en base');
        // Rafraîchir les données utilisateur
        await refreshUserDataRef.current();
      } else {
        console.log('❌ Erreur lors de la mise à jour de la photo');
      }
    } catch (error) {
      console.error('❌ Erreur lors de la mise à jour de la photo:', error);
    } finally {
      setIsUpdatingProfile(false);
    }
  }, [isUpdatingProfile]); // Seulement isUpdatingProfile comme dépendance


  // Fonction pour déterminer le type de connexion
  const getConnectionType = (user: any) => {
    if (user?.appleId) return 'Apple';
    if (user?.googleId) return 'Google';
    return 'Email';
  };

  // Réinitialiser l'état d'erreur d'image quand l'utilisateur change
  React.useEffect(() => {
    setImageError(false);
  }, [user?.profileImage]);

  // Rafraîchir les données utilisateur au chargement de l'écran
  React.useEffect(() => {
    const refreshData = async () => {
      await refreshUserDataRef.current();
    };
    refreshData();
  }, []); // Pas de dépendances pour éviter la boucle

  // Mettre à jour la photo de profil si l'utilisateur n'en a pas
  React.useEffect(() => {
    if (user && !user.profileImage && user.name) {
      updateUserProfileImage();
    }
  }, [user, updateUserProfileImage]); // Utiliser user complet

  // Utiliser les données utilisateur directement
  const displayName = user?.name || 'Utilisateur';
  // Afficher "privé" pour les utilisateurs connectés avec Apple, sinon utiliser l'email normal
  const displayEmail = getConnectionType(user) === 'Apple' ? 'privé' : (user?.email || 'email@example.com');

  // Gestion stable de l'URL de l'image
  React.useEffect(() => {
    if (user?.profileImage) {
      setCurrentImageUrl(user.profileImage);
    } else {
      // Générer un avatar basé sur le nom si pas d'image
      const avatarUrl = `https://ui-avatars.com/api/?name=${encodeURIComponent(displayName)}&size=120&background=2E86AB&color=ffffff&format=png&bold=true`;
      setCurrentImageUrl(avatarUrl);
    }
  }, [user?.profileImage, displayName]);

  // Gestion de l'erreur d'image - basculer vers l'avatar si erreur
  React.useEffect(() => {
    if (imageError && user?.profileImage) {
      const avatarUrl = `https://ui-avatars.com/api/?name=${encodeURIComponent(displayName)}&size=120&background=2E86AB&color=ffffff&format=png&bold=true`;
      setCurrentImageUrl(avatarUrl);
    }
  }, [imageError, displayName, user?.profileImage]); // Ajouter toutes les dépendances

  // Utiliser l'URL actuelle ou un fallback
  const imageUrl = currentImageUrl || `https://ui-avatars.com/api/?name=${encodeURIComponent(displayName)}&size=120&background=2E86AB&color=ffffff&format=png&bold=true`;

  // Rediriger vers login si pas connecté
  React.useEffect(() => {
    if (!isAuthenticated) {
      router.replace('/login');
    }
  }, [isAuthenticated, router]);

  if (!isAuthenticated) {
    return null;
  }


  return (
    <SafeAreaWrapper backgroundColor="#fff" edges={['top']}>
      {/* Header sticky */}
      <View style={[
        styles.stickyHeader, 
        { top: insets.top },
        isScrolled && styles.stickyHeaderScrolled
      ]}>
        <TouchableOpacity style={styles.backButton} onPress={safeBack}>
          <Ionicons name="arrow-back" size={24} color="#333" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Profil</Text>
        <View style={styles.placeholder} />
      </View>
      
      <ScrollView 
        style={styles.container}
        contentContainerStyle={styles.scrollContent}
        bounces={false}
        showsVerticalScrollIndicator={false}
        onScroll={handleScroll}
        scrollEventThrottle={16}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor="#2E86AB"
            colors={['#2E86AB']}
          />
        }
      >

        {/* Profile Picture and Info */}
        <View style={styles.profileSection}>
          <View style={styles.profilePictureContainer}>
            {uploading ? (
              <View style={[styles.profilePicture, styles.uploadingOverlay]}>
                <Ionicons name="hourglass" size={40} color="#2E86AB" />
                <Text style={styles.uploadingText}>Upload...</Text>
              </View>
            ) : (
              <Image 
                source={{ uri: imageUrl }}
                style={styles.profilePicture}
                onError={(error) => {
                  setImageError(true);
                }}
                onLoad={() => {
                  setImageError(false);
                }}
                onLoadStart={() => {
                }}
              />
            )}
            <TouchableOpacity 
              style={styles.editButton} 
              onPress={changeProfileImage}
              disabled={uploading}
            >
              {uploading ? (
                <Ionicons name="hourglass" size={16} color="#fff" />
              ) : (
                <Ionicons name="camera" size={16} color="#fff" />
              )}
            </TouchableOpacity>
          </View>
          
          <Text style={styles.userName}>
            {displayName}
          </Text>
          <Text style={styles.userEmail}>
            {displayEmail}
          </Text>
          
          {/* Indicateur de connexion */}
          <View style={styles.connectionBadge}>
            <Ionicons 
              name={
                getConnectionType(user) === 'Apple' ? 'logo-apple' : 
                getConnectionType(user) === 'Google' ? 'logo-google' : 
                'mail-outline'
              } 
              size={16} 
              color="#666" 
            />
            <Text style={styles.connectionText}>
              Connecté avec {getConnectionType(user)}
            </Text>
          </View>

          {/* Informations supplémentaires */}
          <View style={styles.userDetailsContainer}>
            {user?.createdAt && (
              <View style={styles.userDetail}>
                <Ionicons name="calendar-outline" size={16} color="#666" />
                <Text style={styles.userDetailText}>
                  Membre depuis {new Date(user.createdAt).toLocaleDateString('fr-FR', { 
                    year: 'numeric', 
                    month: 'long' 
                  })}
                </Text>
              </View>
            )}
          </View>
        </View>

        {/* Quick Actions */}
        <View style={styles.quickActionsContainer}>
          <Text style={styles.sectionTitle}>ACTIONS RAPIDES</Text>
          <View style={styles.quickActions}>
            <TouchableOpacity style={styles.quickAction} onPress={handleEditProfile}>
              <View style={styles.quickActionIcon}>
                <Ionicons name="person-outline" size={24} color="#2E86AB" />
              </View>
              <Text style={styles.quickActionText}>Modifier le profil</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.quickAction} onPress={handleOrderHistory}>
              <View style={styles.quickActionIcon}>
                <Ionicons name="time-outline" size={24} color="#2E86AB" />
              </View>
              <Text style={styles.quickActionText}>Historique</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.quickAction} onPress={handlePaymentMethods}>
              <View style={styles.quickActionIcon}>
                <Ionicons name="card-outline" size={24} color="#2E86AB" />
              </View>
              <Text style={styles.quickActionText}>Paiements</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Account Section */}
        <View style={styles.sectionContainer}>
          <Text style={styles.sectionTitle}>COMPTE</Text>
          <View style={styles.section}>
            <TouchableOpacity style={styles.menuItem} onPress={handleEditProfile}>
              <View style={styles.menuItemLeft}>
                <Ionicons name="person-outline" size={22} color="#666" />
                <Text style={styles.menuItemText}>Informations personnelles</Text>
              </View>
              <Ionicons name="chevron-forward" size={20} color="#666" />
            </TouchableOpacity>
            <TouchableOpacity style={styles.menuItem} onPress={handleDeliveryAddresses}>
              <View style={styles.menuItemLeft}>
                <Ionicons name="location-outline" size={22} color="#666" />
                <Text style={styles.menuItemText}>Adresses de livraison</Text>
              </View>
              <Ionicons name="chevron-forward" size={20} color="#666" />
            </TouchableOpacity>
            <TouchableOpacity style={styles.menuItem} onPress={handlePaymentMethods}>
              <View style={styles.menuItemLeft}>
                <Ionicons name="card-outline" size={22} color="#666" />
                <Text style={styles.menuItemText}>Méthodes de paiement</Text>
              </View>
              <Ionicons name="chevron-forward" size={20} color="#666" />
            </TouchableOpacity>
          </View>
        </View>

        {/* More Section */}
        <View style={styles.sectionContainer}>
          <Text style={styles.sectionTitle}>PLUS</Text>
          <View style={styles.section}>
            <TouchableOpacity style={styles.menuItem} onPress={handleOrderHistory}>
              <View style={styles.menuItemLeft}>
                <Ionicons name="receipt-outline" size={22} color="#666" />
                <Text style={styles.menuItemText}>Historique des commandes</Text>
              </View>
              <Ionicons name="chevron-forward" size={20} color="#666" />
            </TouchableOpacity>
            <TouchableOpacity style={styles.menuItem}>
              <View style={styles.menuItemLeft}>
                <Ionicons name="notifications-outline" size={22} color="#666" />
                <Text style={styles.menuItemText}>Paramètres de notification</Text>
              </View>
              <Ionicons name="chevron-forward" size={20} color="#666" />
            </TouchableOpacity>
            <TouchableOpacity style={styles.menuItem}>
              <View style={styles.menuItemLeft}>
                <Ionicons name="heart-outline" size={22} color="#666" />
                <Text style={styles.menuItemText}>Plats favoris</Text>
              </View>
              <Ionicons name="chevron-forward" size={20} color="#666" />
            </TouchableOpacity>
            <TouchableOpacity style={styles.menuItem}>
              <View style={styles.menuItemLeft}>
                <Ionicons name="help-circle-outline" size={22} color="#666" />
                <Text style={styles.menuItemText}>Aide & Support</Text>
              </View>
              <Ionicons name="chevron-forward" size={20} color="#666" />
            </TouchableOpacity>
          </View>
        </View>

        {/* Log Out Button */}
        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
          <Ionicons name="log-out-outline" size={20} color="#FF3B30" />
          <Text style={styles.logoutText}>Se déconnecter</Text>
        </TouchableOpacity>

        {/* Version info */}
        <View style={styles.versionContainer}>
          <Text style={styles.versionText}>Version 1.0.0</Text>
        </View>
      </ScrollView>
    </SafeAreaWrapper>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  scrollContent: {
    flexGrow: 1,
    paddingTop: 100, // Espace pour le header sticky + safe area
    paddingBottom: 40,
  },
  stickyHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 16,
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 1000,
    backgroundColor: 'rgba(248, 249, 250, 0.95)',
    backdropFilter: 'blur(10px)',
  },
  stickyHeaderScrolled: {
    backgroundColor: 'rgba(248, 249, 250, 0.98)',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  backButton: {
    padding: 8,
  },
  placeholder: {
    width: 40,
    height: 40,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  profileSection: {
    alignItems: 'center',
    paddingVertical: 32,
    paddingHorizontal: 20,
    backgroundColor: '#fff',
    marginHorizontal: 16,
    borderRadius: 16,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  profilePictureContainer: {
    position: 'relative',
    marginBottom: 20,
  },
  profilePicture: {
    width: 120,
    height: 120,
    borderRadius: 60,
    borderWidth: 4,
    borderColor: '#fff',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 8,
  },
  editButton: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#2E86AB',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
  },
  userName: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
  },
  userEmail: {
    fontSize: 16,
    color: '#666',
    marginBottom: 12,
  },
  connectionBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    marginBottom: 16,
  },
  connectionText: {
    fontSize: 12,
    color: '#666',
    marginLeft: 6,
    fontWeight: '500',
  },
  userDetailsContainer: {
    width: '100%',
    marginTop: 8,
  },
  userDetail: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
    paddingHorizontal: 16,
  },
  userDetailText: {
    fontSize: 14,
    color: '#666',
    marginLeft: 12,
    flex: 1,
  },
  defaultAvatar: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: '#2E86AB',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 4,
    borderColor: '#fff',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 8,
  },
  avatarText: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#fff',
  },
  quickActionsContainer: {
    marginBottom: 20,
  },
  quickActions: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    backgroundColor: '#fff',
    marginHorizontal: 16,
    borderRadius: 16,
    paddingVertical: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  quickAction: {
    alignItems: 'center',
    flex: 1,
  },
  quickActionIcon: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#f0f8ff',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  quickActionText: {
    fontSize: 12,
    color: '#333',
    fontWeight: '500',
    textAlign: 'center',
  },
  sectionContainer: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#666',
    marginBottom: 12,
    marginLeft: 20,
    letterSpacing: 1,
  },
  section: {
    backgroundColor: '#fff',
    marginHorizontal: 16,
    borderRadius: 16,
    paddingHorizontal: 20,
    paddingVertical: 8,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f5f5f5',
  },
  menuItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  menuItemText: {
    fontSize: 16,
    color: '#333',
    marginLeft: 16,
    fontWeight: '500',
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#fff',
    marginHorizontal: 16,
    marginVertical: 20,
    paddingVertical: 16,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#FFE5E5',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  logoutText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FF3B30',
    marginLeft: 8,
  },
  versionContainer: {
    alignItems: 'center',
    paddingBottom: 20,
  },
  versionText: {
    fontSize: 12,
    color: '#999',
    fontStyle: 'italic',
  },
  uploadingOverlay: {
    backgroundColor: '#f8f9fa',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#2E86AB',
    borderStyle: 'dashed',
  },
  uploadingText: {
    fontSize: 12,
    color: '#2E86AB',
    marginTop: 8,
    fontWeight: '600',
  },
});