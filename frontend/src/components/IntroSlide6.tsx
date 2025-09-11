import React from 'react';
import ImageTextLayout from './ImageTextLayout';
import SlideImage from './SlideImage';
import SlideContent from './SlideContent';
import SlideTitle from './SlideTitle';
import SlideDescription from './SlideDescription';
import FeaturesGrid from './FeaturesGrid';
import FeatureCard from './FeatureCard';

const IntroSlide6: React.FC = () => {
  return (
    <>
      <ImageTextLayout maxWidth='max-w-5xl'>
        <SlideImage
          width='w-full max-w-xl'
          height='h-full'
          src="/assets/intro/help.webp"
          alt="How IOTA Helps"
        />

        <SlideContent textAlign="left">
          <SlideTitle size="large">How IOTA Helps</SlideTitle>
          <SlideDescription>
            IOTA provides a global, public, and permissionless ledger for moving
            products, where records are immutable, cryptographically verifiable,
            persist beyond any single company, and enable transparent incentive
            distribution.
          </SlideDescription>
        </SlideContent>
      </ImageTextLayout>

      <FeaturesGrid>
        <FeatureCard
          title='Consumers'
          description='Purchase products and access their DPPs to view trusted information about materials, history, and repairs. This transparency supports informed choices and maintains resale value.'
        />
        <FeatureCard
          title='Recyclers'
          description='Earn Lifecycle Credits when they properly process products and update the DPP with material recovery data. This incentivizes responsible recycling and provides crucial end-of-life information.'
        />
        <FeatureCard
          title='Regulators'
          description="Use the DPP's permanent audit trail to monitor compliance with environmental laws and verify that manufacturers meet their extended producer responsibilities."
        />
      </FeaturesGrid>
    </>
  );
};

export default IntroSlide6;
