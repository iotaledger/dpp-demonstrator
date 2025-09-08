'use client';

import React from 'react';

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

const TutorialLayout: React.FC<React.PropsWithChildren> = ({ children }) => {
  const [currentSlide, setCurrentSlide] = React.useState(1);
  const [totalSlides] = React.useState(10);

  const handlePrevious = () => {
    if (currentSlide > 1) {
      setCurrentSlide(prev => prev - 1);
    }
  };

  const handleNext = () => {
    if (currentSlide < totalSlides) {
      setCurrentSlide(prev => prev + 1);
    }
  };

  const canGoPrevious = currentSlide > 1;
  const canGoNext = currentSlide < totalSlides;
  const progress = (currentSlide / totalSlides) * 100;

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
                  {children}
                </IntroSlide>
              </TutorialScrollContainer>
            </TutorialCard>
          </MainContent>
          {/* Empty divs for grid layout */}
          <div className="w-0"></div>
          <div className="w-0"></div>
        </GridContainer>
      </Main>
      {/* Navigation Overlays */}
      <ProgressBar progress={progress} />

      <SlideCounter
        current={currentSlide}
        total={totalSlides}
      />

      <NavigationButtons
        onPrevious={handlePrevious}
        onNext={handleNext}
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

export default TutorialLayout;
