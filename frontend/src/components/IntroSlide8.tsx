'use client';

import React from 'react';
import SlideTitle from './SlideTitle';
import SlideDescription from './SlideDescription';
import ImageTextLayout from './ImageTextLayout';
import SlideImage from './SlideImage';
import SlideContent from './SlideContent';

const IntroSlide8: React.FC = () => {
  return (
    <ImageTextLayout>
      <SlideImage
        src="/assets/intro/help.png"
        alt="A Trusted Digital Backbone"
      />

      <SlideContent
        textAlign="left"
      >
        <SlideTitle size="large">A Trusted Digital Backbone</SlideTitle>
        <SlideDescription>IOTA provides the trusted digital backbone for use cases like Digital Product Passports. At its core is a global, public network where data is permanent, verifiable, and not controlled by any single company.</SlideDescription>
      </SlideContent>
    </ImageTextLayout>
  );
};

export default IntroSlide8;
