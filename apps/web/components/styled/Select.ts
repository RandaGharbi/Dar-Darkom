import styled from 'styled-components';
import React, { useState, useRef, useEffect } from 'react';
import { ChevronDown } from 'lucide-react';

const SelectContainer = styled.div`
  position: relative;
  width: 100%;
`;

const SelectTrigger = styled.button<{ $isOpen: boolean; $error?: boolean }>`
  width: 100%;
  background: #f0f8ff;
  border: 1px solid ${props => props.$error ? '#ef4444' : '#e5e5e5'};
  border-radius: 12px;
  font-size: 16px;
  padding: 16px;
  color: #333;
  transition: all 0.2s ease;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', sans-serif;
  display: flex;
  align-items: center;
  justify-content: space-between;
  cursor: pointer;

  &:focus {
    outline: none;
    border-color: #2E86AB;
    box-shadow: 0 0 0 3px rgba(46, 134, 171, 0.1);
  }

  &:hover {
    border-color: #2E86AB;
  }
`;

const SelectValue = styled.span<{ $placeholder?: boolean }>`
  color: ${props => props.$placeholder ? '#666' : '#333'};
`;

const SelectIcon = styled(ChevronDown)<{ $isOpen: boolean }>`
  width: 16px;
  height: 16px;
  color: #666;
  transition: transform 0.2s ease;
  transform: ${props => props.$isOpen ? 'rotate(180deg)' : 'rotate(0deg)'};
`;

const SelectContent = styled.div<{ $isOpen: boolean }>`
  position: absolute;
  top: 100%;
  left: 0;
  right: 0;
  background: #ffffff;
  border: 1px solid #e5e5e5;
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  z-index: 50;
  margin-top: 4px;
  max-height: 200px;
  overflow-y: auto;
  display: ${props => props.$isOpen ? 'block' : 'none'};
`;

const SelectItem = styled.button`
  width: 100%;
  padding: 12px 16px;
  border: none;
  background: transparent;
  color: #333;
  font-size: 16px;
  text-align: left;
  cursor: pointer;
  transition: background-color 0.2s ease;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', sans-serif;

  &:hover {
    background: #f0f8ff;
  }

  &:first-child {
    border-radius: 12px 12px 0 0;
  }

  &:last-child {
    border-radius: 0 0 12px 12px;
  }
`;

interface SelectProps {
  value?: string;
  onValueChange?: (value: string) => void;
  children: React.ReactNode;
  placeholder?: string;
  error?: boolean;
}

export const Select: React.FC<SelectProps> = ({ 
  value, 
  onValueChange, 
  children, 
  placeholder = "Sélectionner...",
  error = false 
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const selectRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (selectRef.current && !selectRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleItemClick = (itemValue: string) => {
    onValueChange?.(itemValue);
    setIsOpen(false);
  };

  return (
    <SelectContainer ref={selectRef}>
      <SelectTrigger 
        $isOpen={isOpen} 
        $error={error}
        onClick={() => setIsOpen(!isOpen)}
      >
        <SelectValue $placeholder={!value}>
          {value || placeholder}
        </SelectValue>
        <SelectIcon $isOpen={isOpen} />
      </SelectTrigger>
      <SelectContent $isOpen={isOpen}>
        {React.Children.map(children, (child) => {
          if (React.isValidElement(child) && child.type === SelectItemComponent) {
            return React.cloneElement(child, {
              onClick: () => handleItemClick(child.props.value),
            });
          }
          return child;
        })}
      </SelectContent>
    </SelectContainer>
  );
};

interface SelectItemProps {
  value: string;
  children: React.ReactNode;
  onClick?: () => void;
}

export const SelectItemComponent: React.FC<SelectItemProps> = ({ 
  value, 
  children, 
  onClick 
}) => {
  return (
    <SelectItem onClick={onClick}>
      {children}
    </SelectItem>
  );
};

// Alias pour la compatibilité
export const SelectContent = SelectContent;
export const SelectItem = SelectItemComponent;
export const SelectTrigger = SelectTrigger;
export const SelectValue = SelectValue;



