"use client";

import React, { useEffect, useRef, useState } from 'react';
import styled from "styled-components";
import { Bell } from "lucide-react";

const NotificationButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 2.5rem;
  height: 2.5rem;
  border: none;
  background: #f5f5f5;
  cursor: pointer;
  border-radius: 8px;
  transition: background-color 0.2s;
  color: #666;
  position: relative;

  &:hover {
    background-color: #e0e0e0;
  }
`;

const NotificationDropdownContainer = styled.div<{ $isOpen: boolean }>`
  position: absolute;
  top: 100%;
  right: 0;
  width: 320px;
  background: white;
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  z-index: 1000;
  opacity: ${(props) => (props.$isOpen ? 1 : 0)};
  visibility: ${(props) => (props.$isOpen ? "visible" : "hidden")};
  transform: ${(props) => (props.$isOpen ? "translateY(0)" : "translateY(-10px)")};
  transition: all 0.2s ease;
  margin-top: 8px;
`;

const NotificationHeader = styled.div`
  padding: 1rem;
  border-bottom: 1px solid #e0e0e0;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const NotificationTitle = styled.h3`
  margin: 0;
  font-size: 1rem;
  font-weight: 600;
  color: #1a1a1a;
`;

const MarkAllReadButton = styled.button`
  background: none;
  border: none;
  color: #666;
  font-size: 0.875rem;
  cursor: pointer;
  padding: 0.25rem 0.5rem;
  border-radius: 4px;
  transition: background-color 0.2s;

  &:hover {
    background-color: #f5f5f5;
  }
`;

const NotificationList = styled.div`
  max-height: 300px;
  overflow-y: auto;
`;

const NotificationItem = styled.div`
  padding: 1rem;
  border-bottom: 1px solid #f0f0f0;
  cursor: pointer;
  transition: background-color 0.2s;

  &:hover {
    background-color: #f9f9f9;
  }

  &:last-child {
    border-bottom: none;
  }
`;

const NotificationText = styled.p`
  margin: 0 0 0.5rem 0;
  font-size: 0.875rem;
  color: #1a1a1a;
  line-height: 1.4;
`;

const NotificationTime = styled.span`
  font-size: 0.75rem;
  color: #666;
`;

const EmptyNotifications = styled.div`
  padding: 2rem 1rem;
  text-align: center;
  color: #666;
  font-size: 0.875rem;
`;

interface Notification {
  id: string;
  text: string;
  time: string;
}

interface NotificationDropdownProps {
  notifications?: Notification[];
}

export function NotificationDropdown({ 
  notifications 
}: NotificationDropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Notifications par défaut si aucune n'est fournie
  const defaultNotifications: Notification[] = [
    {
      id: "1",
      text: "Nouvelle commande reçue #12345",
      time: "Il y a 5 minutes"
    },
    {
      id: "2", 
      text: "Stock faible pour le produit \"Crème Hydratante\"",
      time: "Il y a 1 heure"
    },
    {
      id: "3",
      text: "Nouveau client inscrit",
      time: "Il y a 2 heures"
    }
  ];

  // Si notifications n'est pas défini, utiliser les notifications par défaut
  // Si notifications est défini (même comme tableau vide), l'utiliser
  const displayNotifications = notifications !== undefined ? notifications : defaultNotifications;

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  const closeDropdown = () => {
    setIsOpen(false);
  };

  // Fermer le dropdown quand on clique en dehors
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  return (
    <div ref={dropdownRef} style={{ position: 'relative' }}>
      <NotificationButton 
        onClick={toggleDropdown}
        aria-label="Notifications"
        aria-expanded={isOpen}
      >
        <Bell size={20} />
      </NotificationButton>
      <NotificationDropdownContainer $isOpen={isOpen}>
        <NotificationHeader>
          <NotificationTitle>Notifications</NotificationTitle>
          <MarkAllReadButton onClick={closeDropdown}>
            Marquer comme lu
          </MarkAllReadButton>
        </NotificationHeader>
        <NotificationList>
          {displayNotifications.length > 0 ? (
            displayNotifications.map((notification) => (
              <NotificationItem key={notification.id}>
                <NotificationText>{notification.text}</NotificationText>
                <NotificationTime>{notification.time}</NotificationTime>
              </NotificationItem>
            ))
          ) : (
            <EmptyNotifications>
              Aucune notification
            </EmptyNotifications>
          )}
        </NotificationList>
      </NotificationDropdownContainer>
    </div>
  );
} 