import React from 'react';
import ImageTextLayout from './ImageTextLayout';
import SlideImage from './SlideImage';
import SlideContent from './SlideContent';
import SlideTitle from './SlideTitle';
import SlideDescription from './SlideDescription';

const Slide6: React.FC = () => {
  return (
    <ImageTextLayout>
      <SlideImage 
        src="/assets/intro/help.webp" 
        alt="How IOTA Helps"
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
        <SlideTitle size="large">How IOTA Helps</SlideTitle>
        <SlideDescription>
          IOTA provides a global, public, and permissionless ledger for moving 
          products, where records are immutable, cryptographically verifiable, 
          persist beyond any single company, and enable transparent incentive 
          distribution.
        </SlideDescription>
      </SlideContent>
    </ImageTextLayout>
  );
};

export default Slide6;