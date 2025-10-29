'use client';

import React from 'react';

import { clsx } from 'clsx';

import { useTransitionTrigger } from '@/hooks/useTransitionTrigger';
import { NOTIFICATION_DECAY_TIME_MS } from '@/utils/constants';

type ToastType = 'success' | 'warning' | 'error' | 'info' | string;

export interface Notification {
  id: string;
  type: ToastType;
  message: string;
}

interface ToastProps extends Notification {
  onClose?: (id: string) => void;
}

function getToastIcon(type: ToastType) {
  switch (type) {
    case 'success':
      return '✅';
    case 'warning':
      return '⚠️';
    case 'error':
      return '❌';
    case 'info':
    default:
      return 'ℹ️';
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

  const handleOnClose = () => {
    if (onClose) {
      onClose(id);
    }
  };

  React.useEffect(() => {
    if (isTriggered) {
      window.setTimeout(() => {
        if (onClose) {
          onClose(id);
        }
      }, 300);
    }
    /* eslint-disable-next-line react-hooks/exhaustive-deps --
     * onClose is a stable function and doesn't require to be a dependency.
     */
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
          onClick={handleOnClose}
          className='focus-visible:ring-ring hover:bg-accent hover:text:brightness-50 inline-flex h-6 w-6 cursor-pointer items-center justify-center rounded-md p-0 transition-all duration-200 ease-out focus-visible:ring-2 focus-visible:outline-none active:scale-98 disabled:pointer-events-none disabled:opacity-50'
        >
          <svg className='h-4 w-4' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
            <path
              strokeLinecap='round'
              strokeLinejoin='round'
              strokeWidth='2'
              d='M6 18L18 6M6 6l12 12'
            ></path>
          </svg>
        </button>
      </div>
    </div>
  );
};
