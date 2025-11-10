'use client';

import React, { useEffectEvent } from 'react';

import { clsx } from 'clsx';

import { useTransitionTrigger } from '@/hooks/useTransitionTrigger';
import { NOTIFICATION_DECAY_TIME_MS } from '@/utils/constants';
import { TOAST } from '@/contents/common';
import CloseIcon from './icons/CloseIcon';
import type { Notification, ToastType } from '@/types/common';

interface ToastProps extends Notification {
  onClose?: (id: string) => void;
}

function getToastIcon(type: ToastType) {
  switch (type) {
    case 'success':
      return TOAST.icon.success;
    case 'warning':
      return TOAST.icon.warning;
    case 'error':
      return TOAST.icon.error;
    case 'info':
    default:
      return TOAST.icon.info;
  }
}

function getToastStyles(type: ToastType) {
  switch (type) {
    case 'success':
      return 'bg-green-50 border-green-200 text-green-800';
    case 'warning':
      return 'bg-yellow-50 border-yellow-200 text-yellow-800';
    case 'error':
      return 'bg-red-50 border-red-200 text-red-800';
    case 'info':
    default:
      return 'bg-blue-50 border-blue-200 text-blue-800';
  }
}

function getFlyOutRightStyles() {
  return 'transition duration-200 ease-in translate-x-[110%]';
}

export const Toast: React.FC<ToastProps> = ({ id, type, message, onClose }) => {
  const { isTriggered } = useTransitionTrigger(NOTIFICATION_DECAY_TIME_MS);

  const onFinal = useEffectEvent(() => {
    if (onClose) {
      onClose(id);
    }
  });

  const handleClose = () => {
    if (onClose) {
      onClose(id);
    }
  };

  React.useEffect(() => {
    if (isTriggered) {
      window.setTimeout(() => {
        onFinal()
      }, 300);
    }
  }, [id, isTriggered]);

  return (
    <div
      className={clsx([
        `pointer-events-auto w-full max-w-sm rounded-lg border p-4 shadow-lg`,
        getToastStyles(type),
        'animate-[slideInRight_0.4s_ease-out_forwards]',
        isTriggered && getFlyOutRightStyles(),
      ])}
    >
      <div className='flex items-start gap-3'>
        <div className='flex-shrink-0 text-lg'>{getToastIcon(type)}</div>

        <div className='min-w-0 flex-1'>
          <p className='text-sm font-medium'>{message}</p>
        </div>
        <button
          onClick={handleClose}
          className='focus-visible:ring-ring hover:bg-accent hover:text:brightness-50 inline-flex h-6 w-6 cursor-pointer items-center justify-center rounded-md p-0 transition-all duration-200 ease-out focus-visible:ring-2 focus-visible:outline-none active:scale-98 disabled:pointer-events-none disabled:opacity-50'
        >
          <CloseIcon />
        </button>
      </div>
    </div>
  );
};
