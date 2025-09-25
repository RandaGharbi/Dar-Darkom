/**
 * Thème oriental authentique pour l'application Dar Darkom Driver
 * Couleurs inspirées de l'art islamique et de la culture tunisienne
 */

// Couleurs principales du thème oriental
export const OrientalColors = {
  // Couleurs de base modernes
  primary: '#2E86AB', // Bleu foncé moderne
  secondary: '#4A90A4', // Bleu moyen
  accent: '#5BA3C7', // Bleu clair
  primaryDark: '#1E5F7A', // Bleu foncé
  
  // Couleurs de fond modernes
  background: '#FFFFFF', // Blanc pur
  surface: '#F8F9FA', // Gris très clair
  card: '#FFFFFF', // Blanc pur
  
  // Couleurs de texte modernes
  textPrimary: '#2C3E50', // Gris foncé
  textSecondary: '#6C757D', // Gris moyen
  textLight: '#ADB5BD', // Gris clair
  
  // Couleurs d'accentuation
  success: '#28A745', // Vert moderne
  warning: '#FFC107', // Jaune d'avertissement
  error: '#DC3545', // Rouge moderne
  
  // Couleurs de bordure et séparateurs
  border: '#E9ECEF', // Gris très clair
  divider: '#F1F3F4', // Gris clair
  
  // Couleurs de gradient
  gradientStart: '#2E86AB',
  gradientEnd: '#1E5F7A',
  
  // Couleurs d'ombre
  shadow: '#6C757D',
  
  // Couleurs d'état
  active: '#2E86AB',
  inactive: '#D3D3D3',
  selected: '#E3F2FD',
  
  // Couleurs de catégories
  categoryPlats: '#2E86AB',
  categoryPatisseries: '#4A90A4',
  categoryBoissons: '#5BA3C7',
  
  // Couleurs de prix
  price: '#2E86AB',
  discount: '#DC3545',
  
  // Couleurs de livraison
  delivery: '#2E86AB',
  pickup: '#28A745',
};

// Thème clair (par défaut)
export const Colors = {
  light: {
    text: OrientalColors.textPrimary,
    background: OrientalColors.background,
    tint: OrientalColors.primary,
    icon: OrientalColors.textSecondary,
    tabIconDefault: OrientalColors.textSecondary,
    tabIconSelected: OrientalColors.primary,
    surface: OrientalColors.surface,
    card: OrientalColors.card,
    border: OrientalColors.border,
    primary: OrientalColors.primary,
    secondary: OrientalColors.secondary,
    accent: OrientalColors.accent,
  },
  dark: {
    text: '#FDF5E6',
    background: '#2F1B14',
    tint: OrientalColors.primary,
    icon: '#DEB887',
    tabIconDefault: '#DEB887',
    tabIconSelected: OrientalColors.primary,
    surface: '#3C2A1A',
    card: '#4A3A2A',
    border: '#8B7355',
    primary: OrientalColors.primary,
    secondary: OrientalColors.secondary,
    accent: OrientalColors.accent,
  },
};

// Couleurs d'accentuation pour les composants
export const ComponentColors = {
  button: {
    primary: OrientalColors.primary,
    secondary: OrientalColors.secondary,
    outline: 'transparent',
    disabled: OrientalColors.inactive,
  },
  input: {
    background: OrientalColors.surface,
    border: OrientalColors.border,
    focus: OrientalColors.primary,
    placeholder: OrientalColors.textLight,
  },
  card: {
    background: OrientalColors.card,
    border: OrientalColors.border,
    shadow: OrientalColors.shadow,
  },
  badge: {
    primary: OrientalColors.primary,
    secondary: OrientalColors.secondary,
    success: OrientalColors.success,
    warning: OrientalColors.warning,
    error: OrientalColors.error,
  },
};

export default Colors;