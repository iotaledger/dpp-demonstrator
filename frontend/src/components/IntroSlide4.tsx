import React from 'react';
import ImageTextLayout from './ImageTextLayout';
import SlideImage from './SlideImage';
import SlideContent from './SlideContent';
import SlideTitle from './SlideTitle';
import SlideDescription from './SlideDescription';

const IntroSlide4: React.FC = () => {
  return (
    <ImageTextLayout>
      <SlideImage
        src="/assets/intro/passport.webp"
        alt="What is a Digital Product Passport?"
      />

      <SlideContent
        textAlign="left"
      >
        <SlideTitle size="large">What is a Digital Product Passport?</SlideTitle>
        <SlideDescription>
          A Digital Product Passport is a portable, tamper-evident data record,
          linked to a verifiable product identity, that stores standardised
          specifications, lifecycle and compliance events, and can be selectively
          accessed by authorised stakeholders across its life cycle.
        </SlideDescription>
      </SlideContent>
    </ImageTextLayout>
  );
};

export default IntroSlide4;
