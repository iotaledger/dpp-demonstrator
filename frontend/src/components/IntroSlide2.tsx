import React from 'react';
import ImageTextLayout from './ImageTextLayout';
import SlideImage from './SlideImage';
import SlideContent from './SlideContent';
import SlideTitle from './SlideTitle';
import SlideDescription from './SlideDescription';

const IntroSlide2: React.FC = () => {
  return (
    <ImageTextLayout>
      <SlideImage
        src="/assets/intro/disclaimer.webp"
        alt="Disclaimer"
      />

      <SlideContent
        textAlign="left"
      >
        <SlideTitle size="large">Disclaimer</SlideTitle>
        <SlideDescription>
          {"This demo is a reference implementation, not a fully-functional or regulation-compliant DPP application. It was built to showcase how IOTA's components can power real-world use cases, using Digital Product Passports as one example."}
        </SlideDescription>
      </SlideContent>
    </ImageTextLayout>
  );
};

export default IntroSlide2;
