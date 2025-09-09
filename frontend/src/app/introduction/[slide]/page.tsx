'use client';

import Header from '@/components/Header';
import HeaderContent from '@/components/HeaderContent';
import Main from '@/components/Main';
import GridContainer from '@/components/GridContainer';
import MainContent from '@/components/MainContent';
import ProgressBar from '@/components/ProgressBar';
import SlideCounter from '@/components/SlideCounter';
import NavigationButtons from '@/components/NavigationButtons';
import NavigationHint from '@/components/NavigationHint';
import TutorialCard from '@/components/TutorialCard';
import CardHeader from '@/components/CardHeader';
import TutorialScrollContainer from '@/components/TutorialScrollContainer';
import IntroSlide from '@/components/IntroSlide';
import IntroSlideManager, { SLIDES_MAP } from '@/components/IntroSlideManager';
import { useParams } from 'next/navigation';
import { useIntroSlideNavigation } from '@/hooks/useIntroSlideNavigation';

export default function IntroductionPage() {
  const { slide: slideParam } = useParams();
  const {
    currentSlide,
    totalSlides,
    canGoNext,
    canGoPrevious,
    progress,
    goNext,
    goPrevious,
  } = useIntroSlideNavigation(getSlide(slideParam), SLIDES_MAP.size, getPathCallback);

  function getSlide(slideParam: string | string[] | undefined) {
    if (slideParam != null && !Array.isArray(slideParam) && Number.isInteger(Number.parseInt(slideParam as string))) {
      return Number.parseInt(slideParam as string);
    }
    return 1;
  };

  function getPathCallback(targetSlide: number) {
    return `/introduction/${targetSlide}`;
  }

  return (
    <>
      {/* Hidden Header */}
      <Header hidden={true}>
        <HeaderContent />
      </Header>

      {/* Main Content */}
      <Main>
        <GridContainer>
          <MainContent>
            <TutorialCard>
              <CardHeader title="Welcome" />
              <TutorialScrollContainer>
                <IntroSlide opacity={100} scale={100}>
                  <IntroSlideManager currentSlide={currentSlide} />
                </IntroSlide>
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

      <NavigationHint
        text="Use arrow keys or click to navigate"
        opacity={100}
        delay={0.5}
      />
    </>
  );
}
