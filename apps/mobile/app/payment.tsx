import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TextInput, 
  TouchableOpacity, 
  ScrollView, 
  Alert, 
  ActivityIndicator,
  Image
} from 'react-native';
import { useRouter } from 'expo-router';
import { useSafeNavigation } from '../hooks/useSafeNavigation';
import { apiService } from '../services/api';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useAuth } from '../context/AuthContext';
import SafeAreaWrapper from '../components/SafeAreaWrapper';
import { Ionicons } from '@expo/vector-icons';
import visaImg from '../assets/images/visa.png';
import mastercardImg from '../assets/images/masterCard.png';

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
  const { user } = useAuth();
  const { safeBack } = useSafeNavigation();
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
  const [touched, setTouched] = useState<{[key: string]: boolean}>({});

  const validateField = (field: string, value: string) => {
    let error = '';
    
    switch (field) {
      case 'cardNumber':
        if (!value) error = 'Le numéro de carte est requis';
        else if (value.replace(/\s/g, '').length < 13) error = 'Numéro de carte invalide';
        break;
      case 'expiryDate':
        if (!value) error = 'La date d\'expiration est requise';
        else if (!/^(0[1-9]|1[0-2])\/\d{2}$/.test(value)) error = 'Format MM/YY requis';
        break;
      case 'cvv':
        if (!value) error = 'Le CVV est requis';
        else if (value.length < 3) error = 'CVV invalide';
        break;
      case 'nameOnCard':
        if (!value) error = 'Le nom sur la carte est requis';
        break;
      case 'billingAddress':
        if (!value) error = 'L\'adresse de facturation est requise';
        break;
      case 'city':
        if (!value) error = 'La ville est requise';
        break;
      case 'state':
        if (!value) error = 'L\'état est requis';
        break;
      case 'zipCode':
        if (!value) error = 'Le code postal est requis';
        break;
      case 'country':
        if (!value) error = 'Le pays est requis';
        break;
    }
    
    setErrors(prev => ({ ...prev, [field]: error }));
    return !error;
  };

  const handleFieldChange = (field: string, value: string) => {
    if (field === 'expiryDate') {
      value = formatExpiryDate(value);
    }
    
    // Mettre à jour la valeur
    switch (field) {
      case 'cardNumber': setCardNumber(value); break;
      case 'expiryDate': setExpiryDate(value); break;
      case 'cvv': setCvv(value); break;
      case 'nameOnCard': setNameOnCard(value); break;
      case 'billingAddress': setBillingAddress(value); break;
      case 'city': setCity(value); break;
      case 'state': setState(value); break;
      case 'zipCode': setZipCode(value); break;
      case 'country': setCountry(value); break;
    }
    
    // Valider le champ si il a été touché
    if (touched[field]) {
      validateField(field, value);
    }
  };

  const handleFieldBlur = (field: string) => {
    setTouched(prev => ({ ...prev, [field]: true }));
    const value = field === 'cardNumber' ? cardNumber :
                  field === 'expiryDate' ? expiryDate :
                  field === 'cvv' ? cvv :
                  field === 'nameOnCard' ? nameOnCard :
                  field === 'billingAddress' ? billingAddress :
                  field === 'city' ? city :
                  field === 'state' ? state :
                  field === 'zipCode' ? zipCode :
                  field === 'country' ? country : '';
    validateField(field, value);
  };

  const handleSubmit = async () => {
    // Marquer tous les champs comme touchés
    const allFields = ['cardNumber', 'expiryDate', 'cvv', 'nameOnCard', 'billingAddress', 'city', 'state', 'zipCode', 'country'];
    const newTouched: {[key: string]: boolean} = {};
    allFields.forEach(field => newTouched[field] = true);
    setTouched(newTouched);

    // Valider tous les champs
    const isValid = allFields.every(field => {
      const value = field === 'cardNumber' ? cardNumber :
                    field === 'expiryDate' ? expiryDate :
                    field === 'cvv' ? cvv :
                    field === 'nameOnCard' ? nameOnCard :
                    field === 'billingAddress' ? billingAddress :
                    field === 'city' ? city :
                    field === 'state' ? state :
                    field === 'zipCode' ? zipCode :
                    field === 'country' ? country : '';
      return validateField(field, value);
    });

    if (!isValid) {
      Alert.alert('Erreur', 'Veuillez corriger les erreurs dans le formulaire');
      return;
    }

    setLoading(true);
    try {
      const token = await AsyncStorage.getItem('authToken');
      if (!token || !user?._id) {
        Alert.alert('Erreur', 'Session expirée, veuillez vous reconnecter');
        return;
      }

      const cardData = {
        userId: user._id,
        cardNumber: cardNumber.replace(/\s/g, ''),
        expiryDate: expiryDate,
        cvv: cvv,
        nameOnCard: nameOnCard.trim(),
        billingAddress: billingAddress.trim(),
        city: city.trim(),
        state: state.trim(),
        zipCode: zipCode.trim(),
        country: country.trim()
      };
      
      console.log('💳 Données de la carte à envoyer:', cardData);
      const response = await apiService.addCard(cardData, token);
      console.log('📡 Réponse API addCard:', response);
      
      if (response.success) {
        console.log('✅ Carte ajoutée avec succès');
        Alert.alert('Succès', 'Votre carte a été ajoutée avec succès ! Elle apparaîtra dans vos méthodes de paiement.', [
          { text: 'OK', onPress: () => router.back() }
        ]);
      } else {
        console.log('❌ Erreur lors de l\'ajout de la carte:', response.error);
        Alert.alert('Erreur', response.error || "Erreur lors de l'ajout de la carte");
      }
    } catch (error) {
      console.error('Erreur lors de l\'ajout de la carte:', error);
      Alert.alert('Erreur', "Erreur lors de l'ajout de la carte");
    } finally {
      setLoading(false);
    }
  };

  const cardType = getCardType(cardNumber);

  return (
    <SafeAreaWrapper backgroundColor="#f5f5f5" edges={['top']}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={safeBack}>
          <Ionicons name="arrow-back" size={24} color="#000" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Ajouter une carte</Text>
        <View style={styles.headerSpacer} />
      </View>

      {/* Content */}
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Card Preview */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>APERÇU DE LA CARTE</Text>
          <View style={styles.cardPreview}>
            <View style={styles.cardHeader}>
              <View style={styles.cardTypeContainer}>
                {cardType === 'visa' && (
                  <Image source={visaImg} style={styles.cardTypeImage} resizeMode="contain" />
                )}
                {cardType === 'mastercard' && (
                  <Image source={mastercardImg} style={styles.cardTypeImage} resizeMode="contain" />
                )}
                {cardType === 'unknown' && <Text style={styles.cardTypeText}>CARTE</Text>}
              </View>
            </View>
            <View style={styles.cardNumberPreview}>
              <Text style={styles.cardNumberText}>
                {cardNumber || '•••• •••• •••• ••••'}
              </Text>
            </View>
            <View style={styles.cardFooter}>
              <Text style={styles.cardExpiryText}>
                {expiryDate || 'MM/YY'}
              </Text>
              <Text style={styles.cardNameText}>
                {nameOnCard || 'NOM SUR LA CARTE'}
              </Text>
            </View>
          </View>
        </View>

        {/* Form Fields */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>INFORMATIONS DE LA CARTE</Text>
          <View style={styles.formContainer}>
            {/* Card Number */}
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Numéro de carte</Text>
              <TextInput
                style={[styles.input, errors.cardNumber && styles.inputError]}
                value={cardNumber}
                onChangeText={(text) => handleFieldChange('cardNumber', text)}
                onBlur={() => handleFieldBlur('cardNumber')}
                placeholder="1234 5678 9012 3456"
                keyboardType="numeric"
                maxLength={19}
              />
              {errors.cardNumber && <Text style={styles.errorText}>{errors.cardNumber}</Text>}
            </View>

            {/* Expiry and CVV */}
            <View style={styles.row}>
              <View style={[styles.inputGroup, styles.halfWidth]}>
                <Text style={styles.inputLabel}>Date d&apos;expiration</Text>
                <TextInput
                  style={[styles.input, errors.expiryDate && styles.inputError]}
                  value={expiryDate}
                  onChangeText={(text) => handleFieldChange('expiryDate', text)}
                  onBlur={() => handleFieldBlur('expiryDate')}
                  placeholder="MM/YY"
                  keyboardType="numeric"
                  maxLength={5}
                />
                {errors.expiryDate && <Text style={styles.errorText}>{errors.expiryDate}</Text>}
              </View>
              <View style={[styles.inputGroup, styles.halfWidth]}>
                <Text style={styles.inputLabel}>CVV</Text>
                <TextInput
                  style={[styles.input, errors.cvv && styles.inputError]}
                  value={cvv}
                  onChangeText={(text) => handleFieldChange('cvv', text)}
                  onBlur={() => handleFieldBlur('cvv')}
                  placeholder="123"
                  keyboardType="numeric"
                  maxLength={4}
                  secureTextEntry
                />
                {errors.cvv && <Text style={styles.errorText}>{errors.cvv}</Text>}
              </View>
            </View>

            {/* Name on Card */}
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Nom sur la carte</Text>
              <TextInput
                style={[styles.input, errors.nameOnCard && styles.inputError]}
                value={nameOnCard}
                onChangeText={(text) => handleFieldChange('nameOnCard', text)}
                onBlur={() => handleFieldBlur('nameOnCard')}
                placeholder="Jean Dupont"
                autoCapitalize="words"
              />
              {errors.nameOnCard && <Text style={styles.errorText}>{errors.nameOnCard}</Text>}
            </View>
          </View>
        </View>

        {/* Billing Address */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>ADRESSE DE FACTURATION</Text>
          <View style={styles.formContainer}>
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Adresse</Text>
              <TextInput
                style={[styles.input, errors.billingAddress && styles.inputError]}
                value={billingAddress}
                onChangeText={(text) => handleFieldChange('billingAddress', text)}
                onBlur={() => handleFieldBlur('billingAddress')}
                placeholder="123 Rue de la Paix"
              />
              {errors.billingAddress && <Text style={styles.errorText}>{errors.billingAddress}</Text>}
            </View>

            <View style={styles.row}>
              <View style={[styles.inputGroup, styles.halfWidth]}>
                <Text style={styles.inputLabel}>Ville</Text>
                <TextInput
                  style={[styles.input, errors.city && styles.inputError]}
                  value={city}
                  onChangeText={(text) => handleFieldChange('city', text)}
                  onBlur={() => handleFieldBlur('city')}
                  placeholder="Paris"
                />
                {errors.city && <Text style={styles.errorText}>{errors.city}</Text>}
              </View>
              <View style={[styles.inputGroup, styles.halfWidth]}>
                <Text style={styles.inputLabel}>État</Text>
                <TextInput
                  style={[styles.input, errors.state && styles.inputError]}
                  value={state}
                  onChangeText={(text) => handleFieldChange('state', text)}
                  onBlur={() => handleFieldBlur('state')}
                  placeholder="Île-de-France"
                />
                {errors.state && <Text style={styles.errorText}>{errors.state}</Text>}
              </View>
            </View>

            <View style={styles.row}>
              <View style={[styles.inputGroup, styles.halfWidth]}>
                <Text style={styles.inputLabel}>Code postal</Text>
                <TextInput
                  style={[styles.input, errors.zipCode && styles.inputError]}
                  value={zipCode}
                  onChangeText={(text) => handleFieldChange('zipCode', text)}
                  onBlur={() => handleFieldBlur('zipCode')}
                  placeholder="75001"
                  keyboardType="numeric"
                />
                {errors.zipCode && <Text style={styles.errorText}>{errors.zipCode}</Text>}
              </View>
              <View style={[styles.inputGroup, styles.halfWidth]}>
                <Text style={styles.inputLabel}>Pays</Text>
                <TextInput
                  style={[styles.input, errors.country && styles.inputError]}
                  value={country}
                  onChangeText={(text) => handleFieldChange('country', text)}
                  onBlur={() => handleFieldBlur('country')}
                  placeholder="France"
                />
                {errors.country && <Text style={styles.errorText}>{errors.country}</Text>}
              </View>
            </View>
          </View>
        </View>

        {/* Submit Button */}
        <View style={styles.submitContainer}>
          <TouchableOpacity
            style={[styles.submitButton, loading && styles.submitButtonDisabled]}
            onPress={handleSubmit}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.submitButtonText}>Ajouter la carte</Text>
            )}
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaWrapper>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: "#fff",
  },
  backButton: {
    padding: 8,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#000",
    textAlign: "center",
  },
  headerSpacer: {
    width: 40,
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
  },
  section: {
    marginTop: 24,
  },
  sectionTitle: {
    fontSize: 13,
    fontWeight: "600",
    color: "#8E8E93",
    marginBottom: 8,
    letterSpacing: 0.5,
  },
  cardPreview: {
    backgroundColor: "#1a1a1a",
    borderRadius: 12,
    padding: 20,
    marginBottom: 8,
  },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "flex-end",
    marginBottom: 20,
  },
  cardTypeContainer: {
    backgroundColor: "#fff",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  cardTypeText: {
    fontSize: 12,
    fontWeight: "bold",
    color: "#000",
  },
  cardTypeImage: {
    width: 40,
    height: 24,
  },
  cardNumberPreview: {
    marginBottom: 20,
  },
  cardNumberText: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#fff",
    letterSpacing: 2,
  },
  cardFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-end",
  },
  cardExpiryText: {
    fontSize: 14,
    color: "#ccc",
  },
  cardNameText: {
    fontSize: 14,
    color: "#ccc",
    textTransform: "uppercase",
  },
  formContainer: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 16,
  },
  inputGroup: {
    marginBottom: 16,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: "500",
    color: "#000",
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: "#E5E5EA",
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 12,
    fontSize: 16,
    backgroundColor: "#fff",
  },
  inputError: {
    borderColor: "#FF3B30",
  },
  errorText: {
    fontSize: 12,
    color: "#FF3B30",
    marginTop: 4,
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  halfWidth: {
    width: "48%",
  },
  submitContainer: {
    marginTop: 32,
    marginBottom: 32,
  },
  submitButton: {
    backgroundColor: "#3498DB",
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: "center",
  },
  submitButtonDisabled: {
    opacity: 0.6,
  },
  submitButtonText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#fff",
  },
});