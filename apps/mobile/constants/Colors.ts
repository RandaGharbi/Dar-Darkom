/**
 * Thème oriental authentique pour l'application Dar Darkom
 * Couleurs inspirées de l'art islamique et de la culture tunisienne
 */

// Couleurs principales du thème oriental
export const OrientalColors = {
  // Couleurs de base chaudes
  primary: '#D4AF37', // Or royal
  secondary: '#8B4513', // Brun sable du désert
  accent: '#CD853F', // Brun doré
  
  // Couleurs de fond chaudes
  background: '#FDF5E6', // Blanc cassé chaud
  surface: '#FFF8DC', // Blanc crème
  card: '#FAF0E6', // Blanc lin
  
  // Couleurs de texte
  textPrimary: '#2F1B14', // Brun foncé
  textSecondary: '#8B7355', // Brun moyen
  textLight: '#A0522D', // Brun clair
  
  // Couleurs d'accentuation
  success: '#228B22', // Vert forêt
  warning: '#FF8C00', // Orange foncé
  error: '#DC143C', // Rouge foncé
  
  // Couleurs de bordure et séparateurs
  border: '#DEB887', // Brun clair
  divider: '#F5DEB3', // Beige clair
  
  // Couleurs de gradient
  gradientStart: '#D4AF37',
  gradientEnd: '#8B4513',
  
  // Couleurs d'ombre
  shadow: '#8B7355',
  
  // Couleurs d'état
  active: '#D4AF37',
  inactive: '#D3D3D3',
  selected: '#F5DEB3',
  
  // Couleurs de catégories
  categoryPlats: '#8B4513',
  categoryPatisseries: '#D4AF37',
  categoryBoissons: '#CD853F',
  
  // Couleurs de prix
  price: '#228B22',
  discount: '#DC143C',
  
  // Couleurs de livraison
  delivery: '#4169E1',
  pickup: '#32CD32',
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
