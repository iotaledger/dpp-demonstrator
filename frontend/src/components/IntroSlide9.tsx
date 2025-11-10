'use client';

import React from 'react';

import { INTRO_SLIDE_9 } from '@/contents/introduction';

import FeaturesGrid from './FeaturesGrid';
import ProductCard from './ProductCard';
import SlideDescription from './SlideDescription';
import SlideTitle from './SlideTitle';
import TwoColumnSection from './TwoColumnSection';

const IntroSlide9: React.FC = () => {
  return (
    <div className='mx-auto grid w-full max-w-4xl grid-cols-1 items-center self-center py-6 sm:py-0 md:px-0'>
      <div className='mb-8 max-w-4xl pt-6 md:pt-0'>
        <SlideTitle size='large' margin='mb-4'>
          {INTRO_SLIDE_9.content.title}
        </SlideTitle>
        <SlideDescription margin='mb-2' width='max-w-4xl'>
          <span
            dangerouslySetInnerHTML={{
              __html: INTRO_SLIDE_9.content.description,
            }}
          />
        </SlideDescription>
      </div>

      <TwoColumnSection
        columns='grid-cols-1 lg:grid-cols-[1fr_1fr_1fr] gap-10 max-w-4xl  '
        gap='gap-10'
        leftColumn={
          <div>
            <h3 className='mb-3 text-xl font-medium md:mb-6 md:text-2xl'>
              {INTRO_SLIDE_9.content.sections.trustFramework.title}
            </h3>
            <FeaturesGrid columns='grid-cols-1' gap='gap-4' pb='pb-4'>
              {INTRO_SLIDE_9.content.sections.trustFramework.products.map((product, index) => (
                <ProductCard key={index} icon={product.icon} title={product.title} />
              ))}
            </FeaturesGrid>
          </div>
        }
        rightColumn={
          <div>
            <h3 className='mb-3 text-xl font-medium md:mb-6 md:text-2xl'>
              {INTRO_SLIDE_9.content.sections.servicesAndDapps.title}
            </h3>
            <FeaturesGrid columns='grid-cols-1' gap='gap-4' pb='pb-20'>
              {INTRO_SLIDE_9.content.sections.servicesAndDapps.products.map((product, index) => (
                <ProductCard key={index} icon={product.icon} title={product.title} />
              ))}
            </FeaturesGrid>
          </div>
        }
      />
    </div>
  );
};

export default IntroSlide9;
