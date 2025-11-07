'use client';

import React from 'react';

import { INTRO_SLIDE_7 } from '@/contents/introduction';
import { EnumerationItem, EnumerationSection } from './Enumeration';
import ImageTextLayout from './ImageTextLayout';
import SlideContent from './SlideContent';
import SlideDescription from './SlideDescription';
import SlideImage from './SlideImage';
import SlideTitle from './SlideTitle';

const IntroSlide7: React.FC = () => {
  return (
    <>
      <ImageTextLayout maxWidth='max-w-5xl'>
        <SlideImage src={INTRO_SLIDE_7.image.src} alt={INTRO_SLIDE_7.image.alt} />
        <SlideContent textAlign='left'>
          <SlideTitle size='large'>{INTRO_SLIDE_7.content.title}</SlideTitle>
          <SlideDescription>
            {INTRO_SLIDE_7.content.description}
          </SlideDescription>
        </SlideContent>
      </ImageTextLayout>

      <EnumerationSection>
        {INTRO_SLIDE_7.content.steps.map((step, index) => (
          <EnumerationItem
            key={index}
            description={step}
          />
        ))}
      </EnumerationSection>
    </>
  );
};

export default IntroSlide7;
