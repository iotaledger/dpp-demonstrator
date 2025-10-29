'use client';

import React from 'react';
import VideoSection from './VideoSection';
import BackgroundVideo from './BackgroundVideo';
import OverlayText from './OverlayText';

const IntroSlide1: React.FC = () => {
  return (
    <>
      {/* Video Section */}
      <VideoSection>
        <BackgroundVideo
          src='/assets/intro/placeholder-video.mp4'
          poster='/assets/intro/placeholder-poster.jpg'
        />
        <OverlayText
          welcomeText='Welcome to the'
          title='IOTA Product Demo'
          description={
            <span
              dangerouslySetInnerHTML={{
                __html:
                  'Imagine a product traveling through its entire lifecycle – from manufacturing to repairs, resale, and recycling. How can we ensure <strong>data about the product is trustworthy, complete, and accessible?</strong>',
              }}
            />
          }
          opacity={100}
          translateY={0}
        />
      </VideoSection>
    </>
  );
};

export default IntroSlide1;
