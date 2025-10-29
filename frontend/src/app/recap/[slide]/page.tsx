'use client';

import React, { useEffect } from 'react';
import NavigationButtons from '@/components/NavigationButtons';
import RecapSlideManager, { RECAP_SLIDES_MAP } from '@/components/RecapSlideManager';
import ProgressBar from '@/components/ProgressBar';
import SlideCounter from '@/components/SlideCounter';
import { useSlideNavigation } from '@/hooks/useSlideNavigation';
import { useParams } from 'next/navigation';
import Main from '@/components/Main';
import GridContainer from '@/components/GridContainer';
import MainContent from '@/components/MainContent';
import TutorialCard from '@/components/TutorialCard';
import CardHeader from '@/components/CardHeader';
import TutorialScrollContainer from '@/components/TutorialScrollContainer';
import IntroSlideContainer from '@/components/IntroSlideContainer';
import { useDisconnectWallet } from '@iota/dapp-kit';

export default function PostExperiencePage() {
  const { slide: slideParam } = useParams();
  const { currentSlide, totalSlides, canGoNext, canGoPrevious, progress, goNext, goPrevious } =
    useSlideNavigation(getSlide(slideParam), RECAP_SLIDES_MAP.size, getPathCallback);
  const { mutateAsync } = useDisconnectWallet();

  function getSlide(slideParam: string | string[] | undefined) {
    if (
      slideParam != null &&
      !Array.isArray(slideParam) &&
      Number.isInteger(Number.parseInt(slideParam as string))
    ) {
      return Number.parseInt(slideParam as string);
    }
    return 1;
  }

  function getPathCallback(targetSlide: number) {
    return `/recap/${targetSlide}`;
  }

  async function handleBackAction() {
    await mutateAsync();
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
    /* eslint-disable-next-line react-hooks/exhaustive-deps --
     * goPrevious and goNext and functions that didn't change
     */
  }, [currentSlide, canGoPrevious, canGoNext]);

  return (
    <>
      <Main background='bg-slate-100'>
        <GridContainer>
          <MainContent>
            <TutorialCard>
              <CardHeader
                title='Welcome'
                linkText='↺ Reset to Intro'
                linkUrl='/introduction/1'
                backText='← Back to DPP'
                backUrl='/explore-freely'
                onBack={handleBackAction}
                canGoBack={true}
              />
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

      <SlideCounter current={currentSlide} total={totalSlides} />

      <NavigationButtons
        onPrevious={goPrevious}
        onNext={goNext}
        canGoPrevious={canGoPrevious}
        canGoNext={canGoNext}
      />
    </>
  );
}
