import React from 'react';
import styled from 'styled-components';

// Modal styles
const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
`;

const ModalContent = styled.div`
  background: white;
  border-radius: 12px;
  padding: 2rem;
  max-width: 400px;
  width: 90%;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.2);
  text-align: center;
`;

const ModalTitle = styled.h3`
  margin: 0 0 1rem 0;
  font-size: 1.3rem;
  font-weight: 600;
  color: var(--color-black);
`;

const ModalMessage = styled.p`
  margin: 0 0 1.5rem 0;
  color: #666;
  line-height: 1.5;
`;

const ModalButtons = styled.div`
  display: flex;
  gap: 1rem;
  justify-content: center;
`;

const ModalButton = styled.button<{ variant?: 'primary' | 'secondary' | 'danger' | 'success' }>`
  padding: 0.7rem 1.5rem;
  border-radius: 8px;
  font-weight: 500;
  cursor: pointer;
  border: none;
  transition: all 0.2s;
  
  ${props => {
    if (props.variant === 'danger') {
      return `
        background: #dc3545;
        color: white;
        &:hover {
          background: #c82333;
        }
      `;
    }
    if (props.variant === 'success') {
      return `
        background: #28a745;
        color: white;
        &:hover {
          background: #218838;
        }
      `;
    }
    if (props.variant === 'secondary') {
      return `
        background: #f8f9fa;
        color: #6c757d;
        border: 1px solid #dee2e6;
        &:hover {
          background: #e9ecef;
        }
      `;
    }
    return `
      background: var(--color-taupe);
      color: white;
      &:hover {
        background: #8b7355;
      }
    `;
  }}
`;

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  message: string;
  type?: 'success' | 'error' | 'warning' | 'info';
  onConfirm?: () => void;
  confirmText?: string;
  cancelText?: string;
  showCancel?: boolean;
}

const Modal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  title,
  message,
  type = 'info',
  onConfirm,
  confirmText = 'OK',
  cancelText = 'Annuler',
  showCancel = false
}) => {
  if (!isOpen) return null;

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

  const getVariant = () => {
    switch (type) {
      case 'success':
        return 'success';
      case 'error':
        return 'danger';
      default:
        return 'primary';
    }
  };

  const handleConfirm = () => {
    if (onConfirm) {
      onConfirm();
    }
    onClose();
  };

  return (
    <ModalOverlay onClick={onClose}>
      <ModalContent onClick={(e) => e.stopPropagation()}>
        <ModalTitle>{getIcon()} {title}</ModalTitle>
        <ModalMessage>{message}</ModalMessage>
        <ModalButtons>
          {showCancel && (
            <ModalButton variant="secondary" onClick={onClose}>
              {cancelText}
            </ModalButton>
          )}
          <ModalButton variant={getVariant()} onClick={handleConfirm}>
            {confirmText}
          </ModalButton>
        </ModalButtons>
      </ModalContent>
    </ModalOverlay>
  );
};

export default Modal; 