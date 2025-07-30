"use client";

import React, { useState, useEffect, useRef } from "react";
import { DashboardLayout } from "../../components/layout/DashboardLayout";
import { GlobalStyles } from "../../components/styled/GlobalStyles";
import styled from "styled-components";
import {
  Send,
  MessageCircle,
  RefreshCw,
} from "lucide-react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import webSocketService from "../../lib/socket";


const Container = styled.div`
  padding: 1.5rem;
  background: ${({ theme }) => theme.colors.background};
  height: calc(100vh - 120px);
  overflow: hidden;
  font-family: "Inter", "Segoe UI", Arial, sans-serif;
  color: ${({ theme }) => theme.colors.text.primary};
  display: flex;
  flex-direction: column;
  box-sizing: border-box;
`;

const Header = styled.div`
  margin-bottom: 0.75rem;
  flex-shrink: 0;
`;

const Title = styled.h1`
  font-size: 1.75rem;
  font-weight: bold;
  color: ${({ theme }) => theme.colors.text.primary};
  margin: 0 0 0.25rem 0;
`;

const Subtitle = styled.p`
  color: ${({ theme }) => theme.colors.text.secondary};
  font-size: 0.9rem;
  margin: 0;
`;

const Grid = styled.div`
  display: grid;
  grid-template-columns: 350px 1fr;
  gap: 1rem;
  flex: 1;
  min-height: 0;
  overflow: hidden;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const ContactInfo = styled.div`
  background: ${({ theme }) => theme.colors.card.background};
  border-radius: 12px;
  padding: 0.75rem;
  box-shadow: ${({ theme }) => theme.colors.card.shadow};
  border: 1px solid ${({ theme }) => theme.colors.border};
  display: flex;
  flex-direction: column;
  overflow: hidden;

  /* Style de la scrollbar */
  &::-webkit-scrollbar {
    width: 6px;
  }

  &::-webkit-scrollbar-track {
    background: ${({ theme }) => theme.colors.surface};
    border-radius: 3px;
  }

  &::-webkit-scrollbar-thumb {
    background: ${({ theme }) => theme.colors.border};
    border-radius: 3px;
    transition: background-color 0.2s ease;
  }

  &::-webkit-scrollbar-thumb:hover {
    background: ${({ theme }) => theme.colors.text.secondary};
  }

  scroll-behavior: smooth;
`;

const ContactTitle = styled.h2`
  font-size: 1.5rem;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.text.primary};
  margin: 0 0 1.5rem 0;
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const RefreshButton = styled.button`
  background: none;
  border: none;
  cursor: pointer;
  padding: 0.5rem;
  border-radius: 8px;
  transition: background-color 0.2s ease;
  color: ${({ theme }) => theme.colors.text.primary};

  &:hover {
    background-color: ${({ theme }) => theme.colors.surface};
  }

  &:focus {
    outline: none;
    box-shadow: 0 0 0 2px ${({ theme }) => theme.colors.primary};
  }
`;

const ConversationsList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  overflow-y: auto;
  overflow-x: hidden;
  flex: 1;
  min-height: 0;
  padding-right: 0.5rem;

  /* Style de la scrollbar */
  &::-webkit-scrollbar {
    width: 6px;
  }

  &::-webkit-scrollbar-track {
    background: ${({ theme }) => theme.colors.surface};
    border-radius: 3px;
  }

  &::-webkit-scrollbar-thumb {
    background: ${({ theme }) => theme.colors.border};
    border-radius: 3px;
    transition: background-color 0.2s ease;
  }

  &::-webkit-scrollbar-thumb:hover {
    background: ${({ theme }) => theme.colors.text.secondary};
  }

  scroll-behavior: smooth;
`;

const ConversationItem = styled.div<{ $isActive?: boolean; $isRead?: boolean }>`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem;
  background: ${({ theme, $isActive, $isRead }) => {
    if ($isActive) return theme.colors.primary;
    if ($isRead) return "transparent";
    return theme.colors.surface;
  }};
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.2s ease;
  color: ${({ theme, $isActive, $isRead }) => {
    if ($isActive) return "white";
    if ($isRead) return theme.colors.text.secondary;
    return theme.colors.text.primary;
  }};

  &:hover {
    background: ${({ theme, $isActive }) =>
      $isActive ? theme.colors.primary : theme.colors.surface};
    transform: translateY(-1px);
  }
`;

const UserAvatar = styled.div`
  width: 28px;
  height: 28px;
  border-radius: 50%;
  background: ${({ theme }) => theme.colors.primary};
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: bold;
  font-size: 0.75rem;
`;

const UserInfo = styled.div`
  flex: 1;
`;

const UserName = styled.div`
  font-weight: 600;
  margin-bottom: 0.25rem;
`;

const UserEmail = styled.div`
  font-size: 0.875rem;
  opacity: 0.8;
`;

const LastMessage = styled.div`
  font-size: 0.875rem;
  opacity: 0.7;
  margin-top: 0.25rem;
`;

const ChatContainer = styled.div`
  background: ${({ theme }) => theme.colors.card.background};
  border-radius: 12px;
  max-height: calc(100vh - 200px);
  box-shadow: ${({ theme }) => theme.colors.card.shadow};
  border: 1px solid ${({ theme }) => theme.colors.border};
  display: flex;
  flex-direction: column;
  height: 100%;
  overflow: hidden;
`;

const ChatHeader = styled.div`
  padding: 0.5rem;
  border-bottom: 1px solid ${({ theme }) => theme.colors.border};
  display: flex;
  align-items: center;
  justify-content: space-between;
  background: ${({ theme }) => theme.colors.card.background};
  flex-shrink: 0;
  min-height: 35px;
`;

const ChatTitle = styled.h3`
  font-size: 1.25rem;
  font-weight: 600;
  margin: 0;
`;

const MessagesContainer = styled.div`
  flex: 1;
  padding: 0.5rem;
  overflow-y: auto;
  overflow-x: hidden;
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
  min-height: 0;
  background: ${({ theme }) => theme.colors.card.background};

  /* Améliorer le style de la scrollbar */
  &::-webkit-scrollbar {
    width: 8px;
  }

  &::-webkit-scrollbar-track {
    background: ${({ theme }) => theme.colors.surface};
    border-radius: 4px;
  }

  &::-webkit-scrollbar-thumb {
    background: ${({ theme }) => theme.colors.border};
    border-radius: 4px;
    transition: background-color 0.2s ease;
  }

  &::-webkit-scrollbar-thumb:hover {
    background: ${({ theme }) => theme.colors.text.secondary};
  }

  /* Assurer un défilement fluide */
  scroll-behavior: smooth;

  /* Animation pour les nouveaux messages */
  .message-enter {
    opacity: 0;
    transform: translateY(10px);
  }

  .message-enter-active {
    opacity: 1;
    transform: translateY(0);
    transition:
      opacity 0.3s ease,
      transform 0.3s ease;
  }
`;

const Message = styled.div<{ $isUser: boolean }>`
  display: flex;
  justify-content: ${({ $isUser }) => ($isUser ? "flex-start" : "flex-end")};
  align-items: center;
  gap: 0.375rem;
  margin-bottom: 0.5rem;
`;

const MessageContent = styled.div<{ $isUser: boolean }>`
  display: flex;
  flex-direction: column;
  align-items: ${({ $isUser }) => ($isUser ? "flex-start" : "flex-end")};
  max-width: 70%;
`;

const MessageSender = styled.div<{ $isUser: boolean }>`
  font-size: 0.7rem;
  color: ${({ theme }) => theme.colors.text.muted};
  margin-bottom: 0.125rem;
  font-weight: 500;
`;

const MessageBubble = styled.div<{ $isUser: boolean }>`
  max-width: 100%;
  padding: 0.5rem 0.75rem;
  border-radius: 10px;
  background: ${({ theme, $isUser }) =>
    $isUser ? theme.colors.surface : theme.colors.primary};
  color: ${({ theme, $isUser }) =>
    $isUser ? theme.colors.text.primary : "white"};
  word-wrap: break-word;
  word-break: break-word;
  line-height: 1.3;
`;

const MessageTime = styled.div`
  font-size: 0.7rem;
  opacity: 0.6;
  margin-top: 0.125rem;
  text-align: center;
`;

// MessageAvatar component removed as it's not used

const InputContainer = styled.div`
  padding: 0.5rem;
  border-top: 1px solid ${({ theme }) => theme.colors.border};
  display: flex;
  gap: 0.75rem;
  background: ${({ theme }) => theme.colors.card.background};
  flex-shrink: 0;
  min-height: 50px;
`;

const MessageInput = styled.input`
  flex: 1;
  padding: 0.75rem 1rem;
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: 8px;
  font-size: 0.875rem;
  outline: none;

  &:focus {
    border-color: ${({ theme }) => theme.colors.primary};
  }
`;

const SendButton = styled.button`
  padding: 0.75rem 1rem;
  background: ${({ theme }) => theme.colors.primary};
  color: white;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.875rem;
  transition: all 0.2s ease;

  &:hover {
    opacity: 0.9;
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

const EmptyState = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100%;
  color: ${({ theme }) => theme.colors.text.secondary};
  text-align: center;
`;

interface ChatMessage {
  id: string;
  content: string;
  isFromUser: boolean;
  createdAt: Date;
}

interface Conversation {
  userId: string;
  userEmail: string;
  userName: string;
  messages: ChatMessage[];
  unreadCount: number;
}

export default function ContactPage() {
  const [newMessage, setNewMessage] = useState("");
  const [selectedConversation, setSelectedConversation] =
    useState<Conversation | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const queryClient = useQueryClient();

  // Récupérer les conversations depuis l'URL si disponible
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const conversationParam = urlParams.get("conversation");

    if (conversationParam) {
      try {
        const conversationData = JSON.parse(
          decodeURIComponent(conversationParam)
        );
        console.log("📧 Conversation reçue depuis URL:", conversationData);
        setSelectedConversation(conversationData);
      } catch (error) {
        console.error("❌ Erreur lors du parsing de la conversation:", error);
      }
    }
  }, []);

  // Configuration WebSocket pour les messages en temps réel
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      try {
        webSocketService.connect(token);

        // Écouter les nouveaux messages utilisateur
        webSocketService.onNewMessage((data) => {
          console.log("📨 Nouveau message utilisateur reçu (Contact):", data);
          console.log("📨 Structure complète:", JSON.stringify(data, null, 2));

          // Le message peut être dans data.message ou directement dans data
          const message = data.message || data;
          console.log("📨 Message extrait:", message);
          console.log("📨 isFromUser:", message.isFromUser);

          // Mettre à jour la conversation sélectionnée si elle correspond
          if (
            selectedConversation &&
            data.userId === selectedConversation.userId
          ) {
            const newMessageObj: ChatMessage = {
              id: message._id || Date.now().toString(),
              content: message.content,
              isFromUser: message.isFromUser === true, // S'assurer que c'est bien un boolean
              createdAt: new Date(message.createdAt),
            };

            setSelectedConversation((prev) =>
              prev
                ? {
                    ...prev,
                    messages: [...prev.messages, newMessageObj],
                  }
                : null
            );
          }

          // Rafraîchir la liste des conversations
          queryClient.invalidateQueries({ queryKey: ["admin-messages"] });
        });

        // Écouter les réponses admin
        webSocketService.onAdminMessage((data) => {
          console.log("📨 Nouveau message admin reçu (Contact):", data);

          // Mettre à jour la conversation sélectionnée si elle correspond
          if (
            selectedConversation &&
            data.userId === selectedConversation.userId
          ) {
            const adminMessage: ChatMessage = {
              id: data.message._id || Date.now().toString(),
              content: data.message.content,
              isFromUser: false,
              createdAt: new Date(data.message.createdAt),
            };

            setSelectedConversation((prev) =>
              prev
                ? {
                    ...prev,
                    messages: [...prev.messages, adminMessage],
                  }
                : null
            );
          }

          // Rafraîchir la liste des conversations
          queryClient.invalidateQueries({ queryKey: ["admin-messages"] });
        });
      } catch (error) {
        console.error("❌ Erreur WebSocket (Contact):", error);
      }
    }

    return () => {
      webSocketService.disconnect();
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedConversation?.userId, queryClient]);

  // Récupérer toutes les conversations
  const { data: conversations = [] } = useQuery({
    queryKey: ["admin-messages"],
    queryFn: async () => {
      const response = await fetch("/api/messages/admin/all", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      if (!response.ok)
        throw new Error("Erreur lors de la récupération des messages");
      return response.json();
    },
    refetchInterval: false,
    refetchOnWindowFocus: false,
    refetchIntervalInBackground: false,
  });



  const scrollToBottom = () => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  };

  // Scroll automatique vers le bas quand de nouveaux messages arrivent
  useEffect(() => {
    if (
      selectedConversation?.messages &&
      selectedConversation.messages.length > 0
    ) {
      // Petit délai pour s'assurer que le DOM est mis à jour
      setTimeout(() => {
        scrollToBottom();
      }, 100);
    }
  }, [selectedConversation?.messages, selectedConversation]);

  // Scroll automatique quand une nouvelle conversation est sélectionnée
  useEffect(() => {
    if (selectedConversation) {
      setTimeout(() => {
        scrollToBottom();
      }, 200);
    }
  }, [selectedConversation]);

  const handleSendMessage = async () => {
    if (!newMessage.trim() || !selectedConversation) return;

    try {
      console.log("📤 Envoi de réponse admin...");

      const response = await fetch("/api/messages/admin/reply", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId: selectedConversation.userId,
          content: newMessage.trim(),
        }),
      });

      if (response.ok) {
        console.log("✅ Réponse envoyée avec succès");

        // Le message sera ajouté automatiquement via WebSocket, pas besoin de l'ajouter manuellement
        setNewMessage("");

        // Forcer le scroll vers le bas après l'envoi
        setTimeout(() => {
          scrollToBottom();
        }, 150);
      } else {
        console.error("❌ Erreur lors de l'envoi:", response.status);
      }
    } catch (error) {
      console.error("❌ Erreur lors de l'envoi:", error);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleConversationSelect = (conversation: Conversation) => {
    console.log("🔄 Sélection conversation:", conversation);
    setSelectedConversation(conversation);
  };

  return (
    <DashboardLayout>
      <GlobalStyles />
      <Container>
        <Header>
          <Title>Contact & Support</Title>
          <Subtitle>
            Notre équipe est là pour vous aider. Gérez les conversations avec
            vos clients.
          </Subtitle>
        </Header>

        <Grid>
          <ContactInfo>
            <ContactTitle>
              Conversations
              <RefreshButton
                onClick={() =>
                  queryClient.invalidateQueries({
                    queryKey: ["admin-messages"],
                  })
                }
                title="Rafraîchir les conversations"
              >
                <RefreshCw size={16} />
              </RefreshButton>
            </ContactTitle>
            <ConversationsList>
              {conversations.length === 0 ? (
                <EmptyState>
                  <MessageCircle size={48} />
                  <p>Aucune conversation</p>
                </EmptyState>
              ) : (
                conversations.map((conversation: Conversation) => (
                  <ConversationItem
                    key={conversation.userId}
                    $isActive={
                      selectedConversation?.userId === conversation.userId
                    }
                    $isRead={
                      selectedConversation?.userId === conversation.userId
                    }
                    onClick={() => handleConversationSelect(conversation)}
                  >
                    <UserAvatar>
                      {conversation.userName.charAt(0).toUpperCase()}
                    </UserAvatar>
                    <UserInfo>
                      <UserName>{conversation.userName}</UserName>
                      <UserEmail>{conversation.userEmail}</UserEmail>
                      <LastMessage>
                        {conversation.messages &&
                        conversation.messages.length > 0
                          ? conversation.messages[
                              conversation.messages.length - 1
                            ]?.content || "Aucun message"
                          : "Aucun message"}
                      </LastMessage>
                    </UserInfo>
                  </ConversationItem>
                ))
              )}
            </ConversationsList>
          </ContactInfo>

          <ChatContainer>
            {selectedConversation ? (
              <>
                <ChatHeader>
                  <ChatTitle>
                    {selectedConversation.userName} (
                    {selectedConversation.userEmail})
                  </ChatTitle>
                </ChatHeader>

                <MessagesContainer>
                  {selectedConversation.messages.length === 0 ? (
                    <EmptyState>
                      <MessageCircle size={48} />
                      <p>Aucun message</p>
                    </EmptyState>
                  ) : (
                    <>
                      {selectedConversation.messages
                        .sort(
                          (a, b) =>
                            new Date(a.createdAt).getTime() -
                            new Date(b.createdAt).getTime()
                        )
                        .map((message) => {
                          // Gérer le cas où createdAt n'est pas une date valide
                          let messageTime = "";
                          try {
                            const date = new Date(message.createdAt);
                            if (!isNaN(date.getTime())) {
                              messageTime = date.toLocaleTimeString("fr-FR", {
                                hour: "2-digit",
                                minute: "2-digit",
                              });
                            } else {
                              messageTime = "Maintenant";
                            }
                          } catch {
                            messageTime = "Maintenant";
                          }

                          return (
                            <Message
                              key={message.id}
                              $isUser={message.isFromUser}
                            >
                              <MessageContent $isUser={message.isFromUser}>
                                <MessageSender $isUser={message.isFromUser}>
                                  {message.isFromUser
                                    ? selectedConversation?.userName ||
                                      "Utilisateur"
                                    : "Admin"}
                                </MessageSender>
                                <MessageBubble $isUser={message.isFromUser}>
                                  {message.content}
                                </MessageBubble>
                                <MessageTime>{messageTime}</MessageTime>
                              </MessageContent>
                            </Message>
                          );
                        })}
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
                    disabled={!newMessage.trim()}
                  >
                    <Send size={14} />
                  </SendButton>
                </InputContainer>
              </>
            ) : (
              <EmptyState>
                <MessageCircle size={48} />
                <p>Sélectionnez une conversation pour commencer</p>
              </EmptyState>
            )}
          </ChatContainer>
        </Grid>
      </Container>
    </DashboardLayout>
  );
}
