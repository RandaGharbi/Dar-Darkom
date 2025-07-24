'use client';

import React, { useEffect, useState, useCallback } from 'react';
import { createPortal } from 'react-dom';

interface NotificationToastProps {
  message: string;
  type?: 'success' | 'error' | 'info' | 'warning';
  duration?: number;
  onHide?: () => void;
}

export const NotificationToast: React.FC<NotificationToastProps> = ({
  message,
  type = 'info',
  duration = 3000,
  onHide,
}) => {
  const [isVisible, setIsVisible] = useState(true);
  const [isMounted, setIsMounted] = useState(false);

  const hideToast = useCallback(() => {
    setIsVisible(false);
    setTimeout(() => {
      onHide?.();
    }, 300); // Délai pour l'animation de sortie
  }, [onHide]);

  useEffect(() => {
    setIsMounted(true);
    // Auto-hide après la durée spécifiée
    const timer = setTimeout(() => {
      hideToast();
    }, duration);
    return () => clearTimeout(timer);
  }, [duration, hideToast]);

  const getBackgroundColor = () => {
    switch (type) {
      case 'success':
        return 'bg-green-500';
      case 'error':
        return 'bg-red-500';
      case 'warning':
        return 'bg-yellow-500';
      default:
        return 'bg-blue-500';
    }
  };

  const getIcon = () => {
    switch (type) {
      case 'success':
        return '✅';
      case 'error':
        return '❌';
      case 'warning':
        return '⚠️';
      default:
        return 'ℹ️';
    }
  };

  if (!isMounted) return null;

  const toastElement = (
    <div
      className={`fixed top-4 right-4 z-50 transform transition-all duration-300 ${
        isVisible ? 'translate-x-0 opacity-100' : 'translate-x-full opacity-0'
      }`}
    >
      <div className={`${getBackgroundColor()} text-white px-6 py-4 rounded-lg shadow-lg max-w-sm`}>
        <div className="flex items-center space-x-3">
          <span className="text-xl">{getIcon()}</span>
          <p className="text-sm font-medium">{message}</p>
          <button
            onClick={hideToast}
            className="ml-auto text-white hover:text-gray-200 transition-colors"
          >
            ✕
          </button>
        </div>
      </div>
    </div>
  );

  // Utiliser createPortal pour rendre le toast en dehors du DOM normal
  return createPortal(toastElement, document.body);
}; 