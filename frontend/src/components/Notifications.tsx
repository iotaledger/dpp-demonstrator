'use client';

import React from 'react';
import { Toast } from './Toast';
import { useNotification } from '@/providers/appProvider';

export const Notifications = () => {
  const { notifications, handleNotificationRemoved } = useNotification();

  const handleRemove = (id: string) => {
    handleNotificationRemoved!(id);
  };

  return (
    < div className="absolute top-4 right-4 z-[70] space-y-3 pointer-events-none" >
      {
        notifications.map((toast) => (
          <Toast
            key={toast.id}
            id={toast.id}
            type={toast.type}
            message={toast.message}
            onClose={handleRemove}
          />
        ))
      }
    </div >
  );
};

