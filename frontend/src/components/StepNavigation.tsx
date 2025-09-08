import React from 'react';

interface StepNavigationProps {
  canGoPrevious?: boolean;
  canGoNext?: boolean;
  onPrevious?: () => void;
  onNext?: () => void;
  previousLabel?: string;
  nextLabel?: string;
  opacity?: number;
  delay?: number;
}

const StepNavigation: React.FC<StepNavigationProps> = ({
  canGoPrevious = true,
  canGoNext = true,
  onPrevious,
  onNext,
  previousLabel = "Back",
  nextLabel = "Continue",
  opacity = 100,
  delay = 0
}) => {
  return (
    <div
      className="flex items-center space-x-3"
      style={{
        opacity: opacity / 100,
        transition: `opacity ${delay}s ease-out`
      }}
    >
      <button
        className={`font-medium rounded-full border border-gray-300 transition-colors px-8 py-3 text-base text-gray-700 ${
          canGoPrevious 
            ? 'cursor-pointer hover:bg-gray-50' 
            : 'opacity-50 cursor-not-allowed'
        }`}
        onClick={onPrevious}
        disabled={!canGoPrevious}
      >
        {previousLabel}
      </button>
      
      <button
        className={`font-medium rounded-full transition-colors px-8 py-3 text-base ${
          canGoNext
            ? 'cursor-pointer bg-blue-500 text-white hover:bg-blue-600 active:bg-blue-600'
            : 'opacity-50 cursor-not-allowed bg-gray-400 text-white'
        }`}
        onClick={onNext}
        disabled={!canGoNext}
      >
        {nextLabel}
      </button>
    </div>
  );
};

export default StepNavigation;