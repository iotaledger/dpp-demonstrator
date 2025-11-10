'use client';

import React from 'react';

import { INTRO_SLIDE_3 } from '@/contents/introduction';

import ImageTextLayout from './ImageTextLayout';
import SlideContent from './SlideContent';
import SlideDescription from './SlideDescription';
import SlideImage from './SlideImage';
import SlideTitle from './SlideTitle';

const IntroSlide3: React.FC = () => {
  return (
    <ImageTextLayout>
      <SlideImage src={INTRO_SLIDE_3.image.src} alt={INTRO_SLIDE_3.image.alt} />
      <SlideContent textAlign='left'>
        <SlideTitle size='large'>{INTRO_SLIDE_3.content.title}</SlideTitle>
        <SlideDescription>
          <span
            dangerouslySetInnerHTML={{
              __html: INTRO_SLIDE_3.content.description,
            }}
          />
        </SlideDescription>
      </SlideContent>
    </ImageTextLayout>
  );
};

export default IntroSlide3;
