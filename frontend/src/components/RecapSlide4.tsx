'use client';

import React from 'react';

import { RECAP_SLIDE_4 } from '@/contents/recap';

import Contact from './Contact';
import FeatureCard from './FeatureCard';

interface RecapSlide4Props {
  title?: string;
  opacity?: number;
  delay?: number;
}

const RecapSlide4: React.FC<RecapSlide4Props> = ({ opacity = 100, delay = 0.3 }) => {
  const containerStyle = {
    opacity: opacity / 100,
    transform: `translateX(${opacity === 100 ? 0 : 4}px)`,
    transitionDelay: `${delay}s`,
    transition: `opacity 0.8s ease-out, transform 0.8s ease-out`,
  };

  return (
    <div
      className='mx-auto max-h-full max-w-6xl overflow-y-auto p-6 md:p-12'
      style={containerStyle}
    >
      <div className='flex flex-col gap-4'>
        <div className='text-center'>
          <div className='mb-8 text-xl font-medium tracking-[-0.56px] text-gray-900 md:text-2xl lg:text-3xl'>
            <p className='leading-[1.2]'>{RECAP_SLIDE_4.title}</p>
          </div>
        </div>

        {/* Top 2 resource cards in grid */}
        <div className='grid grid-cols-2 gap-4'>
          {RECAP_SLIDE_4.resources.map((card, index) => (
            <FeatureCard
              key={card.title}
              title={card.title}
              description={card.description}
              image={card.image}
              alt={card.title}
              url={card.url}
              opacity={100}
              translateY={0}
              delay={delay + 0.1 + index * 0.1}
            />
          ))}
        </div>

        {/* Full-width business innovation program card */}
        <div>
          <FeatureCard
            title={RECAP_SLIDE_4.businessProgram.title}
            description={RECAP_SLIDE_4.businessProgram.description}
            image={RECAP_SLIDE_4.businessProgram.image}
            alt={RECAP_SLIDE_4.businessProgram.title}
            url={RECAP_SLIDE_4.businessProgram.url}
            titleSize='large'
            contentPosition='center'
            variant='resource'
            layout='horizontal'
            opacity={100}
            translateY={0}
            delay={delay + 0.3}
          />
        </div>

        {/* Contact Section */}
        <Contact email={RECAP_SLIDE_4.contact.email} />
      </div>
    </div>
  );
};

export default RecapSlide4;
