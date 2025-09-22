import styled from 'styled-components';

interface BadgeProps {
  variant?: 'default' | 'success' | 'warning' | 'error' | 'info';
  size?: 'sm' | 'md' | 'lg';
}

export const Badge = styled.span<BadgeProps>`
  display: inline-flex;
  align-items: center;
  padding: ${props => {
    switch (props.size) {
      case 'sm':
        return '4px 8px';
      case 'lg':
        return '8px 16px';
      default:
        return '6px 12px';
    }
  }};
  border-radius: ${props => {
    switch (props.size) {
      case 'sm':
        return '6px';
      case 'lg':
        return '12px';
      default:
        return '8px';
    }
  }};
  font-size: ${props => {
    switch (props.size) {
      case 'sm':
        return '12px';
      case 'lg':
        return '16px';
      default:
        return '14px';
    }
  }};
  font-weight: 500;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', sans-serif;
  
  background: ${props => {
    switch (props.variant) {
      case 'success':
        return '#d1fae5';
      case 'warning':
        return '#fef3c7';
      case 'error':
        return '#fee2e2';
      case 'info':
        return '#dbeafe';
      default:
        return '#f0f8ff';
    }
  }};
  
  color: ${props => {
    switch (props.variant) {
      case 'success':
        return '#065f46';
      case 'warning':
        return '#92400e';
      case 'error':
        return '#991b1b';
      case 'info':
        return '#1e40af';
      default:
        return '#2E86AB';
    }
  }};
`;



