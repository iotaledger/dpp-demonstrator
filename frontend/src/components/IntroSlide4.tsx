/**
 * Copyright (c) IOTA Stiftung
 * SPDX-License-Identifier: Apache-2.0
 */

'use client';

import React from 'react';

import { INTRO_SLIDE_4 } from '@/contents/introduction';

import ImageTextLayout from './ImageTextLayout';
import SlideContent from './SlideContent';
import SlideDescription from './SlideDescription';
import SlideImage from './SlideImage';
import SlideTitle from './SlideTitle';

const IntroSlide4: React.FC = () => {
  return (
    <ImageTextLayout>
      <SlideImage src={INTRO_SLIDE_4.image.src} alt={INTRO_SLIDE_4.image.alt} />

      <SlideContent textAlign='left'>
        <SlideTitle size='large'>{INTRO_SLIDE_4.content.title}</SlideTitle>
        <SlideDescription>
          <span
            dangerouslySetInnerHTML={{
              __html: INTRO_SLIDE_4.content.description,
            }}
          />
        </SlideDescription>
      </SlideContent>
    </ImageTextLayout>
  );
};

export default IntroSlide4;
