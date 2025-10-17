'use client';

import { useRouter } from "next/navigation";
import React from "react";

const initialStep = 1;

export function useTutorialNavigation(externalCurrentStep: number, totalSteps: number, getPathCb: (target: number) => string) {
  const [currentStep, setCurrentStep] = React.useState(externalCurrentStep ?? initialStep);
  const [isGoingPrevious, setIsGoingPrevious] = React.useState(false);
  const router = useRouter();

  const canGoPrevious = currentStep > 1;
  const canGoNext = currentStep < totalSteps;
  const progress = (currentStep / totalSteps) * 100;

  const handlePrevious = React.useCallback(() => {
    if (currentStep > 1) {
      const nextStep = currentStep - 1;
      router.push(getPathCb(nextStep))
      setCurrentStep(nextStep);
      setIsGoingPrevious(true);
    }
  }, [currentStep]);

  const handleNext = React.useCallback(() => {
    if (currentStep < totalSteps) {
      const nextStep = currentStep + 1;
      router.push(getPathCb(nextStep))
      setCurrentStep(nextStep);
      setIsGoingPrevious(false);
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
    isGoingPrevious,
  }
}
