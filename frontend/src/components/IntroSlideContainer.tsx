/**
 * Copyright (c) IOTA Stiftung
 * SPDX-License-Identifier: Apache-2.0
 */

'use client';

import clsx from 'clsx';

import { useTransitionTrigger } from '@/hooks/useTransitionTrigger';

interface IntroSlideContainerProps {
  children: React.ReactNode;
  opacity?: number;
  scale?: number;
  delay?: number;
}

const IntroSlideContainer: React.FC<IntroSlideContainerProps> = ({
  children,
  opacity = 0,
  scale = 98,
  delay = 200,
}) => {
  const { isTriggered } = useTransitionTrigger(delay);
  return (
    <div className='h-full w-full overflow-hidden'>
      <div
        className={clsx(
          `flex h-full items-start justify-center overflow-y-auto p-0 sm:items-center opacity-${opacity} scale-${scale} overflow-hidden`,
          isTriggered && 'scale-100 opacity-100',
        )}
        style={{
          transition: 'opacity 0.6s ease-out, transform 0.6s ease-out',
        }}
      >
        {children}
      </div>
    </div>
  );
};

export default IntroSlideContainer;
