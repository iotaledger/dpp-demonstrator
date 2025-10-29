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
    <div className='w-full h-full overflow-hidden'>
      <div
        className={clsx(
          `flex items-start sm:items-center justify-center h-full overflow-y-auto p-0 opacity-${opacity} scale-${scale} overflow-hidden`,
          isTriggered && 'opacity-100 scale-100',
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
