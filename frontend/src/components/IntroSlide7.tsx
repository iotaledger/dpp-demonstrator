import React from 'react';

import SlideTitle from './SlideTitle';
import SlideDescription from './SlideDescription';
import ImageTextLayout from './ImageTextLayout';
import SlideImage from './SlideImage';
import SlideContent from './SlideContent';

const IntroSlide7: React.FC = () => {
  return (
    <ImageTextLayout>
      <SlideImage
        src="/assets/intro/passport.webp"
        alt="What is a Digital Product Passport?"
      />

      <SlideContent
        textAlign="left"
      >
        <SlideTitle size="large">How IOTA Helps</SlideTitle>
        <SlideDescription>
          IOTA provides the trusted digital backbone for use cases like Digital Product Passports. At its core is a global, public network where data is permanent, verifiable, and not controlled by any single company
        </SlideDescription>
      </SlideContent>
    </ImageTextLayout>
  );
};

export default IntroSlide7;
