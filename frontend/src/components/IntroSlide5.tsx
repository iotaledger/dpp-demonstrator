import React from 'react';
import ImageTextLayout from './ImageTextLayout';
import SlideImage from './SlideImage';
import SlideContent from './SlideContent';
import SlideTitle from './SlideTitle';
import SlideDescription from './SlideDescription';

const IntroSlide5: React.FC = () => {
  return (
    <ImageTextLayout>
      <SlideImage
        src="/assets/intro/passport.webp"
        alt="Introducing the Digital Product Passport (DPP)"
      />

      <SlideContent
        textAlign="left"
      >
        <SlideTitle size="large">Introducing the Digital Product Passport (DPP)</SlideTitle>
        <SlideDescription>
          A DPP is a <strong>digital record</strong>that tracks a product throughout its entire life cycle – from design to recycling. It is linked to a <strong>unique product ID</strong>, stores specifications, repairs, material data, compliance info, and more, and is soon to be <strong>required by EU regulation</strong>for many products.  It transforms scattered data into <strong>trusted; permanent record.</strong>
        </SlideDescription>
      </SlideContent>
    </ImageTextLayout>
  );
};

export default IntroSlide5
