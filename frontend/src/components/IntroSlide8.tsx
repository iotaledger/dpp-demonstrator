'use client';

import React from 'react';

import { INTRO_SLIDE_8 } from '@/contents/introduction';
import ImageTextLayout from './ImageTextLayout';
import SlideContent from './SlideContent';
import SlideDescription from './SlideDescription';
import SlideImage from './SlideImage';
import SlideTitle from './SlideTitle';

const IntroSlide8: React.FC = () => {
  return (
    <ImageTextLayout>
      <SlideImage src={INTRO_SLIDE_8.image.src} alt={INTRO_SLIDE_8.image.alt} />

      <SlideContent textAlign='left'>
        <SlideTitle size='large'>{INTRO_SLIDE_8.content.title}</SlideTitle>
        <SlideDescription>
          {INTRO_SLIDE_8.content.description}
        </SlideDescription>
      </SlideContent>
    </ImageTextLayout>
  );
};

export default IntroSlide8;
