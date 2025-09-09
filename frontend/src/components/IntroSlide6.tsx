import React from 'react';
import ImageTextLayout from './ImageTextLayout';
import SlideImage from './SlideImage';
import SlideContent from './SlideContent';
import SlideTitle from './SlideTitle';
import SlideDescription from './SlideDescription';

const IntroSlide6: React.FC = () => {
  return (
    <ImageTextLayout>
      <SlideImage
        src="/assets/intro/help.webp"
        alt="How IOTA Helps"
      />

      <SlideContent
        textAlign="left"
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

export default IntroSlide6;
