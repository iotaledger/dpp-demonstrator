/**
 * Copyright (c) IOTA Stiftung
 * SPDX-License-Identifier: Apache-2.0
 */

'use client';

import React from 'react';
import Link from 'next/link';

import { INTRO_SLIDE_11 } from '@/contents/introduction';
import { replaceComponents } from '@/utils/common';

import ClientCard from './ClientCard';
import FeaturesGrid from './FeaturesGrid';
import LinkOutIcon from './icons/LinkOutIcon';
import NoticeCard from './NoticeCard';
import SlideDescription from './SlideDescription';
import SlideTitle from './SlideTitle';

const IntroSlide11: React.FC = () => {
  return (
    <div className='mx-auto flex w-full max-w-6xl flex-col items-center py-6 sm:py-0 md:px-0'>
      <div className='mb-8 flex max-w-3xl flex-col items-center pt-6 md:pt-0'>
        <SlideTitle size='large'>{INTRO_SLIDE_11.content.title}</SlideTitle>
        <SlideDescription margin='mb-2' width='max-w-4xl'>
          {INTRO_SLIDE_11.content.description}
        </SlideDescription>
      </div>

      <FeaturesGrid columns='sm:grid-cols-2' width='max-w-6xl' gap='gap-10' pb='pb-20'>
        <ClientCard
          image={INTRO_SLIDE_11.content.walletOptions[0].image}
          alt={INTRO_SLIDE_11.content.walletOptions[0].alt}
          title={INTRO_SLIDE_11.content.walletOptions[0].title}
          description={
            <>
              {replaceComponents(INTRO_SLIDE_11.content.walletOptions[0].installText, [
                <Link
                  key={'desktop-link'}
                  className='inline text-blue-700 italic'
                  target='_blank'
                  href={INTRO_SLIDE_11.content.walletOptions[0].desktopUrl as string}
                >
                  {INTRO_SLIDE_11.content.walletOptions[0].desktopText} <LinkOutIcon />
                </Link>,
              ])}
              <br />
              {INTRO_SLIDE_11.content.walletOptions[0].testnetNotice}
            </>
          }
          opacity={100}
          translateY={0}
          delay={0.25}
        />

        <ClientCard
          image={INTRO_SLIDE_11.content.walletOptions[1].image}
          alt={INTRO_SLIDE_11.content.walletOptions[1].alt}
          title={INTRO_SLIDE_11.content.walletOptions[1].title}
          description={
            <>
              {replaceComponents(INTRO_SLIDE_11.content.walletOptions[1].installText, [
                <Link
                  key={'ios-link'}
                  className='inline text-blue-700 italic'
                  target='_blank'
                  href={INTRO_SLIDE_11.content.walletOptions[1].iosUrl as string}
                >
                  {INTRO_SLIDE_11.content.walletOptions[1].iosText} <LinkOutIcon />
                </Link>,
                <Link
                  key={'android-link'}
                  className='inline text-blue-700 italic'
                  target='_blank'
                  href={INTRO_SLIDE_11.content.walletOptions[1].androidUrl as string}
                >
                  {INTRO_SLIDE_11.content.walletOptions[1].androidText} <LinkOutIcon />
                </Link>,
              ])}
              <br />
              {INTRO_SLIDE_11.content.walletOptions[1].testnetNotice}
            </>
          }
          opacity={100}
          translateY={0}
          delay={0.35}
        />

        <NoticeCard
          background='bg-[#ADCEFF]'
          colSpan='col-span-1 sm:col-span-2'
          delay={0.55}
          opacity={100}
          translateY={0}
        >
          <div className='text-black/80'>
            <h4 className='text-base md:text-xl'>{INTRO_SLIDE_11.content.notice.text}</h4>
          </div>
        </NoticeCard>
      </FeaturesGrid>
    </div>
  );
};

export default IntroSlide11;
