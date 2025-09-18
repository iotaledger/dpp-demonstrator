import React from 'react';
import { Toast, type Notification } from './Toast';
import { useNotification } from '@/providers/appProvider';

export const Notifications = () => {
  const { notifications, handleNotificationSent, handleNotificationRemoved } = useNotification();
  // const [notifications, setNotifications] = React.useState<Notification[]>([]);

  React.useEffect(() => {
    handleNotificationSent!({
      id: 'abc',
      type: 'success',
      message: '✓ Health snapshot saved to service history',
    });
  }, []);

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

