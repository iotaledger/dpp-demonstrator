/**
 * Copyright (c) IOTA Stiftung
 * SPDX-License-Identifier: Apache-2.0
 */

'use client';

import React from 'react';

import { INTRO_SLIDE_5 } from '@/contents/introduction';

import ImageTextLayout from './ImageTextLayout';
import SlideContent from './SlideContent';
import SlideDescription from './SlideDescription';
import SlideImage from './SlideImage';
import SlideTitle from './SlideTitle';

const IntroSlide5: React.FC = () => {
  return (
    <ImageTextLayout pb='pb-20'>
      <SlideImage src={INTRO_SLIDE_5.image.src} alt={INTRO_SLIDE_5.image.alt} />

      <SlideContent textAlign='left'>
        <SlideTitle size='large'>{INTRO_SLIDE_5.content.title}</SlideTitle>
        <SlideDescription>
          <span
            dangerouslySetInnerHTML={{
              __html: INTRO_SLIDE_5.content.description,
            }}
          />
        </SlideDescription>
      </SlideContent>
    </ImageTextLayout>
  );
};

export default IntroSlide5;
