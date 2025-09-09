import React from 'react';

import VideoSection from './VideoSection';
import BackgroundVideo from './BackgroundVideo';
import OverlayText from './OverlayText';
import FeaturesGrid from './FeaturesGrid';
import FeatureCard from './FeatureCard';

const IntroSlide1: React.FC = () => {
  return (
    <>
      {/* Video Section */}
      <VideoSection>
        <BackgroundVideo
          src="/assets/intro/placeholder-video.mp4"
          poster="/assets/intro/placeholder-poster.jpg"
        />
        <OverlayText
          welcomeText="Welcome to this"
          title="IOTA Product Demo"
          description="In this guided experience you will..."
          opacity={100}
          translateY={0}
        />
      </VideoSection>
    </>
  );
}

export default IntroSlide1;
