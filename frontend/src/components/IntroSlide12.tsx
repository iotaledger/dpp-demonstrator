'use client';

import React from 'react';
import Link from 'next/link';
import ImageTextLayout from './ImageTextLayout';
import SlideImage from './SlideImage';
import SlideContent from './SlideContent';
import SlideTitle from './SlideTitle';
import SlideDescription from './SlideDescription';

const IntroSlide12: React.FC = () => {
  return (
    <ImageTextLayout>
      <SlideImage src='/assets/intro/dapp.webp' alt='DPP - Launch Now' />
      <SlideContent textAlign='left'>
        <SlideTitle size='large'>Ready to Begin?</SlideTitle>
        <SlideDescription>
          <span>{'Click to start the guided demo as a Service Technician!'}</span>
        </SlideDescription>

        <div className='py-6 flex flex-col md:flex-row gap-6 items-center'>
          {/** For everything else not mobile */}
          <Link
            className='pointer-coarse:hidden w-fit bg-blue-600 text-white hover:bg-blue-700 px-8 py-4 rounded-full text-lg font-medium transition-all cursor-pointer duration-300  hover:shadow-lg transform hover:scale-102'
            href={'/explore-guided'}
            target='_self'
          >
            {'Start Tour'}
          </Link>
          {/** For mobile */}
          <Link
            className='not-pointer-coarse:hidden nw-fit bg-blue-600 text-white hover:bg-blue-700 px-8 py-4 rounded-full text-lg font-medium transition-all cursor-pointer duration-300  hover:shadow-lg transform hover:scale-102'
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
