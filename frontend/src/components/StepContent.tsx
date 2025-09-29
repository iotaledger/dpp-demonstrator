'use client';

import React from 'react';

interface StepContentProps {
  imageSrc?: string;
  imageAlt?: string;
  stepType?: string;
  stepTitle?: string;
  stepDescription?: string;
  opacity?: number;
  delay?: number;
}

const StepContent: React.FC<StepContentProps> = ({
  imageSrc = "/assets/steps/step_8.webp",
  imageAlt = "Step Image",
  stepTitle = "Step Title",
  stepDescription = "Step description content goes here.",
  opacity = 100,
  delay = 0
}) => {
  return (
    <div
      className="flex-1 overflow-y-auto p-6"
      style={{
        opacity: opacity / 100,
        transition: `opacity ${delay}s ease-out`
      }}
    >
      <div>
        <div className="aspect-video bg-white border border-gray-200 rounded-lg overflow-clip mb-4 flex items-center justify-center">
          <img
            className="max-w-full max-h-full object-contain transition-opacity duration-300"
            src={imageSrc}
            alt={imageAlt}
          />
        </div>

        <h3 className="text-lg font-semibold text-gray-900 pb-3">
          {stepTitle}
        </h3>

        <div className="prose prose-sm text-gray-600 leading-relaxed">
          <div dangerouslySetInnerHTML={{ __html: stepDescription }} />
        </div>
      </div>
    </div>
  );
};

export default StepContent;
