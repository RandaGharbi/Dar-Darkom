import { useState } from 'react';

interface ModalState {
  isOpen: boolean;
  title: string;
  message: string;
  type: 'success' | 'error' | 'warning' | 'info';
  onConfirm?: () => void;
  confirmText?: string;
  cancelText?: string;
  showCancel?: boolean;
}

export const useModal = () => {
  const [modalState, setModalState] = useState<ModalState>({
    isOpen: false,
    title: '',
    message: '',
    type: 'info'
  });

  const showModal = (config: Omit<ModalState, 'isOpen'>) => {
    setModalState({
      ...config,
      isOpen: true
    });
  };

  const hideModal = () => {
    setModalState(prev => ({
      ...prev,
      isOpen: false
    }));
  };

  const showSuccess = (message: string, title = 'Succès') => {
    showModal({
      title,
      message,
      type: 'success'
    });
  };

  const showError = (message: string, title = 'Erreur') => {
    showModal({
      title,
      message,
      type: 'error'
    });
  };

  const showWarning = (message: string, title = 'Attention') => {
    showModal({
      title,
      message,
      type: 'warning'
    });
  };

  const showInfo = (message: string, title = 'Information') => {
    showModal({
      title,
      message,
      type: 'info'
    });
  };

  const showConfirm = (
    message: string,
    onConfirm: () => void,
    title = 'Confirmation',
    confirmText = 'Confirmer',
    cancelText = 'Annuler'
  ) => {
    showModal({
      title,
      message,
      type: 'warning',
      onConfirm,
      confirmText,
      cancelText,
      showCancel: true
    });
  };

  return {
    modalState,
    showModal,
    hideModal,
    showSuccess,
    showError,
    showWarning,
    showInfo,
    showConfirm
  };
}; 