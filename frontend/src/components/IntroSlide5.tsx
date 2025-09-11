import React from 'react';
import ImageTextLayout from './ImageTextLayout';
import SlideImage from './SlideImage';
import SlideContent from './SlideContent';
import SlideTitle from './SlideTitle';
import SlideDescription from './SlideDescription';
import FeaturesGrid from './FeaturesGrid';
import RoleItem from './RoleItem';
import FeatureCard from './FeatureCard';

const IntroSlide5: React.FC = () => {
  return (
    <>
      <ImageTextLayout maxWidth='max-w-5xl'>
        <SlideImage
          width='w-full max-w-xl'
          height='h-full'
          src="/assets/intro/lifecycle.webp"
          alt="The Roles: Benefits and Responsibilities"
        />
        <SlideContent textAlign="left">
          <SlideTitle size="large">The Roles: Benefits and Responsibilities</SlideTitle>
          <SlideDescription>
            Digital Product Passports connect many actors, each with distinct
            responsibilities and potential benefits.
          </SlideDescription>
        </SlideContent>
      </ImageTextLayout>

      <FeaturesGrid>
        <FeatureCard
          title='Manufacturers'
          description='Build products and initially create their DPPs. They pre-fund each DPP with reward credits to ensure their products receive proper care, documentation and end-of-life treatment.'
        />
        <FeatureCard
          title='EPROs'
          description='Extended Producer Responsibility Organizations define how many reward credits manufacturers need to attach to their DPPs, preventing system abuse. They also serve as redemption centers where reward recipients exchange earned credits for real-world value, completing the economic loop.'
        />
        <FeatureCard
          title='Service Providers'
          description="When repair shops document verified service events, smart contracts automatically release Lifecycle Credits from the DPP's reward wallet. These tokens compensate them for extending product life and contributing valuable data"
        />
      </FeaturesGrid>
    </>
  );
};

export default IntroSlide5
