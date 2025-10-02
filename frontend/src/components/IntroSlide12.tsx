'use client';

import React from 'react';
import Link from 'next/link';
import ImageTextLayout from './ImageTextLayout';
import SlideImage from './SlideImage';
import SlideContent from './SlideContent';
import SlideTitle from './SlideTitle';
import SlideDescription from './SlideDescription';
import ActionButtons from './ActionButtons';
import { useRouter } from 'next/navigation';

const IntroSlide12: React.FC = () => {
  const router = useRouter();

  const handleStartGuidedTour = () => {
    router.push('/explore-guided');
  };

  return (
    <ImageTextLayout>
      <SlideImage
        src="/assets/intro/dapp.webp"
        alt="DPP - Launch Now"
      />
      <SlideContent
        textAlign="left"
      >
        <SlideTitle size="large">Ready to Begin?</SlideTitle>
        <SlideDescription>
          <span>{"Click to start the guided demo as a Service Technician!"}</span>
          <Link
            className='not-pointer-coarse:hidden inline italic text-blue-700'
            href={"nightly://v1?network=iota&url=https://dpp.demo.iota.org/explore-guided"}>
            {" "}
            {"If you are in a mobile device, try use the nightly wallet"}
            {" "}
            <svg className='inline align-baseline' xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M15 3h6v6" /><path d="M10 14 21 3" /><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" /></svg>
          </Link>
        </SlideDescription>
        <ActionButtons
          primaryButton={{
            text: "Start Tour",
            onClick: handleStartGuidedTour,
            variant: "primary"
          }}
        />
      </SlideContent>
    </ImageTextLayout>
  );
};

export default IntroSlide12;
