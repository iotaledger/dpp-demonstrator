'use client';

import React from 'react';

import clsx from 'clsx';

import { useTransitionTrigger } from '@/hooks/useTransitionTrigger';

interface LeanFeatureCardProps {
  title: string;
  description?: string;
  opacity?: number;
  translateY?: number;
  delay?: number;
}

const LeanFeatureCard: React.FC<LeanFeatureCardProps> = ({
  title,
  description = '',
  opacity = 0,
  translateY = 4,
  delay = 200,
}) => {
  const { isTriggered } = useTransitionTrigger(delay);
  return (
    <div
      className={clsx([
        `rounded-2xl border border-gray-100/20 p-6 opacity-${opacity} translate-y-${translateY} bg-gradient-to-br from-blue-50 to-blue-200/20 backdrop-blur-sm`,
        isTriggered && 'translate-y-0 opacity-100',
      ])}
      style={{
        transition: 'transition: opacity 0.6s ease-out 0.4s, transform 0.6s ease-out 0.4s',
      }}
    >
      <h3 className='mb-2 text-sm leading-tight text-blue-600'>{title}</h3>
      <p className='text-sm leading-relaxed text-gray-700'>{description}</p>
    </div>
  );
};

export default LeanFeatureCard;
