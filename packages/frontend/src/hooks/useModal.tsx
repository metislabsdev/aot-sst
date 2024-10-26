import { useContext } from "react";
import { ModalContext } from "../context/modalContext"; // Adjust the import path as necessary

export function useModal() {
    const context = useContext(ModalContext);
    if (!context) {
      throw new Error('useModal must be used within a ModalProvider');
    }
    return context;
  }