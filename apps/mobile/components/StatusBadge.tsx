import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

interface StatusBadgeProps {
  status: string;
  size?: 'small' | 'medium' | 'large';
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({ 
  status, 
  size = 'medium' 
}) => {
  const getStatusInfo = (status: string) => {
    switch (status) {
      case 'active':
        return { 
          color: '#4CAF50', 
          text: 'En cours', 
          bgColor: '#E8F5E8',
          icon: '🔄'
        };
      case 'completed':
        return { 
          color: '#2196F3', 
          text: 'Terminée', 
          bgColor: '#E3F2FD',
          icon: '✅'
        };
      case 'cancelled':
        return { 
          color: '#F44336', 
          text: 'Annulée', 
          bgColor: '#FFEBEE',
          icon: '❌'
        };
      case 'pending':
        return { 
          color: '#FF9800', 
          text: 'En attente', 
          bgColor: '#FFF3E0',
          icon: '⏳'
        };
      case 'shipped':
        return { 
          color: '#9C27B0', 
          text: 'Expédiée', 
          bgColor: '#F3E5F5',
          icon: '📦'
        };
      case 'delivered':
        return { 
          color: '#4CAF50', 
          text: 'Livrée', 
          bgColor: '#E8F5E8',
          icon: '🏠'
        };
      default:
        return { 
          color: '#9E9E9E', 
          text: 'Inconnu', 
          bgColor: '#F5F5F5',
          icon: '❓'
        };
    }
  };

  const statusInfo = getStatusInfo(status);
  const sizeStyles = getSizeStyles(size);

  return (
    <View style={[styles.badge, sizeStyles.badge, { backgroundColor: statusInfo.bgColor }]}>
      <Text style={[styles.icon, sizeStyles.icon]}>{statusInfo.icon}</Text>
      <Text style={[styles.text, sizeStyles.text, { color: statusInfo.color }]}>
        {statusInfo.text}
      </Text>
    </View>
  );
};

const getSizeStyles = (size: 'small' | 'medium' | 'large') => {
  switch (size) {
    case 'small':
      return {
        badge: { paddingHorizontal: 6, paddingVertical: 2 },
        icon: { fontSize: 10 },
        text: { fontSize: 10 }
      };
    case 'large':
      return {
        badge: { paddingHorizontal: 12, paddingVertical: 6 },
        icon: { fontSize: 16 },
        text: { fontSize: 14 }
      };
    default: // medium
      return {
        badge: { paddingHorizontal: 8, paddingVertical: 4 },
        icon: { fontSize: 12 },
        text: { fontSize: 11 }
      };
  }
};

const styles = StyleSheet.create({
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 16,
    alignSelf: 'flex-start',
  },
  icon: {
    marginRight: 4,
  },
  text: {
    fontWeight: '600',
    textTransform: 'uppercase',
  },
});
