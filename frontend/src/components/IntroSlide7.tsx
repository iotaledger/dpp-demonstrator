'use client';

import React from 'react';

import { EnumerationItem, EnumerationSection } from './Enumeration';
import ImageTextLayout from './ImageTextLayout';
import SlideContent from './SlideContent';
import SlideDescription from './SlideDescription';
import SlideImage from './SlideImage';
import SlideTitle from './SlideTitle';

const IntroSlide7: React.FC = () => {
  return (
    <>
      <ImageTextLayout maxWidth='max-w-5xl'>
        <SlideImage src='/assets/intro/pool-players.webp' alt='Solving the Data-Sharing Problem' />
        <SlideContent textAlign='left'>
          <SlideTitle size='large'>Solving the Data-Sharing Problem</SlideTitle>
          <SlideDescription>
            Lifecycle data is fragmented and rarely shared, making it hard to track. To solve this,
            each DPP can be pre-funded with Lifecycle Credits (LCCs), tokens that reward verified
            data contributions and are redeemable for real-world value.
          </SlideDescription>
        </SlideContent>
      </ImageTextLayout>

      <EnumerationSection>
        <EnumerationItem
          description={
            'Manufacturers provide fiat funds to the EPRO, ensuring reward pools are backed with real-world value'
          }
        />
        <EnumerationItem
          description={
            'Manufacturers build the product, create its DPP, and pre-fund it with Lifecycle Credits (LCCs)'
          }
        />
        <EnumerationItem
          description={
            'EPROs define the LCC allocation for each DPP, and service providers earn these credits automatically when documenting repairs or maintenance'
          }
        />
        <EnumerationItem
          description={
            'Service providers send their earned LCC tokens back to the EPRO for redemption'
          }
        />
        <EnumerationItem
          description={
            'The EPRO processes redemption, converting LCCs back into fiat and closing the economic loop'
          }
        />
      </EnumerationSection>
    </>
  );
};

export default IntroSlide7;
