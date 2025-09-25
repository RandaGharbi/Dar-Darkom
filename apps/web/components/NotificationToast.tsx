'use client';

import React, { useState, useEffect } from 'react';
import { Bell, Package, X } from 'lucide-react';

interface Notification {
  id?: string;
  title: string;
  message: string;
  type: string;
  orderId?: string;
  amount?: number;
  customerName?: string;
}

interface NotificationToastProps {
  notification: Notification;
  onClose: () => void;
}

export default function NotificationToast({ notification, onClose }: NotificationToastProps) {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    console.log('🎨 NotificationToast rendu avec:', notification);
    setIsVisible(true);
    
    // Auto-close after 5 seconds
    const timer = setTimeout(() => {
      setIsVisible(false);
      setTimeout(onClose, 300); // Wait for animation
    }, 5000);

    return () => clearTimeout(timer);
  }, [onClose, notification]);

  const handleClose = () => {
    setIsVisible(false);
    setTimeout(onClose, 300);
  };

  return (
    <div
      className={`fixed top-4 right-4 z-[9999] max-w-sm w-full bg-white border-2 border-red-500 rounded-lg shadow-lg transform transition-all duration-300 ${
        isVisible ? 'translate-x-0 opacity-100' : 'translate-x-full opacity-0'
      }`}
      style={{
        position: 'fixed',
        top: '16px',
        right: '16px',
        zIndex: 9999,
        backgroundColor: 'white',
        border: '2px solid red',
        borderRadius: '8px',
        padding: '16px',
        boxShadow: '0 10px 25px rgba(0,0,0,0.1)',
        transform: isVisible ? 'translateX(0)' : 'translateX(100%)',
        opacity: isVisible ? 1 : 0,
        transition: 'all 0.3s ease'
      }}
    >
      <div className="p-4">
        <div className="flex items-start justify-between">
          <div className="flex items-start space-x-3">
            <div className="flex-shrink-0">
              <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                <Package className="w-4 h-4 text-blue-600" />
              </div>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-900">
                {notification.title}
              </p>
              <p className="text-sm text-gray-500 mt-1">
                {notification.message}
              </p>
              {notification.orderId && (
                <div className="mt-2 text-xs text-gray-400">
                  Commande #{notification.orderId.slice(-8)}
                  {notification.amount && ` • ${notification.amount.toFixed(2)}€`}
                </div>
              )}
            </div>
          </div>
          <button
            onClick={handleClose}
            className="flex-shrink-0 ml-2 text-gray-400 hover:text-gray-600"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}

// Hook pour gérer les notifications
export const useNotificationToast = () => {
  const [notifications, setNotifications] = useState<Notification[]>([]);

  const addNotification = (notification: Notification) => {
    const id = notification.id || Date.now().toString();
    console.log('🔔 Ajout de notification:', { id, ...notification });
    setNotifications(prev => [...prev, { ...notification, id }]);
  };

  const removeNotification = (id: string) => {
    console.log('🗑️ Suppression de notification:', id);
    setNotifications(prev => prev.filter(n => n.id !== id));
  };

  return {
    notifications,
    addNotification,
    removeNotification,
  };
};