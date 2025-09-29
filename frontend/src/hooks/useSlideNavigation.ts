'use client';

import { useRouter } from "next/navigation";
import React from "react";

const initialSlide = 1;

export function useSlideNavigation(externalCurrentSlide: number, totalSlides: number, getPathCb: (target: number) => string) {
  const [currentSlide] = React.useState(externalCurrentSlide ?? initialSlide);
  const router = useRouter();

  const canGoPrevious = currentSlide > 1;
  const canGoNext = currentSlide < totalSlides;
  const progress = (currentSlide / totalSlides) * 100;

  /**
   * NOTE: Maybe we should review this method in favor of <Link /> usage,
   * as the use of the component enables a prefetching, which can improve
   * user experience. However, this change should be measured to confirm
   * its improvement claim.
   */
  const handlePrevious = () => {
    if (currentSlide > 1) {
      router.push(getPathCb(currentSlide - 1))
    }
  };

  const handleNext = () => {
    if (currentSlide < totalSlides) {
      router.push(getPathCb(currentSlide + 1))
    }
  };

  React.useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      switch (event.key) {
        case 'ArrowLeft':
          event.preventDefault();
          if (canGoPrevious) handlePrevious();
          break;
        case 'ArrowRight':
          event.preventDefault();
          if (canGoNext) handleNext();
          break;
        case 'Escape':
          event.preventDefault();
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [canGoPrevious, canGoNext, handlePrevious, handleNext]);


  return {
    currentSlide,
    totalSlides,
    canGoPrevious,
    canGoNext,
    goPrevious: handlePrevious,
    goNext: handleNext,
    progress,
  }
}
