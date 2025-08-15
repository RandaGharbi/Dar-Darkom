import React, { useState } from 'react';
import { Text, TextInput, TouchableOpacity, StyleSheet, Alert, KeyboardAvoidingView, Platform } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const ContactFormScreen: React.FC = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async () => {
    if (!message.trim()) {
      Alert.alert('Erreur', 'Veuillez saisir un message');
      return;
    }

    setIsLoading(true);

    try {
      // Récupérer le token depuis le stockage
      const token = await AsyncStorage.getItem('authToken');
      
      console.log('Token récupéré:', token ? 'Présent' : 'Absent');
      
      if (!token) {
        Alert.alert('Erreur', 'Token non trouvé. Veuillez vous reconnecter.');
        return;
      }

      const response = await fetch('http://192.168.1.74:5000/api/messages/user/send', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          content: message.trim()
        })
      });

      if (!response.ok) {
        throw new Error('Erreur lors de l\'envoi du message');
      }

      Alert.alert('Message envoyé', 'Merci de nous avoir contacté ! Notre équipe vous répondra bientôt.');
      setName('');
      setEmail('');
      setMessage('');
    } catch (error) {
      console.error('Erreur lors de l\'envoi:', error);
      Alert.alert('Erreur', 'Impossible d\'envoyer le message. Veuillez réessayer.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <Text style={styles.label}>Your Name</Text>
      <TextInput
        style={styles.input}
        placeholder="Enter your name"
        value={name}
        onChangeText={setName}
        autoCorrect={false}
        spellCheck={false}
      />

      <Text style={styles.label}>Your Email</Text>
      <TextInput
        style={styles.input}
        placeholder="Enter your email"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
        autoCorrect={false}
        spellCheck={false}
      />

      <Text style={styles.label}>Your Message</Text>
      <TextInput
        style={[styles.input, styles.textArea]}
        placeholder="Enter your message"
        value={message}
        onChangeText={setMessage}
        multiline
        numberOfLines={5}
        autoCorrect={false}
        spellCheck={false}
      />

      <TouchableOpacity 
        style={[styles.button, isLoading && styles.buttonDisabled]} 
        onPress={handleSubmit}
        disabled={isLoading}
      >
        <Text style={styles.buttonText}>
          {isLoading ? 'Envoi...' : 'Send Message'}
        </Text>
      </TouchableOpacity>
    </KeyboardAvoidingView>
  );
};

export default ContactFormScreen;

const styles = StyleSheet.create({
    container: {
      padding: 20,
    },
    label: {
      marginTop: 15,
      marginBottom: 5,
    },
    input: {
      borderWidth: 1,
      borderColor: '#ddd',
      borderRadius: 8,
      padding: 12,
    },
    textArea: {
      height: 100,
      textAlignVertical: 'top',
    },
    button: {
      backgroundColor: '#000',
      paddingVertical: 12,
      paddingHorizontal: 30,
      borderRadius: 30,
      alignSelf: 'flex-end',
      marginTop: 20,
    },
    buttonDisabled: {
      backgroundColor: '#666',
    },
    buttonText: {
      color: '#fff',
      fontWeight: 'bold',
      fontSize: 16,
    },
  });
  