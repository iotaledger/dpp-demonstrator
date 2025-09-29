'use client';

import React from 'react';

interface OverlayTextProps {
  welcomeText?: string;
  title?: string;
  description?: string | React.ReactNode;
  opacity?: number;
  translateY?: number;
}

const OverlayText: React.FC<OverlayTextProps> = ({
  welcomeText,
  title,
  description,
  opacity = 0,
  translateY = 4
}) => {
  return (
    <div
      className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-full max-w-5xl mx-auto text-center px-6 md:px-12 py-6 md:py-8"
      style={{ zIndex: 100 }}
    >
      <div
        className={`opacity-${opacity} translate-y-${translateY}`}
        style={{
          transition: 'opacity 0.6s ease-out 0.3s, transform 0.6s ease-out 0.3s'
        }}
      >
        {welcomeText && (
          <div className="text-sm md:text-base text-white/80 mb-0.5 tracking-wide font-light">
            {welcomeText}
          </div>
        )}
        {title && (
          <h1 className="text-xl md:text-2xl lg:text-4xl font-semibold mb-2 leading-tight text-white">
            {title}
          </h1>
        )}
        {description && (
          <p className="text-base md:text-lg text-white/90 mb-1 leading-relaxed max-w-3xl mx-auto">
            {description}
          </p>
        )}
      </div>
    </div>
  );
};

export default OverlayText;
