'use client';

import { useParams } from 'next/navigation';

import CardHeader from '@/components/CardHeader';
import GridContainer from '@/components/GridContainer';
import IntroSlide from '@/components/IntroSlide';
import IntroSlideManager, { SLIDES_MAP } from '@/components/IntroSlideManager';
import Main from '@/components/Main';
import MainContent from '@/components/MainContent';
import NavigationButtons from '@/components/NavigationButtons';
import NavigationHint from '@/components/NavigationHint';
import ProgressBar from '@/components/ProgressBar';
import SlideCounter from '@/components/SlideCounter';
import TutorialCard from '@/components/TutorialCard';
import TutorialScrollContainer from '@/components/TutorialScrollContainer';
import { useSlideNavigation } from '@/hooks/useSlideNavigation';
import { INTRODUCTION_NAVIGATION } from '@/contents/introduction';

export default function IntroductionPage() {
  const { slide: slideParam } = useParams();
  const { currentSlide, totalSlides, canGoNext, canGoPrevious, progress, goNext, goPrevious } =
    useSlideNavigation(getSlide(slideParam), SLIDES_MAP.size, getPathCallback);

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
    return `/introduction/${targetSlide}`;
  }

  return (
    <>
      {/* Main Content */}
      <Main>
        <GridContainer>
          <MainContent>
            <TutorialCard>
              <CardHeader
                title={INTRODUCTION_NAVIGATION.content.title}
                linkText={INTRODUCTION_NAVIGATION.content.linkText}
                linkUrl={INTRODUCTION_NAVIGATION.navigation.linkUrl}
                backUrl={INTRODUCTION_NAVIGATION.navigation.backUrl}
                canGoBack={canGoPrevious}
              />
              <TutorialScrollContainer>
                <IntroSlide>
                  <IntroSlideManager currentSlide={currentSlide} />
                </IntroSlide>
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

      <NavigationHint opacity={100} delay={0.5} />
    </>
  );
}
