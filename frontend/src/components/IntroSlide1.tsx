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

      {/* Features Grid */}
      <FeaturesGrid>
        <FeatureCard
          image="/assets/intro/slide_1_service.webp"
          alt="Step into the role of a Service Technician following an e-bike battery along a part of its life cycle."
          title="Step into the role of a Service Technician following an e-bike battery along a part of its life cycle."
          description=""
          opacity={100}
          translateY={0}
          delay={0.35}
          variant="default"
        />

        <FeatureCard
          image="/assets/intro/slide_1_rewards.webp"
          alt="Review information and collect a service record, receive rewards, and contribute to circularity."
          title="Review information and collect a service record, receive rewards, and contribute to circularity."
          description=""
          opacity={100}
          translateY={0}
          delay={0.45}
          variant="default"
        />

        <FeatureCard
          image="/assets/intro/slide_1_dpp.webp"
          alt="All via a Digital Product Passport. Powered by IOTA's public infra and the IOTA Trust Framework."
          title="All via a Digital Product Passport. Powered by IOTA's public infra and the IOTA Trust Framework."
          description=""
          opacity={100}
          translateY={0}
          delay={0.55}
          colSpan="col-span-1 sm:col-span-1"
          variant="default"
        />
      </FeaturesGrid>
    </>
  );
}

export default IntroSlide1;
