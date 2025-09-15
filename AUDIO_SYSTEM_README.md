# 🎵 Système Audio Traditionnel - Dar Darkom

Ce système permet d'intégrer des tonalités et chansons traditionnelles dans votre application mobile et web via des liens YouTube.

## 🚀 Fonctionnalités

- **Lecture audio YouTube** : Utilise des liens YouTube pour éviter le stockage local
- **Playlist traditionnelle** : Musique andalouse, berbère, gnawa, etc.
- **Contrôles complets** : Play/Pause, volume, progression, boucle
- **Interface intuitive** : Boutons flottants et lecteur intégré
- **API Backend** : Gestion centralisée des pistes audio
- **Mode hors-ligne** : Fallback sur des pistes locales

## 📱 Installation Mobile

### 1. Dépendances déjà installées
```json
{
  "expo-av": "^16.0.7"  // ✅ Déjà présent
}
```

### 2. Fichiers créés
- `constants/AudioConfig.ts` - Configuration des pistes
- `services/audioService.ts` - Service de lecture audio
- `services/audioApiService.ts` - API backend
- `hooks/useAudioPlayer.ts` - Hook React
- `components/AudioPlayer.tsx` - Lecteur principal
- `components/AudioPlaylist.tsx` - Liste des pistes
- `components/AudioToggleButton.tsx` - Bouton flottant
- `app/audio.tsx` - Écran dédié

### 3. Utilisation simple

```tsx
import { AudioToggleButton } from './components/AudioToggleButton';

// Bouton flottant simple
<AudioToggleButton 
  position="top-right" 
  size="medium" 
  showLabel={true} 
/>

// Lecteur complet
<AudioPlayer 
  track={selectedTrack}
  onTrackChange={setSelectedTrack}
  showControls={true}
/>
```

## 🔧 Installation Backend

### 1. Fichiers créés
- `models/AudioTrack.ts` - Modèle MongoDB
- `controllers/audioController.ts` - Contrôleurs API
- `routes/audioRoutes.ts` - Routes API
- `utils/youtubeUtils.ts` - Utilitaires YouTube
- `scripts/initAudioTracks.js` - Script d'initialisation

### 2. Initialisation

```bash
# Installer les dépendances (déjà fait)
cd apps/backend
npm install

# Initialiser les pistes audio
npm run init-audio

# Démarrer le serveur
npm run dev
```

### 3. API Endpoints

```
GET    /api/audio              # Toutes les pistes
GET    /api/audio/popular      # Pistes populaires
GET    /api/audio/:id          # Piste par ID
POST   /api/audio/:id/play     # Incrémenter compteur
GET    /api/audio/youtube/:id/embed  # URL d'embed
POST   /api/audio              # Créer piste (admin)
PUT    /api/audio/:id          # Modifier piste (admin)
DELETE /api/audio/:id          # Supprimer piste (admin)
```

## 🎵 Configuration des Pistes

### Ajouter une nouvelle piste

1. **Via l'API** (recommandé) :
```bash
curl -X POST http://localhost:5000/api/audio \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{
    "title": "Nouvelle Piste Traditionnelle",
    "youtubeId": "VIDEO_ID_YOUTUBE",
    "duration": 180,
    "category": "traditional",
    "description": "Description de la piste"
  }'
```

2. **Via le script d'initialisation** :
Modifiez `apps/backend/scripts/initAudioTracks.js` et relancez :
```bash
npm run init-audio
```

### Catégories disponibles
- `traditional` - Musique traditionnelle (andalouse, berbère, gnawa)
- `ambient` - Ambiance sonore (souk, café)
- `classical` - Musique classique arabe/ottomane

## 🎛️ Utilisation Avancée

### Hook personnalisé
```tsx
import { useAudioPlayer } from './hooks/useAudioPlayer';

function MyComponent() {
  const {
    isPlaying,
    currentTrack,
    volume,
    playTrack,
    togglePlayPause,
    setVolume
  } = useAudioPlayer();

  return (
    <View>
      <Text>Piste actuelle: {currentTrack?.title}</Text>
      <Button 
        title={isPlaying ? 'Pause' : 'Play'} 
        onPress={togglePlayPause} 
      />
    </View>
  );
}
```

### Service audio direct
```tsx
import { audioService } from './services/audioService';

// Jouer une piste
await audioService.playTrack('track_id');

// Obtenir les pistes par catégorie
const tracks = await audioService.getTracksByCategory('traditional');

// Rechercher des pistes
const results = await audioService.searchTracks('andalous');
```

## 🔧 Personnalisation

### Modifier les pistes par défaut
Éditez `apps/mobile/constants/AudioConfig.ts` :

```typescript
export const TRADITIONAL_AUDIO_TRACKS: AudioTrack[] = [
  {
    id: 'ma_piste',
    title: 'Ma Piste Personnalisée',
    youtubeId: 'VOTRE_ID_YOUTUBE',
    duration: 200,
    category: 'traditional',
    description: 'Description de ma piste'
  }
];
```

### Modifier les paramètres audio
```typescript
export const AUDIO_SETTINGS = {
  defaultVolume: 0.5,        // Volume par défaut
  autoPlay: true,            // Lecture automatique
  autoLoop: true,            // Boucle automatique
  fadeInDuration: 3000,      // Fade in (ms)
  fadeOutDuration: 2000,     // Fade out (ms)
};
```

## 🐛 Dépannage

### Problèmes courants

1. **Pas de son** :
   - Vérifiez que `expo-av` est installé
   - Vérifiez les permissions audio sur l'appareil
   - Testez avec des pistes locales d'abord

2. **Erreur API** :
   - Vérifiez que le backend est démarré
   - Vérifiez l'URL de l'API dans `config/api.ts`
   - Vérifiez la connexion réseau

3. **Pistes YouTube ne jouent pas** :
   - Vérifiez que les IDs YouTube sont corrects
   - Certaines vidéos peuvent être restreintes
   - Utilisez des pistes audio dédiées

### Logs de débogage
```typescript
// Activer les logs détaillés
console.log('État audio:', audioService.getState());
console.log('Pistes disponibles:', await audioService.getAllTracks());
```

## 📊 Analytics

Le système enregistre automatiquement :
- Nombre de lectures par piste
- Temps d'écoute
- Pistes populaires
- Erreurs de lecture

Accédez aux données via l'API :
```bash
GET /api/audio/popular  # Pistes les plus écoutées
```

## 🚀 Déploiement

### Mobile
```bash
# Build de production
expo build:production

# Les pistes audio sont gérées via l'API
# Aucun fichier audio local à déployer
```

### Backend
```bash
# Build et déploiement
npm run build
npm run start:prod

# Initialiser les pistes en production
npm run init-audio
```

## 📝 Notes Importantes

1. **Droits d'auteur** : Assurez-vous d'avoir les droits pour utiliser les vidéos YouTube
2. **Performance** : Les pistes YouTube peuvent prendre du temps à charger
3. **Données mobiles** : La lecture YouTube consomme des données
4. **Mode hors-ligne** : Prévoyez des pistes locales de fallback

## 🤝 Contribution

Pour ajouter de nouvelles fonctionnalités :
1. Modifiez les services dans `services/`
2. Ajoutez les composants dans `components/`
3. Mettez à jour l'API backend
4. Testez sur mobile et web
5. Documentez les changements

---

**🎵 Profitez de votre musique traditionnelle !**
