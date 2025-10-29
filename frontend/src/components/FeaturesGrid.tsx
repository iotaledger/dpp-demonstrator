'use client';

import { useTransitionTrigger } from '@/hooks/useTransitionTrigger';
import clsx from 'clsx';
import React from 'react';

interface FeaturesGridProps {
  children: React.ReactNode;
  columns?: string;
  width?: string;
  opacity?: number;
  translateY?: number;
  gap?: string;
  pb?: string;
  delay?: number;
}

const FeaturesGrid: React.FC<FeaturesGridProps> = ({
  children,
  columns = 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3',
  width = 'max-w-5xl',
  opacity = 0,
  translateY = 4,
  gap = 'gap-6',
  pb = 'pb-12',
  delay = 200,
}) => {
  const { isTriggered } = useTransitionTrigger(delay);
  return (
    <div
      className={clsx(
        `grid ${columns} ${gap} ${width} mx-auto ${pb} md:pb-14 lg:pb-16 opacity-${opacity} translate-y-${translateY}`,
        isTriggered && 'opacity-100 translate-y-0',
      )}
      style={{
        transition: 'opacity 0.6s ease-out 0.35s, transform 0.6s ease-out 0.35s',
      }}
    >
      {children}
    </div>
  );
};

export default FeaturesGrid;
