"use client";
import React, { useState, useRef, useEffect } from 'react';
import styled from 'styled-components';
import { ChevronDown, Check } from 'lucide-react';
import { createPortal } from 'react-dom';

interface SelectOption {
  value: string;
  label: string;
  disabled?: boolean;
}

interface SelectProps {
  options: SelectOption[];
  value?: string;
  placeholder?: string;
  onChange: (value: string) => void;
  disabled?: boolean;
  className?: string;
  label?: string;
  onOpen?: () => void;
  onClose?: () => void;
}

const SelectContainer = styled.div`
  position: relative;
  width: 100%;
  z-index: 10;
`;

const SelectLabel = styled.label`
  display: block;
  font-size: 14px;
  font-weight: 500;
  color: #374151;
  margin-bottom: 8px;
`;

const SelectButton = styled.button<{ $isOpen: boolean; $disabled: boolean }>`
  width: 100%;
  padding: 12px 16px;
  border: 1px solid #d1d5db;
  border-radius: 8px;
  background: white;
  color: #374151;
  font-size: 14px;
  text-align: left;
  cursor: ${({ $disabled }) => $disabled ? 'not-allowed' : 'pointer'};
  display: flex;
  align-items: center;
  justify-content: space-between;
  transition: all 0.2s ease;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);
  opacity: ${({ $disabled }) => $disabled ? 0.6 : 1};

  &:hover {
    border-color: ${({ $disabled }) => $disabled ? '#d1d5db' : '#9ca3af'};
  }

  &:focus {
    outline: none;
    border-color: #3b82f6;
    box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
  }

  ${({ $isOpen }) => $isOpen && `
    border-color: #3b82f6;
    box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
  `}
`;

const SelectText = styled.span<{ $placeholder: boolean }>`
  color: ${({ $placeholder }) => $placeholder ? '#6b7280' : '#1f2937'};
  font-style: normal;
  font-weight: 500;
`;

const ChevronIcon = styled(ChevronDown)<{ $isOpen: boolean }>`
  width: 16px;
  height: 16px;
  color: #6b7280;
  transition: transform 0.2s ease;
  transform: ${({ $isOpen }) => $isOpen ? 'rotate(180deg)' : 'rotate(0deg)'};
  flex-shrink: 0;
`;

const SelectDropdown = styled.div<{ $isOpen: boolean }>`
  position: absolute;
  top: 100%;
  left: 0;
  right: 0;
  background: #374151;
  border: 1px solid #4b5563;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
  z-index: 9999;
  margin-top: 8px;
  opacity: ${({ $isOpen }) => $isOpen ? 1 : 0};
  visibility: ${({ $isOpen }) => $isOpen ? 'visible' : 'hidden'};
  transform: ${({ $isOpen }) => $isOpen ? 'translateY(0)' : 'translateY(-10px)'};
  transition: all 0.2s ease;
  max-height: 200px;
  overflow-y: auto;
`;

const SelectHeader = styled.div`
  padding: 10px 16px 8px 16px;
  font-size: 12px;
  font-weight: 600;
  color: #9ca3af;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  border-bottom: 1px solid #4b5563;
  background: #374151;
`;

const SelectOption = styled.button<{ $isSelected: boolean; $disabled: boolean }>`
  width: 100%;
  padding: 10px 16px;
  text-align: left;
  background: ${({ $isSelected }) => $isSelected ? '#4b5563' : '#374151'};
  color: ${({ $disabled }) => $disabled ? '#6b7280' : 'white'};
  border: none;
  cursor: ${({ $disabled }) => $disabled ? 'not-allowed' : 'pointer'};
  display: flex;
  align-items: center;
  justify-content: space-between;
  transition: all 0.15s ease;
  font-size: 14px;
  font-weight: 500;
  opacity: ${({ $disabled }) => $disabled ? 0.6 : 1};

  &:hover {
    background: ${({ $disabled }) => $disabled ? '#4b5563' : '#4b5563'};
  }

  &:focus {
    outline: none;
    background: #4b5563;
  }

  &:first-child {
    border-radius: 6px 6px 0 0;
  }

  &:last-child {
    border-radius: 0 0 6px 6px;
  }
`;

const OptionText = styled.span`
  flex: 1;
`;

const CheckIcon = styled(Check)`
  width: 16px;
  height: 16px;
  color: white;
  flex-shrink: 0;
`;

const Select: React.FC<SelectProps> = ({
  options,
  value,
  placeholder = "Select an option",
  onChange,
  disabled = false,
  className,
  label,
  onOpen,
  onClose
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedOption, setSelectedOption] = useState<SelectOption | null>(null);
  const [dropdownPosition, setDropdownPosition] = useState({ top: 0, left: 0, width: 0 });
  const selectRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);

  // Trouver l'option sélectionnée
  useEffect(() => {
    const option = options.find(opt => opt.value === value);
    setSelectedOption(option || null);
  }, [value, options]);

  // Fermer le dropdown quand on clique à l'extérieur
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Node;
      const isInsideSelect = selectRef.current?.contains(target);
      const isInsideDropdown = document.querySelector('[data-select-dropdown]')?.contains(target);
      
      if (!isInsideSelect && !isInsideDropdown) {
        setIsOpen(false);
        onClose?.();
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen, onClose]);

  const updateDropdownPosition = () => {
    if (buttonRef.current) {
      const rect = buttonRef.current.getBoundingClientRect();
      setDropdownPosition({
        top: rect.bottom + window.scrollY + 8,
        left: rect.left + window.scrollX,
        width: rect.width
      });
    }
  };

  const handleToggle = () => {
    if (!disabled) {
      if (!isOpen) {
        updateDropdownPosition();
        onOpen?.();
      } else {
        onClose?.();
      }
      setIsOpen(!isOpen);
    }
  };

  const handleSelect = (option: SelectOption) => {
    if (!option.disabled) {
      setSelectedOption(option);
      onChange(option.value);
      setIsOpen(false);
      onClose?.();
    }
  };

  const handleKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      handleToggle();
    } else if (event.key === 'Escape') {
      setIsOpen(false);
      onClose?.();
    }
  };

  const dropdownContent = isOpen && (
    <SelectDropdown 
      $isOpen={isOpen} 
      role="listbox"
      data-select-dropdown
      style={{
        position: 'fixed',
        top: dropdownPosition.top,
        left: dropdownPosition.left,
        width: dropdownPosition.width,
        zIndex: 9999
      }}
    >
      {options.map((option) => (
        <SelectOption
          key={option.value}
          type="button"
          $isSelected={selectedOption?.value === option.value}
          $disabled={option.disabled || false}
          onClick={() => handleSelect(option)}
          role="option"
          aria-selected={selectedOption?.value === option.value}
          aria-disabled={option.disabled}
        >
          <OptionText>{option.label}</OptionText>
          {selectedOption?.value === option.value && <CheckIcon />}
        </SelectOption>
      ))}
    </SelectDropdown>
  );

  return (
    <>
      <SelectContainer ref={selectRef} className={className}>
        {label && <SelectLabel>{label}</SelectLabel>}
        <SelectButton
          ref={buttonRef}
          type="button"
          $isOpen={isOpen}
          $disabled={disabled}
          onClick={handleToggle}
          onKeyDown={handleKeyDown}
          aria-haspopup="listbox"
          aria-expanded={isOpen}
          aria-disabled={disabled}
        >
          <SelectText $placeholder={!selectedOption}>
            {selectedOption ? selectedOption.label : placeholder}
          </SelectText>
          <ChevronIcon $isOpen={isOpen} />
        </SelectButton>
      </SelectContainer>
      
      {typeof window !== 'undefined' && dropdownContent && createPortal(dropdownContent, document.body)}
    </>
  );
};

export default Select;
