import React from 'react';
import StepContent from './StepContent';
import StepProgress from './StepProgress';
import StepNavigation from './StepNavigation';

interface GuidedSidebarProps {
  sidebarTitle?: string;
  imageSrc?: string;
  imageAlt?: string;
  stepType?: string;
  stepTitle?: string;
  stepDescription?: string;
  currentStep?: number;
  totalSteps?: number;
  progressPercentage?: number;
  canGoPrevious?: boolean;
  canGoNext?: boolean;
  onPrevious?: () => void;
  onNext?: () => void;
  previousLabel?: string;
  nextLabel?: string;
  opacity?: number;
  delay?: number;
}

const GuidedSidebar: React.FC<GuidedSidebarProps> = ({
  sidebarTitle = "Behind the Scene",
  imageSrc,
  imageAlt,
  stepType,
  stepTitle,
  stepDescription,
  currentStep,
  totalSteps,
  progressPercentage,
  canGoPrevious,
  canGoNext,
  onPrevious,
  onNext,
  previousLabel,
  nextLabel,
  opacity = 100,
  delay = 0
}) => {
  return (
    <div
      className="bg-white rounded-xl border border-gray-300 h-full flex flex-col overflow-hidden"
      style={{
        opacity: opacity / 100,
        transition: `opacity ${delay}s ease-out`
      }}
    >
      <div className="flex-shrink-0 bg-slate-100 px-6 py-3 border-b border-gray-200 text-xs text-gray-500">
        <h4>{sidebarTitle}</h4>
      </div>
      
      <StepContent
        imageSrc={imageSrc}
        imageAlt={imageAlt}
        stepType={stepType}
        stepTitle={stepTitle}
        stepDescription={stepDescription}
      />
      
      <div className="flex-shrink-0 border-t border-gray-200 p-6">
        <div className="flex items-center justify-between">
          <StepProgress
            currentStep={currentStep}
            totalSteps={totalSteps}
            progressPercentage={progressPercentage}
          />
          
          <StepNavigation
            canGoPrevious={canGoPrevious}
            canGoNext={canGoNext}
            onPrevious={onPrevious}
            onNext={onNext}
            previousLabel={previousLabel}
            nextLabel={nextLabel}
          />
        </div>
      </div>
    </div>
  );
};

export default GuidedSidebar;