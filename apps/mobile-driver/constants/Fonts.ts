/**
 * Configuration des polices orientales pour l'application Dar Darkom
 * Polices inspirées de la calligraphie arabe et de l'art islamique
 */

export const OrientalFonts = {
  // Polices principales
  primary: {
    regular: 'System',
    medium: 'System',
    semiBold: 'System',
    bold: 'System',
    extraBold: 'System',
  },
  
  // Polices décoratives pour les titres
  decorative: {
    title: 'System',
    subtitle: 'System',
    heading: 'System',
  },
  
  // Polices pour le contenu
  content: {
    body: 'System',
    caption: 'System',
    button: 'System',
    label: 'System',
  },
  
  // Tailles de police
  sizes: {
    // Titres
    title: {
      large: 32,
      medium: 28,
      small: 24,
    },
    
    // Sous-titres
    subtitle: {
      large: 22,
      medium: 20,
      small: 18,
    },
    
    // En-têtes
    heading: {
      large: 18,
      medium: 16,
      small: 14,
    },
    
    // Corps de texte
    body: {
      large: 16,
      medium: 14,
      small: 12,
    },
    
    // Légendes
    caption: {
      large: 14,
      medium: 12,
      small: 10,
    },
    
    // Boutons
    button: {
      large: 16,
      medium: 14,
      small: 12,
    },
    
    // Labels
    label: {
      large: 14,
      medium: 12,
      small: 10,
    },
  },
  
  // Poids des polices
  weights: {
    light: '300',
    regular: '400',
    medium: '500',
    semiBold: '600',
    bold: '700',
    extraBold: '800',
  },
  
  // Hauteurs de ligne
  lineHeights: {
    tight: 1.2,
    normal: 1.4,
    relaxed: 1.6,
    loose: 1.8,
  },
  
  // Espacement des lettres
  letterSpacing: {
    tight: -0.5,
    normal: 0,
    wide: 0.5,
    wider: 1,
  },
};

// Styles de texte prédéfinis
export const TextStyles = {
  // Titres principaux
  title: {
    fontSize: OrientalFonts.sizes.title.medium,
    fontWeight: OrientalFonts.weights.bold,
    lineHeight: OrientalFonts.sizes.title.medium * OrientalFonts.lineHeights.tight,
    letterSpacing: OrientalFonts.letterSpacing.wide,
  },
  
  // Sous-titres
  subtitle: {
    fontSize: OrientalFonts.sizes.subtitle.medium,
    fontWeight: OrientalFonts.weights.semiBold,
    lineHeight: OrientalFonts.sizes.subtitle.medium * OrientalFonts.lineHeights.normal,
    letterSpacing: OrientalFonts.letterSpacing.normal,
  },
  
  // En-têtes
  heading: {
    fontSize: OrientalFonts.sizes.heading.medium,
    fontWeight: OrientalFonts.weights.semiBold,
    lineHeight: OrientalFonts.sizes.heading.medium * OrientalFonts.lineHeights.normal,
    letterSpacing: OrientalFonts.letterSpacing.normal,
  },
  
  // Corps de texte
  body: {
    fontSize: OrientalFonts.sizes.body.medium,
    fontWeight: OrientalFonts.weights.regular,
    lineHeight: OrientalFonts.sizes.body.medium * OrientalFonts.lineHeights.relaxed,
    letterSpacing: OrientalFonts.letterSpacing.normal,
  },
  
  // Légendes
  caption: {
    fontSize: OrientalFonts.sizes.caption.medium,
    fontWeight: OrientalFonts.weights.regular,
    lineHeight: OrientalFonts.sizes.caption.medium * OrientalFonts.lineHeights.normal,
    letterSpacing: OrientalFonts.letterSpacing.normal,
  },
  
  // Boutons
  button: {
    fontSize: OrientalFonts.sizes.button.medium,
    fontWeight: OrientalFonts.weights.semiBold,
    lineHeight: OrientalFonts.sizes.button.medium * OrientalFonts.lineHeights.normal,
    letterSpacing: OrientalFonts.letterSpacing.wide,
  },
  
  // Labels
  label: {
    fontSize: OrientalFonts.sizes.label.medium,
    fontWeight: OrientalFonts.weights.medium,
    lineHeight: OrientalFonts.sizes.label.medium * OrientalFonts.lineHeights.normal,
    letterSpacing: OrientalFonts.letterSpacing.normal,
  },
};

export default OrientalFonts;
