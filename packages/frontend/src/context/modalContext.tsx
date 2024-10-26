import React, { createContext, useState } from 'react';

export const ModalContext = createContext({
  openModal: (
    _content: React.ReactNode,
    _title: string = '',
    _actionButtonText: string = 'Confirm'
  ) => {},
  closeModal: () => {},
  isOpen: false,
});

import { ReactNode } from 'react';
import ModalDialog from '../components/modals/DialogModal';

interface ModalProviderProps {
  children: ReactNode;
}

export function ModalProvider({ children }: ModalProviderProps) {
  const [modalContent, setModalContent] = useState<React.ReactNode>(null);
  const [modalTitle, setModalTitle] = useState('');
  const [actionButtonText, setActionButtonText] = useState('');
  const [isOpen, setIsOpen] = useState(false);

  const openModal = (
    content: React.ReactNode,
    title: string = '',
    actionButtonText: string = 'Submit'
  ) => {
    setModalContent(content);
    setActionButtonText(actionButtonText);
    setModalTitle(title);
    setIsOpen(true);
  };

  const closeModal = () => {
    setIsOpen(false);
    setModalContent(null);
    setModalTitle('');
  };

  return (
    <ModalContext.Provider value={{ openModal, closeModal, isOpen }}>
      {children}
      {isOpen && (
        <ModalDialog
          isOpen={isOpen}
          onClose={closeModal}
          title={modalTitle}
          actionButtonText={actionButtonText}
          setIsOpen={setIsOpen}
        >
          {modalContent}
        </ModalDialog>
      )}
    </ModalContext.Provider>
  );
}
