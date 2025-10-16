'use client';

import React from 'react';
import Link from 'next/link';
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
          image="/assets/intro/desktop.webp"
          alt="Desktop"
          title="Desktop"
          description={(
            <>
              <Link
                className='inline italic text-blue-700'
                target='_blank'
                href={"https://chromewebstore.google.com/detail/iota-wallet/iidjkmdceolghepehaaddojmnjnkkija"}>
                {"Install IOTA Browser Wallet"}
                {" "}
                <svg className='inline align-baseline' xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M15 3h6v6" /><path d="M10 14 21 3" /><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" /></svg>
              </Link>
              {" "}
              {"and connect when prompted."}
              <br />
              {"Please make sure you are connected to the IOTA testnet."}
            </>
          )}
          opacity={100}
          translateY={0}
          delay={0.25}
        />

        <ClientCard
          image="/assets/intro/mobile.webp"
          alt="Mobile"
          title="Mobile"
          description={(
            <>
              {"Install Nightly Wallet ("}
              <Link
                className='inline italic text-blue-700'
                target='_blank'
                href={"https://apps.apple.com/es/app/nightly-multichain-wallet/id6444768157"}>
                {"iOS"}
                {" "}
                <svg className='inline align-baseline' xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M15 3h6v6" /><path d="M10 14 21 3" /><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" /></svg>
              </Link>
              {" | "}
              <Link
                className='inline italic text-blue-700'
                target='_blank'
                href={"https://play.google.com/store/apps/details?id=com.nightlymobile&pcampaignid=web_share"}>
                {"Android"}
                {" "}
                <svg className='inline align-baseline' xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M15 3h6v6" /><path d="M10 14 21 3" /><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" /></svg>
              </Link>
              {") and connect when prompted."}
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
            <h4 className="text-base md:text-xl">Both wallets enable secure interaction with this demo without requiring any token balance.</h4>
          </div>
        </NoticeCard>
      </FeaturesGrid>
    </div>
  );
};

export default IntroSlide11;
