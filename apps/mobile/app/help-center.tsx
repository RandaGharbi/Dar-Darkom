import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useSafeNavigation } from '../hooks/useSafeNavigation';
import SafeAreaWrapper from '../components/SafeAreaWrapper';

const helpSections = [
  {
    id: 'products',
    title: "À propos de nos produits",
    subtitle: "Découvrez nos ingrédients, sourcing et processus de production",
    icon: "information-circle-outline",
  },
  {
    id: 'orders',
    title: "Commandes et livraison",
    subtitle: "Trouvez des réponses aux questions sur les commandes et livraisons",
    icon: "car-outline",
  },
  {
    id: 'returns',
    title: "Retours et échanges",
    subtitle: "Obtenez de l'aide pour les retours, échanges et remboursements",
    icon: "refresh-outline",
  },
  {
    id: 'contact',
    title: "Nous contacter",
    subtitle: "Contactez notre équipe support pour une assistance personnalisée",
    icon: "mail-outline",
  },
];

const HelpCenterScreen = () => {
  const router = useRouter();
  const { safeBack } = useSafeNavigation();

  const handleSectionPress = (sectionId: string) => {
    switch (sectionId) {
      case 'contact':
        // Naviguer vers la page de messagerie
        router.push('/contact-us');
        break;
      case 'products':
        // TODO: Naviguer vers la page des produits ou FAQ
        console.log('Section produits pressée');
        break;
      case 'orders':
        // TODO: Naviguer vers la page des commandes ou FAQ
        console.log('Section commandes pressée');
        break;
      case 'returns':
        // TODO: Naviguer vers la page des retours ou FAQ
        console.log('Section retours pressée');
        break;
      default:
        console.log('Section pressée:', sectionId);
    }
  };

  return (
    <SafeAreaWrapper backgroundColor="#f5f5f5" edges={['top']}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={safeBack}>
          <Ionicons name="arrow-back" size={24} color="#000" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Aide & Support</Text>
        <View style={styles.headerSpacer} />
      </View>

      {/* Content */}
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Help Sections */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>CENTRE D&apos;AIDE</Text>
          <View style={styles.sectionsContainer}>
            {helpSections.map((section, index) => (
              <TouchableOpacity
                key={section.id}
                style={[
                  styles.sectionItem,
                  index === helpSections.length - 1 && styles.lastSectionItem
                ]}
                onPress={() => handleSectionPress(section.id)}
              >
                <View style={styles.sectionItemLeft}>
                  <Ionicons name={section.icon as any} size={22} color="#666" />
                  <View style={styles.sectionItemText}>
                    <Text style={styles.sectionItemTitle}>{section.title}</Text>
                    <Text style={styles.sectionItemSubtitle}>{section.subtitle}</Text>
                  </View>
                </View>
                <Ionicons name="chevron-forward" size={20} color="#666" />
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Contact Info */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>INFORMATIONS DE CONTACT</Text>
          <View style={styles.contactContainer}>
            <View style={styles.contactItem}>
              <Ionicons name="call-outline" size={20} color="#666" />
              <Text style={styles.contactText}>+216 XX XXX XXX</Text>
            </View>
            <View style={styles.contactItem}>
              <Ionicons name="mail-outline" size={20} color="#666" />
              <Text style={styles.contactText}>support@dardarkom.com</Text>
            </View>
            <View style={styles.contactItem}>
              <Ionicons name="time-outline" size={20} color="#666" />
              <Text style={styles.contactText}>Lun-Ven: 9h-18h</Text>
            </View>
          </View>
        </View>
      </ScrollView>
    </SafeAreaWrapper>
  );
};

const styles = StyleSheet.create({
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: "#f5f5f5",
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
    backgroundColor: "#f5f5f5",
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
  sectionsContainer: {
    backgroundColor: "#fff",
    borderRadius: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  sectionItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#E5E5EA",
  },
  lastSectionItem: {
    borderBottomWidth: 0,
  },
  sectionItemLeft: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  sectionItemText: {
    marginLeft: 12,
    flex: 1,
  },
  sectionItemTitle: {
    fontSize: 16,
    fontWeight: "500",
    color: "#333",
    marginBottom: 2,
  },
  sectionItemSubtitle: {
    fontSize: 14,
    color: "#8E8E93",
    lineHeight: 18,
  },
  contactContainer: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  contactItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 8,
  },
  contactText: {
    fontSize: 16,
    color: "#333",
    marginLeft: 12,
  },
});

export default HelpCenterScreen;
