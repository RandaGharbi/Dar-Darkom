import React from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View, Image } from 'react-native';

import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';

import ContactInfo from '../components/ContactInfo';
import ContactFormScreen from '../components/screens/ContactFormScreen';
import goBackIcon from '../assets/images/back.png';

const ContactUsPage: React.FC = () => {
  const router = useRouter();

  return (
    <SafeAreaView style={styles.safe}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.goBackButton} onPress={() => router.back()}>
          <Image source={goBackIcon} style={styles.goBackIcon} />
        </TouchableOpacity>

        <Text style={styles.headerTitle}>Contact Us</Text>

        <View style={styles.goBackButton} /> {/* placeholder pour équilibrer */}
      </View>

      {/* Content */}
      <ScrollView contentContainerStyle={styles.container}>
        <View style={styles.inner}>
          <ContactInfo />
          <ContactFormScreen />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default ContactUsPage;

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 60,
    paddingHorizontal: 16,
    backgroundColor: '#fff',
    justifyContent: 'space-between',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
    flex: 1,
  },
  goBackButton: {
    padding: 8,
    width: 40,
    alignItems: 'flex-start',
  },
  goBackIcon: {
    width: 24,
    height: 24,
    tintColor: 'black',
    resizeMode: 'contain',
  },
  container: {
    flexGrow: 1,
    paddingHorizontal: 20,
    paddingBottom: 40,
  },
  inner: {
    paddingTop: 30,
  },
});
