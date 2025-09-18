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
  titleWeight?: 'normal' | 'semibold' | 'medium';
  layout?: 'default' | 'horizontal' | 'compact';
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
  background,
  titleWeight,
  layout,
}) => {
  const getVariantClasses = () => {
    switch (variant) {
      case 'product':
        return 'bg-gradient-to-br from-white/80 to-white/70 backdrop-blur-sm border border-gray-200 hover:shadow-md transition-shadow cursor-pointer';
      case 'service':
        return 'bg-gradient-to-br from-blue-100/70 to-blue-200/70 backdrop-blur-sm border border-gray-200 hover:shadow-md transition-shadow cursor-pointer';
      case 'resource':
        return 'bg-gradient-to-br from-white/80 to-white/70 backdrop-blur-sm border border-gray-200 hover:shadow-md transition-shadow cursor-pointer';
      case 'explore':
        return 'bg-gradient-to-br from-blue-100/70 to-blue-200/70 backdrop-blur-sm border border-gray-200 hover:shadow-md transition-shadow cursor-pointer relative';
      case 'notice':
        return background || 'bg-gradient-to-br from-blue-500 to-blue-600 border border-blue-400';
      default:
        return 'bg-gradient-to-br from-white/80 to-white/70 backdrop-blur-sm border border-gray-200 hover:shadow-md transition-shadow';
    }
  };

  const getTitleClasses = () => {
    const baseClasses = variant === 'resource' ? 'text-base md:text-xl text-gray-900 mb-2 md:mb-3' : 'text-sm md:text-lg text-gray-900 mb-1';
    switch (titleWeight) {
      case 'semibold':
        return `${baseClasses} font-semibold`;
      case 'medium':
        return `${baseClasses} font-medium`;
      default:
        return baseClasses;
    }
  };

  const getLayoutClasses = () => {
    switch (layout) {
      case 'horizontal':
        return 'flex-col md:flex-row md:items-center';
      case 'compact':
        return 'flex-col justify-end h-full';
      default:
        return 'flex-col';
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
    <div className={`h-full rounded-3xl overflow-hidden ${getVariantClasses()}`}>
      {renderExploreIcon()}
      <div className={`flex ${getLayoutClasses()} h-full gap-4 md:gap-6`}>
        {variant === 'explore' && layout === 'compact' ? (
          <div className="h-full flex flex-col justify-end p-3 md:p-4">
            <div className="text-gray-800">
              <h4 className="text-lg md:text-2xl font-semibold">{title}</h4>
            </div>
          </div>
        ) : (
          <>
            <div className={`flex-1 ${layout === 'horizontal' ? 'text-center md:text-left' : ''} ${variant !== 'explore' ? 'overflow-hidden max-h-[180px] rounded-3xl' : 'h-24 md:h-full max-h-32 md:max-h-[20vh]'}`}>
              <img
                src={image}
                alt={alt}
                className={variant === 'service' || variant === 'resource' ? "w-full h-full object-contain" : "w-full h-full object-cover"}
              />
            </div>
            <div className={`p-3 md:p-4 ${layout === 'horizontal' ? 'flex-1 text-center md:text-left' : ''}`}>
              <h4 className={getTitleClasses()}>
                {title}
              </h4>
              {description && (
                <p className={`text-gray-600 leading-relaxed ${variant === 'resource' ? 'text-sm md:text-base' : 'text-xs md:text-sm'}`}>
                  {description}
                </p>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );


  const { isTriggered } = useTransitionTrigger(delay);
  return (
    <div
      className={clsx(`border border-gray-100/20 rounded-2xl p-6 opacity-${opacity} translate-y-${translateY} bg-gradient-to-br from-blue-50 to-blue-200/20 backdrop-blur-sm`, isTriggered && 'opacity-100 translate-y-0')}
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
      <h3 className="text-sm text-blue-600 mb-2 leading-tight">{title}</h3>
      <p className="text-sm text-gray-700 leading-relaxed">{description}</p>
    </div>
  );
};

export default FeatureCard;
