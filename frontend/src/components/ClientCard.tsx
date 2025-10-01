'use client';

import { useTransitionTrigger } from '@/hooks/useTransitionTrigger';
import clsx from 'clsx';
import React from 'react';

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
        `h-full flex flex-col rounded-3xl overflow-hidden opacity-${opacity} translate-y-${translateY}`,
        isTriggered && 'opacity-100 translate-y-0')}
      style={{
        transition: 'transition: opacity 0.6s ease-out 0.25s, transform 0.6s ease-out 0.25s'
      }}
    >
      <div className="flex-1 overflow-hidden rounded-3xl">
        <img className="w-full h-full object-cover" src={image} alt={alt} />
      </div>

      <div className="p-3 md:p-4">
        <h4 className="text-sm md:text-lg text-gray-900 font-semibold mb-1">{title}</h4>
        <p className="text-xs md:text-sm text-gray-600">{description}</p>
      </div>
    </div>
  );
};

export default ClientCard;
