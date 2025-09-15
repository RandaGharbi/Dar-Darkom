import React from "react";
import { View, Text, Linking, StyleSheet, Image } from "react-native";
import PhoneIcon from '../assets/images/phone.png';
import EmailIcon from '../assets/images/contact.png';

const ContactInfo: React.FC = () => {
  return (
    <View>
      <Text style={styles.title}>We&apos;re here to help</Text>
      <Text style={styles.subtitle}>
        If you have any questions or need assistance, please reach out to us.
        We&apos;re committed to providing exceptional support and ensuring your
        experience with Nourane is seamless.
      </Text>

      <View style={styles.contactBox}>
        <View style={styles.iconWrapper}>
          <Image source={EmailIcon} style={styles.icon} />
        </View>
        <View style={styles.info}>
          <Text style={styles.label}>Email</Text>
          <Text
            style={styles.link}
            onPress={() => Linking.openURL("mailto:support@nourane.com")}
          >
                          support@nourane.com
          </Text>
        </View>
      </View>

      <View style={styles.contactBox}>
        <View style={styles.iconWrapper}>
          <Image source={PhoneIcon} style={styles.icon} />
        </View>
        <View style={styles.info}>
          <Text style={styles.label}>Phone</Text>
          <Text
            style={styles.link}
            onPress={() => Linking.openURL("tel:+15551234567")}
          >
            +1 (555) 123-4567
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
    },
    subtitle: {
      color: "#555",
      marginBottom: 20,
    },
    contactBox: {
      flexDirection: "row",
      alignItems: "center",
      marginBottom: 15,
    },
    iconWrapper: {
      backgroundColor: "#F3F0EB",
      padding: 10,
      borderRadius: 12,
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 3,
      elevation: 2, // For Android shadow
    },
    icon: {
      width: 24,
      height: 24,
      resizeMode: "contain",
    },
    info: {
      marginLeft: 12,
    },
    label: {
      fontWeight: "bold",
    },
    link: {
      color: "#8A7861",
      marginTop: 2,
    },
  });
  