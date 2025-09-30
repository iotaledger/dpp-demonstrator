'use client';

import React from 'react';
import SlideTitle from './SlideTitle';
import SlideDescription from './SlideDescription';
import FeaturesGrid from './FeaturesGrid';
import ClientCard from './ClientCard';
import NoticeCard from './NoticeCard';

const IntroSlide11: React.FC = () => {
  return (
    <div className="flex flex-col items-center md:px-0 w-full mx-auto max-w-6xl py-6 sm:py-0">
      <div className="flex flex-col items-center mb-8 max-w-3xl pt-6 md:pt-0">
        <SlideTitle size="large">Prepare your Wallet</SlideTitle>
        <SlideDescription margin='mb-2' width='max-w-4xl'>
          {"Choose your setup:"}
        </SlideDescription>
      </div>

      <FeaturesGrid columns="sm:grid-cols-2" width="max-w-6xl" gap="gap-10">
        <ClientCard
          image="/assets/intro/desktop.png"
          alt="Desktop"
          title="Desktop"
          description={(
            <>
              {"Install IOTA Browser Wallet and connect when prompted."}
              <br />
              {"Please make sure you are connected to the IOTA testnet."}
            </>
          )}
          opacity={100}
          translateY={0}
          delay={0.25}
        />

        <ClientCard
          image="/assets/intro/mobile.png"
          alt="Mobile"
          title="Mobile"
          description={(
            <>
              {"Install Nightly Wallet (iOS/Android) and connect when prompted."}
              <br />
              {"Please make sure you are connected to the IOTA testnet."}
            </>
          )}
          opacity={100}
          translateY={0}
          delay={0.35}
        />

        <NoticeCard
          background="bg-[#ADCEFF]"
          colSpan="col-span-1 sm:col-span-2"
          delay={0.55}
          opacity={100}
          translateY={0}
        >
          <div className="text-black/80">
            <h4 className="text-sm md:text-sm">Both wallets enable secure interaction with this demo without requiring any token balance.</h4>
          </div>
        </NoticeCard>
      </FeaturesGrid>
    </div>
  );
};

export default IntroSlide11;
