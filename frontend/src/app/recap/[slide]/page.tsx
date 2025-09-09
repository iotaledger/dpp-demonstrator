'use client';

import { useEffect } from 'react';
import NavigationButtons from "@/components/NavigationButtons";
import RecapSlideManager, { RECAP_SLIDES_MAP } from "@/components/RecapSlideManager";
import ProgressBar from "@/components/ProgressBar";
import SlideCounter from "@/components/SlideCounter";
import { useSlideNavigation } from "@/hooks/useSlideNavigation";
import { useParams } from "next/navigation";

export default function PostExperiencePage() {
  const { slide: slideParam } = useParams();
  const {
    currentSlide,
    totalSlides,
    canGoNext,
    canGoPrevious,
    progress,
    goNext,
    goPrevious,
  } = useSlideNavigation(getSlide(slideParam), RECAP_SLIDES_MAP.size, getPathCallback);

  function getSlide(slideParam: string | string[] | undefined) {
    if (slideParam != null && !Array.isArray(slideParam) && Number.isInteger(Number.parseInt(slideParam as string))) {
      return Number.parseInt(slideParam as string);
    }
    return 1;
  };

  function getPathCallback(targetSlide: number) {
    return `/recap/${targetSlide}`;
  }

  // Handle keyboard navigation
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      switch (event.key) {
        case 'ArrowLeft':
          event.preventDefault();
          if (canGoPrevious) goPrevious();
          break;
        case 'ArrowRight':
          event.preventDefault();
          if (canGoNext) goNext();
          break;
        case 'Escape':
          event.preventDefault();
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentSlide, canGoPrevious, canGoNext]);

  return (
    <>
      {/* Fullscreen slide container */}
      <div className="fixed inset-0 w-full min-h-dvh overflow-y-scroll overflow-x-hidden bg-slate-100">
        <div className="h-full flex items-center justify-center">
          <RecapSlideManager currentSlide={currentSlide} />
        </div>
      </div>

      {/* Navigation Overlays */}
      <ProgressBar progress={progress} />

      <SlideCounter
        current={currentSlide}
        total={totalSlides}
      />

      <NavigationButtons
        onPrevious={goPrevious}
        onNext={goNext}
        canGoPrevious={canGoPrevious}
        canGoNext={canGoNext}
      />
    </>
  );
}
