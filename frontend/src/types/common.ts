import { generateRequestId } from '@/utils/common';

export type ToastType = 'success' | 'warning' | 'error' | 'info';

export interface Notification {
  id: string;
  type: ToastType;
  message: string;
}

export function SuccessNotification(message: string, id?: string): Notification {
  return {
    id: id || generateRequestId(),
    type: 'success',
    message,
  } as Notification;
}

export function ErrorNotification(message: string, id?: string): Notification {
  return {
    id: id || generateRequestId(),
    type: 'error',
    message,
  } as Notification;
}
