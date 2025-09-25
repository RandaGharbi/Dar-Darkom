import { StyleSheet } from 'react-native';
import { OrientalColors } from './Colors';

/**
 * Styles orientaux authentiques pour l'application Dar Darkom Driver
 * Inspirés de l'art islamique et de l'architecture arabe
 */

export const OrientalStyles = StyleSheet.create({
  // Styles de base
  container: {
    backgroundColor: OrientalColors.background,
    flex: 1,
  },
  
  // Styles de cartes modernes
  card: {
    backgroundColor: OrientalColors.card,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: OrientalColors.border,
    shadowColor: OrientalColors.shadow,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    margin: 8,
    padding: 16,
  },
  
  // Styles de boutons modernes
  button: {
    primary: {
      backgroundColor: OrientalColors.primary,
      borderRadius: 8,
      paddingHorizontal: 24,
      paddingVertical: 12,
      shadowColor: OrientalColors.shadow,
      shadowOffset: {
        width: 0,
        height: 2,
      },
      shadowOpacity: 0.1,
      shadowRadius: 4,
      elevation: 3,
    },
    secondary: {
      backgroundColor: OrientalColors.secondary,
      borderRadius: 8,
      paddingHorizontal: 24,
      paddingVertical: 12,
      shadowColor: OrientalColors.shadow,
      shadowOffset: {
        width: 0,
        height: 2,
      },
      shadowOpacity: 0.1,
      shadowRadius: 4,
      elevation: 3,
    },
    outline: {
      backgroundColor: 'transparent',
      borderRadius: 8,
      paddingHorizontal: 24,
      paddingVertical: 12,
      borderWidth: 1,
      borderColor: OrientalColors.primary,
    },
    rounded: {
      backgroundColor: OrientalColors.surface,
      borderRadius: 20,
      paddingHorizontal: 16,
      paddingVertical: 8,
      borderWidth: 1,
      borderColor: OrientalColors.border,
    },
  },
  
  // Styles de texte orientaux
  text: {
    title: {
      fontSize: 28,
      fontWeight: '700',
      color: OrientalColors.textPrimary,
      textAlign: 'center',
      marginBottom: 16,
    },
    subtitle: {
      fontSize: 20,
      fontWeight: '600',
      color: OrientalColors.textSecondary,
      textAlign: 'center',
      marginBottom: 12,
    },
    heading: {
      fontSize: 18,
      fontWeight: '600',
      color: OrientalColors.textPrimary,
      marginBottom: 8,
    },
    body: {
      fontSize: 16,
      color: OrientalColors.textSecondary,
      lineHeight: 24,
    },
    caption: {
      fontSize: 14,
      color: OrientalColors.textLight,
      fontStyle: 'italic',
    },
    button: {
      fontSize: 16,
      fontWeight: '600',
      textAlign: 'center',
    },
  },
  
  // Styles de bordures arabesques
  border: {
    arabic: {
      borderWidth: 2,
      borderColor: OrientalColors.primary,
      borderRadius: 12,
      borderStyle: 'solid',
    },
    rounded: {
      borderWidth: 1,
      borderColor: OrientalColors.border,
      borderRadius: 20,
    },
    decorative: {
      borderWidth: 3,
      borderColor: OrientalColors.accent,
      borderRadius: 8,
      borderStyle: 'dashed',
    },
  },
  
  // Styles de séparateurs orientaux
  divider: {
    horizontal: {
      height: 1,
      backgroundColor: OrientalColors.divider,
      marginVertical: 16,
    },
    vertical: {
      width: 1,
      backgroundColor: OrientalColors.divider,
      marginHorizontal: 16,
    },
    decorative: {
      height: 3,
      backgroundColor: OrientalColors.primary,
      borderRadius: 2,
      marginVertical: 20,
      alignSelf: 'center',
      width: '30%',
    },
  },
  
  // Styles de badges et étiquettes
  badge: {
    primary: {
      backgroundColor: OrientalColors.primary,
      borderRadius: 20,
      paddingHorizontal: 12,
      paddingVertical: 6,
    },
    secondary: {
      backgroundColor: OrientalColors.secondary,
      borderRadius: 20,
      paddingHorizontal: 12,
      paddingVertical: 6,
    },
    outline: {
      backgroundColor: 'transparent',
      borderRadius: 20,
      paddingHorizontal: 12,
      paddingVertical: 6,
      borderWidth: 1,
      borderColor: OrientalColors.primary,
    },
  },
  
  // Styles de navigation
  tabBar: {
    backgroundColor: OrientalColors.surface,
    borderTopWidth: 1,
    borderTopColor: OrientalColors.border,
    shadowColor: OrientalColors.shadow,
    shadowOffset: {
      width: 0,
      height: -2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 8,
  },
  
  // Styles de header oriental
  header: {
    backgroundColor: OrientalColors.background,
    borderBottomWidth: 2,
    borderBottomColor: OrientalColors.primary,
    shadowColor: OrientalColors.shadow,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 4,
  },
  
  // Styles de liste
  listItem: {
    backgroundColor: OrientalColors.card,
    borderRadius: 12,
    marginVertical: 4,
    marginHorizontal: 8,
    padding: 16,
    borderLeftWidth: 4,
    borderLeftColor: OrientalColors.primary,
    shadowColor: OrientalColors.shadow,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  
  // Styles de recherche
  searchBar: {
    backgroundColor: OrientalColors.surface,
    borderRadius: 25,
    borderWidth: 1,
    borderColor: OrientalColors.border,
    paddingHorizontal: 20,
    paddingVertical: 12,
    marginHorizontal: 16,
    marginVertical: 8,
    shadowColor: OrientalColors.shadow,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  
  // Styles de catégories
  categoryChip: {
    backgroundColor: OrientalColors.surface,
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 8,
    marginHorizontal: 4,
    marginVertical: 4,
    borderWidth: 1,
    borderColor: OrientalColors.border,
  },
  
  categoryChipActive: {
    backgroundColor: OrientalColors.primary,
    borderColor: OrientalColors.primary,
  },
  
  // Styles de prix
  price: {
    fontSize: 18,
    fontWeight: '700',
    color: OrientalColors.price,
  },
  
  priceOld: {
    fontSize: 14,
    color: OrientalColors.textLight,
    textDecorationLine: 'line-through',
    marginLeft: 8,
  },
  
  // Styles de disponibilité
  availability: {
    inStock: {
      color: OrientalColors.success,
      fontWeight: '600',
    },
    outOfStock: {
      color: OrientalColors.error,
      fontWeight: '600',
    },
    limited: {
      color: OrientalColors.warning,
      fontWeight: '600',
    },
  },
  
  // Styles d'ombre orientaux
  shadow: {
    light: {
      shadowColor: OrientalColors.shadow,
      shadowOffset: {
        width: 0,
        height: 2,
      },
      shadowOpacity: 0.1,
      shadowRadius: 4,
      elevation: 2,
    },
    medium: {
      shadowColor: OrientalColors.shadow,
      shadowOffset: {
        width: 0,
        height: 4,
      },
      shadowOpacity: 0.15,
      shadowRadius: 8,
      elevation: 6,
    },
    heavy: {
      shadowColor: OrientalColors.shadow,
      shadowOffset: {
        width: 0,
        height: 6,
      },
      shadowOpacity: 0.2,
      shadowRadius: 12,
      elevation: 10,
    },
  },
  
  // Styles de gradient
  gradient: {
    primary: {
      colors: [OrientalColors.gradientStart, OrientalColors.gradientEnd],
      start: { x: 0, y: 0 },
      end: { x: 1, y: 1 },
    },
    horizontal: {
      colors: [OrientalColors.gradientStart, OrientalColors.gradientEnd],
      start: { x: 0, y: 0 },
      end: { x: 1, y: 0 },
    },
  },
});

export default OrientalStyles;