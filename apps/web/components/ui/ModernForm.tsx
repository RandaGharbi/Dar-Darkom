"use client";

import React from 'react';
import styled from 'styled-components';
import { AlertCircle, CheckCircle } from 'lucide-react';

interface FormGroupProps {
  children: React.ReactNode;
  className?: string;
}

interface LabelProps {
  children: React.ReactNode;
  required?: boolean;
  htmlFor?: string;
}

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  error?: boolean;
  success?: boolean;
  icon?: React.ReactNode;
}

interface TextAreaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  error?: boolean;
  success?: boolean;
}

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  error?: boolean;
  success?: boolean;
}

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'danger' | 'success';
  size?: 'sm' | 'md' | 'lg';
  loading?: boolean;
}

const FormGroup = styled.div<FormGroupProps>`
  margin-bottom: 24px;
  
  &:last-child {
    margin-bottom: 0;
  }
`;

const Label = styled.label<LabelProps>`
  display: block;
  margin-bottom: 8px;
  font-weight: 600;
  font-size: 0.95rem;
  color: #374151;
  
  &::after {
    content: ${({ required }) => (required ? '" *"' : '""')};
    color: #ef4444;
    margin-left: 4px;
  }
`;

const InputContainer = styled.div<{ $error?: boolean; $success?: boolean }>`
  position: relative;
  
  input {
    width: 100%;
    padding: 14px 16px;
    border: 2px solid ${({ $error, $success }) => 
      $error ? '#ef4444' : 
      $success ? '#10b981' : 
      'rgba(226, 232, 240, 0.8)'
    };
    border-radius: 12px;
    font-size: 1rem;
    background: linear-gradient(135deg, #ffffff 0%, #f8fafc 100%);
    color: #1e293b;
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
    
    &:focus {
      outline: none;
      border-color: ${({ $error, $success }) => 
        $error ? '#ef4444' : 
        $success ? '#10b981' : 
        '#3b82f6'
      };
      box-shadow: 0 0 0 3px ${({ $error, $success }) => 
        $error ? 'rgba(239, 68, 68, 0.1)' : 
        $success ? 'rgba(16, 185, 129, 0.1)' : 
        'rgba(59, 130, 246, 0.1)'
      };
      transform: translateY(-1px);
    }
    
    &:hover:not(:focus) {
      border-color: ${({ $error, $success }) => 
        $error ? '#ef4444' : 
        $success ? '#10b981' : 
        '#94a3b8'
      };
    }
    
    &::placeholder {
      color: #9ca3af;
      font-weight: 400;
    }
  }
`;

const TextAreaContainer = styled.div<{ $error?: boolean; $success?: boolean }>`
  position: relative;
  
  textarea {
    width: 100%;
    padding: 14px 16px;
    border: 2px solid ${({ $error, $success }) => 
      $error ? '#ef4444' : 
      $success ? '#10b981' : 
      'rgba(226, 232, 240, 0.8)'
    };
    border-radius: 12px;
    font-size: 1rem;
    background: linear-gradient(135deg, #ffffff 0%, #f8fafc 100%);
    color: #1e293b;
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
    resize: vertical;
    min-height: 100px;
    font-family: inherit;
    
    &:focus {
      outline: none;
      border-color: ${({ $error, $success }) => 
        $error ? '#ef4444' : 
        $success ? '#10b981' : 
        '#3b82f6'
      };
      box-shadow: 0 0 0 3px ${({ $error, $success }) => 
        $error ? 'rgba(239, 68, 68, 0.1)' : 
        $success ? 'rgba(16, 185, 129, 0.1)' : 
        'rgba(59, 130, 246, 0.1)'
      };
      transform: translateY(-1px);
    }
    
    &:hover:not(:focus) {
      border-color: ${({ $error, $success }) => 
        $error ? '#ef4444' : 
        $success ? '#10b981' : 
        '#94a3b8'
      };
    }
    
    &::placeholder {
      color: #9ca3af;
      font-weight: 400;
    }
  }
`;

const SelectContainer = styled.div<{ $error?: boolean; $success?: boolean }>`
  position: relative;
  
  select {
    width: 100%;
    padding: 14px 16px;
    border: 2px solid ${({ $error, $success }) => 
      $error ? '#ef4444' : 
      $success ? '#10b981' : 
      'rgba(226, 232, 240, 0.8)'
    };
    border-radius: 12px;
    font-size: 1rem;
    background: linear-gradient(135deg, #ffffff 0%, #f8fafc 100%);
    color: #1e293b;
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
    cursor: pointer;
    appearance: none;
    background-image: url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='m6 8 4 4 4-4'/%3e%3c/svg%3e");
    background-position: right 12px center;
    background-repeat: no-repeat;
    background-size: 16px;
    padding-right: 40px;
    
    &:focus {
      outline: none;
      border-color: ${({ $error, $success }) => 
        $error ? '#ef4444' : 
        $success ? '#10b981' : 
        '#3b82f6'
      };
      box-shadow: 0 0 0 3px ${({ $error, $success }) => 
        $error ? 'rgba(239, 68, 68, 0.1)' : 
        $success ? 'rgba(16, 185, 129, 0.1)' : 
        'rgba(59, 130, 246, 0.1)'
      };
      transform: translateY(-1px);
    }
    
    &:hover:not(:focus) {
      border-color: ${({ $error, $success }) => 
        $error ? '#ef4444' : 
        $success ? '#10b981' : 
        '#94a3b8'
      };
    }
  }
`;

const StatusIcon = styled.div<{ $error?: boolean; $success?: boolean }>`
  position: absolute;
  right: 12px;
  top: 50%;
  transform: translateY(-50%);
  display: flex;
  align-items: center;
  justify-content: center;
  width: 20px;
  height: 20px;
  color: ${({ $error, $success }) => 
    $error ? '#ef4444' : 
    $success ? '#10b981' : 
    'transparent'
  };
`;

const Button = styled.button<ButtonProps>`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: ${({ size }) => {
    switch (size) {
      case 'sm': return '8px 16px';
      case 'md': return '12px 24px';
      case 'lg': return '16px 32px';
      default: return '12px 24px';
    }
  }};
  border-radius: 12px;
  font-weight: 600;
  font-size: ${({ size }) => {
    switch (size) {
      case 'sm': return '0.875rem';
      case 'md': return '1rem';
      case 'lg': return '1.125rem';
      default: return '1rem';
    }
  }};
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  border: none;
  position: relative;
  overflow: hidden;
  
  ${({ variant }) => {
    switch (variant) {
      case 'primary':
        return `
          background: linear-gradient(135deg, #3b82f6, #8b5cf6);
          color: white;
          box-shadow: 0 4px 12px rgba(59, 130, 246, 0.3);
          
          &:hover:not(:disabled) {
            background: linear-gradient(135deg, #2563eb, #7c3aed);
            transform: translateY(-2px);
            box-shadow: 0 8px 20px rgba(59, 130, 246, 0.4);
          }
        `;
      case 'secondary':
        return `
          background: linear-gradient(135deg, #f8fafc, #e2e8f0);
          color: #374151;
          border: 1px solid rgba(226, 232, 240, 0.8);
          
          &:hover:not(:disabled) {
            background: linear-gradient(135deg, #e2e8f0, #cbd5e1);
            transform: translateY(-1px);
          }
        `;
      case 'danger':
        return `
          background: linear-gradient(135deg, #ef4444, #dc2626);
          color: white;
          box-shadow: 0 4px 12px rgba(239, 68, 68, 0.3);
          
          &:hover:not(:disabled) {
            background: linear-gradient(135deg, #dc2626, #b91c1c);
            transform: translateY(-2px);
            box-shadow: 0 8px 20px rgba(239, 68, 68, 0.4);
          }
        `;
      case 'success':
        return `
          background: linear-gradient(135deg, #10b981, #059669);
          color: white;
          box-shadow: 0 4px 12px rgba(16, 185, 129, 0.3);
          
          &:hover:not(:disabled) {
            background: linear-gradient(135deg, #059669, #047857);
            transform: translateY(-2px);
            box-shadow: 0 8px 20px rgba(16, 185, 129, 0.4);
          }
        `;
      default:
        return `
          background: linear-gradient(135deg, #3b82f6, #8b5cf6);
          color: white;
          box-shadow: 0 4px 12px rgba(59, 130, 246, 0.3);
          
          &:hover:not(:disabled) {
            background: linear-gradient(135deg, #2563eb, #7c3aed);
            transform: translateY(-2px);
            box-shadow: 0 8px 20px rgba(59, 130, 246, 0.4);
          }
        `;
    }
  }}
  
  &:active:not(:disabled) {
    transform: translateY(0);
  }
  
  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
    transform: none !important;
  }
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: -100%;
    width: 100%;
    height: 100%;
    background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent);
    transition: left 0.5s;
  }
  
  &:hover:not(:disabled)::before {
    left: 100%;
  }
`;

const ErrorMessage = styled.div`
  display: flex;
  align-items: center;
  gap: 6px;
  margin-top: 6px;
  font-size: 0.875rem;
  color: #ef4444;
  font-weight: 500;
`;

const SuccessMessage = styled.div`
  display: flex;
  align-items: center;
  gap: 6px;
  margin-top: 6px;
  font-size: 0.875rem;
  color: #10b981;
  font-weight: 500;
`;

// Composants exportés
export const ModernFormGroup: React.FC<FormGroupProps> = ({ children, className }) => (
  <FormGroup className={className}>{children}</FormGroup>
);

export const ModernLabel: React.FC<LabelProps> = ({ children, required, htmlFor }) => (
  <Label required={required} htmlFor={htmlFor}>{children}</Label>
);

export const ModernInput: React.FC<InputProps> = ({ error, success, icon, ...props }) => (
  <InputContainer $error={error} $success={success}>
    <input {...props} />
    <StatusIcon $error={error} $success={success}>
      {error && <AlertCircle size={16} />}
      {success && <CheckCircle size={16} />}
    </StatusIcon>
  </InputContainer>
);

export const ModernTextArea: React.FC<TextAreaProps> = ({ error, success, ...props }) => (
  <TextAreaContainer $error={error} $success={success}>
    <textarea {...props} />
    <StatusIcon $error={error} $success={success}>
      {error && <AlertCircle size={16} />}
      {success && <CheckCircle size={16} />}
    </StatusIcon>
  </TextAreaContainer>
);

export const ModernSelect: React.FC<SelectProps> = ({ error, success, children, ...props }) => (
  <SelectContainer $error={error} $success={success}>
    <select {...props}>
      {children}
    </select>
    <StatusIcon $error={error} $success={success}>
      {error && <AlertCircle size={16} />}
      {success && <CheckCircle size={16} />}
    </StatusIcon>
  </SelectContainer>
);

export const ModernButton: React.FC<ButtonProps> = ({ 
  children, 
  loading, 
  disabled, 
  ...props 
}) => (
  <Button disabled={disabled || loading} {...props}>
    {loading && (
      <div style={{
        width: '16px',
        height: '16px',
        border: '2px solid transparent',
        borderTop: '2px solid currentColor',
        borderRadius: '50%',
        animation: 'spin 1s linear infinite'
      }} />
    )}
    {children}
  </Button>
);

export { ErrorMessage, SuccessMessage };
