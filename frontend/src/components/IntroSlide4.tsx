'use client';

import React from 'react';

import ImageTextLayout from './ImageTextLayout';
import SlideContent from './SlideContent';
import SlideDescription from './SlideDescription';
import SlideImage from './SlideImage';
import SlideTitle from './SlideTitle';

const IntroSlide4: React.FC = () => {
  return (
    <ImageTextLayout>
      <SlideImage src='/assets/intro/map.webp' alt="Products Move, Data Doesn't" />

      <SlideContent textAlign='left'>
        <SlideTitle size='large'>{"Products Move, Data Doesn't"}</SlideTitle>
        <SlideDescription>
          Lifecycle data often gets <strong>trapped in silos</strong>, lost along the product
          journey, or duplicated. Without incentives to share data, stakeholders{' '}
          <strong>hold onto information</strong>, creating gaps in trust, compliance, and
          sustainability.
        </SlideDescription>
      </SlideContent>
    </ImageTextLayout>
  );
};

export default IntroSlide4;
