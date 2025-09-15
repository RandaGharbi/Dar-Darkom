import React, { useState } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  Image,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { AudioTrack, getYouTubeThumbnail } from '../constants/AudioConfig';
import { useAudioPlayer } from '../hooks/useAudioPlayer';

interface AudioPlaylistProps {
  category?: string;
  onTrackSelect?: (track: AudioTrack) => void;
  showThumbnails?: boolean;
}

export const AudioPlaylist: React.FC<AudioPlaylistProps> = ({
  category,
  onTrackSelect,
  showThumbnails = true,
}) => {
  const { getTracksByCategory, getAllTracks, currentTrack, isPlaying } = useAudioPlayer();
  const [selectedCategory, setSelectedCategory] = useState(category || 'traditional');

  const tracks = category 
    ? getTracksByCategory(category)
    : getTracksByCategory(selectedCategory);

  const categories = ['traditional', 'ambient', 'classical'];

  const handleTrackPress = (track: AudioTrack) => {
    onTrackSelect?.(track);
  };

  const renderTrackItem = ({ item }: { item: AudioTrack }) => {
    const isCurrentTrack = currentTrack?.id === item.id;
    const isCurrentlyPlaying = isCurrentTrack && isPlaying;

    return (
      <TouchableOpacity
        style={[
          styles.trackItem,
          isCurrentTrack && styles.currentTrackItem,
        ]}
        onPress={() => handleTrackPress(item)}
      >
        {showThumbnails && (
          <Image
            source={{ uri: getYouTubeThumbnail(item.youtubeId, 'medium') }}
            style={styles.thumbnail}
            defaultSource={require('../assets/images/LogoDarDarkom.png')}
          />
        )}
        
        <View style={styles.trackInfo}>
          <Text style={[
            styles.trackTitle,
            isCurrentTrack && styles.currentTrackTitle
          ]} numberOfLines={1}>
            {item.title}
          </Text>
          <Text style={styles.trackDescription} numberOfLines={2}>
            {item.description}
          </Text>
          <View style={styles.trackMeta}>
            <Text style={styles.trackDuration}>
              {Math.floor(item.duration / 60)}:{(item.duration % 60).toString().padStart(2, '0')}
            </Text>
            <View style={styles.categoryBadge}>
              <Text style={styles.categoryText}>
                {item.category === 'traditional' ? 'Traditionnel' :
                 item.category === 'ambient' ? 'Ambiance' : 'Classique'}
              </Text>
            </View>
          </View>
        </View>

        <View style={styles.trackActions}>
          {isCurrentlyPlaying && (
            <View style={styles.playingIndicator}>
              <Ionicons name="musical-notes" size={16} color="#007AFF" />
            </View>
          )}
          <Ionicons 
            name={isCurrentTrack ? "pause" : "play"} 
            size={24} 
            color={isCurrentTrack ? "#007AFF" : "#666"} 
          />
        </View>
      </TouchableOpacity>
    );
  };

  const renderCategoryFilter = () => {
    if (category) return null;

    return (
      <View style={styles.categoryFilter}>
        {categories.map((cat) => (
          <TouchableOpacity
            key={cat}
            style={[
              styles.categoryButton,
              selectedCategory === cat && styles.activeCategoryButton,
            ]}
            onPress={() => setSelectedCategory(cat)}
          >
            <Text style={[
              styles.categoryButtonText,
              selectedCategory === cat && styles.activeCategoryButtonText,
            ]}>
              {cat === 'traditional' ? 'Traditionnel' :
               cat === 'ambient' ? 'Ambiance' : 'Classique'}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    );
  };

  return (
    <View style={styles.container}>
      {renderCategoryFilter()}
      
      <FlatList
        data={tracks}
        keyExtractor={(item) => item.id}
        renderItem={renderTrackItem}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.listContainer}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Ionicons name="musical-notes-outline" size={48} color="#ccc" />
            <Text style={styles.emptyText}>
              Aucune piste audio disponible
            </Text>
          </View>
        }
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  categoryFilter: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e5e5e7',
  },
  categoryButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    marginRight: 8,
    backgroundColor: '#f0f0f0',
  },
  activeCategoryButton: {
    backgroundColor: '#007AFF',
  },
  categoryButtonText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#666',
  },
  activeCategoryButtonText: {
    color: '#fff',
  },
  listContainer: {
    padding: 16,
  },
  trackItem: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 12,
    marginBottom: 8,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  currentTrackItem: {
    borderWidth: 2,
    borderColor: '#007AFF',
    backgroundColor: '#f0f8ff',
  },
  thumbnail: {
    width: 60,
    height: 60,
    borderRadius: 8,
    marginRight: 12,
  },
  trackInfo: {
    flex: 1,
    marginRight: 8,
  },
  trackTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 4,
  },
  currentTrackTitle: {
    color: '#007AFF',
  },
  trackDescription: {
    fontSize: 14,
    color: '#666',
    lineHeight: 18,
    marginBottom: 8,
  },
  trackMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  trackDuration: {
    fontSize: 12,
    color: '#999',
    fontWeight: '500',
  },
  categoryBadge: {
    backgroundColor: '#e8f4fd',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 10,
  },
  categoryText: {
    fontSize: 10,
    color: '#007AFF',
    fontWeight: '600',
    textTransform: 'uppercase',
  },
  trackActions: {
    alignItems: 'center',
    justifyContent: 'center',
    width: 40,
  },
  playingIndicator: {
    position: 'absolute',
    top: -8,
    right: -8,
    backgroundColor: '#fff',
    borderRadius: 10,
    width: 20,
    height: 20,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 2,
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 48,
  },
  emptyText: {
    fontSize: 16,
    color: '#999',
    marginTop: 16,
  },
});
