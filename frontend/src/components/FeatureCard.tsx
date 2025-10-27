'use client';

import { useTransitionTrigger } from '@/hooks/useTransitionTrigger';
import clsx from 'clsx';
import React from 'react';

interface FeatureCardVariantProps {
  image?: string;
  alt?: string;
  url?: string;
  colSpan?: string;
  variant?: 'default' | 'product' | 'notice' | 'service' | 'resource' | 'explore';
  background?: string;
  layout?: 'default' | 'horizontal' | 'compact';
  titleSize?: 'large' | 'base';
  contentPosition?: 'left' | 'center';
}

interface FeatureCardProps extends FeatureCardVariantProps {
  title: string;
  description?: string;
  opacity?: number;
  translateY?: number;
  delay?: number;
}

const FeatureCard: React.FC<FeatureCardProps> = ({
  title,
  description = "",
  opacity = 0,
  translateY = 4,
  delay = 200,
  image,
  alt,
  url,
  variant,
  titleSize = 'base',
  contentPosition = 'left',
}) => {
  const getTitleClasses = () => {
    const baseClasses = "text-gray-900 mb-2 md:mb-3 font-semibold";
    const textBase = "text-base md:text-xl";
    const textLarge = "text-lg md:text-2xl";

    switch (titleSize) {
      case 'large':
        return `${baseClasses} ${textLarge}`;
      case 'base':
      default:
        return `${baseClasses} ${textBase}`;
    }
  };

  const getContentPosition = () => {
    const contentLeft = "md:text-left";
    const contentCenter = "md:text-center";

    switch (contentPosition) {
      case 'center':
        return contentCenter;
      case 'left':
      default:
        return contentLeft;
    }
  };

  const renderExploreIcon = () => {
    if (variant === 'explore') {
      return (
        <div className="absolute top-3 right-3 md:top-4 md:right-4">
          <svg className="w-6 h-6 md:w-8 md:h-8 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 17L17 7M17 7H7M17 7V17" />
          </svg>
        </div>
      );
    }
    return null;
  };
  const cardContent = (
    <>
      {renderExploreIcon()}
      <div className={`flex flex-col md:flex-row md:items-center h-full gap-4 md:gap-6`}>
        <>
          <div className={`flex-1 text-center ${getContentPosition()}`}>
            <h4 className={getTitleClasses()}>
              {title}
            </h4>
            <p className="text-gray-600 text-sm md:text-base leading-relaxed">
              {description}
            </p>
          </div>
          <div className="flex-1 h-24 md:h-full max-h-32 md:max-h-[20vh]">
            <img
              src={image}
              alt={alt}
              className="w-full h-full object-contain"
            />
          </div>
        </>
      </div>
    </>
  );

  const { isTriggered } = useTransitionTrigger(delay);
  return (
    <div
      className={clsx([
        "h-full bg-gradient-to-br from-white/80 to-white/70 backdrop-blur-sm",
        "rounded-3xl p-4 md:p-6 border border-gray-200 hover:shadow-md transition-shadow cursor-pointer overflow-hidden",
        `opacity-${opacity} translate-y-${translateY}`,
        isTriggered && 'opacity-100 translate-y-0'
      ])}
      style={{
        transition: 'transition: opacity 0.6s ease-out 0.4s, transform 0.6s ease-out 0.4s'
      }}
    >
      {url ? (
        <a target="_blank" href={url} className="block h-full">
          {cardContent}
        </a>
      ) : (
        cardContent
      )}
    </div>
  );
};

export default FeatureCard;
