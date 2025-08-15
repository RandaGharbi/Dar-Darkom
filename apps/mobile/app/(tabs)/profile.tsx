import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, ScrollView, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { useAuth } from '../../context/AuthContext';
import GoBackIcon from '../../assets/images/back.png';
import ChevronIcon from '../../assets/images/chevron.png';
import { getCorrectImageUrl } from '../../utils/imageUtils';

export default function ProfileScreen() {
  const router = useRouter();
  const { user, logout, isAuthenticated } = useAuth();
  const [imageError, setImageError] = useState(false);

  React.useEffect(() => {
    if (!isAuthenticated || !user) {
      router.replace('/'); // Redirection vers la home
    }
  }, [isAuthenticated, router, user]);

  // Réinitialiser l'état de l'image quand l'utilisateur change
  React.useEffect(() => {
    setImageError(false);
  }, [user?.profileImage]);

  if (!isAuthenticated || !user) {
    return null; // N'affiche rien pendant la redirection
  }

  const handleLogout = () => {
    Alert.alert(
      "Déconnexion",
      "Êtes-vous sûr de vouloir vous déconnecter ?",
      [
        { text: "Annuler", style: "cancel" },
        { text: "Déconnexion", style: "destructive", onPress: logout }
      ]
    );
  };

  return (
    <View style={{ flex: 1, backgroundColor: '#fff' }}>
      <ScrollView style={styles.container} contentContainerStyle={{ paddingBottom: 120 }}>
        <View style={styles.headerRow}>
          <TouchableOpacity style={styles.goBackBtn} onPress={() => router.back()}>
            <Image source={GoBackIcon} style={styles.goBackIcon} />
          </TouchableOpacity>
          <Text style={styles.title}>Profil</Text>
          <View style={{ width: 32 }} />
        </View>
        <View style={styles.header}>
          <Image 
            source={
              user.profileImage && !imageError
                ? { uri: getCorrectImageUrl(user.profileImage) || user.profileImage } 
                : require('../../assets/images/avatar.png')
            } 
            style={styles.profileImage}
            onError={() => {
              console.log('❌ Image failed to load:', user.profileImage);
              console.log('❌ Corrected URL:', user.profileImage ? getCorrectImageUrl(user.profileImage) : 'No profile image');
              setImageError(true);
            }}
            onLoad={() => {
              console.log('✅ Image loaded successfully');
              console.log('✅ URL loaded:', user.profileImage ? getCorrectImageUrl(user.profileImage) || user.profileImage : 'No profile image');
              setImageError(false);
            }}
          />
          <Text style={styles.profileName}>{user.name || 'Utilisateur'}</Text>
          <Text style={styles.profileEmail}>{user.email || 'email@example.com'}</Text>
        </View>

        {/* Account Section */}
        <Text style={styles.sectionTitle}>Account</Text>
        <View style={styles.sectionBlock}>
          <TouchableOpacity style={styles.menuItem} onPress={() => router.push('/personal-info')}>
            <Text style={styles.menuText}>Personal Information</Text>
            <Image source={ChevronIcon} style={styles.chevronIcon} />
          </TouchableOpacity>
          <TouchableOpacity style={styles.menuItem} onPress={() => router.push('/payment-methods')}>
            <Text style={styles.menuText}>Payment Methods</Text>
            <Image source={ChevronIcon} style={styles.chevronIcon} />
          </TouchableOpacity>
          <TouchableOpacity style={styles.menuItem} onPress={() => router.push('/shipping-address')}>
            <Text style={styles.menuText}>Addresses</Text>
            <Image source={ChevronIcon} style={styles.chevronIcon} />
          </TouchableOpacity>
        </View>

        {/* Orders Section */}
        <Text style={styles.sectionTitle}>Orders</Text>
        <View style={styles.sectionBlock}>
          <TouchableOpacity style={styles.menuItem} onPress={() => router.push('/order-history')}>
            <Text style={styles.menuText}>Order History</Text>
            <Image source={ChevronIcon} style={styles.chevronIcon} />
          </TouchableOpacity>
        </View>

        {/* Support Section */}
        <Text style={styles.sectionTitle}>Support</Text>
        <View style={styles.sectionBlock}>
          <TouchableOpacity style={styles.menuItem} onPress={() => router.push('/contact-us')}>
            <Text style={styles.menuText}>Contact Us</Text>
            <Image source={ChevronIcon} style={styles.chevronIcon} />
          </TouchableOpacity>
          <TouchableOpacity style={styles.menuItem} onPress={() => router.push('/help-center')}>
            <Text style={styles.menuText}>Help Center</Text>
            <Image source={ChevronIcon} style={styles.chevronIcon} />
          </TouchableOpacity>
        </View>
        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
          <Text style={styles.logoutText}>Se déconnecter</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    paddingTop: 40,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 32,
    marginBottom: 0,
    paddingHorizontal: 8,
  },
  goBackBtn: {
    width: 32,
    height: 32,
    justifyContent: 'center',
    alignItems: 'center',
  },
  goBackIcon: {
    width: 20,
    height: 20,
    resizeMode: 'contain',
    tintColor: '#000',
  },
  headerSpacer: {
    height: 32,
  },
  header: {
    alignItems: 'center',
    marginTop: 12,
    marginBottom: 24,
  },
  profileImage: {
    width: 90,
    height: 90,
    borderRadius: 45,
    marginBottom: 12,
  },
  profileName: {
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 2,
  },
  profileEmail: {
    fontSize: 15,
    color: '#888',
    textAlign: 'center',
    marginBottom: 8,
  },
  profilePhone: {
    fontSize: 15,
    color: '#888',
    textAlign: 'center',
    marginTop: 4,
  },
  sectionTitle: {
    fontSize: 15,
    fontWeight: 'bold',
    color: '#222',
    marginLeft: 24,
    marginTop: 18,
    marginBottom: 2,
  },
  sectionBlock: {
    backgroundColor: '#fff',
    borderRadius: 12,
    marginHorizontal: 12,
    marginBottom: 0,
    paddingVertical: 0,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f3f3f3',
  },
  menuText: {
    fontSize: 14,
    color: '#222',
    marginLeft: 12,
  },
  chevronIcon: {
    width: 18,
    height: 18,
    tintColor: '#222',
    marginLeft: 8,
  },
  logoutButton: {
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: 24,
    marginTop: 36,
    marginBottom: 24,
    paddingVertical: 14,
    borderRadius: 8,
    backgroundColor: '#f8f8f8',
  },
  logoutButtonFixed: {
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: 24,
    marginBottom: 32,
    paddingVertical: 14,
    borderRadius: 8,
    backgroundColor: '#f8f8f8',
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
  },
  logoutText: {
    fontSize: 16,
    color: '#FF3B30',
    fontWeight: '600',
  },
  loginButton: {
    backgroundColor: '#007AFF',
    paddingHorizontal: 30,
    paddingVertical: 12,
    borderRadius: 25,
    alignSelf: 'center',
    marginTop: 40,
  },
  loginButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
  },

}); 