'use client';

import React from 'react';

import FeatureCard from './FeatureCard';
import WebIcon from './icons/WebIcon';
import CopiedIcon from './icons/CopiedIcon';
import CopyIcon from './icons/CopyIcon';

interface RecapSlide4Props {
  title?: string;
  opacity?: number;
  delay?: number;
}

const RecapSlide4: React.FC<RecapSlide4Props> = ({
  title = 'Get Started with IOTA',
  opacity = 100,
  delay = 0.3,
}) => {
  const containerStyle = {
    opacity: opacity / 100,
    transform: `translateX(${opacity === 100 ? 0 : 4}px)`,
    transitionDelay: `${delay}s`,
    transition: `opacity 0.8s ease-out, transform 0.8s ease-out`,
  };

  const resourceCards = [
    {
      title: 'Developer Documentation',
      description: 'Get started building on IOTA today',
      image: '/assets/recap/docs.webp',
      url: 'https://docs.iota.org',
    },
    {
      title: 'IOTA Grants',
      description: 'Apply for a grant from iotalabs and turn your wildest dApp dreams into reality',
      image: '/assets/recap/grants.webp',
      url: 'https://www.iotalabs.io/grants',
    },
  ];

  const businessCard = {
    title: 'IOTA Business Innovation Program',
    description: 'We invite innovators to showcase real-world impact with IOTA',
    image: '/assets/recap/bip.webp',
    url: 'https://www.iota.org/build/business-innovation-program',
  };

  return (
    <div
      className='mx-auto max-h-full max-w-6xl overflow-y-auto p-6 md:p-12'
      style={containerStyle}
    >
      <div className='flex flex-col gap-4'>
        <div className='text-center'>
          <div className='mb-8 text-xl font-medium tracking-[-0.56px] text-gray-900 md:text-2xl lg:text-3xl'>
            <p className='leading-[1.2]'>{title}</p>
          </div>
        </div>

        {/* Top 2 resource cards in grid */}
        <div className='grid grid-cols-2 gap-4'>
          {resourceCards.map((card, index) => (
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
            title={businessCard.title}
            description={businessCard.description}
            image={businessCard.image}
            alt={businessCard.title}
            url={businessCard.url}
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
        <Contact />
      </div>
    </div>
  );
};

function Contact() {
  const email = 'partnerships@iota.org';
  const [copied, setCopied] = React.useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(email);
      setCopied(true);
      setTimeout(() => setCopied(false), 600);
    } catch (err) {
      console.error('Failed to copy email:', err);
    }
  };
  return (
    <div className='flex flex-col gap-4 md:flex-row md:items-center md:justify-between'>
      <div className='flex w-full flex-col gap-4 rounded-3xl border border-gray-200 bg-gradient-to-br from-white/80 to-white/70 p-4 backdrop-blur-sm md:flex-row md:items-center md:justify-between md:p-6'>
        <div className='text-center md:text-left'>
          <h4 className='text-xl font-semibold text-gray-900 md:text-2xl'>Contact us</h4>
        </div>
        <div className='flex items-center gap-3 self-center rounded-2xl border border-gray-200 bg-white px-4 py-3 md:gap-4 md:self-auto md:px-6 md:py-4'>
          <div className='flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-lg bg-blue-100 md:h-8 md:w-8'>
            <WebIcon />
          </div>
          <div className='flex min-w-0 flex-col'>
            <span className='mb-1 text-xs text-gray-500'>Email Address</span>
            <a
              className='truncate text-sm font-medium text-gray-900 transition-colors hover:text-blue-600 md:text-base'
              href='mailto://partnerships@iota.org'
            >
              {email}
            </a>
          </div>
          <button
            className='flex h-6 w-6 flex-shrink-0 cursor-pointer items-center justify-center rounded-lg bg-gray-100 transition-colors hover:bg-gray-200 md:h-8 md:w-8'
            title='Copy email address'
            onClick={handleCopy}
          >
            {copied ? <CopiedIcon /> : <CopyIcon />}
          </button>
        </div>
      </div>
    </div>
  );
}

export default RecapSlide4;
