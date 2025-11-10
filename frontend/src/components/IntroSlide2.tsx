'use client';

import React from 'react';

import { INTRO_SLIDE_2 } from '@/contents/introduction';

import BackgroundVideo from './BackgroundVideo';
import OverlayText from './OverlayText';
import VideoSection from './VideoSection';

const IntroSlide2: React.FC = () => {
  return (
    <>
      {/* Video Section */}
      <VideoSection>
        <BackgroundVideo src={INTRO_SLIDE_2.video.src} poster={INTRO_SLIDE_2.video.poster} />
        <OverlayText
          description={
            <span
              dangerouslySetInnerHTML={{
                __html: INTRO_SLIDE_2.content.description,
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

export default IntroSlide2;
