import React from 'react';
import { useTransitionTrigger } from '@/hooks/useTransitionTrigger';
import clsx from 'clsx';

interface LeanFeatureCardProps {
  title: string;
  description?: string;
  opacity?: number;
  translateY?: number;
  delay?: number;
}

const LeanFeatureCard: React.FC<LeanFeatureCardProps> = ({
  title,
  description = "",
  opacity = 0,
  translateY = 4,
  delay = 200,
}) => {
  const { isTriggered } = useTransitionTrigger(delay);
  return (
    <div
      className={clsx([
        `border border-gray-100/20 rounded-2xl p-6 opacity-${opacity} translate-y-${translateY} bg-gradient-to-br from-blue-50 to-blue-200/20 backdrop-blur-sm`,
        isTriggered && 'opacity-100 translate-y-0'
      ])}
      style={{
        transition: 'transition: opacity 0.6s ease-out 0.4s, transform 0.6s ease-out 0.4s'
      }}
    >
      <h3 className="text-sm text-blue-600 mb-2 leading-tight">{title}</h3>
      <p className="text-sm text-gray-700 leading-relaxed">{description}</p>
    </div>
  );
};

export default LeanFeatureCard;
