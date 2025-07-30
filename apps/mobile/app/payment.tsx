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
  
  // États pour la validation
  const [errors, setErrors] = useState<{[key: string]: string}>({});
  const [, setTouched] = useState<{[key: string]: boolean}>({});
  
  const cardType = getCardType(cardNumber);

  // Fonctions de validation
  const validateCardNumber = (number: string): string => {
    const cleaned = number.replace(/\s/g, '');
    if (!cleaned) return 'Le numéro de carte est requis';
    if (cleaned.length < 11 || cleaned.length > 19) return 'Le numéro de carte doit contenir 11 chiffres';
    if (!/^\d+$/.test(cleaned)) return 'Le numéro de carte ne doit contenir que des chiffres';
    return '';
  };

  const validateExpiryDate = (date: string): string => {
    if (!date) return 'La date d\'expiration est requise';
    if (!/^\d{2}\/\d{2}$/.test(date)) return '';
    
    const [month, year] = date.split('/');
    const monthNum = parseInt(month);
    const yearNum = parseInt(year);
    const currentYear = new Date().getFullYear() % 100;
    const currentMonth = new Date().getMonth() + 1;
    
    if (monthNum < 1 || monthNum > 12) return 'Mois invalide';
    if (yearNum < currentYear || (yearNum === currentYear && monthNum < currentMonth)) {
      return 'La carte a expiré';
    }
    return '';
  };

  const validateCVV = (cvv: string): string => {
    if (!cvv) return 'Le CVV est requis';
    if (!/^\d{3}$/.test(cvv)) return 'Le CVV doit contenir exactement 3 chiffres';
    return '';
  };

  const validateName = (name: string): string => {
    if (!name.trim()) return 'Le nom est requis';
    if (name.trim().length < 2) return 'Le nom doit contenir au moins 2 caractères';
    if (!/^[a-zA-Z\s]+$/.test(name.trim())) return 'Le nom ne doit contenir que des lettres';
    return '';
  };

  const validateAddress = (address: string): string => {
    if (!address.trim()) return 'L\'adresse est requise';
    if (address.trim().length < 5) return 'L\'adresse doit contenir au moins 5 caractères';
    return '';
  };

  const validateCity = (city: string): string => {
    if (!city.trim()) return 'La ville est requise';
    if (city.trim().length < 2) return 'La ville doit contenir au moins 2 caractères';
    return '';
  };

  const validateState = (state: string): string => {
    if (!state.trim()) return 'L\'état est requis';
    if (state.trim().length < 2) return 'L\'état doit contenir au moins 2 caractères';
    return '';
  };

  const validateZipCode = (zipCode: string): string => {
    if (!zipCode.trim()) return 'Le code postal est requis';
    if (!/^\d{5}(-\d{4})?$/.test(zipCode.trim())) return 'Format de code postal invalide';
    return '';
  };

  const validateCountry = (country: string): string => {
    if (!country.trim()) return 'Le pays est requis';
    if (country.trim().length < 2) return 'Le pays doit contenir au moins 2 caractères';
    return '';
  };

  // Validation complète
  const validateForm = (): boolean => {
    const newErrors: {[key: string]: string} = {};
    
    newErrors.cardNumber = validateCardNumber(cardNumber);
    newErrors.expiryDate = validateExpiryDate(expiryDate);
    newErrors.cvv = validateCVV(cvv);
    newErrors.nameOnCard = validateName(nameOnCard);
    newErrors.billingAddress = validateAddress(billingAddress);
    newErrors.city = validateCity(city);
    newErrors.state = validateState(state);
    newErrors.zipCode = validateZipCode(zipCode);
    newErrors.country = validateCountry(country);
    
    setErrors(newErrors);
    
    return !Object.values(newErrors).some(error => error !== '');
  };

  // Validation en temps réel
  const handleFieldChange = (field: string, value: string) => {
    let validationError = '';
    
    switch (field) {
      case 'cardNumber':
        setCardNumber(value);
        validationError = validateCardNumber(value);
        break;
      case 'expiryDate':
        setExpiryDate(formatExpiryDate(value));
        validationError = validateExpiryDate(formatExpiryDate(value));
        break;
      case 'cvv':
        setCvv(value);
        validationError = validateCVV(value);
        break;
      case 'nameOnCard':
        setNameOnCard(value);
        validationError = validateName(value);
        break;
      case 'billingAddress':
        setBillingAddress(value);
        validationError = validateAddress(value);
        break;
      case 'city':
        setCity(value);
        validationError = validateCity(value);
        break;
      case 'state':
        setState(value);
        validationError = validateState(value);
        break;
      case 'zipCode':
        setZipCode(value);
        validationError = validateZipCode(value);
        break;
      case 'country':
        setCountry(value);
        validationError = validateCountry(value);
        break;
    }
    
    setErrors(prev => ({ ...prev, [field]: validationError }));
    // Marquer le champ comme touché dès qu'on commence à taper
    setTouched(prev => ({ ...prev, [field]: true }));
  };

  const handleFieldBlur = (field: string) => {
    setTouched(prev => ({ ...prev, [field]: true }));
  };

  if (authLoading) {
    return <ActivityIndicator style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }} />;
  }

  const handleAddCard = async () => {
    if (!user?._id) {
      Alert.alert('Erreur', 'Vous devez être connecté pour ajouter une carte.');
      return;
    }

    // Validation complète du formulaire
    if (!validateForm()) {
      Alert.alert('Erreur de validation', 'Veuillez corriger les erreurs dans le formulaire.');
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
        nameOnCard: nameOnCard.trim(),
        billingAddress: billingAddress.trim(),
        city: city.trim(),
        state: state.trim(),
        zipCode: zipCode.trim(),
        country: country.trim()
      };
      
      const response = await apiService.addCard(cardData, token);
      if (response.success) {
        Alert.alert('Succès', 'Votre carte a été ajoutée avec succès !', [
          { text: 'OK', onPress: () => router.replace('/checkout') }
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
            style={[
              styles.input, 
              { flex: 1 },
              errors.cardNumber ? styles.inputError : null
            ]}
            value={cardNumber}
            onChangeText={(value) => handleFieldChange('cardNumber', value)}
            onBlur={() => handleFieldBlur('cardNumber')}
            keyboardType="numeric"
            maxLength={11}
            placeholder="Numéro de carte"
          />
          {cardType === 'visa' && (
            <Image source={visaImg} style={{ width: 32, height: 20, marginLeft: 8 }} />
          )}
          {cardType === 'mastercard' && (
            <Image source={mastercardImg} style={{ width: 32, height: 20, marginLeft: 8 }} />
          )}
        </View>
        {errors.cardNumber && (
          <Text style={styles.errorText}>{errors.cardNumber}</Text>
        )}
        
        <TextInput
          style={[
            styles.input, 
            { marginBottom: 12 },
            errors.expiryDate ? styles.inputError : null
          ]}
          placeholder="MM/YY"
          value={expiryDate}
          keyboardType="number-pad"
          maxLength={5}
          onChangeText={(text) => handleFieldChange('expiryDate', text)}
          onBlur={() => handleFieldBlur('expiryDate')}
        />
        {errors.expiryDate && (
          <Text style={styles.errorText}>{errors.expiryDate}</Text>
        )}
        
        <TextInput
          style={[
            styles.input, 
            { marginBottom: 12 },
            errors.cvv ? styles.inputError : null
          ]}
          placeholder="CVV"
          keyboardType="number-pad"
          maxLength={3}
          value={cvv}
          onChangeText={(value) => handleFieldChange('cvv', value)}
          onBlur={() => handleFieldBlur('cvv')}
        />
        {errors.cvv && (
          <Text style={styles.errorText}>{errors.cvv}</Text>
        )}
        
        <TextInput 
          style={[
            styles.input,
            errors.nameOnCard ? styles.inputError : null
          ]} 
          placeholder="Name on card"
          value={nameOnCard}
          onChangeText={(value) => handleFieldChange('nameOnCard', value)}
          onBlur={() => handleFieldBlur('nameOnCard')}
        />
        {errors.nameOnCard && (
          <Text style={styles.errorText}>{errors.nameOnCard}</Text>
        )}
        
        <TextInput 
          style={[
            styles.input,
            errors.billingAddress ? styles.inputError : null
          ]} 
          placeholder="Billing address"
          value={billingAddress}
          onChangeText={(value) => handleFieldChange('billingAddress', value)}
          onBlur={() => handleFieldBlur('billingAddress')}
        />
        {errors.billingAddress && (
          <Text style={styles.errorText}>{errors.billingAddress}</Text>
        )}
        <View style={styles.row}>
          <TextInput 
            style={[
              styles.input, 
              styles.inputHalf,
              errors.city ? styles.inputError : null
            ]} 
            placeholder="City"
            value={city}
            onChangeText={(value) => handleFieldChange('city', value)}
            onBlur={() => handleFieldBlur('city')}
          />
          <TextInput 
            style={[
              styles.input, 
              styles.inputHalf, 
              { marginLeft: 8 },
              errors.state ? styles.inputError : null
            ]} 
            placeholder="State"
            value={state}
            onChangeText={(value) => handleFieldChange('state', value)}
            onBlur={() => handleFieldBlur('state')}
          />
        </View>
        {errors.city && (
          <Text style={styles.errorText}>{errors.city}</Text>
        )}
        {errors.state && (
          <Text style={styles.errorText}>{errors.state}</Text>
        )}
        
        <View style={styles.row}>
          <TextInput 
            style={[
              styles.input, 
              styles.inputHalf,
              errors.zipCode ? styles.inputError : null
            ]} 
            placeholder="Zip code" 
            keyboardType="number-pad"
            value={zipCode}
            onChangeText={(value) => handleFieldChange('zipCode', value)}
            onBlur={() => handleFieldBlur('zipCode')}
          />
          <TextInput 
            style={[
              styles.input, 
              styles.inputHalf, 
              { marginLeft: 8 },
              errors.country ? styles.inputError : null
            ]} 
            placeholder="Country"
            value={country}
            onChangeText={(value) => handleFieldChange('country', value)}
            onBlur={() => handleFieldBlur('country')}
          />
        </View>
        {errors.zipCode && (
          <Text style={styles.errorText}>{errors.zipCode}</Text>
        )}
        {errors.country && (
          <Text style={styles.errorText}>{errors.country}</Text>
        )}
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
    marginBottom: 40,
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 20,
  },
  addBtnText: { color: '#000', fontWeight: 'bold', fontSize: 16 },
  inputError: {
    borderColor: '#ff4444',
    borderWidth: 1,
  },
  errorText: {
    color: '#ff4444',
    fontSize: 12,
    marginBottom: 8,
    marginLeft: 4,
  },
}); 