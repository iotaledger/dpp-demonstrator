'use client';

import React, { useEffect, useCallback } from 'react';
import { createPortal } from 'react-dom';
import { usePortalTarget } from '@/hooks/usePortalTarget';

interface DialogProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
  onEscape?: () => void;
  className?: string;
  overlayClassName?: string;
}

export const Dialog: React.FC<DialogProps> = ({
  isOpen,
  onClose,
  children,
  onEscape,
  className = '',
  overlayClassName = ''
}) => {
  const portalTarget = usePortalTarget('modal-root');

  // ESC key handling (extracted pattern from PostExperienceRecap.tsx)
  const handleKeyDown = useCallback((event: KeyboardEvent) => {
    if (event.key === 'Escape') {
      event.preventDefault();
      if (onEscape) {
        onEscape();
      } else {
        onClose();
      }
    }
  }, [onClose, onEscape]);

  // Outside click handling
  const handleOverlayClick = useCallback((event: React.MouseEvent) => {
    if (event.target === event.currentTarget) {
      onClose();
    }
  }, [onClose]);

  // Effect for ESC key listener
  useEffect(() => {
    if (isOpen) {
      document.addEventListener('keydown', handleKeyDown);
      // Prevent body scroll when modal is open
      document.body.style.overflow = 'hidden';
      
      return () => {
        document.removeEventListener('keydown', handleKeyDown);
        document.body.style.overflow = 'unset';
      };
    }
  }, [isOpen, handleKeyDown]);

  if (!isOpen || !portalTarget) {
    return null;
  }

  return createPortal(
    <div
      className={`fixed inset-0 z-50 bg-blue-800/30 backdrop-blur-sm ${overlayClassName}`}
      onClick={handleOverlayClick}
      role="dialog"
      aria-modal="true"
      aria-labelledby="dialog-title"
    >
      <div
        className={`fixed left-[50%] top-[50%] z-50 grid w-[95%] max-w-xl translate-x-[-50%] translate-y-[-50%] gap-4 border bg-background p-6 shadow-lg rounded-lg ${className}`}
        onClick={(e) => e.stopPropagation()}
      >
        {children}
      </div>
    </div>,
    portalTarget
  );
};

export default Dialog;