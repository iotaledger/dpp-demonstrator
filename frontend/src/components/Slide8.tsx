import React from 'react';
import ImageTextLayout from './ImageTextLayout';
import SlideImage from './SlideImage';
import SlideContent from './SlideContent';
import SlideTitle from './SlideTitle';
import SlideDescription from './SlideDescription';

const Slide8: React.FC = () => {
  return (
    <ImageTextLayout>
      <SlideImage 
        src="/assets/intro/misson.webp" 
        alt="Your Mission"
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
        <SlideTitle size="large">Your Mission</SlideTitle>
        <SlideDescription>
          You will step into the shoes of a service technician. Scan the product, 
          review previous data, request write access, perform a diagnostic, write a 
          health snapshot to the Digital Product Passport, and collect a token reward. 
          Before you can do that, we need to make sure your wallet is set up correctly 
          and you are good to go.
        </SlideDescription>
      </SlideContent>
    </ImageTextLayout>
  );
};

export default Slide8;