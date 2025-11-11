/**
 * Copyright (c) IOTA Stiftung
 * SPDX-License-Identifier: Apache-2.0
 */

'use client';

import React from 'react';
import Link from 'next/link';

import { INTRO_SLIDE_12 } from '@/contents/introduction';

import ImageTextLayout from './ImageTextLayout';
import SlideContent from './SlideContent';
import SlideDescription from './SlideDescription';
import SlideImage from './SlideImage';
import SlideTitle from './SlideTitle';

const IntroSlide12: React.FC = () => {
  return (
    <ImageTextLayout>
      <SlideImage src={INTRO_SLIDE_12.image.src} alt={INTRO_SLIDE_12.image.alt} />
      <SlideContent textAlign='left'>
        <SlideTitle size='large'>{INTRO_SLIDE_12.content.title}</SlideTitle>
        <SlideDescription>
          <span
            dangerouslySetInnerHTML={{
              __html: INTRO_SLIDE_12.content.description,
            }}
          />
        </SlideDescription>

        <div className='flex flex-col items-center gap-6 py-6 md:flex-row'>
          {/** For everything else not mobile */}
          <Link
            className='w-fit transform cursor-pointer rounded-full bg-blue-600 px-8 py-4 text-lg font-medium text-white transition-all duration-300 hover:scale-102 hover:bg-blue-700 hover:shadow-lg pointer-coarse:hidden'
            href={INTRO_SLIDE_12.content.buttons.desktop.href}
            target={INTRO_SLIDE_12.content.buttons.desktop.target}
          >
            {INTRO_SLIDE_12.content.buttons.desktop.text}
          </Link>
          {/** For mobile */}
          <Link
            className='nw-fit transform cursor-pointer rounded-full bg-blue-600 px-8 py-4 text-lg font-medium text-white transition-all duration-300 not-pointer-coarse:hidden hover:scale-102 hover:bg-blue-700 hover:shadow-lg'
            href={INTRO_SLIDE_12.content.buttons.mobile.href}
          >
            {INTRO_SLIDE_12.content.buttons.mobile.text}
          </Link>
        </div>
      </SlideContent>
    </ImageTextLayout>
  );
};

export default IntroSlide12;
