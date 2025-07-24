import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, SafeAreaView, ScrollView, Image, Alert, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import visaImg from '../assets/images/visa.png';
import mastercardImg from '../assets/images/masterCard.png';
import { apiService } from '../services/api';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useAuth } from '../context/AuthContext';

function getCardType(cardNumber: string): 'visa' | 'mastercard' | 'unknown' {
  if (/^4[0-9]{0,}$/.test(cardNumber)) {
    return 'visa';
  }
  if (
    /^5[1-5][0-9]{0,}$/.test(cardNumber) ||
    /^2(2[2-9][1-9]|2[3-9][0-9]|[3-6][0-9]{2}|7[01][0-9]|720)[0-9]{0,}$/.test(cardNumber)
  ) {
    return 'mastercard';
  }
  return 'unknown';
}

function formatExpiryDate(text: string) {
  let cleaned = text.replace(/[^0-9]/g, '');
  if (cleaned.length > 4) cleaned = cleaned.slice(0, 4);
  if (cleaned.length >= 3) {
    return cleaned.slice(0, 2) + '/' + cleaned.slice(2);
  }
  return cleaned;
}

export default function PaymentScreen() {
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();
  const [cardNumber, setCardNumber] = useState('');
  const [cvv, setCvv] = useState('');
  const [nameOnCard, setNameOnCard] = useState('');
  const [billingAddress, setBillingAddress] = useState('');
  const [city, setCity] = useState('');
  const [state, setState] = useState('');
  const [zipCode, setZipCode] = useState('');
  const [country, setCountry] = useState('');
  const [expiryDate, setExpiryDate] = useState('');
  const [loading, setLoading] = useState(false);
  const cardType = getCardType(cardNumber);

  if (authLoading) {
    return <ActivityIndicator style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }} />;
  }

  const handleAddCard = async () => {
    if (!user?._id) {
      Alert.alert('Erreur', 'Vous devez être connecté pour ajouter une carte.');
      return;
    }
    if (!cardNumber || !expiryDate || !cvv || !nameOnCard || !billingAddress || !city || !state || !zipCode || !country) {
      Alert.alert('Erreur', 'Merci de remplir tous les champs.');
      return;
    }
    setLoading(true);
    try {
      const token = await AsyncStorage.getItem('authToken');
      if (!token) {
        Alert.alert('Erreur', 'Token d\'authentification manquant');
        setLoading(false);
        return;
      }
      const cardData = {
        userId: user._id,
        cardNumber: cardNumber.replace(/\s/g, ''),
        expiryDate,
        cvv,
        nameOnCard,
        billingAddress,
        city,
        state,
        zipCode,
        country
      };
      // Log debug pour vérifier les champs envoyés
      const response = await apiService.addCard(cardData, token);
      if (response.success) {
        Alert.alert('Succès', 'Votre carte a été ajoutée avec succès !', [
          { text: 'OK', onPress: () => router.replace('/payment-methods') }
        ]);
      } else {
        Alert.alert('Erreur', response.error || "Erreur lors de l'ajout de la carte");
      }
    } catch (error) {
      console.error('Erreur lors de l\'ajout de la carte:', error);
      Alert.alert('Erreur', "Erreur lors de l'ajout de la carte");
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.headerRow}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <Text style={styles.backText}>←</Text>
        </TouchableOpacity>
        <Text style={styles.title}>Payment</Text>
        <View style={{ width: 32 }} />
      </View>
      <ScrollView contentContainerStyle={{ paddingHorizontal: 20, paddingTop: 8, paddingBottom: 100 }} keyboardShouldPersistTaps="handled">
        <Text style={styles.sectionTitle}>Add a payment method</Text>
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <TextInput
            style={[styles.input, { flex: 1 }]}
            value={cardNumber}
            onChangeText={setCardNumber}
            keyboardType="numeric"
            maxLength={19}
            placeholder="Numéro de carte"
          />
          {cardType === 'visa' && (
            <Image source={visaImg} style={{ width: 32, height: 20, marginLeft: 8 }} />
          )}
          {cardType === 'mastercard' && (
            <Image source={mastercardImg} style={{ width: 32, height: 20, marginLeft: 8 }} />
          )}
        </View>
        <TextInput
          style={[styles.input, { marginBottom: 12 }]}
          placeholder="MM/YY"
          value={expiryDate}
          keyboardType="number-pad"
          maxLength={5}
          onChangeText={text => setExpiryDate(formatExpiryDate(text))}
        />
        <TextInput
          style={[styles.input, { marginBottom: 12 }]}
          placeholder="CVV"
          keyboardType="number-pad"
          value={cvv}
          onChangeText={setCvv}
        />
        <TextInput 
          style={styles.input} 
          placeholder="Name on card"
          value={nameOnCard}
          onChangeText={setNameOnCard}
        />
        <TextInput 
          style={styles.input} 
          placeholder="Billing address"
          value={billingAddress}
          onChangeText={setBillingAddress}
        />
        <View style={styles.row}>
          <TextInput 
            style={[styles.input, styles.inputHalf]} 
            placeholder="City"
            value={city}
            onChangeText={setCity}
          />
          <TextInput 
            style={[styles.input, styles.inputHalf, { marginLeft: 8 }]} 
            placeholder="State"
            value={state}
            onChangeText={setState}
          />
        </View>
        <View style={styles.row}>
          <TextInput 
            style={[styles.input, styles.inputHalf]} 
            placeholder="Zip code" 
            keyboardType="number-pad"
            value={zipCode}
            onChangeText={setZipCode}
          />
          <TextInput 
            style={[styles.input, styles.inputHalf, { marginLeft: 8 }]} 
            placeholder="Country"
            value={country}
            onChangeText={setCountry}
          />
        </View>
      </ScrollView>
      <TouchableOpacity style={styles.addBtn} onPress={handleAddCard} disabled={loading}>
        {loading ? <ActivityIndicator color="#000" /> : <Text style={styles.addBtnText}>Add card</Text>}
      </TouchableOpacity>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 40,
    marginBottom: 12,
    paddingHorizontal: 16,
  },
  backBtn: {
    width: 32,
    height: 32,
    justifyContent: 'center',
    alignItems: 'center',
  },
  backText: { fontSize: 20, fontWeight: 'bold' },
  title: { fontSize: 18, fontWeight: 'bold', textAlign: 'center' },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 18,
    marginTop: 8,
  },
  input: {
    backgroundColor: '#F6F3F2',
    borderRadius: 8,
    padding: 14,
    marginBottom: 12,
    fontSize: 15,
  },
  row: { flexDirection: 'row', justifyContent: 'space-between' },
  inputHalf: { flex: 1 },
  addBtn: {
    backgroundColor: '#F6E2C3',
    borderRadius: 25,
    padding: 14,
    alignItems: 'center',
    marginHorizontal: 20,
    marginBottom: 24,
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
  },
  addBtnText: { color: '#000', fontWeight: 'bold', fontSize: 16 },
}); 