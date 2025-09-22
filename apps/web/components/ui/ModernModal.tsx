"use client";

import React from 'react';
import styled from 'styled-components';
import { X } from 'lucide-react';

interface ModernModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  size?: 'sm' | 'md' | 'lg' | 'xl';
}

const Overlay = styled.div<{ $isOpen: boolean }>`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.6);
  backdrop-filter: blur(8px);
  display: ${({ $isOpen }) => ($isOpen ? 'flex' : 'none')};
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: 20px;
  animation: ${({ $isOpen }) => ($isOpen ? 'fadeIn' : 'fadeOut')} 0.3s ease-out;
  
  @keyframes fadeIn {
    from {
      opacity: 0;
    }
    to {
      opacity: 1;
    }
  }
  
  @keyframes fadeOut {
    from {
      opacity: 1;
    }
    to {
      opacity: 0;
    }
  }
`;

const ModalContainer = styled.div<{ $size: string }>`
  background: linear-gradient(135deg, #ffffff 0%, #f8fafc 100%);
  border-radius: 24px;
  box-shadow: 
    0 25px 50px -12px rgba(0, 0, 0, 0.25),
    0 0 0 1px rgba(255, 255, 255, 0.1);
  position: relative;
  max-height: 90vh;
  overflow: hidden;
  animation: ${({ $isOpen }) => ($isOpen ? 'slideIn' : 'slideOut')} 0.3s ease-out;
  
  width: ${({ $size }) => {
    switch ($size) {
      case 'sm': return '400px';
      case 'md': return '500px';
      case 'lg': return '600px';
      case 'xl': return '800px';
      default: return '500px';
    }
  }};
  
  @keyframes slideIn {
    from {
      opacity: 0;
      transform: scale(0.95) translateY(-20px);
    }
    to {
      opacity: 1;
      transform: scale(1) translateY(0);
    }
  }
  
  @keyframes slideOut {
    from {
      opacity: 1;
      transform: scale(1) translateY(0);
    }
    to {
      opacity: 0;
      transform: scale(0.95) translateY(-20px);
    }
  }
  
  @media (max-width: 768px) {
    width: 100%;
    margin: 0 16px;
    border-radius: 20px;
  }
`;

const Header = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 24px 32px 16px 32px;
  border-bottom: 1px solid rgba(226, 232, 240, 0.8);
  background: linear-gradient(135deg, rgba(59, 130, 246, 0.05), rgba(139, 92, 246, 0.05));
  
  @media (max-width: 768px) {
    padding: 20px 24px 12px 24px;
  }
`;

const Title = styled.h2`
  font-size: 1.5rem;
  font-weight: 700;
  background: linear-gradient(135deg, #1e293b, #475569);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  margin: 0;
  
  @media (max-width: 768px) {
    font-size: 1.3rem;
  }
`;

const CloseButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  border-radius: 12px;
  border: none;
  background: rgba(239, 68, 68, 0.1);
  color: #ef4444;
  cursor: pointer;
  transition: all 0.2s ease;
  
  &:hover {
    background: rgba(239, 68, 68, 0.2);
    transform: scale(1.05);
  }
  
  &:active {
    transform: scale(0.95);
  }
`;

const Content = styled.div`
  padding: 24px 32px 32px 32px;
  overflow-y: auto;
  max-height: calc(90vh - 100px);
  
  @media (max-width: 768px) {
    padding: 20px 24px 24px 24px;
  }
`;

const Footer = styled.div`
  display: flex;
  gap: 12px;
  justify-content: flex-end;
  padding: 16px 32px 24px 32px;
  border-top: 1px solid rgba(226, 232, 240, 0.8);
  background: linear-gradient(135deg, rgba(248, 250, 252, 0.5), rgba(241, 245, 249, 0.5));
  
  @media (max-width: 768px) {
    padding: 12px 24px 20px 24px;
    gap: 8px;
  }
`;

export const ModernModal: React.FC<ModernModalProps> = ({
  isOpen,
  onClose,
  title,
  children,
  size = 'md'
}) => {
  if (!isOpen) return null;

  return (
    <Overlay $isOpen={isOpen} onClick={onClose}>
      <ModalContainer $size={size} onClick={(e) => e.stopPropagation()}>
        <Header>
          <Title>{title}</Title>
          <CloseButton onClick={onClose}>
            <X size={20} />
          </CloseButton>
        </Header>
        <Content>
          {children}
        </Content>
      </ModalContainer>
    </Overlay>
  );
};

export const ModernModalFooter: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return <Footer>{children}</Footer>;
};
