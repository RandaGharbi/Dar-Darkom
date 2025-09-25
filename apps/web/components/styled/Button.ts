import styled from 'styled-components';

interface ButtonProps {
  variant?: 'primary' | 'secondary' | 'danger' | 'outline';
  size?: 'sm' | 'md' | 'lg';
  fullWidth?: boolean;
}

export const Button = styled.button<ButtonProps>`
  background: ${props => {
    switch (props.variant) {
      case 'secondary':
        return '#f8f9fa';
      case 'danger':
        return '#ef4444';
      case 'outline':
        return 'transparent';
      default:
        return '#2E86AB';
    }
  }};
  
  color: ${props => {
    switch (props.variant) {
      case 'outline':
        return '#2E86AB';
      default:
        return '#ffffff';
    }
  }};
  
  border: ${props => {
    switch (props.variant) {
      case 'outline':
        return '1px solid #2E86AB';
      default:
        return 'none';
    }
  }};
  
  font-weight: 600;
  border-radius: 12px;
  font-size: ${props => {
    switch (props.size) {
      case 'sm':
        return '14px';
      case 'lg':
        return '18px';
      default:
        return '16px';
    }
  }};
  
  padding: ${props => {
    switch (props.size) {
      case 'sm':
        return '12px 16px';
      case 'lg':
        return '20px 24px';
      default:
        return '16px 20px';
    }
  }};
  
  width: ${props => props.fullWidth ? '100%' : 'auto'};
  cursor: pointer;
  transition: all 0.2s ease;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', sans-serif;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;

  &:hover:not(:disabled) {
    background: ${props => {
      switch (props.variant) {
        case 'secondary':
          return '#e9ecef';
        case 'danger':
          return '#dc2626';
        case 'outline':
          return '#2E86AB';
        default:
          return '#256a8a';
      }
    }};
    
    color: ${props => {
      switch (props.variant) {
        case 'outline':
          return '#ffffff';
        default:
          return props.variant === 'secondary' ? '#333' : '#ffffff';
      }
    }};
    
    transform: translateY(-1px);
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.15);
  }
  
  &:active:not(:disabled) {
    transform: translateY(0);
  }
  
  &:disabled {
    opacity: 0.7;
    cursor: not-allowed;
    transform: none;
  }
`;

export const IconButton = styled.button`
  background: transparent;
  border: none;
  border-radius: 8px;
  padding: 8px;
  cursor: pointer;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #666;

  &:hover:not(:disabled) {
    background: #f8f9fa;
    color: #2E86AB;
  }
  
  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;





