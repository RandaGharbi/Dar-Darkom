import React from "react";
import { View, Text, Linking, StyleSheet, Image } from "react-native";
import PhoneIcon from '../assets/images/phone.png';
import EmailIcon from '../assets/images/contact.png';

const ContactInfo: React.FC = () => {
  return (
    <View>
      <Text style={styles.title}>Nous sommes là pour vous aider</Text>
      <Text style={styles.subtitle}>
        Si vous avez des questions ou besoin d&apos;assistance, n&apos;hésitez pas à nous contacter.
        Nous nous engageons à fournir un support exceptionnel et à garantir que votre
        expérience avec Dar Darkom soit parfaite.
      </Text>

      <View style={styles.contactBox}>
        <View style={styles.iconWrapper}>
          <Image source={EmailIcon} style={styles.icon} />
        </View>
        <View style={styles.info}>
          <Text style={styles.label}>Email</Text>
          <Text
            style={styles.link}
            onPress={() => Linking.openURL("mailto:support@dardarkom.com")}
          >
            support@dardarkom.com
          </Text>
        </View>
      </View>

      <View style={styles.contactBox}>
        <View style={styles.iconWrapper}>
          <Image source={PhoneIcon} style={styles.icon} />
        </View>
        <View style={styles.info}>
          <Text style={styles.label}>Téléphone</Text>
          <Text
            style={styles.link}
            onPress={() => Linking.openURL("tel:+21612345678")}
          >
            +216 12 345 678
          </Text>
        </View>
      </View>

      <View style={styles.contactBox}>
        <View style={styles.iconWrapper}>
          <Image source={PhoneIcon} style={styles.icon} />
        </View>
        <View style={styles.info}>
          <Text style={styles.label}>Horaires d&apos;ouverture</Text>
          <Text style={styles.link}>
            Lun-Ven: 9h-18h
          </Text>
        </View>
      </View>
    </View>
  );
};

export default ContactInfo;

const styles = StyleSheet.create({
    title: {
      fontSize: 20,
      fontWeight: "bold",
      marginBottom: 10,
      color: "#000",
    },
    subtitle: {
      color: "#8E8E93",
      marginBottom: 20,
      fontSize: 14,
      lineHeight: 20,
    },
    contactBox: {
      flexDirection: "row",
      alignItems: "center",
      marginBottom: 15,
    },
    iconWrapper: {
      backgroundColor: "#F5F5F5",
      padding: 12,
      borderRadius: 12,
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.05,
      shadowRadius: 2,
      elevation: 1,
    },
    icon: {
      width: 20,
      height: 20,
      resizeMode: "contain",
    },
    info: {
      marginLeft: 12,
    },
    label: {
      fontWeight: "bold",
      fontSize: 16,
      color: "#000",
    },
    link: {
      color: "#8E8E93",
      marginTop: 2,
      fontSize: 14,
    },
  });
  