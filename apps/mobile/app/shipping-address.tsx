import React, { useEffect, useState, useCallback } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  SafeAreaView,
  Platform,
  Alert,
  ActivityIndicator,
  Image,
} from "react-native";
import { useRouter } from "expo-router";
import {
  addAddress,
  getAddressesByUser,
  updateAddress,
  deleteAddress,
  AddressPayload,
} from "../services/api";
import { useAuth } from "../context/AuthContext";
import AsyncStorage from '@react-native-async-storage/async-storage';
import EditIcon from '../assets/images/edit.png';
import DropIcon from '../assets/images/drop.png';
// import { AuthContext } from "../context/AuthContext"; // Décommente si tu utilises un contexte Auth

export interface Address {
  _id: string;
  userId: string;
  fullName: string;
  streetAddress: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
  isDefault?: boolean;
}

export default function ShippingAddressScreen() {
  const router = useRouter();
  const { user } = useAuth();
  const userId = user?._id || "";
  // const { user } = useContext(AuthContext); // Décommente si tu utilises un contexte Auth

  const [addresses, setAddresses] = useState<Address[]>([]);
  const [loading, setLoading] = useState(false);
  const [editing, setEditing] = useState<Address | null>(null); // adresse en cours d'édition
  const [selectedAddressId, setSelectedAddressId] = useState<string | null>(null);

  // États pour le formulaire
  const [fullName, setFullName] = useState("");
  const [street, setStreet] = useState("");
  const [city, setCity] = useState("");
  const [state, setState] = useState("");
  const [postal, setPostal] = useState("");
  const [country, setCountry] = useState("");

  // Pour édition
  const fillForm = (address: Address) => {
    setFullName(address.fullName);
    setStreet(address.streetAddress);
    setCity(address.city);
    setState(address.state);
    setPostal(address.postalCode);
    setCountry(address.country);
  };

  // Récupérer les adresses à l'ouverture
  const fetchAddresses = useCallback(async () => {
    if (!userId) return;
    setLoading(true);
    try {
      const data: Address[] = await getAddressesByUser(userId);
      
      // Si aucune adresse n'existe et que l'utilisateur a une adresse dans son profil
      if (data.length === 0 && user?.address) {
        try {
          // Créer automatiquement une adresse de livraison à partir du profil
          const fullName = user.name || 'Utilisateur';
          const streetAddress = user.address;
          const city = 'Ville'; // Valeur par défaut
          const state = 'État'; // Valeur par défaut
          const postalCode = '00000'; // Valeur par défaut
          const country = 'France'; // Valeur par défaut
          
          const payload: AddressPayload = {
            userId: userId as string,
            fullName,
            streetAddress,
            city,
            state,
            postalCode,
            country,
          };
          
          await addAddress(payload);
          console.log('Adresse du profil synchronisée vers les adresses de livraison');
          
          // Récupérer à nouveau les adresses
          const updatedData: Address[] = await getAddressesByUser(userId);
          setAddresses(updatedData);
        } catch (syncError) {
          console.error('Erreur lors de la synchronisation de l\'adresse:', syncError);
          // Continuer avec les adresses existantes même si la sync échoue
          setAddresses(data);
        }
      } else {
        setAddresses(data);
      }
    } catch (error) {
      console.error('Erreur lors de la récupération des adresses:', error);
      Alert.alert("Erreur", "Impossible de charger les adresses");
    }
    setLoading(false);
  }, [userId, user]);

  useEffect(() => {
    fetchAddresses();
  }, [fetchAddresses]);

  // Charger l'adresse sélectionnée au montage
  useEffect(() => {
    const loadSelected = async () => {
      const id = await AsyncStorage.getItem('selectedShippingAddressId');
      setSelectedAddressId(id);
    };
    loadSelected();
  }, []);

  // Ajout ou modification d'une adresse
  const handleSaveAddress = async () => {
    if (!userId || userId.length < 10 || !fullName || !street || !city || !state || !postal || !country) {
      Alert.alert("Erreur", "Merci de remplir tous les champs (connexion requise)");
      return;
    }
    try {
      const payload: AddressPayload = {
        userId: userId as string,
        fullName,
        streetAddress: street,
        city,
        state,
        postalCode: postal,
        country,
      };
      if (editing) {
        await updateAddress(editing._id, payload);
        Alert.alert("Succès", "Adresse modifiée !");
      } else {
        await addAddress(payload);
        Alert.alert("Succès", "Adresse ajoutée !");
      }
      setFullName(""); setStreet(""); setCity(""); setState(""); setPostal(""); setCountry("");
      setEditing(null);
      fetchAddresses();
    } catch (error) {
      console.error('Erreur lors de l\'enregistrement de l\'adresse:', error);
      Alert.alert("Erreur", "Impossible d'enregistrer l'adresse");
    }
  };

  // Suppression
  const handleDelete = (id: string) => {
    Alert.alert("Confirmation", "Supprimer cette adresse ?", [
      { text: "Annuler", style: "cancel" },
      {
        text: "Supprimer",
        style: "destructive",
        onPress: async () => {
          try {
            await deleteAddress(id);
            fetchAddresses();
            Alert.alert("Succès", "Adresse supprimée");
          } catch (error) {
            console.error('Erreur lors de la suppression de l\'adresse:', error);
            Alert.alert("Erreur", "Impossible de supprimer l'adresse");
          }
        },
      },
    ]);
  };

  // Préparer l'édition
  const handleEdit = (address: Address) => {
    fillForm(address);
    setEditing(address);
  };

  // Réinitialiser le formulaire
  const resetForm = () => {
    setFullName(""); setStreet(""); setCity(""); setState(""); setPostal(""); setCountry("");
    setEditing(null);
  };

  // Fonction pour sélectionner une adresse
  const handleSelectAddress = async (id: string) => {
    setSelectedAddressId(id);
    await AsyncStorage.setItem('selectedShippingAddressId', id);
    Alert.alert('Succès', 'Adresse sélectionnée pour la livraison');
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView style={{ flex: 1, backgroundColor: "#fff" }} contentContainerStyle={{ paddingBottom: 32 }} keyboardShouldPersistTaps="handled">
        <View style={styles.headerRow}>
          <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
            <Text style={styles.backText}>←</Text>
          </TouchableOpacity>
          <Text style={styles.title}>Shipping Address</Text>
          <View style={{ width: 32 }} />
        </View>
        <Text style={styles.sectionTitle}>Saved Addresses</Text>
        <View style={styles.savedBlock}>
          {loading ? (
            <ActivityIndicator />
          ) : addresses.length === 0 ? (
            <Text style={{ marginLeft: 16, color: '#aaa' }}>Aucune adresse enregistrée</Text>
          ) : (
            addresses.map((item) => (
              <View key={item._id} style={[styles.savedRow, item._id === selectedAddressId && { backgroundColor: '#FFF3E0', borderRadius: 12 }]}>
                <TouchableOpacity
                  style={{ flex: 1 }}
                  onPress={() => handleSelectAddress(item._id)}
                  activeOpacity={0.7}
                >
                  <Text style={styles.savedName}>{item.fullName}</Text>
                  <Text style={styles.savedAddress}>{item.streetAddress}</Text>
                  <Text style={styles.savedAddress}>
                    {item.city}{item.state ? `, ${item.state}` : ''} {item.postalCode}, {item.country}
                  </Text>
                </TouchableOpacity>
                <View style={{ flexDirection: 'row', gap: 8, alignItems: 'center' }}>
                  <TouchableOpacity onPress={() => handleEdit(item)}>
                    <Image source={EditIcon} style={{ width: 28, height: 28, marginHorizontal: 2 }} />
                  </TouchableOpacity>
                  <TouchableOpacity onPress={() => handleDelete(item._id)}>
                    <Image source={DropIcon} style={{ width: 28, height: 28, marginHorizontal: 2 }} />
                  </TouchableOpacity>
                </View>
              </View>
            ))
          )}
        </View>
        <Text style={styles.sectionTitle}>{editing ? 'Edit Address' : 'New Address'}</Text>
        <View style={styles.formBlock}>
          <Text style={styles.inputLabel}>Full Name</Text>
          <TextInput style={styles.input} placeholder="Full Name" placeholderTextColor="#C7BEB2" value={fullName} onChangeText={setFullName} />
          <Text style={styles.inputLabel}>Street Address</Text>
          <TextInput style={styles.input} placeholder="Street Address" placeholderTextColor="#C7BEB2" value={street} onChangeText={setStreet} />
          <View style={styles.rowGap}>
            <View style={{ flex: 1 }}>
              <Text style={styles.inputLabel}>City</Text>
              <TextInput style={styles.input} placeholder="City" placeholderTextColor="#C7BEB2" value={city} onChangeText={setCity} />
            </View>
            <View style={{ flex: 1, marginLeft: 8 }}>
              <Text style={styles.inputLabel}>State</Text>
              <TextInput style={styles.input} placeholder="State" placeholderTextColor="#C7BEB2" value={state} onChangeText={setState} />
            </View>
          </View>
          <View style={styles.rowGap}>
            <View style={{ flex: 1 }}>
              <Text style={styles.inputLabel}>Postal Code</Text>
              <TextInput style={styles.input} placeholder="Postal Code" placeholderTextColor="#C7BEB2" value={postal} onChangeText={setPostal} />
            </View>
            <View style={{ flex: 1, marginLeft: 8 }}>
              <Text style={styles.inputLabel}>Country</Text>
              <TextInput style={styles.input} placeholder="Country" placeholderTextColor="#C7BEB2" value={country} onChangeText={setCountry} />
            </View>
          </View>
        </View>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 16, marginHorizontal: 16 }}>
          {editing && (
            <TouchableOpacity style={{
              backgroundColor: '#aaa',
              borderRadius: 24,
              paddingHorizontal: 32,
              paddingVertical: 12,
              alignItems: 'center',
              minWidth: 120,
            }} onPress={resetForm}>
              <Text style={{ color: '#222', fontWeight: 'bold', fontSize: 16 }}>Annuler</Text>
            </TouchableOpacity>
          )}
          <View style={{ flex: 1 }} />
          <TouchableOpacity style={{
            backgroundColor: '#EDD9BF',
            borderRadius: 24,
            paddingHorizontal: 32,
            paddingVertical: 12,
            alignItems: 'center',
            minWidth: 120,
          }} onPress={handleSaveAddress}>
            <Text style={{ color: '#222', fontWeight: 'bold', fontSize: 16 }}>{editing ? 'Modifier' : 'Save Address'}</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#fff',
  },
  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: Platform.OS === 'android' ? 32 : 0,
    marginBottom: 12,
    paddingHorizontal: 16,
  },
  backBtn: {
    width: 32,
    height: 32,
    justifyContent: 'center',
    alignItems: 'center',
  },
  backText: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#222',
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    textAlign: "center",
    flex: 1,
    marginTop: 8,
  },
  sectionTitle: {
    fontSize: 15,
    fontWeight: "bold",
    marginTop: 22,
    marginBottom: 10,
    marginLeft: 16,
  },
  savedRow: {
    marginBottom: 18,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginHorizontal: 16,
  },
  savedName: {
    fontWeight: "500",
    fontSize: 13,
    color: '#222',
    marginBottom: 2,
  },
  savedAddress: {
    color: "#8A7861",
    fontSize: 12,
    marginTop: 0,
  },
  detailsBtn: {
    backgroundColor: "#F6F3F2",
    borderRadius: 20,
    paddingHorizontal: 18,
    paddingVertical: 7,
    minWidth: 60,
    alignItems: 'center',
    justifyContent: 'center',
  },
  detailsBtnText: {
    color: "#222",
    fontWeight: "500",
    fontSize: 14,
    textTransform: 'capitalize',
  },
  input: {
    backgroundColor: "#F6F3F2",
    borderRadius: 14,
    paddingVertical: 16,
    paddingHorizontal: 18,
    marginBottom: 18,
    fontSize: 15,
    color: '#222',
  },
  rowGap: {
    flexDirection: "row",
    marginBottom: 18,
  },
  saveBtn: {
    backgroundColor: "#ED9626",
    borderRadius: 30,
    paddingVertical: 16,
    paddingHorizontal: 48,
    alignItems: "center",
    marginTop: 24,
    width: '90%',
    shadowColor: '#ED9626',
    shadowOpacity: 0.12,
    shadowRadius: 8,
    elevation: 2,
  },
  saveBtnText: {
    color: "#111",
    fontWeight: "bold",
    fontSize: 17,
    letterSpacing: 0.5,
  },
  inputLabel: {
    fontSize: 13,
    color: '#222',
    fontWeight: '400',
    marginBottom: 4,
    marginLeft: 2,
  },
  formBlock: {
    marginHorizontal: 16,
    marginTop: 18,
  },
  savedBlock: {
    marginTop: 12,
    marginBottom: 0,
  },
});
