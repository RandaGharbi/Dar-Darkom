import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text, ScrollView, TouchableOpacity, Switch, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useSafeNavigation } from '../hooks/useSafeNavigation';
import SafeAreaWrapper from '../components/SafeAreaWrapper';
import notificationService, { NotificationSettings } from '../services/notificationService';


export default function NotificationSettingsScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { safeBack } = useSafeNavigation();
  
  const [settings, setSettings] = useState<NotificationSettings>({
    pushNotifications: true,
    orderUpdates: true,
    promotions: true,
    deliveryUpdates: true,
    soundEnabled: true,
    vibrationEnabled: true,
    quietHours: false,
    quietStartTime: '22:00',
    quietEndTime: '08:00',
    emailNotifications: true,
    smsNotifications: false,
  });

  const [isLoading, setIsLoading] = useState(true);

  // Charger les paramètres sauvegardés
  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    try {
      // Charger depuis le serveur
      const serverSettings = await notificationService.getNotificationSettings();
      setSettings(serverSettings);
      
      // Sauvegarder localement aussi
      await notificationService.saveSettingsLocally(serverSettings);
    } catch (error) {
      console.error('Erreur lors du chargement des paramètres:', error);
      // Fallback sur les paramètres locaux
      const localSettings = await notificationService.loadSettingsLocally();
      if (localSettings) {
        setSettings(localSettings);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const saveSettings = async (newSettings: NotificationSettings) => {
    try {
      // Sauvegarder sur le serveur
      const updatedSettings = await notificationService.updateNotificationSettings(newSettings);
      setSettings(updatedSettings);
      
      // Sauvegarder localement aussi
      await notificationService.saveSettingsLocally(updatedSettings);
    } catch (error) {
      console.error('Erreur lors de la sauvegarde des paramètres:', error);
      Alert.alert('Erreur', 'Impossible de sauvegarder les paramètres');
    }
  };

  const updateSetting = (key: keyof NotificationSettings, value: boolean | string) => {
    const newSettings = { ...settings, [key]: value };
    saveSettings(newSettings);
  };

  const handleTimeChange = (key: 'quietStartTime' | 'quietEndTime') => {
    Alert.alert(
      'Changer l\'heure',
      'Fonctionnalité à venir - Sélection d\'heure',
      [
        { text: 'Annuler', style: 'cancel' },
        { text: 'OK' }
      ]
    );
  };

  const resetToDefaults = () => {
    Alert.alert(
      'Réinitialiser les paramètres',
      'Êtes-vous sûr de vouloir restaurer les paramètres par défaut ?',
      [
        { text: 'Annuler', style: 'cancel' },
        {
          text: 'Réinitialiser',
          style: 'destructive',
          onPress: async () => {
            const defaultSettings: NotificationSettings = {
              pushNotifications: true,
              orderUpdates: true,
              promotions: true,
              deliveryUpdates: true,
              soundEnabled: true,
              vibrationEnabled: true,
              quietHours: false,
              quietStartTime: '22:00',
              quietEndTime: '08:00',
              emailNotifications: true,
              smsNotifications: false,
            };
            await saveSettings(defaultSettings);
          }
        }
      ]
    );
  };

  if (isLoading) {
    return (
      <SafeAreaWrapper backgroundColor="#fff" edges={['top']}>
        <View style={styles.loadingContainer}>
          <Text style={styles.loadingText}>Chargement...</Text>
        </View>
      </SafeAreaWrapper>
    );
  }

  return (
    <SafeAreaWrapper backgroundColor="#fff" edges={['top']}>
      {/* Header */}
      <View style={[styles.header, { paddingTop: insets.top }]}>
        <TouchableOpacity style={styles.backButton} onPress={safeBack}>
          <Ionicons name="arrow-back" size={24} color="#333" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Paramètres de notification</Text>
        <View style={styles.placeholder} />
      </View>

      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        {/* Notifications Push */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>NOTIFICATIONS PUSH</Text>
          
          <View style={styles.settingItem}>
            <View style={styles.settingLeft}>
              <Ionicons name="notifications" size={22} color="#2E86AB" />
              <View style={styles.settingTextContainer}>
                <Text style={styles.settingTitle}>Notifications push</Text>
                <Text style={styles.settingDescription}>Recevoir des notifications sur votre appareil</Text>
              </View>
            </View>
            <Switch
              value={settings.pushNotifications}
              onValueChange={(value) => updateSetting('pushNotifications', value)}
              trackColor={{ false: '#E5E5E5', true: '#2E86AB' }}
              thumbColor={settings.pushNotifications ? '#fff' : '#fff'}
            />
          </View>

          {settings.pushNotifications && (
            <>
              <View style={styles.subSettingItem}>
                <View style={styles.settingLeft}>
                  <Ionicons name="receipt-outline" size={20} color="#666" />
                  <View style={styles.settingTextContainer}>
                    <Text style={styles.settingTitle}>Mises à jour de commande</Text>
                    <Text style={styles.settingDescription}>Nouvelle commande, statut de livraison</Text>
                  </View>
                </View>
                <Switch
                  value={settings.orderUpdates}
                  onValueChange={(value) => updateSetting('orderUpdates', value)}
                  trackColor={{ false: '#E5E5E5', true: '#2E86AB' }}
                  thumbColor={settings.orderUpdates ? '#fff' : '#fff'}
                />
              </View>

              <View style={styles.subSettingItem}>
                <View style={styles.settingLeft}>
                  <Ionicons name="gift-outline" size={20} color="#666" />
                  <View style={styles.settingTextContainer}>
                    <Text style={styles.settingTitle}>Promotions et offres</Text>
                    <Text style={styles.settingDescription}>Nouveaux plats, réductions spéciales</Text>
                  </View>
                </View>
                <Switch
                  value={settings.promotions}
                  onValueChange={(value) => updateSetting('promotions', value)}
                  trackColor={{ false: '#E5E5E5', true: '#2E86AB' }}
                  thumbColor={settings.promotions ? '#fff' : '#fff'}
                />
              </View>

              <View style={styles.subSettingItem}>
                <View style={styles.settingLeft}>
                  <Ionicons name="bicycle-outline" size={20} color="#666" />
                  <View style={styles.settingTextContainer}>
                    <Text style={styles.settingTitle}>Mises à jour de livraison</Text>
                    <Text style={styles.settingDescription}>Livreur en route, livraison effectuée</Text>
                  </View>
                </View>
                <Switch
                  value={settings.deliveryUpdates}
                  onValueChange={(value) => updateSetting('deliveryUpdates', value)}
                  trackColor={{ false: '#E5E5E5', true: '#2E86AB' }}
                  thumbColor={settings.deliveryUpdates ? '#fff' : '#fff'}
                />
              </View>
            </>
          )}
        </View>

        {/* Préférences audio */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>PRÉFÉRENCES AUDIO</Text>
          
          <View style={styles.settingItem}>
            <View style={styles.settingLeft}>
              <Ionicons name="volume-high" size={22} color="#2E86AB" />
              <View style={styles.settingTextContainer}>
                <Text style={styles.settingTitle}>Son</Text>
                <Text style={styles.settingDescription}>Activer les sons de notification</Text>
              </View>
            </View>
            <Switch
              value={settings.soundEnabled}
              onValueChange={(value) => updateSetting('soundEnabled', value)}
              trackColor={{ false: '#E5E5E5', true: '#2E86AB' }}
              thumbColor={settings.soundEnabled ? '#fff' : '#fff'}
            />
          </View>

          <View style={styles.settingItem}>
            <View style={styles.settingLeft}>
              <Ionicons name="phone-portrait" size={22} color="#2E86AB" />
              <View style={styles.settingTextContainer}>
                <Text style={styles.settingTitle}>Vibration</Text>
                <Text style={styles.settingDescription}>Vibrer lors des notifications</Text>
              </View>
            </View>
            <Switch
              value={settings.vibrationEnabled}
              onValueChange={(value) => updateSetting('vibrationEnabled', value)}
              trackColor={{ false: '#E5E5E5', true: '#2E86AB' }}
              thumbColor={settings.vibrationEnabled ? '#fff' : '#fff'}
            />
          </View>
        </View>

        {/* Heures silencieuses */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>HEURES SILENCIEUSES</Text>
          
          <View style={styles.settingItem}>
            <View style={styles.settingLeft}>
              <Ionicons name="moon" size={22} color="#2E86AB" />
              <View style={styles.settingTextContainer}>
                <Text style={styles.settingTitle}>Mode silencieux</Text>
                <Text style={styles.settingDescription}>Désactiver les notifications la nuit</Text>
              </View>
            </View>
            <Switch
              value={settings.quietHours}
              onValueChange={(value) => updateSetting('quietHours', value)}
              trackColor={{ false: '#E5E5E5', true: '#2E86AB' }}
              thumbColor={settings.quietHours ? '#fff' : '#fff'}
            />
          </View>

          {settings.quietHours && (
            <>
              <TouchableOpacity 
                style={styles.subSettingItem} 
                onPress={() => handleTimeChange('quietStartTime')}
              >
                <View style={styles.settingLeft}>
                  <Ionicons name="time-outline" size={20} color="#666" />
                  <View style={styles.settingTextContainer}>
                    <Text style={styles.settingTitle}>Début</Text>
                    <Text style={styles.settingDescription}>{settings.quietStartTime}</Text>
                  </View>
                </View>
                <Ionicons name="chevron-forward" size={20} color="#666" />
              </TouchableOpacity>

              <TouchableOpacity 
                style={styles.subSettingItem} 
                onPress={() => handleTimeChange('quietEndTime')}
              >
                <View style={styles.settingLeft}>
                  <Ionicons name="time-outline" size={20} color="#666" />
                  <View style={styles.settingTextContainer}>
                    <Text style={styles.settingTitle}>Fin</Text>
                    <Text style={styles.settingDescription}>{settings.quietEndTime}</Text>
                  </View>
                </View>
                <Ionicons name="chevron-forward" size={20} color="#666" />
              </TouchableOpacity>
            </>
          )}
        </View>

        {/* Autres notifications */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>AUTRES NOTIFICATIONS</Text>
          
          <View style={styles.settingItem}>
            <View style={styles.settingLeft}>
              <Ionicons name="mail" size={22} color="#2E86AB" />
              <View style={styles.settingTextContainer}>
                <Text style={styles.settingTitle}>Notifications email</Text>
                <Text style={styles.settingDescription}>Recevoir des emails de confirmation</Text>
              </View>
            </View>
            <Switch
              value={settings.emailNotifications}
              onValueChange={(value) => updateSetting('emailNotifications', value)}
              trackColor={{ false: '#E5E5E5', true: '#2E86AB' }}
              thumbColor={settings.emailNotifications ? '#fff' : '#fff'}
            />
          </View>

          <View style={styles.settingItem}>
            <View style={styles.settingLeft}>
              <Ionicons name="chatbubble" size={22} color="#2E86AB" />
              <View style={styles.settingTextContainer}>
                <Text style={styles.settingTitle}>Notifications SMS</Text>
                <Text style={styles.settingDescription}>Recevoir des SMS de livraison</Text>
              </View>
            </View>
            <Switch
              value={settings.smsNotifications}
              onValueChange={(value) => updateSetting('smsNotifications', value)}
              trackColor={{ false: '#E5E5E5', true: '#2E86AB' }}
              thumbColor={settings.smsNotifications ? '#fff' : '#fff'}
            />
          </View>
        </View>

        {/* Actions */}
        <View style={styles.actionsSection}>
          <TouchableOpacity style={styles.resetButton} onPress={resetToDefaults}>
            <Ionicons name="refresh" size={20} color="#FF3B30" />
            <Text style={styles.resetButtonText}>Réinitialiser les paramètres</Text>
          </TouchableOpacity>
        </View>

        {/* Info */}
        <View style={styles.infoSection}>
          <Text style={styles.infoText}>
            Les paramètres de notification vous permettent de personnaliser la façon dont vous recevez les mises à jour de votre application.
          </Text>
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
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    fontSize: 16,
    color: '#666',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E5E5',
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
  section: {
    backgroundColor: '#fff',
    marginHorizontal: 16,
    marginTop: 20,
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
  sectionTitle: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#666',
    marginBottom: 16,
    marginTop: 8,
    letterSpacing: 1,
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f5f5f5',
  },
  subSettingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
    paddingLeft: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#f5f5f5',
  },
  settingLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  settingTextContainer: {
    marginLeft: 16,
    flex: 1,
  },
  settingTitle: {
    fontSize: 16,
    color: '#333',
    fontWeight: '500',
    marginBottom: 2,
  },
  settingDescription: {
    fontSize: 14,
    color: '#666',
  },
  actionsSection: {
    marginHorizontal: 16,
    marginTop: 20,
    marginBottom: 20,
  },
  resetButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#fff',
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
  resetButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FF3B30',
    marginLeft: 8,
  },
  infoSection: {
    marginHorizontal: 16,
    marginBottom: 40,
    padding: 16,
    backgroundColor: '#f0f8ff',
    borderRadius: 12,
  },
  infoText: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
    textAlign: 'center',
  },
});
