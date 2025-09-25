export interface Country {
  code: string;
  name: string;
  flag: string;
  dialCode: string;
}

export const countries: Country[] = [
  { code: 'TN', name: 'Tunisie', flag: '🇹🇳', dialCode: '+216' },
  { code: 'FR', name: 'France', flag: '🇫🇷', dialCode: '+33' },
  { code: 'DZ', name: 'Algérie', flag: '🇩🇿', dialCode: '+213' },
  { code: 'MA', name: 'Maroc', flag: '🇲🇦', dialCode: '+212' },
  { code: 'LY', name: 'Libye', flag: '🇱🇾', dialCode: '+218' },
  { code: 'EG', name: 'Égypte', flag: '🇪🇬', dialCode: '+20' },
  { code: 'US', name: 'États-Unis', flag: '🇺🇸', dialCode: '+1' },
  { code: 'GB', name: 'Royaume-Uni', flag: '🇬🇧', dialCode: '+44' },
  { code: 'DE', name: 'Allemagne', flag: '🇩🇪', dialCode: '+49' },
  { code: 'IT', name: 'Italie', flag: '🇮🇹', dialCode: '+39' },
  { code: 'ES', name: 'Espagne', flag: '🇪🇸', dialCode: '+34' },
  { code: 'CA', name: 'Canada', flag: '🇨🇦', dialCode: '+1' },
  { code: 'AU', name: 'Australie', flag: '🇦🇺', dialCode: '+61' },
  { code: 'BR', name: 'Brésil', flag: '🇧🇷', dialCode: '+55' },
  { code: 'IN', name: 'Inde', flag: '🇮🇳', dialCode: '+91' },
  { code: 'CN', name: 'Chine', flag: '🇨🇳', dialCode: '+86' },
  { code: 'JP', name: 'Japon', flag: '🇯🇵', dialCode: '+81' },
  { code: 'KR', name: 'Corée du Sud', flag: '🇰🇷', dialCode: '+82' },
  { code: 'RU', name: 'Russie', flag: '🇷🇺', dialCode: '+7' },
  { code: 'TR', name: 'Turquie', flag: '🇹🇷', dialCode: '+90' },
  { code: 'SA', name: 'Arabie Saoudite', flag: '🇸🇦', dialCode: '+966' },
  { code: 'AE', name: 'Émirats Arabes Unis', flag: '🇦🇪', dialCode: '+971' },
  { code: 'QA', name: 'Qatar', flag: '🇶🇦', dialCode: '+974' },
  { code: 'KW', name: 'Koweït', flag: '🇰🇼', dialCode: '+965' },
  { code: 'BH', name: 'Bahreïn', flag: '🇧🇭', dialCode: '+973' },
  { code: 'OM', name: 'Oman', flag: '🇴🇲', dialCode: '+968' },
  { code: 'JO', name: 'Jordanie', flag: '🇯🇴', dialCode: '+962' },
  { code: 'LB', name: 'Liban', flag: '🇱🇧', dialCode: '+961' },
  { code: 'SY', name: 'Syrie', flag: '🇸🇾', dialCode: '+963' },
  { code: 'IQ', name: 'Irak', flag: '🇮🇶', dialCode: '+964' },
  { code: 'IR', name: 'Iran', flag: '🇮🇷', dialCode: '+98' },
  { code: 'AF', name: 'Afghanistan', flag: '🇦🇫', dialCode: '+93' },
  { code: 'PK', name: 'Pakistan', flag: '🇵🇰', dialCode: '+92' },
  { code: 'BD', name: 'Bangladesh', flag: '🇧🇩', dialCode: '+880' },
  { code: 'LK', name: 'Sri Lanka', flag: '🇱🇰', dialCode: '+94' },
  { code: 'MV', name: 'Maldives', flag: '🇲🇻', dialCode: '+960' },
  { code: 'NP', name: 'Népal', flag: '🇳🇵', dialCode: '+977' },
  { code: 'BT', name: 'Bhoutan', flag: '🇧🇹', dialCode: '+975' },
  { code: 'MM', name: 'Myanmar', flag: '🇲🇲', dialCode: '+95' },
  { code: 'TH', name: 'Thaïlande', flag: '🇹🇭', dialCode: '+66' },
  { code: 'VN', name: 'Vietnam', flag: '🇻🇳', dialCode: '+84' },
  { code: 'LA', name: 'Laos', flag: '🇱🇦', dialCode: '+856' },
  { code: 'KH', name: 'Cambodge', flag: '🇰🇭', dialCode: '+855' },
  { code: 'MY', name: 'Malaisie', flag: '🇲🇾', dialCode: '+60' },
  { code: 'SG', name: 'Singapour', flag: '🇸🇬', dialCode: '+65' },
  { code: 'ID', name: 'Indonésie', flag: '🇮🇩', dialCode: '+62' },
  { code: 'PH', name: 'Philippines', flag: '🇵🇭', dialCode: '+63' },
  { code: 'BN', name: 'Brunei', flag: '🇧🇳', dialCode: '+673' },
  { code: 'TL', name: 'Timor-Leste', flag: '🇹🇱', dialCode: '+670' },
  { code: 'MN', name: 'Mongolie', flag: '🇲🇳', dialCode: '+976' },
  { code: 'KZ', name: 'Kazakhstan', flag: '🇰🇿', dialCode: '+7' },
  { code: 'UZ', name: 'Ouzbékistan', flag: '🇺🇿', dialCode: '+998' },
  { code: 'TM', name: 'Turkménistan', flag: '🇹🇲', dialCode: '+993' },
  { code: 'TJ', name: 'Tadjikistan', flag: '🇹🇯', dialCode: '+992' },
  { code: 'KG', name: 'Kirghizistan', flag: '🇰🇬', dialCode: '+996' },
  { code: 'AZ', name: 'Azerbaïdjan', flag: '🇦🇿', dialCode: '+994' },
  { code: 'AM', name: 'Arménie', flag: '🇦🇲', dialCode: '+374' },
  { code: 'GE', name: 'Géorgie', flag: '🇬🇪', dialCode: '+995' },
  { code: 'IL', name: 'Israël', flag: '🇮🇱', dialCode: '+972' },
  { code: 'PS', name: 'Palestine', flag: '🇵🇸', dialCode: '+970' },
];

// Fonction pour trouver un pays par son code
export const getCountryByCode = (code: string): Country | undefined => {
  return countries.find(country => country.code === code);
};

// Fonction pour trouver un pays par son code de numérotation
export const getCountryByDialCode = (dialCode: string): Country | undefined => {
  return countries.find(country => country.dialCode === dialCode);
};

// Pays par défaut (Tunisie)
export const defaultCountry: Country = countries[0];
