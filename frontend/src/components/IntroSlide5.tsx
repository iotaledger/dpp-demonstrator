'use client';

import React from 'react';

import ImageTextLayout from './ImageTextLayout';
import SlideContent from './SlideContent';
import SlideDescription from './SlideDescription';
import SlideImage from './SlideImage';
import SlideTitle from './SlideTitle';

const IntroSlide5: React.FC = () => {
  return (
    <ImageTextLayout pb='pb-20'>
      <SlideImage
        src='/assets/intro/passport.webp'
        alt='Introducing the Digital Product Passport (DPP)'
      />

      <SlideContent textAlign='left'>
        <SlideTitle size='large'>Introducing the Digital Product Passport (DPP)</SlideTitle>
        <SlideDescription>
          A DPP is a <strong>digital record</strong> that tracks a product throughout its entire
          lifecycle – from design to recycling. It is linked to a <strong>unique product ID</strong>
          , stores specifications, repairs, material data, compliance info, and more, and is soon to
          be <strong>required by EU regulation</strong> for many products. It transforms scattered
          data into a <strong>trusted and permanent record.</strong>
        </SlideDescription>
      </SlideContent>
    </ImageTextLayout>
  );
};

export default IntroSlide5;
