'use client';

import React from 'react';

import { INTRO_SLIDE_6 } from '@/contents/introduction';
import FeaturesGrid from './FeaturesGrid';
import ImageTextLayout from './ImageTextLayout';
import LeanFeatureCard from './LeanFeatureCard';
import SlideContent from './SlideContent';
import SlideDescription from './SlideDescription';
import SlideImage from './SlideImage';
import SlideTitle from './SlideTitle';

const IntroSlide6: React.FC = () => {
  return (
    <>
      <ImageTextLayout maxWidth='max-w-5xl'>
        <SlideImage src={INTRO_SLIDE_6.image.src} alt={INTRO_SLIDE_6.image.alt} />
        <SlideContent textAlign='left'>
          <SlideTitle size='large'>{INTRO_SLIDE_6.content.title}</SlideTitle>
          <SlideDescription>
            {INTRO_SLIDE_6.content.description}
          </SlideDescription>
        </SlideContent>
      </ImageTextLayout>

      <FeaturesGrid pb='pb-24'>
        {INTRO_SLIDE_6.content.players.map((player, index) => (
          <LeanFeatureCard
            key={index}
            title={player.title}
            description={player.description}
          />
        ))}
      </FeaturesGrid>
    </>
  );
};

export default IntroSlide6;
