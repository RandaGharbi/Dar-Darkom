"use client";

import React from 'react';
import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { usePathname, useRouter } from "next/navigation";
import styled from "styled-components";
import { Menu, LogOut, Bell, CheckCircle, AlertCircle, Info, Mail } from "lucide-react";
import Link from "next/link";
import { useTranslation } from "../../hooks/useTranslation";
import { authAPI } from "../../lib/api";
import { LanguageSelector } from "../LanguageSelector";
import { useNotifications } from "../../hooks/useNotifications";
import notificationWebSocket from "../../services/notificationWebSocket";
import { useWebSocket } from "../../hooks/useWebSocket";

import Image from "next/image";
import { removeToken } from "../../utils/auth";
import { ThemeToggle } from "../ThemeToggle";

const Sidebar = styled.aside<{ $isOpen: boolean }>`
  width: 280px;
  background: linear-gradient(180deg, #ffffff 0%, #f8fafc 100%);
  transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  border-right: 1px solid rgba(226, 232, 240, 0.8);
  display: none;
  position: relative;
  overflow: hidden;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-image: 
      radial-gradient(circle at 20% 20%, rgba(59, 130, 246, 0.05) 0%, transparent 50%),
      radial-gradient(circle at 80% 80%, rgba(139, 92, 246, 0.05) 0%, transparent 50%);
    pointer-events: none;
  }

  @media (max-width: 1120px) {
    display: block;
    position: fixed;
    top: 0;
    left: 0;
    height: 100vh;
    z-index: 50;
    transform: translateX(${(props) => (props.$isOpen ? "0" : "-100%")});
    box-shadow: 0 0 40px rgba(0, 0, 0, 0.1);
  }
`;

const SidebarHeader = styled.div`
  padding: 2rem 1.5rem;
  border-bottom: 1px solid rgba(226, 232, 240, 0.6);
  position: relative;
  z-index: 1;
`;

const Logo = styled.h1`
  font-size: 1.6rem;
  font-weight: 800;
  background: linear-gradient(135deg, #1e293b, #475569);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  margin: 0;
  display: flex;
  align-items: center;
  gap: 12px;
  position: relative;
  
  &::after {
    content: '';
    position: absolute;
    bottom: -4px;
    left: 0;
    width: 40px;
    height: 2px;
    background: linear-gradient(90deg, #3b82f6, #8b5cf6);
    border-radius: 1px;
  }
`;

// Remplacement de Nav
const StyledNav = styled.nav<{ $horizontal?: boolean }>`
  display: flex;
  flex-direction: ${(props) => (props.$horizontal ? "row" : "column")};
  gap: ${(props) => (props.$horizontal ? "1.5rem" : "1rem")};
  justify-content: ${(props) => (props.$horizontal ? "center" : "flex-start")};
  align-items: center;
  width: 100%;
  font-size: 17px;
  padding: ${(props) => (props.$horizontal ? "0" : "1rem 1.5rem")};

  @media (max-width: 1120px) {
    font-size: ${(props) => (props.$horizontal ? "14px" : "16px")};
    gap: ${(props) => (props.$horizontal ? "1rem" : "0.75rem")};
  }

  @media (max-width: 480px) {
    font-size: ${(props) => (props.$horizontal ? "13px" : "15px")};
    gap: ${(props) => (props.$horizontal ? "0.75rem" : "0.5rem")};
  }
`;

type NavProps = React.HTMLAttributes<HTMLElement> & { horizontal?: boolean };
const Nav = ({ horizontal, ...rest }: NavProps) => (
  <StyledNav $horizontal={horizontal} {...rest} />
);

const HorizontalNavWrapper = styled.div`
  width: 100%;
  display: flex;
  justify-content: center;
  background: ${({ theme }) => theme.colors.background};
  padding: 0.5rem 0;

  @media (max-width: 1120px) {
    display: none;
  }
`;

// NavItem intermédiaire pour ne pas propager $active et pour compatibilité styled-components v4 + Next.js
const NavItemBase = styled.div<{ $active?: boolean }>`
  color: ${(props) =>
    props.$active
      ? '#1e293b'
      : '#64748b'};
  font-weight: ${(props) => (props.$active ? "700" : "500")};
  text-decoration: none;
  padding: 0.75rem 1.25rem;
  border-radius: 12px;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  white-space: nowrap;
  position: relative;
  background: ${(props) => props.$active ? 'linear-gradient(135deg, rgba(59, 130, 246, 0.1), rgba(139, 92, 246, 0.1))' : 'transparent'};
  border: ${(props) => props.$active ? '1px solid rgba(59, 130, 246, 0.2)' : '1px solid transparent'};
  
  &:hover {
    color: #1e293b;
    background: linear-gradient(135deg, rgba(59, 130, 246, 0.05), rgba(139, 92, 246, 0.05));
    border-color: rgba(59, 130, 246, 0.1);
    transform: translateX(4px);
  }
  
  @media (max-width: 1120px) {
    padding: 0.6rem 1rem;
  }
  @media (max-width: 480px) {
    padding: 0.5rem 0.8rem;
  }
`;

type NavItemProps = React.ComponentPropsWithoutRef<typeof Link> & { $active?: boolean };
const NavItem = ({ $active, children, ...rest }: NavItemProps) => (
  <Link {...rest}>
    <NavItemBase $active={$active}>{children}</NavItemBase>
  </Link>
);

const LayoutContainer = styled.div`
  display: flex;
  min-height: 100vh;
  background-color: ${({ theme }) => theme.colors.background};

  @media (max-width: 1120px) {
    display: block;
  }
`;

const MainContent = styled.main`
  flex: 1;
  overflow-y: auto;

  @media (max-width: 1120px) {
    width: 100%;
  }
`;

const TopBar = styled.header`
  display: flex;
  align-items: center;
  justify-content: space-between;
  background-color: ${({ theme }) => theme.colors.background};
  height: 100px;
  padding: 0 32px;
  border-bottom: 1px solid ${({ theme }) => theme.colors.border};

  @media (max-width: 1120px) {
    padding: 0 16px;
    height: 90px;
  }

  @media (max-width: 480px) {
    padding: 0 12px;
    height: 80px;
  }
`;

const MenuButton = styled.button`
  display: none;
  align-items: center;
  justify-content: center;
  width: 2.5rem;
  height: 2.5rem;
  border: none;
  background: none;
  cursor: pointer;
  color: ${({ theme }) => theme.colors.text.primary};
  border-radius: ${({ theme }) => theme.borderRadius.sm};
  transition: background-color 0.2s;

  &:hover {
    background-color: ${({ theme }) => theme.colors.surface};
  }

  @media (max-width: 1120px) {
    display: flex;
  }
`;

const UserMenu = styled.div`
  display: flex;
  align-items: center;
  gap: 16px;

  @media (max-width: 1120px) {
    gap: 12px;
  }

  @media (max-width: 480px) {
    gap: 8px;
  }
`;

const UserAvatar = styled.div`
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: ${({ theme }) => theme.colors.surface};
  border: 1px solid ${({ theme }) => theme.colors.border};
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.text.muted};

  @media (max-width: 1120px) {
    width: 36px;
    height: 36px;
    font-size: 14px;
  }

  @media (max-width: 480px) {
    width: 32px;
    height: 32px;
    font-size: 12px;
  }
`;

const LogoImg = styled.img`
  height: 80px;
  width: auto;
  max-width: 280px;
  object-fit: contain;
  margin-right: 32px;
  filter: ${({ theme }) => 
    theme.colors.background === '#1a1a1a' || theme.colors.background === '#000000' 
      ? 'brightness(0) invert(1)' 
      : 'none'
  };

  @media (max-width: 1120px) {
    height: 70px;
    margin-right: 16px;
    max-width: 220px;
  }

  @media (max-width: 480px) {
    height: 60px;
    margin-right: 12px;
    max-width: 180px;
  }
`;

// Composant Logo conditionnel
const AdaptiveLogo = () => {
  const [mounted, setMounted] = useState(false);
  const router = useRouter();
  
  useEffect(() => {
    setMounted(true);
  }, []);

  const handleLogoClick = () => {
    router.push('/');
  };

  // Ne rendre que côté client pour éviter l'hydratation
  if (!mounted) {
    return <div style={{ width: '280px', height: '80px' }} />;
  }

  return (
    <LogoImg 
      src="/LogoDarDarkom.png" 
      alt="DarDarkom" 
      onClick={handleLogoClick}
      style={{ cursor: 'pointer' }}
    />
  );
};

const LogoutButton = styled.button`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 1rem;
  border: none;
  background: none;
  color: ${({ theme }) => theme.colors.text.muted};
  cursor: pointer;
  transition: color 0.2s ease;
  border-radius: ${({ theme }) => theme.borderRadius.sm};

  &:hover {
    color: #dc2626;
    background-color: #fef2f2;
  }
`;

const NotificationButton = styled.button`
  background: none;
  border: none;
  color: ${({ theme }) => theme.colors.text.muted};
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 8px;
  margin-right: 12px;
  transition: color 0.2s ease;
  border-radius: ${({ theme }) => theme.borderRadius.sm};
  position: relative;

  &:hover {
    color: #3b82f6;
    background-color: #f0f8ff;
  }
`;

const MessageButton = styled.button`
  color: #64748b;
  font-weight: 500;
  text-decoration: none;
  padding: 0.75rem 1.25rem;
  border-radius: 12px;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  white-space: nowrap;
  background: none;
  border: none;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 12px;

  &:hover {
    color: #1e293b;
    background-color: #f1f5f9;
    transform: translateY(-1px);
  }

  &:active {
    transform: translateY(0);
  }

  @media (max-width: 1120px) {
    padding: 0.6rem 1rem;
    font-size: 0.9rem;
  }

  @media (max-width: 480px) {
    padding: 0.5rem 0.8rem;
  }
`;


const NotificationBadge = styled.div`
  position: absolute;
  top: -6px;
  right: -6px;
  background: linear-gradient(135deg, #ef4444, #dc2626);
  color: white;
  border-radius: 10px;
  min-width: 18px;
  height: 18px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.7rem;
  font-weight: 700;
  padding: 0 4px;
  box-shadow: 0 2px 8px rgba(239, 68, 68, 0.3);
  border: 2px solid white;
  animation: pulse 2s infinite;
  
  @keyframes pulse {
    0% {
      transform: scale(1);
    }
    50% {
      transform: scale(1.05);
    }
    100% {
      transform: scale(1);
    }
  }
`;

const NotificationDropdown = styled.div<{ $isOpen: boolean }>`
  position: absolute;
  top: 100%;
  right: 0;
  width: 360px;
  background: linear-gradient(135deg, #ffffff 0%, #f8fafc 100%);
  border: 1px solid rgba(226, 232, 240, 0.8);
  border-radius: 16px;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.15);
  z-index: 1000;
  margin-top: 8px;
  opacity: ${({ $isOpen }) => $isOpen ? '1' : '0'};
  visibility: ${({ $isOpen }) => $isOpen ? 'visible' : 'hidden'};
  transform: ${({ $isOpen }) => $isOpen ? 'translateY(0)' : 'translateY(-10px)'};
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  overflow: hidden;
  
  @media (max-width: 480px) {
    width: 320px;
    right: -20px;
  }
`;

const NotificationHeader = styled.div`
  padding: 20px 24px 16px 24px;
  border-bottom: 1px solid rgba(226, 232, 240, 0.5);
  background: linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%);
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const NotificationTitle = styled.h3`
  font-size: 1.1rem;
  font-weight: 700;
  color: #1e293b;
  margin: 0;
  display: flex;
  align-items: center;
  gap: 8px;
`;

// Styles pour le dropdown des messages
const MessageDropdown = styled.div<{ $isOpen: boolean }>`
  position: absolute;
  top: 100%;
  right: 0;
  width: 360px;
  background: linear-gradient(135deg, #ffffff 0%, #f8fafc 100%);
  border: 1px solid rgba(226, 232, 240, 0.8);
  border-radius: 16px;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.15);
  z-index: 1000;
  margin-top: 8px;
  opacity: ${({ $isOpen }) => $isOpen ? '1' : '0'};
  visibility: ${({ $isOpen }) => $isOpen ? 'visible' : 'hidden'};
  transform: ${({ $isOpen }) => $isOpen ? 'translateY(0)' : 'translateY(-10px)'};
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  overflow: hidden;
  
  @media (max-width: 480px) {
    width: 320px;
    right: -20px;
  }
`;

const MessageHeader = styled.div`
  padding: 20px 24px 16px 24px;
  border-bottom: 1px solid rgba(226, 232, 240, 0.5);
  background: linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%);
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const MessageTitle = styled.h3`
  font-size: 1.1rem;
  font-weight: 700;
  color: #1e293b;
  margin: 0;
  display: flex;
  align-items: center;
  gap: 8px;
`;

const MarkAllReadButton = styled.button`
  background: none;
  border: none;
  color: #64748b;
  font-size: 0.85rem;
  font-weight: 600;
  cursor: pointer;
  padding: 4px 8px;
  border-radius: 6px;
  transition: all 0.2s ease;
  
  &:hover {
    color: #3b82f6;
    background: rgba(59, 130, 246, 0.1);
  }
`;

const MessageList = styled.div`
  max-height: 400px;
  overflow-y: auto;
  padding: 8px 0;
  
  /* Style de la scrollbar */
  &::-webkit-scrollbar {
    width: 6px;
  }

  &::-webkit-scrollbar-track {
    background: transparent;
  }

  &::-webkit-scrollbar-thumb {
    background: rgba(148, 163, 184, 0.3);
    border-radius: 3px;
  }

  &::-webkit-scrollbar-thumb:hover {
    background: rgba(148, 163, 184, 0.5);
  }
`;

const MessageItem = styled.div<{ $unread?: boolean }>`
  padding: 12px 20px;
  border-bottom: 1px solid rgba(226, 232, 240, 0.3);
  cursor: pointer;
  transition: all 0.2s ease;
  background: ${({ $unread }) => $unread ? 'rgba(59, 130, 246, 0.05)' : 'transparent'};
  position: relative;
  
  &:hover {
    background: rgba(59, 130, 246, 0.1);
    transform: translateX(2px);
  }

  &:active {
    transform: translateX(0);
    background: rgba(59, 130, 246, 0.15);
  }
  
  &:last-child {
    border-bottom: none;
  }

  &::after {
    content: '→';
    position: absolute;
    right: 16px;
    top: 50%;
    transform: translateY(-50%);
    color: #94a3b8;
    font-size: 14px;
    opacity: 0;
    transition: all 0.2s ease;
  }

  &:hover::after {
    opacity: 1;
    color: #3b82f6;
  }
`;

const MessageContent = styled.div`
  display: flex;
  align-items: flex-start;
  gap: 12px;
`;

const MessageAvatar = styled.div`
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
  flex-shrink: 0;
`;

const MessageText = styled.div`
  flex: 1;
  min-width: 0;
`;

const MessageSender = styled.div`
  font-weight: 600;
  color: #1e293b;
  font-size: 0.9rem;
  margin-bottom: 4px;
`;

const MessagePreview = styled.div`
  color: #64748b;
  font-size: 0.85rem;
  line-height: 1.4;
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
`;

const MessageTime = styled.div`
  color: #94a3b8;
  font-size: 0.75rem;
  margin-top: 4px;
`;

const MessageBadge = styled.div`
  position: absolute;
  top: -6px;
  right: -6px;
  background: linear-gradient(135deg, #10b981, #059669);
  color: white;
  border-radius: 10px;
  min-width: 18px;
  height: 18px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.7rem;
  font-weight: 700;
  padding: 0 4px;
  box-shadow: 0 2px 8px rgba(16, 185, 129, 0.3);
  border: 2px solid white;
  animation: pulse 2s infinite;

  @keyframes pulse {
    0% {
      transform: scale(1);
    }
    50% {
      transform: scale(1.05);
    }
    100% {
      transform: scale(1);
    }
  }

  @keyframes spin {
    0% {
      transform: rotate(0deg);
    }
    100% {
      transform: rotate(360deg);
    }
  }
`;

const ClearAllButton = styled.button`
  background: none;
  border: none;
  color: #64748b;
  font-size: 0.85rem;
  font-weight: 600;
  cursor: pointer;
  padding: 4px 8px;
  border-radius: 6px;
  transition: all 0.2s ease;
  
  &:hover {
    color: #3b82f6;
    background: rgba(59, 130, 246, 0.1);
  }
`;

const NotificationList = styled.div`
  max-height: 400px;
  overflow-y: auto;
  padding: 8px 0;
`;

const NotificationItem = styled.div<{ $unread?: boolean }>`
  padding: 16px 24px;
  border-bottom: 1px solid rgba(226, 232, 240, 0.3);
  cursor: pointer;
  transition: all 0.2s ease;
  background: ${({ $unread }) => $unread ? 'linear-gradient(135deg, rgba(59, 130, 246, 0.05), rgba(139, 92, 246, 0.05))' : 'transparent'};
  position: relative;
  
  &:hover {
    background: linear-gradient(135deg, rgba(59, 130, 246, 0.1), rgba(139, 92, 246, 0.1));
  }
  
  &:last-child {
    border-bottom: none;
  }
  
  ${({ $unread }) => $unread && `
    &::before {
      content: '';
      position: absolute;
      left: 0;
      top: 0;
      bottom: 0;
      width: 4px;
      background: linear-gradient(135deg, #3b82f6, #8b5cf6);
    }
  `}
`;

const NotificationContent = styled.div`
  display: flex;
  align-items: flex-start;
  gap: 12px;
`;

const NotificationIcon = styled.div<{ $type: 'success' | 'warning' | 'info' }>`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  border-radius: 8px;
  background: ${({ $type }) => {
    switch ($type) {
      case 'success': return 'linear-gradient(135deg, #22c55e, #16a34a)';
      case 'warning': return 'linear-gradient(135deg, #f59e0b, #d97706)';
      case 'info': return 'linear-gradient(135deg, #3b82f6, #2563eb)';
      default: return 'linear-gradient(135deg, #6b7280, #4b5563)';
    }
  }};
  color: white;
  flex-shrink: 0;
`;

const NotificationText = styled.div`
  flex: 1;
  min-width: 0;
`;

const NotificationMessage = styled.p`
  font-size: 0.9rem;
  color: #1e293b;
  margin: 0 0 4px 0;
  font-weight: 500;
  line-height: 1.4;
`;

const NotificationTime = styled.span`
  font-size: 0.75rem;
  color: #64748b;
  font-weight: 400;
`;

const EmptyState = styled.div`
  padding: 40px 24px;
  text-align: center;
  color: #64748b;
`;

const EmptyIcon = styled.div`
  width: 48px;
  height: 48px;
  background: linear-gradient(135deg, #e2e8f0, #cbd5e1);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 16px auto;
  color: #94a3b8;
`;

const EmptyText = styled.p`
  font-size: 0.9rem;
  margin: 0;
  font-weight: 500;
`;

const WsIndicator = styled.div<{ $connected: boolean }>`
  position: absolute;
  top: -2px;
  right: -2px;
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: ${({ $connected }) => $connected ? '#22c55e' : '#ef4444'};
  border: 2px solid white;
  box-shadow: 0 0 0 1px ${({ $connected }) => $connected ? '#22c55e' : '#ef4444'};
  animation: ${({ $connected }) => $connected ? 'pulse' : 'none'} 2s infinite;
  
  @keyframes pulse {
    0% {
      box-shadow: 0 0 0 0 ${({ $connected }) => $connected ? 'rgba(34, 197, 94, 0.7)' : 'rgba(239, 68, 68, 0.7)'};
    }
    70% {
      box-shadow: 0 0 0 4px ${({ $connected }) => $connected ? 'rgba(34, 197, 94, 0)' : 'rgba(239, 68, 68, 0)'};
    }
    100% {
      box-shadow: 0 0 0 0 ${({ $connected }) => $connected ? 'rgba(34, 197, 94, 0)' : 'rgba(239, 68, 68, 0)'};
    }
  }
`;

const Overlay = styled.div<{ $isOpen: boolean }>`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  z-index: 40;
  opacity: ${(props) => (props.$isOpen ? 1 : 0)};
  visibility: ${(props) => (props.$isOpen ? "visible" : "hidden")};
  transition: all 0.3s ease;

  @media (min-width: 1121px) {
    display: none;
  }
`;

const HeaderControls = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
`;

const navigationItems = [
  { href: "/", label: "navigation.dashboard" },
  { href: "/products", label: "navigation.products" },
  { href: "/orders", label: "navigation.orders" },
  { href: "/users", label: "navigation.customers" },
  { href: "/analytics", label: "navigation.analytics" },
];

interface DashboardLayoutProps {
  children: React.ReactNode;
  hideSidebar?: boolean;
}

// Interface pour les messages
interface Message {
  id: string;
  sender: string;
  preview: string;
  time: string;
  unread: boolean;
  avatar: string;
}

export const DashboardLayout = ({ children, hideSidebar }: DashboardLayoutProps) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [notificationOpen, setNotificationOpen] = useState(false);
  const [messageOpen, setMessageOpen] = useState(false);
  const [wsConnected, setWsConnected] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [loadingMessages, setLoadingMessages] = useState(false);
  const pathname = usePathname();
  const router = useRouter();
  const { t } = useTranslation();
  const [mounted, setMounted] = useState(false);
  
  // WebSocket pour les notifications en temps réel
  const { connected, onNotification } = useWebSocket();
  const [websocketNotifications, setWebsocketNotifications] = useState<any[]>([]);
  
  useEffect(() => {
    setMounted(true);
  }, []);

  const { data: user, isLoading: isLoadingUser, error: userError } = useQuery({
    queryKey: ["user"],
    queryFn: () => authAPI.getMe().then((res) => res.data),
  });

  // Debug pour l'authentification
  console.log('🔐 Auth Debug:', {
    user,
    isLoadingUser,
    userError,
    token: typeof window !== 'undefined' ? localStorage.getItem('token') : 'N/A'
  });

  // Utiliser le hook de notifications
  const {
    notifications: persistentNotifications,
    unreadCount: persistentUnreadCount,
    isLoading: isLoadingNotifications,
    loadNotifications,
    markAsRead,
    markAllAsRead: clearAllNotifications,
  } = useNotifications({
    userId: user?.id,
    autoRefresh: true,
    refreshInterval: 30000, // 30 secondes
  });

  // Combiner les notifications persistantes et WebSocket
  const allNotifications = [...websocketNotifications, ...persistentNotifications];
  
  // Compter seulement les notifications WebSocket non lues
  const unreadWebsocketNotifications = websocketNotifications.filter(n => !n.isRead);
  const totalUnreadCount = unreadWebsocketNotifications.length + persistentUnreadCount;
  
  console.log('🔍 Debug Badge Count:', {
    websocketTotal: websocketNotifications.length,
    websocketUnread: unreadWebsocketNotifications.length,
    persistentUnread: persistentUnreadCount,
    totalUnread: totalUnreadCount
  });


  // Marquer une notification WebSocket comme lue
  const markWebsocketNotificationAsRead = (notificationId: string) => {
    setWebsocketNotifications(prev => 
      prev.map(n => 
        n._id === notificationId ? { ...n, isRead: true } : n
      )
    );
  };

  // Rafraîchir les notifications quand le dropdown s'ouvre
  const handleNotificationToggle = () => {
    setNotificationOpen(!notificationOpen);
    if (!notificationOpen && user?.id) {
      loadNotifications();
    }
  };

  // Gérer l'ouverture/fermeture du dropdown des messages
  const handleMessageToggle = () => {
    setMessageOpen(!messageOpen);
    if (!messageOpen) {
      fetchMessages();
    }
  };

  // Calculer le nombre de messages non lus
  const unreadMessageCount = messages.filter(message => message.unread).length;
  
  // Debug logs
  console.log('🔍 Debug Badge Messages:');
  console.log('📊 Messages total:', messages.length);
  console.log('📊 Messages non lus:', unreadMessageCount);
  console.log('👤 User ID:', user?.id);
  console.log('📋 Messages:', messages);

  // Marquer tous les messages comme lus
  const markAllMessagesAsRead = () => {
    setMessages(prevMessages => 
      prevMessages.map(message => ({ ...message, unread: false }))
    );
  };

  // Marquer un message comme lu et rediriger vers la page contact
  const markMessageAsRead = (messageId: string) => {
    setMessages(prevMessages =>
      prevMessages.map(message =>
        message.id === messageId ? { ...message, unread: false } : message
      )
    );
    
    // Fermer le dropdown
    setMessageOpen(false);
    
    // Rediriger vers la page contact
    router.push('/contact');
  };

  // Fonction pour récupérer les messages depuis l'API
  const fetchMessages = async () => {
    try {
      setLoadingMessages(true);
      const token = localStorage.getItem('token');
      if (!token) return;

      const response = await fetch('/api/messages/admin/all', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        const conversations = await response.json();
        
        // Convertir les conversations en messages pour l'affichage
        const allMessages: Message[] = [];
        conversations.forEach((conversation: { userName?: string; messages?: Array<{ _id: string; content: string; createdAt: string; isRead: boolean; isFromUser: boolean }> }) => {
          conversation.messages?.forEach((msg: { _id: string; content: string; createdAt: string; isRead: boolean; isFromUser: boolean }) => {
            const isUnread = !msg.isRead && msg.isFromUser;
            console.log('📝 Message debug:', {
              id: msg._id,
              content: msg.content.substring(0, 30),
              isRead: msg.isRead,
              isFromUser: msg.isFromUser,
              unread: isUnread
            });
            
            allMessages.push({
              id: msg._id,
              sender: conversation.userName || 'Utilisateur',
              preview: msg.content.substring(0, 50) + (msg.content.length > 50 ? '...' : ''),
              time: new Date(msg.createdAt).toLocaleTimeString('fr-FR', {
                hour: '2-digit',
                minute: '2-digit'
              }),
              unread: isUnread,
              avatar: (conversation.userName || 'U').charAt(0).toUpperCase()
            });
          });
        });

        // Trier par date (plus récent en premier)
        allMessages.sort((a, b) => new Date(b.time).getTime() - new Date(a.time).getTime());
        
        setMessages(allMessages);
        
        // Test temporaire - ajouter un message de test si aucun message
        if (allMessages.length === 0) {
          console.log('🧪 Ajout d\'un message de test pour le badge');
          setMessages([{
            id: 'test-1',
            sender: 'Test User',
            preview: 'Message de test pour le badge',
            time: new Date().toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' }),
            unread: true,
            avatar: 'T'
          }]);
        }
      }
    } catch (error) {
      console.error('Erreur lors de la récupération des messages:', error);
    } finally {
      setLoadingMessages(false);
    }
  };

  // Configuration WebSocket pour les messages
  useEffect(() => {
    if (!user?.id) return;

    // Connexion WebSocket pour les messages
    const connectMessageWebSocket = () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) return;

        // Utiliser le service WebSocket existant
        if (typeof window !== 'undefined' && (window as any).webSocketService) {
          const webSocketService = (window as any).webSocketService;
          
          // Écouter les nouveaux messages
          webSocketService.onNewMessage((data: { userId: string; message: { _id: string; content: string; createdAt: string; isFromUser: boolean } }) => {
            console.log('📨 Nouveau message reçu dans le dropdown:', data);
            // Rafraîchir les messages
            fetchMessages();
          });

          // Écouter les messages admin
          webSocketService.onAdminMessage((data: { userId: string; message: { _id: string; content: string; createdAt: string; isFromUser: boolean } }) => {
            console.log('📨 Nouveau message admin reçu dans le dropdown:', data);
            // Rafraîchir les messages
            fetchMessages();
          });
        }
      } catch (error) {
        console.error('Erreur WebSocket messages:', error);
      }
    };

    connectMessageWebSocket();
  }, [user?.id]);

  // Écouter les notifications WebSocket
  useEffect(() => {
    if (!connected) return;

    const removeListener = onNotification((notification) => {
      console.log('🔔 Notification WebSocket reçue dans DashboardLayout:', notification);
      console.log('🔍 Metadata de la notification:', notification.metadata);
      
      // Convertir la notification WebSocket en format compatible avec description améliorée
      const websocketNotification = {
        _id: `ws-${Date.now()}`,
        title: notification.title,
        message: notification.message,
        type: notification.type || 'order',
        isRead: false,
        createdAt: new Date().toISOString(),
        metadata: notification.metadata || {
          orderId: notification.orderId,
          amount: notification.amount,
          customerName: notification.customerName
        },
        // Description améliorée basée sur le type de notification
        description: getNotificationDescription(notification)
      };
      
      setWebsocketNotifications(prev => [websocketNotification, ...prev]);
    });

    return removeListener;
  }, [connected, onNotification]);

  // Fonction pour générer une description améliorée
  const getNotificationDescription = (notification: any) => {
    // Extraire les données du metadata ou directement de la notification
    const orderId = notification.metadata?.orderId || notification.orderId;
    const amount = notification.metadata?.amount || notification.amount;
    const customerName = notification.metadata?.customerName || notification.customerName;
    
    switch (notification.type) {
      case 'new_order':
        return `Nouvelle commande #${orderId?.slice(-8) || 'N/A'} d'un montant de ${amount || 'N/A'}€ de ${customerName || 'un client'}`;
      case 'order_accepted':
        return `Commande #${orderId?.slice(-8) || 'N/A'} acceptée et en préparation`;
      case 'order_rejected':
        return `Commande #${orderId?.slice(-8) || 'N/A'} rejetée`;
      case 'payment':
        return `Paiement reçu pour la commande #${orderId?.slice(-8) || 'N/A'}`;
      default:
        return notification.message || 'Notification reçue';
    }
  };

  // Surveiller l'état de connexion WebSocket
  useEffect(() => {
    if (!user?.id) return;

    const unsubscribeConnection = notificationWebSocket.onConnectionChange((connected) => {
      setWsConnected(connected);
    });

    return () => {
      unsubscribeConnection();
    };
  }, [user?.id]);

  // Fonction pour formater le temps relatif
  const formatTimeAgo = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    
    if (diff < 60000) { // Moins d'1 minute
      return 'À l\'instant';
    } else if (diff < 3600000) { // Moins d'1 heure
      const minutes = Math.floor(diff / 60000);
      return `Il y a ${minutes} min`;
    } else if (diff < 86400000) { // Moins d'1 jour
      const hours = Math.floor(diff / 3600000);
      return `Il y a ${hours}h`;
    } else {
      const days = Math.floor(diff / 86400000);
      return `Il y a ${days} jour${days > 1 ? 's' : ''}`;
    }
  };

  // Fonction pour mapper les types de notifications
  const mapNotificationType = (type: string): 'success' | 'warning' | 'info' => {
    switch (type) {
      case 'order':
      case 'payment':
        return 'success';
      case 'stock':
        return 'warning';
      case 'system':
      case 'activity':
      default:
        return 'info';
    }
  };

  // Effet pour fermer le dropdown des notifications quand on clique à l'extérieur
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      if (notificationOpen && !target.closest('[data-notification-dropdown]')) {
        setNotificationOpen(false);
      }
    };

    if (notificationOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [notificationOpen]);

  // Debug: afficher les données utilisateur (commented out for tests)
  // useEffect(() => {
  //   console.log('User data in DashboardLayout:', user);
  //   console.log('User ID:', user?.user?._id);
  // }, [user]);

  const handleLogout = async () => {
    try {
      // Appeler l'API backend pour le logout
      await authAPI.logout();
      
      // Supprimer le token localement
      removeToken();
      
      // Rediriger vers la page de login
      router.push("/login");
    } catch {
      // Même en cas d'erreur, on supprime le token localement
      removeToken();
      router.push("/login");
    }
  };

  return (
    <LayoutContainer>
      {!hideSidebar && (
        <>
          <Sidebar $isOpen={sidebarOpen}>
            <SidebarHeader>
              <Logo>
                <AdaptiveLogo />
                DAR DARKOM
              </Logo>
            </SidebarHeader>
            <Nav>
              {navigationItems.map((item) => (
                <NavItem
                  key={item.href}
                  href={item.href}
                  $active={pathname === item.href}
                >
                  {mounted
                    ? item.label === "navigation.marketing"
                      ? "Marketing"
                      : t(item.label)
                    : item.label}
                </NavItem>
              ))}
            </Nav>
          </Sidebar>
          <Overlay $isOpen={sidebarOpen} onClick={() => setSidebarOpen(false)} />
        </>
      )}
      <MainContent>
        <TopBar>
          <div style={{ display: "flex", alignItems: "center" }}>
            {!hideSidebar && (
              <MenuButton onClick={() => setSidebarOpen(!sidebarOpen)}>
                <Menu size={24} />
              </MenuButton>
            )}
            <Logo>
              <AdaptiveLogo />
            </Logo>
            <LanguageSelector />
          </div>

          {mounted && (
            <HorizontalNavWrapper>
              <Nav horizontal>
                {navigationItems.map((item) => (
                  <NavItem
                    key={item.href}
                    href={item.href}
                    $active={pathname === item.href}
                  >
                    {item.label === "navigation.marketing"
                      ? "Marketing"
                      : t(item.label)}
                  </NavItem>
                ))}
              </Nav>
            </HorizontalNavWrapper>
          )}

                      <UserMenu>
              <HeaderControls>
                <div style={{ position: 'relative' }} data-message-dropdown>
                  <MessageButton onClick={handleMessageToggle}>
                    <Mail size={20} />
                    {unreadMessageCount > 0 && (
                      <MessageBadge>
                        {unreadMessageCount > 99 ? '99+' : unreadMessageCount}
                      </MessageBadge>
                    )}
                  </MessageButton>
                  
                  <MessageDropdown $isOpen={messageOpen}>
                    <MessageHeader>
                      <MessageTitle>
                        <Mail size={16} />
                        Messages {unreadMessageCount > 0 && `(${unreadMessageCount})`}
                      </MessageTitle>
                      {unreadMessageCount > 0 && (
                        <MarkAllReadButton onClick={markAllMessagesAsRead}>
                          Tout marquer comme lu
                        </MarkAllReadButton>
                      )}
                    </MessageHeader>
                    
                    <MessageList>
                      {loadingMessages ? (
                        <div style={{ 
                          padding: '40px 24px', 
                          textAlign: 'center', 
                          color: '#64748b' 
                        }}>
                          <div style={{ 
                            width: '24px', 
                            height: '24px', 
                            border: '2px solid #e2e8f0',
                            borderTop: '2px solid #3b82f6',
                            borderRadius: '50%',
                            animation: 'spin 1s linear infinite',
                            margin: '0 auto 16px'
                          }} />
                          <p>Chargement des messages...</p>
                        </div>
                      ) : messages.length > 0 ? (
                        messages.map((message) => (
                          <MessageItem 
                            key={message.id} 
                            $unread={message.unread}
                            onClick={() => markMessageAsRead(message.id)}
                          >
                            <MessageContent>
                              <MessageAvatar>{message.avatar}</MessageAvatar>
                              <MessageText>
                                <MessageSender>{message.sender}</MessageSender>
                                <MessagePreview>{message.preview}</MessagePreview>
                                <MessageTime>{message.time}</MessageTime>
                              </MessageText>
                            </MessageContent>
                          </MessageItem>
                        ))
                      ) : (
                        <div style={{ 
                          padding: '40px 24px', 
                          textAlign: 'center', 
                          color: '#64748b' 
                        }}>
                          <Mail size={48} style={{ marginBottom: '16px', opacity: 0.5 }} />
                          <p>Aucun message</p>
                        </div>
                      )}
                    </MessageList>
                  </MessageDropdown>
                </div>
                <div style={{ position: 'relative' }} data-notification-dropdown>
                  <NotificationButton onClick={handleNotificationToggle}>
                    <Bell size={20} />
                    {console.log('🔍 Badge Debug:', { 
                      userId: user?.id, 
                      totalUnreadCount, 
                      websocketNotifications: websocketNotifications.length,
                      persistentUnreadCount 
                    })}
                    {/* Badge - afficher seulement pour les vraies notifications */}
                    {websocketNotifications.length > 0 && (
                      <NotificationBadge>
                        {websocketNotifications.length > 99 ? '99+' : websocketNotifications.length}
                      </NotificationBadge>
                    )}
                  </NotificationButton>
                  
                  <NotificationDropdown $isOpen={notificationOpen}>
                    <NotificationHeader>
                      <NotificationTitle>
                        <Bell size={16} />
                        Notifications
                      </NotificationTitle>
                      {allNotifications.length > 0 && (
                        <ClearAllButton onClick={clearAllNotifications}>
                          Tout effacer
                        </ClearAllButton>
                      )}
                    </NotificationHeader>
                    
                    <NotificationList>
                      {isLoadingNotifications ? (
                        <EmptyState>
                          <EmptyIcon>
                            <Bell size={24} />
                          </EmptyIcon>
                          <EmptyText>
                            Chargement des notifications...
                          </EmptyText>
                        </EmptyState>
                      ) : allNotifications.length > 0 ? (
                        allNotifications.map((notification) => (
                          <NotificationItem
                            key={notification._id}
                            $unread={!notification.isRead}
                            onClick={() => {
                              // Marquer comme lue selon le type de notification
                              if (notification._id.startsWith('ws-')) {
                                markWebsocketNotificationAsRead(notification._id);
                              } else {
                                markAsRead(notification._id);
                              }
                              
                              // Naviguer vers les détails de la commande si c'est une notification de commande
                              if (notification.metadata?.orderId) {
                                router.push(`/orders/${notification.metadata.orderId}`);
                              }
                            }}
                          >
                            <NotificationContent>
                              <NotificationIcon $type={mapNotificationType(notification.type)}>
                                {mapNotificationType(notification.type) === 'success' && <CheckCircle size={16} />}
                                {mapNotificationType(notification.type) === 'warning' && <AlertCircle size={16} />}
                                {mapNotificationType(notification.type) === 'info' && <Info size={16} />}
                              </NotificationIcon>
                              <NotificationText>
                                <NotificationMessage>
                                  {notification.title}
                                </NotificationMessage>
                                <NotificationTime>
                                  {formatTimeAgo(notification.createdAt)}
                                </NotificationTime>
                                {/* Description améliorée */}
                                {notification.description && (
                                  <div style={{ 
                                    fontSize: '0.8rem', 
                                    color: '#64748b', 
                                    marginTop: '4px',
                                    lineHeight: '1.3'
                                  }}>
                                    {notification.description}
                                  </div>
                                )}
                              </NotificationText>
                            </NotificationContent>
                          </NotificationItem>
                        ))
                      ) : (
                        <EmptyState>
                          <EmptyIcon>
                            <Bell size={24} />
                          </EmptyIcon>
                          <EmptyText>
                            Aucune notification pour le moment
                          </EmptyText>
                        </EmptyState>
                      )}
                    </NotificationList>
                  </NotificationDropdown>
                </div>
                <ThemeToggle />
                {/* Debug: {console.log('User data:', user)} */}
              </HeaderControls>

            <UserAvatar>
              {user?.profileImage ? (
                <Image
                  src={user.profileImage.replace("10.0.2.2", "localhost")}
                  alt={user.name}
                  style={{
                    width: "100%",
                    height: "100%",
                    objectFit: "cover",
                    borderRadius: "50%",
                  }}
                  onError={(e: React.SyntheticEvent<HTMLImageElement>) => {
                    const target = e.currentTarget;
                    target.style.display = "none";
                    const fallback = target.parentElement?.querySelector(
                      ".header-avatar-fallback"
                    );
                    if (fallback) {
                      (fallback as HTMLElement).style.display = "flex";
                    }
                  }}
                />
              ) : null}
              <div
                className="header-avatar-fallback"
                style={{
                  display: user?.profileImage ? "none" : "flex",
                  width: "100%",
                  height: "100%",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: "1.1rem",
                  fontWeight: "bold",
                }}
              >
                {user?.name?.charAt(0) || "A"}
              </div>
            </UserAvatar>
            <LogoutButton onClick={handleLogout}>
              <LogOut size={16} />
            </LogoutButton>
          </UserMenu>
        </TopBar>
        {children}
      </MainContent>
    </LayoutContainer>
  );
};
