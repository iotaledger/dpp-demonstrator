'use client';

import React from 'react';
import ImageTextLayout from './ImageTextLayout';
import SlideImage from './SlideImage';
import SlideContent from './SlideContent';
import SlideTitle from './SlideTitle';
import SlideDescription from './SlideDescription';

const IntroSlide3: React.FC = () => {
  return (
    <ImageTextLayout>
      <SlideImage src="/assets/intro/disclaimer.png" alt="Disclaimer" />
      <SlideContent textAlign="left" >
        <SlideTitle size="large">Disclaimer</SlideTitle>
        <SlideDescription>
          This demo is for <strong>reference</strong> and is not a fully-functional or regulation-compliant DPP application. It was built to showcase how IOTA components can <strong>power real-world use cases</strong>, using Digital Product Passports as one example.
        </SlideDescription>
      </SlideContent>
    </ImageTextLayout>
  );
};

export default IntroSlide3;
