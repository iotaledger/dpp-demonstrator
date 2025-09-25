'use client';

import React, { useEffect } from 'react';
import NavigationButtons from "@/components/NavigationButtons";
import RecapSlideManager, { RECAP_SLIDES_MAP } from "@/components/RecapSlideManager";
import ProgressBar from "@/components/ProgressBar";
import SlideCounter from "@/components/SlideCounter";
import { useSlideNavigation } from "@/hooks/useSlideNavigation";
import { useParams } from "next/navigation";
import Main from '@/components/Main';
import GridContainer from '@/components/GridContainer';
import MainContent from '@/components/MainContent';
import TutorialCard from '@/components/TutorialCard';
import CardHeader from '@/components/CardHeader';
import TutorialScrollContainer from '@/components/TutorialScrollContainer';
import IntroSlideContainer from '@/components/IntroSlideContainer';

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
        </div>
      </div>
      <Main>
        <GridContainer>
          <MainContent>
            <TutorialCard>
              <CardHeader
                title="Welcome"
                linkText='↺ Reset to Intro'
                linkUrl='/introduction/1'
                backText='← Back to DPP'
                backUrl='/explore-freely'
                canGoBack={true} />
              <TutorialScrollContainer isRecap={true}>
                <IntroSlideContainer>
                  <RecapSlideManager currentSlide={currentSlide} />
                </IntroSlideContainer>
              </TutorialScrollContainer>
            </TutorialCard>
          </MainContent>
        </GridContainer>
      </Main>

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
