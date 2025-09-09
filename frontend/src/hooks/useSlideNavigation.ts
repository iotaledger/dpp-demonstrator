import { useRouter } from "next/navigation";
import React from "react";

const initialSlide = 1;

export function useSlideNavigation(externalCurrentSlide: number, totalSlides: number, getPathCb: (target: number) => string) {
  const [currentSlide, setInternalCurrentSlide] = React.useState(externalCurrentSlide ?? initialSlide);
  const router = useRouter();

  const canGoPrevious = currentSlide > 1;
  const canGoNext = currentSlide < totalSlides;
  const progress = (currentSlide / totalSlides) * 100;

  const handleSlideChange = (newSlide: number) => {
    setInternalCurrentSlide(newSlide);
  };

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
      handleSlideChange(currentSlide + 1);
      router.push(getPathCb(currentSlide + 1))
    }
  };

  return {
    currentSlide,
    totalSlides,
    canGoPrevious,
    canGoNext,
    progress,
    goNext: handleNext,
    goPrevious: handlePrevious,
  }
}
