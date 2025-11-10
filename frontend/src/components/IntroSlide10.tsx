'use client';

import React from 'react';

import { INTRO_SLIDE_10 } from '@/contents/introduction';

import FeaturesGrid from './FeaturesGrid';
import ProcessCard from './ProcessCard';
import SlideDescription from './SlideDescription';
import SlideTitle from './SlideTitle';

const IntroSlide10: React.FC = () => {
  return (
    <div className='mx-auto w-full max-w-6xl py-6 sm:py-0 md:px-0'>
      <div className='mb-8 max-w-5xl pt-6 md:pt-0'>
        <SlideTitle size='large' margin='mb-4'>
          {INTRO_SLIDE_10.content.title}
        </SlideTitle>
        <SlideDescription margin='mb-2' width='max-w-5xl'>
          <span
            dangerouslySetInnerHTML={{
              __html: INTRO_SLIDE_10.content.description,
            }}
          />
        </SlideDescription>
      </div>

      <FeaturesGrid
        columns='grid-cols-1 sm:grid-cols-[1fr_1fr_1fr_1fr]'
        width='max-w-6xl'
        gap='gap-10'
        pb='pb-20'
      >
        {INTRO_SLIDE_10.content.processes.map((process, index) => (
          <ProcessCard
            key={index}
            icon={process.icon}
            title={process.title}
            description={process.description}
          />
        ))}
      </FeaturesGrid>
    </div>
  );
};

export default IntroSlide10;
