import React from 'react';
import ImageTextLayout from './ImageTextLayout';
import SlideImage from './SlideImage';
import SlideContent from './SlideContent';
import SlideTitle from './SlideTitle';
import SlideDescription from './SlideDescription';
import ActionButtons from './ActionButtons';

interface Slide10Props {
  onExploreFree?: () => void;
  onStartGuidedTour?: () => void;
}

const Slide10: React.FC<Slide10Props> = ({
  onExploreFree,
  onStartGuidedTour
}) => {
  const handleExploreFree = () => {
    if (onExploreFree) {
      onExploreFree();
    }
  };

  const handleStartGuidedTour = () => {
    if (onStartGuidedTour) {
      onStartGuidedTour();
    }
  };

  return (
    <ImageTextLayout gap="gap-12">
      <SlideImage 
        src="/assets/intro/dapp.webp" 
        alt="Let's step into the dApp"
        opacity={100}
        scale={100}
        delay={0.15}
      />
      
      <SlideContent 
        textAlign="left"
        order="order-1 md:order-2"
        opacity={100}
        translateY={0}
        translateX={0}
        delay={0.25}
      >
        <div className="pt-6 md:pt-0">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-medium mb-6 leading-tight">
            Let's step into the dApp
          </h2>
          <SlideDescription>
            See how verifiable lifecycle data is recorded, shared, and rewarded.
          </SlideDescription>
          
          <ActionButtons
            primaryButton={{
              text: "Start Guided Tour",
              onClick: handleStartGuidedTour,
              variant: "primary"
            }}
            secondaryButton={{
              text: "Explore Freely",
              onClick: handleExploreFree,
              variant: "secondary"
            }}
          />
        </div>
      </SlideContent>
    </ImageTextLayout>
  );
};

export default Slide10;