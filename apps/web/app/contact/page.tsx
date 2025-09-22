"use client";

import React, { useState, useEffect, useRef } from "react";
import { DashboardLayout } from "../../components/layout/DashboardLayout";
import { GlobalStyles } from "../../components/styled/GlobalStyles";
import styled from "styled-components";
import {
  Send,
  MessageCircle,
  RefreshCw,
  Smile,
} from "lucide-react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import webSocketService from "../../lib/socket";


const Container = styled.div`
  background: linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%);
  min-height: calc(100vh - 120px);
  padding: 0;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', sans-serif;
  position: relative;
  
  &::before {
    content: '';
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-image: 
      radial-gradient(circle at 20% 80%, rgba(120, 119, 198, 0.1) 0%, transparent 50%),
      radial-gradient(circle at 80% 20%, rgba(255, 119, 198, 0.1) 0%, transparent 50%),
      radial-gradient(circle at 40% 40%, rgba(120, 219, 255, 0.1) 0%, transparent 50%);
    pointer-events: none;
    z-index: 0;
  }
`;

const Content = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 40px 32px 32px 32px;
  position: relative;
  z-index: 1;
  display: flex;
  flex-direction: column;
  height: calc(100vh - 120px);
  
  @media (max-width: 1120px) {
    padding: 32px 24px 24px 24px;
  }
  
  @media (max-width: 600px) {
    padding: 24px 16px 16px 16px;
  }
`;

const Header = styled.div`
  margin-bottom: 2rem;
  flex-shrink: 0;
  position: relative;
  z-index: 1;
`;

const Title = styled.h1`
  font-size: 36px;
  font-weight: 800;
  background: linear-gradient(135deg, #1e293b, #475569, #64748b);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  margin-bottom: 12px;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', sans-serif;
  position: relative;
  
  &::after {
    content: '';
    position: absolute;
    bottom: -8px;
    left: 0;
    width: 60px;
    height: 4px;
    background: linear-gradient(90deg, #3b82f6, #8b5cf6, #06b6d4);
    border-radius: 2px;
  }
  
  @media (max-width: 1120px) {
    font-size: 32px;
  }
  
  @media (max-width: 480px) {
    font-size: 28px;
  }
`;

const Subtitle = styled.p`
  color: #64748b;
  font-size: 1.2rem;
  margin: 0;
  font-weight: 500;
  line-height: 1.6;
  
  @media (max-width: 1120px) {
    font-size: 1.1rem;
  }
  
  @media (max-width: 480px) {
    font-size: 1rem;
  }
`;

const Grid = styled.div`
  display: flex;
  flex: 1;
  min-height: 0;
  overflow: hidden;
  background: linear-gradient(135deg, #ffffff 0%, #f8fafc 100%);
  border-radius: 20px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
  border: 1px solid rgba(226, 232, 240, 0.8);
  position: relative;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 4px;
    background: linear-gradient(90deg, #3b82f6, #8b5cf6, #06b6d4);
    border-radius: 20px 20px 0 0;
  }
  
  &:hover {
    box-shadow: 0 8px 32px rgba(0, 0, 0, 0.12);
    transform: translateY(-2px);
    border-color: rgba(59, 130, 246, 0.3);
  }

  @media (max-width: 768px) {
    flex-direction: column;
  }
`;

const ContactInfo = styled.div`
  width: 350px;
  padding: 28px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  min-height: 160px;
  position: relative;
  overflow: hidden;
  border-right: 2px solid rgba(226, 232, 240, 0.8);
  
  @media (max-width: 768px) {
    width: 100%;
    border-right: none;
    border-bottom: 2px solid rgba(226, 232, 240, 0.8);
  }

  /* Style de la scrollbar */
  &::-webkit-scrollbar {
    width: 6px;
  }

  &::-webkit-scrollbar-track {
    background: ${({ theme }) => theme.colors.surface};
    border-radius: 3px;
  }

  &::-webkit-scrollbar-thumb {
    background: linear-gradient(180deg, #3b82f6, #8b5cf6);
    border-radius: 3px;
    transition: background-color 0.2s ease;
  }

  &::-webkit-scrollbar-thumb:hover {
    background: linear-gradient(180deg, #2563eb, #7c3aed);
  }

  scroll-behavior: smooth;
`;

const ContactTitle = styled.h2`
  font-size: 1.75rem;
  font-weight: 700;
  color: ${({ theme }) => theme.colors.text.primary};
  margin: 0 0 2rem 0;
  display: flex;
  align-items: center;
  justify-content: space-between;
  position: relative;
  z-index: 1;
`;

const RefreshButton = styled.button`
  background: linear-gradient(135deg, #f1f5f9, #e2e8f0);
  border: 1px solid #e2e8f0;
  cursor: pointer;
  padding: 0.75rem;
  border-radius: 12px;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  color: ${({ theme }) => theme.colors.text.primary};
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);

  &:hover {
    background: linear-gradient(135deg, #e2e8f0, #cbd5e1);
    transform: translateY(-1px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  }

  &:active {
    transform: translateY(0);
  }

  &:focus {
    outline: none;
    box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
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
  gap: 1rem;
  padding: 1rem;
  background: ${({ theme, $isActive, $isRead }) => {
    if ($isActive) return 'linear-gradient(135deg, #3b82f6, #8b5cf6)';
    if ($isRead) return 'transparent';
    return 'linear-gradient(135deg, #f8fafc, #f1f5f9)';
  }};
  border-radius: 16px;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  color: ${({ theme, $isActive, $isRead }) => {
    if ($isActive) return "white";
    if ($isRead) return theme.colors.text.secondary;
    return theme.colors.text.primary;
  }};
  border: 1px solid ${({ $isActive, $isRead }) => {
    if ($isActive) return 'transparent';
    if ($isRead) return 'transparent';
    return '#e2e8f0';
  }};
  box-shadow: ${({ $isActive }) => 
    $isActive 
      ? '0 10px 25px -5px rgba(59, 130, 246, 0.3)' 
      : '0 2px 4px rgba(0, 0, 0, 0.05)'
  };

  &:hover {
    background: ${({ theme, $isActive }) =>
      $isActive 
        ? 'linear-gradient(135deg, #2563eb, #7c3aed)' 
        : 'linear-gradient(135deg, #f1f5f9, #e2e8f0)'};
    transform: translateY(-2px);
    box-shadow: ${({ $isActive }) => 
      $isActive 
        ? '0 15px 30px -5px rgba(59, 130, 246, 0.4)' 
        : '0 8px 20px -5px rgba(0, 0, 0, 0.1)'
    };
  }
`;

const UserAvatar = styled.div`
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: linear-gradient(135deg, #3b82f6, #8b5cf6);
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: bold;
  font-size: 0.875rem;
  box-shadow: 0 4px 12px rgba(59, 130, 246, 0.3);
  border: 2px solid white;
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
  flex: 1;
  display: flex;
  flex-direction: column;
  height: 100%;
  overflow: hidden;
  position: relative;
`;

const ChatHeader = styled.div`
  padding: 28px;
  border-bottom: 1px solid rgba(226, 232, 240, 0.8);
  display: flex;
  align-items: center;
  justify-content: space-between;
  background: linear-gradient(135deg, #f8fafc, #f1f5f9);
  flex-shrink: 0;
  min-height: 60px;
  position: relative;
  z-index: 1;
`;

const ChatTitle = styled.h3`
  font-size: 1.5rem;
  font-weight: 700;
  margin: 0;
  background: linear-gradient(135deg, #1e293b, #475569);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
`;

const MessagesContainer = styled.div`
  flex: 1;
  padding: 28px;
  overflow-y: auto;
  overflow-x: hidden;
  display: flex;
  flex-direction: column;
  gap: 1rem;
  background: linear-gradient(180deg, #ffffff 0%, #f8fafc 100%);
  min-height: 0;

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
  padding: 1rem 1.25rem;
  border-radius: 20px;
  background: ${({ $isUser }) =>
    $isUser 
      ? 'linear-gradient(135deg, #f1f5f9, #e2e8f0)' 
      : 'linear-gradient(135deg, #3b82f6, #8b5cf6)'};
  color: ${({ $isUser }) => $isUser ? '#1e293b' : "white"};
  word-wrap: break-word;
  word-break: break-word;
  line-height: 1.5;
  box-shadow: ${({ $isUser }) => 
    $isUser 
      ? '0 2px 8px rgba(0, 0, 0, 0.1)' 
      : '0 4px 12px rgba(59, 130, 246, 0.3)'
  };
  border: 1px solid ${({ $isUser }) => 
    $isUser ? '#e2e8f0' : 'transparent'
  };
  transition: all 0.2s ease;
  animation: messageSlideIn 0.3s ease-out;

  @keyframes messageSlideIn {
    from {
      opacity: 0;
      transform: translateY(10px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
`;

const MessageTime = styled.div`
  font-size: 0.7rem;
  opacity: 0.6;
  margin-top: 0.125rem;
  text-align: center;
`;

// MessageAvatar component removed as it's not used

const InputContainer = styled.div`
  padding: 28px;
  border-top: 1px solid rgba(226, 232, 240, 0.8);
  display: flex;
  gap: 1rem;
  background: linear-gradient(135deg, #f8fafc, #f1f5f9);
  flex-shrink: 0;
  min-height: 80px;
  position: relative;
  z-index: 1;
`;

const MessageInput = styled.input`
  flex: 1;
  padding: 1rem 1.25rem;
  border: 2px solid #e2e8f0;
  border-radius: 16px;
  font-size: 1rem;
  outline: none;
  background: white;
  color: #000000;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);

  &:focus {
    border-color: #3b82f6;
    box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
    transform: translateY(-1px);
  }

  &::placeholder {
    color: #94a3b8;
  }

  &:focus {
    border-color: ${({ theme }) => theme.colors.primary};
  }
`;

const SendButton = styled.button`
  padding: 1rem 1.5rem;
  background: linear-gradient(135deg, #3b82f6, #8b5cf6);
  color: white;
  border: none;
  border-radius: 16px;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 1rem;
  font-weight: 600;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  box-shadow: 0 4px 12px rgba(59, 130, 246, 0.3);
  min-width: 60px;
  justify-content: center;

  &:hover {
    background: linear-gradient(135deg, #2563eb, #7c3aed);
    transform: translateY(-2px);
    box-shadow: 0 8px 20px rgba(59, 130, 246, 0.4);
  }

  &:active {
    transform: translateY(0);
    box-shadow: 0 4px 12px rgba(59, 130, 246, 0.3);
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
    transform: none;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  }
`;

const EmojiButton = styled.button`
  background: none;
  border: none;
  color: #64748b;
  cursor: pointer;
  padding: 0.5rem;
  border-radius: 8px;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  justify-content: center;

  &:hover {
    background: #f1f5f9;
    color: #3b82f6;
  }
`;

const EmojiPicker = styled.div`
  position: absolute;
  bottom: 100%;
  left: 0;
  background: white;
  border: 1px solid #e2e8f0;
  border-radius: 12px;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.15);
  padding: 1rem;
  z-index: 1000;
  max-width: 300px;
  max-height: 200px;
  overflow-y: auto;
`;

const EmojiGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(8, 1fr);
  gap: 0.5rem;
`;

const EmojiItem = styled.button`
  background: none;
  border: none;
  font-size: 1.2rem;
  cursor: pointer;
  padding: 0.5rem;
  border-radius: 6px;
  transition: all 0.2s ease;

  &:hover {
    background: #f1f5f9;
    transform: scale(1.1);
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
  padding: 2rem;
  background: linear-gradient(135deg, #f8fafc, #f1f5f9);
  border-radius: 20px;
  margin: 1rem;
  position: relative;
  overflow: hidden;

  &::before {
    content: '';
    position: absolute;
    top: -50%;
    left: -50%;
    width: 200%;
    height: 200%;
    background: radial-gradient(circle, rgba(59, 130, 246, 0.05) 0%, transparent 70%);
    animation: float 6s ease-in-out infinite;
  }

  @keyframes float {
    0%, 100% {
      transform: translateY(0px) rotate(0deg);
    }
    50% {
      transform: translateY(-20px) rotate(180deg);
    }
  }
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
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
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
      } catch {
        // Gérer l'erreur silencieusement
      }
    }
  }, []);

  // Fermer le sélecteur d'emojis quand on clique ailleurs
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      if (!target.closest('[data-emoji-picker]') && !target.closest('[data-emoji-button]')) {
        setShowEmojiPicker(false);
      }
    };

    if (showEmojiPicker) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [showEmojiPicker]);

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
      } catch {
        // Gérer l'erreur silencieusement
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
          // Gérer l'erreur silencieusement
        }
      } catch {
        // Gérer l'erreur silencieusement
      }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const insertEmoji = (emoji: string) => {
    setNewMessage(prev => prev + emoji);
    setShowEmojiPicker(false);
  };

  const emojis = [
    '😀', '😃', '😄', '😁', '😆', '😅', '🤣', '😂',
    '🙂', '🙃', '😉', '😊', '😇', '🥰', '😍', '🤩',
    '😘', '😗', '😚', '😙', '😋', '😛', '😜', '🤪',
    '😝', '🤑', '🤗', '🤭', '🤫', '🤔', '🤐', '🤨',
    '😐', '😑', '😶', '😏', '😒', '🙄', '😬', '🤥',
    '😌', '😔', '😪', '🤤', '😴', '😷', '🤒', '🤕',
    '🤢', '🤮', '🤧', '🥵', '🥶', '🥴', '😵', '🤯',
    '🤠', '🥳', '😎', '🤓', '🧐', '😕', '😟', '🙁',
    '☹️', '😮', '😯', '😲', '😳', '🥺', '😦', '😧',
    '😨', '😰', '😥', '😢', '😭', '😱', '😖', '😣',
    '😞', '😓', '😩', '😫', '🥱', '😤', '😡', '😠',
    '🤬', '😈', '👿', '💀', '☠️', '💩', '🤡', '👹',
    '👺', '👻', '👽', '👾', '🤖', '😺', '😸', '😹',
    '😻', '😼', '😽', '🙀', '😿', '😾', '💋', '👋',
    '🤚', '🖐️', '✋', '🖖', '👌', '🤏', '✌️', '🤞',
    '🤟', '🤘', '🤙', '👈', '👉', '👆', '🖕', '👇',
    '☝️', '👍', '👎', '👊', '✊', '🤛', '🤜', '👏',
    '🙌', '👐', '🤲', '🤝', '🙏', '✍️', '💅', '🤳',
    '💪', '🦾', '🦿', '🦵', '🦶', '👂', '🦻', '👃',
    '🧠', '🦷', '🦴', '👀', '👁️', '👅', '👄', '💯',
    '💢', '💥', '💫', '💦', '💨', '🕳️', '💣', '💤',
    '💨', '💫', '💥', '💢', '💯', '🔥', '💥', '💢'
  ];

  const handleConversationSelect = (conversation: Conversation) => {
    console.log("🔄 Sélection conversation:", conversation);
    setSelectedConversation(conversation);
  };

  return (
    <DashboardLayout>
      <GlobalStyles />
      <Container>
        <Content>
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
                  <div style={{ position: 'relative', flex: 1, display: 'flex' }}>
                    <MessageInput
                      type="text"
                      placeholder="Tapez votre réponse..."
                      value={newMessage}
                      onChange={(e) => setNewMessage(e.target.value)}
                      onKeyPress={handleKeyPress}
                    />
                    <EmojiButton
                      onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                      type="button"
                      data-emoji-button
                    >
                      <Smile size={20} />
                    </EmojiButton>
                    {showEmojiPicker && (
                      <EmojiPicker data-emoji-picker>
                        <EmojiGrid>
                          {emojis.map((emoji, index) => (
                            <EmojiItem
                              key={index}
                              onClick={() => insertEmoji(emoji)}
                              type="button"
                            >
                              {emoji}
                            </EmojiItem>
                          ))}
                        </EmojiGrid>
                      </EmojiPicker>
                    )}
                  </div>
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
        </Content>
      </Container>
    </DashboardLayout>
  );
}
