'use client';

import React from 'react';
import ImageTextLayout from './ImageTextLayout';
import SlideImage from './SlideImage';
import SlideContent from './SlideContent';
import SlideTitle from './SlideTitle';
import SlideDescription from './SlideDescription';
import ActionButtons from './ActionButtons';
import { useRouter } from 'next/navigation';

const IntroSlide12: React.FC = () => {
  const router = useRouter();

  const handleStartGuidedTour = () => {
    router.push('/explore-guided');
  };

  return (
    <ImageTextLayout>
      <SlideImage
        src="/assets/intro/dapp.webp"
        alt="DPP - Launch Now"
      />
      <SlideContent
        textAlign="left"
      >
        <SlideTitle size="large">Ready to Begin?</SlideTitle>
        <SlideDescription>Click to start the guided demo as a Service Technician!</SlideDescription>
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

export default IntroSlide12;
