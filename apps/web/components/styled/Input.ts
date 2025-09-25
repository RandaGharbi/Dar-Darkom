import styled from 'styled-components';

interface InputProps {
  error?: boolean;
  fullWidth?: boolean;
}

export const Input = styled.input<InputProps>`
  background: #f0f8ff;
  border: 1px solid ${props => props.error ? '#ef4444' : '#e5e5e5'};
  border-radius: 12px;
  font-size: 16px;
  padding: 16px;
  color: #333;
  transition: all 0.2s ease;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', sans-serif;
  width: ${props => props.fullWidth ? '100%' : 'auto'};

  &:focus {
    outline: none;
    border-color: #2E86AB;
    box-shadow: 0 0 0 3px rgba(46, 134, 171, 0.1);
  }

  &::placeholder {
    color: #666;
    opacity: 1;
  }

  &:disabled {
    background: #f5f5f5;
    color: #999;
    cursor: not-allowed;
  }
`;

export const TextArea = styled.textarea<InputProps>`
  background: #f0f8ff;
  border: 1px solid ${props => props.error ? '#ef4444' : '#e5e5e5'};
  border-radius: 12px;
  font-size: 16px;
  padding: 16px;
  color: #333;
  transition: all 0.2s ease;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', sans-serif;
  width: ${props => props.fullWidth ? '100%' : 'auto'};
  min-height: 100px;
  resize: vertical;

  &:focus {
    outline: none;
    border-color: #2E86AB;
    box-shadow: 0 0 0 3px rgba(46, 134, 171, 0.1);
  }

  &::placeholder {
    color: #666;
    opacity: 1;
  }

  &:disabled {
    background: #f5f5f5;
    color: #999;
    cursor: not-allowed;
  }
`;

export const Label = styled.label`
  display: block;
  font-size: 14px;
  font-weight: 500;
  color: #333;
  margin-bottom: 8px;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', sans-serif;
`;

export const ErrorText = styled.span`
  display: block;
  font-size: 12px;
  color: #ef4444;
  margin-top: 4px;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', sans-serif;
`;





