import React, { useState, useEffect } from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View, Image, FlatList, TextInput, Alert, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useSafeNavigation } from '../hooks/useSafeNavigation';
import { useAuth } from '../context/AuthContext';
import AsyncStorage from '@react-native-async-storage/async-storage';
import ContactInfo from '../components/ContactInfo';
import goBackIcon from '../assets/images/back.png';
import { getFullUrl } from '../config/api';
// eslint-disable-next-line import/no-named-as-default
import socketService from '../services/socketService';

interface Message {
  _id: string;
  content: string;
  isFromUser: boolean;
  createdAt: string;
  userEmail: string;
  userName: string;
}

interface Conversation {
  userId: string;
  userEmail: string;
  userName: string;
  messages: Message[];
  unreadCount: number;
}

const ContactUsPage: React.FC = () => {
  const router = useRouter();
  const { isAuthenticated } = useAuth();
  const { safeBack } = useSafeNavigation();
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [selectedConversation, setSelectedConversation] = useState<Conversation | null>(null);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [showContactInfo, setShowContactInfo] = useState(true);
  const [sendingMessage, setSendingMessage] = useState(false);
  const [creatingConversation, setCreatingConversation] = useState(false);

  const fetchConversations = async () => {
    try {
      console.log('🔍 Début récupération conversations...');
      
      const token = await AsyncStorage.getItem('authToken');
      console.log('🔑 Token présent:', !!token);
      
      if (!token) {
        Alert.alert('Erreur', 'Token d\'authentification manquant');
        return;
      }

      // Vérifier si l'utilisateur connecté est admin
      let isAdmin = false;
      let currentUserId = '';
      
      try {
        const userResponse = await fetch(getFullUrl('/api/me'), {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });
        
        if (userResponse.ok) {
          const userData = await userResponse.json();
          console.log('👤 Utilisateur connecté:', userData.user);
          console.log('👤 Rôle:', userData.user.role);
          
          isAdmin = userData.user.role === 'admin';
          currentUserId = userData.user._id;
        }
      } catch (userError) {
        console.error('❌ Erreur lors de la vérification utilisateur:', userError);
      }

      // Choisir l'endpoint selon le rôle
      let url = '';
      if (isAdmin) {
        url = getFullUrl('/api/messages/admin/all');
        console.log('🌐 URL Admin:', url);
      } else {
        // Pour les utilisateurs, utiliser l'endpoint centralisé
        url = getFullUrl(`/api/messages/user/${currentUserId}`);
        console.log('🌐 URL User:', url);
      }

      const response = await fetch(url, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      console.log('📡 Status de la réponse:', response.status);

      if (!response.ok) {
        // Pour un utilisateur, 404 signifie qu'il n'a pas encore de messages - c'est normal
        if (response.status === 404 && !isAdmin) {
          console.log('✅ Aucun message trouvé pour l\'utilisateur (404 - nouveau compte)');
          // Créer une conversation vide pour permettre à l'utilisateur de commencer
          const emptyConversation = {
            userId: currentUserId,
            userEmail: '', // Sera rempli lors du premier message
            userName: 'Moi',
            messages: [],
            unreadCount: 0
          };
          setConversations([emptyConversation]);
          return;
        }
        
        const errorData = await response.json().catch(() => ({}));
        console.log('❌ Données d\'erreur:', errorData);
        throw new Error(errorData.message || `Erreur ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();
      console.log('✅ Données récupérées:', data);
      
      if (isAdmin) {
        // Pour l'admin : data est un tableau de conversations
        console.log('✅ Conversations récupérées (Admin):', data.length);
        setConversations(data);
      } else {
        // Pour l'utilisateur : data est un tableau de messages
        console.log('✅ Messages récupérés (User):', data.length);
        
        if (data.length === 0) {
          // Aucun message pour cet utilisateur
          setConversations([]);
        } else {
          // Créer une conversation avec les messages de l'utilisateur
          // Récupérer le nom de l'utilisateur connecté
          let userDisplayName = 'Moi';
          try {
            const userResponse = await fetch(getFullUrl('/api/me'), {
              headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
              },
            });
            
            if (userResponse.ok) {
              const userData = await userResponse.json();
              userDisplayName = userData.user.name || userData.user.firstName || userData.user.email?.split('@')[0] || 'Moi';
            }
          } catch (error) {
            console.error('❌ Erreur lors de la récupération du nom utilisateur:', error);
          }
          
          const conversation = {
            userId: currentUserId,
            userEmail: data[0]?.userEmail || '',
            userName: userDisplayName,
            messages: data,
            unreadCount: 0
          };
          setConversations([conversation]);
        }
      }
    } catch (error) {
      console.error('❌ Erreur détaillée:', error);
      const errorMessage = error instanceof Error ? error.message : 'Erreur inconnue';
      
      // Afficher une alerte plus informative
      if (errorMessage.includes('Network request failed')) {
        Alert.alert(
          'Erreur de connexion', 
          'Impossible de se connecter au serveur. Vérifiez votre connexion internet et réessayez.',
          [{ text: 'OK' }]
        );
      } else {
        Alert.alert('Erreur', `Impossible de récupérer les conversations: ${errorMessage}`);
      }
    } finally {
      setLoading(false);
    }
  };

  const sendMessage = async () => {
    if (!newMessage.trim() || !selectedConversation) {
      Alert.alert('Erreur', 'Veuillez saisir un message');
      return;
    }

    setSendingMessage(true);

    try {
      console.log('🔍 Début envoi message...');
      console.log('📝 Message:', newMessage.trim());
      console.log('👤 Conversation sélectionnée:', selectedConversation);
      
      const token = await AsyncStorage.getItem('authToken');
      console.log('🔑 Token présent:', !!token);
      
      if (!token) {
        Alert.alert('Erreur', 'Token d\'authentification manquant');
        return;
      }

      // Vérifier si l'utilisateur est admin
      let isAdmin = false;
      try {
        const userResponse = await fetch(getFullUrl('/api/me'), {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });
        
        if (userResponse.ok) {
          const userData = await userResponse.json();
          isAdmin = userData.user.role === 'admin';
          console.log('👤 Rôle utilisateur:', userData.user.role);
        }
      } catch (error) {
        console.error('❌ Erreur lors de la vérification du rôle:', error);
      }

      // Vérifier que userId est défini
      if (!selectedConversation.userId) {
        console.error('❌ UserId manquant dans la conversation:', selectedConversation);
        Alert.alert('Erreur', 'ID utilisateur manquant');
        return;
      }

      // Envoyer via WebSocket pour le temps réel
      socketService.sendMessage(selectedConversation.userId, newMessage.trim());

      // Déterminer l'endpoint selon le type d'utilisateur
      let endpoint = '';
      let requestBody = {};
      
      if (isAdmin) {
        // Admin répond à un utilisateur
        endpoint = getFullUrl('/api/messages/admin/reply');
        requestBody = {
          userId: selectedConversation.userId,
          content: newMessage.trim(),
        };
      } else {
        // Utilisateur envoie un message
        endpoint = getFullUrl('/api/messages/user/send');
        requestBody = {
          content: newMessage.trim(),
        };
      }
      
      console.log('📤 Endpoint:', endpoint);
      console.log('📤 Corps de la requête:', requestBody);
      console.log('👤 selectedConversation.userId:', selectedConversation.userId);
      console.log('👤 Type de userId:', typeof selectedConversation.userId);
      console.log('👤 Conversation complète:', JSON.stringify(selectedConversation, null, 2));

      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody),
      });

      console.log('📡 Status de la réponse:', response.status);
      console.log('📡 Headers de la réponse:', Object.fromEntries(response.headers.entries()));

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        console.log('❌ Données d\'erreur:', errorData);
        throw new Error(errorData.message || `Erreur ${response.status}: ${response.statusText}`);
      }

      const responseData = await response.json();
      console.log('✅ Réponse du serveur:', responseData);

      // Ajouter le message à la conversation locale
      const newMessageObj: Message = {
        _id: Date.now().toString(),
        content: newMessage.trim(),
        isFromUser: !isAdmin, // Si c'est un admin qui écrit, isFromUser = false, sinon true
        createdAt: new Date().toISOString(),
        userEmail: selectedConversation.userEmail,
        userName: selectedConversation.userName,
      };

      setSelectedConversation(prev => prev ? {
        ...prev,
        messages: [...prev.messages, newMessageObj],
      } : null);

      // Rafraîchir la liste des conversations
      await fetchConversations();

      setNewMessage('');
      // Supprimer l'alerte de succès pour une expérience plus fluide
      // Alert.alert('Succès', 'Message envoyé avec succès');
    } catch (error) {
      console.error('❌ Erreur détaillée:', error);
      Alert.alert('Erreur', `Impossible d'envoyer le message: ${error instanceof Error ? error.message : 'Erreur inconnue'}`);
    } finally {
      setSendingMessage(false);
    }
  };

  const markAsRead = async (userId: string) => {
    try {
      const token = await AsyncStorage.getItem('authToken');
      if (!token) return;

      const response = await fetch(getFullUrl(`/api/messages/admin/mark-read/${userId}`), {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        console.error('Erreur lors du marquage comme lu:', response.status);
      }
    } catch (error) {
      console.error('Erreur lors du marquage comme lu:', error);
    }
  };

  useEffect(() => {
    if (isAuthenticated) {
      fetchConversations();
      
      // Connexion WebSocket
      const connectSocket = async () => {
        const token = await AsyncStorage.getItem('authToken');
        if (token) {
          try {
            socketService.connect(token);
            
            // Écouter les nouveaux messages
            socketService.onNewMessage((message) => {
              console.log('📨 Nouveau message reçu:', message);
              // Mettre à jour la conversation actuelle si elle correspond
              if (selectedConversation && message.userId === selectedConversation.userId) {
                setSelectedConversation(prev => prev ? {
                  ...prev,
                  messages: [...prev.messages, message]
                } : null);
              }
              // Rafraîchir la liste des conversations
              fetchConversations();
            });

            // Écouter les messages de l'admin
            socketService.onAdminMessage((data) => {
              console.log('📨 Nouveau message admin reçu:', data);
              console.log('📨 Structure des données:', JSON.stringify(data, null, 2));
              
              // Mettre à jour la conversation actuelle si elle correspond
              if (selectedConversation && data.userId === selectedConversation.userId) {
                const adminMessage = {
                  _id: data.message._id,
                  content: data.message.content,
                  isFromUser: false,
                  createdAt: data.message.createdAt,
                  userEmail: data.userEmail,
                  userName: data.userName
                };
                console.log('📝 Message admin formaté:', adminMessage);
                setSelectedConversation(prev => prev ? {
                  ...prev,
                  messages: [...prev.messages, adminMessage]
                } : null);
              } else {
                console.log('❌ Conversation non sélectionnée ou userId ne correspond pas');
                console.log('👤 Conversation sélectionnée:', selectedConversation?.userId);
                console.log('👤 Message userId:', data.userId);
              }
              // Rafraîchir la liste des conversations
              fetchConversations();
            });
          } catch (error) {
            console.error('❌ Erreur WebSocket:', error);
            // Continuer sans WebSocket, utiliser le fallback HTTP
          }
        }
      };
      
      connectSocket();
      
      // Rafraîchir les conversations toutes les 30 secondes (fallback)
      const interval = setInterval(() => {
        fetchConversations();
      }, 30000);
      
      return () => {
        clearInterval(interval);
        socketService.disconnect();
      };
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isAuthenticated, selectedConversation?.userId]);

  const renderConversationItem = ({ item }: { item: Conversation }) => {
    const lastMessage = item.messages.length > 0 ? item.messages[item.messages.length - 1] : null;
    const lastMessageTime = lastMessage ? new Date(lastMessage.createdAt).toLocaleTimeString('fr-FR', {
      hour: '2-digit',
      minute: '2-digit'
    }) : '';
    
    return (
      <TouchableOpacity
        style={styles.conversationItem}
        onPress={() => {
          // Quitter la conversation précédente si elle existe
          if (selectedConversation) {
            socketService.leaveConversation(selectedConversation.userId);
          }
          
          setSelectedConversation(item);
          setShowContactInfo(false);
          
          // Rejoindre la nouvelle conversation
          socketService.joinConversation(item.userId);
          
          if (item.unreadCount > 0) {
            markAsRead(item.userId);
          }
        }}
      >
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>
            {item.userName.charAt(0).toUpperCase()}
          </Text>
        </View>
        <View style={styles.conversationInfo}>
          <Text style={styles.userName}>{item.userName}</Text>
          <Text style={styles.userEmail}>{item.userEmail}</Text>
          <Text style={styles.lastMessage} numberOfLines={1}>
            {lastMessage ? lastMessage.content : 'Aucun message'}
          </Text>
          {lastMessageTime && (
            <Text style={styles.lastMessageTime}>{lastMessageTime}</Text>
          )}
        </View>
        {item.unreadCount > 0 && (
          <View style={styles.badge}>
            <Text style={styles.badgeText}>{item.unreadCount}</Text>
          </View>
        )}
      </TouchableOpacity>
    );
  };

  const renderMessage = ({ item }: { item: Message }) => {
    // Ignorer les messages vides
    if (!item.content || item.content.trim() === '') {
      return null;
    }

    // Gérer le cas où createdAt n'est pas une date valide
    let messageTime = '';
    try {
      const date = new Date(item.createdAt);
      if (!isNaN(date.getTime())) {
        messageTime = date.toLocaleTimeString('fr-FR', {
          hour: '2-digit',
          minute: '2-digit'
        });
      } else {
        messageTime = 'Maintenant';
      }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
      messageTime = 'Maintenant';
    }

    // Déterminer le nom de l'expéditeur
    let senderName = '';
    console.log('🔍 Message debug - isFromUser:', item.isFromUser, 'content:', item.content);
    if (item.isFromUser) {
      senderName = 'Moi';
    } else {
      // Pour les messages admin, afficher "Support Nourane"
      senderName = 'Support Nourane';
    }

    return (
      <View style={[
        styles.messageContainer,
        item.isFromUser ? styles.userMessage : styles.adminMessage
      ]}>
        <View style={styles.messageHeader}>
          <Text style={styles.messageSender}>
            {senderName}
          </Text>
        </View>
        <Text style={[
          styles.messageText,
          item.isFromUser ? styles.userMessageText : styles.adminMessageText
        ]}>
          {item.content}
        </Text>
        <Text style={styles.messageTime}>
          {messageTime}
        </Text>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.safe}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.goBackButton} onPress={safeBack}>
          <Image source={goBackIcon} style={styles.goBackIcon} />
        </TouchableOpacity>

        <Text style={styles.headerTitle}>Contact & Support</Text>

        {selectedConversation && (
          <TouchableOpacity 
            style={styles.backToConversationsButton} 
            onPress={() => {
              setSelectedConversation(null);
              setShowContactInfo(true);
            }}
          >
            <Ionicons name="close" size={24} color="#B47B48" />
          </TouchableOpacity>
        )}
      </View>

      {/* Content */}
      {(() => {
        console.log('🔍 État actuel - showContactInfo:', showContactInfo, 'selectedConversation:', !!selectedConversation);
        return null;
      })()}
      {!selectedConversation ? (
        <ScrollView contentContainerStyle={styles.container}>
          <View style={styles.inner}>
            <ContactInfo />
            
            {isAuthenticated && (
              <View style={styles.messagingSection}>
                <Text style={styles.sectionTitle}>Messagerie</Text>
                {loading ? (
                  <ActivityIndicator size="large" color="#B47B48" />
                ) : (
                  <FlatList
                    data={conversations}
                    renderItem={renderConversationItem}
                    keyExtractor={(item) => item.userId}
                    style={styles.conversationsList}
                    ListEmptyComponent={
                      <View style={styles.emptyState}>
                        <View style={styles.emptyStateIcon}>
                          <Text style={styles.emptyStateIconText}>💬</Text>
                        </View>
                        <Text style={styles.emptyStateTitle}>Aucune conversation</Text>
                        <Text style={styles.emptyStateText}>Commencez une nouvelle conversation pour obtenir de l&apos;aide</Text>
                        <TouchableOpacity 
                          style={[styles.newConversationButton, creatingConversation && styles.sendButtonDisabled]}
                          onPress={async () => {
                            console.log('🖱️ Clic sur "Nouvelle conversation"');
                            if (creatingConversation) {
                              console.log('⏳ Déjà en cours de création...');
                              return;
                            }
                            
                            console.log('🚀 Début création/récupération conversation...');
                            setCreatingConversation(true);
                            try {
                              const token = await AsyncStorage.getItem('authToken');
                              console.log('🔑 Token récupéré:', !!token);
                              
                              if (token) {
                                console.log('📡 Appel API /api/me...');
                                const userResponse = await fetch(getFullUrl('/api/me'), {
                                  headers: {
                                    'Authorization': `Bearer ${token}`,
                                    'Content-Type': 'application/json',
                                  },
                                });
                                
                                console.log('📡 Status réponse:', userResponse.status);
                                
                                if (userResponse.ok) {
                                  const userData = await userResponse.json();
                                  console.log('👤 UserData reçu:', userData);
                                  
                                  // Vérifier s'il y a déjà des conversations existantes
                                  const existingConversations = conversations.filter(conv => conv.userId === userData.user._id);
                                  
                                  if (existingConversations.length > 0) {
                                    // Utiliser la conversation existante
                                    console.log('✅ Conversation existante trouvée');
                                    setSelectedConversation(existingConversations[0]);
                                    setShowContactInfo(false);
                                  } else {
                                    // Créer une nouvelle conversation
                                    const newConversation: Conversation = {
                                      userId: userData.user._id,
                                      userEmail: userData.user.email || '',
                                      userName: userData.user.name || userData.user.firstName || userData.user.email?.split('@')[0] || 'Utilisateur',
                                      messages: [],
                                      unreadCount: 0
                                    };
                                    console.log('👤 Nouvelle conversation créée avec userId:', userData.user._id);
                                    console.log('🔄 Mise à jour des états...');
                                    console.log('📝 Conversation à définir:', newConversation);
                                    
                                    setSelectedConversation(newConversation);
                                    setShowContactInfo(false);
                                  }
                                  
                                  console.log('✅ États mis à jour');
                                } else {
                                  console.error('❌ Erreur API:', userResponse.status);
                                }
                              } else {
                                console.error('❌ Pas de token');
                              }
                            } catch (error) {
                              console.error('❌ Erreur lors de la création de la conversation:', error);
                              Alert.alert('Erreur', 'Impossible de créer une nouvelle conversation');
                            } finally {
                              console.log('🏁 Fin création conversation');
                              setCreatingConversation(false);
                            }
                          }}
                          disabled={creatingConversation}
                        >
                          {creatingConversation ? (
                            <ActivityIndicator size="small" color="white" />
                          ) : (
                            <Text style={styles.newConversationButtonText}>Nouvelle conversation</Text>
                          )}
                        </TouchableOpacity>
                      </View>
                    }
                  />
                )}
              </View>
            )}
          </View>
        </ScrollView>
      ) : (
        <View style={styles.chatContainer}>
          <View style={styles.chatHeader}>
            <View style={styles.chatUserInfo}>
              <Text style={styles.chatUserName}>{selectedConversation.userName}</Text>
              <Text style={styles.chatUserEmail}>{selectedConversation.userEmail}</Text>
            </View>
          </View>

          <FlatList
            data={selectedConversation.messages
              .filter(message => message.content && message.content.trim() !== '')
              .sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime())}
            renderItem={renderMessage}
            keyExtractor={(item) => item._id}
            style={styles.messagesList}
            inverted={false}
            contentContainerStyle={{ flexGrow: 1, justifyContent: 'flex-end' }}
          />

          <View style={styles.inputContainer}>
            <TextInput
              style={styles.input}
              value={newMessage}
              onChangeText={setNewMessage}
              placeholder="Tapez votre réponse..."
              multiline
              autoCorrect={false}
              spellCheck={false}
            />
            <TouchableOpacity
              style={[styles.sendButton, (!newMessage.trim() || sendingMessage || !selectedConversation?.userId) && styles.sendButtonDisabled]}
              onPress={sendMessage}
              disabled={!newMessage.trim() || sendingMessage || !selectedConversation?.userId}
            >
              {sendingMessage ? (
                <ActivityIndicator size="small" color="white" />
              ) : (
                <Ionicons name="send" size={20} color="white" />
              )}
            </TouchableOpacity>
          </View>
        </View>
      )}
    </SafeAreaView>
  );
};

export default ContactUsPage;

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 60,
    paddingHorizontal: 16,
    backgroundColor: '#fff',
    justifyContent: 'space-between',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
    flex: 1,
  },
  goBackButton: {
    padding: 8,
    width: 40,
    alignItems: 'flex-start',
  },
  goBackIcon: {
    width: 24,
    height: 24,
    tintColor: 'black',
    resizeMode: 'contain',
  },
  container: {
    flexGrow: 1,
    paddingHorizontal: 20,
    paddingBottom: 40,
  },
  inner: {
    paddingTop: 30,
  },
  messagingSection: {
    marginTop: 20,
    padding: 15,
    backgroundColor: '#f5f5f5',
    borderRadius: 10,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#333',
  },
  conversationsList: {
    minHeight: 250,
    borderRadius: 10,
    overflow: 'hidden',
  },
  conversationItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 15,
    backgroundColor: '#e0e0e0',
    borderRadius: 8,
    marginBottom: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 1,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#b47b48',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },
  avatarText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  conversationInfo: {
    flex: 1,
  },
  userName: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#333',
  },
  userEmail: {
    fontSize: 12,
    color: '#666',
  },
  lastMessage: {
    fontSize: 12,
    color: '#666',
    marginTop: 2,
  },
  lastMessageTime: {
    fontSize: 10,
    color: '#999',
    marginTop: 2,
  },
  badge: {
    backgroundColor: '#ff4d4d',
    borderRadius: 10,
    paddingHorizontal: 8,
    paddingVertical: 4,
    marginLeft: 10,
  },
  badgeText: {
    color: 'white',
    fontSize: 12,
    fontWeight: 'bold',
  },
  chatContainer: {
    flex: 1,
    backgroundColor: '#f0f0f0',
  },
  chatHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  chatUserInfo: {
    flex: 1,
  },
  chatUserName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  chatUserEmail: {
    fontSize: 12,
    color: '#666',
  },
  messagesList: {
    flex: 1,
    padding: 15,
  },
  messageContainer: {
    maxWidth: '80%',
    padding: 10,
    borderRadius: 10,
    marginBottom: 10,
  },
  userMessage: {
    alignSelf: 'flex-end',
    backgroundColor: '#b47b48',
    borderBottomRightRadius: 0,
  },
  adminMessage: {
    alignSelf: 'flex-start',
    backgroundColor: '#e0e0e0',
    borderBottomLeftRadius: 0,
  },
  messageText: {
    fontSize: 14,
    color: 'white',
  },
  userMessageText: {
    color: 'white',
  },
  adminMessageText: {
    color: '#333',
  },
  messageTime: {
    fontSize: 10,
    color: '#999',
    marginTop: 5,
    alignSelf: 'flex-end',
  },
  messageHeader: {
    marginBottom: 4,
  },
  messageSender: {
    fontSize: 12,
    color: '#666',
    fontWeight: '500',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    padding: 15,
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#eee',
  },
  input: {
    flex: 1,
    backgroundColor: '#f0f0f0',
    borderRadius: 20,
    paddingHorizontal: 15,
    paddingVertical: 10,
    fontSize: 14,
    marginRight: 10,
    minHeight: 40,
    maxHeight: 100,
  },
  sendButton: {
    backgroundColor: '#b47b48',
    borderRadius: 20,
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  sendButtonDisabled: {
    backgroundColor: '#ccc',
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    minHeight: 200,
  },
  emptyStateIcon: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#f0f0f0',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 15,
  },
  emptyStateIconText: {
    fontSize: 24,
  },
  emptyStateTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
    textAlign: 'center',
  },
  emptyStateText: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    marginBottom: 20,
    lineHeight: 20,
  },
  backToConversationsButton: {
    padding: 8,
    width: 40,
    alignItems: 'flex-end',
  },
  newConversationButton: {
    backgroundColor: '#B47B48',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 8,
    marginTop: 15,
    alignItems: 'center',
  },
  newConversationButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
