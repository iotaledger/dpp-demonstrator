'use client';

import React from 'react';

import { INTRO_SLIDE_1 } from '@/contents/introduction';

import BackgroundVideo from './BackgroundVideo';
import OverlayText from './OverlayText';
import VideoSection from './VideoSection';

const IntroSlide1: React.FC = () => {
  return (
    <>
      {/* Video Section */}
      <VideoSection>
        <BackgroundVideo src={INTRO_SLIDE_1.video.src} poster={INTRO_SLIDE_1.video.poster} />
        <OverlayText
          welcomeText={INTRO_SLIDE_1.content.welcomeText}
          title={INTRO_SLIDE_1.content.title}
          description={
            <span
              dangerouslySetInnerHTML={{
                __html: INTRO_SLIDE_1.content.description,
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
