'use client';

import React from 'react';

import { useNotification } from '@/providers/appProvider';

import { Toast } from './Toast';

export const Notifications = () => {
  const { notifications, handleNotificationRemoved } = useNotification();

  const handleRemove = (id: string) => {
    handleNotificationRemoved!(id);
  };

  return (
    <div className='pointer-events-none absolute top-4 right-4 z-[70] space-y-3'>
      {notifications.map((toast) => (
        <Toast
          key={toast.id}
          id={toast.id}
          type={toast.type}
          message={toast.message}
          onClose={handleRemove}
        />
      ))}
    </div>
  );
};
