/**
 * Copyright (c) IOTA Stiftung
 * SPDX-License-Identifier: Apache-2.0
 */

'use client';

import React from 'react';

import clsx from 'clsx';

import { useTransitionTrigger } from '@/hooks/useTransitionTrigger';

interface ClientCardProps {
  image: string;
  alt: string;
  title: string;
  description: string | React.ReactNode;
  opacity?: number;
  translateY?: number;
  delay?: number;
}

const ClientCard: React.FC<ClientCardProps> = ({
  image,
  alt,
  title,
  description,
  opacity = 0,
  translateY = 4,
  delay = 200,
}) => {
  const { isTriggered } = useTransitionTrigger(delay);
  return (
    <div
      className={clsx(
        `flex h-full flex-col overflow-hidden rounded-3xl opacity-${opacity} translate-y-${translateY}`,
        isTriggered && 'translate-y-0 opacity-100',
      )}
      style={{
        transition: 'transition: opacity 0.6s ease-out 0.25s, transform 0.6s ease-out 0.25s',
      }}
    >
      <div className='flex-1 overflow-hidden rounded-3xl'>
        <img className='h-full w-full object-cover' src={image} alt={alt} />
      </div>

      <div className='p-3 md:p-4'>
        <h4 className='mb-1 text-base font-semibold text-gray-900 md:text-lg'>{title}</h4>
        <p className='text-base text-gray-600 md:text-xl'>{description}</p>
      </div>
    </div>
  );
};

export default ClientCard;
