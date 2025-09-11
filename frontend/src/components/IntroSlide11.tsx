import React from 'react';
import ImageTextLayout from './ImageTextLayout';
import SlideImage from './SlideImage';
import SlideContent from './SlideContent';
import SlideTitle from './SlideTitle';
import SlideDescription from './SlideDescription';
import ActionButtons from './ActionButtons';

const IntroSlide11: React.FC = () => {
  const handleStartGuidedTour = () => {
    // TODO: navigate to guided-tour page
  };

  return (
    <ImageTextLayout>
      <SlideImage
        src="/assets/intro/dapp.webp"
        alt="Let's step into the dApp"
      />
      <SlideContent
        textAlign="left"
      >
        <SlideTitle size="large">Ready? Enter the Demo</SlideTitle>
        <SlideDescription>
          See how verifiable lifecycle data is recorded, shared, and rewarded.
        </SlideDescription>
        <ActionButtons
          primaryButton={{
            text: "Start Tour",
            onClick: handleStartGuidedTour,
            variant: "primary"
          }}
        />
      </SlideContent>
    </ImageTextLayout>
  );
};

export default IntroSlide11;
