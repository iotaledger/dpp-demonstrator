import React from "react";

const initialStep = 1;

export function useTutorialNavigation(externalCurrentStep: number, totalSteps: number) {
  const [currentStep, setInternalCurrentStep] = React.useState(externalCurrentStep ?? initialStep);

  const canGoPrevious = currentStep > 1;
  const canGoNext = currentStep < totalSteps;
  const progress = (currentStep / totalSteps) * 100;

  const handlePrevious = React.useCallback(() => {
    if (currentStep > 1) {
      setInternalCurrentStep(currentStep - 1);
    }
  }, [currentStep]);

  const handleNext = React.useCallback(() => {
    if (currentStep < totalSteps) {
      setInternalCurrentStep(currentStep + 1);
    }
  }, [currentStep, totalSteps]);

  return {
    currentStep,
    totalSteps,
    canGoPrevious,
    canGoNext,
    goPrevious: handlePrevious,
    goNext: handleNext,
    progress,
  }
}
