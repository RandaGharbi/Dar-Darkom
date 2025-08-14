"use client";

import React, { useState, useRef, useEffect } from 'react';
import styled from 'styled-components';
import { MessageCircle, X, Send,  } from 'lucide-react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

const DropdownContainer = styled.div`
  position: relative;
  display: inline-block;
`;

const MessageButton = styled.button`
  position: relative;
  background: none;
  border: none;
  color: ${({ theme }) => theme.colors.text.secondary};
  cursor: pointer;
  padding: 8px;
  border-radius: 8px;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  justify-content: center;

  &:hover {
    background: ${({ theme }) => theme.colors.surface};
    color: ${({ theme }) => theme.colors.text.primary};
  }
`;

// MessageBadge component removed as it's not used

const Dropdown = styled.div<{ $isOpen: boolean }>`
  position: absolute;
  top: 100%;
  right: 0;
  width: 500px;
  max-height: 600px;
  background: ${({ theme }) => theme.colors.card.background};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: 12px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
  z-index: 1000;
  opacity: ${props => props.$isOpen ? 1 : 0};
  visibility: ${props => props.$isOpen ? 'visible' : 'hidden'};
  transform: ${props => props.$isOpen ? 'translateY(0)' : 'translateY(-10px)'};
  transition: all 0.2s ease;
  display: flex;
  flex-direction: column;
`;

const DropdownHeader = styled.div`
  padding: 1rem 1.5rem;
  border-bottom: 1px solid ${({ theme }) => theme.colors.border};
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const DropdownTitle = styled.h3`
  font-size: 1rem;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.text.primary};
  margin: 0;
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const CloseButton = styled.button`
  background: none;
  border: none;
  color: ${({ theme }) => theme.colors.text.muted};
  cursor: pointer;
  padding: 4px;
  border-radius: 4px;
  transition: color 0.2s ease;

  &:hover {
    color: ${({ theme }) => theme.colors.text.primary};
  }
`;

const ConversationsList = styled.div`
  flex: 1;
  overflow-y: auto;
  max-height: 300px;
`;

const ConversationItem = styled.div<{ $isActive: boolean }>`
  padding: 1rem;
  border-bottom: 1px solid ${({ theme }) => theme.colors.border};
  cursor: pointer;
  transition: all 0.2s ease;
  background: ${({ $isActive, theme }) => 
    $isActive ? theme.colors.surface : 'transparent'};

  &:hover {
    background: ${({ theme }) => theme.colors.surface};
  }
`;

const ConversationHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0.5rem;
`;

const UserInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const UserAvatar = styled.div`
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background: ${({ theme }) => theme.colors.primary};
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.875rem;
  font-weight: 600;
`;

const UserDetails = styled.div`
  flex: 1;
`;

const UserName = styled.div`
  font-weight: 600;
  color: ${({ theme }) => theme.colors.text.primary};
  font-size: 0.875rem;
`;

const UserEmail = styled.div`
  color: ${({ theme }) => theme.colors.text.muted};
  font-size: 0.75rem;
`;

// UnreadBadge component removed as it's not used

const LastMessage = styled.div`
  color: ${({ theme }) => theme.colors.text.muted};
  font-size: 0.75rem;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

const MessagesContainer = styled.div`
  flex: 1;
  padding: 1rem;
  overflow-y: auto;
  max-height: 300px;
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
`;

const Message = styled.div<{ $isUser: boolean }>`
  display: flex;
  justify-content: ${({ $isUser }) => ($isUser ? 'flex-end' : 'flex-start')};
`;

const MessageBubble = styled.div<{ $isUser: boolean }>`
  max-width: 80%;
  padding: 0.5rem 0.75rem;
  border-radius: 12px;
  background: ${({ $isUser, theme }) => 
    $isUser ? theme.colors.primary : theme.colors.surface};
  color: ${({ $isUser, theme }) => 
    $isUser ? 'white' : theme.colors.text.primary};
  font-size: 0.875rem;
  word-wrap: break-word;
`;

const MessageTime = styled.div`
  font-size: 0.75rem;
  color: ${({ theme }) => theme.colors.text.muted};
  margin-top: 0.25rem;
  text-align: center;
`;

const InputContainer = styled.div`
  padding: 1rem;
  border-top: 1px solid ${({ theme }) => theme.colors.border};
  display: flex;
  gap: 0.5rem;
  align-items: center;
`;

const MessageInput = styled.input`
  flex: 1;
  padding: 0.5rem 0.75rem;
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: 6px;
  background: ${({ theme }) => theme.colors.background};
  color: ${({ theme }) => theme.colors.text.primary};
  font-size: 0.875rem;

  &:focus {
    outline: none;
    border-color: ${({ theme }) => theme.colors.primary};
  }

  &::placeholder {
    color: ${({ theme }) => theme.colors.text.muted};
  }
`;

const SendButton = styled.button`
  padding: 0.5rem;
  background: ${({ theme }) => theme.colors.primary};
  color: white;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s ease;

  &:hover {
    background: ${({ theme }) => theme.colors.primary};
    transform: translateY(-1px);
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
    transform: none;
  }
`;

const EmptyState = styled.div`
  text-align: center;
  padding: 2rem;
  color: ${({ theme }) => theme.colors.text.muted};
`;

interface ChatMessage {
  id: string;
  content: string;
  isFromUser: boolean;
  createdAt: string;
}

interface UserConversation {
  userId: string;
  userEmail: string;
  userName: string;
  messages: ChatMessage[];
  unreadCount: number;
}

interface MessageDropdownProps {
  userId: string;
}

export const MessageDropdown: React.FC<MessageDropdownProps> = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedConversation, setSelectedConversation] = useState<UserConversation | null>(null);
  const [newMessage, setNewMessage] = useState('');
  // forceHideBadge removed as it's not used
  const dropdownRef = useRef<HTMLDivElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const queryClient = useQueryClient();

  // Connexion WebSocket - TEMPORAIREMENT DÉSACTIVÉ
  /*
  useEffect(() => {
    const token = localStorage.getItem('token');
    console.log('🔌 Tentative de connexion WebSocket...');
    console.log('🔑 Token présent:', !!token);
    
    if (token) {
      try {
        const socket = webSocketService.connect(token);
        console.log('🔌 Service WebSocket initialisé');
        
        // Écouter les nouveaux messages
        webSocketService.onNewMessage((message) => {
          console.log('📨 Nouveau message reçu (Web):', message);
          // Invalider les requêtes pour forcer le rafraîchissement
          queryClient.invalidateQueries({ queryKey: ['admin-messages'] });
          queryClient.invalidateQueries({ queryKey: ['unread-messages'] });
        });

        // Écouter les messages admin
        webSocketService.onAdminMessage((data) => {
          console.log('📨 Nouveau message admin reçu (Web):', data);
          // Invalider les requêtes pour forcer le rafraîchissement
          queryClient.invalidateQueries({ queryKey: ['admin-messages'] });
          queryClient.invalidateQueries({ queryKey: ['unread-messages'] });
        });
        
        console.log('✅ WebSocket configuré avec succès');
      } catch (error) {
        // Gérer l'erreur silencieusement
      }
    } else {
      console.log('❌ Pas de token, WebSocket non connecté');
    }

    return () => {
      console.log('🔌 Déconnexion WebSocket...');
      webSocketService.disconnect();
    };
  }, [queryClient]);
  */

  // Récupérer toutes les conversations
  const { data: conversations = [] } = useQuery({
    queryKey: ['admin-messages'],
    queryFn: async () => {
      const response = await fetch('/api/messages/admin/all', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      if (!response.ok) throw new Error('Erreur lors de la récupération des messages');
      return response.json();
    },
    enabled: isOpen,
    refetchOnWindowFocus: false,
    refetchInterval: false, // Désactiver le rafraîchissement automatique
    refetchIntervalInBackground: false
  });

  // Récupérer le nombre de messages non lus
  const { data: unreadData } = useQuery({
    queryKey: ['unread-messages'],
    queryFn: async () => {
      const response = await fetch('/api/messages/admin/unread-count', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      if (!response.ok) throw new Error('Erreur lors de la récupération du compteur');
      return response.json();
    },
    refetchInterval: false, // Désactiver le rafraîchissement automatique
    refetchIntervalInBackground: false
  });

  // Réinitialiser le badge caché si de nouveaux messages arrivent
  useEffect(() => {
    if (unreadData?.unreadCount > 0) {
      localStorage.removeItem('messageBadgeHidden');
    }
  }, [unreadData?.unreadCount]);

  // Mutation pour envoyer une réponse
  const sendReplyMutation = useMutation({
    mutationFn: async ({ userId, content }: { userId: string; content: string }) => {
      const response = await fetch('/api/messages/admin/reply', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({ userId, content })
      });
      if (!response.ok) throw new Error('Erreur lors de l\'envoi de la réponse');
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-messages'] });
      queryClient.invalidateQueries({ queryKey: ['unread-messages'] });
      setNewMessage('');
    }
  });

  // Mutation pour marquer comme lu
  const markAsReadMutation = useMutation({
    mutationFn: async (userId: string) => {
      const response = await fetch(`/api/messages/admin/mark-read/${userId}`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      if (!response.ok) throw new Error('Erreur lors du marquage comme lu');
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-messages'] });
      queryClient.invalidateQueries({ queryKey: ['unread-messages'] });
    }
  });

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [selectedConversation?.messages]);

  // Fermer le dropdown en cliquant à l'extérieur
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
        setSelectedConversation(null);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSendMessage = async () => {
    if (!newMessage.trim() || !selectedConversation) return;

    try {
      console.log('📤 Envoi de réponse admin...');
      console.log('👤 UserId de la conversation:', selectedConversation.userId);
      
      // Envoyer la réponse
      console.log('📤 Envoi réponse avec userId:', selectedConversation.userId);
      console.log('📤 Type de userId:', typeof selectedConversation.userId);
      console.log('📤 Conversation complète:', selectedConversation);
      console.log('📤 Corps de la requête:', { userId: selectedConversation.userId, content: newMessage.trim() });
      
      await sendReplyMutation.mutateAsync({
        userId: selectedConversation.userId,
        content: newMessage.trim()
      });
      
      console.log('✅ Réponse envoyée avec succès');
      
      // Ajouter le message à la conversation locale
      const updatedMessages = [
        ...selectedConversation.messages,
        {
          id: Date.now().toString(),
          content: newMessage.trim(),
          isFromUser: false,
          createdAt: new Date().toISOString()
        }
      ];
      
      // Mettre à jour la conversation sélectionnée
      setSelectedConversation({
        ...selectedConversation,
        messages: updatedMessages
      });
      
      // Vider le champ de saisie
      setNewMessage('');
      
    } catch {
      // Gérer l'erreur silencieusement
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleConversationSelect = async (conversation: UserConversation) => {
    try {
      console.log('🔄 Début handleConversationSelect');
      console.log('📧 Conversation:', conversation);
      console.log('👤 UserId:', conversation.userId);
      console.log('🔢 UnreadCount:', conversation.unreadCount);
      
      // Marquer comme lu si il y a des messages non lus
      if (conversation.unreadCount > 0) {
        console.log('✅ Marquage comme lu...');
        markAsReadMutation.mutate(conversation.userId);
      }
      
      // Rediriger vers la page contact avec les données de la conversation
      const conversationData = {
        userId: conversation.userId || '',
        userEmail: conversation.userEmail || '',
        userName: conversation.userName || '',
        messages: conversation.messages || []
      };
      
      console.log('🔄 Redirection vers /contact avec conversation:', conversationData);
      window.location.href = `/contact?conversation=${encodeURIComponent(JSON.stringify(conversationData))}`;
      
    } catch {
      // Gérer l'erreur silencieusement
    }
  };

  // unreadCount removed as it's not used

  return (
    <DropdownContainer ref={dropdownRef}>
      <MessageButton onClick={() => {
        setIsOpen(!isOpen);
        // Rafraîchir immédiatement quand on ouvre le dropdown
        if (!isOpen) {
          queryClient.invalidateQueries({ queryKey: ['admin-messages'] });
          queryClient.invalidateQueries({ queryKey: ['unread-messages'] });
        }
      }}>
        <MessageCircle size={20} />
        {/* Temporairement désactivé pour éviter les problèmes de persistance */}
        {/* {unreadCount > 0 && !forceHideBadge && <MessageBadge>{unreadCount}</MessageBadge>} */}
      </MessageButton>

      <Dropdown $isOpen={isOpen}>
        <DropdownHeader>
          <DropdownTitle>
            <MessageCircle size={16} />
            Messages Support
          </DropdownTitle>
          <CloseButton onClick={() => {
            setIsOpen(false);
            setSelectedConversation(null);
          }}>
            <X size={16} />
          </CloseButton>
        </DropdownHeader>

        {!selectedConversation ? (
          <ConversationsList>
            {conversations.length === 0 ? (
              <EmptyState>
                Aucun message
              </EmptyState>
            ) : (
              conversations.map((conversation: UserConversation) => (
                <ConversationItem
                  key={conversation.userId}
                  $isActive={false}
                  onClick={() => handleConversationSelect(conversation)}
                >
                  <ConversationHeader>
                    <UserInfo>
                      <UserAvatar>
                        {conversation.userName.charAt(0).toUpperCase()}
                      </UserAvatar>
                      <UserDetails>
                        <UserName>{conversation.userName}</UserName>
                        <UserEmail>{conversation.userEmail}</UserEmail>
                      </UserDetails>
                    </UserInfo>
                    {/* {conversation.unreadCount > 0 && (
                      <UnreadBadge>{conversation.unreadCount}</UnreadBadge>
                    )} */}
                  </ConversationHeader>
                  <LastMessage>
                    {conversation.messages && conversation.messages.length > 0 
                      ? conversation.messages[conversation.messages.length - 1]?.content || 'Aucun message'
                      : 'Aucun message'
                    }
                  </LastMessage>
                </ConversationItem>
              ))
            )}
          </ConversationsList>
        ) : (
          <>
            <ConversationItem $isActive={true}>
              <ConversationHeader>
                <UserInfo>
                  <UserAvatar>
                    {selectedConversation.userName.charAt(0).toUpperCase()}
                  </UserAvatar>
                  <UserDetails>
                    <UserName>{selectedConversation.userName}</UserName>
                    <UserEmail>{selectedConversation.userEmail}</UserEmail>
                  </UserDetails>
                </UserInfo>
                <CloseButton onClick={() => setSelectedConversation(null)}>
                  <X size={16} />
                </CloseButton>
              </ConversationHeader>
            </ConversationItem>

            <MessagesContainer>
              {selectedConversation.messages.length === 0 ? (
                <EmptyState>
                  Aucun message
                </EmptyState>
              ) : (
                <>
                  {selectedConversation.messages
                    .sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime())
                    .map((message) => (
                    <Message key={message.id} $isUser={message.isFromUser}>
                      <div>
                        <MessageBubble $isUser={message.isFromUser}>
                          {message.content}
                        </MessageBubble>
                        <MessageTime>
                          {new Date(message.createdAt).toLocaleTimeString('fr-FR', {
                            hour: '2-digit',
                            minute: '2-digit'
                          })}
                        </MessageTime>
                      </div>
                    </Message>
                  ))}
                  <div ref={messagesEndRef} />
                </>
              )}
            </MessagesContainer>

            <InputContainer>
              <MessageInput
                type="text"
                placeholder="Tapez votre réponse..."
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                onKeyPress={handleKeyPress}
              />
              <SendButton 
                onClick={handleSendMessage}
                disabled={!newMessage.trim() || sendReplyMutation.isPending}
              >
                <Send size={14} />
              </SendButton>
            </InputContainer>
          </>
        )}
      </Dropdown>
    </DropdownContainer>
  );
}; 