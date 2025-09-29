import React from 'react';
import ImageTextLayout from './ImageTextLayout';
import SlideImage from './SlideImage';
import SlideContent from './SlideContent';
import SlideTitle from './SlideTitle';
import SlideDescription from './SlideDescription';
import FeaturesGrid from './FeaturesGrid';
import LeanFeatureCard from './LeanFeatureCard';

const IntroSlide6: React.FC = () => {
  return (
    <>
      <ImageTextLayout maxWidth='max-w-5xl'>
        <SlideImage
          width='w-full max-w-xl'
          height='h-full'
          src="/assets/intro/key-players.png"
          alt="Key Players in the DPP ecosystem"
        />
        <SlideContent textAlign="left">
          <SlideTitle size="large">Key Players in the DPP ecosystem</SlideTitle>
          <SlideDescription>These are the key players in a minimal product lifecycle, each interacting with the Digital Product Passport at different stages.</SlideDescription>
        </SlideContent>
      </ImageTextLayout>

      <FeaturesGrid>
        <LeanFeatureCard
          title='Manufacturers'
          description='Design and produce goods, adding material, sustainability, and compliance data to the DPP.'
        />
        <LeanFeatureCard
          title='Distributors'
          description='Handle product logistics and market delivery, updating the DPP with tracking, certification, and transport data.'
        />
        <LeanFeatureCard
          title='Consumers'
          description='Purchase and use products, consulting the DPP for origin, sustainability, and repair options.'
        />
        <LeanFeatureCard
          title='Service Providers'
          description='Offer repair, maintenance, and upgrades, relying on the DPP for product history and part details.'
        />
        <LeanFeatureCard
          title='Recyclers'
          description='Process end-of-life products, using the DPP to identify materials and improve recovery.'
        />
        <LeanFeatureCard
          title='Extended Producer Responsibility Organizations (EPRO)'
          description='Support manufacturers in end-of-life obligations and oversee recycling & compliance.'
        />
      </FeaturesGrid>
    </>
  );
};

export default IntroSlide6;
