'use client';

import React from 'react';

import { RECAP_SLIDE_3 } from '@/contents/recap';

interface RecapSlide3Props {
  title?: string;
  description?: string;
  opacity?: number;
  delay?: number;
}

const RecapSlide3: React.FC<RecapSlide3Props> = ({ opacity = 100, delay = 0.3 }) => {
  const containerStyle = {
    opacity: opacity / 100,
    transform: `scale(${opacity === 100 ? 1 : 0.95})`,
    transitionDelay: `${delay}s`,
    transition: `opacity 0.8s ease-out, transform 0.8s ease-out`,
  };

  return (
    <div
      className='mx-auto max-h-full max-w-7xl overflow-y-auto p-6 md:p-12'
      style={containerStyle}
    >
      <div className='flex flex-col gap-4'>
        <div className='text-center'>
          <div className='mb-4 text-xl font-medium tracking-[-0.56px] text-gray-900 md:text-2xl lg:text-3xl'>
            <p className='leading-[1.2]'>{RECAP_SLIDE_3.title}</p>
          </div>
          <div className='mx-auto mb-4 max-w-xl text-base tracking-[0.1px] text-gray-600 md:text-lg'>
            <p className='leading-[1.6]'>{RECAP_SLIDE_3.description}</p>
          </div>
        </div>
        {/** Vida */}
        <div className='w-full'>
          <div className='grid grid-cols-2 grid-rows-2 gap-4 sm:grid sm:grid-cols-4'>
            <div className='col-span-2 col-start-1 row-start-1 translate-y-0 translate-y-4 opacity-0 opacity-100 transition-all delay-300 duration-700 ease-out sm:col-span-1 sm:row-span-2'>
              <div
                className='relative h-full cursor-pointer overflow-hidden rounded-3xl border border-gray-200 bg-white/70 p-6 backdrop-blur-sm transition-shadow select-none hover:shadow-md md:p-8'
                style={{
                  backgroundImage: 'if(media(width > 64rem): url(/assets/recap/bip.webp);)',
                  backgroundSize: 'contain',
                  backgroundRepeat: 'no-repeat',
                  backgroundPosition: 'center 130%',
                }}
              >
                <a target='_blank' className='block h-full' href=''>
                  <div className='relative z-10 flex h-full flex-col justify-start'>
                    <div className='max-w-[65%] text-left md:max-w-[90%]'>
                      <h4 className='mb-1 text-xs text-blue-700 md:mb-2 md:text-sm'>
                        {RECAP_SLIDE_3.trustFramework.title}
                      </h4>
                      <p className='text-sm leading-relaxed font-medium text-gray-800 md:text-base'>
                        {RECAP_SLIDE_3.trustFramework.description}
                      </p>
                    </div>
                  </div>
                </a>
              </div>
            </div>
            {RECAP_SLIDE_3.trustFrameworkProducts.map(({ title, description, icon, link }) => (
              <CardIcon
                key={title}
                title={title}
                description={description}
                icon={icon}
                link={link}
                variation='default'
              />
            ))}
          </div>
        </div>
        {/** Longa */}
        <div className='w-full'>
          <div className='grid grid-cols-2 gap-4 pb-8 sm:grid sm:grid-cols-4 sm:pb-0'>
            {RECAP_SLIDE_3.servicesProducts.map(({ title, description, icon, link }) => (
              <CardIcon
                key={title}
                title={title}
                description={description}
                icon={icon}
                link={link}
                variation='gradient'
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

function CardIcon({
  title,
  description,
  icon,
  link,
  variation = 'default',
}: {
  title: string;
  description: string;
  icon: string;
  link: string;
  variation: 'default' | 'gradient';
}) {
  const defaultStyle =
    'h-full bg-white/70 backdrop-blur-sm rounded-3xl border border-gray-200 hover:shadow-md transition-shadow cursor-pointer overflow-hidden select-none';
  const gradientStyle =
    'h-full bg-gradient-to-br from-blue-50/70 to-blue-100/70 backdrop-blur-sm rounded-3xl border border-gray-200 hover:shadow-md transition-shadow cursor-pointer overflow-hidden select-none';

  const getVariationStyle = () => {
    if (variation === 'gradient') {
      return gradientStyle;
    }

    return defaultStyle;
  };

  return (
    <div className='col-span-1 translate-y-0 translate-y-4 opacity-0 opacity-100 transition-all delay-500 duration-700 ease-out'>
      <div className={getVariationStyle()}>
        <a target='_blank' className='block h-full' href={link}>
          <div className='flex h-full flex-col p-4'>
            <div className='mb-4 h-8 w-8 md:h-10 md:w-10'>
              <img className='h-full w-full object-contain' src={icon} alt={title} />
            </div>
            <div className='flex-1'>
              <h4 className='mb-1 text-sm font-medium text-gray-900 md:text-base'>{title}</h4>
              <p className='text-xs text-gray-600 md:text-sm'>{description}</p>
            </div>
          </div>
        </a>
      </div>
    </div>
  );
}

export default RecapSlide3;
