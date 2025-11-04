'use client';

import React, { useEffect, useEffectEvent } from 'react';
import { useParams } from 'next/navigation';

import { useDisconnectWallet } from '@iota/dapp-kit';

import CardHeader from '@/components/CardHeader';
import GridContainer from '@/components/GridContainer';
import IntroSlideContainer from '@/components/IntroSlideContainer';
import Main from '@/components/Main';
import MainContent from '@/components/MainContent';
import NavigationButtons from '@/components/NavigationButtons';
import ProgressBar from '@/components/ProgressBar';
import RecapSlideManager, { RECAP_SLIDES_MAP } from '@/components/RecapSlideManager';
import SlideCounter from '@/components/SlideCounter';
import TutorialCard from '@/components/TutorialCard';
import TutorialScrollContainer from '@/components/TutorialScrollContainer';
import { useSlideNavigation } from '@/hooks/useSlideNavigation';

export default function PostExperiencePage() {
  const { slide: slideParam } = useParams();
  const { currentSlide, totalSlides, canGoNext, canGoPrevious, progress, goNext, goPrevious } =
    useSlideNavigation(getSlide(slideParam), RECAP_SLIDES_MAP.size, getPathCallback);
  const { mutateAsync } = useDisconnectWallet();

  const onNext = useEffectEvent(() => {
    goNext();
  });
  const onPrevious = useEffectEvent(() => {
    goPrevious();
  });

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
          if (canGoPrevious) onPrevious();
          break;
        case 'ArrowRight':
          event.preventDefault();
          if (canGoNext) onNext();
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
