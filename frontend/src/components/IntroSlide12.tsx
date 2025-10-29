'use client';

import React from 'react';
import Link from 'next/link';

import ImageTextLayout from './ImageTextLayout';
import SlideContent from './SlideContent';
import SlideDescription from './SlideDescription';
import SlideImage from './SlideImage';
import SlideTitle from './SlideTitle';

const IntroSlide12: React.FC = () => {
  return (
    <ImageTextLayout>
      <SlideImage src='/assets/intro/dapp.webp' alt='DPP - Launch Now' />
      <SlideContent textAlign='left'>
        <SlideTitle size='large'>Ready to Begin?</SlideTitle>
        <SlideDescription>
          <span>{'Click to start the guided demo as a Service Technician!'}</span>
        </SlideDescription>

        <div className='flex flex-col items-center gap-6 py-6 md:flex-row'>
          {/** For everything else not mobile */}
          <Link
            className='w-fit transform cursor-pointer rounded-full bg-blue-600 px-8 py-4 text-lg font-medium text-white transition-all duration-300 hover:scale-102 hover:bg-blue-700 hover:shadow-lg pointer-coarse:hidden'
            href={'/explore-guided'}
            target='_self'
          >
            {'Start Tour'}
          </Link>
          {/** For mobile */}
          <Link
            className='nw-fit transform cursor-pointer rounded-full bg-blue-600 px-8 py-4 text-lg font-medium text-white transition-all duration-300 not-pointer-coarse:hidden hover:scale-102 hover:bg-blue-700 hover:shadow-lg'
            href={'nightly://v1?network=iota&url=https://dpp.demo.iota.org/explore-guided'}
          >
            {'Start Tour'}
          </Link>
        </div>
      </SlideContent>
    </ImageTextLayout>
  );
};

export default IntroSlide12;
